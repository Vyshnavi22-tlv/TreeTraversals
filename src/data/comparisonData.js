export const COMPARISON_TABLE = [
  {
    feature: 'Visit Order Pattern',
    inorder: 'Left → Node → Right',
    preorder: 'Node → Left → Right',
    postorder: 'Left → Right → Node'
  },
  {
    feature: 'Output on Seminar Tree (A-E)',
    inorder: 'D → B → E → A → C',
    preorder: 'A → B → D → E → C',
    postorder: 'D → E → B → C → A'
  },
  {
    feature: 'Root Node Position in Output',
    inorder: 'In the middle (splits L and R)',
    preorder: 'First element',
    postorder: 'Last element'
  },
  {
    feature: 'BST Special Property',
    inorder: 'Produces sorted ascending keys',
    preorder: 'Can reconstruct BST without extra info',
    postorder: 'Bottom-up post-order check'
  },
  {
    feature: 'Primary CS Application',
    inorder: 'Infix expressions, BST search',
    preorder: 'Cloning, Serialization, Prefix',
    postorder: 'Destructor/Free, Bottom-up aggregations'
  },
  {
    feature: 'Time Complexity',
    inorder: 'O(N) — all nodes visited once',
    preorder: 'O(N) — all nodes visited once',
    postorder: 'O(N) — all nodes visited once'
  },
  {
    feature: 'Space Complexity (Call Stack)',
    inorder: 'O(H) — H is tree height',
    preorder: 'O(H) — H is tree height',
    postorder: 'O(H) — H is tree height'
  }
];

export const RECONSTRUCTION_RULES = [
  {
    pair: 'Inorder + Preorder',
    possible: true,
    badge: 'Unique Tree',
    description: 'Preorder identifies the root (first element). Inorder locates the root and partitions elements into left and right subtrees. Recursively builds the unique tree.'
  },
  {
    pair: 'Inorder + Postorder',
    possible: true,
    badge: 'Unique Tree',
    description: 'Postorder identifies the root (last element). Inorder partitions into left and right subtrees. Recursively builds the unique tree.'
  },
  {
    pair: 'Preorder + Postorder',
    possible: false,
    badge: 'Ambiguous',
    description: 'Cannot uniquely reconstruct a generic binary tree if internal nodes have only one child (cannot determine whether single child is left or right).'
  }
];
