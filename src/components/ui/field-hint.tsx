import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface FieldHintProps {
  /** Short hint text shown below the field (optional) */
  hint?: string;
  /** Longer explanation shown in tooltip/popover on info icon click */
  tooltip?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * A component that provides contextual help for form fields.
 * Shows a short hint below the field and/or an info icon with a detailed tooltip.
 */
export function FieldHint({ hint, tooltip, className }: FieldHintProps) {
  if (!hint && !tooltip) return null;

  return (
    <div className={cn("flex items-start gap-1.5 mt-1", className)}>
      {hint && (
        <p className="text-xs text-muted-foreground flex-1">{hint}</p>
      )}
      {tooltip && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="More information"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="max-w-xs text-sm" side="top">
                  {tooltip}
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs hidden sm:block">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

interface LabelWithHintProps {
  /** The label text */
  label: string;
  /** HTML for attribute */
  htmlFor?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Tooltip text for info icon */
  tooltip?: string;
  /** Additional CSS classes for the label */
  className?: string;
}

/**
 * A label component with an integrated info tooltip icon.
 */
export function LabelWithHint({ label, htmlFor, required, tooltip, className }: LabelWithHintProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}{required && ' *'}
      </label>
      {tooltip && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="More information"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="max-w-sm text-sm" side="top">
                  {tooltip}
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm hidden sm:block">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
