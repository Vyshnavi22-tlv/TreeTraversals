import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';

export default function CallStackVisualizer({ callStack = [] }) {
  return (
    <div className="flex flex-col h-full bg-dark-950/90 rounded-xl border border-zinc-800/80 overflow-hidden shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/70 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Layers size={13} className="text-emerald-400" />
          <span className="font-mono uppercase text-[11px] font-semibold text-zinc-300">
            Call Stack (O(H) Memory)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
          Depth: {callStack.length}
        </span>
      </div>

      {/* Stack Frames (rendered top-to-bottom or bottom-to-top) */}
      <div className="p-3 flex-1 flex flex-col-reverse justify-start gap-1.5 overflow-y-auto font-mono text-xs">
        {callStack.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-600 text-xs italic">
            Stack is empty (traversal idle)
          </div>
        ) : (
          <AnimatePresence>
            {callStack.map((frame, index) => {
              const isTop = index === callStack.length - 1;
              return (
                <motion.div
                  key={`${frame}-${index}`}
                  initial={{ opacity: 0, x: -10, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md border text-xs ${
                    isTop
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold shadow-sm shadow-emerald-500/10'
                      : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 w-4 select-none">
                      #{index}
                    </span>
                    <span>{frame}</span>
                  </div>

                  {isTop && (
                    <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                      Active
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Stack Footer note */}
      <div className="px-3 py-1.5 bg-dark-900/60 border-t border-zinc-800/60 text-[10px] text-zinc-500 font-mono flex items-center justify-between">
        <span>Base frame</span>
        <span>Peak call frames = Tree Height (H)</span>
      </div>
    </div>
  );
}
