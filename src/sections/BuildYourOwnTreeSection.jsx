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
  TreePine,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import VisualizerTreeSvg from '../components/VisualizerTreeSvg';
import TraversalOutputQueue from '../components/TraversalOutputQueue';
import {
  TreeNode,
  createStandardTree,
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
  // Tree state: starts with the standard tree so users have an immediate canvas to experiment with
  const [customTree, setCustomTree] = useState(() => createStandardTree());
  const [selectedNodeId, setSelectedNodeId] = useState('A');
  const [nodeValueInput, setNodeValueInput] = useState('A');
  const [newChildValue, setNewChildValue] = useState('X');
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // Traversal execution state
  const [selectedTraversal, setSelectedTraversal] = useState('inorder');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Selected node object in current tree
  const selectedNode = useMemo(() => {
    return customTree && selectedNodeId ? findNodeById(customTree, selectedNodeId) : null;
  }, [customTree, selectedNodeId]);

  // Sync nodeValueInput when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setNodeValueInput(String(selectedNode.val));
    }
  }, [selectedNodeId, selectedNode]);

  // Compute metrics
  const nodeCount = useMemo(() => countNodes(customTree), [customTree]);
  const treeHeight = useMemo(() => getTreeHeight(customTree), [customTree]);

  // Target expected output calculated by pure algorithm functions on custom tree
  const expectedOutput = useMemo(() => {
    if (!customTree) return [];
    if (selectedTraversal === 'inorder') return inorder(customTree);
    if (selectedTraversal === 'preorder') return preorder(customTree);
    if (selectedTraversal === 'postorder') return postorder(customTree);
    return [];
  }, [customTree, selectedTraversal]);

  // Authentic algorithm execution steps generated for custom tree
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

  const notify = (message, type = 'error') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const resetTraversal = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  /* -------------------------------------------------------------
   * Tree Editing Operations
   * ------------------------------------------------------------- */
  // 1. Add Root
  const handleAddRoot = () => {
    if (customTree) {
      notify('Root already exists. You can select it to edit or delete.');
      return;
    }
    const val = nodeValueInput.trim() || 'A';
    const newRoot = new TreeNode(val, null, null, `node_${Date.now()}`);
    setCustomTree(newRoot);
    setSelectedNodeId(newRoot.id);
    notify(`Created Root node "${val}"`, 'success');
    resetTraversal();
  };

  // 2. Add Left Child
  const handleAddLeftChild = () => {
    if (!customTree) {
      notify('The tree is currently empty. Please create a Root node first.');
      return;
    }
    if (!selectedNode) {
      notify('Please click a node on the tree to select where to attach the left child.');
      return;
    }
    if (selectedNode.left) {
      notify(`Node ${selectedNode.val} already has a left child (${selectedNode.left.val}).`);
      return;
    }
    const val = newChildValue.trim() || 'L';
    try {
      const updated = addLeftChild(customTree, selectedNode.id, val);
      setCustomTree(updated);
      notify(`Added Left child "${val}" to Node ${selectedNode.val}`, 'success');
      resetTraversal();
    } catch (err) {
      notify(err.message);
    }
  };

  // 3. Add Right Child
  const handleAddRightChild = () => {
    if (!customTree) {
      notify('The tree is currently empty. Please create a Root node first.');
      return;
    }
    if (!selectedNode) {
      notify('Please click a node on the tree to select where to attach the right child.');
      return;
    }
    if (selectedNode.right) {
      notify(`Node ${selectedNode.val} already has a right child (${selectedNode.right.val}).`);
      return;
    }
    const val = newChildValue.trim() || 'R';
    try {
      const updated = addRightChild(customTree, selectedNode.id, val);
      setCustomTree(updated);
      notify(`Added Right child "${val}" to Node ${selectedNode.val}`, 'success');
      resetTraversal();
    } catch (err) {
      notify(err.message);
    }
  };

  // 4. Delete Node
  const handleDeleteNode = () => {
    if (!customTree) {
      notify('The tree is already empty.');
      return;
    }
    if (!selectedNode) {
      notify('Click a node on the tree to select it for deletion.');
      return;
    }

    const valDeleted = selectedNode.val;
    const isRoot = customTree.id === selectedNode.id;
    const updated = deleteNodeById(customTree, selectedNode.id);
    setCustomTree(updated);
    setSelectedNodeId(updated ? updated.id : null);
    notify(isRoot ? 'Cleared tree (Root was deleted).' : `Deleted node "${valDeleted}" and its subtree.`, 'success');
    resetTraversal();
  };

  // 5. Reset
  const handleReset = () => {
    const tree = createStandardTree();
    setCustomTree(tree);
    setSelectedNodeId('A');
    setNodeValueInput('A');
    setNewChildValue('X');
    notify('Reset to default 5-node benchmark tree (A-B-C-D-E).', 'success');
    resetTraversal();
  };

  // Update selected node value
  const handleUpdateNodeValue = () => {
    if (!selectedNode) {
      notify('Select a node first to change its value.');
      return;
    }
    const val = nodeValueInput.trim();
    if (!val) {
      notify('Node value cannot be empty.');
      return;
    }
    const updated = updateNodeVal(customTree, selectedNode.id, val);
    setCustomTree(updated);
    notify(`Updated node label to "${val}".`, 'success');
    resetTraversal();
  };

  /* -------------------------------------------------------------
   * Traversal Playback
   * ------------------------------------------------------------- */
  const handleTraversalChange = (type) => {
    setSelectedTraversal(type);
    resetTraversal();
  };

  const handleStartTraversal = () => {
    if (!customTree) {
      notify('Cannot traverse an empty tree. Please add a root node first.');
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

  return (
    <section id="build-tree" className="py-20 border-t border-zinc-800/80 bg-dark-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
              Create and modify any binary tree. Add root and child nodes, rename values, and watch the authentic Inorder, Preorder, and Postorder algorithms run on your custom creation.
            </p>
          </div>

          {/* Quick Reset button */}
          <div className="flex items-center gap-2 self-start lg:self-auto font-mono text-xs">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition border border-zinc-700"
              title="Restore the default benchmark tree"
            >
              <RotateCcw size={13} />
              <span>Reset to Default</span>
            </button>
            <button
              onClick={() => {
                setCustomTree(null);
                setSelectedNodeId(null);
                notify('Tree cleared.', 'success');
                resetTraversal();
              }}
              className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 transition border border-red-800/40"
            >
              Clear Canvas
            </button>
          </div>
        </div>

        {/* Builder Container Card */}
        <div className="bg-dark-950/95 border border-zinc-800 rounded-2xl p-4 sm:p-7 shadow-2xl space-y-6">
          {/* Notification Alert Banner */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {feedback.type === 'success' ? (
                    <CheckCircle2 size={15} className="text-emerald-400" />
                  ) : (
                    <AlertCircle size={15} className="text-amber-400" />
                  )}
                  <span>{feedback.message}</span>
                </div>
                <button
                  onClick={() => setFeedback(null)}
                  className="text-zinc-500 hover:text-zinc-300 ml-4 text-xs"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ====================================================
              BUILDER CONTROLS TOOLBAR
              - Add Root
              - Add Left Child
              - Add Right Child
              - Delete Node
              - Reset
              - Node Value Input
             ==================================================== */}
          <div className="p-4 rounded-xl bg-dark-900 border border-zinc-800/90 space-y-4">
            {/* Top Toolbar Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Primary Node Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {!customTree ? (
                  <button
                    onClick={handleAddRoot}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono shadow-md shadow-emerald-500/20 transition"
                  >
                    <PlusCircle size={14} />
                    <span>Add Root</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleAddLeftChild}
                      disabled={!selectedNode || Boolean(selectedNode?.left)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 text-xs font-mono border border-zinc-700 transition"
                      title={selectedNode?.left ? 'Left child already exists' : 'Add Left Child to selected node'}
                    >
                      <PlusCircle size={13} className="text-sky-400" />
                      <span>Add Left Child</span>
                    </button>

                    <button
                      onClick={handleAddRightChild}
                      disabled={!selectedNode || Boolean(selectedNode?.right)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 text-xs font-mono border border-zinc-700 transition"
                      title={selectedNode?.right ? 'Right child already exists' : 'Add Right Child to selected node'}
                    >
                      <PlusCircle size={13} className="text-purple-400" />
                      <span>Add Right Child</span>
                    </button>

                    <button
                      onClick={handleDeleteNode}
                      disabled={!selectedNode}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 disabled:opacity-25 text-red-300 text-xs font-mono border border-red-800/40 transition"
                      title="Delete selected node and all its descendants"
                    >
                      <Trash2 size={13} />
                      <span>Delete Node</span>
                    </button>

                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-950 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-mono border border-zinc-800 transition"
                      title="Reset tree to default"
                    >
                      <RotateCcw size={13} />
                      <span>Reset</span>
                    </button>
                  </>
                )}
              </div>

              {/* Child Value Preset Input */}
              {customTree && (
                <div className="flex items-center gap-2 bg-dark-950 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs font-mono">
                  <span className="text-zinc-500">New Child Val:</span>
                  <input
                    type="text"
                    maxLength={4}
                    value={newChildValue}
                    onChange={(e) => setNewChildValue(e.target.value)}
                    className="w-12 bg-zinc-900 text-center font-bold text-sky-400 border border-zinc-750 rounded px-1.5 py-0.5 outline-none focus:border-sky-500"
                    placeholder="Val"
                  />
                </div>
              )}
            </div>

            {/* Bottom Toolbar Row: Selected Node & Rename Input */}
            {selectedNode && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-850 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Selected Node:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                    Node {selectedNode.val}
                  </span>
                  <span className="text-zinc-500 text-[11px]">
                    (Left: {selectedNode.left ? selectedNode.left.val : 'none'}, Right: {selectedNode.right ? selectedNode.right.val : 'none'})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Edit Value:</span>
                  <input
                    type="text"
                    maxLength={4}
                    value={nodeValueInput}
                    onChange={(e) => setNodeValueInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateNodeValue()}
                    className="w-16 bg-zinc-900 text-center font-bold text-white border border-zinc-750 rounded px-2 py-1 outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleUpdateNodeValue}
                    className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
                  >
                    Update
                  </button>
                </div>

                <div className="text-zinc-500 text-[11px]">
                  Total: <strong className="text-white">{nodeCount}</strong> nodes • Height: <strong className="text-white">{treeHeight}</strong>
                </div>
              </div>
            )}
          </div>

          {/* ====================================================
              DYNAMIC SVG TREE CANVAS (REUSABLE LAYOUT)
             ==================================================== */}
          <div className="bg-dark-950/90 border border-zinc-800/90 rounded-2xl p-4 relative min-h-[300px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pb-2 border-b border-zinc-850">
              <span>Interactive Dynamic Canvas (Click any node to select it)</span>
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
                onNodeClick={(node) => {
                  setSelectedNodeId(node.id);
                  setNodeValueInput(String(node.val));
                }}
              />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <TreePine size={24} />
                </div>
                <div className="text-zinc-400 font-mono text-sm">
                  The tree is currently empty.
                </div>
                <button
                  onClick={handleAddRoot}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
                >
                  + Add Root
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Dynamic Layout Engine</span>
              <span>Automatic Bounding Box & Symmetrical Centering</span>
            </div>
          </div>

          {/* ====================================================
              TRAVERSAL ENGINE CONTROLS:
              [ Inorder ] [ Preorder ] [ Postorder ]
              Uses EXACT SAME traversal algorithms implemented!
             ==================================================== */}
          <div className="p-5 rounded-2xl bg-dark-900/80 border border-zinc-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-zinc-800/80">
              {/* Traversal Selector: [ Inorder ] [ Preorder ] [ Postorder ] */}
              <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-zinc-800 font-mono text-xs">
                {['inorder', 'preorder', 'postorder'].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTraversalChange(t)}
                    className={`px-3.5 py-1.5 rounded-lg capitalize transition ${
                      selectedTraversal === t
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Traversal Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartTraversal}
                  disabled={!customTree || isPlaying}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-semibold text-xs font-mono transition shadow-md shadow-emerald-500/20"
                >
                  <Play size={13} fill="currentColor" />
                  <span>Traverse</span>
                </button>

                <button
                  onClick={() => setIsPlaying(false)}
                  disabled={!isPlaying}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 text-xs font-mono border border-zinc-700 transition"
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
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-dark-950 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 text-xs font-mono border border-zinc-800 transition"
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

            {/* Live Traversal Output Queue */}
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
