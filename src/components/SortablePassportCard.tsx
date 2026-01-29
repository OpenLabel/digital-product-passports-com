import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Copy, Trash2, QrCode, GripVertical } from 'lucide-react';
import type { Passport } from '@/types/passport';

interface SortablePassportCardProps {
  passport: Passport;
  getCategoryIcon: (category: string) => string;
  onShowQR: (passport: Passport) => void;
  onDuplicate: (passport: Passport) => void;
  onDelete: (id: string) => void;
}

export function SortablePassportCard({
  passport,
  getCategoryIcon,
  onShowQR,
  onDuplicate,
  onDelete,
}: SortablePassportCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: passport.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`overflow-hidden ${isDragging ? 'ring-2 ring-primary shadow-lg' : ''}`}
    >
      {passport.image_url && (
        <div className="h-32 bg-muted overflow-hidden">
          <img src={passport.image_url} alt={passport.name} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{getCategoryIcon(passport.category)}</span>
              <span className="truncate">{passport.name}</span>
            </CardTitle>
            <CardDescription>{t(`categories.${passport.category}`)}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {t('dashboard.updated')} {new Date(passport.updated_at).toLocaleDateString()}
          </p>
          <TooltipProvider>
            <div className="flex items-center gap-1">
              {passport.public_slug && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onShowQR(passport)}
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show QR Code</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => navigate(`/passport/${passport.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('common.edit')}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDuplicate(passport)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicate</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(passport.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('common.delete')}</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
