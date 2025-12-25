"use client";

import { Suspense, lazy, useState, useEffect } from "react";
import { IdentityForm } from "./IdentityForm";

const LazySpline = lazy(() => import("@splinetool/react-spline/next"));

export function IdentitySplineSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          (window.matchMedia("(pointer: coarse)").matches && "ontouchstart" in window)
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Replace with your own hosted high-quality static render of the scene for mobile
  const fallbackImage = "https://your-hosted-static-spline-render.jpg";

  return (
    <section className="relative flex h-screen w-full flex-col overflow-hidden">
      {/* Full-viewport Spline background */}
      <div className="absolute inset-0 z-0">
        {isMobile ? (
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${fallbackImage})` }}
          />
        ) : (
          <Suspense fallback={<div className="h-full w-full bg-slate-950" />}>
            <LazySpline
              scene="https://prod.spline.design/jQBykGwB-zEBArlF/scene.splinecode"
              renderOnDemand={true}
              onLoad={(spline) => {
                spline.setZoom(1);
              }}
            />
          </Suspense>
        )}
      </div>

      {/* Decorative image - positioned to the right, bottom-right aligned */}
      <div className="absolute right-4 bottom-8 z-[5] pointer-events-none hidden sm:block md:right-8 md:bottom-12 lg:right-16 lg:bottom-16">
        <img
          src="/decor1.png"
          alt=""
          className="h-auto w-[125px] opacity-60 transition-opacity duration-300 md:w-[175px] md:opacity-75 lg:w-[225px] lg:opacity-90"
          aria-hidden="true"
        />
      </div>

      {/* IdentityForm overlay - centered vertically and horizontally */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
        <IdentityForm />
      </div>
    </section>
  );
}

