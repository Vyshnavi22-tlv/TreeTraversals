export const TRAVERSAL_INFO = {
  inorder: {
    id: 'inorder',
    name: 'Inorder Traversal',
    rule: 'Left → Root → Right',
    shortRule: 'L - N - R',
    accent: '#10b981', // emerald
    resultSeminarTree: ['D', 'B', 'E', 'A', 'C'],
    summary: 'Traverses the left subtree recursively, visits the current root node, and then recursively traverses the right subtree.',
    bstSuperpower: 'For a Binary Search Tree (BST), Inorder traversal visits keys in strictly non-decreasing (sorted) order.',
    pseudocode: [
      { line: 1, text: 'function inorder(node):' },
      { line: 2, text: '    if node is null: return' },
      { line: 3, text: '    inorder(node.left)' },
      { line: 4, text: '    visit(node)' },
      { line: 5, text: '    inorder(node.right)' },
      { line: 6, text: '    return' }
    ],
    useCases: [
      { title: 'BST Sorted Retrieval', desc: 'Outputs elements in perfectly sorted ascending order without extra sorting overhead.' },
      { title: 'Arithmetic Infix Expressions', desc: 'Produces traditional mathematical infix expressions (e.g., (A + B) * C) from an AST.' },
      { title: 'Tree Flattening', desc: 'Flattens binary search trees into balanced 1D sorted arrays or linked lists.' }
    ],
    walkthrough: [
      { step: 1, node: 'D', action: 'Leftmost leaf reached and processed' },
      { step: 2, node: 'B', action: 'Parent of D visited after left child finishes' },
      { step: 3, node: 'E', action: 'Right child of B visited' },
      { step: 4, node: 'A', action: 'Overall tree root visited after entire left branch (D, B, E)' },
      { step: 5, node: 'C', action: 'Right child of root visited' }
    ]
  },
  preorder: {
    id: 'preorder',
    name: 'Preorder Traversal',
    rule: 'Root → Left → Right',
    shortRule: 'N - L - R',
    accent: '#38bdf8', // sky
    resultSeminarTree: ['A', 'B', 'D', 'E', 'C'],
    summary: 'Visits the current root node first before making recursive calls down to the left and right subtrees.',
    bstSuperpower: 'Preserves the hierarchical parent-child relationships top-down, making it ideal for cloning or serializing a tree structure.',
    pseudocode: [
      { line: 1, text: 'function preorder(node):' },
      { line: 2, text: '    if node is null: return' },
      { line: 3, text: '    visit(node)' },
      { line: 4, text: '    preorder(node.left)' },
      { line: 5, text: '    preorder(node.right)' },
      { line: 6, text: '    return' }
    ],
    useCases: [
      { title: 'Tree Cloning & Serialization', desc: 'Replicates or writes the exact tree structure to disk or JSON stream efficiently.' },
      { title: 'Prefix Expression (Polish Notation)', desc: 'Generates prefix expressions for compilers and stack-based interpreters (+ A B).' },
      { title: 'Hierarchy Rendering', desc: 'Generates table of contents, outlines, or folder file trees starting with directory headers.' }
    ],
    walkthrough: [
      { step: 1, node: 'A', action: 'Root visited immediately before exploring any branch' },
      { step: 2, node: 'B', action: 'Left child of A visited as new subtree root' },
      { step: 3, node: 'D', action: 'Left child of B visited' },
      { step: 4, node: 'E', action: 'Right child of B visited after left branch finishes' },
      { step: 5, node: 'C', action: 'Right child of main root A visited' }
    ]
  },
  postorder: {
    id: 'postorder',
    name: 'Postorder Traversal',
    rule: 'Left → Right → Root',
    shortRule: 'L - R - N',
    accent: '#a855f7', // purple
    resultSeminarTree: ['D', 'E', 'B', 'C', 'A'],
    summary: 'Visits both children recursively before finally processing the parent root node. Classic bottom-up evaluation.',
    bstSuperpower: 'Guarantees child dependencies are solved or deleted prior to touching the parent node.',
    pseudocode: [
      { line: 1, text: 'function postorder(node):' },
      { line: 2, text: '    if node is null: return' },
      { line: 3, text: '    postorder(node.left)' },
      { line: 4, text: '    postorder(node.right)' },
      { line: 5, text: '    visit(node)' },
      { line: 6, text: '    return' }
    ],
    useCases: [
      { title: 'Memory Deallocation / Deletion', desc: 'Safely deletes child nodes in languages like C/C++ before freeing the parent memory.' },
      { title: 'Directory Size Calculation', desc: 'Computes total folder disk usage bottom-up by aggregating child file sizes first.' },
      { title: 'Postfix (Reverse Polish) Evaluation', desc: 'Compilers evaluate mathematical AST expressions: operands first, then operator.' }
    ],
    walkthrough: [
      { step: 1, node: 'D', action: 'Left leaf of B processed bottom-up' },
      { step: 2, node: 'E', action: 'Right leaf of B processed' },
      { step: 3, node: 'B', action: 'Parent B processed only after both D and E finish' },
      { step: 4, node: 'C', action: 'Right subtree of A processed' },
      { step: 5, node: 'A', action: 'Root node A processed last of all' }
    ]
  }
};
