import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, CheckCircle2, Server, Link2, FileText, Sparkles, AlertCircle, Mail, ExternalLink, Loader2, Key } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

export default function Setup() {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState('/privacy-policy');
  const [termsConditionsUrl, setTermsConditionsUrl] = useState('/terms');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [resendApiKey, setResendApiKey] = useState('');
  const [senderEmail, setSenderEmail] = useState('noreply@digital-product-passports.com');
  const [lovableApiKey, setLovableApiKey] = useState('');
  const [validatingResend, setValidatingResend] = useState(false);
  const [validatingLovable, setValidatingLovable] = useState(false);
  const [resendValidated, setResendValidated] = useState(false);
  const [lovableValidated, setLovableValidated] = useState(false);
  const [saving, setSaving] = useState(false);
  const { saveConfig, isLovableCloud } = useSiteConfig();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateAndSaveResendKey = async () => {
    if (!resendApiKey.trim()) {
      toast({ title: 'Error', description: 'Please enter a Resend API key', variant: 'destructive' });
      return false;
    }

    setValidatingResend(true);
    try {
      const { data, error } = await supabase.functions.invoke('save-resend-key', {
        body: { resendApiKey: resendApiKey.trim() },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      setResendValidated(true);
      toast({ title: 'Success', description: 'Resend API key validated and saved' });
      return true;
    } catch (error: any) {
      toast({ 
        title: 'Invalid API Key', 
        description: error.message || 'Failed to validate Resend API key', 
        variant: 'destructive' 
      });
      return false;
    } finally {
      setValidatingResend(false);
    }
  };

  const validateAndSaveLovableKey = async () => {
    if (!lovableApiKey.trim()) {
      toast({ title: 'Error', description: 'Please enter a Lovable API key', variant: 'destructive' });
      return false;
    }

    setValidatingLovable(true);
    try {
      const { data, error } = await supabase.functions.invoke('save-lovable-key', {
        body: { lovableApiKey: lovableApiKey.trim() },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      setLovableValidated(true);
      toast({ title: 'Success', description: 'Lovable API key saved' });
      return true;
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save Lovable API key', 
        variant: 'destructive' 
      });
      return false;
    } finally {
      setValidatingLovable(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      toast({ title: 'Error', description: 'Company name is required', variant: 'destructive' });
      return;
    }

    if (!companyAddress.trim()) {
      toast({ title: 'Error', description: 'Company address is required', variant: 'destructive' });
      return;
    }

    // Validate Resend key if provided and not already validated
    if (resendApiKey.trim() && !resendValidated) {
      const isValid = await validateAndSaveResendKey();
      if (!isValid) return;
    }

    // Validate Lovable API key if AI is enabled and not on Lovable Cloud
    if (aiEnabled && !isLovableCloud && lovableApiKey.trim() && !lovableValidated) {
      const isValid = await validateAndSaveLovableKey();
      if (!isValid) return;
    }

    setSaving(true);
    try {
      await saveConfig({
        company_name: companyName.trim(),
        company_address: companyAddress.trim(),
        privacy_policy_url: privacyPolicyUrl.trim(),
        terms_conditions_url: termsConditionsUrl.trim(),
        ai_enabled: aiEnabled,
        sender_email: senderEmail.trim(),
        setup_complete: true,
      });
      toast({ title: 'Setup complete!', description: 'Your instance is now configured.' });
      navigate('/');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center">
              <Server className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <Badge variant="outline" className="mb-4">Initial Setup</Badge>
          <h1 className="text-3xl font-bold mb-2">Welcome to DPP Platform</h1>
          <p className="text-muted-foreground">
            Configure your Digital Product Passport instance. This information will appear in legal mentions on all passports.
          </p>
        </div>

        <div className="space-y-6">
          {/* Provider Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Provider Information
              </CardTitle>
              <CardDescription>
                Enter the details of the company or organization providing this DPP service. 
                This is required for EU compliance and will be displayed to users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company / Organization Name *
                  </Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Your Company SAS"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Registered Address *
                  </Label>
                  <Textarea
                    id="companyAddress"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="123 Business Street&#10;75001 Paris&#10;France"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Full legal address including street, city, postal code, and country.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacyPolicyUrl" className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Privacy Policy URL
                  </Label>
                  <Input
                    id="privacyPolicyUrl"
                    value={privacyPolicyUrl}
                    onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                    placeholder="/privacy-policy or https://example.com/privacy"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termsConditionsUrl" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Terms & Conditions URL
                  </Label>
                  <Input
                    id="termsConditionsUrl"
                    value={termsConditionsUrl}
                    onChange={(e) => setTermsConditionsUrl(e.target.value)}
                    placeholder="/terms or https://example.com/terms"
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    What this information is used for:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Displayed in "Legal Mentions" on all Digital Product Passports</li>
                    <li>• Required for EU e-label regulation compliance</li>
                    <li>• Identifies the service provider to consumers</li>
                    <li>• Privacy policy and terms links shown to users</li>
                  </ul>
                </div>

                {/* Email Configuration Section */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Email Configuration (Resend)</h3>
                  </div>
                  
                  <Alert>
                    <Mail className="h-4 w-4" />
                    <AlertDescription className="space-y-2">
                      <p>Email is required for password reset functionality. Get your API key from Resend:</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <a
                          href="https://resend.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Get Resend API Key
                        </a>
                        <span className="text-muted-foreground">•</span>
                        <a
                          href="https://resend.com/domains"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Verify Your Domain
                        </a>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="resendApiKey" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Resend API Key
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="resendApiKey"
                        type="password"
                        value={resendApiKey}
                        onChange={(e) => {
                          setResendApiKey(e.target.value);
                          setResendValidated(false);
                        }}
                        placeholder="re_xxxxxxxx..."
                        className={resendValidated ? 'border-green-500' : ''}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={validateAndSaveResendKey}
                        disabled={validatingResend || !resendApiKey.trim()}
                      >
                        {validatingResend ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : resendValidated ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          'Validate'
                        )}
                      </Button>
                    </div>
                    {resendValidated && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        API key validated and saved
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Required for password reset emails.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senderEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Sender Email Address
                    </Label>
                    <Input
                      id="senderEmail"
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="noreply@your-verified-domain.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be from a domain verified in Resend. Used for counterfeit protection requests.
                    </p>
                  </div>
                </div>

                {/* AI Features Section */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">AI Features</h3>
                  </div>
                  
                  {isLovableCloud ? (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertDescription className="space-y-2">
                        <p>You're running on Lovable Cloud. AI features are automatically available.</p>
                        <a
                          href="https://lovable.dev"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Learn more about Lovable
                        </a>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="space-y-2">
                          <p>Self-hosted installation detected. AI features require a Lovable API key.</p>
                          <a
                            href="https://lovable.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Get Lovable API Key
                          </a>
                        </AlertDescription>
                      </Alert>

                      {aiEnabled && (
                        <div className="space-y-2">
                          <Label htmlFor="lovableApiKey" className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Lovable API Key *
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="lovableApiKey"
                              type="password"
                              value={lovableApiKey}
                              onChange={(e) => {
                                setLovableApiKey(e.target.value);
                                setLovableValidated(false);
                              }}
                              placeholder="Enter your Lovable API key..."
                              className={lovableValidated ? 'border-green-500' : ''}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={validateAndSaveLovableKey}
                              disabled={validatingLovable || !lovableApiKey.trim()}
                            >
                              {validatingLovable ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : lovableValidated ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                'Save'
                              )}
                            </Button>
                          </div>
                          {lovableValidated && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              API key saved
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Required for AI features like label scanning and autofill.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="aiEnabled"
                      checked={aiEnabled}
                      onCheckedChange={(checked) => setAiEnabled(checked === true)}
                    />
                    <Label htmlFor="aiEnabled" className="text-sm font-normal cursor-pointer">
                      Enable AI features (Autofill from labels, Translation)
                    </Label>
                  </div>
                  
                  {!aiEnabled && (
                    <p className="text-xs text-muted-foreground">
                      AI features like automatic label scanning will be hidden from the interface.
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={saving}>
                  {saving ? 'Saving...' : 'Complete Setup'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          This is a self-hosted open source DPP platform. To reset this configuration, 
          delete all rows from the <code className="bg-muted px-1 py-0.5 rounded">site_config</code> table in your database.
        </p>
      </div>
    </div>
  );
}
