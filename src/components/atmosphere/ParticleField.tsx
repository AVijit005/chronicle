import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

interface Props {
  count?: number;
  className?: string;
  color?: string;
}

export function ParticleField({ count = 36, className, color = "rgba(255,255,255,0.55)" }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    const ob = new MutationObserver(() => setIsLight(document.documentElement.classList.contains('light')));
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsLight(document.documentElement.classList.contains('light'));
    return () => ob.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0,
      h = 0,
      dpr = 1;
    const parts: { x: number; y: number; r: number; vx: number; vy: number; o: number }[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      parts.length = 0;
      for (let i = 0; i < count; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.4 + 0.3,
          vx: (Math.random() - 0.5) * 0.08,
          vy: -(Math.random() * 0.08 + 0.02),
          o: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) {
          p.y = h + 5;
          p.x = Math.random() * w;
        }
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        ctx.beginPath();
        const baseColor = isLight ? "rgba(0,0,0,0.4)" : color;
        ctx.fillStyle = baseColor.replace(/[\d.]+\)$/g, `${p.o})`);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    init();
    tick();
    const onResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [count, color, reduced, isLight]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
