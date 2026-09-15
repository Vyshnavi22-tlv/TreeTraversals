import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, MonitorPlay, Sparkles } from 'lucide-react';
import HeroTreeSvg from './HeroTreeSvg';

export default function PresentationModal({ isOpen, onClose }) {
  const [slideIndex, setSlideIndex] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Binary Tree Traversals',
      subtitle: 'College Seminar Presentation Overview',
      content: (
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <p className="text-zinc-300 text-lg leading-relaxed">
            Unlike linear data structures (Arrays, Linked Lists) which have a single obvious traversal path, trees are hierarchical non-linear graphs requiring algorithmic rules.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-dark-900 border border-zinc-800">
              <span className="font-mono text-emerald-400 font-bold block text-sm mb-1">Inorder</span>
              <span className="text-xs text-zinc-400">Left → Root → Right</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-900 border border-zinc-800">
              <span className="font-mono text-sky-400 font-bold block text-sm mb-1">Preorder</span>
              <span className="text-xs text-zinc-400">Root → Left → Right</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-900 border border-zinc-800">
              <span className="font-mono text-purple-400 font-bold block text-sm mb-1">Postorder</span>
              <span className="text-xs text-zinc-400">Left → Right → Root</span>
            </div>
          </div>
          <div className="pt-2 text-xs font-mono text-zinc-400">
            Use <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">→</kbd> to navigate slides.
          </div>
        </div>
      )
    },
    {
      title: 'Canonical Seminar Tree',
      subtitle: 'The 5-Node Benchmark Tree (A-B-C-D-E)',
      content: (
        <div className="flex flex-col items-center">
          <HeroTreeSvg />
          <div className="mt-4 flex gap-6 text-xs font-mono text-zinc-400">
            <span>Height (H): 3</span>
            <span>Total Nodes (N): 5</span>
            <span>Leaf Nodes: D, E, C</span>
          </div>
        </div>
      )
    },
    {
      title: 'Inorder Traversal: Left → Root → Right',
      subtitle: 'Key Property: Recovers BST elements in strictly sorted order',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-xl bg-dark-900 border border-zinc-800 font-mono text-center text-xl text-emerald-300">
            D → B → E → A → C
          </div>
          <ul className="space-y-3 text-sm text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">1.</span>
              <span>Recursively traverse the entire left subtree first.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">2.</span>
              <span>Visit the current root node.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">3.</span>
              <span>Recursively traverse the right subtree.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: 'Preorder Traversal: Root → Left → Right',
      subtitle: 'Key Property: Essential for tree serialization and prefix math expressions',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-xl bg-dark-900 border border-zinc-800 font-mono text-center text-xl text-sky-300">
            A → B → D → E → C
          </div>
          <ul className="space-y-3 text-sm text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-sky-400 font-bold">1.</span>
              <span>Process the root immediately before descending into any children.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-400 font-bold">2.</span>
              <span>Recursively traverse the left branch.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-400 font-bold">3.</span>
              <span>Recursively traverse the right branch.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: 'Postorder Traversal: Left → Right → Root',
      subtitle: 'Key Property: Bottom-up deletion and postfix calculation',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-xl bg-dark-900 border border-zinc-800 font-mono text-center text-xl text-purple-300">
            D → E → B → C → A
          </div>
          <ul className="space-y-3 text-sm text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">1.</span>
              <span>Traverse left child subtree.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">2.</span>
              <span>Traverse right child subtree.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">3.</span>
              <span>Visit root last of all (ideal for garbage collection and memory release).</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: 'Complexity & Final Takeaways',
      subtitle: 'Theoretical bounds for any binary tree of size N and height H',
      content: (
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="p-5 rounded-xl bg-dark-900 border border-zinc-800 space-y-2">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Time Complexity</span>
            <div className="text-2xl font-mono font-bold text-white">O(N)</div>
            <p className="text-xs text-zinc-400">
              Every node is traversed exactly once. Work done per node is O(1) constant time.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-dark-900 border border-zinc-800 space-y-2">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Space Complexity</span>
            <div className="text-2xl font-mono font-bold text-white">O(H)</div>
            <p className="text-xs text-zinc-400">
              Call stack depth corresponds to height H. Best case balanced: O(log N). Worst case skewed: O(N).
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentSlide = slides[slideIndex];

  return (
    <div className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-xl flex flex-col p-4 sm:p-8">
      {/* Presentation Top bar */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MonitorPlay size={18} />
          </div>
          <div>
            <h2 className="font-mono text-sm font-bold text-white">Seminar Presentation Deck</h2>
            <p className="text-xs text-zinc-500 font-mono">
              Slide {slideIndex + 1} of {slides.length}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Slide Body */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            {currentSlide.title}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-medium">
            {currentSlide.subtitle}
          </p>
        </div>

        <div className="w-full max-w-3xl">
          {currentSlide.content}
        </div>
      </div>

      {/* Slide Navigation Bottom Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800 max-w-4xl mx-auto w-full">
        <button
          onClick={() => setSlideIndex((prev) => Math.max(0, prev - 1))}
          disabled={slideIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 text-xs font-mono text-zinc-300 transition"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                slideIndex === i ? 'w-6 bg-emerald-400' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
          disabled={slideIndex === slides.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 disabled:opacity-30 text-xs font-mono text-emerald-300 transition font-semibold"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
