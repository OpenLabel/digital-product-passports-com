import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export interface CustomIngredient {
  id: string;
  name: string;
  eNumber?: string;
  isAllergen?: boolean;
  isCustom: true;
}

interface CustomIngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (ingredient: CustomIngredient) => void;
}

export function CustomIngredientDialog({
  open,
  onOpenChange,
  onAdd,
}: CustomIngredientDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [eNumber, setENumber] = useState('');
  const [isAllergen, setIsAllergen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const ingredient: CustomIngredient = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      eNumber: eNumber.trim() || undefined,
      isAllergen,
      isCustom: true,
    };

    onAdd(ingredient);
    setName('');
    setENumber('');
    setIsAllergen(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('customIngredient.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-name">{t('customIngredient.ingredientName')} *</Label>
            <Input
              id="custom-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('customIngredient.ingredientPlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-enumber">{t('customIngredient.eNumber')}</Label>
            <Input
              id="custom-enumber"
              value={eNumber}
              onChange={(e) => setENumber(e.target.value)}
              placeholder={t('customIngredient.eNumberPlaceholder')}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="custom-allergen"
              checked={isAllergen}
              onCheckedChange={(checked) => setIsAllergen(checked === true)}
            />
            <Label htmlFor="custom-allergen" className="font-normal cursor-pointer">
              {t('customIngredient.isAllergen')}
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {t('customIngredient.addButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
