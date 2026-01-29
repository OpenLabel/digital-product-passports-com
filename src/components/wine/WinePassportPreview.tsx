interface WinePassportPreviewProps {
  publicSlug?: string | null;
}

export function WinePassportPreview({ publicSlug }: WinePassportPreviewProps) {
  // For new passports that haven't been saved yet, show a placeholder
  if (!publicSlug) {
    return (
      <div className="sticky top-8">
        <div className="bg-background shadow-lg overflow-hidden max-w-[280px] mx-auto rounded-2xl border">
          {/* Phone frame styling */}
          <div className="bg-muted/50 p-2 flex justify-center">
            <div className="w-20 h-1 bg-muted-foreground/20 rounded-full" />
          </div>
          <div className="h-[500px] flex items-center justify-center p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Save the passport first to see the live preview
            </p>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">Live Preview</p>
      </div>
    );
  }

  return (
    <div className="sticky top-8">
      <div className="bg-background shadow-lg overflow-hidden max-w-[280px] mx-auto rounded-2xl border">
        {/* Phone frame styling */}
        <div className="bg-muted/50 p-2 flex justify-center">
          <div className="w-20 h-1 bg-muted-foreground/20 rounded-full" />
        </div>
        <iframe
          src={`/p/${publicSlug}`}
          className="w-full h-[500px] border-0"
          title="Wine Passport Preview"
        />
      </div>
      <p className="text-xs text-center text-muted-foreground mt-2">Live Preview</p>
    </div>
  );
}
