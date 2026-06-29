import { useEffect, useMemo, useRef } from 'react';

/**
 * Parallax Himalayan mountains — completing the Jammu & Kashmir scene 🏔️
 *
 * Layered snow-capped silhouettes anchored to the bottom of the viewport. Each
 * range sits at a different depth and parallax-shifts with the cursor (far ranges
 * drift slowly, near ranges more), giving the static peaks a sense of 3D volume.
 * Rendered behind the snowfall so flakes fall in front of the mountains.
 */

const VB_W = 1440;
const VB_H = 420;
const BASE_Y = VB_H;

type Peak = [number, number]; // [x, y]

// Build a closed silhouette path through a set of ridge peaks down to the base.
function ridgePath(peaks: Peak[]): string {
  const pts = peaks.map(([x, y]) => `${x},${y}`).join(' L');
  return `M${peaks[0][0]},${BASE_Y} L${pts} L${peaks[peaks.length - 1][0]},${BASE_Y} Z`;
}

// Little snow caps sitting on the sharper peaks.
function caps(peaks: Peak[], capW: number, capH: number): string {
  return peaks
    .filter(([, y]) => y < BASE_Y - 60) // only cap the prominent summits
    .map(([x, y]) => `M${x - capW},${y + capH} L${x},${y} L${x + capW},${y + capH} L${x - capW * 0.35},${y + capH * 0.85} L${x + capW * 0.2},${y + capH} Z`)
    .join(' ');
}

interface LayerDef {
  peaks: Peak[];
  fillDark: string;
  fillLight: string;
  capDark: string;
  capLight: string;
  capW: number;
  capH: number;
  parallax: number; // px of horizontal shift at full cursor deflection
}

const LAYERS: LayerDef[] = [
  // Far range — tall, pale, slow parallax
  {
    peaks: [[0, 170], [150, 90], [300, 150], [470, 60], [640, 140], [820, 80], [1000, 150], [1180, 70], [1320, 130], [1440, 110]],
    fillDark: '#1b2740',
    fillLight: '#b9c9e6',
    capDark: 'rgba(226,236,255,0.55)',
    capLight: 'rgba(255,255,255,0.9)',
    capW: 26,
    capH: 42,
    parallax: 6,
  },
  // Mid range
  {
    peaks: [[0, 250], [180, 170], [360, 240], [540, 150], [740, 230], [930, 160], [1120, 240], [1300, 175], [1440, 230]],
    fillDark: '#141d31',
    fillLight: '#9fb4d8',
    capDark: 'rgba(214,228,255,0.45)',
    capLight: 'rgba(255,255,255,0.85)',
    capW: 30,
    capH: 46,
    parallax: 12,
  },
  // Near range — dark, foreground, fastest parallax
  {
    peaks: [[0, 330], [220, 250], [430, 330], [640, 240], [860, 330], [1080, 250], [1280, 330], [1440, 280]],
    fillDark: '#0a0f1c',
    fillLight: '#7d96c2',
    capDark: 'rgba(200,216,250,0.35)',
    capLight: 'rgba(255,255,255,0.8)',
    capW: 34,
    capH: 50,
    parallax: 20,
  },
];

export default function Mountains() {
  const layerRefs = useRef<(SVGGElement | null)[]>([]);

  // Paths are static — compute once.
  const layers = useMemo(
    () =>
      LAYERS.map((l) => ({
        ...l,
        ridge: ridgePath(l.peaks),
        cap: caps(l.peaks, l.capW, l.capH),
      })),
    []
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let targetX = 0;
    let targetY = 0;
    const cur = LAYERS.map(() => ({ x: 0, y: 0 }));

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;   // -1..1
      targetY = (e.clientY / window.innerHeight) * 2 - 1;  // -1..1
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      LAYERS.forEach((l, i) => {
        const g = layerRefs.current[i];
        if (!g) return;
        // Near layers move opposite to cursor and a touch more vertically.
        const tx = -targetX * l.parallax;
        const ty = -targetY * (l.parallax * 0.25);
        cur[i].x += (tx - cur[i].x) * 0.05;
        cur[i].y += (ty - cur[i].y) * 0.05;
        g.setAttribute('transform', `translate(${cur[i].x.toFixed(2)} ${cur[i].y.toFixed(2)})`);
      });
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  // Theme is read at render; CSS classes drive the dark/light fills.
  return (
    <div
      aria-hidden="true"
      className="snow-mountains fixed bottom-0 left-0 w-full pointer-events-none"
      style={{ zIndex: 0, height: '45vh', maxHeight: 460 }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMax slice"
        width="100%"
        height="100%"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* Soft moon glow + aurora behind the peaks */}
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(186,222,255,0.55)" />
            <stop offset="40%" stopColor="rgba(140,180,230,0.18)" />
            <stop offset="100%" stopColor="rgba(140,180,230,0)" />
          </radialGradient>
          <linearGradient id="auroraGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(34,211,238,0)" />
            <stop offset="30%" stopColor="rgba(34,211,238,0.22)" />
            <stop offset="55%" stopColor="rgba(74,222,128,0.16)" />
            <stop offset="82%" stopColor="rgba(168,85,247,0.20)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </linearGradient>
          <filter id="auroraBlur" x="-20%" y="-60%" width="140%" height="240%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        {/* Aurora ribbon drifting above the mountains */}
        <g className="snow-aurora" filter="url(#auroraBlur)">
          <path
            d="M-150,130 C 250,40 650,160 1050,70 S 1650,130 1650,130 L1650,230 L-150,230 Z"
            fill="url(#auroraGrad)"
          />
        </g>

        <circle cx={1150} cy={70} r={150} fill="url(#moonGlow)" />
        <circle cx={1150} cy={70} r={34} fill="rgba(235,244,255,0.92)" />

        {layers.map((l, i) => (
          <g
            key={i}
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
          >
            <path d={l.ridge} style={{ fill: l.fillDark }} />
            <path d={l.cap} style={{ fill: l.capDark }} />
          </g>
        ))}
      </svg>
    </div>
  );
}
