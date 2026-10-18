import { cn } from '@/lib/utils';

interface ExperientialLogoProps {
  className?: string;
  /** Use the light wordmark on dark surfaces. */
  inverse?: boolean;
}

const ExperientialLogo = ({ className, inverse = false }: ExperientialLogoProps) => (
  <img
    src={inverse ? '/brand/wordmark-light.png' : '/brand/wordmark.png'}
    alt="Experiential"
    width={724}
    height={134}
    className={cn('h-6 w-auto select-none', className)}
    draggable={false}
  />
);

export default ExperientialLogo;
