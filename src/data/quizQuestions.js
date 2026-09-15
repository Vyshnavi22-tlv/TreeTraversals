export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "For the seminar tree (Root A; Left child B with children D and E; Right child C), what is the INORDER traversal?",
    options: [
      "A → B → D → E → C",
      "D → B → E → A → C",
      "D → E → B → C → A",
      "B → D → E → A → C"
    ],
    correctAnswer: 1,
    explanation: "Inorder follows Left → Root → Right. Subtree at B gives Left (D), Root (B), Right (E). Then tree root (A), then right child (C): D → B → E → A → C."
  },
  {
    id: 2,
    question: "Which traversal of a Binary Search Tree (BST) produces keys in sorted ascending order?",
    options: [
      "Preorder Traversal",
      "Postorder Traversal",
      "Inorder Traversal",
      "Breadth-First / Level Order Traversal"
    ],
    correctAnswer: 2,
    explanation: "Because BST definition enforces Left < Root < Right, an Inorder traversal naturally processes nodes in ascending order."
  },
  {
    id: 3,
    question: "Why is Postorder traversal preferred for deleting a binary tree in memory (e.g. C / C++)?",
    options: [
      "It minimizes the maximum recursion call stack depth.",
      "It deletes children before deleting their parent, preventing dangling pointer references.",
      "It avoids accessing null pointers at the leaves.",
      "It runs in O(log N) time instead of O(N)."
    ],
    correctAnswer: 1,
    explanation: "In Postorder (Left → Right → Root), both children are completely freed and released before their parent node is freed, preventing memory leaks and orphaned pointers."
  },
  {
    id: 4,
    question: "In the worst case (e.g., a completely skewed tree with N nodes), what is the auxiliary space complexity of recursive DFS traversals?",
    options: [
      "O(1)",
      "O(log N)",
      "O(N)",
      "O(N²)"
    ],
    correctAnswer: 2,
    explanation: "The space complexity is O(H) where H is tree height. In a degenerate skewed tree (like a linked list), H = N, so the call stack consumes O(N) memory."
  },
  {
    id: 5,
    question: "Which pair of traversals CANNOT uniquely reconstruct an arbitrary binary tree?",
    options: [
      "Inorder + Preorder",
      "Inorder + Postorder",
      "Preorder + Postorder",
      "All pairs can uniquely reconstruct any binary tree"
    ],
    correctAnswer: 2,
    explanation: "Preorder + Postorder alone cannot distinguish whether a single child of an internal node is a left or right child. Inorder is required to partition left and right subtrees."
  }
];
