import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  productName: string;
  counterfeitProtectionEnabled?: boolean;
}

// Rounded hexagon SVG with text - creates a hexagon with curved corners and instruction text
function RoundedHexagonWithText({ size = 80 }: { size?: number }) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 2;
  const cornerRadius = radius * 0.2;
  
  const vertices = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    vertices.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }
  
  let path = '';
  for (let i = 0; i < 6; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % 6];
    const prev = vertices[(i + 5) % 6];
    
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
    
    path += `Q ${current.x} ${current.y} ${endPoint.x} ${endPoint.y} `;
    
    const nextVertex = vertices[(i + 1) % 6];
    
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
      <text
        x={centerX}
        y={centerY - 10}
        textAnchor="middle"
        fontSize="6"
        fontWeight="500"
        fill="#666"
      >
        Place security
      </text>
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        fontSize="6"
        fontWeight="500"
        fill="#666"
      >
        seal here
      </text>
      <text
        x={centerX}
        y={centerY + 14}
        textAnchor="middle"
        fontSize="5"
        fill="#999"
      >
        cypheme.com
      </text>
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
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                level="H"
                includeMargin={false}
              />
              {counterfeitProtectionEnabled && (
                <RoundedHexagonWithText size={80} />
              )}
            </div>
          )}
          <div className="flex items-center gap-2 w-full max-w-sm">
            <div className="flex-1 text-sm text-muted-foreground bg-muted rounded-md px-3 py-2 truncate">
              {url}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyUrl}
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
