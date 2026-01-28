import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Camera, Upload, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WineAIAutofillProps {
  onAutofill: (data: Record<string, unknown>) => void;
}

export function WineAIAutofill({ onAutofill }: WineAIAutofillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Process the image
    await processImage(file);
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('wine-label-ocr', {
        body: { image: base64 }
      });

      if (error) {
        throw new Error(error.message || 'Failed to process image');
      }

      if (data?.extractedData) {
        onAutofill(data.extractedData);
        toast({
          title: '✨ AI Autofill Complete',
          description: 'Fields have been populated. Please review and verify the data before saving.',
        });
        setIsOpen(false);
        setPreviewUrl(null);
      } else {
        throw new Error('No data extracted from the label');
      }
    } catch (error) {
      console.error('Error processing wine label:', error);
      toast({
        title: 'Processing Failed',
        description: error instanceof Error ? error.message : 'Failed to extract data from the label',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Apple Intelligence-style gradient button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative w-full overflow-hidden rounded-xl p-[2px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 15%, #FEC89A 30%, #98D8AA 50%, #7EB6FF 70%, #A78BFA 85%, #F472B6 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 4s ease infinite',
        }}
      >
        <div className="relative flex items-center justify-center gap-3 rounded-[10px] bg-background/95 px-6 py-4 backdrop-blur-sm transition-all group-hover:bg-background/90">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Autofill with AI
          </span>
          <span className="ml-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            Experimental
          </span>
        </div>
      </button>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      <Dialog open={isOpen} onOpenChange={(open) => { 
        setIsOpen(open); 
        if (!open) {
          setPreviewUrl(null);
          setIsProcessing(false);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Label Scanner
            </DialogTitle>
            <DialogDescription>
              Upload a photo of your wine label and AI will extract the information automatically.
            </DialogDescription>
          </DialogHeader>

          <Alert className="border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              <strong>Experimental feature:</strong> Please double-check all extracted data before saving. AI may make mistakes.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Wine label preview" 
                  className="w-full rounded-lg object-cover max-h-64"
                />
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                      <span className="text-sm font-medium">Analyzing label...</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  className="h-24 flex-col gap-2"
                >
                  <Camera className="h-6 w-6" />
                  <span className="text-sm">Take Photo</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  className="h-24 flex-col gap-2"
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Upload Image</span>
                </Button>
              </div>
            )}

            {!previewUrl && (
              <p className="text-xs text-muted-foreground text-center">
                For best results, ensure the label is well-lit and clearly visible
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
