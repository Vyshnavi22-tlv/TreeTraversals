import { TreeNode } from '../algorithms/traversals';

/**
 * Default Seminar Tree:
 *         A
 *        / \
 *       B   C
 *      / \
 *     D   E
 */
export function createDefaultTree() {
  const d = new TreeNode('D', 'D', null, null, 140, 240);
  const e = new TreeNode('E', 'E', null, null, 260, 240);
  const b = new TreeNode('B', 'B', d, e, 200, 150);
  const c = new TreeNode('C', 'C', null, null, 400, 150);
  const a = new TreeNode('A', 'A', b, c, 300, 60);
  return a;
}

/**
 * Binary Search Tree (Numeric):
 * Shows how Inorder traversal yields elements in sorted ascending order!
 *          40
 *        /    \
 *       20    60
 *      /  \   / \
 *     10  30 50 70
 */
export function createBstTree() {
  const n10 = new TreeNode('10', '10', null, null, 100, 240);
  const n30 = new TreeNode('30', '30', null, null, 200, 240);
  const n50 = new TreeNode('50', '50', null, null, 400, 240);
  const n70 = new TreeNode('70', '70', null, null, 500, 240);

  const n20 = new TreeNode('20', '20', n10, n30, 150, 150);
  const n60 = new TreeNode('60', '60', n50, n70, 450, 150);

  const root = new TreeNode('40', '40', n20, n60, 300, 60);
  return root;
}

/**
 * Expression Tree:
 * Demonstrates Prefix, Infix, Postfix evaluations:
 *          +
 *        /   \
 *       *     5
 *      / \
 *     2   3
 */
export function createExpressionTree() {
  const n2 = new TreeNode('2', '2', null, null, 140, 240);
  const n3 = new TreeNode('3', '3', null, null, 260, 240);
  const mul = new TreeNode('*', '×', n2, n3, 200, 150);
  const n5 = new TreeNode('5', '5', null, null, 400, 150);
  const plus = new TreeNode('+', '+', mul, n5, 300, 60);
  return plus;
}

export const TREE_PRESETS = [
  {
    id: 'default',
    name: 'Seminar Tree (A-E)',
    description: 'The canonical 5-node tree featured in the seminar specification.',
    factory: createDefaultTree,
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
    description: 'Notice how Postorder gives Postfix (Reverse Polish) and Preorder gives Prefix!',
    factory: createExpressionTree,
    nodeCount: 5,
    height: 3,
  }
];
