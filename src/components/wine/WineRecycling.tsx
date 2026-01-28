import { useState } from 'react';
import { Plus, X, Upload, Link as LinkIcon, FileEdit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  packagingMaterialTypes,
  getCompositionsByCategory,
  disposalMethods,
  PackagingMaterial,
  materialCompositions,
} from '@/data/wineRecycling';

interface WineRecyclingProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

type RecyclingMode = 'manual' | 'pdf' | 'website';

export function WineRecycling({ data, onChange }: WineRecyclingProps) {
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const [customTypeOpen, setCustomTypeOpen] = useState(false);
  const [customTypeName, setCustomTypeName] = useState('');

  const recyclingMode = (data.recycling_mode as RecyclingMode) || 'manual';
  const materials = (data.packaging_materials as PackagingMaterial[]) || [];
  const pdfUrl = (data.recycling_pdf_url as string) || '';
  const websiteUrl = (data.recycling_website_url as string) || '';

  const handleModeChange = (mode: RecyclingMode) => {
    onChange({ ...data, recycling_mode: mode });
  };

  const handleAddMaterial = (typeId: string, typeName: string, isCustom = false) => {
    const newMaterial: PackagingMaterial = {
      id: `mat_${Date.now()}`,
      typeId: isCustom ? 'custom' : typeId,
      typeName: isCustom ? typeName : typeName,
      isCustomType: isCustom,
      customTypeName: isCustom ? typeName : undefined,
    };
    onChange({
      ...data,
      packaging_materials: [...materials, newMaterial],
    });
    setAddMaterialOpen(false);
  };

  const handleAddCustomType = () => {
    if (customTypeName.trim()) {
      handleAddMaterial('custom', customTypeName.trim(), true);
      setCustomTypeName('');
      setCustomTypeOpen(false);
    }
  };

  const handleRemoveMaterial = (id: string) => {
    onChange({
      ...data,
      packaging_materials: materials.filter((m) => m.id !== id),
    });
  };

  const handleMaterialChange = (id: string, field: keyof PackagingMaterial, value: string) => {
    const composition = field === 'compositionId' 
      ? materialCompositions.find((c) => c.id === value)
      : null;
    const disposal = field === 'disposalMethodId'
      ? disposalMethods.find((d) => d.id === value)
      : null;

    onChange({
      ...data,
      packaging_materials: materials.map((m) =>
        m.id === id
          ? {
              ...m,
              [field]: value,
              ...(composition && {
                compositionName: composition.name,
                compositionCode: composition.code,
              }),
              ...(disposal && {
                disposalMethodName: disposal.name,
              }),
            }
          : m
      ),
    });
  };

  const compositionsByCategory = getCompositionsByCategory();

  const getMaterialIcon = (typeId: string) => {
    const type = packagingMaterialTypes.find((t) => t.id === typeId);
    return type?.icon || '📦';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recycling Information</CardTitle>
        <CardDescription>
          If you have a website or PDF with recycling information, you can link it. Otherwise, select the materials used for your wine packaging. Recycling information will be generated automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Mode Selection */}
        <div className="border rounded-lg p-4">
          <RadioGroup
            value={recyclingMode}
            onValueChange={(val) => handleModeChange(val as RecyclingMode)}
            className="flex flex-col sm:flex-row gap-4 sm:gap-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="mode-manual" />
              <Label htmlFor="mode-manual" className="font-normal cursor-pointer flex items-center gap-2">
                <FileEdit className="h-4 w-4" />
                Manual entry of recycling info
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdf" id="mode-pdf" />
              <Label htmlFor="mode-pdf" className="font-normal cursor-pointer flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload PDF file
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="website" id="mode-website" />
              <Label htmlFor="mode-website" className="font-normal cursor-pointer flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Link to website
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* PDF Upload Mode */}
        {recyclingMode === 'pdf' && (
          <div className="space-y-2">
            <Label htmlFor="pdf-url">PDF URL</Label>
            <Input
              id="pdf-url"
              type="url"
              placeholder="https://example.com/recycling-info.pdf"
              value={pdfUrl}
              onChange={(e) => onChange({ ...data, recycling_pdf_url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL of your recycling information PDF
            </p>
          </div>
        )}

        {/* Website Link Mode */}
        {recyclingMode === 'website' && (
          <div className="space-y-2">
            <Label htmlFor="website-url">Website URL</Label>
            <Input
              id="website-url"
              type="url"
              placeholder="https://example.com/recycling"
              value={websiteUrl}
              onChange={(e) => onChange({ ...data, recycling_website_url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL of your recycling information page
            </p>
          </div>
        )}

        {/* Manual Entry Mode */}
        {recyclingMode === 'manual' && (
          <div className="space-y-4">
            {/* Materials List */}
            {materials.length > 0 && (
              <div className="space-y-3">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex flex-col sm:flex-row gap-3 p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <span className="text-2xl">
                        {material.isCustomType ? '📦' : getMaterialIcon(material.typeId)}
                      </span>
                      <span className="font-medium">{material.typeName}</span>
                    </div>

                    <div className="flex-1 grid gap-3 sm:grid-cols-2">
                      <Select
                        value={material.compositionId || ''}
                        onValueChange={(val) => {
                          if (val === 'custom') {
                            // Handle custom composition
                            handleMaterialChange(material.id, 'compositionId', '');
                          } else {
                            handleMaterialChange(material.id, 'compositionId', val);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel className="font-bold text-foreground">Individual Components</SelectLabel>
                          </SelectGroup>
                          {compositionsByCategory.individual.map((cat) => (
                            <SelectGroup key={cat.id}>
                              <SelectLabel>{cat.name}</SelectLabel>
                              {cat.compositions.map((comp) => (
                                <SelectItem key={comp.id} value={comp.id}>
                                  {comp.name} <span className="font-semibold">({comp.code})</span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                          <SelectGroup>
                            <SelectLabel className="font-bold text-foreground">Composite Components</SelectLabel>
                          </SelectGroup>
                          {compositionsByCategory.composite.map((cat) => (
                            <SelectGroup key={cat.id}>
                              {cat.compositions.map((comp) => (
                                <SelectItem key={comp.id} value={comp.id}>
                                  {comp.name} <span className="font-semibold">({comp.code})</span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                          <SelectGroup>
                            <SelectLabel className="font-bold text-foreground">Custom Material</SelectLabel>
                            <SelectItem value="custom">Add custom material</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <Select
                        value={material.disposalMethodId || ''}
                        onValueChange={(val) =>
                          handleMaterialChange(material.id, 'disposalMethodId', val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Disposal advice" />
                        </SelectTrigger>
                        <SelectContent>
                          {disposalMethods.map((method) => (
                            <SelectItem key={method.id} value={method.id}>
                              {method.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(material.id)}
                      className="self-start p-2 hover:bg-muted rounded"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Material Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddMaterialOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add material
            </Button>
          </div>
        )}
      </CardContent>

      {/* Add Material Dialog */}
      <Dialog open={addMaterialOpen} onOpenChange={setAddMaterialOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add packaging material</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            {packagingMaterialTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleAddMaterial(type.id, type.name)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-left"
              >
                <span className="text-2xl">{type.icon}</span>
                <span className="font-medium">{type.name}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setAddMaterialOpen(false);
                setCustomTypeOpen(true);
              }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-left border-t mt-2 pt-4"
            >
              <span className="text-muted-foreground">Custom type</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Type Dialog */}
      <Dialog open={customTypeOpen} onOpenChange={setCustomTypeOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add custom material type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-type-name">Material name</Label>
              <Input
                id="custom-type-name"
                placeholder="e.g., Wooden crate"
                value={customTypeName}
                onChange={(e) => setCustomTypeName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomTypeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomType} disabled={!customTypeName.trim()}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
