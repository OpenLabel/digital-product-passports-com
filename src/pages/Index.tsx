import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Globe, Infinity, Zap, CheckCircle2, Clock, Users, Github } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

// Category data based on EU DPP research document
const productCategories = [
  { 
    name: 'Batteries', 
    description: 'Carbon footprint, recycling, supply chain due diligence',
    status: 'active' as const,
    regulation: 'EU 2023/1542',
    deadline: 'Feb 2027'
  },
  { 
    name: 'Construction Products', 
    description: 'DoPC, GWP A1-A3, fire resistance',
    status: 'active' as const,
    regulation: 'EU 2024/3110',
    deadline: '2024'
  },
  { 
    name: 'Textiles & Footwear', 
    description: 'Fiber composition, durability, PFAS declaration',
    status: 'active' as const,
    regulation: 'ESPR Framework',
    deadline: '2027-2030'
  },
  { 
    name: 'Wine & Spirits', 
    description: 'Ingredients, nutrition, geographic indication',
    status: 'active' as const,
    regulation: 'EU 2021/2117',
    deadline: 'Active'
  },
  { 
    name: 'Toys', 
    description: 'PFAS-free, allergens, migration testing',
    status: 'active' as const,
    regulation: 'EU 2025/2509',
    deadline: '2025'
  },
  { 
    name: 'Electronics & ICT', 
    description: 'Repairability index, spare parts, software updates',
    status: 'priority' as const,
    regulation: 'ESPR Priority',
    deadline: 'TBD'
  },
  { 
    name: 'Iron & Steel', 
    description: 'Carbon intensity, scrap content, alloy chemistry',
    status: 'priority' as const,
    regulation: 'CBAM aligned',
    deadline: 'Q2 2026'
  },
  { 
    name: 'Aluminum', 
    description: 'Smelting energy source, coil traceability',
    status: 'priority' as const,
    regulation: 'ESPR 2025-2030',
    deadline: 'TBD'
  },
  { 
    name: 'Cosmetics', 
    description: 'INCI list, nanomaterials, packaging recyclability',
    status: 'priority' as const,
    regulation: 'ESPR Priority',
    deadline: 'TBD'
  },
  { 
    name: 'Furniture & Mattresses', 
    description: 'EUDR wood origin, spare parts, PFAS',
    status: 'priority' as const,
    regulation: 'ESPR + EUDR',
    deadline: 'TBD'
  },
  { 
    name: 'Tires', 
    description: 'Abrasion rate, retreading history, microplastics',
    status: 'priority' as const,
    regulation: 'ESPR Priority',
    deadline: 'TBD'
  },
  { 
    name: 'Detergents & Chemicals', 
    description: 'Digital SDS, biodegradability, dosage optimization',
    status: 'priority' as const,
    regulation: 'CLP/Detergents',
    deadline: 'TBD'
  },
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
          <div className="flex gap-2 items-center">
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
          <div className="flex justify-center gap-2 mb-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              EU ESPR Compliant
            </Badge>
            <Badge variant="outline" className="border-primary/30">
              <Github className="h-3 w-3 mr-1" />
              Open Source
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-5xl mx-auto leading-tight tracking-tight">
            Create <span className="text-primary">Unlimited</span> Digital Product Passports
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Free, open-source platform for EU Ecodesign for Sustainable Products Regulation (ESPR) compliance. 
            Generate machine-readable passports with QR codes for batteries, textiles, construction products, and 12+ categories.
            Self-host on your own servers or use our hosted version.
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
              <span>100% Free & Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Self-Hostable</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Machine-Readable JSON/XML</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>12+ Product Categories</span>
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
              <div className="text-sm text-muted-foreground">Free & Open Source</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">12+</div>
              <div className="text-sm text-muted-foreground">Product Categories</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">2027</div>
              <div className="text-sm text-muted-foreground">First EU Deadline</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">QR</div>
              <div className="text-sm text-muted-foreground">+ Unique URLs</div>
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
              Built following EU technical standards: decentralized storage, ISO 15459 identifiers, 
              tiered access rights, and machine-readable JSON/XML output.
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
                  Pre-configured templates following EU Ecodesign for Sustainable Products Regulation requirements per category.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Infinity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Open Source</h3>
                <p className="text-sm text-muted-foreground">
                  Fully open source. Self-host on your own servers for complete data control, or use our hosted version for free.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Machine-Readable</h3>
                <p className="text-sm text-muted-foreground">
                  Not static PDFs. Structured JSON/XML data for integration with BIM, recycling systems, and other software.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">QR & Data Carriers</h3>
                <p className="text-sm text-muted-foreground">
                  Each passport gets a unique URL and QR code. Ready for NFC/RFID integration per ISO 15459.
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
              Templates built from official EU regulations and delegated acts. Active regulations are in effect, 
              Priority groups have templates ready for upcoming requirements.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {productCategories.map((category) => (
              <Card 
                key={category.name} 
                className="relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg hover:border-primary"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                    {category.status === 'active' ? (
                      <Badge className="bg-green-500/10 text-green-600 text-xs border-green-500/20">
                        Active Law
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Priority Group
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{category.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{category.regulation}</span>
                    <span className="font-medium">{category.deadline}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Plus a generic "Other" template for any product type not yet covered by specific regulations.
            </p>
            <Button asChild>
              <Link to="/auth">
                Start Creating Passports <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
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
                    <Badge>First Battery Deadline</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    EV, industrial, and LMT batteries must have Digital Product Passports with full lifecycle data, 
                    carbon footprint declarations (kg CO₂e/kWh with Class A-D rating), and recycled content percentages for cobalt, lithium, and nickel.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Active Now</h3>
                    <Badge variant="outline">In Effect</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Construction Products (EU 2024/3110), Wine & Spirits (EU 2021/2117), and Toys (EU 2025/2509) 
                    already require digital declarations. Templates available now.
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
                  <h3 className="font-semibold mb-1">2027-2030: Full Rollout</h3>
                  <p className="text-sm text-muted-foreground">
                    Textiles, electronics, furniture, iron/steel, aluminum, cosmetics, tires, and detergents 
                    will require DPPs as delegated acts are published. Priority group templates ready now.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">Open Source</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Run It On Your Own Servers</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              This project is fully open source. You can self-host on your own infrastructure for complete 
              data sovereignty, modify the code to fit your needs, or contribute to the project.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <h3 className="font-semibold mb-2">Self-Host</h3>
                  <p className="text-sm text-muted-foreground">
                    Deploy on your own servers. Full control over your data and compliance documentation.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <h3 className="font-semibold mb-2">Customize</h3>
                  <p className="text-sm text-muted-foreground">
                    Add custom fields, integrate with your ERP/PLM systems, or build white-label solutions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <h3 className="font-semibold mb-2">Contribute</h3>
                  <p className="text-sm text-muted-foreground">
                    Help improve templates as regulations evolve. Community-driven compliance updates.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Compliant?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Start creating EU-compliant Digital Product Passports today. Free, unlimited, and open source.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <Link to="/auth">
              Start Free Today <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
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
              <Badge variant="outline" className="text-xs">
                Open Source
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
              <span className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} European Digital Product Passports
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
