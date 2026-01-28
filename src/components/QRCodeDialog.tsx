import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  productName: string;
}

export function QRCodeDialog({ open, onOpenChange, url, productName }: QRCodeDialogProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && url) {
      setLoading(true);
      // Generate QR code using a free API
      const encodedUrl = encodeURIComponent(url);
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedUrl}`;
      setQrCodeUrl(qrApiUrl);
      setLoading(false);
    }
  }, [open, url]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">QR Code for {productName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {loading ? (
            <Skeleton className="h-[250px] w-[250px]" />
          ) : qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt={`QR Code for ${productName}`}
              className="h-[250px] w-[250px] rounded-lg border"
            />
          ) : null}
          <p className="text-sm text-muted-foreground text-center break-all px-4">
            {url}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
