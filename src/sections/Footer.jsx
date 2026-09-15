import React from 'react';
import { Command, Heart, Github, BookOpen, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenShortcuts }) {
  return (
    <footer className="border-t border-zinc-800/80 bg-dark-950 py-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-850">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white text-base tracking-tight">
                TREE TRAVERSALS
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm">
              Interactive educational platform built for computer science college seminars to make tree algorithms intuitive and visually tangible.
            </p>
          </div>

          {/* Quick shortcuts pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenShortcuts}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-mono text-zinc-300 transition"
            >
              <Command size={13} className="text-emerald-400" />
              <span>Keyboard Shortcuts</span>
              <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400">Keys</kbd>
            </button>
          </div>
        </div>

        {/* Tech Stack and Seminar metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>Built with:</span>
            <span className="px-2 py-0.5 rounded bg-dark-900 border border-zinc-800 text-zinc-300">React</span>
            <span className="px-2 py-0.5 rounded bg-dark-900 border border-zinc-800 text-zinc-300">Vite</span>
            <span className="px-2 py-0.5 rounded bg-dark-900 border border-zinc-800 text-zinc-300">Tailwind CSS</span>
            <span className="px-2 py-0.5 rounded bg-dark-900 border border-zinc-800 text-zinc-300">Framer Motion</span>
            <span className="px-2 py-0.5 rounded bg-dark-900 border border-zinc-800 text-zinc-300">SVG Engine</span>
          </div>

          <div className="text-right">
            Designed for CS Seminar & Educational Demonstrations
          </div>
        </div>
      </div>
    </footer>
  );
}
