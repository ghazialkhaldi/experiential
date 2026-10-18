import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ORGANIZATION_CATEGORIES } from '@/lib/opportunities';

const readSaved = () => {
  try {
    return JSON.parse(localStorage.getItem('incompleteOrgData') || 'null');
  } catch {
    return null;
  }
};

/** Creates the organization record for an organization account. */
const OrganizationSetup = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useAuth();
  const saved = readSaved();
  const [form, setForm] = useState({
    name: saved?.name ?? '',
    category: saved?.category ?? '',
    description: saved?.description ?? '',
    website: '',
    address_line1: saved?.address_line1 ?? '',
    city: saved?.city ?? '',
    state: saved?.state ?? '',
    zip_code: saved?.zip_code ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const required: (keyof typeof form)[] = ['name', 'address_line1', 'city', 'state', 'zip_code'];
    if (required.some((k) => !form[k].trim())) return setError('Fill in the name and full address.');
    setBusy(true);
    const { error } = await supabase.from('organizations').insert({
      user_id: user!.id,
      name: form.name.trim(),
      category: form.category || null,
      description: form.description.trim() || null,
      website: form.website.trim() || null,
      address_line1: form.address_line1.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zip_code: form.zip_code.trim(),
    });
    setBusy(false);
    if (error) {
      console.error('Error saving organization:', error);
      return setError('We couldn’t save your organization. Please try again.');
    }
    localStorage.removeItem('incompleteOrgData');
    onComplete();
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="org-name">Organization name</Label>
        <Input id="org-name" autoComplete="organization" value={form.name} onChange={set('name')} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="org-category">
          Focus <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
          <SelectTrigger id="org-category">
            <SelectValue placeholder="Choose one" />
          </SelectTrigger>
          <SelectContent>
            {ORGANIZATION_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="org-description">
          About <span className="font-normal text-muted-foreground">(optional, shown on your listings)</span>
        </Label>
        <Textarea id="org-description" rows={3} value={form.description} onChange={set('description')} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="org-website">
          Website <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input id="org-website" type="url" inputMode="url" placeholder="example.org" value={form.website} onChange={set('website')} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="org-address">Street address</Label>
        <Input id="org-address" autoComplete="address-line1" value={form.address_line1} onChange={set('address_line1')} />
      </div>
      <div className="grid grid-cols-[1fr_5rem_6rem] gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="org-city">City</Label>
          <Input id="org-city" autoComplete="address-level2" value={form.city} onChange={set('city')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="org-state">State</Label>
          <Input id="org-state" autoComplete="address-level1" value={form.state} onChange={set('state')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="org-zip">ZIP</Label>
          <Input id="org-zip" autoComplete="postal-code" inputMode="numeric" value={form.zip_code} onChange={set('zip_code')} />
        </div>
      </div>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <Button type="submit" className="w-full" size="lg" disabled={busy}>
        {busy ? 'Saving…' : 'Save organization'}
      </Button>
    </form>
  );
};

export default OrganizationSetup;
