import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Globe, Infinity, Zap, CheckCircle2, Clock, Users } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import wineBg from '@/assets/wine-bg.jpg';
import batteryBg from '@/assets/battery-bg.jpg';
import textilesBg from '@/assets/textiles-bg.jpg';
import electronicsBg from '@/assets/electronics-bg.jpg';
import furnitureBg from '@/assets/furniture-bg.jpg';
import constructionBg from '@/assets/construction-bg.jpg';
import cosmeticsBg from '@/assets/cosmetics-bg.jpg';
import tiresBg from '@/assets/tires-bg.jpg';
import otherBg from '@/assets/other-bg.jpg';

const productCategories = [
  { name: 'Batteries', description: 'Carbon footprint, recycling info', image: batteryBg, available: true },
  { name: 'Textiles & Apparel', description: 'Fiber composition, care labels', image: textilesBg, available: true },
  { name: 'Wine & Beverages', description: 'PDO/PGI, organic certifications', image: wineBg, available: true },
  { name: 'Electronics', description: 'Repairability, energy efficiency', image: electronicsBg, available: false },
  { name: 'Furniture', description: 'Materials, durability ratings', image: furnitureBg, available: false },
  { name: 'Iron & Steel', description: 'Carbon emissions, recycled content', image: constructionBg, available: false },
  { name: 'Cosmetics', description: 'Ingredients, packaging recyclability', image: cosmeticsBg, available: false },
  { name: 'Tyres', description: 'Durability, fuel efficiency', image: tiresBg, available: false },
  { name: 'Other Products', description: 'General product information', image: otherBg, available: true },
];

export default function Index() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">EU</span>
            </div>
            <h1 className="text-lg font-semibold">Digital Product Passport</h1>
          </div>
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
                  <Link to="/auth">Get Started Free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            EU ESPR Regulation Compliant
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-5xl mx-auto leading-tight tracking-tight">
            Create <span className="text-primary">Unlimited</span> Digital Product Passports for Free
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Meet the EU's Ecodesign for Sustainable Products Regulation (ESPR) requirements. 
            Generate compliant passports for batteries, textiles, electronics, and more — 
            with all required certifications, labels, and traceability data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/auth">
                Create Your First Passport <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/auth">View Demo Passport</Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Unlimited passports</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>ESPR compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Free Forever</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">30+</div>
              <div className="text-sm text-muted-foreground">Product Categories</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">2026</div>
              <div className="text-sm text-muted-foreground">EU Deadline Ready</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">QR</div>
              <div className="text-sm text-muted-foreground">Code Generation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for Compliance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools required to create, manage, and share 
              EU-compliant Digital Product Passports.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">ESPR Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Pre-configured templates following EU Ecodesign for Sustainable Products Regulation requirements.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Infinity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Free & Unlimited</h3>
                <p className="text-sm text-muted-foreground">
                  Create as many Digital Product Passports as you need, completely free of charge. No limits.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Public URLs & QR</h3>
                <p className="text-sm text-muted-foreground">
                  Each passport gets a unique URL and QR code. Consumers can access product info instantly.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Quick Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Guided forms make it easy. Create a complete, compliant passport in under 5 minutes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">EU Regulation Scope</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supported Product Categories</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Under the EU's ESPR regulation, Digital Product Passports will be required for a wide range 
              of product categories. Our platform supports all major categories with industry-specific templates.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {productCategories.map((category) => (
              <Card 
                key={category.name} 
                className={`relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg ${
                  category.available ? 'hover:border-primary' : 'opacity-75'
                }`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <CardContent className="relative z-10 p-5 text-center">
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                  {category.available ? (
                    <Badge className="bg-primary/10 text-primary text-xs">Available</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            More categories including detergents, paints, lubricants, and chemicals coming soon.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Regulatory Timeline</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">EU DPP Implementation Deadlines</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The EU is rolling out Digital Product Passport requirements in phases. 
              Start preparing now to ensure compliance.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">February 2027</h3>
                    <Badge>First Deadline</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Batteries (EV, industrial, and LMT batteries) must have Digital Product Passports 
                    with full lifecycle data, carbon footprint declarations, and recycling information.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-muted">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">2027-2030</h3>
                  <p className="text-sm text-muted-foreground">
                    Textiles, electronics, furniture, construction materials, and other product categories 
                    will require DPPs as delegated acts are published.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-muted">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Full Implementation</h3>
                  <p className="text-sm text-muted-foreground">
                    All products covered by ESPR will require a Digital Product Passport accessible 
                    to consumers, businesses, and authorities via QR codes or data carriers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Compliant?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses preparing for EU Digital Product Passport requirements. 
            Create your free account and build your first passport in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link to="/auth">
                Start Free Today <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">EU</span>
              </div>
              <span className="text-sm font-medium">Digital Product Passport Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} European Digital Product Passports. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
