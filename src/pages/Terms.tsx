import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function Terms() {
  const { config } = useSiteConfig();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-12 px-4">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using this Digital Product Passport platform operated by {config?.company_name || 'us'}, 
              you accept and agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              This platform enables users to create, manage, and publish Digital Product Passports (DPPs) 
              in compliance with EU regulations. DPPs provide consumers with transparent information about 
              products including ingredients, origin, and sustainability data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground mb-2">When creating an account, you agree to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. User Responsibilities</h2>
            <p className="text-muted-foreground mb-2">You are responsible for:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>The accuracy and legality of all product information you submit</li>
              <li>Ensuring your product passports comply with applicable regulations</li>
              <li>Obtaining necessary rights for any content you upload</li>
              <li>Not using the service for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="text-muted-foreground">
              You retain ownership of the content you create. By using this platform, you grant us a 
              license to display and distribute your product passports as necessary to provide the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Public Accessibility</h2>
            <p className="text-muted-foreground">
              Product passports created on this platform are designed to be publicly accessible via 
              unique URLs and QR codes. You acknowledge that any information in your product passports 
              will be viewable by anyone with the link.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              This platform is provided "as is" without warranties of any kind. We are not liable for 
              any indirect, incidental, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Modifications</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of the platform 
              after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">9. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account at any time for violations of these terms. 
              You may also delete your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">10. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms & Conditions, please contact:
            </p>
            {config?.company_address && (
              <p className="text-muted-foreground whitespace-pre-line mt-2">
                {config.company_name}<br />
                {config.company_address}
              </p>
            )}
          </section>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <Link to="/legal" className="hover:underline">Legal Mentions</Link>
          {' • '}
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
