import { useState } from 'react';
import { Shield, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CounterfeitProtectionProps {
  passportName: string;
  passportSlug: string | null;
  userEmail: string | undefined;
}

export function CounterfeitProtection({ passportName, passportSlug, userEmail }: CounterfeitProtectionProps) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    if (enabled) {
      // Simply disable the visual state
      setEnabled(false);
      return;
    }

    if (!userEmail) {
      toast({
        title: 'Error',
        description: 'Unable to send request - user email not found',
        variant: 'destructive',
      });
      return;
    }

    if (!passportSlug) {
      toast({
        title: 'Error',
        description: 'Please save the passport first before enabling counterfeit protection',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const passportUrl = `${window.location.origin}/p/${passportSlug}`;
      
      const { data, error } = await supabase.functions.invoke('send-counterfeit-request', {
        body: {
          userEmail,
          passportName,
          passportUrl,
        },
      });

      if (error) throw error;

      setEnabled(true);
      toast({
        title: 'Request sent!',
        description: 'An email has been sent to our counterfeit protection partner. They will contact you to deliver the security seal.',
      });
    } catch (error: any) {
      console.error('Counterfeit protection request failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send counterfeit protection request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (enabled) {
    return (
      <div className="rounded-lg border-2 border-green-500/50 bg-green-50 dark:bg-green-950/20 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-green-800 dark:text-green-200">
              Counterfeit Protection Requested
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              An email has been sent to our counterfeit protection partner. They will contact you to deliver the security seal.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-300 dark:hover:text-green-200 dark:hover:bg-green-900/30"
          >
            Disable
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4">
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-red-800 dark:text-red-200">
            Add Counterfeit Protection
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            Protect your product with a security seal from our partner.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggle}
          disabled={loading}
          className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              Sending...
            </>
          ) : (
            'Enable'
          )}
        </Button>
      </div>
    </div>
  );
}
