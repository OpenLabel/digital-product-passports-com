import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Passport, PassportFormData, ProductCategory } from '@/types/passport';

export function usePassports() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: passports, isLoading, error } = useQuery({
    queryKey: ['passports', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('passports')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Passport[];
    },
    enabled: !!user,
  });

  const createPassport = useMutation({
    mutationFn: async (formData: PassportFormData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('passports')
        .insert([{
          user_id: user.id,
          name: formData.name,
          category: formData.category,
          image_url: formData.image_url,
          description: formData.description,
          language: formData.language,
          category_data: formData.category_data,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Passport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passports', user?.id] });
    },
  });

  const updatePassport = useMutation({
    mutationFn: async ({ id, ...formData }: PassportFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('passports')
        .update({
          name: formData.name,
          category: formData.category,
          image_url: formData.image_url,
          description: formData.description,
          language: formData.language,
          category_data: formData.category_data,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Passport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passports', user?.id] });
    },
  });

  const duplicatePassport = useMutation({
    mutationFn: async (passport: Passport) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('passports')
        .insert([{
          user_id: user.id,
          name: `${passport.name} (Copy)`,
          category: passport.category,
          image_url: passport.image_url,
          description: passport.description,
          language: passport.language,
          category_data: passport.category_data,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Passport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passports', user?.id] });
    },
  });

  const deletePassport = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('passports')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passports', user?.id] });
    },
  });

  return {
    passports: passports || [],
    isLoading,
    error,
    createPassport,
    updatePassport,
    duplicatePassport,
    deletePassport,
  };
}

export function usePassportBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['passport', 'public', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('passports')
        .select('*')
        .eq('public_slug', slug)
        .single();
      
      if (error) throw error;
      return data as Passport;
    },
    enabled: !!slug,
  });
}

export function usePassportById(id: string | undefined) {
  return useQuery({
    queryKey: ['passport', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('passports')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Passport;
    },
    enabled: !!id,
  });
}
