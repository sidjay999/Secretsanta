 "use client";

import { Hero } from "@/components/Hero";
import { IdentitySplineSection } from "@/components/IdentitySplineSection";
import { Snowfall } from "@/components/Snowfall";
import { useRef } from "react";

export default function Page() {
  const identifyRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-winter-vertical text-slate-50">
      <Snowfall />
      <div className="relative z-20">
        <Hero scrollTargetRef={identifyRef} />
        <div ref={identifyRef}>
          <IdentitySplineSection />
        </div>
      </div>
    </main>
  );
}


