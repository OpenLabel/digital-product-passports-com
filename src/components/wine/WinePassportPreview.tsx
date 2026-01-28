import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getIngredientById } from '@/data/wineIngredients';

interface WinePassportPreviewProps {
  data: {
    name: string;
    image_url: string | null;
    category_data: Record<string, unknown>;
  };
}

interface SelectedIngredient {
  id: string;
  name: string;
  isAllergen?: boolean;
}

export function WinePassportPreview({ data }: WinePassportPreviewProps) {
  const categoryData = data.category_data || {};

  const volume = categoryData.volume as number;
  const volumeUnit = (categoryData.volume_unit as string) || 'ml';
  const grapeVariety = categoryData.grape_variety as string;
  const vintage = categoryData.vintage as string;
  const country = categoryData.country as string;
  const region = categoryData.region as string;
  const denomination = categoryData.denomination as string;
  const sugarClassification = categoryData.sugar_classification as string;
  const alcoholPercent = categoryData.alcohol_percent as number;
  const energyKcal = categoryData.energy_kcal as number;
  const energyKj = categoryData.energy_kj as number;
  const carbohydrates = categoryData.carbohydrates as number;
  const sugar = categoryData.sugar as number;
  const fat = categoryData.fat as number;
  const saturatedFat = categoryData.saturated_fat as number;
  const proteins = categoryData.proteins as number;
  const salt = categoryData.salt as number;
  const ingredients = (categoryData.ingredients as SelectedIngredient[]) || [];

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

  return (
    <div className="sticky top-8">
      <Card className="bg-background shadow-lg overflow-hidden max-w-[280px] mx-auto">
        {/* Phone frame styling */}
        <div className="bg-muted/50 p-2 flex justify-center">
          <div className="w-20 h-1 bg-muted-foreground/20 rounded-full" />
        </div>
        
        <CardContent className="p-4 space-y-4 text-sm max-h-[600px] overflow-y-auto">
          {/* Header */}
          <h2 className="font-bold text-lg leading-tight">{data.name || 'Product Name'}</h2>

          {/* Image + Quick Info */}
          <div className="flex gap-3">
            {data.image_url ? (
              <img
                src={data.image_url}
                alt={data.name}
                className="w-16 h-24 object-contain rounded"
              />
            ) : (
              <div className="w-16 h-24 bg-muted rounded flex items-center justify-center text-2xl">
                🍷
              </div>
            )}
            <div className="flex-1 space-y-1 text-xs">
              {volume && (
                <div>
                  <span className="text-muted-foreground">Volume</span>
                  <p className="font-medium">{volume} {volumeUnit}</p>
                </div>
              )}
              {grapeVariety && (
                <div>
                  <span className="text-muted-foreground">Grape</span>
                  <p className="font-medium">{grapeVariety}</p>
                </div>
              )}
              {vintage && (
                <div>
                  <span className="text-muted-foreground">Vintage</span>
                  <p className="font-medium">{vintage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Origin Info */}
          {(country || region || denomination || sugarClassification) && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              {country && (
                <div>
                  <span className="text-muted-foreground">Country</span>
                  <p className="font-medium">{country}</p>
                </div>
              )}
              {region && (
                <div>
                  <span className="text-muted-foreground">Region</span>
                  <p className="font-medium">{region}</p>
                </div>
              )}
              {denomination && (
                <div>
                  <span className="text-muted-foreground">Denomination</span>
                  <p className="font-medium">{denomination}</p>
                </div>
              )}
              {sugarClassification && (
                <div>
                  <span className="text-muted-foreground">Classification</span>
                  <p className="font-medium">{sugarClassification}</p>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Nutritional Values */}
          <div>
            <h3 className="font-semibold mb-2">Nutritional Values</h3>
            <p className="text-xs text-muted-foreground text-right mb-1">per 100 ml</p>
            
            <div className="space-y-1 text-xs">
              {alcoholPercent && (
                <div className="flex justify-between">
                  <span>Alcohol</span>
                  <span className="font-medium">{alcoholPercent}% vol</span>
                </div>
              )}
              {(energyKj || energyKcal) && (
                <div className="flex justify-between border-t pt-1">
                  <span>Energy</span>
                  <span className="font-medium">
                    {energyKj && `${energyKj} kJ`}
                    {energyKj && energyKcal && ' / '}
                    {energyKcal && `${energyKcal} kcal`}
                  </span>
                </div>
              )}
              {carbohydrates !== undefined && (
                <div className="flex justify-between">
                  <span>Carbohydrates</span>
                  <span className="font-medium">{carbohydrates} g</span>
                </div>
              )}
              {sugar !== undefined && (
                <div className="flex justify-between pl-2">
                  <span className="text-muted-foreground">of which sugars</span>
                  <span className="font-medium">{sugar} g</span>
                </div>
              )}

              {/* Small quantities - always grouped */}
              {!hasSmallQuantitiesWithValues && smallQuantitiesText && (
                <p className="text-xs text-muted-foreground pt-2 border-t">
                  Contains small quantities of: {smallQuantitiesText}
                </p>
              )}

              {hasSmallQuantitiesWithValues && (
                <>
                  {(fat !== undefined && fat > 0) && (
                    <div className="flex justify-between">
                      <span>Fat</span>
                      <span className="font-medium">{fat} g</span>
                    </div>
                  )}
                  {(saturatedFat !== undefined && saturatedFat > 0) && (
                    <div className="flex justify-between pl-2">
                      <span className="text-muted-foreground">of which saturated</span>
                      <span className="font-medium">{saturatedFat} g</span>
                    </div>
                  )}
                  {(proteins !== undefined && proteins > 0) && (
                    <div className="flex justify-between">
                      <span>Proteins</span>
                      <span className="font-medium">{proteins} g</span>
                    </div>
                  )}
                  {(salt !== undefined && salt > 0) && (
                    <div className="flex justify-between">
                      <span>Salt</span>
                      <span className="font-medium">{salt} g</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Ingredients */}
          {ingredients.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Ingredients</h3>
                <p className="text-xs">
                  {regularIngredients.map((i) => i.name).join(', ')}
                  {allergenIngredients.length > 0 && (
                    <>
                      {regularIngredients.length > 0 && ', '}
                      <strong>{allergenIngredients.map((i) => i.name).join(', ')}</strong>
                    </>
                  )}
                </p>
              </div>
            </>
          )}

          {/* Allergen Warning */}
          {allergenIngredients.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/30 p-2 rounded text-xs">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Contains: {allergenIngredients.map((a) => a.name).join(', ')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-center text-muted-foreground mt-2">Live Preview</p>
    </div>
  );
}
