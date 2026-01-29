import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  const glycerine = categoryData.glycerine as number | undefined;
  const energyKcal = categoryData.energy_kcal as number | undefined;
  const energyKj = categoryData.energy_kj as number | undefined;
  const carbohydrates = categoryData.carbohydrates as number | undefined;
  const sugar = categoryData.sugar as number | undefined;
  const fat = categoryData.fat as number | undefined;
  const saturatedFat = categoryData.saturated_fat as number | undefined;
  const proteins = categoryData.proteins as number | undefined;
  const salt = categoryData.salt as number | undefined;

  // Display options - using correct field names from WineFields
  const showAlcohol = categoryData.show_alcohol_on_label !== false;
  const showResidualSugar = categoryData.show_residual_sugar_on_label === true;
  const showTotalAcidity = categoryData.show_total_acidity_on_label === true;

  // Ingredients
  const ingredients = (categoryData.ingredients as SelectedIngredient[]) || [];

  // Recycling
  const recyclingComponents = (categoryData.recycling_components as RecyclingComponent[]) || [];
  const recyclingMode = categoryData.recycling_mode as string | undefined;
  const recyclingPdfUrl = categoryData.recycling_pdf_url as string | undefined;

  const hasSmallQuantitiesWithValues = useMemo(() => {
    return (fat || 0) > 0 || (saturatedFat || 0) > 0 || (proteins || 0) > 0 || (salt || 0) > 0;
  }, [fat, saturatedFat, proteins, salt]);

  const smallQuantitiesText = useMemo(() => {
    const items: string[] = [];
    if (!fat || fat === 0) items.push('fat');
    if (!saturatedFat || saturatedFat === 0) items.push('saturated fatty acids');
    if (!proteins || proteins === 0) items.push('proteins');
    if (!salt || salt === 0) items.push('salt');
    return items.join(', ');
  }, [fat, saturatedFat, proteins, salt]);

  const allergenIngredients = ingredients.filter((i) => i.isAllergen);
  const regularIngredients = ingredients.filter((i) => !i.isAllergen);

  const formatValue = (value: number | undefined, unit: string): string => {
    if (value === undefined) return '';
    return `${value} ${unit}`;
  };

  const hasProductInfo = volume || grapeVariety || vintage || country || region || denomination || sugarClassification;
  const hasProducerInfo = producerName || bottlerInfo;
  const hasCertifications = hasPdo || hasPgi || isOrganicEu || isBiodynamic || isHve || isTerraVitis;
  const hasNutritionalInfo = alcoholPercent || energyKcal || energyKj || carbohydrates !== undefined || sugar !== undefined;
  const hasRecyclingInfo = recyclingComponents.length > 0 || recyclingPdfUrl;

  // Build certification badges
  const certificationBadges: { label: string; variant: 'default' | 'secondary' | 'outline' }[] = [];
  if (hasPdo) certificationBadges.push({ label: 'PDO/AOP', variant: 'default' });
  if (hasPgi) certificationBadges.push({ label: 'PGI/IGP', variant: 'default' });
  if (isOrganicEu) certificationBadges.push({ label: '🌿 EU Organic', variant: 'secondary' });
  if (isBiodynamic) certificationBadges.push({ label: '🌙 Biodynamic', variant: 'secondary' });
  if (isHve) certificationBadges.push({ label: 'HVE', variant: 'outline' });
  if (isTerraVitis) certificationBadges.push({ label: 'Terra Vitis', variant: 'outline' });

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              🍷 Wine Product Passport
            </Badge>
            <h1 className="text-3xl font-bold mb-2" data-testid="passport-name">{passport.name}</h1>
          </div>

          {/* Product Image */}
          {passport.image_url && (
            <Card className="overflow-hidden">
              <img
                src={passport.image_url}
                alt={passport.name}
                className="w-full max-h-96 object-contain bg-background"
                data-testid="product-image"
              />
            </Card>
          )}


          {/* Product Information */}
          {hasProductInfo && (
            <Card data-testid="product-info-section">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {volume && (
                    <div data-testid="field-volume">
                      <dt className="text-muted-foreground text-sm">Volume</dt>
                      <dd className="font-medium">{volume} {volumeUnit}</dd>
                    </div>
                  )}
                  {grapeVariety && (
                    <div data-testid="field-grape-variety">
                      <dt className="text-muted-foreground text-sm">Grape Variety (Cépage)</dt>
                      <dd className="font-medium">{grapeVariety}</dd>
                    </div>
                  )}
                  {vintage && (
                    <div data-testid="field-vintage">
                      <dt className="text-muted-foreground text-sm">Vintage (Millésime)</dt>
                      <dd className="font-medium">{vintage}</dd>
                    </div>
                  )}
                  {country && (
                    <div data-testid="field-country">
                      <dt className="text-muted-foreground text-sm">Country of Origin</dt>
                      <dd className="font-medium">{country}</dd>
                    </div>
                  )}
                  {region && (
                    <div data-testid="field-region">
                      <dt className="text-muted-foreground text-sm">Region</dt>
                      <dd className="font-medium">{region}</dd>
                    </div>
                  )}
                  {denomination && (
                    <div data-testid="field-denomination">
                      <dt className="text-muted-foreground text-sm">Denomination</dt>
                      <dd className="font-medium">{denomination}</dd>
                    </div>
                  )}
                  {sugarClassification && (
                    <div data-testid="field-classification">
                      <dt className="text-muted-foreground text-sm">Classification</dt>
                      <dd className="font-medium">{sugarClassification}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Certifications & Labels */}
          {hasCertifications && (
            <Card data-testid="certifications-section">
              <CardHeader>
                <CardTitle>Certifications & Labels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {certificationBadges.map((cert, index) => (
                    <Badge key={index} variant={cert.variant} className="text-sm py-1 px-3">
                      {cert.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Producer Information */}
          {hasProducerInfo && (
            <Card data-testid="producer-section">
              <CardHeader>
                <CardTitle>Producer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {producerName && (
                  <div data-testid="field-producer-name">
                    <dt className="text-muted-foreground text-sm">Producer/Winery</dt>
                    <dd className="font-medium">{producerName}</dd>
                  </div>
                )}
                {bottlerInfo && (
                  <div data-testid="field-bottler-info">
                    <dt className="text-muted-foreground text-sm">Bottler</dt>
                    <dd className="font-medium whitespace-pre-wrap">{bottlerInfo}</dd>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Nutritional Values */}
          {hasNutritionalInfo && (
            <Card data-testid="nutritional-section">
              <CardHeader>
                <CardTitle>Nutritional Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Per 100 ml</p>
                
                <div className="space-y-2">
                  {showAlcohol && alcoholPercent !== undefined && (
                    <div className="flex justify-between py-1 border-b" data-testid="field-alcohol">
                      <span>Alcohol</span>
                      <span className="font-medium">{formatValue(alcoholPercent, '% vol')}</span>
                    </div>
                  )}
                  
                  {(energyKj || energyKcal) && (
                    <div className="flex justify-between py-1 border-b" data-testid="field-energy">
                      <span>Energy</span>
                      <span className="font-medium">
                        {energyKj && formatValue(energyKj, 'kJ')}
                        {energyKj && energyKcal && ' / '}
                        {energyKcal && formatValue(energyKcal, 'kcal')}
                      </span>
                    </div>
                  )}

                  {carbohydrates !== undefined && (
                    <div className="flex justify-between py-1 border-b" data-testid="field-carbohydrates">
                      <span>Carbohydrates</span>
                      <span className="font-medium">{formatValue(carbohydrates, 'g')}</span>
                    </div>
                  )}

                  {sugar !== undefined && (
                    <div className="flex justify-between py-1 border-b pl-4" data-testid="field-sugar">
                      <span className="text-muted-foreground">of which sugars</span>
                      <span className="font-medium">{formatValue(sugar, 'g')}</span>
                    </div>
                  )}

                  {showResidualSugar && residualSugar !== undefined && (
                    <div className="flex justify-between py-1 border-b" data-testid="field-residual-sugar">
                      <span>Residual Sugar</span>
                      <span className="font-medium">{formatValue(residualSugar, 'g/l')}</span>
                    </div>
                  )}

                  {showTotalAcidity && totalAcidity !== undefined && (
                    <div className="flex justify-between py-1 border-b" data-testid="field-total-acidity">
                      <span>Total Acidity</span>
                      <span className="font-medium">{formatValue(totalAcidity, 'g/l')}</span>
                    </div>
                  )}

                  {glycerine !== undefined && glycerine > 0 && (
                    <div className="flex justify-between py-1 border-b" data-testid="field-glycerine">
                      <span>Glycerine</span>
                      <span className="font-medium">{formatValue(glycerine, 'g/l')}</span>
                    </div>
                  )}

                  {/* Small quantities - always grouped */}
                  {!hasSmallQuantitiesWithValues && smallQuantitiesText && (
                    <p className="text-sm text-muted-foreground pt-2" data-testid="small-quantities-notice">
                      Contains small quantities of: {smallQuantitiesText}
                    </p>
                  )}

                  {hasSmallQuantitiesWithValues && (
                    <>
                      {fat !== undefined && fat > 0 && (
                        <div className="flex justify-between py-1 border-b" data-testid="field-fat">
                          <span>Fat</span>
                          <span className="font-medium">{formatValue(fat, 'g')}</span>
                        </div>
                      )}
                      {saturatedFat !== undefined && saturatedFat > 0 && (
                        <div className="flex justify-between py-1 border-b pl-4" data-testid="field-saturated-fat">
                          <span className="text-muted-foreground">of which saturated</span>
                          <span className="font-medium">{formatValue(saturatedFat, 'g')}</span>
                        </div>
                      )}
                      {proteins !== undefined && proteins > 0 && (
                        <div className="flex justify-between py-1 border-b" data-testid="field-proteins">
                          <span>Proteins</span>
                          <span className="font-medium">{formatValue(proteins, 'g')}</span>
                        </div>
                      )}
                      {salt !== undefined && salt > 0 && (
                        <div className="flex justify-between py-1 border-b" data-testid="field-salt">
                          <span>Salt</span>
                          <span className="font-medium">{formatValue(salt, 'g')}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ingredients */}
          {ingredients.length > 0 && (
            <Card data-testid="ingredients-section">
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm" data-testid="ingredients-list">
                  {regularIngredients.map((i) => i.name).join(', ')}
                  {allergenIngredients.length > 0 && (
                    <>
                      {regularIngredients.length > 0 && ', '}
                      <strong>{allergenIngredients.map((i) => i.name).join(', ')}</strong>
                    </>
                  )}
                </p>

                {/* Allergen Warning */}
                {allergenIngredients.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded mt-4" data-testid="allergen-warning">
                    <p className="font-medium text-amber-800 dark:text-amber-200">
                      ⚠️ Contains allergens: {allergenIngredients.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recycling Information */}
          {hasRecyclingInfo && (
            <Card data-testid="recycling-section">
              <CardHeader>
                <CardTitle>Recycling Information</CardTitle>
              </CardHeader>
              <CardContent>
                {recyclingMode === 'pdf' && recyclingPdfUrl && (
                  <a 
                    href={recyclingPdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary underline"
                    data-testid="recycling-pdf-link"
                  >
                    View recycling instructions (PDF)
                  </a>
                )}

                {(recyclingMode === 'manual' || !recyclingMode) && recyclingComponents.length > 0 && (
                  <div className="space-y-3" data-testid="recycling-components">
                    {recyclingComponents.map((component, index) => (
                      <div key={component.id || index} className="border rounded p-3" data-testid={`recycling-component-${index}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{component.typeName}</p>
                            <p className="text-sm text-muted-foreground">{component.compositionName}</p>
                          </div>
                          <Badge variant="outline">{component.compositionCode}</Badge>
                        </div>
                        {component.disposalName && (
                          <p className="text-sm mt-2">
                            <span className="text-muted-foreground">Disposal: </span>
                            {component.disposalName}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground py-8">
            <p>Digital Product Passport</p>
            <p>Last updated: {new Date(passport.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
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
