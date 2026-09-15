import React from 'react';
import TraversalCard from '../components/TraversalCard';
import { TRAVERSAL_INFO } from '../data/traversalInfo';

export default function TraversalCardsSection({ onSelectTraversal }) {
  return (
    <section id="traversals-methods" className="py-20 border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold mb-3 border border-emerald-500/20">
            <span>03</span>
            <span>//</span>
            <span>THE CORE THREE ALGORITHMS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Traversal Methods
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
            Examine the exact mechanics of Inorder, Preorder, and Postorder traversals. Compare their traversal rules, step-by-step paths on the seminar tree, algorithmic pseudocode, and real-world system applications.
          </p>
        </div>

        {/* The 3 Traversal Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          <TraversalCard
            info={TRAVERSAL_INFO.inorder}
            onSelectForVisualizer={onSelectTraversal}
          />
          <TraversalCard
            info={TRAVERSAL_INFO.preorder}
            onSelectForVisualizer={onSelectTraversal}
          />
          <TraversalCard
            info={TRAVERSAL_INFO.postorder}
            onSelectForVisualizer={onSelectTraversal}
          />
        </div>
      </div>
    </section>
  );
}
