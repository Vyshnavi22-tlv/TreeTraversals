# Tree Traversals

An interactive educational web application that visually explains **Binary Tree Traversals** — Inorder, Preorder, and Postorder.

Instead of only presenting algorithms and definitions, the application lets users **watch the traversal happen step by step**.

## Features

* Interactive Binary Tree visualization
* Inorder, Preorder, and Postorder traversal
* Step-by-step traversal animation
* Live traversal output
* Synchronized algorithm/pseudocode highlighting
* Compare all three traversals on the same tree
* Build and traverse a custom Binary Tree
* Time and space complexity explanation
* Interactive quiz
* Guided learning mode
* Presentation Mode for seminars
* Keyboard shortcuts
* Responsive design
* Reduced-motion accessibility support

## Traversals

For the example tree:

```text
        A
       / \
      B   C
     / \
    D   E
```

### Inorder

```text
Left → Root → Right

D → B → E → A → C
```

### Preorder

```text
Root → Left → Right

A → B → D → E → C
```

### Postorder

```text
Left → Right → Root

D → E → B → C → A
```

## Tech Stack

* React
* Vite
* Tailwind CSS
* Framer Motion
* Lucide React
* SVG

## Project Structure

```text
src/
├── algorithms/
│   └── traversals.js
├── components/
├── sections/
├── data/
├── hooks/
├── utils/
├── App.jsx
└── main.jsx
```

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd tree-traversals
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Example

Given:

```text
        A
       / \
      B   C
     / \
    D   E
```

The application produces:

| Traversal | Result    |
| --------- | --------- |
| Inorder   | D B E A C |
| Preorder  | A B D E C |
| Postorder | D E B C A |

## Complexity

For a tree containing `n` nodes:

```text
Time Complexity:  O(n)
Space Complexity: O(h)
```

Where:

* `n` = number of nodes
* `h` = height of the tree

Every node is visited exactly once.

## Keyboard Shortcuts

| Key     | Action       |
| ------- | ------------ |
| `Space` | Play / Pause |
| `R`     | Reset        |
| `1`     | Inorder      |
| `2`     | Preorder     |
| `3`     | Postorder    |
| `N`     | Next Step    |

## Purpose

This project was created as an interactive **Computer Science seminar project** to make Binary Tree Traversals easier to understand through visualization, animation, and hands-on experimentation.

## License

This project is intended for educational purposes.
