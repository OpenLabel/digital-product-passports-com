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
  counterfeitProtectionEnabled?: boolean;
}

// Rounded hexagon SVG path - creates a hexagon with curved corners
function RoundedHexagon({ size = 60 }: { size?: number }) {
  // Create a hexagon path with rounded corners
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 2; // Slight padding
  const cornerRadius = radius * 0.2; // 20% corner rounding
  
  // Calculate hexagon vertices
  const vertices = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2; // Start from top
    vertices.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }
  
  // Create path with rounded corners using quadratic curves
  let path = '';
  for (let i = 0; i < 6; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % 6];
    const prev = vertices[(i + 5) % 6];
    
    // Calculate points for the curved corners
    const toPrev = { x: prev.x - current.x, y: prev.y - current.y };
    const toNext = { x: next.x - current.x, y: next.y - current.y };
    
    const lenPrev = Math.sqrt(toPrev.x ** 2 + toPrev.y ** 2);
    const lenNext = Math.sqrt(toNext.x ** 2 + toNext.y ** 2);
    
    const startPoint = {
      x: current.x + (toPrev.x / lenPrev) * cornerRadius,
      y: current.y + (toPrev.y / lenPrev) * cornerRadius,
    };
    const endPoint = {
      x: current.x + (toNext.x / lenNext) * cornerRadius,
      y: current.y + (toNext.y / lenNext) * cornerRadius,
    };
    
    if (i === 0) {
      path += `M ${startPoint.x} ${startPoint.y} `;
    }
    
    // Quadratic curve through the vertex
    path += `Q ${current.x} ${current.y} ${endPoint.x} ${endPoint.y} `;
    
    // Line to next corner start
    const nextVertex = vertices[(i + 1) % 6];
    const nextNext = vertices[(i + 2) % 6];
    const toNextNext = { x: nextNext.x - nextVertex.x, y: nextNext.y - nextVertex.y };
    const lenNextNext = Math.sqrt(toNextNext.x ** 2 + toNextNext.y ** 2);
    
    if (i < 5) {
      const nextStartPoint = {
        x: nextVertex.x + (toNext.x / lenNext) * -cornerRadius,
        y: nextVertex.y + (toNext.y / lenNext) * -cornerRadius,
      };
      path += `L ${nextStartPoint.x} ${nextStartPoint.y} `;
    }
  }
  path += 'Z';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <path
        d={path}
        fill="white"
        stroke="#e5e5e5"
        strokeWidth="1"
      />
    </svg>
  );
}

export function QRCodeDialog({ 
  open, 
  onOpenChange, 
  url, 
  productName,
  counterfeitProtectionEnabled = false,
}: QRCodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">QR Code for {productName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {url && (
            <div className="rounded-lg border p-4 bg-white relative">
              <QRCodeSVG
                value={url}
                size={250}
                level="H" // High error correction when we have an overlay
                includeMargin={false}
              />
              {counterfeitProtectionEnabled && (
                <RoundedHexagon size={70} />
              )}
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
