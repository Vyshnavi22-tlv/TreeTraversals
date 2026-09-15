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
 * Returns array of values: ['D', 'B', 'E', 'A', 'C']
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
 * Returns array of values: ['A', 'B', 'D', 'E', 'C']
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
 * Returns array of values: ['D', 'E', 'B', 'C', 'A']
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
 * Dynamically assigns (x, y) coordinates for any binary tree
 * without hardcoded coordinates.
 */
export function computeTreeLayout(root, options = {}) {
  if (!root) return { nodes: [], edges: [], width: 500, height: 320 };

  const {
    viewWidth = 560,
    viewHeight = 330,
    topMargin = 55,
    bottomMargin = 45,
    horizontalPadding = 60
  } = options;

  // 1. Determine max depth
  let maxDepth = 0;
  function getDepth(node, currentDepth) {
    if (!node) return;
    node.depth = currentDepth;
    if (currentDepth > maxDepth) maxDepth = currentDepth;
    getDepth(node.left, currentDepth + 1);
    getDepth(node.right, currentDepth + 1);
  }
  getDepth(root, 0);

  // 2. Compute in-order ranks for optimal horizontal spacing
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

  // 3. Position nodes and construct edge list
  const nodes = [];
  const edges = [];

  function layoutSubtree(node) {
    if (!node) return;

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

  // 4. Center parent nodes above their children
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
 * Exact pseudocode specifications required for the seminar debugger:
 *
 * INORDER:
 * 1: INORDER(node):
 * 2:     if node is null:
 * 3:         return
 * 4:     INORDER(node.left)
 * 5:     VISIT(node)
 * 6:     INORDER(node.right)
 *
 * PREORDER:
 * 1: PREORDER(node):
 * 2:     if node is null:
 * 3:         return
 * 4:     VISIT(node)
 * 5:     PREORDER(node.left)
 * 6:     PREORDER(node.right)
 *
 * POSTORDER:
 * 1: POSTORDER(node):
 * 2:     if node is null:
 * 3:         return
 * 4:     POSTORDER(node.left)
 * 5:     POSTORDER(node.right)
 * 6:     VISIT(node)
 */
export const PSEUDOCODE_TEMPLATES = {
  inorder: [
    { line: 1, text: 'INORDER(node):' },
    { line: 2, text: '    if node is null:' },
    { line: 3, text: '        return' },
    { line: 4, text: '    INORDER(node.left)' },
    { line: 5, text: '    VISIT(node)' },
    { line: 6, text: '    INORDER(node.right)' }
  ],
  preorder: [
    { line: 1, text: 'PREORDER(node):' },
    { line: 2, text: '    if node is null:' },
    { line: 3, text: '        return' },
    { line: 4, text: '    VISIT(node)' },
    { line: 5, text: '    PREORDER(node.left)' },
    { line: 6, text: '    PREORDER(node.right)' }
  ],
  postorder: [
    { line: 1, text: 'POSTORDER(node):' },
    { line: 2, text: '    if node is null:' },
    { line: 3, text: '        return' },
    { line: 4, text: '    POSTORDER(node.left)' },
    { line: 5, text: '    POSTORDER(node.right)' },
    { line: 6, text: '    VISIT(node)' }
  ]
};

/**
 * Step-by-step state generator synchronized with the real traversal engine.
 * Captures line numbers (1..6) mapping directly to the pseudocode above.
 */
export function generateTraversalSteps(root, traversalType = 'inorder') {
  const steps = [];
  if (!root) return steps;

  const visitedList = [];
  const callStack = [];

  // Step 0: Initiation
  steps.push({
    currentNodeId: root.id,
    activeEdge: null,
    actionType: 'start',
    actionMessage: `Starting ${traversalType.toUpperCase()} Traversal`,
    detailedMessage: `Invoking ${traversalType.toUpperCase()}(${root.val}) at the root of the tree.`,
    visitedNodes: [],
    callStack: [`${traversalType.toUpperCase()}(${root.val})`],
    codeLine: 1
  });

  /* -------------------------------------------------------------
   * INORDER (Left -> Root -> Right)
   * ------------------------------------------------------------- */
  function runInorder(node, parent = null) {
    if (!node) return;

    const frame = `INORDER(${node.val})`;
    callStack.push(frame);

    // Line 2: if node is null:
    steps.push({
      currentNodeId: node.id,
      activeEdge: parent ? { from: parent.id, to: node.id } : null,
      actionType: 'inspecting',
      actionMessage: `Inspecting node ${node.val}`,
      detailedMessage: `Executing line 2: node is not null (${node.val}). Proceeding to left child.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 2
    });

    // Line 4: INORDER(node.left)
    if (node.left) {
      steps.push({
        currentNodeId: node.id,
        activeEdge: { from: node.id, to: node.left.id },
        actionType: 'visiting_left',
        actionMessage: 'Visiting left subtree',
        detailedMessage: `Executing line 4: INORDER(${node.left.val}) recursive call.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 4
      });
      runInorder(node.left, node);
    } else {
      steps.push({
        currentNodeId: node.id,
        activeEdge: null,
        actionType: 'visiting_left',
        actionMessage: 'Visiting left subtree (null)',
        detailedMessage: `Executing line 2-3: left child of ${node.val} is null → return.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack, `INORDER(null)`],
        codeLine: 3
      });
    }

    // Line 5: VISIT(node)
    visitedList.push(node.val);
    steps.push({
      currentNodeId: node.id,
      activeEdge: null,
      actionType: 'processing',
      actionMessage: 'Processing node',
      detailedMessage: `Executing line 5: VISIT(${node.val}) — recording ${node.val} to traversal output.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 5
    });

    // Line 6: INORDER(node.right)
    if (node.right) {
      steps.push({
        currentNodeId: node.id,
        activeEdge: { from: node.id, to: node.right.id },
        actionType: 'visiting_right',
        actionMessage: 'Moving to right subtree',
        detailedMessage: `Executing line 6: INORDER(${node.right.val}) recursive call.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 6
      });
      runInorder(node.right, node);
    } else {
      steps.push({
        currentNodeId: node.id,
        activeEdge: null,
        actionType: 'visiting_right',
        actionMessage: 'Moving to right subtree (null)',
        detailedMessage: `Executing line 2-3: right child of ${node.val} is null → return.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack, `INORDER(null)`],
        codeLine: 3
      });
    }

    // Return to caller
    steps.push({
      currentNodeId: node.id,
      activeEdge: parent ? { from: node.id, to: parent.id } : null,
      actionType: 'backtracking',
      actionMessage: parent ? `Backtracking to ${parent.val}` : 'Completed root call',
      detailedMessage: `Finished both subtrees for node ${node.val}. Popping ${frame} from stack.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 3
    });

    callStack.pop();
  }

  /* -------------------------------------------------------------
   * PREORDER (Root -> Left -> Right)
   * ------------------------------------------------------------- */
  function runPreorder(node, parent = null) {
    if (!node) return;

    const frame = `PREORDER(${node.val})`;
    callStack.push(frame);

    // Line 2: if node is null:
    steps.push({
      currentNodeId: node.id,
      activeEdge: parent ? { from: parent.id, to: node.id } : null,
      actionType: 'inspecting',
      actionMessage: `Inspecting node ${node.val}`,
      detailedMessage: `Executing line 2: node is not null (${node.val}).`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 2
    });

    // Line 4: VISIT(node) immediately
    visitedList.push(node.val);
    steps.push({
      currentNodeId: node.id,
      activeEdge: null,
      actionType: 'processing',
      actionMessage: 'Processing node',
      detailedMessage: `Executing line 4: VISIT(${node.val}) — root visited first in Preorder!`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 4
    });

    // Line 5: PREORDER(node.left)
    if (node.left) {
      steps.push({
        currentNodeId: node.id,
        activeEdge: { from: node.id, to: node.left.id },
        actionType: 'visiting_left',
        actionMessage: 'Visiting left subtree',
        detailedMessage: `Executing line 5: PREORDER(${node.left.val}) recursive call.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 5
      });
      runPreorder(node.left, node);
    } else {
      steps.push({
        currentNodeId: node.id,
        activeEdge: null,
        actionType: 'visiting_left',
        actionMessage: 'Visiting left subtree (null)',
        detailedMessage: `Left child of ${node.val} is null → return.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack, `PREORDER(null)`],
        codeLine: 3
      });
    }

    // Line 6: PREORDER(node.right)
    if (node.right) {
      steps.push({
        currentNodeId: node.id,
        activeEdge: { from: node.id, to: node.right.id },
        actionType: 'visiting_right',
        actionMessage: 'Moving to right subtree',
        detailedMessage: `Executing line 6: PREORDER(${node.right.val}) recursive call.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 6
      });
      runPreorder(node.right, node);
    } else {
      steps.push({
        currentNodeId: node.id,
        activeEdge: null,
        actionType: 'visiting_right',
        actionMessage: 'Moving to right subtree (null)',
        detailedMessage: `Right child of ${node.val} is null → return.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack, `PREORDER(null)`],
        codeLine: 3
      });
    }

    // Return to caller
    steps.push({
      currentNodeId: node.id,
      activeEdge: parent ? { from: node.id, to: parent.id } : null,
      actionType: 'backtracking',
      actionMessage: parent ? `Backtracking to ${parent.val}` : 'Completed root call',
      detailedMessage: `Preorder for subtree at ${node.val} completed. Popping stack frame.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 3
    });

    callStack.pop();
  }

  /* -------------------------------------------------------------
   * POSTORDER (Left -> Right -> Root)
   * ------------------------------------------------------------- */
  function runPostorder(node, parent = null) {
    if (!node) return;

    const frame = `POSTORDER(${node.val})`;
    callStack.push(frame);

    // Line 2: if node is null:
    steps.push({
      currentNodeId: node.id,
      activeEdge: parent ? { from: parent.id, to: node.id } : null,
      actionType: 'inspecting',
      actionMessage: `Entering node ${node.val}`,
      detailedMessage: `Executing line 2: node is not null. Children must be processed before visiting ${node.val}.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 2
    });

    // Line 4: POSTORDER(node.left)
    if (node.left) {
      steps.push({
        currentNodeId: node.id,
        activeEdge: { from: node.id, to: node.left.id },
        actionType: 'visiting_left',
        actionMessage: 'Visiting left subtree',
        detailedMessage: `Executing line 4: POSTORDER(${node.left.val}) recursive call.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 4
      });
      runPostorder(node.left, node);
    } else {
      steps.push({
        currentNodeId: node.id,
        activeEdge: null,
        actionType: 'visiting_left',
        actionMessage: 'Visiting left subtree (null)',
        detailedMessage: `Left child of ${node.val} is null → return.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack, `POSTORDER(null)`],
        codeLine: 3
      });
    }

    // Line 5: POSTORDER(node.right)
    if (node.right) {
      steps.push({
        currentNodeId: node.id,
        activeEdge: { from: node.id, to: node.right.id },
        actionType: 'visiting_right',
        actionMessage: 'Moving to right subtree',
        detailedMessage: `Executing line 5: POSTORDER(${node.right.val}) recursive call.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack],
        codeLine: 5
      });
      runPostorder(node.right, node);
    } else {
      steps.push({
        currentNodeId: node.id,
        activeEdge: null,
        actionType: 'visiting_right',
        actionMessage: 'Moving to right subtree (null)',
        detailedMessage: `Right child of ${node.val} is null → return.`,
        visitedNodes: [...visitedList],
        callStack: [...callStack, `POSTORDER(null)`],
        codeLine: 3
      });
    }

    // Line 6: VISIT(node) after both children
    visitedList.push(node.val);
    steps.push({
      currentNodeId: node.id,
      activeEdge: null,
      actionType: 'processing',
      actionMessage: 'Processing node',
      detailedMessage: `Executing line 6: VISIT(${node.val}) — both subtrees complete, root node visited last!`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 6
    });

    // Return to caller
    steps.push({
      currentNodeId: node.id,
      activeEdge: parent ? { from: node.id, to: parent.id } : null,
      actionType: 'backtracking',
      actionMessage: parent ? `Backtracking to ${parent.val}` : 'Completed root call',
      detailedMessage: `Postorder finished for subtree at ${node.val}. Popping ${frame} from stack.`,
      visitedNodes: [...visitedList],
      callStack: [...callStack],
      codeLine: 3
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
