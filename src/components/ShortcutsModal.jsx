import React from 'react';
import { X, Command } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Toggle Play / Pause automated traversal' },
    { key: 'N', desc: 'Advance one step forward in algorithm' },
    { key: 'R', desc: 'Reset traversal to initial state' },
    { key: '1', desc: 'Select Inorder Traversal (L → N → R)' },
    { key: '2', desc: 'Select Preorder Traversal (N → L → R)' },
    { key: '3', desc: 'Select Postorder Traversal (L → R → N)' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-white">
            <Command size={18} className="text-emerald-400" />
            <h3 className="font-mono text-sm font-bold">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2.5">
          {shortcuts.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-dark-950/60 border border-zinc-850 text-xs"
            >
              <span className="text-zinc-300 font-medium">{item.desc}</span>
              <kbd className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-emerald-400 font-mono text-xs font-bold shadow-inner">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition"
          >
            Got it (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
