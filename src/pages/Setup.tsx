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
import { Building2, MapPin, CheckCircle2, Server, Link2, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Setup() {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState('/privacy-policy');
  const [termsConditionsUrl, setTermsConditionsUrl] = useState('/terms');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const { saveConfig, isLovableCloud } = useSiteConfig();
  const { toast } = useToast();
  const navigate = useNavigate();

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

    setSaving(true);
    try {
      await saveConfig({
        company_name: companyName.trim(),
        company_address: companyAddress.trim(),
        privacy_policy_url: privacyPolicyUrl.trim(),
        terms_conditions_url: termsConditionsUrl.trim(),
        ai_enabled: aiEnabled,
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

                {/* AI Features Section */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">AI Features</h3>
                  </div>
                  
                  {isLovableCloud ? (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertDescription>
                        You're running on Lovable Cloud. AI features are automatically available with no additional configuration required.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Self-hosted installation detected. AI features require a Lovable API key configured in your environment variables (LOVABLE_API_KEY).
                      </AlertDescription>
                    </Alert>
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
