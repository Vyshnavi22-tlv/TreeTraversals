import React, { useState } from 'react';
import { Cpu, Database, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ComplexitySection() {
  const [treeShape, setTreeShape] = useState('balanced'); // 'balanced' | 'skewed'

  return (
    <section id="complexity" className="py-20 border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold mb-3 border border-emerald-500/20">
            <span>06</span>
            <span>//</span>
            <span>ASYMPTOTIC ANALYSIS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Time & Space Complexity
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
            Theoretical performance bounds for recursive binary tree traversals. Understand why all three algorithms share identical asymptotic complexity, yet behave differently on physical memory stacks.
          </p>
        </div>

        {/* 2 Big Asymptotic Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Time Complexity Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-dark-900/90 border border-zinc-800 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <Cpu size={20} />
                  <span className="font-mono text-xs uppercase font-bold tracking-wider">
                    Time Complexity
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Strictly Linear
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white">
                O(N)
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Where <strong className="text-white">N</strong> is the total number of nodes in the tree.
              </p>

              <div className="space-y-2 text-xs text-zinc-400">
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Node Visits:</strong> The algorithm visits each node in the tree exactly once.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Constant Work:</strong> Inside each function frame, checking null and printing or recording the value requires strictly O(1) constant time.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Total Time:</strong> T(N) = 2T(N/2) + O(1) → by Master Theorem / substitution, total operations = 2N + 1 calls = <strong>O(N)</strong>.</span>
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-dark-950 border border-zinc-850 font-mono text-xs text-emerald-300">
              Optimal: Cannot traverse all nodes in less than Ω(N) time.
            </div>
          </div>

          {/* Space Complexity Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-dark-900/90 border border-zinc-800 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <Database size={20} />
                  <span className="font-mono text-xs uppercase font-bold tracking-wider">
                    Auxiliary Space Complexity
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Call Stack Bound
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white">
                O(H)
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Where <strong className="text-white">H</strong> is the height of the tree (longest root-to-leaf path).
              </p>

              <div className="space-y-2 text-xs text-zinc-400">
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Recursion Stack:</strong> No additional dynamic heap memory is allocated; all overhead is the call stack frames.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Peak Depth:</strong> The maximum number of concurrent active frames on the stack at any instant equals the height of the current branch (H + 1).</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Best Case (Balanced):</strong> Height H = ⌊log₂ N⌋ → <strong>O(log N)</strong> memory.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Worst Case (Skewed):</strong> Height H = N (like a linked list) → <strong>O(N)</strong> memory (risk of stack overflow!).</span>
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-dark-950 border border-zinc-850 font-mono text-xs text-zinc-300 flex items-center justify-between">
              <span>Best: O(log N)</span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-400 font-bold">Worst: O(N)</span>
            </div>
          </div>
        </div>

        {/* Interactive Tree Shape Stack Depth Inspector */}
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-900/60 border border-zinc-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Interactive Space Impact: Balanced vs. Skewed Tree
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Toggle below to see how tree balance fundamentally dictates maximum call stack memory.
              </p>
            </div>

            <div className="flex bg-dark-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono self-start sm:self-auto">
              <button
                onClick={() => setTreeShape('balanced')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  treeShape === 'balanced'
                    ? 'bg-zinc-800 text-emerald-400 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Balanced Tree (H = log₂ N)
              </button>
              <button
                onClick={() => setTreeShape('skewed')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  treeShape === 'skewed'
                    ? 'bg-zinc-800 text-amber-400 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Degenerate / Skewed (H = N)
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="p-4 rounded-xl bg-dark-950 border border-zinc-850 font-mono text-xs">
              {treeShape === 'balanced' ? (
                <pre className="text-emerald-400 leading-relaxed">
{`Balanced Tree (N = 7 nodes):
          [4]
        /     \\
      [2]     [6]
      / \\     / \\
    [1] [3] [5] [7]

Height H = 3
Max Stack Frames = 3
Space Complexity = O(log N)`}
                </pre>
              ) : (
                <pre className="text-amber-400 leading-relaxed">
{`Degenerate Left-Skewed Tree (N = 5 nodes):
    [5]
    /
   [4]
   /
  [3]
  /
 [2]
 /
[1]

Height H = 5
Max Stack Frames = 5 = N
Space Complexity = O(N)`}
                </pre>
              )}
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex items-center gap-2 font-mono font-semibold text-white">
                {treeShape === 'balanced' ? (
                  <>
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span>Logarithmic Memory Efficiency</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={16} className="text-amber-400" />
                    <span>Linear Stack Degradation (Call Stack Risk)</span>
                  </>
                )}
              </div>
              <p className="text-zinc-400 leading-relaxed text-xs">
                {treeShape === 'balanced'
                  ? 'For a balanced tree with 1,000,000 nodes, the maximum call stack depth is merely ~20 stack frames! Recursion is fast, safe, and cache-friendly.'
                  : 'In a pathological degenerate tree with 1,000,000 nodes, the recursive call stack demands 1,000,000 consecutive stack frames, causing a CallStackExceeded / Segmentation Fault error in production.'}
              </p>
              <div className="pt-2">
                <span className="font-mono text-[11px] px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Tip: Self-balancing BSTs (AVL, Red-Black) enforce O(log N) height.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
