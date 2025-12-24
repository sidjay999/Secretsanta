"use client";

import { useEffect, useState } from "react";

type Layer = {
  id: number;
  size: number;
  left: string;
  delay: string;
  durationClass: string;
  opacity: number;
};

const LAYERS = 40;

export function Snowfall() {
  const [flakes, setFlakes] = useState<Layer[]>([]);

  useEffect(() => {
    const generated: Layer[] = [];
    for (let i = 0; i < LAYERS; i++) {
      const depth = Math.random();
      const size = 2 + depth * 4;
      const left = `${Math.random() * 100}%`;
      const delay = `${Math.random() * -20}s`;

      const durationClass =
        depth < 0.33 ? "animate-snow-fall-slow" : depth < 0.66 ? "animate-snow-fall-med" : "animate-snow-fall-fast";

      const opacity = 0.35 + depth * 0.35;

      generated.push({
        id: i,
        size,
        left,
        delay,
        durationClass,
        opacity
      });
    }
    setFlakes(generated);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className={`absolute rounded-full bg-slate-100/90 blur-[1px] ${flake.durationClass}`}
          style={{
            width: flake.size,
            height: flake.size,
            left: flake.left,
            top: "-10vh",
            opacity: flake.opacity,
            animationDelay: flake.delay
          }}
        />
      ))}
    </div>
  );
}


