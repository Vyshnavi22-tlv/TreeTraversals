import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

export default function HeroTreeSvg() {
  const [activeMode, setActiveMode] = useState('inorder'); // 'inorder' | 'preorder' | 'postorder'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Traversal sequences on A, B, C, D, E
  const sequences = {
    inorder: ['D', 'B', 'E', 'A', 'C'],
    preorder: ['A', 'B', 'D', 'E', 'C'],
    postorder: ['D', 'E', 'B', 'C', 'A']
  };

  const sequence = sequences[activeMode];
  const currentNode = sequence[currentStepIndex];

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

  // Node coordinates (SVG viewBox: 0 0 440 320)
  const nodes = [
    { id: 'A', label: 'A', x: 220, y: 55, role: 'Root', depth: 0 },
    { id: 'B', label: 'B', x: 125, y: 150, role: 'Left Subtree Root', depth: 1 },
    { id: 'C', label: 'C', x: 315, y: 150, role: 'Right Child', depth: 1 },
    { id: 'D', label: 'D', x: 75, y: 245, role: 'Left Leaf', depth: 2 },
    { id: 'E', label: 'E', x: 175, y: 245, role: 'Right Leaf', depth: 2 }
  ];

  const edges = [
    { from: 'A', to: 'B', x1: 220, y1: 55, x2: 125, y2: 150 },
    { from: 'A', to: 'C', x1: 220, y1: 55, x2: 315, y2: 150 },
    { from: 'B', to: 'D', x1: 125, y1: 150, x2: 75, y2: 245 },
    { from: 'B', to: 'E', x1: 125, y1: 150, x2: 175, y2: 245 }
  ];

  // Check if a node is visited in the current cycle
  const getVisitOrder = (nodeId) => {
    const idx = sequence.indexOf(nodeId);
    return idx !== -1 ? idx + 1 : null;
  };

  const isVisitedSoFar = (nodeId) => {
    const idx = sequence.indexOf(nodeId);
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
          <span className="font-mono text-zinc-400">Live Preview</span>
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

      {/* SVG Canvas */}
      <div className="relative">
        <svg
          viewBox="0 0 440 300"
          className="w-full h-auto select-none"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
        >
          <defs>
            {/* Linear gradients for edges */}
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#27272a" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="edgeActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
            </linearGradient>

            {/* Radial glow for active node */}
            <radialGradient id="activeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Edges */}
          {edges.map((edge) => {
            const isEdgeActive =
              (currentNode === edge.from && sequence.indexOf(edge.to) === currentStepIndex + 1) ||
              (currentNode === edge.to && sequence.indexOf(edge.from) <= currentStepIndex);

            return (
              <g key={`${edge.from}-${edge.to}`}>
                {/* Background line */}
                <line
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke="#27272a"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Active connecting glow line */}
                {isEdgeActive && (
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    stroke="url(#edgeActiveGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isActive = currentNode === node.id;
            const visited = isVisitedSoFar(node.id);
            const visitOrder = getVisitOrder(node.id);
            const isHovered = hoveredNode === node.id;

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform duration-200"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => {
                  const idx = sequence.indexOf(node.id);
                  if (idx !== -1) setCurrentStepIndex(idx);
                }}
              >
                {/* Active Outer Glow Ring */}
                {isActive && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={32}
                    fill="url(#activeGlow)"
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
                  animate={{
                    fill: isActive
                      ? '#064e3b'
                      : visited
                      ? '#141c19'
                      : '#11141b',
                    stroke: isActive
                      ? '#10b981'
                      : visited
                      ? '#059669'
                      : isHovered
                      ? '#71717a'
                      : '#27272a',
                    strokeWidth: isActive ? 2.5 : visited ? 2 : 1.5,
                    scale: isActive ? 1.08 : isHovered ? 1.05 : 1
                  }}
                  transition={{ duration: 0.25 }}
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
                  {node.label}
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 shadow-xl flex items-center gap-2 pointer-events-none"
            >
              <span className="text-emerald-400 font-bold">Node {hoveredNode}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">
                {nodes.find((n) => n.id === hoveredNode)?.role}
              </span>
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
