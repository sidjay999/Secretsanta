"use client";

import { motion } from "framer-motion";
import { RefObject, Suspense, lazy, useEffect, useState } from "react";
import Spline from "@splinetool/react-spline/next";

const LazySpline = lazy(() => import("@splinetool/react-spline/next"));

type HeroProps = {
  scrollTargetRef: RefObject<HTMLDivElement>;
};

export function Hero({ scrollTargetRef }: HeroProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || (window.matchMedia("(pointer: coarse)").matches && "ontouchstart" in window));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleScrollClick = () => {
    scrollTargetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Replace with your own hosted high-quality static render of the scene
  const fallbackImage = "https://your-hosted-static-spline-render.jpg";

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Full-viewport Spline background */}
      <div className="absolute inset-0 -z-10">
        {isMobile ? (
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${fallbackImage})` }}
          />
        ) : (
          <Suspense fallback={<div className="h-full w-full bg-slate-950" />}>
            <LazySpline
              scene="https://prod.spline.design/wblAVEz2hxKpTlEK/scene.splinecode"
              renderOnDemand={true}
              onLoad={(spline) => {
                spline.setZoom(1);
              }}
            />
          </Suspense>
        )}
      </div>

      {/* Top headline text – clean floating text */}
      <div className="relative z-20 px-6 pt-16 md:px-12 md:pt-24 lg:px-24 lg:pt-32">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="max-w-2xl text-xl font-semibold leading-snug tracking-tight text-slate-50 sm:text-2xl md:text-3xl lg:text-4xl">
            Common superman.. Say your stupid line..
            <span className="block mt-2 text-lg font-medium bg-gradient-to-r from-amber-300 via-cyan-200 to-sky-300 bg-clip-text text-transparent sm:text-xl md:text-2xl">
              Bengaluru traffic stopped santa to reach your friends,
              <br className="hidden sm:inline" />
              you wanna be a secret him?
            </span>
          </h1>
        </motion.div>
      </div>

      {/* CTA Button – Bottom-left corner, smaller and subtle */}
      <div className="absolute bottom-8 left-8 z-20 md:bottom-12 md:left-12 lg:bottom-16 lg:left-16">
        <motion.button
          type="button"
          onClick={handleScrollClick}
          className="rounded-full bg-white/12 px-6 py-3 text-base font-medium text-slate-50 backdrop-blur-md ring-1 ring-white/20 transition-all duration-300 hover:bg-white/20 hover:shadow-xl hover:shadow-cyan-500/30"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        >
          Begin your reveal
        </motion.button>
      </div>

      {/* Minimal scroll indicator – centered bottom */}
      <motion.button
        type="button"
        onClick={handleScrollClick}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 text-xs text-slate-100/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-slate-100/40 to-transparent" />
        Scroll to identify yourself
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-slate-100/40 to-transparent" />
      </motion.button>
    </section>
  );
}