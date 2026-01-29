import { WinePublicPassport } from './WinePublicPassport';

interface WinePassportPreviewProps {
  formData: {
    name: string;
    image_url: string | null;
    description: string;
    category_data: Record<string, unknown>;
  };
}

export function WinePassportPreview({ formData }: WinePassportPreviewProps) {
  // Create a passport object from form data for the preview
  const previewPassport = {
    name: formData.name || 'Untitled Passport',
    image_url: formData.image_url,
    description: formData.description,
    category_data: formData.category_data,
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="sticky top-8">
      <div className="bg-background shadow-lg overflow-hidden max-w-[280px] mx-auto rounded-2xl border">
        {/* Phone frame styling */}
        <div className="bg-muted/50 p-2 flex justify-center">
          <div className="w-20 h-1 bg-muted-foreground/20 rounded-full" />
        </div>
        {/* Scaled preview container */}
        <div className="h-[500px] overflow-hidden">
          <div 
            className="overflow-y-auto origin-top"
            style={{
              transform: 'scale(0.65)',
              width: '154%', // 1 / 0.65 ≈ 154%
              height: '154%', // Scale the height to match
              transformOrigin: 'top left',
            }}
          >
            <WinePublicPassport passport={previewPassport} />
          </div>
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground mt-2">Live Preview</p>
    </div>
  );
}
