import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePassports, usePassportById } from '@/hooks/usePassports';
import { categoryList } from '@/templates';
import type { ProductCategory } from '@/types/passport';
import type { Json } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ImageUpload } from '@/components/ImageUpload';
import { CategoryQuestions } from '@/components/CategoryQuestions';
import { WineFields } from '@/components/WineFields';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  category: ProductCategory;
  image_url: string | null;
  description: string;
  language: string;
  category_data: Record<string, unknown>;
}

export default function PassportForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = id && id !== 'new';
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { createPassport, updatePassport } = usePassports();
  const { data: existingPassport, isLoading: passportLoading } = usePassportById(isEditing ? id : undefined);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'other',
    image_url: null,
    description: '',
    language: 'en',
    category_data: {},
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (existingPassport) {
      setFormData({
        name: existingPassport.name,
        category: existingPassport.category,
        image_url: existingPassport.image_url,
        description: existingPassport.description || '',
        language: existingPassport.language,
        category_data: (existingPassport.category_data as Record<string, unknown>) || {},
      });
    }
  }, [existingPassport]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Please enter a product name', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const submitData = {
        ...formData,
        category_data: formData.category_data as Json,
      };
      if (isEditing) {
        await updatePassport.mutateAsync({ id, ...submitData });
        toast({ title: 'Passport updated successfully' });
      } else {
        await createPassport.mutateAsync(submitData);
        toast({ title: 'Passport created successfully' });
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || (isEditing && passportLoading)) {
    return (
      <div className="min-h-screen bg-muted/30 p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">
            {isEditing ? 'Edit Passport' : 'Create New Passport'}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter a name for this product"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Product Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: ProductCategory) => 
                    setFormData({ ...formData, category: value, category_data: {} })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryList.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product Image - right after basic information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
              />
            </CardContent>
          </Card>

          {/* Wine-specific fields */}
          {formData.category === 'wine' && (
            <WineFields
              data={(formData.category_data as Record<string, unknown>) || {}}
              onChange={(data) => setFormData({ ...formData, category_data: data })}
            />
          )}

          {/* Product Description - hidden for wine */}
          {formData.category !== 'wine' && (
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  content={formData.description}
                  onChange={(content) => setFormData({ ...formData, description: content })}
                  placeholder="Describe your product..."
                />
              </CardContent>
            </Card>
          )}

          {/* Category-Specific Questions (for non-wine categories or additional wine fields) */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {categoryList.find(c => c.value === formData.category)?.icon}{' '}
              {categoryList.find(c => c.value === formData.category)?.label} Details
            </h2>
            <CategoryQuestions
              category={formData.category}
              data={(formData.category_data as Record<string, unknown>) || {}}
              onChange={(data) => setFormData({ ...formData, category_data: data })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Save Changes' : 'Create Passport'}
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
