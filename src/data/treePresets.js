import { TreeNode, createSeminarTree } from '../algorithms/traversals';

/**
 * Binary Search Tree (Numeric):
 *          40
 *        /    \
 *       20    60
 *      /  \   / \
 *     10  30 50 70
 */
export function createBstTree() {
  const n10 = new TreeNode(10, null, null, '10');
  const n30 = new TreeNode(30, null, null, '30');
  const n50 = new TreeNode(50, null, null, '50');
  const n70 = new TreeNode(70, null, null, '70');

  const n20 = new TreeNode(20, n10, n30, '20');
  const n60 = new TreeNode(60, n50, n70, '60');

  const root = new TreeNode(40, n20, n60, '40');
  return root;
}

/**
 * Expression Tree:
 *          +
 *        /   \
 *       ×     5
 *      / \
 *     2   3
 */
export function createExpressionTree() {
  const n2 = new TreeNode('2', null, null, '2');
  const n3 = new TreeNode('3', null, null, '3');
  const mul = new TreeNode('×', n2, n3, 'mul');
  const n5 = new TreeNode('5', null, null, '5');
  const plus = new TreeNode('+', mul, n5, 'plus');
  return plus;
}

export const TREE_PRESETS = [
  {
    id: 'default',
    name: 'Seminar Tree (A-E)',
    description: 'The canonical 5-node tree (A, B, C, D, E) featured in the seminar specification.',
    factory: createSeminarTree,
    nodeCount: 5,
    height: 3,
  },
  {
    id: 'bst',
    name: 'Binary Search Tree (BST)',
    description: 'Notice how Inorder traversal outputs sorted numbers [10, 20, 30, 40, 50, 60, 70]!',
    factory: createBstTree,
    nodeCount: 7,
    height: 3,
  },
  {
    id: 'expression',
    name: 'Expression Tree ((2 × 3) + 5)',
    description: 'Notice how Postorder gives Postfix and Preorder gives Prefix notation!',
    factory: createExpressionTree,
    nodeCount: 5,
    height: 3,
  }
];
