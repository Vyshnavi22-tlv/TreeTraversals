import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Scale,
  Check,
  AlertCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  createStandardTree,
  computeTreeLayout,
  inorder,
  preorder,
  postorder
} from '../algorithms/traversals';
import { COMPARISON_TABLE, RECONSTRUCTION_RULES } from '../data/comparisonData';

export default function ComparisonSection() {
  const shouldReduceMotion = useReducedMotion();

  // "Play All" simultaneous comparison state
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [simStep, setSimStep] = useState(0); // 0 to 5

  const standardTree = useMemo(() => createStandardTree(), []);

  // Compute canonical tree coordinates dynamically
  const { nodes, edges, width, height } = useMemo(() => {
    return computeTreeLayout(standardTree, {
      viewWidth: 260,
      viewHeight: 180,
      topMargin: 35,
      bottomMargin: 30,
      horizontalPadding: 35
    });
  }, [standardTree]);

  // Traversal sequences on standard tree (A-E)
  const sequences = useMemo(() => ({
    inorder: ['D', 'B', 'E', 'A', 'C'],
    preorder: ['A', 'B', 'D', 'E', 'C'],
    postorder: ['D', 'E', 'B', 'C', 'A']
  }), []);

  // Simultaneous animation timer
  useEffect(() => {
    if (!isPlayingAll) return;

    if (simStep >= 5) {
      setIsPlayingAll(false);
      return;
    }

    const timer = setTimeout(() => {
      setSimStep((prev) => {
        if (prev < 5) {
          return prev + 1;
        } else {
          setIsPlayingAll(false);
          return prev;
        }
      });
    }, 1100);

    return () => clearTimeout(timer);
  }, [isPlayingAll, simStep]);

  const handlePlayAll = () => {
    if (simStep >= 5) {
      setSimStep(0);
    }
    setIsPlayingAll(true);
  };

  const handlePauseAll = () => {
    setIsPlayingAll(false);
  };

  const handleResetAll = () => {
    setIsPlayingAll(false);
    setSimStep(0);
  };

  // Helper to render miniature synchronized tree for each traversal
  const renderMiniTree = (traversalKey, accentColor, glowColor) => {
    const seq = sequences[traversalKey];
    const currentNode = simStep > 0 && simStep <= 5 ? seq[simStep - 1] : null;
    const visitedList = simStep > 0 ? seq.slice(0, simStep) : [];

    return (
      <div className="relative w-full h-[180px] flex items-center justify-center select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Edges */}
          {edges.map((edge) => {
            const isBothVisited =
              visitedList.includes(edge.from.val) && visitedList.includes(edge.to.val);
            const isActiveEdge =
              currentNode === edge.to.val && visitedList.includes(edge.from.val);

            return (
              <line
                key={edge.id}
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke={isActiveEdge ? accentColor : isBothVisited ? '#3f3f46' : '#27272a'}
                strokeWidth={isActiveEdge ? 3.5 : 2}
                strokeLinecap="round"
                className="transition-colors duration-300"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isCurrent = currentNode === node.val;
            const isVisited = visitedList.includes(node.val);
            const isRootNode = node.val === 'A';

            let fillColor = '#0f1219';
            let strokeColor = '#27272a';
            let textColor = '#71717a';

            if (isCurrent) {
              fillColor = glowColor;
              strokeColor = accentColor;
              textColor = '#ffffff';
            } else if (isVisited) {
              fillColor = '#182126';
              strokeColor = accentColor;
              textColor = '#e4e4e7';
            }

            return (
              <g key={node.id}>
                {/* Active pulse halo */}
                {isCurrent && !shouldReduceMotion && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={24}
                    fill={accentColor}
                    opacity={0.25}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={16}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isCurrent ? 2.5 : isVisited ? 2 : 1.5}
                  className="transition-colors duration-250"
                />

                <text
                  x={node.x}
                  y={node.y + 4.5}
                  textAnchor="middle"
                  fill={textColor}
                  className="font-mono font-bold text-xs select-none pointer-events-none"
                >
                  {node.val}
                </text>

                {/* Root identifier badge */}
                {isRootNode && (
                  <g transform={`translate(${node.x}, ${node.y - 20})`}>
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      className="fill-amber-400 font-mono text-[8px] font-bold"
                    >
                      ROOT
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <section id="comparison" className="py-20 border-t border-zinc-800/80 bg-dark-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold mb-3 border border-emerald-500/20">
            <Sparkles size={12} />
            <span>05</span>
            <span>//</span>
            <span>SYNCHRONIZED COMPARISON</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Three Traversals. One Tree.
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
            Watch how Inorder, Preorder, and Postorder traverse the exact same binary tree. Observe how the relative placement of the root node defines the entire algorithm.
          </p>
        </div>

        {/* ====================================================
            MEMORABLE VISUAL EXPLANATION (PRE, IN, POST ROOT MNEMONIC)
           ==================================================== */}
        <div className="mb-12">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            The Universal Traversal Mnemonic (Where is the Root?)
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 1. PREORDER Card */}
            <div className="p-6 rounded-2xl bg-dark-950/90 border border-sky-500/30 relative overflow-hidden shadow-xl group hover:border-sky-500/60 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/30 font-bold">
                  PREORDER
                </span>
                <span className="font-mono text-[11px] text-zinc-400">Root → Left → Right</span>
              </div>

              <div className="my-4 p-3 rounded-xl bg-sky-950/20 border border-sky-500/20 text-center">
                <div className="text-lg font-mono font-bold text-white tracking-wide flex items-center justify-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-sky-500/30 text-sky-200 border border-sky-400 font-extrabold shadow-sm shadow-sky-500/30">
                    A
                  </span>
                  <span className="text-zinc-400">B</span>
                  <span className="text-zinc-400">D</span>
                  <span className="text-zinc-400">E</span>
                  <span className="text-zinc-400">C</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-850">
                <div className="text-sm font-bold text-sky-300 font-mono">
                  PRE → Root comes first
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The root node <strong className="text-white">A</strong> is visited before any recursive calls to the left or right subtrees.
                </p>
              </div>
            </div>

            {/* 2. INORDER Card */}
            <div className="p-6 rounded-2xl bg-dark-950/90 border border-emerald-500/40 relative overflow-hidden shadow-xl group hover:border-emerald-500/70 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                  INORDER
                </span>
                <span className="font-mono text-[11px] text-zinc-400">Left → Root → Right</span>
              </div>

              <div className="my-4 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-center">
                <div className="text-lg font-mono font-bold text-white tracking-wide flex items-center justify-center gap-2">
                  <span className="text-zinc-400">D</span>
                  <span className="text-zinc-400">B</span>
                  <span className="text-zinc-400">E</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400 font-extrabold shadow-sm shadow-emerald-500/30">
                    A
                  </span>
                  <span className="text-zinc-400">C</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-850">
                <div className="text-sm font-bold text-emerald-300 font-mono">
                  IN → Root comes in between
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The root node <strong className="text-white">A</strong> sits directly in between the left branch <code className="text-zinc-300">{'{D, B, E}'}</code> and right branch <code className="text-zinc-300">{'{C}'}</code>.
                </p>
              </div>
            </div>

            {/* 3. POSTORDER Card */}
            <div className="p-6 rounded-2xl bg-dark-950/90 border border-purple-500/30 relative overflow-hidden shadow-xl group hover:border-purple-500/60 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
                  POSTORDER
                </span>
                <span className="font-mono text-[11px] text-zinc-400">Left → Right → Root</span>
              </div>

              <div className="my-4 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-center">
                <div className="text-lg font-mono font-bold text-white tracking-wide flex items-center justify-center gap-2">
                  <span className="text-zinc-400">D</span>
                  <span className="text-zinc-400">E</span>
                  <span className="text-zinc-400">B</span>
                  <span className="text-zinc-400">C</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400 font-extrabold shadow-sm shadow-purple-500/30">
                    A
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-850">
                <div className="text-sm font-bold text-purple-300 font-mono">
                  POST → Root comes last
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The root node <strong className="text-white">A</strong> is processed only after every descendant node in both subtrees has finished.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            "PLAY ALL" SYNCHRONIZED TRAVERSAL STAGE
           ==================================================== */}
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-950/90 border border-zinc-800 shadow-2xl mb-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-850">
            <div>
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-emerald-400" />
                <h3 className="text-lg font-bold text-white font-mono">
                  Simultaneous Traversal Comparison
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Hit "Play All" to step through all three traversals simultaneously on the same 5-node benchmark tree.
              </p>
            </div>

            {/* Play All Controls */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handlePlayAll}
                disabled={isPlayingAll}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-semibold text-xs font-mono transition shadow-lg shadow-emerald-500/20"
              >
                <Play size={14} fill="currentColor" />
                <span>Play All</span>
              </button>

              <button
                onClick={handlePauseAll}
                disabled={!isPlayingAll}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 text-xs font-mono border border-zinc-700 transition"
              >
                <Pause size={14} fill="currentColor" />
                <span>Pause</span>
              </button>

              <button
                onClick={handleResetAll}
                className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
                title="Reset All"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* 3 Synchronized Comparison Panels */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 1. INORDER Panel */}
            <div className="p-5 rounded-xl bg-dark-900 border border-zinc-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    INORDER
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {simStep} / 5 visited
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-400 mb-3">
                  Left → Root → Right
                </div>

                {renderMiniTree('inorder', '#10b981', '#064e3b')}
              </div>

              {/* Output Array with active highlights */}
              <div className="pt-3 border-t border-zinc-850">
                <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Output Sequence:
                </div>
                <div className="flex items-center gap-1.5">
                  {sequences.inorder.map((val, idx) => {
                    const isPassed = idx < simStep;
                    const isJustAdded = idx === simStep - 1;

                    return (
                      <React.Fragment key={val}>
                        <div
                          className={`flex-1 py-1 rounded text-center font-mono text-xs font-bold border transition-all ${
                            isJustAdded
                              ? 'bg-emerald-500 text-black border-emerald-400 scale-105 shadow-sm shadow-emerald-500/40'
                              : isPassed
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-dark-950 text-zinc-600 border-zinc-850'
                          }`}
                        >
                          {val}
                        </div>
                        {idx < 4 && <span className="text-[10px] text-zinc-700">→</span>}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. PREORDER Panel */}
            <div className="p-5 rounded-xl bg-dark-900 border border-zinc-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-sky-400">
                    PREORDER
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {simStep} / 5 visited
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-400 mb-3">
                  Root → Left → Right
                </div>

                {renderMiniTree('preorder', '#38bdf8', '#0c4a6e')}
              </div>

              {/* Output Array */}
              <div className="pt-3 border-t border-zinc-850">
                <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Output Sequence:
                </div>
                <div className="flex items-center gap-1.5">
                  {sequences.preorder.map((val, idx) => {
                    const isPassed = idx < simStep;
                    const isJustAdded = idx === simStep - 1;

                    return (
                      <React.Fragment key={val}>
                        <div
                          className={`flex-1 py-1 rounded text-center font-mono text-xs font-bold border transition-all ${
                            isJustAdded
                              ? 'bg-sky-400 text-black border-sky-300 scale-105 shadow-sm shadow-sky-400/40'
                              : isPassed
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                              : 'bg-dark-950 text-zinc-600 border-zinc-850'
                          }`}
                        >
                          {val}
                        </div>
                        {idx < 4 && <span className="text-[10px] text-zinc-700">→</span>}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. POSTORDER Panel */}
            <div className="p-5 rounded-xl bg-dark-900 border border-zinc-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-purple-400">
                    POSTORDER
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {simStep} / 5 visited
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-400 mb-3">
                  Left → Right → Root
                </div>

                {renderMiniTree('postorder', '#c084fc', '#581c87')}
              </div>

              {/* Output Array */}
              <div className="pt-3 border-t border-zinc-850">
                <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Output Sequence:
                </div>
                <div className="flex items-center gap-1.5">
                  {sequences.postorder.map((val, idx) => {
                    const isPassed = idx < simStep;
                    const isJustAdded = idx === simStep - 1;

                    return (
                      <React.Fragment key={val}>
                        <div
                          className={`flex-1 py-1 rounded text-center font-mono text-xs font-bold border transition-all ${
                            isJustAdded
                              ? 'bg-purple-400 text-black border-purple-300 scale-105 shadow-sm shadow-purple-400/40'
                              : isPassed
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : 'bg-dark-950 text-zinc-600 border-zinc-850'
                          }`}
                        >
                          {val}
                        </div>
                        {idx < 4 && <span className="text-[10px] text-zinc-700">→</span>}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Matrix Table */}
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
                <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
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

        {/* Tree Reconstruction Rules */}
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
                Theoretical computer science insight: Given two traversal orders, when is the original binary tree unique?
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
                    {rule.possible ? 'Deterministic Reconstruction' : 'Ambiguous (Requires Full Tree)'}
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
