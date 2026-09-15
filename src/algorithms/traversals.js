/**
 * Binary Tree Traversal Algorithms & Step Generators
 */

export class TreeNode {
  constructor(id, val, left = null, right = null, x = 0, y = 0) {
    this.id = id;
    this.val = val;
    this.left = left;
    this.right = right;
    this.x = x;
    this.y = y;
  }
}

/**
 * Returns clean node lists and edge lists from a root node
 */
export function getTreeElements(root) {
  const nodes = [];
  const edges = [];

  function dfs(node) {
    if (!node) return;
    nodes.push(node);
    if (node.left) {
      edges.push({ from: node, to: node.left, id: `${node.id}-${node.left.id}` });
      dfs(node.left);
    }
    if (node.right) {
      edges.push({ from: node, to: node.right, id: `${node.id}-${node.right.id}` });
      dfs(node.right);
    }
  }

  dfs(root);
  return { nodes, edges };
}

/**
 * Pre-generate full traversal values
 */
export function getTraversalOutput(root, type) {
  const result = [];
  if (!root) return result;

  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    result.push(node.val);
    inorder(node.right);
  }

  function preorder(node) {
    if (!node) return;
    result.push(node.val);
    preorder(node.left);
    preorder(node.right);
  }

  function postorder(node) {
    if (!node) return;
    postorder(node.left);
    postorder(node.right);
    result.push(node.val);
  }

  if (type === 'inorder') inorder(root);
  else if (type === 'preorder') preorder(root);
  else if (type === 'postorder') postorder(root);

  return result;
}

/**
 * Step generator for visualizer with detailed call stack and line tracing
 */
export function generateTraversalSteps(root, traversalType) {
  const steps = [];
  if (!root) return steps;

  const visitedList = [];
  const currentStack = [];

  // Initial step: beginning
  steps.push({
    activeNodeId: null,
    visitedNodes: [],
    callStack: [`traverse(${root.val})`],
    codeLine: 1,
    action: 'start',
    message: `Starting ${traversalType.toUpperCase()} traversal at root node ${root.val}.`
  });

  function traverseInorder(node) {
    if (!node) {
      steps.push({
        activeNodeId: null,
        visitedNodes: [...visitedList],
        callStack: [...currentStack, 'null'],
        codeLine: 2,
        action: 'null_check',
        message: 'Base case reached: node is null. Backtracking.'
      });
      return;
    }

    const frame = `inorder(${node.val})`;
    currentStack.push(frame);

    // Line 1-2: check null
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 2,
      action: 'inspect',
      message: `Inspecting node ${node.val}. It is not null, so proceed.`
    });

    // Line 3: traverse left
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 3,
      action: 'recurse_left',
      message: `Traversing Left subtree of ${node.val}...`
    });
    traverseInorder(node.left);

    // Line 4: visit current node
    visitedList.push(node.val);
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 4,
      action: 'visit',
      message: `Visiting and recording node ${node.val} (Left is complete).`
    });

    // Line 5: traverse right
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 5,
      action: 'recurse_right',
      message: `Traversing Right subtree of ${node.val}...`
    });
    traverseInorder(node.right);

    // End of function for this node
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 6,
      action: 'return',
      message: `Both subtrees for node ${node.val} processed. Returning call frame.`
    });
    currentStack.pop();
  }

  function traversePreorder(node) {
    if (!node) {
      steps.push({
        activeNodeId: null,
        visitedNodes: [...visitedList],
        callStack: [...currentStack, 'null'],
        codeLine: 2,
        action: 'null_check',
        message: 'Base case reached: node is null. Backtracking.'
      });
      return;
    }

    const frame = `preorder(${node.val})`;
    currentStack.push(frame);

    // Line 2: inspect
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 2,
      action: 'inspect',
      message: `Inspecting node ${node.val}. Base check passed.`
    });

    // Line 3: visit root immediately
    visitedList.push(node.val);
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 3,
      action: 'visit',
      message: `Visiting root node ${node.val} before visiting any children.`
    });

    // Line 4: recurse left
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 4,
      action: 'recurse_left',
      message: `Moving down to Left child of ${node.val}...`
    });
    traversePreorder(node.left);

    // Line 5: recurse right
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 5,
      action: 'recurse_right',
      message: `Moving down to Right child of ${node.val}...`
    });
    traversePreorder(node.right);

    // End of function
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 6,
      action: 'return',
      message: `Preorder for subtree at ${node.val} is complete. Popping stack.`
    });
    currentStack.pop();
  }

  function traversePostorder(node) {
    if (!node) {
      steps.push({
        activeNodeId: null,
        visitedNodes: [...visitedList],
        callStack: [...currentStack, 'null'],
        codeLine: 2,
        action: 'null_check',
        message: 'Base case reached: node is null. Backtracking.'
      });
      return;
    }

    const frame = `postorder(${node.val})`;
    currentStack.push(frame);

    // Line 2: inspect
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 2,
      action: 'inspect',
      message: `Entering node ${node.val}. Must explore children before visiting.`
    });

    // Line 3: traverse left
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 3,
      action: 'recurse_left',
      message: `Recursing Left on child of ${node.val}...`
    });
    traversePostorder(node.left);

    // Line 4: traverse right
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 4,
      action: 'recurse_right',
      message: `Recursing Right on child of ${node.val}...`
    });
    traversePostorder(node.right);

    // Line 5: visit root after both children
    visitedList.push(node.val);
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 5,
      action: 'visit',
      message: `Both subtrees evaluated! Visiting node ${node.val} now.`
    });

    // Return
    steps.push({
      activeNodeId: node.id,
      visitedNodes: [...visitedList],
      callStack: [...currentStack],
      codeLine: 6,
      action: 'return',
      message: `Postorder finished for subtree at ${node.val}. Popping stack.`
    });
    currentStack.pop();
  }

  if (traversalType === 'inorder') {
    traverseInorder(root);
  } else if (traversalType === 'preorder') {
    traversePreorder(root);
  } else if (traversalType === 'postorder') {
    traversePostorder(root);
  }

  // Final step
  steps.push({
    activeNodeId: null,
    visitedNodes: [...visitedList],
    callStack: [],
    codeLine: null,
    action: 'complete',
    message: `Traversal finished! All ${visitedList.length} nodes successfully visited.`
  });

  return steps;
}
