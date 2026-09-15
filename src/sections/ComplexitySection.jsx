import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Clock, Layers, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ComplexitySection() {
  const shouldReduceMotion = useReducedMotion();
  const [treeType, setTreeType] = useState('balanced'); // 'balanced' | 'skewed'

  return (
    <section id="complexity" className="py-20 border-t border-zinc-800/80 bg-dark-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold mb-3 border border-emerald-500/20">
            <Sparkles size={12} />
            <span>06</span>
            <span>//</span>
            <span>PERFORMANCE & MEMORY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            How Efficient Are They?
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
            A beginner-friendly look at Time and Space complexity. Understand how recursion uses memory without any unnecessary mathematical jargon.
          </p>
        </div>

        {/* 2 Core Asymptotic Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Time Complexity Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-dark-900/80 border border-zinc-800 flex flex-col justify-between space-y-5 shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <Clock size={20} />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    Time Complexity
                  </span>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                  Visits Every Node
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white tracking-tight">
                O(n)
              </div>

              <div className="text-sm text-zinc-300 font-mono">
                <strong className="text-emerald-400">n</strong> = total number of nodes in the tree
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-1">
                Whether you use Inorder, Preorder, or Postorder, the algorithm must visit every single node in the tree <strong className="text-white">exactly once</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-950 border border-zinc-850 text-xs font-mono text-zinc-300 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              <span>5 nodes = 5 visits. 1,000 nodes = 1,000 visits. Simple and optimal.</span>
            </div>
          </div>

          {/* Space Complexity Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-dark-900/80 border border-zinc-800 flex flex-col justify-between space-y-5 shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-sky-400">
                  <Layers size={20} />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    Space Complexity
                  </span>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-bold">
                  Call Stack Memory
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white tracking-tight">
                O(h)
              </div>

              <div className="text-sm text-zinc-300 font-mono">
                <strong className="text-sky-400">h</strong> = height of the tree (deepest level)
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-1">
                The only memory used is the computer's <strong className="text-white">call stack</strong>. The stack only needs to hold function calls along the single path currently being explored from the root down.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-950 border border-zinc-850 text-xs font-mono text-zinc-300 flex items-center gap-2">
              <ShieldCheck size={15} className="text-sky-400 shrink-0" />
              <span>Peak memory used at any moment = Height of the current branch (h).</span>
            </div>
          </div>
        </div>

        {/* ====================================================
            INTERACTIVE SWITCHER: BALANCED TREE VS SKEWED TREE
           ==================================================== */}
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-900/90 border border-zinc-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-850">
            <div>
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <span>Why Does Recursion Depth Change?</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Switch below to see how tree shape dictates how much memory the computer needs.
              </p>
            </div>

            {/* Toggle Buttons: Balanced vs Skewed */}
            <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-zinc-800 font-mono text-xs self-start sm:self-auto">
              <button
                onClick={() => setTreeType('balanced')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  treeType === 'balanced'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Balanced Tree (Best Case)
              </button>
              <button
                onClick={() => setTreeType('skewed')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  treeType === 'skewed'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Skewed Tree (Worst Case)
              </button>
            </div>
          </div>

          {/* Visual Demonstration: Tree (Left) vs Stack (Right) */}
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Diagram of Tree Shape */}
            <div className="lg:col-span-7 bg-dark-950/80 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-zinc-850 text-zinc-400">
                <span>
                  {treeType === 'balanced' ? 'Balanced Binary Tree' : 'Degenerate Left-Skewed Tree'}
                </span>
                <span className={treeType === 'balanced' ? 'text-emerald-400' : 'text-amber-400'}>
                  {treeType === 'balanced' ? 'Height h = 3' : 'Height h = 5 (= n)'}
                </span>
              </div>

              {/* Dynamic SVG Demonstration */}
              <div className="py-4 flex items-center justify-center">
                {treeType === 'balanced' ? (
                  <svg viewBox="0 0 360 210" className="w-full max-w-sm h-48 select-none">
                    {/* Edges */}
                    <line x1="180" y1="35" x2="100" y2="95" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="180" y1="35" x2="260" y2="95" stroke="#3f3f46" strokeWidth="2" />
                    <line x1="100" y1="95" x2="60" y2="155" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="100" y1="95" x2="140" y2="155" stroke="#3f3f46" strokeWidth="2" />
                    <line x1="260" y1="95" x2="220" y2="155" stroke="#3f3f46" strokeWidth="2" />
                    <line x1="260" y1="95" x2="300" y2="155" stroke="#3f3f46" strokeWidth="2" />

                    {/* Nodes (Active recursion path highlighted down to leftmost leaf) */}
                    {/* Level 0 */}
                    <circle cx="180" cy="35" r="17" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
                    <text x="180" y="40" textAnchor="middle" fill="#ecfdf5" className="font-mono text-xs font-bold">1</text>

                    {/* Level 1 */}
                    <circle cx="100" cy="95" r="17" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
                    <text x="100" y="100" textAnchor="middle" fill="#ecfdf5" className="font-mono text-xs font-bold">2</text>
                    <circle cx="260" cy="95" r="17" fill="#141820" stroke="#3f3f46" strokeWidth="1.5" />
                    <text x="260" y="100" textAnchor="middle" fill="#71717a" className="font-mono text-xs font-bold">3</text>

                    {/* Level 2 */}
                    <circle cx="60" cy="155" r="17" fill="#064e3b" stroke="#34d399" strokeWidth="3" />
                    <text x="60" y="160" textAnchor="middle" fill="#ecfdf5" className="font-mono text-xs font-bold">4</text>
                    <circle cx="140" cy="155" r="17" fill="#141820" stroke="#3f3f46" strokeWidth="1.5" />
                    <text x="140" y="160" textAnchor="middle" fill="#71717a" className="font-mono text-xs font-bold">5</text>
                    <circle cx="220" cy="155" r="17" fill="#141820" stroke="#3f3f46" strokeWidth="1.5" />
                    <text x="220" y="160" textAnchor="middle" fill="#71717a" className="font-mono text-xs font-bold">6</text>
                    <circle cx="300" cy="155" r="17" fill="#141820" stroke="#3f3f46" strokeWidth="1.5" />
                    <text x="300" y="160" textAnchor="middle" fill="#71717a" className="font-mono text-xs font-bold">7</text>

                    {/* Height annotations */}
                    <text x="10" y="40" fill="#71717a" className="font-mono text-[10px]">Level 0</text>
                    <text x="10" y="100" fill="#71717a" className="font-mono text-[10px]">Level 1</text>
                    <text x="10" y="160" fill="#71717a" className="font-mono text-[10px]">Level 2</text>
                  </svg>
                ) : (
                  <svg viewBox="0 0 360 210" className="w-full max-w-sm h-48 select-none">
                    {/* Skewed chain lines */}
                    <line x1="260" y1="20" x2="215" y2="60" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1="215" y1="60" x2="170" y2="100" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1="170" y1="100" x2="125" y2="140" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1="125" y1="140" x2="80" y2="180" stroke="#f59e0b" strokeWidth="2.5" />

                    {/* Chain nodes */}
                    <circle cx="260" cy="20" r="15" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
                    <text x="260" y="24" textAnchor="middle" fill="#fef3c7" className="font-mono text-xs font-bold">1</text>

                    <circle cx="215" cy="60" r="15" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
                    <text x="215" y="64" textAnchor="middle" fill="#fef3c7" className="font-mono text-xs font-bold">2</text>

                    <circle cx="170" cy="100" r="15" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
                    <text x="170" y="104" textAnchor="middle" fill="#fef3c7" className="font-mono text-xs font-bold">3</text>

                    <circle cx="125" cy="140" r="15" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
                    <text x="125" y="144" textAnchor="middle" fill="#fef3c7" className="font-mono text-xs font-bold">4</text>

                    <circle cx="80" cy="180" r="15" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
                    <text x="80" y="184" textAnchor="middle" fill="#fef3c7" className="font-mono text-xs font-bold">5</text>

                    <text x="15" y="184" fill="#f59e0b" className="font-mono text-[10px] font-bold">Chain Depth = 5</text>
                  </svg>
                )}
              </div>

              <div className="pt-2 border-t border-zinc-850 text-xs font-mono text-zinc-400 flex items-center justify-between">
                <span>Green/Amber path = Active branch in recursion</span>
                <span>{treeType === 'balanced' ? 'Branching keeps tree short' : 'No branching = straight line'}</span>
              </div>
            </div>

            {/* Right Side: What Happens to the Call Stack Memory */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-dark-950 border border-zinc-850 space-y-3">
                <div className="text-xs font-mono uppercase text-zinc-400 font-bold flex items-center justify-between">
                  <span>Call Stack Depth</span>
                  <span className={treeType === 'balanced' ? 'text-emerald-400' : 'text-amber-400'}>
                    {treeType === 'balanced' ? '3 Frames' : '5 Frames (All Nodes!)'}
                  </span>
                </div>

                {/* Stack Boxes */}
                <div className="flex flex-col-reverse gap-1.5 font-mono text-xs">
                  {treeType === 'balanced' ? (
                    <>
                      <div className="p-2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-between">
                        <span>3. traverse(Node 4)</span>
                        <span className="text-[10px] uppercase">Active</span>
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-between">
                        <span>2. traverse(Node 2)</span>
                        <span className="text-[10px] text-zinc-500">Waiting</span>
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-between">
                        <span>1. traverse(Node 1)</span>
                        <span className="text-[10px] text-zinc-500">Root</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-1.5 rounded bg-amber-500/25 border border-amber-500/50 text-amber-200 font-bold flex items-center justify-between">
                        <span>5. traverse(Node 5)</span>
                        <span className="text-[10px] uppercase">Active</span>
                      </div>
                      <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-between">
                        <span>4. traverse(Node 4)</span>
                        <span className="text-[10px] text-zinc-600">Waiting</span>
                      </div>
                      <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-between">
                        <span>3. traverse(Node 3)</span>
                        <span className="text-[10px] text-zinc-600">Waiting</span>
                      </div>
                      <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-between">
                        <span>2. traverse(Node 2)</span>
                        <span className="text-[10px] text-zinc-600">Waiting</span>
                      </div>
                      <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-between">
                        <span>1. traverse(Node 1)</span>
                        <span className="text-[10px] text-zinc-600">Root</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Beginner-friendly explanation */}
              <div className="p-4 rounded-xl bg-dark-950/60 border border-zinc-800 text-xs leading-relaxed space-y-2">
                <div className="font-bold text-white font-mono flex items-center gap-2">
                  {treeType === 'balanced' ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span>Why Balanced is Ideal:</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} className="text-amber-400" />
                      <span>Why Skewed is Risky:</span>
                    </>
                  )}
                </div>

                <p className="text-zinc-400">
                  {treeType === 'balanced'
                    ? 'Because each node splits into two equal sides, the height stays tiny. Even for 1,000,000 nodes, a balanced tree is only ~20 levels high! The call stack never grows beyond 20 frames.'
                    : 'When every node only has one child, the tree becomes a single line like a linked list. The computer has to stack every single function call on top of each other ($h = n$). For large trees, this can trigger a Stack Overflow!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
