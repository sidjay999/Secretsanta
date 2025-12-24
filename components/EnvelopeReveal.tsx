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
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-slate-100/80">
              ✉️ Envelope Reveal
            </p>

            <motion.div
              className="relative h-56 w-full max-w-sm cursor-pointer rounded-3xl bg-gradient-to-b from-slate-100/15 via-slate-50/6 to-slate-50/3 p-[1px] shadow-glow-gold"
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
                  className="relative z-20 mx-auto flex w-[80%] flex-col items-center rounded-2xl bg-slate-50/97 px-6 py-5 text-center shadow-[0_18px_35px_rgba(0,0,0,0.4)]"
                  initial={{ y: 60, opacity: 0 }}
                  animate={{
                    y: opened ? -24 : 60,
                    opacity: opened ? 1 : 0
                  }}
                  transition={{ delay: 0.3, duration: 0.55, ease: "easeOut" }}
                >
                  <p className="mb-1 text-xs font-medium tracking-[0.22em] text-slate-500 uppercase">
                    Your Secret Santa Mission
                  </p>
                  <p className="mb-2 text-[0.65rem] font-semibold tracking-[0.3em] text-amber-600 uppercase">
                    Confidential · For your eyes only
                  </p>
                  <p className="mt-4 text-xs text-slate-700">
                    You are gifting to…
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-wide text-slate-900">
                    {assignedTo ?? "A Mystery Friend"}
                  </p>
                  <p className="mt-3 text-[0.7rem] text-slate-500">
                    Keep this between you and the winter night. No one else in your group will see this screen.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <p className="mt-6 text-[0.7rem] text-slate-200/80">
              Tap outside the envelope to return to the winter night once you&apos;re ready.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


