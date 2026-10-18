import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES } from '@/lib/opportunities';

export interface OpportunityFormValues {
  title: string;
  category: string;
  description: string;
  time_commitment: string;
  location: string;
  requirements: string;
  max_volunteers: string;
  start_date: string;
  end_date: string;
  expires_at: string;
  resume_required: boolean;
}

export const emptyOpportunity = (location = ''): OpportunityFormValues => ({
  title: '',
  category: '',
  description: '',
  time_commitment: '',
  location,
  requirements: '',
  max_volunteers: '',
  start_date: '',
  end_date: '',
  expires_at: '',
  resume_required: false,
});

/** Convert form values into an `opportunities` row payload. */
export const toOpportunityRow = (v: OpportunityFormValues) => ({
  title: v.title.trim(),
  category: v.category,
  description: v.description.trim(),
  time_commitment: v.time_commitment.trim(),
  location: v.location.trim(),
  requirements: v.requirements.trim() || null,
  max_volunteers: v.max_volunteers ? parseInt(v.max_volunteers, 10) : null,
  start_date: v.start_date || null,
  end_date: v.end_date || null,
  expires_at: v.expires_at ? new Date(`${v.expires_at}T23:59:59`).toISOString() : null,
  resume_required: v.resume_required,
});

const validate = (v: OpportunityFormValues) => {
  const errors: Partial<Record<keyof OpportunityFormValues, string>> = {};
  if (!v.title.trim()) errors.title = 'Give the opportunity a title.';
  if (!v.category) errors.category = 'Choose a category.';
  if (v.description.trim().length < 20) errors.description = 'Describe the role in at least a sentence or two.';
  if (!v.time_commitment.trim()) errors.time_commitment = 'Say how much time it takes.';
  if (!v.location.trim()) errors.location = 'Add where volunteers will serve.';
  if (v.max_volunteers && (!/^\d+$/.test(v.max_volunteers) || parseInt(v.max_volunteers, 10) < 1))
    errors.max_volunteers = 'Use a whole number of 1 or more.';
  if (v.start_date && v.end_date && v.end_date < v.start_date) errors.end_date = 'End date can’t be before the start date.';
  return errors;
};

interface OpportunityFormProps {
  initial: OpportunityFormValues;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (values: OpportunityFormValues) => Promise<void>;
  onCancel?: () => void;
}

const OpportunityForm = ({ initial, submitLabel, submittingLabel, onSubmit, onCancel }: OpportunityFormProps) => {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});
  const [submitting, setSubmitting] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const set = <K extends keyof OpportunityFormValues>(key: K, value: OpportunityFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    const firstError = Object.keys(next)[0];
    if (firstError) {
      document.getElementById(`opp-${firstError}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof OpportunityFormValues) => ({
    id: `opp-${key}`,
    'aria-invalid': !!errors[key] || undefined,
    'aria-describedby': errors[key] ? `opp-${key}-error` : undefined,
  });

  const Error = ({ name }: { name: keyof OpportunityFormValues }) =>
    errors[name] ? (
      <p id={`opp-${name}-error`} className="text-sm text-destructive">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="opp-title">Title</Label>
        <Input {...field('title')} value={values.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Saturday reading buddy" />
        <Error name="title" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="opp-category">Category</Label>
          <Select value={values.category} onValueChange={(v) => set('category', v)}>
            <SelectTrigger {...field('category')}>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Error name="category" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="opp-time_commitment">Time commitment</Label>
          <Input
            {...field('time_commitment')}
            value={values.time_commitment}
            onChange={(e) => set('time_commitment', e.target.value)}
            placeholder="e.g. 3 hours, Saturdays"
          />
          <Error name="time_commitment" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="opp-description">Description</Label>
        <Textarea
          {...field('description')}
          rows={6}
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="What will volunteers do? Who will they work with? What will they learn?"
        />
        <Error name="description" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="opp-location">Location</Label>
        <Input {...field('location')} value={values.location} onChange={(e) => set('location', e.target.value)} placeholder="Street, city, state" />
        <p className="text-sm text-muted-foreground">Include the city so students searching nearby can find it.</p>
        <Error name="location" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="opp-requirements">
          Requirements <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          {...field('requirements')}
          rows={3}
          value={values.requirements}
          onChange={(e) => set('requirements', e.target.value)}
          placeholder="e.g. Ages 15+, comfortable around dogs"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="opp-start_date">
            Start date <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input {...field('start_date')} type="date" min={today} value={values.start_date} onChange={(e) => set('start_date', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="opp-end_date">
            End date <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            {...field('end_date')}
            type="date"
            min={values.start_date || today}
            value={values.end_date}
            onChange={(e) => set('end_date', e.target.value)}
          />
          <Error name="end_date" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="opp-max_volunteers">
            Volunteers needed <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            {...field('max_volunteers')}
            inputMode="numeric"
            value={values.max_volunteers}
            onChange={(e) => set('max_volunteers', e.target.value)}
            placeholder="No limit"
          />
          <Error name="max_volunteers" />
        </div>
      </div>

      <div className="space-y-1.5 sm:max-w-[calc(33.333%-1rem)]">
        <Label htmlFor="opp-expires_at">
          Apply by <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input {...field('expires_at')} type="date" min={today} value={values.expires_at} onChange={(e) => set('expires_at', e.target.value)} />
      </div>

      <label htmlFor="opp-resume_required" className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-4">
        <Checkbox
          id="opp-resume_required"
          checked={values.resume_required}
          onCheckedChange={(c) => set('resume_required', c === true)}
          className="mt-0.5"
        />
        <span>
          <span className="block text-sm font-medium">Require a resume</span>
          <span className="block text-sm text-muted-foreground">Applicants must attach one before they can apply.</span>
        </span>
      </label>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default OpportunityForm;
