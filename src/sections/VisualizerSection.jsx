import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Sliders, Info, Eye, TreePine, Sparkles } from 'lucide-react';
import VisualizerTreeSvg from '../components/VisualizerTreeSvg';
import CodeTracer from '../components/CodeTracer';
import CallStackVisualizer from '../components/CallStackVisualizer';
import TraversalOutputQueue from '../components/TraversalOutputQueue';
import { generateTraversalSteps, getTraversalOutput } from '../algorithms/traversals';
import { TREE_PRESETS } from '../data/treePresets';
import { TRAVERSAL_INFO } from '../data/traversalInfo';

export default function VisualizerSection({
  selectedTraversal = 'inorder',
  onTraversalChange
}) {
  const [selectedPresetId, setSelectedPresetId] = useState('default');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 0.5x, 1x, 1.5x, 2x
  const [hoveredNode, setHoveredNode] = useState(null);

  // Active preset object
  const currentPreset = useMemo(() => {
    return TREE_PRESETS.find((p) => p.id === selectedPresetId) || TREE_PRESETS[0];
  }, [selectedPresetId]);

  // Current tree root instance
  const currentTreeRoot = useMemo(() => {
    return currentPreset.factory();
  }, [currentPreset]);

  // Expected complete traversal output
  const expectedOutput = useMemo(() => {
    return getTraversalOutput(currentTreeRoot, selectedTraversal);
  }, [currentTreeRoot, selectedTraversal]);

  // Step-by-step algorithm trace
  const steps = useMemo(() => {
    return generateTraversalSteps(currentTreeRoot, selectedTraversal);
  }, [currentTreeRoot, selectedTraversal]);

  // Current step state
  const currentStep = steps[currentStepIndex] || steps[0] || {};

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const intervalMs = Math.max(300, Math.floor(1100 / speedMultiplier));
    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speedMultiplier]);

  // When traversal type or preset changes, reset steps and pause
  const handleTraversalChange = (type) => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    onTraversalChange && onTraversalChange(type);
  };

  const handlePresetChange = (presetId) => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSelectedPresetId(presetId);
  };

  const handleTogglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
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

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <section id="visualizer" className="py-20 border-t border-zinc-800/80 bg-dark-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold mb-3 border border-emerald-500/20">
              <span>04</span>
              <span>//</span>
              <span>INTERACTIVE WORKBENCH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Visualizer & Execution Engine
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-1">
              Step through recursive calls, trace the execution stack, and watch the output array generate.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2 bg-dark-900 border border-zinc-800 rounded-xl p-1.5 self-start md:self-auto">
            <span className="text-xs font-mono text-zinc-500 pl-2">Tree:</span>
            {TREE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
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

        {/* Workbench Container */}
        <div className="bg-dark-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
          {/* Top Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
            {/* Traversal selector tabs */}
            <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-zinc-800">
              {['inorder', 'preorder', 'postorder'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTraversalChange(type)}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                    selectedTraversal === type
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="Reset (R)"
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
              >
                <RotateCcw size={15} />
              </button>

              <button
                onClick={handleStepBackward}
                disabled={currentStepIndex === 0}
                title="Step Back"
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 hover:text-white border border-zinc-700 transition"
              >
                <SkipBack size={15} />
              </button>

              <button
                onClick={handleTogglePlay}
                title="Play/Pause (Space)"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition shadow-md shadow-emerald-500/20"
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={handleStepForward}
                disabled={currentStepIndex >= steps.length - 1}
                title="Next Step (N)"
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300 hover:text-white border border-zinc-700 transition"
              >
                <SkipForward size={15} />
              </button>
            </div>

            {/* Speed & Progress status */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 bg-dark-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-zinc-400">
                <Sliders size={13} className="text-zinc-500" />
                <span>Speed:</span>
                {[0.75, 1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeedMultiplier(s)}
                    className={`px-1.5 py-0.5 rounded text-[11px] ${
                      speedMultiplier === s
                        ? 'bg-zinc-800 text-emerald-400 font-bold'
                        : 'hover:text-zinc-200 text-zinc-500'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <div className="hidden sm:block text-zinc-400">
                Step <span className="text-emerald-400 font-bold">{currentStepIndex + 1}</span> / {steps.length}
              </div>
            </div>
          </div>

          {/* Action / Step Explanation Banner */}
          <div className="px-4 py-3 rounded-xl bg-dark-950 border border-zinc-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-400">Status:</span>
              <span className="text-zinc-200 font-medium">
                {currentStep.message || 'Ready to traverse'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-3 text-[11px] text-zinc-500">
              <span>Rule: <strong className="text-emerald-400">{TRAVERSAL_INFO[selectedTraversal].rule}</strong></span>
            </div>
          </div>

          {/* Main Workspace Grid */}
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Interactive Tree Canvas */}
            <div className="lg:col-span-7 bg-dark-950/70 border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-zinc-850">
                <div className="flex items-center gap-2">
                  <TreePine size={14} className="text-emerald-400" />
                  <span>Tree Canvas ({currentPreset.name.split(' (')[0]})</span>
                </div>
                <span className="text-[11px] text-zinc-500">Click node to inspect</span>
              </div>

              {/* Dynamic SVG Tree */}
              <VisualizerTreeSvg
                root={currentTreeRoot}
                activeNodeId={currentStep.activeNodeId}
                visitedNodes={currentStep.visitedNodes || []}
                hoveredNodeId={hoveredNode?.id}
                onNodeHover={setHoveredNode}
                onNodeClick={(node) => setHoveredNode(node)}
              />

              {/* Node Inspection Tooltip */}
              <div className="pt-2 border-t border-zinc-850 text-xs font-mono text-zinc-400 flex items-center justify-between">
                <div>
                  {hoveredNode ? (
                    <span className="text-emerald-400">
                      Selected Node: <strong>{hoveredNode.val}</strong> (Left: {hoveredNode.left ? hoveredNode.left.val : 'null'}, Right: {hoveredNode.right ? hoveredNode.right.val : 'null'})
                    </span>
                  ) : (
                    <span>Hover over any node for link properties</span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-600">SVG 60fps</span>
              </div>
            </div>

            {/* Right: Dual Tracer (Code Line + Call Stack) */}
            <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="h-[220px]">
                <CodeTracer
                  traversalType={selectedTraversal}
                  activeLine={currentStep.codeLine}
                />
              </div>

              <div className="h-[190px]">
                <CallStackVisualizer callStack={currentStep.callStack || []} />
              </div>
            </div>
          </div>

          {/* Bottom Live Traversal Output Queue */}
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
