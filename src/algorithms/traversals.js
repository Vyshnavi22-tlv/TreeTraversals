/**
 * Tree Traversals Algorithmic Engine & Step Generator
 * Implements Inorder, Preorder, and Postorder traversals with
 * authentic state generation for step-by-step educational visualization.
 */

export class TreeNode {
  constructor(val, left = null, right = null, id = null) {
    this.id = id || String(val);
    this.val = val;
    this.left = left;
    this.right = right;
    this.x = 0;
    this.y = 0;
    this.depth = 0;
  }
}

/**
 * Standard Inorder Traversal (Left → Root → Right)
 * Returns array of values
 */
export function inorder(root) {
  const result = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

/**
 * Standard Preorder Traversal (Root → Left → Right)
 * Returns array of values
 */
export function preorder(root) {
  const result = [];
  function traverse(node) {
    if (!node) return;
    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

/**
 * Standard Postorder Traversal (Left → Right → Root)
 * Returns array of values
 */
export function postorder(root) {
  const result = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    result.push(node.val);
  }
  traverse(root);
  return result;
}

/**
 * Canonical seminar tree factory:
 *         A
 *        / \
 *       B   C
 *      / \
 *     D   E
 */
export function createSeminarTree() {
  const d = new TreeNode('D', null, null, 'D');
  const e = new TreeNode('E', null, null, 'E');
  const b = new TreeNode('B', d, e, 'B');
  const c = new TreeNode('C', null, null, 'C');
  const a = new TreeNode('A', b, c, 'A');
  return a;
}

/**
 * Reusable Tree Layout Engine
 * Calculates (x, y) coordinates dynamically for ANY binary tree
 * without hardcoded coordinates.
 */
export function computeTreeLayout(root, options = {}) {
  if (!root) return { nodes: [], edges: [], width: 500, height: 320 };

  const {
    viewWidth = 560,
    viewHeight = 340,
    topMargin = 50,
    bottomMargin = 50,
    horizontalPadding = 60
  } = options;

  // 1. Determine max depth of tree
  let maxDepth = 0;
  function getDepth(node, currentDepth) {
    if (!node) return;
    node.depth = currentDepth;
    if (currentDepth > maxDepth) maxDepth = currentDepth;
    getDepth(node.left, currentDepth + 1);
    getDepth(node.right, currentDepth + 1);
  }
  getDepth(root, 0);

  // 2. Perform inorder traversal to determine horizontal rank for symmetric layout
  let currentOrder = 0;
  const inorderRanks = new Map();
  function assignInorderRank(node) {
    if (!node) return;
    assignInorderRank(node.left);
    inorderRanks.set(node.id, currentOrder++);
    assignInorderRank(node.right);
  }
  assignInorderRank(root);

  const totalNodes = currentOrder;
  const usableWidth = viewWidth - (horizontalPadding * 2);
  const xStep = totalNodes > 1 ? usableWidth / (totalNodes - 1) : usableWidth / 2;

  const usableHeight = viewHeight - topMargin - bottomMargin;
  const yStep = maxDepth > 0 ? usableHeight / maxDepth : 0;

  // 3. Position nodes and collect edges
  const nodes = [];
  const edges = [];

  function layoutSubtree(node) {
    if (!node) return;

    // Initial x from inorder rank
    const rank = inorderRanks.get(node.id);
    node.x = Math.round(horizontalPadding + (rank * xStep));
    node.y = Math.round(topMargin + (node.depth * yStep));

    nodes.push(node);

    if (node.left) {
      edges.push({
        id: `${node.id}-${node.left.id}`,
        fromId: node.id,
        toId: node.left.id,
        from: node,
        to: node.left
      });
      layoutSubtree(node.left);
    }

    if (node.right) {
      edges.push({
        id: `${node.id}-${node.right.id}`,
        fromId: node.id,
        toId: node.right.id,
        from: node,
        to: node.right
      });
      layoutSubtree(node.right);
    }
  }

  layoutSubtree(root);

  // 4. Post-pass: adjust parents to be centered directly between their children if both exist
  function centerParents(node) {
    if (!node) return;
    if (node.left) centerParents(node.left);
    if (node.right) centerParents(node.right);

    if (node.left && node.right) {
      node.x = Math.round((node.left.x + node.right.x) / 2);
    }
  }
  centerParents(root);

  return { nodes, edges, width: viewWidth, height: viewHeight };
}

/**
 * Step-by-Step Traversal State Generator
 * Captures live state transitions of the authentic recursive algorithm.
 *
 * Each step captures:
 * - currentNodeId: active node
 * - activeEdge: { from: id, to: id }
 * - actionType: 'visiting_left' | 'processing' | 'visiting_right' | 'backtracking' | 'complete'
 * - actionMessage: e.g. "Visiting left subtree", "Processing node", "Moving to right subtree"
 * - detailedMessage: contextual information about the step
 * - visitedNodes: array of node values currently emitted/processed
 * - callStack: array of active stack frames
 * - codeLine: executing line of code
 */
export function generateTraversalSteps(root, traversalType = 'inorder') {
  const steps = [];
  if (!root) return steps;

  const visitedList = [];
  const callStack = [];

  // Step 0: Algorithm Initiation
  steps.push({
    currentNodeId: root.id,
    activeEdge: null,
    actionType: 'start',
    actionMessage: `Starting ${traversalType.toUpperCase()} Traversal`,
    detailedMessage: `Call frame ${traversalType}(${root.val}) invoked on root node.`,
    visitedNodes: [],
    callStack: [`${traversalType}(${root.val})`],
    codeLine: 1
  });

  /* -------------------------------------------------------------
   * INORDER: Left -> Root -> Right
   * ------------------------------------------------------------- */
  function runInorder(node, parent = null) {
    if (!node) return;

    const frame = `inorder(${node.val})`;
    callStack.push(frame);

    // 1. Enter node
    steps.push({
      currentNodeId: node.id,
      activeEdge: parent ? { from: parent.id, to: node.id } : null,
      actionType: 'visiting',
      actionMessage: `Inspecting node ${node.val}`,
      detailedMessage: `Checking if node ${node.val} is null (it is not). Preparing to traverse left.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 2
    });

    // 2. Visit left subtree
    if (node.left) {
      steps.push({
        currentNodeId: node.id,
        activeEdge: { from: node.id, to: node.left.id },
        actionType: 'visiting_left',
        actionMessage: 'Visiting left subtree',
        detailedMessage: `Recursing left from node ${node.val} to ${node.left.val}.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 3
      });
      runInorder(node.left, node);
    } else {
      steps.push({
        currentNodeId: node.id,
        activeEdge: null,
        actionType: 'visiting_left',
        actionMessage: 'Visiting left subtree (empty)',
        detailedMessage: `Node ${node.val} has no left child (null base case reached).`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 3
      });
    }

    // 3. Process current node
    visitedList.push(node.val);
    steps.push({
      currentNodeId: node.id,
      activeEdge: null,
      actionType: 'processing',
      actionMessage: 'Processing node',
      detailedMessage: `Left subtree is resolved. Processing node ${node.val} and appending to output stream.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 4
    });

    // 4. Visit right subtree
    if (node.right) {
      steps.push({
        currentNodeId: node.id,
        activeEdge: { from: node.id, to: node.right.id },
        actionType: 'visiting_right',
        actionMessage: 'Moving to right subtree',
        detailedMessage: `Node ${node.val} processed. Now recursing into right child ${node.right.val}.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 5
      });
      runInorder(node.right, node);
    } else {
      steps.push({
        currentNodeId: node.id,
        activeEdge: null,
        actionType: 'visiting_right',
        actionMessage: 'Moving to right subtree (empty)',
        detailedMessage: `Node ${node.val} has no right child (null base case reached).`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 5
      });
    }

    // 5. Backtrack / Return
    steps.push({
      currentNodeId: node.id,
      activeEdge: parent ? { from: node.id, to: parent.id } : null,
      actionType: 'backtracking',
      actionMessage: parent ? `Backtracking to ${parent.val}` : 'Completed root execution',
      detailedMessage: `Finished subtree rooted at ${node.val}. Popping call frame from stack.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 6
    });

    callStack.pop();
  }

  /* -------------------------------------------------------------
   * PREORDER: Root -> Left -> Right
   * ------------------------------------------------------------- */
  function runPreorder(node, parent = null) {
    if (!node) return;

    const frame = `preorder(${node.val})`;
    callStack.push(frame);

    // 1. Process root immediately upon entering
    visitedList.push(node.val);
    steps.push({
      currentNodeId: node.id,
      activeEdge: parent ? { from: parent.id, to: node.id } : null,
      actionType: 'processing',
      actionMessage: 'Processing node',
      detailedMessage: `Root-first visit: processing node ${node.val} before inspecting children.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 3
    });

    // 2. Visit left subtree
    if (node.left) {
      steps.push({
        currentNodeId: node.id,
        activeEdge: { from: node.id, to: node.left.id },
        actionType: 'visiting_left',
        actionMessage: 'Visiting left subtree',
        detailedMessage: `Moving from node ${node.val} down to left child ${node.left.val}.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 4
      });
      runPreorder(node.left, node);
    } else {
      steps.push({
        currentNodeId: node.id,
        activeEdge: null,
        actionType: 'visiting_left',
        actionMessage: 'Visiting left subtree (empty)',
        detailedMessage: `Left child of ${node.val} is null.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 4
      });
    }

    // 3. Visit right subtree
    if (node.right) {
      steps.push({
        currentNodeId: node.id,
        activeEdge: { from: node.id, to: node.right.id },
        actionType: 'visiting_right',
        actionMessage: 'Moving to right subtree',
        detailedMessage: `Left branch finished. Moving to right child ${node.right.val}.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 5
      });
      runPreorder(node.right, node);
    } else {
      steps.push({
        currentNodeId: node.id,
        activeEdge: null,
        actionType: 'visiting_right',
        actionMessage: 'Moving to right subtree (empty)',
        detailedMessage: `Right child of ${node.val} is null.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 5
      });
    }

    // 4. Return
    steps.push({
      currentNodeId: node.id,
      activeEdge: parent ? { from: node.id, to: parent.id } : null,
      actionType: 'backtracking',
      actionMessage: parent ? `Backtracking to ${parent.val}` : 'Completed root execution',
      detailedMessage: `Completed preorder traversal for subtree rooted at ${node.val}.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 6
    });

    callStack.pop();
  }

  /* -------------------------------------------------------------
   * POSTORDER: Left -> Right -> Root
   * ------------------------------------------------------------- */
  function runPostorder(node, parent = null) {
    if (!node) return;

    const frame = `postorder(${node.val})`;
    callStack.push(frame);

    // 1. Enter node
    steps.push({
      currentNodeId: node.id,
      activeEdge: parent ? { from: parent.id, to: node.id } : null,
      actionType: 'visiting',
      actionMessage: `Entering node ${node.val}`,
      detailedMessage: `Postorder must resolve both children before processing ${node.val}.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 2
    });

    // 2. Visit left subtree
    if (node.left) {
      steps.push({
        currentNodeId: node.id,
        activeEdge: { from: node.id, to: node.left.id },
        actionType: 'visiting_left',
        actionMessage: 'Visiting left subtree',
        detailedMessage: `Descending from ${node.val} to left child ${node.left.val}.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 3
      });
      runPostorder(node.left, node);
    } else {
      steps.push({
        currentNodeId: node.id,
        activeEdge: null,
        actionType: 'visiting_left',
        actionMessage: 'Visiting left subtree (empty)',
        detailedMessage: `Left child of ${node.val} is null.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 3
      });
    }

    // 3. Visit right subtree
    if (node.right) {
      steps.push({
        currentNodeId: node.id,
        activeEdge: { from: node.id, to: node.right.id },
        actionType: 'visiting_right',
        actionMessage: 'Moving to right subtree',
        detailedMessage: `Descending from ${node.val} to right child ${node.right.val}.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 4
      });
      runPostorder(node.right, node);
    } else {
      steps.push({
        currentNodeId: node.id,
        activeEdge: null,
        actionType: 'visiting_right',
        actionMessage: 'Moving to right subtree (empty)',
        detailedMessage: `Right child of ${node.val} is null.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 4
      });
    }

    // 4. Process node after both children
    visitedList.push(node.val);
    steps.push({
      currentNodeId: node.id,
      activeEdge: null,
      actionType: 'processing',
      actionMessage: 'Processing node',
      detailedMessage: `Both left and right subtrees resolved! Processing node ${node.val}.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 5
    });

    // 5. Backtrack
    steps.push({
      currentNodeId: node.id,
      activeEdge: parent ? { from: node.id, to: parent.id } : null,
      actionType: 'backtracking',
      actionMessage: parent ? `Backtracking to ${parent.val}` : 'Completed root execution',
      detailedMessage: `Subtree at ${node.val} fully postorder evaluated. Popping stack.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 6
    });

    callStack.pop();
  }

  if (traversalType === 'inorder') {
    runInorder(root);
  } else if (traversalType === 'preorder') {
    runPreorder(root);
  } else if (traversalType === 'postorder') {
    runPostorder(root);
  }

  // Final Step: Complete
  steps.push({
    currentNodeId: null,
    activeEdge: null,
    actionType: 'complete',
    actionMessage: 'Traversal complete',
    detailedMessage: `All ${visitedList.length} nodes visited in ${traversalType.toUpperCase()} order: [${visitedList.join(' → ')}]`,
    visitedNodes: [...visitedList],
    callStack: [],
    codeLine: null
  });

  return steps;
}
