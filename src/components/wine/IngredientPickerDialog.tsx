import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { wineIngredientCategories, WineIngredient } from '@/data/wineIngredients';

interface IngredientPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onApply: (selectedIds: string[]) => void;
}

export function IngredientPickerDialog({
  open,
  onOpenChange,
  selectedIds,
  onApply,
}: IngredientPickerDialogProps) {
  const [search, setSearch] = useState('');
  const [tempSelected, setTempSelected] = useState<string[]>(selectedIds);

  // Reset temp selection when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setTempSelected(selectedIds);
      setSearch('');
    }
    onOpenChange(isOpen);
  };

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return wineIngredientCategories;

    const searchLower = search.toLowerCase();
    return wineIngredientCategories
      .map((category) => ({
        ...category,
        ingredients: category.ingredients.filter(
          (ing) =>
            ing.name.toLowerCase().includes(searchLower) ||
            ing.eNumber?.toLowerCase().includes(searchLower)
        ),
      }))
      .filter((category) => category.ingredients.length > 0);
  }, [search]);

  const toggleIngredient = (id: string) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApply(tempSelected);
    onOpenChange(false);
  };

  const renderIngredient = (ingredient: WineIngredient) => (
    <div key={ingredient.id} className="py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <label
            htmlFor={`ing-${ingredient.id}`}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className={ingredient.isAllergen ? 'font-semibold' : ''}>
              {ingredient.name}
            </span>
            {ingredient.eNumber && (
              <span className="text-muted-foreground">({ingredient.eNumber})</span>
            )}
          </label>
          {ingredient.note && (
            <p className="text-xs text-muted-foreground mt-1 ml-0">{ingredient.note}</p>
          )}
        </div>
        <Checkbox
          id={`ing-${ingredient.id}`}
          checked={tempSelected.includes(ingredient.id)}
          onCheckedChange={() => toggleIngredient(ingredient.id)}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select wine ingredients from list</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <ScrollArea className="flex-1 min-h-0 -mx-6 px-6">
          <div className="space-y-4 pb-4">
            {filteredCategories.map((category) => (
              <div key={category.id}>
                <h3 className="text-base font-medium text-muted-foreground mb-2">
                  {category.name}
                </h3>
                <div className="space-y-1 ml-2">
                  {category.ingredients.map(renderIngredient)}
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No ingredients found matching "{search}"
              </p>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
