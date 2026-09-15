import React, { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';

const CODE_TEMPLATES = {
  pseudocode: {
    name: 'Pseudocode',
    inorder: [
      { line: 1, text: 'procedure inorder(node):' },
      { line: 2, text: '  if node == null then return' },
      { line: 3, text: '  inorder(node.left)' },
      { line: 4, text: '  visit(node.value)' },
      { line: 5, text: '  inorder(node.right)' },
      { line: 6, text: 'end procedure' }
    ],
    preorder: [
      { line: 1, text: 'procedure preorder(node):' },
      { line: 2, text: '  if node == null then return' },
      { line: 3, text: '  visit(node.value)' },
      { line: 4, text: '  preorder(node.left)' },
      { line: 5, text: '  preorder(node.right)' },
      { line: 6, text: 'end procedure' }
    ],
    postorder: [
      { line: 1, text: 'procedure postorder(node):' },
      { line: 2, text: '  if node == null then return' },
      { line: 3, text: '  postorder(node.left)' },
      { line: 4, text: '  postorder(node.right)' },
      { line: 5, text: '  visit(node.value)' },
      { line: 6, text: 'end procedure' }
    ]
  },
  python: {
    name: 'Python',
    inorder: [
      { line: 1, text: 'def inorder(node):' },
      { line: 2, text: '    if not node: return' },
      { line: 3, text: '    inorder(node.left)' },
      { line: 4, text: '    print(node.val)' },
      { line: 5, text: '    inorder(node.right)' },
      { line: 6, text: '    return' }
    ],
    preorder: [
      { line: 1, text: 'def preorder(node):' },
      { line: 2, text: '    if not node: return' },
      { line: 3, text: '    print(node.val)' },
      { line: 4, text: '    preorder(node.left)' },
      { line: 5, text: '    preorder(node.right)' },
      { line: 6, text: '    return' }
    ],
    postorder: [
      { line: 1, text: 'def postorder(node):' },
      { line: 2, text: '    if not node: return' },
      { line: 3, text: '    postorder(node.left)' },
      { line: 4, text: '    postorder(node.right)' },
      { line: 5, text: '    print(node.val)' },
      { line: 6, text: '    return' }
    ]
  },
  cpp: {
    name: 'C++',
    inorder: [
      { line: 1, text: 'void inorder(TreeNode* node) {' },
      { line: 2, text: '    if (node == nullptr) return;' },
      { line: 3, text: '    inorder(node->left);' },
      { line: 4, text: '    cout << node->val << " ";' },
      { line: 5, text: '    inorder(node->right);' },
      { line: 6, text: '}' }
    ],
    preorder: [
      { line: 1, text: 'void preorder(TreeNode* node) {' },
      { line: 2, text: '    if (node == nullptr) return;' },
      { line: 3, text: '    cout << node->val << " ";' },
      { line: 4, text: '    preorder(node->left);' },
      { line: 5, text: '    preorder(node->right);' },
      { line: 6, text: '}' }
    ],
    postorder: [
      { line: 1, text: 'void postorder(TreeNode* node) {' },
      { line: 2, text: '    if (node == nullptr) return;' },
      { line: 3, text: '    postorder(node->left);' },
      { line: 4, text: '    postorder(node->right);' },
      { line: 5, text: '    cout << node->val << " ";' },
      { line: 6, text: '}' }
    ]
  }
};

export default function CodeTracer({ traversalType = 'inorder', activeLine = null }) {
  const [lang, setLang] = useState('pseudocode');
  const [copied, setCopied] = useState(false);

  const lines = CODE_TEMPLATES[lang][traversalType] || CODE_TEMPLATES.pseudocode[traversalType];

  const handleCopy = () => {
    const codeString = lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-dark-950/90 rounded-xl border border-zinc-800/80 overflow-hidden shadow-inner">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/70 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Code2 size={13} className="text-emerald-400" />
          <span className="font-mono uppercase text-[11px] font-semibold text-zinc-300">
            Algorithm Tracer
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md bg-dark-900 p-0.5 border border-zinc-800 text-[10px] font-mono">
            {Object.keys(CODE_TEMPLATES).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 rounded transition ${
                  lang === l
                    ? 'bg-zinc-800 text-emerald-300 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {CODE_TEMPLATES[l].name}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            title="Copy Code"
            className="p-1 rounded bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-white transition"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* Code Content with Line Number and Active Highlighter */}
      <div className="p-3 font-mono text-xs overflow-x-auto space-y-0.5 flex-1">
        {lines.map((item) => {
          const isCurrent = activeLine === item.line;

          return (
            <div
              key={item.line}
              className={`flex items-center py-1 px-2 rounded transition-all duration-150 ${
                isCurrent
                  ? 'bg-emerald-500/20 text-emerald-200 font-semibold border-l-2 border-emerald-400 pl-2 shadow-sm shadow-emerald-500/10'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className={`w-6 text-right pr-3 select-none text-[11px] ${isCurrent ? 'text-emerald-400 font-bold' : 'text-zinc-600'}`}>
                {item.line}
              </span>
              <span className="flex-1 whitespace-pre">
                {item.text}
              </span>
              {isCurrent && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-300 ml-2 animate-pulse">
                  executing
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
