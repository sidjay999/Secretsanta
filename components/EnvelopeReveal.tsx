"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type EnvelopeRevealProps = {
  visible: boolean;
  assignedTo: string | null;
  onClose: () => void;
};

export function EnvelopeReveal({ visible, assignedTo, onClose }: EnvelopeRevealProps) {
  const [opened, setOpened] = useState(false);

  const handleEnvelopeClick = () => {
    if (!opened) {
      setOpened(true);
    }
  };

  const handleBackdropClick = () => {
    if (opened) {
      onClose();
      setOpened(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0"
            onClick={handleBackdropClick}
          />
          <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

          <motion.div
            className="relative z-50 flex max-w-md flex-col items-center px-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="mb-6 text-sm uppercase tracking-[0.25em] text-slate-100/80">
              ✉️ Envelope Reveal
            </p>

            <motion.div
              className="relative h-64 w-full max-w-sm cursor-pointer rounded-3xl bg-gradient-to-b from-slate-100/15 via-slate-50/6 to-slate-50/3 p-[1px] shadow-glow-gold"
              onClick={handleEnvelopeClick}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-nightTop via-nightCenter/70 to-nightBottom">
                {/* Envelope body */}
                <motion.div
                  className="absolute bottom-6 h-32 w-[88%] rounded-2xl bg-gradient-to-b from-amberSoft/80 via-amberSoft/70 to-amberSoft/55 shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
                  animate={{
                    y: opened ? 12 : 0
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />

                {/* Envelope flap */}
                <motion.div
                  className="absolute bottom-[6.2rem] h-20 w-[88%] origin-bottom bg-gradient-to-b from-amberSoft/95 via-amberSoft/85 to-amberSoft/70"
                  animate={{
                    rotateX: opened ? -120 : 0
                  }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  style={{
                    transformStyle: "preserve-3d"
                  }}
                />

                {/* Wax seal */}
                <motion.div
                  className="absolute bottom-[4.6rem] flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-900/95 via-red-700/95 to-red-800/95 shadow-[0_0_18px_rgba(0,0,0,0.6)]"
                  animate={{
                    scale: opened ? 0.7 : 1,
                    y: opened ? 16 : 0,
                    opacity: opened ? 0 : 1
                  }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  <span className="text-xs font-semibold tracking-wide text-amber-100">
                    ✨
                  </span>
                </motion.div>

                {/* Letter emerging */}
                <motion.div
                  className="relative z-20 mx-auto flex w-[82%] flex-col items-center rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50/95 px-8 py-8 text-center shadow-[0_20px_45px_rgba(0,0,0,0.45)]"
                  initial={{ y: 70, opacity: 0 }}
                  animate={{
                    y: opened ? -28 : 70,
                    opacity: opened ? 1 : 0
                  }}
                  transition={{ delay: 0.3, duration: 0.55, ease: "easeOut" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 10 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <p className="mb-6 text-[0.65rem] font-medium tracking-[0.28em] text-amber-600/90 uppercase">
                      Secret Santa Mission
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: opened ? 1 : 0, scale: opened ? 1 : 0.95 }}
                    transition={{ delay: 0.75, duration: 0.45 }}
                    className="space-y-3"
                  >
                    <p className="text-xs font-light tracking-wide text-slate-600">
                      You are gifting to
                    </p>
                    <div className="my-4 h-px w-12 mx-auto bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                    <p className="text-2xl font-semibold tracking-wide text-slate-900 leading-relaxed">
                      {assignedTo ?? "A Mystery Friend"}
                    </p>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: opened ? 1 : 0 }}
                    transition={{ delay: 0.95, duration: 0.4 }}
                    className="mt-6 text-[0.68rem] leading-relaxed text-slate-500/90"
                  >
                    Keep this between you and the winter night
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-[0.7rem] text-slate-200/70"
            >
              Tap outside to return to the winter night
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}