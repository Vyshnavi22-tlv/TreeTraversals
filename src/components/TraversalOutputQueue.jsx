import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, Check } from 'lucide-react';

export default function TraversalOutputQueue({
  visitedNodes = [],
  expectedNodes = [],
  traversalName = 'Traversal'
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = visitedNodes.join(' → ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-dark-950/80 rounded-xl border border-zinc-800/80 p-3 shadow-inner">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60 text-xs">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-emerald-400" />
          <span className="font-mono uppercase text-[11px] font-semibold text-zinc-300">
            Traversal Output Stream
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            ({visitedNodes.length} / {expectedNodes.length} nodes)
          </span>
        </div>

        <button
          onClick={handleCopy}
          disabled={visitedNodes.length === 0}
          className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/60 hover:bg-zinc-700/60 disabled:opacity-40 text-zinc-300 transition"
        >
          {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Output Stream List */}
      <div className="pt-3 min-h-[46px] flex items-center flex-wrap gap-2">
        {visitedNodes.length === 0 ? (
          <span className="text-xs font-mono text-zinc-600 italic">
            Waiting for traversal execution to begin...
          </span>
        ) : (
          <AnimatePresence>
            {visitedNodes.map((nodeVal, idx) => (
              <React.Fragment key={`${nodeVal}-${idx}`}>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: -8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-emerald-500/40 text-emerald-300 font-mono text-sm font-semibold shadow-sm shadow-emerald-500/10"
                >
                  <span className="text-[10px] text-emerald-500/70 font-normal">
                    #{idx + 1}
                  </span>
                  <span>{nodeVal}</span>
                </motion.div>

                {idx < visitedNodes.length - 1 && (
                  <span className="text-zinc-600 font-mono text-xs">→</span>
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
