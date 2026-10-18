import { Check } from 'lucide-react';
import { PASSWORD_RULES } from '@/lib/password';
import { cn } from '@/lib/utils';

const PasswordChecklist = ({ password, id }: { password: string; id?: string }) => (
  <ul id={id} className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs" aria-label="Password requirements">
    {PASSWORD_RULES.map((rule) => {
      const ok = rule.test(password);
      return (
        <li key={rule.label} className={cn('flex items-center gap-1 transition-colors', ok ? 'text-success' : 'text-muted-foreground')}>
          <Check className={cn('h-3 w-3', !ok && 'opacity-30')} aria-hidden />
          {rule.label}
          <span className="sr-only">{ok ? '(met)' : '(not met)'}</span>
        </li>
      );
    })}
  </ul>
);

export default PasswordChecklist;
