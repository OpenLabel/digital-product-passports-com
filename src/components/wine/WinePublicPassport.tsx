import { useMemo } from 'react';

// Certification logos
import pdoLogo from '@/assets/certifications/pdo-logo.jpg';
import pgiLogo from '@/assets/certifications/pgi-logo.jpg';
import euOrganicLogo from '@/assets/certifications/eu-organic-logo.jpg';
import demeterLogo from '@/assets/certifications/demeter-logo.png';

interface WinePassportData {
  name: string;
  image_url: string | null;
  description: string | null;
  category_data: Record<string, unknown>;
  updated_at: string;
}

interface SelectedIngredient {
  id: string;
  name: string;
  isAllergen?: boolean;
}

interface RecyclingComponent {
  id: string;
  type: string;
  typeName: string;
  composition: string;
  compositionName: string;
  compositionCode: string;
  disposal: string;
  disposalName: string;
}

interface WinePublicPassportProps {
  passport: WinePassportData;
}

export function WinePublicPassport({ passport }: WinePublicPassportProps) {
  const categoryData = (passport.category_data || {}) as Record<string, unknown>;

  // Product info
  const volume = categoryData.volume as number | undefined;
  const volumeUnit = (categoryData.volume_unit as string) || 'ml';
  const grapeVariety = categoryData.grape_variety as string | undefined;
  const vintage = categoryData.vintage as string | undefined;
  const country = categoryData.country as string | undefined;
  const region = categoryData.region as string | undefined;
  const denomination = categoryData.denomination as string | undefined;
  const sugarClassification = categoryData.sugar_classification as string | undefined;

  // Producer info
  const producerName = categoryData.producer_name as string | undefined;
  const bottlerInfo = categoryData.bottler_info as string | undefined;

  // Certifications
  const hasPdo = categoryData.has_pdo as boolean | undefined;
  const hasPgi = categoryData.has_pgi as boolean | undefined;
  const isOrganicEu = categoryData.is_organic_eu as boolean | undefined;
  const isBiodynamic = categoryData.is_biodynamic as boolean | undefined;
  const isHve = categoryData.is_hve as boolean | undefined;
  const isTerraVitis = categoryData.is_terra_vitis as boolean | undefined;

  // Nutritional values
  const alcoholPercent = categoryData.alcohol_percent as number | undefined;
  const residualSugar = categoryData.residual_sugar as number | undefined;
  const totalAcidity = categoryData.total_acidity as number | undefined;
  const energyKcal = categoryData.energy_kcal as number | undefined;
  const energyKj = categoryData.energy_kj as number | undefined;
  const carbohydrates = categoryData.carbohydrates as number | undefined;
  const sugar = categoryData.sugar as number | undefined;
  const fat = categoryData.fat as number | undefined;
  const saturatedFat = categoryData.saturated_fat as number | undefined;
  const proteins = categoryData.proteins as number | undefined;
  const salt = categoryData.salt as number | undefined;

  // Display options - these control visibility in product info section
  const showAlcohol = categoryData.show_alcohol_on_label === true;
  const showResidualSugar = categoryData.show_residual_sugar_on_label === true;
  const showTotalAcidity = categoryData.show_total_acidity_on_label === true;

  // Ingredients
  const ingredients = (categoryData.ingredients as SelectedIngredient[]) || [];

  // Recycling
  const recyclingComponents = (categoryData.recycling_components as RecyclingComponent[]) || [];
  const recyclingMode = categoryData.recycling_mode as string | undefined;
  const recyclingPdfUrl = categoryData.recycling_pdf_url as string | undefined;

  const allergenIngredients = ingredients.filter((i) => i.isAllergen);
  const regularIngredients = ingredients.filter((i) => !i.isAllergen);

  const hasCertifications = hasPdo || hasPgi || isOrganicEu || isBiodynamic || isHve || isTerraVitis;
  const hasNutritionalInfo = energyKcal || energyKj || carbohydrates !== undefined || sugar !== undefined;
  const hasRecyclingInfo = recyclingComponents.length > 0 || recyclingPdfUrl;
  const hasProducerInfo = producerName || bottlerInfo || country;


  // Get unique component types for recycling table columns
  const uniqueComponentTypes = useMemo(() => {
    const types = new Map<string, string>();
    recyclingComponents.forEach(c => {
      if (!types.has(c.type)) {
        types.set(c.type, c.typeName);
      }
    });
    return Array.from(types.entries());
  }, [recyclingComponents]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-lg">
        {/* Header with Product Name and Image */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4" data-testid="passport-name">{passport.name}</h1>
          
          <div className="flex gap-4">
            {/* Product Image */}
            {passport.image_url && (
              <img
                src={passport.image_url}
                alt={passport.name}
                className="w-24 h-36 object-contain"
                data-testid="product-image"
              />
            )}
            
            {/* Key Info */}
            <div className="flex-1 space-y-2 text-sm">
              {volume && (
                <div>
                  <p className="text-muted-foreground">Volume</p>
                  <p className="font-medium">{volume} {volumeUnit}</p>
                </div>
              )}
              {grapeVariety && (
                <div>
                  <p className="text-muted-foreground">Grape Variety</p>
                  <p className="font-medium">{grapeVariety}</p>
                </div>
              )}
              {vintage && (
                <div>
                  <p className="text-muted-foreground">Vintage</p>
                  <p className="font-medium">{vintage}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wine Attributes Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 text-sm">
          {showAlcohol && alcoholPercent !== undefined && (
            <div>
              <p className="text-muted-foreground">Alcohol</p>
              <p className="font-medium">{alcoholPercent}% vol</p>
            </div>
          )}
          {showResidualSugar && residualSugar !== undefined && (
            <div>
              <p className="text-muted-foreground">Residual Sugar</p>
              <p className="font-medium">{residualSugar} g/l</p>
            </div>
          )}
          {showTotalAcidity && totalAcidity !== undefined && (
            <div>
              <p className="text-muted-foreground">Acidity</p>
              <p className="font-medium">{totalAcidity} g/l</p>
            </div>
          )}
          {country && (
            <div>
              <p className="text-muted-foreground">Country</p>
              <p className="font-medium">{country}</p>
            </div>
          )}
          {region && (
            <div>
              <p className="text-muted-foreground">Region</p>
              <p className="font-medium">{region}</p>
            </div>
          )}
          {denomination && (
            <div>
              <p className="text-muted-foreground">Denomination</p>
              <p className="font-medium">{denomination}</p>
            </div>
          )}
          {sugarClassification && (
            <div>
              <p className="text-muted-foreground">Classification</p>
              <p className="font-medium">{sugarClassification}</p>
            </div>
          )}
        </div>

        {/* Certifications */}
        {hasCertifications && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              {hasPdo && (
                <img src={pdoLogo} alt="Protected Designation of Origin (PDO)" className="h-12 object-contain" />
              )}
              {hasPgi && (
                <img src={pgiLogo} alt="Protected Geographical Indication (PGI)" className="h-12 object-contain" />
              )}
              {isOrganicEu && (
                <img src={euOrganicLogo} alt="EU Organic" className="h-12 object-contain" />
              )}
              {isBiodynamic && (
                <img src={demeterLogo} alt="Demeter Biodynamic" className="h-12 object-contain" />
              )}
              {isHve && (
                <div className="flex items-center justify-center h-12 px-3 rounded-full bg-orange-500 text-white text-xs font-bold">
                  HVE
                </div>
              )}
              {isTerraVitis && (
                <div className="flex items-center justify-center h-12 px-3 rounded bg-teal-700 text-white text-xs font-bold">
                  Terra Vitis
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nutritional Values */}
        {hasNutritionalInfo && (
          <section className="mb-6" data-testid="nutritional-section">
            <h2 className="text-xl font-semibold mb-3">Nutritional Values</h2>
            
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2"></th>
                  <th className="text-right py-2 font-medium">100 ml</th>
                </tr>
              </thead>
              <tbody>
                {(energyKj || energyKcal) && (
                  <tr className="border-b">
                    <td className="py-2">Energy</td>
                    <td className="py-2 text-right">
                      {energyKj && <span>{energyKj} kJ</span>}
                      {energyKj && energyKcal && <span> / </span>}
                      {energyKcal && <span>{energyKcal} kcal</span>}
                    </td>
                  </tr>
                )}
                {fat !== undefined && fat > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Fat</td>
                    <td className="py-2 text-right">{fat} g</td>
                  </tr>
                )}
                {saturatedFat !== undefined && saturatedFat > 0 && (
                  <tr className="border-b">
                    <td className="py-2 pl-4 text-muted-foreground">· of which saturated</td>
                    <td className="py-2 text-right">{saturatedFat} g</td>
                  </tr>
                )}
                {carbohydrates !== undefined && (
                  <tr className="border-b">
                    <td className="py-2">Carbohydrates</td>
                    <td className="py-2 text-right">{carbohydrates} g</td>
                  </tr>
                )}
                {sugar !== undefined && (
                  <tr className="border-b">
                    <td className="py-2 pl-4 text-muted-foreground">· of which sugars</td>
                    <td className="py-2 text-right">{sugar} g</td>
                  </tr>
                )}
                {proteins !== undefined && proteins > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Proteins</td>
                    <td className="py-2 text-right">{proteins} g</td>
                  </tr>
                )}
                {salt !== undefined && salt > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Salt</td>
                    <td className="py-2 text-right">{salt} g</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Small quantities notice */}
            {(fat === 0 || fat === undefined) && 
             (saturatedFat === 0 || saturatedFat === undefined) && 
             (proteins === 0 || proteins === undefined) && 
             (salt === 0 || salt === undefined) && (
              <p className="text-xs text-muted-foreground mt-2">
                Contains small quantities of fat, saturated fatty acids, proteins, and salt.
              </p>
            )}
          </section>
        )}

        {/* Ingredients */}
        {ingredients.length > 0 && (
          <section className="mb-6" data-testid="ingredients-section">
            <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
            <p className="text-sm" data-testid="ingredients-list">
              {regularIngredients.map((i) => i.name).join(', ')}
              {allergenIngredients.length > 0 && regularIngredients.length > 0 && ', '}
              {allergenIngredients.length > 0 && (
                <strong>{allergenIngredients.map((i) => i.name).join(', ')}</strong>
              )}
            </p>
          </section>
        )}

        {/* Recycling Information */}
        {hasRecyclingInfo && (
          <section className="mb-6" data-testid="recycling-section">
            <h2 className="text-xl font-semibold mb-3">Recycling Information</h2>
            
            {recyclingMode === 'pdf' && recyclingPdfUrl && (
              <a 
                href={recyclingPdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline text-sm"
                data-testid="recycling-pdf-link"
              >
                View recycling instructions (PDF)
              </a>
            )}

            {(recyclingMode === 'manual' || !recyclingMode) && recyclingComponents.length > 0 && (
              <>
                <table className="w-full text-sm mb-3">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2"></th>
                      {uniqueComponentTypes.map(([type, typeName]) => (
                        <th key={type} className="text-center py-2 font-medium">{typeName}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Code</td>
                      {uniqueComponentTypes.map(([type]) => {
                        const comp = recyclingComponents.find(c => c.type === type);
                        return (
                          <td key={type} className="py-2 text-center">{comp?.compositionCode || '-'}</td>
                        );
                      })}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Material</td>
                      {uniqueComponentTypes.map(([type]) => {
                        const comp = recyclingComponents.find(c => c.type === type);
                        return (
                          <td key={type} className="py-2 text-center">{comp?.compositionName || '-'}</td>
                        );
                      })}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">Disposal</td>
                      {uniqueComponentTypes.map(([type]) => {
                        const comp = recyclingComponents.find(c => c.type === type);
                        return (
                          <td key={type} className="py-2 text-center">{comp?.disposalName || '-'}</td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground">
                  Check your local recycling guidelines. Separate components and dispose of them correctly.
                </p>
              </>
            )}
          </section>
        )}

        {/* Legal Mentions / Producer Info */}
        {hasProducerInfo && (
          <section className="mb-6" data-testid="producer-section">
            <h2 className="text-xl font-semibold mb-3">Legal Information</h2>
            <div className="text-sm space-y-1">
              {producerName && <p>{producerName}</p>}
              {bottlerInfo && <p className="whitespace-pre-wrap">{bottlerInfo}</p>}
              {country && !producerName && !bottlerInfo && <p>{country}</p>}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground py-4 border-t">
          <p>Digital Product Passport</p>
          <p>Last updated: {new Date(passport.updated_at).toLocaleDateString()}</p>
        </footer>
      </main>
    </div>
  );
}

// Export field keys for testing - these are the ONLY fields that should be saved/displayed
export const WINE_PASSPORT_FIELDS = {
  productInfo: ['volume', 'volume_unit', 'grape_variety', 'vintage', 'country', 'region', 'denomination', 'sugar_classification'],
  producer: ['producer_name', 'bottler_info'],
  certifications: ['has_pdo', 'has_pgi', 'is_organic_eu', 'is_biodynamic', 'is_hve', 'is_terra_vitis'],
  nutritional: ['alcohol_percent', 'energy_kcal', 'energy_kj', 'carbohydrates', 'sugar', 'residual_sugar', 'total_acidity', 'glycerine', 'fat', 'saturated_fat', 'proteins', 'salt'],
  manualOverrides: ['energy_kcal_manual', 'energy_kj_manual', 'carbohydrates_manual', 'sugar_manual'],
  displayOptions: ['show_alcohol_on_label', 'show_residual_sugar_on_label', 'show_total_acidity_on_label'],
  ingredients: ['ingredients'],
  recycling: ['recycling_components', 'recycling_pdf_url', 'recycling_mode'],
} as const;
