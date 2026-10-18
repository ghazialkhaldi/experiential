import { useEffect, useState } from 'react';
import { Check, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageShell, PageHeader } from '@/components/layout/PageShell';
import { cn } from '@/lib/utils';

interface Item {
  id: string;
  text: string;
  done: boolean;
}

interface Section {
  id: string;
  title: string;
  items: Item[];
}

const STORAGE_KEY = 'exp.checklist.v1';

const DEFAULT_SECTIONS: Section[] = [
  {
    id: 'academic',
    title: 'Academics',
    items: [
      'Plan a challenging course load for junior and senior year',
      'Take the SAT or ACT (if your schools want scores)',
      'Ask two teachers for recommendation letters',
      'Request your official transcript',
    ],
  },
  {
    id: 'activities',
    title: 'Activities & service',
    items: [
      'Keep a running log of volunteer hours',
      'Take on a leadership role in a club or project',
      'Lead or start a community project',
      'Write short descriptions of your top activities',
    ],
  },
  {
    id: 'applications',
    title: 'Applications',
    items: [
      'Build a balanced school list',
      'Put every deadline on a calendar',
      'Draft and revise your personal essay',
      'Write school-specific supplements',
      'Submit applications and confirm they were received',
    ],
  },
  {
    id: 'aid',
    title: 'Financial aid & scholarships',
    items: [
      'Submit the FAFSA',
      'Submit the CSS Profile if your schools require it',
      'Apply to service and merit scholarships',
      'Compare financial aid offers',
    ],
  },
].map((s) => ({ ...s, items: s.items.map((text, i) => ({ id: `${s.id}-${i}`, text, done: false })) }));

const load = (): Section[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Section[]) : DEFAULT_SECTIONS;
  } catch {
    return DEFAULT_SECTIONS;
  }
};

const UniversityChecklist = () => {
  const [sections, setSections] = useState<Section[]>(load);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
    } catch {
      // Progress just won't persist in this browser.
    }
  }, [sections]);

  const updateItems = (sectionId: string, fn: (items: Item[]) => Item[]) =>
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, items: fn(s.items) } : s)));

  const add = (sectionId: string) => {
    const text = drafts[sectionId]?.trim();
    if (!text) return;
    updateItems(sectionId, (items) => [...items, { id: `${sectionId}-${Date.now()}`, text, done: false }]);
    setDrafts((d) => ({ ...d, [sectionId]: '' }));
  };

  const saveEdit = (sectionId: string) => {
    if (!editing?.text.trim()) return setEditing(null);
    updateItems(sectionId, (items) => items.map((i) => (i.id === editing.id ? { ...i, text: editing.text.trim() } : i)));
    setEditing(null);
  };

  const all = sections.flatMap((s) => s.items);
  const done = all.filter((i) => i.done).length;

  return (
    <PageShell width="narrow">
      <PageHeader
        title="Application checklist"
        description="Check things off as you go. Your progress is saved in this browser."
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset the checklist to the default items? Your checkmarks and custom items will be cleared.')) {
                setSections(DEFAULT_SECTIONS);
              }
            }}
          >
            <RotateCcw />
            Reset
          </Button>
        }
      />

      <div className="mb-10">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-medium">Overall progress</span>
          <span className="tabular text-muted-foreground">
            {done} of {all.length}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={all.length} aria-valuenow={done}>
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out-expo"
            style={{ width: all.length ? `${(done / all.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      <div className="space-y-12">
        {sections.map((section) => {
          const sectionDone = section.items.filter((i) => i.done).length;
          return (
            <section key={section.id} aria-labelledby={`sec-${section.id}`}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 id={`sec-${section.id}`} className="text-xl font-semibold">
                  {section.title}
                </h2>
                <span className="tabular text-sm text-muted-foreground">
                  {sectionDone}/{section.items.length}
                </span>
              </div>

              <ul className="mt-3 divide-y divide-border border-y border-border">
                {section.items.map((item) => (
                  <li key={item.id} className="group flex items-center gap-3 py-3">
                    <button
                      onClick={() => updateItems(section.id, (items) => items.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i)))}
                      role="checkbox"
                      aria-checked={item.done}
                      aria-label={item.text}
                      className={cn(
                        'grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border transition-colors',
                        item.done ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-card hover:border-primary'
                      )}
                    >
                      {item.done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </button>

                    {editing?.id === item.id ? (
                      <Input
                        autoFocus
                        value={editing.text}
                        onChange={(e) => setEditing({ id: item.id, text: e.target.value })}
                        onBlur={() => saveEdit(section.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(section.id);
                          if (e.key === 'Escape') setEditing(null);
                        }}
                        className="h-8"
                        aria-label="Edit item"
                      />
                    ) : (
                      <span className={cn('flex-1 text-[0.95rem]', item.done && 'text-muted-foreground line-through decoration-muted-foreground/50')}>
                        {item.text}
                      </span>
                    )}

                    {editing?.id !== item.id && (
                      <div className="flex gap-0.5 opacity-100 md:opacity-0 md:transition-opacity md:focus-within:opacity-100 md:group-hover:opacity-100">
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Edit “${item.text}”`} onClick={() => setEditing({ id: item.id, text: item.text })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          aria-label={`Delete “${item.text}”`}
                          onClick={() => updateItems(section.id, (items) => items.filter((i) => i.id !== item.id))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  add(section.id);
                }}
              >
                <Input
                  value={drafts[section.id] ?? ''}
                  onChange={(e) => setDrafts((d) => ({ ...d, [section.id]: e.target.value }))}
                  placeholder="Add your own item"
                  aria-label={`Add item to ${section.title}`}
                  className="h-9"
                />
                <Button type="submit" variant="outline" size="sm" className="h-9" disabled={!drafts[section.id]?.trim()}>
                  <Plus />
                  Add
                </Button>
              </form>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
};

export default UniversityChecklist;
