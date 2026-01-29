import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  productName: string;
}

export function QRCodeDialog({ open, onOpenChange, url, productName }: QRCodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">QR Code for {productName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {url && (
            <div className="rounded-lg border p-4 bg-white">
              <QRCodeSVG
                value={url}
                size={250}
                level="M"
                includeMargin={false}
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground text-center break-all px-4">
            {url}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
