import React from 'react';
import { motion } from 'framer-motion';
import { getTreeElements } from '../algorithms/traversals';

export default function VisualizerTreeSvg({
  root,
  activeNodeId,
  visitedNodes = [],
  hoveredNodeId,
  onNodeHover,
  onNodeClick
}) {
  const { nodes, edges } = getTreeElements(root);

  // Determine viewBox dimensions dynamically
  const minX = Math.min(...nodes.map((n) => n.x), 50);
  const maxX = Math.max(...nodes.map((n) => n.x), 450);
  const minY = Math.min(...nodes.map((n) => n.y), 30);
  const maxY = Math.max(...nodes.map((n) => n.y), 270);

  const viewBoxWidth = Math.max(500, maxX + 60);
  const viewBoxHeight = Math.max(300, maxY + 60);

  return (
    <div className="relative w-full h-[320px] sm:h-[360px] flex items-center justify-center select-none overflow-hidden">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-full max-h-[360px]"
      >
        <defs>
          {/* Active node glow */}
          <radialGradient id="visActiveGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>

          {/* Active edge gradient */}
          <linearGradient id="visActiveEdge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Edges */}
        {edges.map((edge) => {
          const isTraversedEdge =
            visitedNodes.includes(edge.to.val) && visitedNodes.includes(edge.from.val);
          const isCurrentlyActiveEdge =
            (activeNodeId === edge.from.id || activeNodeId === edge.to.id) &&
            (!edge.to || activeNodeId === edge.to.id);

          return (
            <g key={edge.id}>
              {/* Default background connector */}
              <line
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke="#27272a"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Traversed / Active connector */}
              {(isTraversedEdge || isCurrentlyActiveEdge) && (
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                  x1={edge.from.x}
                  y1={edge.from.y}
                  x2={edge.to.x}
                  y2={edge.to.y}
                  stroke="url(#visActiveEdge)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}

        {/* Tree Nodes */}
        {nodes.map((node) => {
          const isActive = activeNodeId === node.id;
          const isVisited = visitedNodes.includes(node.val);
          const visitIndex = visitedNodes.indexOf(node.val);
          const isHovered = hoveredNodeId === node.id;

          return (
            <g
              key={node.id}
              className="cursor-pointer"
              onMouseEnter={() => onNodeHover && onNodeHover(node)}
              onMouseLeave={() => onNodeHover && onNodeHover(null)}
              onClick={() => onNodeClick && onNodeClick(node)}
            >
              {/* Glowing halo for active node */}
              {isActive && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={34}
                  fill="url(#visActiveGlow)"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* Outer stroke border */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={23}
                animate={{
                  fill: isActive
                    ? '#064e3b'
                    : isVisited
                    ? '#0d2818'
                    : '#090c12',
                  stroke: isActive
                    ? '#10b981'
                    : isVisited
                    ? '#059669'
                    : isHovered
                    ? '#71717a'
                    : '#27272a',
                  strokeWidth: isActive ? 3 : isVisited ? 2 : 1.5,
                  scale: isActive ? 1.08 : isHovered ? 1.05 : 1
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Node label/val */}
              <text
                x={node.x}
                y={node.y + 6}
                textAnchor="middle"
                className={`font-mono font-bold text-base select-none pointer-events-none ${
                  isActive
                    ? 'fill-emerald-200'
                    : isVisited
                    ? 'fill-emerald-300'
                    : 'fill-zinc-400'
                }`}
              >
                {node.val}
              </text>

              {/* Visited Order Indicator Badge */}
              {isVisited && (
                <g transform={`translate(${node.x + 14}, ${node.y - 18})`}>
                  <circle cx="0" cy="0" r="9" fill="#10b981" />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    className="fill-black font-mono font-bold text-[10px] select-none"
                  >
                    {visitIndex + 1}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
