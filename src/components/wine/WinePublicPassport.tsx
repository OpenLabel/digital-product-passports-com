import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
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
  isPreview?: boolean;
}

export function WinePublicPassport({ passport, isPreview = false }: WinePublicPassportProps) {
  const { t } = useTranslation();
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


  // Nutritional values

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

  // Counterfeit protection
  const counterfeitProtectionEnabled = categoryData.counterfeit_protection_enabled === true;

  const allergenIngredients = ingredients.filter((i) => i.isAllergen);
  const regularIngredients = ingredients.filter((i) => !i.isAllergen);

  const hasNutritionalInfo = energyKcal || energyKj || carbohydrates !== undefined || sugar !== undefined;
  const hasRecyclingInfo = recyclingComponents.length > 0;
  const hasProducerInfo = producerName || bottlerInfo || country;

  // Translate ingredient name - uses translation if available, otherwise falls back to stored name
  const translateIngredient = (ingredient: SelectedIngredient): string => {
    const translationKey = `ingredients.${ingredient.id}`;
    const translated = t(translationKey);
    // If translation key is returned (no translation found), use the stored name
    return translated === translationKey ? ingredient.name : translated;
  };

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
      {/* Language Switcher - Top Right */}
      <div className="container mx-auto px-4 pt-4 max-w-lg">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-lg">
        {/* Header with Product Name and Image */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4" data-testid="passport-name">{passport.name}</h1>
          
          {/* Check Authenticity Button */}
          {counterfeitProtectionEnabled && (
            isPreview ? (
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium cursor-default">
                <ShieldCheck className="h-4 w-4" />
                {t('passport.checkAuthenticity')}
              </div>
            ) : (
              <a
                href="https://app.cypheme.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                {t('passport.checkAuthenticity')}
              </a>
            )
          )}
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
                  <p className="text-muted-foreground">{t('wine.volume')}</p>
                  <p className="font-medium">{volume} {volumeUnit}</p>
                </div>
              )}
              {grapeVariety && (
                <div>
                  <p className="text-muted-foreground">{t('wine.grapeVariety')}</p>
                  <p className="font-medium">{grapeVariety}</p>
                </div>
              )}
              {vintage && (
                <div>
                  <p className="text-muted-foreground">{t('wine.vintage')}</p>
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
              <p className="text-muted-foreground">{t('wine.alcohol')}</p>
              <p className="font-medium">{alcoholPercent}% vol</p>
            </div>
          )}
          {showResidualSugar && residualSugar !== undefined && (
            <div>
              <p className="text-muted-foreground">{t('wine.residualSugar')}</p>
              <p className="font-medium">{residualSugar} g/l</p>
            </div>
          )}
          {showTotalAcidity && totalAcidity !== undefined && (
            <div>
              <p className="text-muted-foreground">{t('wine.acidity')}</p>
              <p className="font-medium">{totalAcidity} g/l</p>
            </div>
          )}
          {country && (
            <div>
              <p className="text-muted-foreground">{t('wine.country')}</p>
              <p className="font-medium">{country}</p>
            </div>
          )}
          {region && (
            <div>
              <p className="text-muted-foreground">{t('wine.region')}</p>
              <p className="font-medium">{region}</p>
            </div>
          )}
          {denomination && (
            <div>
              <p className="text-muted-foreground">{t('wine.denomination')}</p>
              <p className="font-medium">{denomination}</p>
            </div>
          )}
          {sugarClassification && (
            <div>
              <p className="text-muted-foreground">{t('wine.sugarClassification')}</p>
              <p className="font-medium">{sugarClassification}</p>
            </div>
          )}
        </div>


        {/* Nutritional Values - EU Regulation 1169/2011 compliant format */}
        {hasNutritionalInfo && (
          <section className="mb-6" data-testid="nutritional-section">
            <h2 className="text-xl font-semibold mb-3">{t('wine.nutritionalValues')}</h2>
            
            {/* EU mandates tabular format with values per 100ml */}
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-foreground/20">
                  <th className="text-left py-2 font-medium"></th>
                  <th className="text-right py-2 font-medium">{t('wine.per100ml')}</th>
                </tr>
              </thead>
              <tbody>
                {/* EU Order: Energy first (mandatory kJ, optional kcal) */}
                <tr className="border-b border-foreground/10">
                  <td className="py-2 font-medium">{t('wine.energy')}</td>
                  <td className="py-2 text-right">
                    {energyKj !== undefined ? `${energyKj} kJ` : '0 kJ'}
                    {' / '}
                    {energyKcal !== undefined ? `${energyKcal} kcal` : '0 kcal'}
                  </td>
                </tr>
                
                {/* Fat - only show if non-zero, otherwise covered by negligible notice */}
                {(fat !== undefined && fat > 0) ? (
                  <tr className="border-b border-foreground/10">
                    <td className="py-2">{t('wine.fat')}</td>
                    <td className="py-2 text-right">{fat} g</td>
                  </tr>
                ) : null}
                
                {/* of which saturated fat - only show if non-zero */}
                {(saturatedFat !== undefined && saturatedFat > 0) ? (
                  <tr className="border-b border-foreground/10">
                    <td className="py-2 pl-4 text-muted-foreground">{t('wine.saturatedFat')}</td>
                    <td className="py-2 text-right">{saturatedFat} g</td>
                  </tr>
                ) : null}
                
                {/* Carbohydrate - always show as it's calculated from sugar */}
                <tr className="border-b border-foreground/10">
                  <td className="py-2">{t('wine.carbohydrate')}</td>
                  <td className="py-2 text-right">{carbohydrates !== undefined ? `${carbohydrates} g` : '0 g'}</td>
                </tr>
                
                {/* of which sugars (indented) - always show */}
                <tr className="border-b border-foreground/10">
                  <td className="py-2 pl-4 text-muted-foreground">{t('wine.sugars')}</td>
                  <td className="py-2 text-right">{sugar !== undefined ? `${sugar} g` : '0 g'}</td>
                </tr>
                
                {/* Protein - only show if non-zero */}
                {(proteins !== undefined && proteins > 0) ? (
                  <tr className="border-b border-foreground/10">
                    <td className="py-2">{t('wine.protein')}</td>
                    <td className="py-2 text-right">{proteins} g</td>
                  </tr>
                ) : null}
                
                {/* Salt - only show if non-zero */}
                {(salt !== undefined && salt > 0) ? (
                  <tr className="border-b border-foreground/10">
                    <td className="py-2">{t('wine.salt')}</td>
                    <td className="py-2 text-right">{salt} g</td>
                  </tr>
                ) : null}
              </tbody>
            </table>

            {/* Negligible amounts notice - shown when fat, saturated fat, protein, salt are all 0 or undefined */}
            {(fat === 0 || fat === undefined) && 
             (saturatedFat === 0 || saturatedFat === undefined) && 
             (proteins === 0 || proteins === undefined) && 
             (salt === 0 || salt === undefined) && (
              <p className="text-xs text-muted-foreground mt-2 italic">
                {t('wine.negligibleAmounts')}
              </p>
            )}
          </section>
        )}

        {/* Ingredients */}
        {ingredients.length > 0 && (
          <section className="mb-6" data-testid="ingredients-section">
            <h2 className="text-xl font-semibold mb-3">{t('wine.ingredients')}</h2>
            <p className="text-sm" data-testid="ingredients-list">
              {regularIngredients.map((i) => translateIngredient(i)).join(', ')}
              {allergenIngredients.length > 0 && regularIngredients.length > 0 && ', '}
              {allergenIngredients.length > 0 && (
                <strong>{allergenIngredients.map((i) => translateIngredient(i)).join(', ')}</strong>
              )}
            </p>
          </section>
        )}

        {/* Recycling Information */}
        {hasRecyclingInfo && (
          <section className="mb-6" data-testid="recycling-section">
            <h2 className="text-xl font-semibold mb-3">{t('wine.recycling')}</h2>
            
            {recyclingComponents.length > 0 && (
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
                      <td className="py-2 text-muted-foreground">{t('recycling.code')}</td>
                      {uniqueComponentTypes.map(([type]) => {
                        const comp = recyclingComponents.find(c => c.type === type);
                        return (
                          <td key={type} className="py-2 text-center">{comp?.compositionCode || '-'}</td>
                        );
                      })}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">{t('recycling.material')}</td>
                      {uniqueComponentTypes.map(([type]) => {
                        const comp = recyclingComponents.find(c => c.type === type);
                        return (
                          <td key={type} className="py-2 text-center">{comp?.compositionName || '-'}</td>
                        );
                      })}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-muted-foreground">{t('recycling.disposal')}</td>
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
                  {t('wine.recyclingNote')}
                </p>
              </>
            )}
          </section>
        )}

        {/* Legal Mentions / Producer Info */}
        {hasProducerInfo && (
          <section className="mb-6" data-testid="producer-section">
            <h2 className="text-xl font-semibold mb-3">{t('wine.legalInfo')}</h2>
            <div className="text-sm space-y-1">
              {producerName && <p>{producerName}</p>}
              {bottlerInfo && <p className="whitespace-pre-wrap">{bottlerInfo}</p>}
              {country && !producerName && !bottlerInfo && <p>{country}</p>}
            </div>
          </section>
        )}

        {/* Promotional Footer */}
        {!categoryData.hide_promo && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
            <p className="text-sm text-foreground">
              {t('passport.poweredBy')}{' '}
              <a 
                href="https://www.digital-product-passports.com"
                className="text-primary font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Digital <span className="text-muted-foreground/60 font-normal">-</span> Product <span className="text-muted-foreground/60 font-normal">-</span> Passports <span className="text-muted-foreground font-normal">.com</span>
              </a>
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground py-4 border-t">
          {isPreview ? (
            <span className="underline">{t('legal.legalMentions')}</span>
          ) : (
            <Link to="/legal" className="underline hover:text-foreground">
              {t('legal.legalMentions')}
            </Link>
          )}
        </footer>
      </main>
    </div>
  );
}

// Export field keys for testing - these are the ONLY fields that should be saved/displayed
export const WINE_PASSPORT_FIELDS = {
  productInfo: ['volume', 'volume_unit', 'grape_variety', 'vintage', 'country', 'region', 'denomination', 'sugar_classification'],
  producer: ['producer_name', 'bottler_info'],
  nutritional: ['alcohol_percent', 'energy_kcal', 'energy_kj', 'carbohydrates', 'sugar', 'residual_sugar', 'total_acidity', 'glycerine', 'fat', 'saturated_fat', 'proteins', 'salt'],
  manualOverrides: ['energy_kcal_manual', 'energy_kj_manual', 'carbohydrates_manual', 'sugar_manual'],
  displayOptions: ['show_alcohol_on_label', 'show_residual_sugar_on_label', 'show_total_acidity_on_label'],
  ingredients: ['ingredients'],
  recycling: ['recycling_components'],
} as const;
