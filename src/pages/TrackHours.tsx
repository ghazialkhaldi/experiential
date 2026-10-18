import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Download, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PageShell, PageHeader, EmptyState, RequireAuth, ListSkeleton } from '@/components/layout/PageShell';
import { useVolunteerHours, type VolunteerHour } from '@/hooks/useVolunteerHours';
import { CATEGORIES, categoryLabel, formatDate } from '@/lib/opportunities';

interface LogHoursForm {
  title: string;
  organization: string;
  hours: string;
  date_completed: string;
  category: string;
}

const GOAL_KEY = 'volunteerHourGoal';

const formatLocalDate = (d: string) => formatDate(d.slice(0, 10));

const formatHours = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1));

const exportCsv = (rows: VolunteerHour[]) => {
  const escape = (v: string | number | undefined | null) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [
    ['Date', 'Activity', 'Organization', 'Hours', 'Category'].join(','),
    ...rows.map((r) => [r.date_completed, r.title, r.organization, r.hours, categoryLabel(r.category)].map(escape).join(',')),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `volunteer-hours-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const HoursLog = () => {
  const { hours, loading, addHours, deleteHours, totalHours } = useVolunteerHours();
  const [goal, setGoal] = useState(() => {
    try {
      return parseInt(localStorage.getItem(GOAL_KEY) || '', 10) || 50;
    } catch {
      return 50;
    }
  });
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState('');
  const [logOpen, setLogOpen] = useState(false);
  const [deleting, setDeleting] = useState<VolunteerHour | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<LogHoursForm>({
    defaultValues: { date_completed: today, category: '' },
  });

  const onSubmit = async (data: LogHoursForm) => {
    const ok = await addHours({
      title: data.title.trim(),
      organization: data.organization.trim(),
      hours: parseFloat(data.hours),
      date_completed: data.date_completed,
      category: data.category || undefined,
    });
    if (ok) {
      reset({ title: '', organization: '', hours: '', date_completed: today, category: '' });
      setLogOpen(false);
    }
  };

  const saveGoal = () => {
    const value = parseInt(goalDraft, 10);
    if (value > 0) {
      setGoal(value);
      try {
        localStorage.setItem(GOAL_KEY, String(value));
      } catch {
        // Goal just won't persist.
      }
    }
    setEditingGoal(false);
  };

  if (loading) return <ListSkeleton />;

  const pct = Math.min(100, (totalHours / goal) * 100);
  const organizations = new Set(hours.map((h) => h.organization.trim().toLowerCase())).size;

  return (
    <>
      <div className="relative isolate mb-10 grid gap-6 overflow-hidden rounded-xl bg-brand-field p-6 text-white shadow-[0_24px_48px_-20px_hsl(var(--blue-field-deep)/0.6)] md:grid-cols-[auto_1fr] md:items-center md:gap-12 md:p-8">
        <div>
          <p className="tabular font-display text-6xl font-semibold leading-none tracking-tight text-white">
            {formatHours(totalHours)}
            <span className="ml-2 font-sans text-xl font-medium text-ink-foreground/70">hours logged</span>
          </p>
          <p className="mt-3 text-sm text-ink-foreground/75">
            <span className="tabular">{hours.length}</span> {hours.length === 1 ? 'entry' : 'entries'} across{' '}
            <span className="tabular">{organizations}</span> {organizations === 1 ? 'organization' : 'organizations'}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="font-medium">
              Goal:{' '}
              {editingGoal ? (
                <span className="inline-flex items-center gap-2">
                  <Input
                    autoFocus
                    inputMode="numeric"
                    aria-label="Hour goal"
                    className="inline-flex h-8 w-20 text-foreground"
                    value={goalDraft}
                    onChange={(e) => setGoalDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveGoal()}
                  />
                  <Button size="sm" variant="secondary" onClick={saveGoal}>
                    Save
                  </Button>
                </span>
              ) : (
                <button
                  className="tabular underline decoration-dotted underline-offset-4 hover:text-brand-line"
                  onClick={() => {
                    setGoalDraft(String(goal));
                    setEditingGoal(true);
                  }}
                >
                  {goal} hours
                </button>
              )}
            </span>
            <span className="tabular text-ink-foreground/75">
              {totalHours >= goal ? 'Goal reached' : `${formatHours(goal - totalHours)} to go`}
            </span>
          </div>
          <div
            className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={goal}
            aria-valuenow={totalHours}
            aria-label="Progress toward hour goal"
          >
            <div className="h-full rounded-full bg-brand-line transition-[width] duration-700 ease-out-expo" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={() => setLogOpen(true)} className="bg-white text-brand-deep hover:bg-white/90">
              <Plus />
              Log hours
            </Button>
            <Button
              variant="outline"
              onClick={() => exportCsv(hours)}
              disabled={hours.length === 0}
              className="border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10 hover:text-white"
            >
              <Download />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <h2 className="mb-3 font-sans text-lg font-semibold tracking-tight">History</h2>
      {hours.length === 0 ? (
        <EmptyState
          title="No hours logged yet"
          description="Each time you volunteer, add the date, the organization, and how long you stayed."
          action={
            <Button onClick={() => setLogOpen(true)}>
              <Plus />
              Log your first hours
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {hours.map((h) => (
            <li key={h.id} className="group grid grid-cols-[1fr_auto_auto] items-center gap-4 py-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{h.title}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {h.organization}
                  {h.category && ` · ${categoryLabel(h.category)}`} · {formatLocalDate(h.date_completed)}
                </p>
              </div>
              <p className="tabular text-right font-semibold">
                {formatHours(h.hours)} <span className="text-sm font-normal text-muted-foreground">hrs</span>
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground opacity-100 hover:text-destructive md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100"
                aria-label={`Delete ${h.title} on ${formatLocalDate(h.date_completed)}`}
                onClick={() => setDeleting(h)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log hours</DialogTitle>
            <DialogDescription>Record time you spent volunteering.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="log-title">What did you do?</Label>
              <Input id="log-title" placeholder="e.g. Food bank sorting" {...register('title', { required: 'Add a short description.' })} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="log-org">Organization</Label>
              <Input id="log-org" placeholder="e.g. Central Texas Food Bank" {...register('organization', { required: 'Add the organization.' })} />
              {errors.organization && <p className="text-sm text-destructive">{errors.organization.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="log-hours">Hours</Label>
                <Input
                  id="log-hours"
                  type="number"
                  inputMode="decimal"
                  step="0.25"
                  min="0.25"
                  {...register('hours', {
                    required: 'Enter hours.',
                    validate: (v) => (parseFloat(v) > 0 && parseFloat(v) <= 24) || 'Between 0.25 and 24.',
                  })}
                />
                {errors.hours && <p className="text-sm text-destructive">{errors.hours.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="log-date">Date</Label>
                <Input
                  id="log-date"
                  type="date"
                  max={today}
                  {...register('date_completed', {
                    required: 'Pick a date.',
                    validate: (v) => v <= today || 'Can’t be in the future.',
                  })}
                />
                {errors.date_completed && <p className="text-sm text-destructive">{errors.date_completed.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="log-category">
                Category <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value || 'none'} onValueChange={(v) => field.onChange(v === 'none' ? '' : v)}>
                    <SelectTrigger id="log-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No category</SelectItem>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save hours'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && `${formatHours(deleting.hours)} hours at ${deleting.organization} on ${formatLocalDate(deleting.date_completed)} will be removed from your log.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleting && deleteHours(deleting.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const TrackHours = () => (
  <PageShell width="narrow">
    <PageHeader title="Volunteer hours" description="A running record of where you served and for how long." />
    <RequireAuth message="Sign in to log your volunteer hours and see your progress.">
      <HoursLog />
    </RequireAuth>
  </PageShell>
);

export default TrackHours;
