import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { EU_LANGUAGES } from '@/components/TranslationButton';

interface DPPLanguagePickerProps {
  /** When true, changes affect only local state (for preview mode) */
  localOnly?: boolean;
  /** Callback when language changes (for preview mode) */
  onLanguageChange?: (lang: string) => void;
  /** Current language override (for preview mode) */
  currentLanguage?: string;
}

/**
 * Language picker for DPP (Digital Product Passport) that only shows EU languages.
 * Can operate in two modes:
 * 1. Normal mode: Changes the app's i18n language (for public DPP page)
 * 2. Local mode: Only fires a callback without changing app language (for live preview)
 */
export function DPPLanguagePicker({ 
  localOnly = false, 
  onLanguageChange,
  currentLanguage,
}: DPPLanguagePickerProps) {
  const { i18n } = useTranslation();
  
  // Use provided language or fall back to i18n language, constrained to EU languages
  const getEffectiveLanguage = () => {
    const lang = currentLanguage || i18n.language.split('-')[0];
    // Check if it's an EU language, otherwise default to English
    const isEULang = EU_LANGUAGES.some(l => l.code === lang);
    return isEULang ? lang : 'en';
  };

  const [selectedLang, setSelectedLang] = useState(getEffectiveLanguage);

  // Sync with i18n changes when not in local mode
  useEffect(() => {
    if (!localOnly && !currentLanguage) {
      setSelectedLang(getEffectiveLanguage());
    }
  }, [i18n.language, localOnly, currentLanguage]);

  // Sync with currentLanguage prop
  useEffect(() => {
    if (currentLanguage) {
      setSelectedLang(currentLanguage);
    }
  }, [currentLanguage]);

  const handleChange = (lang: string) => {
    setSelectedLang(lang);
    
    if (localOnly) {
      // Only notify parent, don't change app language
      onLanguageChange?.(lang);
    } else {
      // Change the app's i18n language
      i18n.changeLanguage(lang);
      onLanguageChange?.(lang);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedLang} onValueChange={handleChange}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {EU_LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-xs">
              {lang.nativeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
