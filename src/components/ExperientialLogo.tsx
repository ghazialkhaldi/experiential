import { cn } from '@/lib/utils';

/**
 * The original Experiential logo files, shown as-is. The files carry empty
 * padding around the wordmark, so a wrapper crops to the wordmark's bounds
 * (measured from each file) with CSS; the artwork itself is untouched.
 */
const SOURCES = {
  // The original logo; its white background is blended away on light surfaces.
  light: { src: '/Experiential.jpeg', width: 500, height: 200, box: { x: 4, y: 59, w: 495, h: 96 }, blend: true },
  // The original white version for dark surfaces.
  dark: { src: '/Experiential%204.png', width: 750, height: 500, box: { x: 17, y: 191, w: 715, h: 131 }, blend: false },
} as const;

interface ExperientialLogoProps {
  /** Height of the wordmark in pixels. */
  height?: number;
  /** Use the white logo on dark surfaces. */
  inverse?: boolean;
  className?: string;
}

const ExperientialLogo = ({ height = 28, inverse = false, className }: ExperientialLogoProps) => {
  const source = inverse ? SOURCES.dark : SOURCES.light;
  const scale = height / source.box.h;

  return (
    <span
      className={cn('relative inline-block shrink-0 overflow-hidden align-middle', className)}
      style={{ height, width: Math.round(source.box.w * scale) }}
    >
      <img
        src={source.src}
        alt="Experiential"
        width={source.width}
        height={source.height}
        draggable={false}
        className="absolute max-w-none select-none"
        style={{
          width: source.width * scale,
          height: source.height * scale,
          left: -source.box.x * scale,
          top: -source.box.y * scale,
          mixBlendMode: source.blend ? 'multiply' : undefined,
        }}
      />
    </span>
  );
};

export default ExperientialLogo;
