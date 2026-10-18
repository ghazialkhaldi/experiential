import { useState } from 'react';
import { ChevronDown, Loader2, LocateFixed, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { describePlace, useLocation } from '@/hooks/useLocation';
import { cn } from '@/lib/utils';

const LocationSelector = ({ className }: { className?: string }) => {
  const { location, loading, error, detectLocation, setManualLocation, clearLocation } = useLocation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const label = loading ? 'Finding…' : describePlace(location) || 'Anywhere';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await setManualLocation(value)) {
      setValue('');
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn('h-12 justify-between gap-2 px-3.5 font-medium', className)}
          aria-label={`Location: ${label}. Change location`}
        >
          <span className="flex min-w-0 items-center gap-2">
            {loading ? (
              <Loader2 className="animate-spin text-primary" />
            ) : (
              <MapPin className={location ? 'text-primary' : 'text-muted-foreground'} />
            )}
            <span className="truncate">{label}</span>
          </span>
          <ChevronDown className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(20rem,calc(100vw-2rem))] p-4" align="start">
        <form onSubmit={submit} className="space-y-2">
          <Label htmlFor="location-input">City or town</Label>
          <div className="flex gap-2">
            <Input
              id="location-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. Austin"
              autoComplete="address-level2"
            />
            <Button type="submit" disabled={!value.trim() || loading}>
              Set
            </Button>
          </div>
        </form>

        {error && (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="mt-3 flex flex-col gap-1 border-t pt-3">
          <Button type="button" variant="ghost" className="justify-start" onClick={detectLocation} disabled={loading}>
            <LocateFixed />
            Use my current location
          </Button>
          {location && (
            <Button
              type="button"
              variant="ghost"
              className="justify-start text-muted-foreground"
              onClick={() => {
                clearLocation();
                setOpen(false);
              }}
            >
              <X />
              Clear location
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
