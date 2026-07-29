/*
 * Open-Label Digital Product Passport Engine
 * Copyright (C) 2026 Open-Label.eu
 *
 * Licensed under the Open-Label Public License (OLPL) v1.0.
 * See LICENSE and NOTICE files for details.
 */

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  className?: string;
  // NEW-02: when provided, ImageUpload defers deletion of the previous storage
  // object to the caller (so a discard-without-save doesn't destroy the image
  // the persisted DPP still points to). The caller should flush the queue
  // AFTER a successful save.
  onPendingDelete?: (previousUrl: string) => void;
}


// Extract the storage path (relative to the bucket) from a public URL.
// Returns null when the URL is not a passport-images public URL — we must
// never attempt to delete arbitrary objects supplied by the client.
function extractStoragePath(url: string | null | undefined, userId: string): string | null {
  if (!url) return null;
  const marker = '/storage/v1/object/public/passport-images/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const path = url.slice(idx + marker.length).split('?')[0];
  // Only allow deleting objects owned by the current user (folder = userId).
  if (!path.startsWith(`${userId}/`)) return null;
  return path;
}

export function ImageUpload({ value, onChange, className, onPendingDelete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { t } = useTranslation();

  const removePreviousObject = async (previousUrl: string | null) => {
    if (!previousUrl || !user) return;
    // NEW-02: if a caller has opted into deferred deletion, hand the URL over
    // and let them flush after save. Otherwise, fall back to eager delete.
    if (onPendingDelete) {
      onPendingDelete(previousUrl);
      return;
    }
    const path = extractStoragePath(previousUrl, user.id);
    if (!path) return;
    try {
      await supabase.storage.from('passport-images').remove([path]);
    } catch (err) {
      // Best-effort cleanup; never block the UI on a failed delete.
      console.warn('Failed to delete previous image:', err);
    }
  };


  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      setError(t('imageUpload.loginRequired'));
      return;
    }

    // BUG-31: enforce MIME + size before touching storage
    if (!file.type.startsWith('image/')) {
      setError(t('imageUpload.invalidType'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(t('imageUpload.tooLarge'));
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      // Store files in user-specific folders for proper ownership verification
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('passport-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('passport-images')
        .getPublicUrl(filePath);

      // BUG-31: after the new upload succeeds, delete the previous object
      // so orphaned images don't accumulate in storage.
      const previousUrl = value;
      onChange(data.publicUrl);
      await removePreviousObject(previousUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || t('imageUpload.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    const previousUrl = value;
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    await removePreviousObject(previousUrl);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id="image-upload"
      />
      
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Product"
            className="max-w-xs max-h-48 rounded-lg border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 border-dashed"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('imageUpload.uploading')}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {t('imageUpload.uploadButton')}
            </>
          )}
        </Button>
      )}
      
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
