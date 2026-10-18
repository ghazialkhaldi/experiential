import { useEffect, useRef } from 'react';
import { BookOpen, HeartHandshake, PawPrint, ShoppingBasket, Sprout, Waves, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PORT_CREDIT as MAP } from './portCreditData';

/**
 * Full-bleed aerial map of Port Credit, Mississauga, drawn from
 * OpenStreetMap geometry in the hero's blue. A location dot walks a real
 * loop through the village and kinds of volunteer work light up as it
 * passes. Illustrative only: pins name activities, not postings.
 */

interface Pin {
  label: string;
  /** Which side of the marker the label sits on. */
  side?: 'left' | 'right';
  at: { x: number; y: number };
  color: string;
  icon: LucideIcon;
}

const PINS: Pin[] = [
  { label: 'Reading tutor', at: MAP.places.library, color: '#6E6BF0', icon: BookOpen, side: 'left' },
  { label: 'Food bank shift', at: MAP.places.foodBank, color: '#F08A24', icon: ShoppingBasket },
  { label: 'Dog walking', at: MAP.places.stLawrence, color: '#C27C3A', icon: PawPrint },
  { label: 'Shoreline cleanup', at: MAP.places.saddington, color: '#14A9BF', icon: Waves },
  { label: 'Tree planting', at: MAP.places.memorialPark, color: '#2FA65A', icon: Sprout, side: 'left' },
  { label: 'Senior visits', at: MAP.places.mississaugaRd, color: '#E2557A', icon: HeartHandshake },
];

const SPEED = 34; // map units (~2.3 m) per second
const NEAR_RADIUS = 190;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (x: number) => x * x * (3 - 2 * x);

/** Where the walker sits in the hero: in the open area right of the text. */
const anchorFor = (w: number, h: number) =>
  w >= 1024 ? { x: w * 0.72, y: h * 0.5, zoom: 1.05 } : { x: w * 0.6, y: h - 330, zoom: 0.95 };

const HeroMap = ({ className }: { className?: string }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const plane = planeRef.current;
    const route = routeRef.current;
    const dot = dotRef.current;
    if (!root || !plane || !route || !dot) return;

    const total = route.getTotalLength();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let s = total * 0.06;
    const start = route.getPointAtLength(s);
    let camX = start.x;
    let camY = start.y;
    let last = performance.now();
    let raf = 0;
    let running = false;
    let zoom = 0;

    const render = (dt: number) => {
      if (!reduceMotion) s = (s + SPEED * dt) % total;
      const p = route.getPointAtLength(s);
      const follow = dt === 0 ? 1 : Math.min(1, dt * 1.6);
      camX = lerp(camX, p.x, follow);
      camY = lerp(camY, p.y, follow);

      const anchor = anchorFor(root.clientWidth, root.clientHeight);
      if (anchor.zoom !== zoom) {
        zoom = anchor.zoom;
        plane.style.width = `${MAP.width * zoom}px`;
        plane.style.height = `${MAP.height * zoom}px`;
      }
      plane.style.transform = `translate3d(${Math.round(anchor.x - camX * zoom)}px, ${Math.round(anchor.y - camY * zoom)}px, 0)`;
      dot.style.transform = `translate3d(${p.x * zoom}px, ${p.y * zoom}px, 0)`;

      PINS.forEach((pin, i) => {
        const el = pinRefs.current[i];
        if (!el) return;
        const d = Math.hypot(pin.at.x - p.x, pin.at.y - p.y);
        const near = smoothstep(Math.max(0, Math.min(1, 1 - (d - 30) / NEAR_RADIUS)));
        el.style.setProperty('--near', near.toFixed(3));
        // The label only becomes a white callout once the walker is close.
        el.style.setProperty('--lit', Math.max(0, near * 2 - 1).toFixed(3));
      });
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      render(dt);
      if (running) raf = requestAnimationFrame(frame);
    };
    const play = () => {
      if (running || reduceMotion) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let onScreen = true;
    const sync = () => (onScreen && document.visibilityState === 'visible' ? play() : pause());
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(root);
    document.addEventListener('visibilitychange', sync);
    const onResize = () => render(0);
    window.addEventListener('resize', onResize);

    render(0);
    play();

    return () => {
      pause();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        ref={planeRef}
        className="absolute left-0 top-0"
        style={{ width: MAP.width, height: MAP.height }}
      >
        <MapArtwork routeRef={routeRef} />

        {PINS.map((pin, i) => (
          <div
            key={pin.label}
            ref={(el) => (pinRefs.current[i] = el)}
            className="absolute h-0 w-0"
            style={{ left: `${(pin.at.x / MAP.width) * 100}%`, top: `${(pin.at.y / MAP.height) * 100}%`, ['--near' as string]: 0, ['--lit' as string]: 0 }}
          >
            <PinMarker pin={pin} />
          </div>
        ))}

        <div ref={dotRef} className="absolute left-0 top-0 h-0 w-0">
          <span className="absolute -left-8 -top-8 h-16 w-16 rounded-full bg-white/25 [animation:locpulse_2.4s_cubic-bezier(0.16,1,0.3,1)_infinite]" />
          <span className="absolute -left-[10px] -top-[10px] h-5 w-5 rounded-full border-[3px] border-white bg-brand-dot shadow-[0_0_0_6px_rgba(255,255,255,0.12),0_3px_8px_rgba(5,15,50,0.5)]" />
        </div>
      </div>
    </div>
  );
};

const PinMarker = ({ pin }: { pin: Pin }) => {
  const Icon = pin.icon;
  return (
    <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
      <span
        className="relative grid h-7 w-7 place-items-center rounded-full ring-2 ring-white"
        style={{
          backgroundColor: pin.color,
          boxShadow: '0 calc(2px + var(--near) * 8px) calc(4px + var(--near) * 14px) rgba(4, 12, 40, calc(0.35 + var(--near) * 0.25))',
          transform: 'translateY(calc(var(--near) * -4px)) scale(calc(0.9 + var(--near) * 0.3))',
        }}
      >
        <Icon className="h-[15px] w-[15px] text-white" strokeWidth={2.3} />
      </span>
      <span
        className={cn(
          'absolute top-1/2 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[12px] font-semibold',
          pin.side === 'left' ? 'right-full mr-2' : 'left-full ml-2'
        )}
        style={{
          transform: 'translateY(calc(-50% - var(--near) * 4px))',
          color: 'rgb(calc(255 - var(--lit) * 230), calc(255 - var(--lit) * 225), calc(255 - var(--lit) * 200))',
          backgroundColor: 'rgba(255,255,255,var(--lit))',
          textShadow: '0 1px 3px rgba(4,12,40,calc(0.9 - var(--lit) * 0.9))',
          boxShadow: '0 6px 16px rgba(4,12,40,calc(var(--lit) * 0.3))',
        }}
      >
        {pin.label}
      </span>
    </div>
  );
};

/** Map layers in the hero's blue: land a shade lighter than the water. */
const MapArtwork = ({ routeRef }: { routeRef: React.RefObject<SVGPathElement> }) => (
  <svg
    viewBox={`0 0 ${MAP.width} ${MAP.height}`}
    className="absolute inset-0 h-full w-full"
    style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}
  >
    <rect width={MAP.width} height={MAP.height} fill="#22408F" />

    <g fill="#24518F">
      {MAP.parks.map((d, i) => (
        <path key={`p${i}`} d={d} />
      ))}
      {MAP.woods.map((d, i) => (
        <path key={`w${i}`} d={d} />
      ))}
    </g>

    <g fill="#132A68">
      <path d={MAP.lake} stroke="#3A66C4" strokeWidth="1.5" />
      {MAP.ponds.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
    {MAP.rivers.map((d, i) => (
      <path key={`r${i}`} d={d} fill="none" stroke="#132A68" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
    ))}
    {MAP.islands.map((d, i) => (
      <path key={`i${i}`} d={d} fill="#24518F" />
    ))}
    {MAP.piers.map((d, i) => (
      <path key={`pr${i}`} d={d} fill="#2D58AE" />
    ))}
    {MAP.pierLines.map((d, i) => (
      <path key={`pl${i}`} d={d} fill="none" stroke="#2D58AE" strokeWidth="3.5" strokeLinecap="round" />
    ))}

    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={MAP.rail} stroke="#4F73C9" strokeWidth="2.5" strokeDasharray="7 5" />
      <path d={MAP.roads.minor} stroke="#3459B2" strokeWidth="3.5" />
      <path d={MAP.roads.secondary} stroke="#4A72CB" strokeWidth="6" />
      <path d={MAP.roads.primary} stroke="#6E93E3" strokeWidth="7.5" />
      <path d={MAP.roads.major} stroke="#8FB0F0" strokeWidth="10" />
    </g>

    {/* The walker's route: geometry only, not drawn */}
    <path ref={routeRef} d={MAP.route} fill="none" stroke="none" />

    <g paintOrder="stroke" stroke="#22408F" strokeWidth="4" strokeLinejoin="round" fontWeight="600">
      {MAP.streetLabels.map((l) => (
        <text
          key={l.text}
          x={l.x}
          y={l.y}
          dy="4"
          textAnchor="middle"
          fontSize="12"
          fill="#B9CCF5"
          transform={`rotate(${l.angle} ${l.x} ${l.y})`}
        >
          {l.text}
        </text>
      ))}
      {MAP.parkLabels.map((l) => (
        <text key={l.text} x={l.x} y={l.y} textAnchor="middle" fontSize="11.5" fill="#9FD0D8" stroke="#24518F">
          {l.text}
        </text>
      ))}
      <text x={MAP.places.portCredit.x} y={MAP.places.portCredit.y} textAnchor="middle" fontSize="15" letterSpacing="5" fill="#C9D7F7">
        PORT CREDIT
      </text>
    </g>
    <g fontStyle="italic" fontWeight="600" fill="#5E86D8">
      <text x={MAP.places.lakeOntario.x} y={MAP.places.lakeOntario.y} textAnchor="middle" fontSize="24" letterSpacing="3">
        Lake Ontario
      </text>
      <text x={MAP.places.creditRiver.x} y={MAP.places.creditRiver.y} textAnchor="middle" fontSize="13">
        Credit River
      </text>
    </g>
  </svg>
);

export default HeroMap;
