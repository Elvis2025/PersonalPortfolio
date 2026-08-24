import { useEffect, useRef } from 'react';

type NodePoint = { x: number; y: number; vx: number; vy: number; pulse: number };

export function ExperienceLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 768px)').matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let scrollDepth = window.scrollY;
    let nodes: NodePoint[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const seedNodes = () => {
      const count = reducedMotion ? 18 : compact ? 26 : Math.min(58, Math.round(width / 24));
      nodes = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (compact ? 0.13 : 0.2),
        vy: (Math.random() - 0.5) * (compact ? 0.13 : 0.2),
        pulse: index * 0.47
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedNodes();
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      const connectionDistance = compact ? 115 : 155;

      nodes.forEach((node, index) => {
        if (!reducedMotion && !document.hidden) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const distance = Math.hypot(dx, dy);
          if (pointer.active && distance < 170 && distance > 1) {
            node.vx += (dx / distance) * 0.0025;
            node.vy += (dy / distance) * 0.0025;
          }
          node.vx *= 0.997;
          node.vy *= 0.997;
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < -20) node.x = width + 20;
          if (node.x > width + 20) node.x = -20;
          if (node.y < -20) node.y = height + 20;
          if (node.y > height + 20) node.y = -20;
        }

        for (let nextIndex = index + 1; nextIndex < nodes.length; nextIndex += 1) {
          const next = nodes[nextIndex];
          const distance = Math.hypot(node.x - next.x, node.y - next.y);
          if (distance >= connectionDistance) continue;
          const alpha = (1 - distance / connectionDistance) * 0.2;
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(next.x, next.y);
          context.strokeStyle = `rgba(74, 194, 255, ${alpha})`;
          context.lineWidth = 0.7;
          context.stroke();

          if (!reducedMotion && (index + nextIndex) % 9 === 0) {
            const progress = (time * 0.00011 + node.pulse * 0.13) % 1;
            const pulseX = node.x + (next.x - node.x) * progress;
            const pulseY = node.y + (next.y - node.y) * progress;
            context.beginPath();
            context.arc(pulseX, pulseY, 1.35, 0, Math.PI * 2);
            context.shadowBlur = 9;
            context.shadowColor = 'rgba(94, 234, 212, .8)';
            context.fillStyle = 'rgba(186, 255, 244, .9)';
            context.fill();
            context.shadowBlur = 0;
          }
        }

        const glow = reducedMotion ? 0.55 : 0.5 + Math.sin(time * 0.0012 + node.pulse) * 0.22;
        context.beginPath();
        context.arc(node.x, node.y, 1.2 + glow, 0, Math.PI * 2);
        context.fillStyle = `rgba(116, 214, 255, ${0.45 + glow * 0.25})`;
        context.fill();
      });

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = event.pointerType === 'mouse';
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    };
    const onPointerLeave = () => { pointer.active = false; };
    const onScroll = () => {
      scrollDepth = window.scrollY;
      document.documentElement.style.setProperty('--scroll-depth', `${Math.min(scrollDepth * 0.035, 70)}px`);
      document.documentElement.style.setProperty('--scroll-phase', `${(scrollDepth * 0.012) % 360}deg`);
    };

    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const interactiveSelector = 'a, button, .skill-box, .service-item, .portfolio-card, .resume-card';
    const onMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('.skill-box, .service-item, .portfolio-card, .resume-card, .about .skill-item');
      if (target) {
        const rect = target.getBoundingClientRect();
        target.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        target.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      }
      document.body.classList.toggle('cursor-engaged', Boolean((event.target as HTMLElement).closest(interactiveSelector)));
    };
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('a, button');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'interaction-ripple';
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      target.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 650);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('click', onClick);
      document.body.classList.remove('cursor-engaged');
    };
  }, []);

  return (
    <div className="experience-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="neural-canvas" />
      <div className="ambient-orb ambient-orb-one" />
      <div className="ambient-orb ambient-orb-two" />
      <div className="orbital-spheres">
        <span className="orbital-sphere sphere-one" />
        <span className="orbital-sphere sphere-two" />
        <span className="orbital-sphere sphere-three" />
        <span className="orbital-sphere sphere-four" />
        <span className="orbital-sphere sphere-five" />
        <span className="orbital-sphere sphere-six" />
        <span className="orbital-sphere sphere-seven" />
      </div>
      <div className="cursor-aura" />
    </div>
  );
}
