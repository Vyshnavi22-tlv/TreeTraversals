import React from 'react';
import { GitCommit, Compass, Route, Split, CheckCircle2 } from 'lucide-react';

export default function WhatIsTraversal() {
  return (
    <section id="traversals" className="py-20 border-t border-zinc-800/80 bg-dark-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold mb-3 border border-emerald-500/20">
            <span>02</span>
            <span>//</span>
            <span>ALGORITHMIC PARADIGM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            What is Tree Traversal?
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
            <strong className="text-white">Tree Traversal</strong> (also called tree search or tree walk) is the systematic algorithmic process of visiting (checking, reading, or updating) each node in a tree data structure <strong className="text-emerald-400">exactly once</strong>.
          </p>
        </div>

        {/* 3 Core Conceptual Columns */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Linear vs Hierarchical */}
          <div className="p-6 rounded-2xl bg-dark-950/80 border border-zinc-800/80 flex flex-col justify-between space-y-4 shadow-lg">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <Split size={20} />
              </div>
              <h3 className="text-base font-bold text-white">
                Linear vs. Hierarchical
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Arrays and linked lists have a single unambiguous natural order: from index <code className="text-zinc-300">0</code> to <code className="text-zinc-300">N-1</code>. Trees branch out in two dimensions at every step, creating multiple valid exploration sequences.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-dark-900 border border-zinc-850 font-mono text-[11px] text-zinc-400">
              Array: [1] → [2] → [3] <span className="text-zinc-600">(Unidimensional)</span>
              <br />
              Tree: Root branches into Left & Right
            </div>
          </div>

          {/* Card 2: Depth-First Search Family */}
          <div className="p-6 rounded-2xl bg-dark-950/80 border border-zinc-800/80 flex flex-col justify-between space-y-4 shadow-lg">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <Route size={20} />
              </div>
              <h3 className="text-base font-bold text-white">
                The DFS Triad
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Inorder, Preorder, and Postorder all belong to the <strong>Depth-First Search (DFS)</strong> family. They dive as deep as possible down a branch before backtracking. The only difference is <em>when</em> the current node is processed relative to its children.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-dark-900 border border-zinc-850 font-mono text-[11px] text-zinc-400">
              DFS Dive: Root → Leftmost Leaf → Backtrack
            </div>
          </div>

          {/* Card 3: Why Order Matters */}
          <div className="p-6 rounded-2xl bg-dark-950/80 border border-zinc-800/80 flex flex-col justify-between space-y-4 shadow-lg">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <Compass size={20} />
              </div>
              <h3 className="text-base font-bold text-white">
                Why Does Order Matter?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The order determines what information is available at execution time. Need child answers before deciding the parent? Use <strong>Postorder</strong>. Need parent context before inspecting children? Use <strong>Preorder</strong>. Want sorted BST elements? Use <strong>Inorder</strong>.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-dark-900 border border-zinc-850 font-mono text-[11px] text-zinc-400">
              Pick the traversal that matches data dependencies.
            </div>
          </div>
        </div>

        {/* The 3-Way Timing Comparison Diagram */}
        <div className="mt-10 p-6 rounded-2xl bg-dark-900/60 border border-zinc-800/80">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4">
            The Timing Rule: When is Node 'N' visited relative to Subtrees 'L' and 'R'?
          </h4>
          <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-dark-950 border border-zinc-800">
              <div className="text-emerald-400 font-bold mb-1">INORDER (L → N → R)</div>
              <div className="text-zinc-300 text-[11px]">1. Traverse Left Subtree</div>
              <div className="text-emerald-300 font-semibold bg-emerald-500/10 px-1 py-0.5 my-1 rounded border border-emerald-500/20">2. Visit Current Node [N]</div>
              <div className="text-zinc-300 text-[11px]">3. Traverse Right Subtree</div>
            </div>
            <div className="p-4 rounded-xl bg-dark-950 border border-zinc-800">
              <div className="text-sky-400 font-bold mb-1">PREORDER (N → L → R)</div>
              <div className="text-sky-300 font-semibold bg-sky-500/10 px-1 py-0.5 my-1 rounded border border-sky-500/20">1. Visit Current Node [N]</div>
              <div className="text-zinc-300 text-[11px]">2. Traverse Left Subtree</div>
              <div className="text-zinc-300 text-[11px]">3. Traverse Right Subtree</div>
            </div>
            <div className="p-4 rounded-xl bg-dark-950 border border-zinc-800">
              <div className="text-purple-400 font-bold mb-1">POSTORDER (L → R → N)</div>
              <div className="text-zinc-300 text-[11px]">1. Traverse Left Subtree</div>
              <div className="text-zinc-300 text-[11px]">2. Traverse Right Subtree</div>
              <div className="text-purple-300 font-semibold bg-purple-500/10 px-1 py-0.5 my-1 rounded border border-purple-500/20">3. Visit Current Node [N]</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
