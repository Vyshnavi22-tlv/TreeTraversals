import React from 'react';
import { Check, X, Layers, Scale, Sparkles, AlertCircle } from 'lucide-react';
import { COMPARISON_TABLE, RECONSTRUCTION_RULES } from '../data/comparisonData';

export default function ComparisonSection() {
  return (
    <section id="comparison" className="py-20 border-t border-zinc-800/80 bg-dark-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold mb-3 border border-emerald-500/20">
            <span>05</span>
            <span>//</span>
            <span>SIDE-BY-SIDE MATRIX</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Comparison & Analysis
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
            Compare all three depth-first traversal algorithms side-by-side. Understand their mathematical differences, positioning of root keys, and reconstruction properties.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-dark-950/80 shadow-xl mb-12">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 font-mono text-xs text-zinc-400">
                <th className="py-4 px-5 font-semibold">Algorithmic Property</th>
                <th className="py-4 px-5 font-bold text-emerald-400">Inorder Traversal</th>
                <th className="py-4 px-5 font-bold text-sky-400">Preorder Traversal</th>
                <th className="py-4 px-5 font-bold text-purple-400">Postorder Traversal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 font-mono">
              {COMPARISON_TABLE.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-zinc-900/40 transition-colors"
                >
                  <td className="py-3.5 px-5 font-sans font-medium text-zinc-300">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-5 text-emerald-300 font-semibold bg-emerald-500/[0.02]">
                    {row.inorder}
                  </td>
                  <td className="py-3.5 px-5 text-sky-300 font-semibold bg-sky-500/[0.02]">
                    {row.preorder}
                  </td>
                  <td className="py-3.5 px-5 text-purple-300 font-semibold bg-purple-500/[0.02]">
                    {row.postorder}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reconstruction Deep Dive Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-900/90 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Scale size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Tree Reconstruction: Can Traversals Rebuild the Original Tree?
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                A classic CS seminar theoretical question: Given two traversal outputs, can we uniquely reconstruct the tree?
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
            {RECONSTRUCTION_RULES.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-dark-950 border border-zinc-800/80 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-zinc-200">{rule.pair}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        rule.possible
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}
                    >
                      {rule.badge}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">
                    {rule.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-850 flex items-center gap-1.5 text-[10px]">
                  {rule.possible ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <AlertCircle size={12} className="text-amber-400" />
                  )}
                  <span className={rule.possible ? 'text-emerald-400' : 'text-amber-400'}>
                    {rule.possible ? 'Deterministic Reconstruction' : 'Requires Full Binary Tree'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
