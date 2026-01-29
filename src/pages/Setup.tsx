import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, CheckCircle2, Server } from 'lucide-react';

export default function Setup() {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const { saveConfig } = useSiteConfig();
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

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  What this information is used for:
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Displayed in "Legal Mentions" on all Digital Product Passports</li>
                  <li>• Required for EU e-label regulation compliance</li>
                  <li>• Identifies the service provider to consumers</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={saving}>
                {saving ? 'Saving...' : 'Complete Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          This is a self-hosted open source DPP platform. You can modify this configuration later in the admin settings.
        </p>
      </div>
    </div>
  );
}
