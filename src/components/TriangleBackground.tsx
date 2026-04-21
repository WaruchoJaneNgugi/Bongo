import { useEffect, useRef } from 'react';

interface Triangle {
  x: number; y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  speed: number;
  opacity: number;
  strokeWidth: number;
  color: string;
}

interface Star {
  x: number; y: number;
  radius: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
}

const COLORS = [
  'rgba(139,92,246,',   // violet
  'rgba(167,139,250,',  // lavender
  'rgba(196,181,253,',  // light purple
  'rgba(236,72,153,',   // pink accent
];

function buildTriangles(w: number, h: number): Triangle[] {
  const triangles: Triangle[] = [];
  const count = 38;
  for (let i = 0; i < count; i++) {
    triangles.push({
      x: Math.random() * w,
      y: Math.random() * h * 2.5,
      size: 40 + Math.random() * 120,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.008,
      speed: 0.05 + Math.random() * 0.25,
      opacity: 0.06 + Math.random() * 0.18,
      strokeWidth: 0.8 + Math.random() * 1.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }
  return triangles;
}

function buildStars(w: number, h: number): Star[] {
  const stars: Star[] = [];
  const count = 80;
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h * 2.5,
      radius: 0.5 + Math.random() * 2.5,
      speed: 0.02 + Math.random() * 0.12,
      opacity: 0.2 + Math.random() * 0.6,
      twinkleSpeed: 0.01 + Math.random() * 0.03,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }
  return stars;
}

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  t: Triangle,
  scrollY: number
) {
  const y = t.y - scrollY * t.speed;
  ctx.save();
  ctx.translate(t.x, y);
  ctx.rotate(t.rotation);
  ctx.beginPath();
  const h = (t.size * Math.sqrt(3)) / 2;
  ctx.moveTo(0, -h * 0.667);
  ctx.lineTo(t.size / 2, h * 0.333);
  ctx.lineTo(-t.size / 2, h * 0.333);
  ctx.closePath();
  ctx.strokeStyle = `${t.color}${t.opacity})`;
  ctx.lineWidth = t.strokeWidth;
  ctx.stroke();
  ctx.restore();
}

export function TriangleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trianglesRef = useRef<Triangle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const scrollRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      trianglesRef.current = buildTriangles(canvas.width, canvas.height);
      starsRef.current = buildStars(canvas.width, canvas.height);
    };

    const render = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw stars + constellation lines
      const visibleStars = starsRef.current.map(s => ({
        ...s,
        vy: s.y - scrollRef.current * s.speed,
      }));

      // lines first (drawn under stars)
      for (let i = 0; i < visibleStars.length; i++) {
        for (let j = i + 1; j < visibleStars.length; j++) {
          const a = visibleStars[i], b = visibleStars[j];
          const dx = a.x - b.x, dy = a.vy - b.vy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.vy);
            ctx.lineTo(b.x, b.vy);
            ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // stars on top
      visibleStars.forEach((s, i) => {
        const twinkle = Math.sin(frameRef.current * starsRef.current[i].twinkleSpeed + starsRef.current[i].twinkleOffset);
        const alpha = s.opacity * (0.6 + 0.4 * twinkle);
        ctx.beginPath();
        ctx.arc(s.x, s.vy, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${alpha})`;
        ctx.fill();
      });

      // draw triangles
      trianglesRef.current.forEach(t => {
        t.rotation += t.rotationSpeed;
        drawTriangle(ctx, t, scrollRef.current);
      });

      rafRef.current = requestAnimationFrame(render);
    };

    const onScroll = () => { scrollRef.current = window.scrollY; };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
