import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePassports } from '@/hooks/usePassports';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Copy, Trash2, LogOut, QrCode } from 'lucide-react';
import { categoryList } from '@/templates';
import { QRCodeDialog } from '@/components/QRCodeDialog';



export default function Dashboard() {
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedPassport, setSelectedPassport] = useState<{ name: string; slug: string; counterfeitProtection: boolean } | null>(null);
  const { user, loading: authLoading, signOut } = useAuth();
  const { passports, isLoading, duplicatePassport, deletePassport } = usePassports();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleDuplicate = async (passport: any) => {
    try {
      await duplicatePassport.mutateAsync(passport);
      toast({ title: 'Passport duplicated' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this passport?')) return;
    try {
      await deletePassport.mutateAsync(id);
      toast({ title: 'Passport deleted' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getPublicUrl = (slug: string) => `${window.location.origin}/p/${slug}`;

  const handleShowQR = (passport: { name: string; public_slug: string | null; category_data: unknown }) => {
    if (!passport.public_slug) return;
    const categoryData = (passport.category_data as Record<string, unknown>) || {};
    const counterfeitProtection = categoryData.counterfeit_protection_enabled === true;
    setSelectedPassport({ name: passport.name, slug: passport.public_slug, counterfeitProtection });
    setQrDialogOpen(true);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Skeleton className="h-8 w-32" /></div>;
  }

  const getCategoryIcon = (category: string) => {
    return categoryList.find(c => c.value === category)?.icon || '📦';
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Digital<span className="text-muted-foreground/60 font-normal">-</span>Product<span className="text-muted-foreground/60 font-normal">-</span>Passports <span className="text-muted-foreground font-normal">.com</span></h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Passports</h2>
          <Button asChild>
            <Link to="/passport/new"><Plus className="h-4 w-4 mr-2" /> Create New</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48" />)}
          </div>
        ) : passports.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No passports yet. Create your first one!</p>
              <Button asChild><Link to="/passport/new"><Plus className="h-4 w-4 mr-2" /> Create New</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {passports.map(passport => (
              <Card key={passport.id} className="overflow-hidden">
                {passport.image_url && (
                  <div className="h-32 bg-muted overflow-hidden">
                    <img src={passport.image_url} alt={passport.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>{getCategoryIcon(passport.category)}</span>
                    {passport.name}
                  </CardTitle>
                  <CardDescription className="capitalize">{passport.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(passport.updated_at).toLocaleDateString()}
                    </p>
                    <TooltipProvider>
                      <div className="flex items-center gap-1">
                        {passport.public_slug && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleShowQR(passport)}
                              >
                                <QrCode className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Show QR Code</TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => navigate(`/passport/${passport.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDuplicate(passport)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Duplicate</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(passport.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <QRCodeDialog
          open={qrDialogOpen}
          onOpenChange={setQrDialogOpen}
          url={selectedPassport ? getPublicUrl(selectedPassport.slug) : ''}
          productName={selectedPassport?.name || ''}
          showSecuritySealOverlay={selectedPassport?.counterfeitProtection || false}
        />
      </main>
    </div>
  );
}
