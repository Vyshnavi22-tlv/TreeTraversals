import React, { useState } from 'react';
import { Network, GitBranch, ArrowDownRight, Info, Check } from 'lucide-react';

const ANATOMY_TERMS = [
  {
    id: 'root',
    title: 'Root Node',
    badge: 'Node A',
    desc: 'The unique entry point of the tree. It has no incoming parent edges and serves as the ancestor to every other node.'
  },
  {
    id: 'children',
    title: 'Left & Right Children',
    badge: 'Nodes B & C',
    desc: 'Every node in a binary tree may have at most two descendants: a left child and a right child. Order strictly matters.'
  },
  {
    id: 'leaf',
    title: 'Leaf Nodes (Terminal)',
    badge: 'Nodes D, E, C',
    desc: 'Nodes with zero children (both left == null and right == null). These constitute the base cases in recursive traversals.'
  },
  {
    id: 'edge',
    title: 'Directed Edges',
    badge: 'N - 1 = 4 Edges',
    desc: 'The hierarchical pointer links between parent and child nodes. A tree with N nodes always contains exactly N - 1 edges.'
  },
  {
    id: 'subtree',
    title: 'Recursive Subtrees',
    badge: 'Subtree at B',
    desc: 'Every child node is itself the root of an independent binary tree. This recursive substructure is why all traversal algorithms are recursive.'
  },
  {
    id: 'height',
    title: 'Height vs Depth',
    badge: 'Height = 3 Levels',
    desc: 'Depth is the number of edges from the root to a node. Height is the number of edges on the longest downward path to a leaf.'
  }
];

export default function WhatIsBinaryTree() {
  const [selectedTerm, setSelectedTerm] = useState(ANATOMY_TERMS[0]);

  return (
    <section id="binary-tree" className="py-20 border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold mb-3 border border-emerald-500/20">
            <span>01</span>
            <span>//</span>
            <span>DATA STRUCTURE FUNDAMENTALS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            What is a Binary Tree?
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
            A <strong className="text-white">Binary Tree</strong> is a hierarchical, non-linear data structure in which each element (called a <em>node</em>) stores data and contains references to at most two distinct child subtrees: a <strong className="text-emerald-400">Left Child</strong> and a <strong className="text-emerald-400">Right Child</strong>.
          </p>
        </div>

        {/* 2-Column Concept Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Terminology Selector Cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3.5">
            {ANATOMY_TERMS.map((term) => {
              const isSelected = selectedTerm.id === term.id;
              return (
                <div
                  key={term.id}
                  onClick={() => setSelectedTerm(term)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-zinc-900 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                      : 'bg-dark-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm font-bold ${isSelected ? 'text-emerald-300' : 'text-zinc-200'}`}>
                      {term.title}
                    </h4>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {term.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {term.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Highlight Box: Anatomy Callout */}
          <div className="lg:col-span-5 bg-dark-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
              <Info size={16} className="text-emerald-400" />
              <span className="font-mono text-xs uppercase font-semibold text-zinc-300">
                Standard Tree Anatomy
              </span>
            </div>

            <div className="bg-dark-950 rounded-xl p-4 border border-zinc-850 font-mono text-xs space-y-2 text-zinc-300">
              <div className="text-zinc-500">// Standard 5-Node Benchmark Tree</div>
              <pre className="text-emerald-400 font-bold leading-tight">
{`        A         Level 0 (Root)
       / \\
      B   C       Level 1 (Depth 1)
     / \\
    D   E         Level 2 (Leaves)`}
              </pre>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Core Invariants & Mathematical Properties
              </h4>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Max nodes at level L:</strong> Exactly 2<sup>L</sup> nodes (e.g. Level 0 has 2<sup>0</sup>=1, Level 1 has 2<sup>1</sup>=2).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Total edges:</strong> For N = 5 nodes, there are N - 1 = 4 edges.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Recursive Property:</strong> A binary tree is either empty, or consists of a root node with two binary tree subtrees.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
