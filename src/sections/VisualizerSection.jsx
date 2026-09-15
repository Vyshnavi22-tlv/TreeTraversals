import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Gauge,
  Sparkles,
  Info,
  Terminal,
  Activity,
  Layers,
  Code2
} from 'lucide-react';
import VisualizerTreeSvg from '../components/VisualizerTreeSvg';
import CodeTracer from '../components/CodeTracer';
import CallStackVisualizer from '../components/CallStackVisualizer';
import TraversalOutputQueue from '../components/TraversalOutputQueue';
import {
  createSeminarTree,
  inorder,
  preorder,
  postorder,
  generateTraversalSteps
} from '../algorithms/traversals';
import { TREE_PRESETS } from '../data/treePresets';
import { TRAVERSAL_INFO } from '../data/traversalInfo';

export default function VisualizerSection({
  selectedTraversal = 'inorder',
  onTraversalChange
}) {
  const shouldReduceMotion = useReducedMotion();

  // State
  const [selectedPresetId, setSelectedPresetId] = useState('default');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // Speed in ms per step: range from 1800ms (Slow) to 350ms (Fast). Default: 900ms
  const [stepDurationMs, setStepDurationMs] = useState(900);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Active preset object
  const currentPreset = useMemo(() => {
    return TREE_PRESETS.find((p) => p.id === selectedPresetId) || TREE_PRESETS[0];
  }, [selectedPresetId]);

  // Current tree root
  const currentTreeRoot = useMemo(() => {
    return currentPreset.factory();
  }, [currentPreset]);

  // Target expected output calculated by pure algorithm functions
  const expectedOutput = useMemo(() => {
    if (selectedTraversal === 'inorder') return inorder(currentTreeRoot);
    if (selectedTraversal === 'preorder') return preorder(currentTreeRoot);
    if (selectedTraversal === 'postorder') return postorder(currentTreeRoot);
    return [];
  }, [currentTreeRoot, selectedTraversal]);

  // Generate authentic algorithm execution steps
  const steps = useMemo(() => {
    return generateTraversalSteps(currentTreeRoot, selectedTraversal);
  }, [currentTreeRoot, selectedTraversal]);

  // Current execution step
  const currentStep = steps[currentStepIndex] || steps[0] || {};

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, stepDurationMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, stepDurationMs]);

  // Handlers
  const handleTraversalSelect = (type) => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    onTraversalChange && onTraversalChange(type);
  };

  const handlePresetSelect = (presetId) => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSelectedPresetId(presetId);
  };

  const handleStart = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Human-readable action styling & label
  const getActionBadgeColor = (actionType) => {
    switch (actionType) {
      case 'processing':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'visiting_left':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'visiting_right':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'backtracking':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'complete':
        return 'bg-emerald-400 text-black font-bold';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <section id="visualizer" className="py-20 border-t border-zinc-800/80 bg-dark-950 relative overflow-hidden">
      {/* Centerpiece ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold mb-3 border border-emerald-500/20">
              <Sparkles size={12} />
              <span>VISUAL CENTERPIECE</span>
              <span>//</span>
              <span>RECURSIVE ALGORITHM ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Interactive Visualizer
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              Watch the authentic recursive traversal execute step-by-step. Follow the active node, path transitions, execution stack, and live output stream.
            </p>
          </div>

          {/* Tree Preset Selector */}
          <div className="flex items-center gap-1.5 bg-dark-900 border border-zinc-800 rounded-xl p-1.5 self-start lg:self-auto shadow-sm">
            <span className="text-xs font-mono text-zinc-500 pl-2 pr-1">Tree:</span>
            {TREE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                  selectedPresetId === preset.id
                    ? 'bg-zinc-800 text-emerald-400 font-semibold border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {preset.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Main Visualizer Stage Card */}
        <div className="bg-dark-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-7 shadow-2xl shadow-emerald-950/20 space-y-6">
          {/* Top Control Deck: [ Inorder ] [ Preorder ] [ Postorder ] + [ Start ] [ Pause ] [ Reset ] + Speed */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
            {/* 1. Traversal Mode Buttons */}
            <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-zinc-800">
              {['inorder', 'preorder', 'postorder'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleTraversalSelect(mode)}
                  className={`px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-mono capitalize transition-all duration-200 ${
                    selectedTraversal === mode
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* 2. Playback & Step Controls */}
            <div className="flex items-center gap-2">
              {/* Start Button */}
              <button
                onClick={handleStart}
                disabled={isPlaying}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-semibold text-xs sm:text-sm font-mono transition shadow-lg shadow-emerald-500/20"
              >
                <Play size={14} fill="currentColor" />
                <span>Start</span>
              </button>

              {/* Pause Button */}
              <button
                onClick={handlePause}
                disabled={!isPlaying}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 font-semibold text-xs sm:text-sm font-mono border border-zinc-700 transition"
              >
                <Pause size={14} fill="currentColor" />
                <span>Pause</span>
              </button>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
                title="Reset (R)"
              >
                <RotateCcw size={15} />
              </button>

              {/* Step-by-Step Mode: Step Backward */}
              <button
                onClick={handleStepBackward}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-dark-950 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 text-xs font-mono border border-zinc-800 transition"
                title="Step Back"
              >
                <ChevronLeft size={14} />
                <span className="hidden sm:inline">Step</span>
              </button>

              {/* Step-by-Step Mode: Step Forward */}
              <button
                onClick={handleStepForward}
                disabled={currentStepIndex >= steps.length - 1}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-dark-950 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 text-xs font-mono border border-zinc-800 transition"
                title="Step Forward (N)"
              >
                <span className="hidden sm:inline">Step</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* 3. Speed Control: Slow ←→ Fast */}
            <div className="flex items-center gap-3 bg-dark-950 px-3.5 py-2 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-400">
              <span className="text-zinc-500">Slow</span>
              <input
                type="range"
                min="300"
                max="1800"
                step="50"
                value={2100 - stepDurationMs} // Inverted so slider left = slow, right = fast
                onChange={(e) => setStepDurationMs(2100 - Number(e.target.value))}
                className="w-24 sm:w-28 accent-emerald-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                title="Adjust animation speed"
              />
              <span className="text-emerald-400 font-semibold">Fast</span>
            </div>
          </div>

          {/* Current Action Display Banner */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-dark-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>

              <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
                <span className="text-zinc-500 uppercase tracking-wider text-[11px]">Current Action:</span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getActionBadgeColor(currentStep.actionType)}`}>
                  {currentStep.actionMessage}
                </span>
                {currentStep.detailedMessage && (
                  <span className="text-zinc-400 text-xs hidden md:inline">
                    — {currentStep.detailedMessage}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-zinc-500 shrink-0">
              <span>Step <strong className="text-emerald-400">{currentStepIndex + 1}</strong> of {steps.length}</span>
            </div>
          </div>

          {/* Centerpiece Grid: Tree Canvas (Left) + Code & Stack Tracers (Right) */}
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Dynamic SVG Tree Canvas */}
            <div className="lg:col-span-7 bg-dark-950/70 border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-zinc-850">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-emerald-400" />
                  <span className="font-semibold text-zinc-300">
                    Binary Tree Canvas: {currentPreset.name.split(' (')[0]}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500">
                  {selectedTraversal.toUpperCase()} rule: {TRAVERSAL_INFO[selectedTraversal].rule}
                </span>
              </div>

              {/* Dynamic SVG Tree Component with Layout Engine */}
              <VisualizerTreeSvg
                root={currentTreeRoot}
                currentNodeId={currentStep.currentNodeId}
                visitedNodes={currentStep.visitedNodes || []}
                activeEdge={currentStep.activeEdge}
                actionType={currentStep.actionType}
                hoveredNodeId={hoveredNode?.id}
                onNodeHover={setHoveredNode}
                onNodeClick={(node) => setHoveredNode(node)}
              />

              {/* Bottom Canvas Status */}
              <div className="pt-2 border-t border-zinc-850 text-xs font-mono text-zinc-400 flex items-center justify-between">
                <div>
                  {hoveredNode ? (
                    <span className="text-emerald-400">
                      Node <strong>{hoveredNode.val}</strong> (Left: {hoveredNode.left ? hoveredNode.left.val : 'null'}, Right: {hoveredNode.right ? hoveredNode.right.val : 'null'})
                    </span>
                  ) : (
                    <span className="text-zinc-500">
                      {shouldReduceMotion ? 'Reduced motion active' : 'Click/hover any node to inspect links'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Visited
                  </span>
                  <span className="flex items-center gap-1 text-zinc-600">
                    <span className="w-2 h-2 rounded-full bg-zinc-700"></span> Unvisited
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Synchronized Code Tracer + Real Call Stack */}
            <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="h-[210px]">
                <CodeTracer
                  traversalType={selectedTraversal}
                  activeLine={currentStep.codeLine}
                />
              </div>

              <div className="h-[180px]">
                <CallStackVisualizer callStack={currentStep.callStack || []} />
              </div>
            </div>
          </div>

          {/* Live Traversal Output Stream */}
          <TraversalOutputQueue
            visitedNodes={currentStep.visitedNodes || []}
            expectedNodes={expectedOutput}
            traversalName={TRAVERSAL_INFO[selectedTraversal].name}
          />
        </div>
      </div>
    </section>
  );
}
