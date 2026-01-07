import { useParams } from 'react-router-dom';
import { usePassportBySlug } from '@/hooks/usePassports';
import { getTemplate, categoryList } from '@/templates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function PublicPassport() {
  const { slug } = useParams<{ slug: string }>();
  const { data: passport, isLoading, error } = usePassportBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !passport) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Passport Not Found</h2>
            <p className="text-muted-foreground">
              This digital product passport doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const template = getTemplate(passport.category);
  const categoryData = (passport.category_data as Record<string, unknown>) || {};
  const categoryInfo = categoryList.find(c => c.value === passport.category);
  const requiredLogos = template.getRequiredLogos?.(categoryData) || [];

  const getDisplayValue = (value: unknown, questionType: string): string => {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              {categoryInfo?.icon} {categoryInfo?.label} Product Passport
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{passport.name}</h1>
          </div>

          {/* Product Image */}
          {passport.image_url && (
            <Card className="overflow-hidden">
              <img
                src={passport.image_url}
                alt={passport.name}
                className="w-full max-h-96 object-contain bg-background"
              />
            </Card>
          )}

          {/* Description */}
          {passport.description && (
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: passport.description }}
                />
              </CardContent>
            </Card>
          )}

          {/* Required Logos/Certifications */}
          {requiredLogos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Certifications & Labels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {requiredLogos.map((logo) => (
                    <Badge key={logo} variant="outline" className="text-sm py-1 px-3">
                      {logo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category-Specific Details */}
          {template.sections.length > 0 && (
            <div className="space-y-4">
              {template.sections.map((section, sectionIndex) => {
                const hasData = section.questions.some(q => {
                  const val = categoryData[q.id];
                  return val !== null && val !== undefined && val !== '' && val !== false;
                });

                if (!hasData) return null;

                return (
                  <Card key={sectionIndex}>
                    <CardHeader>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid gap-3">
                        {section.questions.map((question) => {
                          const value = categoryData[question.id];
                          const displayValue = getDisplayValue(value, question.type);
                          
                          if (!displayValue || displayValue === 'No') return null;

                          let displayLabel = displayValue;
                          if (question.type === 'select' && question.options) {
                            const option = question.options.find(o => o.value === value);
                            if (option) displayLabel = option.label;
                          }

                          return (
                            <div key={question.id} className="grid grid-cols-2 gap-2">
                              <dt className="text-muted-foreground text-sm">{question.label}</dt>
                              <dd className="text-sm font-medium">
                                {question.type === 'checkbox' ? (
                                  <Badge variant="secondary" className="text-xs">✓ Confirmed</Badge>
                                ) : (
                                  displayLabel
                                )}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
