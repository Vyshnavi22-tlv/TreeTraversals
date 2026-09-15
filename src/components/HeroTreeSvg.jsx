import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { createSeminarTree, computeTreeLayout, inorder, preorder, postorder } from '../algorithms/traversals';

export default function HeroTreeSvg() {
  const shouldReduceMotion = useReducedMotion();
  const [activeMode, setActiveMode] = useState('inorder'); // 'inorder' | 'preorder' | 'postorder'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);

  const root = useMemo(() => createSeminarTree(), []);

  // Compute dynamic layout from tree data without any hardcoded visual coordinates
  const { nodes, edges, width, height } = useMemo(() => {
    return computeTreeLayout(root, {
      viewWidth: 440,
      viewHeight: 290,
      topMargin: 50,
      bottomMargin: 40,
      horizontalPadding: 55
    });
  }, [root]);

  // Traversal sequences computed by pure traversal functions
  const sequences = useMemo(() => ({
    inorder: inorder(root),
    preorder: preorder(root),
    postorder: postorder(root)
  }), [root]);

  const sequence = sequences[activeMode];
  const currentNodeVal = sequence[currentStepIndex];

  // Auto-play subtle animation cycle in Hero
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % sequence.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [isPlaying, sequence.length, activeMode]);

  // Reset step index when mode changes
  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setCurrentStepIndex(0);
  };

  // Node roles in canonical tree
  const roles = {
    A: 'Root (Depth 0)',
    B: 'Left Subtree Root (Depth 1)',
    C: 'Right Leaf (Depth 1)',
    D: 'Leftmost Leaf (Depth 2)',
    E: 'Right Leaf (Depth 2)'
  };

  const getVisitOrder = (val) => {
    const idx = sequence.indexOf(val);
    return idx !== -1 ? idx + 1 : null;
  };

  const isVisitedSoFar = (val) => {
    const idx = sequence.indexOf(val);
    return idx <= currentStepIndex;
  };

  return (
    <div className="relative w-full max-w-lg mx-auto bg-dark-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-emerald-950/20 overflow-hidden">
      {/* Top ambient glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Hero interactive control bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-800/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-zinc-400">Live Engine Preview</span>
        </div>

        {/* Mode selector pills */}
        <div className="flex items-center bg-dark-950/80 p-0.5 rounded-lg border border-zinc-800">
          {['inorder', 'preorder', 'postorder'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`px-2 py-1 rounded-md text-[11px] font-mono capitalize transition-all duration-200 ${
                activeMode === mode
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause auto-cycle' : 'Play auto-cycle'}
            className="p-1 rounded-md bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 hover:text-white transition"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button
            onClick={() => setCurrentStepIndex(0)}
            title="Reset sequence"
            className="p-1 rounded-md bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 hover:text-white transition"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* SVG Canvas with dynamic layout */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
        >
          <defs>
            <linearGradient id="heroEdgeActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
            </linearGradient>

            <radialGradient id="heroActiveGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Edges */}
          {edges.map((edge) => {
            const isEdgeActive =
              (currentNodeVal === edge.from.val && sequence.indexOf(edge.to.val) === currentStepIndex + 1) ||
              (currentNodeVal === edge.to.val && sequence.indexOf(edge.from.val) <= currentStepIndex);

            return (
              <g key={edge.id}>
                <line
                  x1={edge.from.x}
                  y1={edge.from.y}
                  x2={edge.to.x}
                  y2={edge.to.y}
                  stroke="#27272a"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {isEdgeActive && (
                  <motion.line
                    initial={shouldReduceMotion ? { opacity: 1 } : { pathLength: 0 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { pathLength: 1 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
                    x1={edge.from.x}
                    y1={edge.from.y}
                    x2={edge.to.x}
                    y2={edge.to.y}
                    stroke="url(#heroEdgeActiveGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isActive = currentNodeVal === node.val;
            const visited = isVisitedSoFar(node.val);
            const visitOrder = getVisitOrder(node.val);
            const isHovered = hoveredNode === node.val;

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform duration-200"
                onMouseEnter={() => setHoveredNode(node.val)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => {
                  const idx = sequence.indexOf(node.val);
                  if (idx !== -1) setCurrentStepIndex(idx);
                }}
              >
                {/* Active Outer Glow Ring */}
                {isActive && !shouldReduceMotion && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={32}
                    fill="url(#heroActiveGlow)"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Main Node Circle */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  animate={
                    shouldReduceMotion
                      ? {
                          fill: isActive ? '#064e3b' : visited ? '#141c19' : '#11141b',
                          stroke: isActive ? '#10b981' : visited ? '#059669' : isHovered ? '#71717a' : '#27272a'
                        }
                      : {
                          fill: isActive ? '#064e3b' : visited ? '#141c19' : '#11141b',
                          stroke: isActive ? '#10b981' : visited ? '#059669' : isHovered ? '#71717a' : '#27272a',
                          strokeWidth: isActive ? 2.5 : visited ? 2 : 1.5,
                          scale: isActive ? 1.08 : isHovered ? 1.05 : 1
                        }
                  }
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25 }}
                />

                {/* Node Value Label */}
                <text
                  x={node.x}
                  y={node.y + 6}
                  textAnchor="middle"
                  className={`font-mono font-bold text-base select-none pointer-events-none transition-colors ${
                    isActive
                      ? 'fill-emerald-200'
                      : visited
                      ? 'fill-zinc-200'
                      : 'fill-zinc-400'
                  }`}
                >
                  {node.val}
                </text>

                {/* Visit Order Badge */}
                {visited && (
                  <g transform={`translate(${node.x + 12}, ${node.y - 18})`}>
                    <circle cx="0" cy="0" r="9" fill="#10b981" />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      className="fill-black font-mono font-bold text-[10px] select-none"
                    >
                      {visitOrder}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating tooltip when node is hovered */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 shadow-xl flex items-center gap-2 pointer-events-none"
            >
              <span className="text-emerald-400 font-bold">Node {hoveredNode}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">{roles[hoveredNode] || 'TreeNode'}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">
                {activeMode} position: #{sequence.indexOf(hoveredNode) + 1}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Traversal Stream Visual */}
      <div className="mt-3 pt-3 border-t border-zinc-800/60">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            {activeMode} Sequence:
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            Step {currentStepIndex + 1} of {sequence.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {sequence.map((nodeVal, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isDone = idx <= currentStepIndex;

            return (
              <React.Fragment key={nodeVal}>
                <div
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`cursor-pointer flex-1 py-1.5 px-2 rounded-lg text-center font-mono text-xs transition-all duration-200 border ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border-emerald-500/50 shadow-sm shadow-emerald-500/20 scale-105'
                      : isDone
                      ? 'bg-zinc-800/70 text-zinc-200 border-zinc-700'
                      : 'bg-dark-950/60 text-zinc-400 border-zinc-850'
                  }`}
                >
                  {nodeVal}
                </div>
                {idx < sequence.length - 1 && (
                  <span className={`text-[10px] ${isDone ? 'text-emerald-500/70' : 'text-zinc-700'}`}>
                    →
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
