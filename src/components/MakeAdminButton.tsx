import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

export function MakeAdminButton() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const makeAdmin = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You are now an admin. Refresh the page to see admin features.",
      });

      // Refresh the page to update the UI
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error making admin:', error);
      toast({
        title: "Error",
        description: "Failed to make admin",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={makeAdmin} 
      disabled={loading}
      className="flex items-center gap-2"
      variant="outline"
    >
      <Shield className="h-4 w-4" />
      {loading ? 'Making Admin...' : 'Make Me Admin'}
    </Button>
  );
}