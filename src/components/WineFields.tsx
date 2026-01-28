import { useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { volumeUnits, wineCountries } from '@/templates/wine';
import { WineIngredients } from '@/components/wine/WineIngredients';

interface WineFieldsProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function WineFields({ data, onChange }: WineFieldsProps) {
  const handleChange = (id: string, value: unknown) => {
    onChange({ ...data, [id]: value });
  };

  // Calculate nutritional values
  const calculatedValues = useMemo(() => {
    const alcohol = Number(data.alcohol_percent) || 0;
    const residualSugar = Number(data.residual_sugar) || 0;
    const useManualGlycerine = data.glycerine_manual === true;
    const glycerine = useManualGlycerine 
      ? (Number(data.glycerine) || 0)
      : (alcohol * 0.1 * 10); // 10% of alcohol content, converted to g/L approximation

    // Energy calculation per 100ml
    // Alcohol: 7 kcal/g, density ~0.789 g/ml
    // Sugar: 4 kcal/g
    // Glycerine: 4 kcal/g
    const alcoholGrams = (alcohol / 100) * 100 * 0.789; // grams of alcohol per 100ml
    const sugarGrams = residualSugar / 10; // g/L to g/100ml
    const glycerineGrams = glycerine / 10; // g/L to g/100ml

    const energyKcal = Math.round(
      (alcoholGrams * 7) + (sugarGrams * 4) + (glycerineGrams * 4)
    );
    const energyKj = Math.round(energyKcal * 4.184);

    // Carbohydrates = residual sugar (simplified)
    const carbohydrates = sugarGrams;
    const sugar = sugarGrams;

    return {
      glycerine: useManualGlycerine ? (Number(data.glycerine) || 0) : Math.round(glycerine * 10) / 10,
      energyKcal: data.energy_kcal_manual ? Number(data.energy_kcal) : energyKcal,
      energyKj: data.energy_kj_manual ? Number(data.energy_kj) : energyKj,
      carbohydrates: data.carbohydrates_manual ? Number(data.carbohydrates) : Math.round(carbohydrates * 10) / 10,
      sugar: data.sugar_manual ? Number(data.sugar) : Math.round(sugar * 10) / 10,
    };
  }, [data]);

  // Update calculated values when dependencies change
  useEffect(() => {
    const updates: Record<string, unknown> = {};
    
    if (!data.glycerine_manual && data.glycerine !== calculatedValues.glycerine) {
      updates.glycerine = calculatedValues.glycerine;
    }
    if (!data.energy_kcal_manual && data.energy_kcal !== calculatedValues.energyKcal) {
      updates.energy_kcal = calculatedValues.energyKcal;
    }
    if (!data.energy_kj_manual && data.energy_kj !== calculatedValues.energyKj) {
      updates.energy_kj = calculatedValues.energyKj;
    }
    if (!data.carbohydrates_manual && data.carbohydrates !== calculatedValues.carbohydrates) {
      updates.carbohydrates = calculatedValues.carbohydrates;
    }
    if (!data.sugar_manual && data.sugar !== calculatedValues.sugar) {
      updates.sugar = calculatedValues.sugar;
    }

    if (Object.keys(updates).length > 0) {
      onChange({ ...data, ...updates });
    }
  }, [calculatedValues, data, onChange]);

  // Check if small quantities have non-zero values
  const hasNonZeroSmallQuantities = useMemo(() => {
    return (
      Number(data.fat) > 0 ||
      Number(data.saturated_fat) > 0 ||
      Number(data.proteins) > 0 ||
      Number(data.salt) > 0
    );
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Ingredients */}
      <WineIngredients data={data} onChange={onChange} />

      {/* Product Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Product Identity</CardTitle>
          <CardDescription>Basic wine product information</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="grape_variety">Grape Variety</Label>
            <Input
              id="grape_variety"
              value={(data.grape_variety as string) || ''}
              onChange={(e) => handleChange('grape_variety', e.target.value)}
              placeholder="e.g., Cabernet Sauvignon, Merlot"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vintage">Vintage</Label>
            <Input
              id="vintage"
              value={(data.vintage as string) || ''}
              onChange={(e) => handleChange('vintage', e.target.value)}
              placeholder="e.g., 2020, NV, Multi-vintage"
            />
          </div>

          <div className="space-y-2">
            <Label>Volume</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={(data.volume as number) || ''}
                onChange={(e) => handleChange('volume', e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g., 750"
                className="flex-1"
              />
              <Select
                value={(data.volume_unit as string) || 'ml'}
                onValueChange={(val) => handleChange('volume_unit', val)}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {volumeUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country of Origin</Label>
            <Select
              value={(data.country as string) || ''}
              onValueChange={(val) => handleChange('country', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {wineCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={(data.region as string) || ''}
              onChange={(e) => handleChange('region', e.target.value)}
              placeholder="e.g., Bordeaux, Burgundy, Champagne"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="denomination">Denomination</Label>
            <Input
              id="denomination"
              value={(data.denomination as string) || ''}
              onChange={(e) => handleChange('denomination', e.target.value)}
              placeholder="e.g., AOC, AOP, IGP"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="sugar_classification">Sugar Classification</Label>
            <Input
              id="sugar_classification"
              value={(data.sugar_classification as string) || ''}
              onChange={(e) => handleChange('sugar_classification', e.target.value)}
              placeholder="e.g., Brut, Sec, Demi-Sec, Doux"
            />
          </div>
        </CardContent>
      </Card>

      {/* Nutritional Values - Primary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Nutritional Values</CardTitle>
          <CardDescription>Required per EU Regulation 2021/2117</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="alcohol_percent">Alcohol (% Vol) *</Label>
              <Input
                id="alcohol_percent"
                type="number"
                step="0.1"
                value={(data.alcohol_percent as number) || ''}
                onChange={(e) => handleChange('alcohol_percent', e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g., 13.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="residual_sugar">Residual Sugar (g/L)</Label>
              <Input
                id="residual_sugar"
                type="number"
                step="0.1"
                value={(data.residual_sugar as number) || ''}
                onChange={(e) => handleChange('residual_sugar', e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g., 2.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_acidity">Total Acidity - C₄H₆O₆ (g/L)</Label>
              <Input
                id="total_acidity"
                type="number"
                step="0.1"
                value={(data.total_acidity as number) || ''}
                onChange={(e) => handleChange('total_acidity', e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g., 5.5"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  id="glycerine_manual"
                  checked={(data.glycerine_manual as boolean) || false}
                  onCheckedChange={(checked) => handleChange('glycerine_manual', checked)}
                />
                <Label htmlFor="glycerine_manual" className="text-sm font-normal cursor-pointer">
                  Manual glycerine value
                </Label>
              </div>
              {data.glycerine_manual && (
                <div className="space-y-2">
                  <Label htmlFor="glycerine">Glycerine (g/L)</Label>
                  <Input
                    id="glycerine"
                    type="number"
                    step="0.1"
                    value={(data.glycerine as number) || ''}
                    onChange={(e) => handleChange('glycerine', e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g., 8.5"
                  />
                </div>
              )}
              {!data.glycerine_manual && (
                <p className="text-xs text-muted-foreground">
                  Default: 10% of alcohol content ({calculatedValues.glycerine} g/L)
                </p>
              )}
            </div>
          </div>

          {/* Calculated values */}
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium mb-3">Calculated Values (per 100ml)</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="energy_kcal" className="text-sm">Energy (kcal)</Label>
                  <Checkbox
                    id="energy_kcal_manual"
                    checked={(data.energy_kcal_manual as boolean) || false}
                    onCheckedChange={(checked) => handleChange('energy_kcal_manual', checked)}
                  />
                </div>
                <Input
                  id="energy_kcal"
                  type="number"
                  value={calculatedValues.energyKcal}
                  onChange={(e) => handleChange('energy_kcal', e.target.value ? Number(e.target.value) : '')}
                  disabled={!data.energy_kcal_manual}
                  className={!data.energy_kcal_manual ? 'bg-muted' : ''}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="energy_kj" className="text-sm">Energy (kJ)</Label>
                  <Checkbox
                    id="energy_kj_manual"
                    checked={(data.energy_kj_manual as boolean) || false}
                    onCheckedChange={(checked) => handleChange('energy_kj_manual', checked)}
                  />
                </div>
                <Input
                  id="energy_kj"
                  type="number"
                  value={calculatedValues.energyKj}
                  onChange={(e) => handleChange('energy_kj', e.target.value ? Number(e.target.value) : '')}
                  disabled={!data.energy_kj_manual}
                  className={!data.energy_kj_manual ? 'bg-muted' : ''}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="carbohydrates" className="text-sm">Carbohydrates (g)</Label>
                  <Checkbox
                    id="carbohydrates_manual"
                    checked={(data.carbohydrates_manual as boolean) || false}
                    onCheckedChange={(checked) => handleChange('carbohydrates_manual', checked)}
                  />
                </div>
                <Input
                  id="carbohydrates"
                  type="number"
                  step="0.1"
                  value={calculatedValues.carbohydrates}
                  onChange={(e) => handleChange('carbohydrates', e.target.value ? Number(e.target.value) : '')}
                  disabled={!data.carbohydrates_manual}
                  className={!data.carbohydrates_manual ? 'bg-muted' : ''}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sugar" className="text-sm">Sugar (g)</Label>
                  <Checkbox
                    id="sugar_manual"
                    checked={(data.sugar_manual as boolean) || false}
                    onCheckedChange={(checked) => handleChange('sugar_manual', checked)}
                  />
                </div>
                <Input
                  id="sugar"
                  type="number"
                  step="0.1"
                  value={calculatedValues.sugar}
                  onChange={(e) => handleChange('sugar', e.target.value ? Number(e.target.value) : '')}
                  disabled={!data.sugar_manual}
                  className={!data.sugar_manual ? 'bg-muted' : ''}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Check the box next to a field to override the calculated value
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Checkbox
                id="show_exact_values"
                checked={(data.show_exact_values as boolean) || false}
                onCheckedChange={(checked) => handleChange('show_exact_values', checked)}
              />
              <Label htmlFor="show_exact_values" className="text-sm font-normal cursor-pointer">
                Show exact values without rounding
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Small Quantities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {hasNonZeroSmallQuantities ? 'Additional Nutritional Values' : 'Contains Small Quantities Of'}
          </CardTitle>
          <CardDescription>
            {hasNonZeroSmallQuantities 
              ? 'These values will be included in the nutritional declaration'
              : 'Values of 0 will be displayed as "Contains small quantities of..."'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                value={(data.fat as number) || 0}
                onChange={(e) => handleChange('fat', e.target.value ? Number(e.target.value) : 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="saturated_fat">Saturated Fatty Acids (g)</Label>
              <Input
                id="saturated_fat"
                type="number"
                step="0.1"
                value={(data.saturated_fat as number) || 0}
                onChange={(e) => handleChange('saturated_fat', e.target.value ? Number(e.target.value) : 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proteins">Proteins (g)</Label>
              <Input
                id="proteins"
                type="number"
                step="0.1"
                value={(data.proteins as number) || 0}
                onChange={(e) => handleChange('proteins', e.target.value ? Number(e.target.value) : 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salt">Salt (g)</Label>
              <Input
                id="salt"
                type="number"
                step="0.01"
                value={(data.salt as number) || 0}
                onChange={(e) => handleChange('salt', e.target.value ? Number(e.target.value) : 0)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="group_small_quantities"
              checked={(data.group_small_quantities as boolean) !== false}
              onCheckedChange={(checked) => handleChange('group_small_quantities', checked)}
            />
            <Label htmlFor="group_small_quantities" className="text-sm font-normal cursor-pointer">
              Group small quantities (display as "Contains small quantities of...")
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Electronic Label Display Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Electronic Label Display Options</CardTitle>
          <CardDescription>
            Choose which analysis data to show on the electronic label (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="show_alcohol_on_label"
                checked={(data.show_alcohol_on_label as boolean) || false}
                onCheckedChange={(checked) => handleChange('show_alcohol_on_label', checked)}
              />
              <Label htmlFor="show_alcohol_on_label" className="text-sm font-normal cursor-pointer">
                Alcohol
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="show_residual_sugar_on_label"
                checked={(data.show_residual_sugar_on_label as boolean) || false}
                onCheckedChange={(checked) => handleChange('show_residual_sugar_on_label', checked)}
              />
              <Label htmlFor="show_residual_sugar_on_label" className="text-sm font-normal cursor-pointer">
                Residual Sugar
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="show_total_acidity_on_label"
                checked={(data.show_total_acidity_on_label as boolean) || false}
                onCheckedChange={(checked) => handleChange('show_total_acidity_on_label', checked)}
              />
              <Label htmlFor="show_total_acidity_on_label" className="text-sm font-normal cursor-pointer">
                Total Acidity (C₄H₆O₆)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
