import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal } from 'lucide-react';
import { PSEUDOCODE_TEMPLATES } from '../algorithms/traversals';

export default function CodeTracer({ traversalType = 'inorder', activeLine = null }) {
  const [copied, setCopied] = useState(false);

  const lines = PSEUDOCODE_TEMPLATES[traversalType] || PSEUDOCODE_TEMPLATES.inorder;

  const handleCopy = () => {
    const codeString = lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-dark-950/95 rounded-xl border border-zinc-800/90 overflow-hidden shadow-2xl">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-900/80 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2 text-zinc-300">
          <Terminal size={14} className="text-emerald-400" />
          <span className="font-mono uppercase text-[11px] font-bold tracking-wider">
            {traversalType.toUpperCase()} Algorithm
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700">
            {activeLine ? `Line ${activeLine}` : 'Idle'}
          </span>
          <button
            onClick={handleCopy}
            title="Copy Pseudocode"
            className="p-1 rounded bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* Code Lines with Execution Pointer */}
      <div className="p-3.5 font-mono text-xs sm:text-sm overflow-x-auto space-y-1 flex-1 flex flex-col justify-center">
        {lines.map((item) => {
          const isCurrent = activeLine === item.line;

          return (
            <div
              key={item.line}
              className={`flex items-center py-1.5 px-2.5 rounded-lg transition-all duration-150 ${
                isCurrent
                  ? 'bg-emerald-500/20 text-emerald-200 font-semibold border-l-4 border-emerald-400 pl-2 shadow-sm shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {/* Line number and execution indicator */}
              <div className="w-8 flex items-center justify-between pr-2.5 select-none text-[11px]">
                <span className={isCurrent ? 'text-emerald-400 font-bold' : 'text-zinc-600'}>
                  {item.line}
                </span>
                {isCurrent && (
                  <span className="text-emerald-400 font-bold text-xs">→</span>
                )}
              </div>

              {/* Code line content */}
              <span className="flex-1 whitespace-pre">
                {item.text}
              </span>

              {/* Executing tag */}
              {isCurrent && (
                <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-400/30 text-emerald-300 ml-2 animate-pulse">
                  ACTIVE
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1.5 bg-dark-900/60 border-t border-zinc-850 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
        <span>Standard Recursive Definition</span>
        <span>Depth-First Search (DFS)</span>
      </div>
    </div>
  );
}
