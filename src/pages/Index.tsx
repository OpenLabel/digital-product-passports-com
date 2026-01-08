import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Globe, Infinity, Zap, Battery, Shirt, Package } from 'lucide-react';
import wineBg from '@/assets/wine-bg.jpg';

export default function Index() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">European Digital Product Passports</h1>
          <div className="flex gap-2">
            {loading ? null : user ? (
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            EU Compliant Digital Product Passports
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Unlimited Free Digital Product Passports
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Meet EU regulatory requirements for Wine, Batteries, Textiles, and more. 
            Generate compliant product passports with all required certifications and labels.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth">
                Create Your First Passport <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">EU Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Pre-configured templates with all required regulatory fields and certification logos.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Infinity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Free & Unlimited</h3>
                <p className="text-sm text-muted-foreground">
                  Create as many Digital Product Passports as you need, completely free of charge.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Public URLs</h3>
                <p className="text-sm text-muted-foreground">
                  Each passport gets a unique public URL. Share with anyone, no login required.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Quick Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Create a complete product passport in minutes with guided forms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Supported Product Categories</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Industry-specific templates with all the regulatory requirements built in.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="text-center p-6 relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${wineBg})` }}
              />
              <div className="relative z-10">
                <h3 className="font-semibold">Wine</h3>
                <p className="text-xs text-muted-foreground mt-1">PDO/PGI, Organic, Sulfites</p>
              </div>
            </Card>
            <Card className="text-center p-6">
              <Battery className="h-10 w-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold">Battery</h3>
              <p className="text-xs text-muted-foreground mt-1">Carbon Footprint, Recycling</p>
            </Card>
            <Card className="text-center p-6">
              <Shirt className="h-10 w-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold">Textiles</h3>
              <p className="text-xs text-muted-foreground mt-1">Fiber Composition, Care</p>
            </Card>
            <Card className="text-center p-6">
              <Package className="h-10 w-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold">Other</h3>
              <p className="text-xs text-muted-foreground mt-1">General Products</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Create your free account and build your first Digital Product Passport today.
          </p>
          <Button size="lg" asChild>
            <Link to="/auth">
              Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Digital Product Passport Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
