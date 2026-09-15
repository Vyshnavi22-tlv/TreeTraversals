import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle,
  Trash2,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  Sparkles,
  Edit3,
  AlertCircle,
  CheckCircle2,
  TreePine,
  Layers,
  HelpCircle
} from 'lucide-react';
import VisualizerTreeSvg from '../components/VisualizerTreeSvg';
import TraversalOutputQueue from '../components/TraversalOutputQueue';
import {
  TreeNode,
  createSeminarTree,
  inorder,
  preorder,
  postorder,
  generateTraversalSteps,
  addLeftChild,
  addRightChild,
  deleteNodeById,
  updateNodeVal,
  findNodeById,
  countNodes,
  getTreeHeight
} from '../algorithms/traversals';
import { TRAVERSAL_INFO } from '../data/traversalInfo';

export default function BuildYourOwnTreeSection() {
  // Tree state: default to seminar tree so user starts with a great playground
  const [customTree, setCustomTree] = useState(() => createSeminarTree());
  const [selectedNodeId, setSelectedNodeId] = useState('A');
  const [nodeValueInput, setNodeValueInput] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null); // { type: 'error' | 'success', text: string }

  // Traversal execution state
  const [selectedTraversal, setSelectedTraversal] = useState('inorder');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Selected node object in current tree
  const selectedNode = useMemo(() => {
    return customTree && selectedNodeId ? findNodeById(customTree, selectedNodeId) : null;
  }, [customTree, selectedNodeId]);

  // Keep nodeValueInput in sync when selection changes
  useEffect(() => {
    if (selectedNode) {
      setNodeValueInput(String(selectedNode.val));
    } else {
      setNodeValueInput('');
    }
  }, [selectedNodeId, selectedNode]);

  // Stats
  const nodeCount = useMemo(() => countNodes(customTree), [customTree]);
  const treeHeight = useMemo(() => getTreeHeight(customTree), [customTree]);

  // Pure traversal outputs on the custom tree
  const expectedOutput = useMemo(() => {
    if (!customTree) return [];
    if (selectedTraversal === 'inorder') return inorder(customTree);
    if (selectedTraversal === 'preorder') return preorder(customTree);
    if (selectedTraversal === 'postorder') return postorder(customTree);
    return [];
  }, [customTree, selectedTraversal]);

  // Algorithm steps for the custom tree
  const steps = useMemo(() => {
    if (!customTree) return [];
    return generateTraversalSteps(customTree, selectedTraversal);
  }, [customTree, selectedTraversal]);

  const currentStep = steps[currentStepIndex] || steps[0] || {};

  // Auto-play timer for custom tree traversal
  useEffect(() => {
    if (!isPlaying || !steps.length) return;

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
    }, 900);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  // Notification helper
  const notify = (text, type = 'error') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Tree operation handlers
  const handleAddRoot = () => {
    if (customTree) {
      notify('Root already exists! You can delete it or add children to it.');
      return;
    }
    const val = nodeValueInput.trim() || 'A';
    const newRoot = new TreeNode(val, null, null, `node_${Date.now()}`);
    setCustomTree(newRoot);
    setSelectedNodeId(newRoot.id);
    notify(`Created Root node "${val}"`, 'success');
    resetTraversal();
  };

  const handleAddLeftChild = () => {
    if (!customTree) {
      notify('Tree is empty. Add a root node first.');
      return;
    }
    if (!selectedNode) {
      notify('Please click on a node in the tree to select where to add a left child.');
      return;
    }
    if (selectedNode.left) {
      notify(`Node ${selectedNode.val} already has a left child (${selectedNode.left.val}).`);
      return;
    }

    // Auto generate next letter or default
    const nextVal = promptForValue(`Enter value for Left child of ${selectedNode.val}:`, 'L');
    if (!nextVal) return;

    try {
      const updated = addLeftChild(customTree, selectedNode.id, nextVal);
      setCustomTree(updated);
      notify(`Added Left child "${nextVal}" to Node ${selectedNode.val}`, 'success');
      resetTraversal();
    } catch (err) {
      notify(err.message);
    }
  };

  const handleAddRightChild = () => {
    if (!customTree) {
      notify('Tree is empty. Add a root node first.');
      return;
    }
    if (!selectedNode) {
      notify('Please click on a node in the tree to select where to add a right child.');
      return;
    }
    if (selectedNode.right) {
      notify(`Node ${selectedNode.val} already has a right child (${selectedNode.right.val}).`);
      return;
    }

    const nextVal = promptForValue(`Enter value for Right child of ${selectedNode.val}:`, 'R');
    if (!nextVal) return;

    try {
      const updated = addRightChild(customTree, selectedNode.id, nextVal);
      setCustomTree(updated);
      notify(`Added Right child "${nextVal}" to Node ${selectedNode.val}`, 'success');
      resetTraversal();
    } catch (err) {
      notify(err.message);
    }
  };

  const handleDeleteSelected = () => {
    if (!customTree) {
      notify('Tree is empty.');
      return;
    }
    if (!selectedNode) {
      notify('Please click a node to select it for deletion.');
      return;
    }

    const valDeleted = selectedNode.val;
    const isRoot = customTree.id === selectedNode.id;
    const updated = deleteNodeById(customTree, selectedNode.id);
    setCustomTree(updated);
    setSelectedNodeId(updated ? updated.id : null);
    notify(isRoot ? 'Cleared entire tree (Root deleted).' : `Deleted node "${valDeleted}" and its subtree.`, 'success');
    resetTraversal();
  };

  const handleUpdateValue = () => {
    if (!selectedNode) {
      notify('Select a node first to rename it.');
      return;
    }
    const val = nodeValueInput.trim();
    if (!val) {
      notify('Node value cannot be empty.');
      return;
    }
    const updated = updateNodeVal(customTree, selectedNode.id, val);
    setCustomTree(updated);
    notify(`Updated node value to "${val}".`, 'success');
    resetTraversal();
  };

  const handleResetToSeminar = () => {
    const tree = createSeminarTree();
    setCustomTree(tree);
    setSelectedNodeId('A');
    notify('Restored standard 5-node Seminar Tree (A-E).', 'success');
    resetTraversal();
  };

  const handleClearTree = () => {
    setCustomTree(null);
    setSelectedNodeId(null);
    notify('Tree cleared. Click "Add Root" to build from scratch.', 'success');
    resetTraversal();
  };

  // Traversal playback
  const resetTraversal = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleTraversalChange = (type) => {
    setSelectedTraversal(type);
    resetTraversal();
  };

  const handlePlayTraversal = () => {
    if (!customTree) {
      notify('Add nodes to the tree before running traversal.');
      return;
    }
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // Helper prompt modal fallback
  function promptForValue(msg, defaultVal) {
    const res = window.prompt(msg, defaultVal);
    if (!res) return null;
    return res.trim().slice(0, 5); // Limit length
  }

  return (
    <section id="build-tree" className="py-20 border-t border-zinc-800/80 bg-dark-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold mb-3 border border-emerald-500/20">
              <TreePine size={13} />
              <span>INTERACTIVE BUILDER</span>
              <span>//</span>
              <span>FEATURE 01</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Build Your Own Tree
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              Construct any custom binary tree node-by-node. Add left and right children, modify values, and run the authentic Inorder, Preorder, and Postorder algorithms on your custom creation.
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2 self-start lg:self-auto font-mono text-xs">
            <button
              onClick={handleResetToSeminar}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition border border-zinc-700"
            >
              Reset to Seminar Tree
            </button>
            <button
              onClick={handleClearTree}
              className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 transition border border-red-800/40"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Builder Stage Container */}
        <div className="bg-dark-950/90 border border-zinc-800 rounded-2xl p-4 sm:p-7 shadow-2xl space-y-6">
          {/* Notification / Toast Banner */}
          <AnimatePresence>
            {feedbackMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
                  feedbackMessage.type === 'success'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {feedbackMessage.type === 'success' ? (
                    <CheckCircle2 size={15} className="text-emerald-400" />
                  ) : (
                    <AlertCircle size={15} className="text-amber-400" />
                  )}
                  <span>{feedbackMessage.text}</span>
                </div>
                <button
                  onClick={() => setFeedbackMessage(null)}
                  className="text-zinc-500 hover:text-zinc-300 text-xs ml-4"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Builder Controls Toolbar */}
          <div className="p-4 rounded-xl bg-dark-900 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
            {/* Left: Child Creation Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {!customTree ? (
                <button
                  onClick={handleAddRoot}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono shadow-md shadow-emerald-500/20 transition"
                >
                  <PlusCircle size={15} />
                  <span>Add Root Node</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAddLeftChild}
                    disabled={!selectedNode || Boolean(selectedNode?.left)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-35 text-zinc-200 text-xs font-mono border border-zinc-700 transition"
                    title={selectedNode?.left ? 'Left child already exists' : 'Add Left Child to selected node'}
                  >
                    <PlusCircle size={14} className="text-sky-400" />
                    <span>Add Left Child</span>
                  </button>

                  <button
                    onClick={handleAddRightChild}
                    disabled={!selectedNode || Boolean(selectedNode?.right)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-35 text-zinc-200 text-xs font-mono border border-zinc-700 transition"
                    title={selectedNode?.right ? 'Right child already exists' : 'Add Right Child to selected node'}
                  >
                    <PlusCircle size={14} className="text-purple-400" />
                    <span>Add Right Child</span>
                  </button>

                  <button
                    onClick={handleDeleteSelected}
                    disabled={!selectedNode}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 disabled:opacity-30 text-red-300 text-xs font-mono border border-red-800/40 transition"
                    title="Delete selected node and all its children"
                  >
                    <Trash2 size={14} />
                    <span>Delete Node</span>
                  </button>
                </>
              )}
            </div>

            {/* Right: Selected Node Rename Input & Stats */}
            {selectedNode && (
              <div className="flex items-center gap-2 bg-dark-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
                <span className="text-zinc-400 pl-2">Selected:</span>
                <input
                  type="text"
                  maxLength={5}
                  value={nodeValueInput}
                  onChange={(e) => setNodeValueInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateValue()}
                  className="w-16 bg-zinc-900 text-center font-bold text-emerald-300 border border-zinc-750 rounded-lg px-2 py-1 outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleUpdateValue}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition"
                >
                  Rename
                </button>
              </div>
            )}

            {/* Tree Stats Badge */}
            <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
              <span>Nodes: <strong className="text-white">{nodeCount}</strong></span>
              <span className="text-zinc-600">•</span>
              <span>Height: <strong className="text-white">{treeHeight}</strong></span>
            </div>
          </div>

          {/* Dynamic SVG Tree Canvas */}
          <div className="bg-dark-950/80 border border-zinc-800/90 rounded-2xl p-4 relative min-h-[300px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pb-2 border-b border-zinc-850">
              <span>Click any node to select it for adding children or deletion</span>
              <span>{selectedNode ? `Active Target: Node ${selectedNode.val}` : 'No node selected'}</span>
            </div>

            {customTree ? (
              <VisualizerTreeSvg
                root={customTree}
                currentNodeId={isPlaying ? currentStep.currentNodeId : selectedNodeId}
                visitedNodes={isPlaying ? currentStep.visitedNodes : []}
                activeEdge={isPlaying ? currentStep.activeEdge : null}
                actionType={isPlaying ? currentStep.actionType : ''}
                hoveredNodeId={hoveredNode?.id}
                onNodeHover={setHoveredNode}
                onNodeClick={(node) => setSelectedNodeId(node.id)}
              />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <TreePine size={24} />
                </div>
                <div className="text-zinc-400 font-mono text-sm">
                  Your tree canvas is currently empty.
                </div>
                <button
                  onClick={handleAddRoot}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  + Add Root Node
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Layout: Dynamically computed without hardcoded coordinates</span>
              <span>Reusable Engine</span>
            </div>
          </div>

          {/* ====================================================
              TRAVERSE YOUR CUSTOM TREE CONTROLS
             ==================================================== */}
          <div className="p-5 rounded-2xl bg-dark-900/70 border border-zinc-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase font-bold text-zinc-300">
                  Traverse Your Custom Tree:
                </span>
              </div>

              {/* Traversal Selector: [ Inorder ] [ Preorder ] [ Postorder ] */}
              <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-zinc-800 font-mono text-xs">
                {['inorder', 'preorder', 'postorder'].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTraversalChange(t)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition ${
                      selectedTraversal === t
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayTraversal}
                  disabled={!customTree || isPlaying}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-semibold text-xs font-mono transition shadow-md shadow-emerald-500/20"
                >
                  <Play size={13} fill="currentColor" />
                  <span>Traverse</span>
                </button>

                <button
                  onClick={() => setIsPlaying(false)}
                  disabled={!isPlaying}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 text-xs font-mono border border-zinc-700 transition"
                >
                  <Pause size={13} fill="currentColor" />
                  <span>Pause</span>
                </button>

                <button
                  onClick={resetTraversal}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
                  title="Reset Traversal"
                >
                  <RotateCcw size={14} />
                </button>

                <button
                  onClick={handleStepForward}
                  disabled={!customTree || currentStepIndex >= steps.length - 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-dark-950 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 text-xs font-mono border border-zinc-800 transition"
                >
                  <span>Step</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Current Step Status Banner */}
            {isPlaying && (
              <div className="p-3 rounded-xl bg-dark-950 border border-zinc-800 text-xs font-mono flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-zinc-400">Current Action:</span>
                  <span className="text-emerald-300 font-bold">{currentStep.actionMessage}</span>
                  <span className="text-zinc-500 hidden sm:inline">— {currentStep.detailedMessage}</span>
                </div>
                <span className="text-zinc-500">
                  Step {currentStepIndex + 1} / {steps.length}
                </span>
              </div>
            )}

            {/* Traversal Output Queue */}
            <TraversalOutputQueue
              visitedNodes={isPlaying || currentStepIndex > 0 ? currentStep.visitedNodes : []}
              expectedNodes={expectedOutput}
              traversalName={`Custom Tree ${TRAVERSAL_INFO[selectedTraversal].name}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
