import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { computeTreeLayout } from '../algorithms/traversals';

export default function VisualizerTreeSvg({
  root,
  currentNodeId,
  visitedNodes = [],
  activeEdge = null,
  actionType = '',
  hoveredNodeId,
  onNodeHover,
  onNodeClick
}) {
  const shouldReduceMotion = useReducedMotion();

  // Compute dynamic layout from tree data without any hardcoded visual coordinates
  const { nodes, edges, width, height } = useMemo(() => {
    return computeTreeLayout(root, {
      viewWidth: 560,
      viewHeight: 330,
      topMargin: 55,
      bottomMargin: 45,
      horizontalPadding: 60
    });
  }, [root]);

  return (
    <div className="relative w-full h-[320px] sm:h-[350px] flex items-center justify-center select-none overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-h-[350px]"
        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}
      >
        <defs>
          {/* Active node pulsing glow */}
          <radialGradient id="activeNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>

          {/* Active edge highlight gradient */}
          <linearGradient id="activeEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
          </linearGradient>

          {/* Visited edge subtle gradient */}
          <linearGradient id="visitedEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Edges / Traversal Paths */}
        {edges.map((edge) => {
          // Check if this edge is the active traversal path
          const isActivePath =
            activeEdge &&
            ((activeEdge.from === edge.fromId && activeEdge.to === edge.toId) ||
             (activeEdge.from === edge.toId && activeEdge.to === edge.fromId));

          // Check if both ends of this edge have been processed
          const isBothVisited =
            visitedNodes.includes(edge.from.val) && visitedNodes.includes(edge.to.val);

          return (
            <g key={edge.id}>
              {/* Base neutral edge */}
              <line
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke="#27272a"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Visited path indicator */}
              {isBothVisited && !isActivePath && (
                <line
                  x1={edge.from.x}
                  y1={edge.from.y}
                  x2={edge.to.x}
                  y2={edge.to.y}
                  stroke="url(#visitedEdgeGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Active Traversing Edge Highlight */}
              {isActivePath && (
                <motion.line
                  initial={shouldReduceMotion ? { opacity: 1 } : { pathLength: 0, opacity: 0.5 }}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { pathLength: 1, opacity: [0.7, 1, 0.7] }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
                  }
                  x1={edge.from.x}
                  y1={edge.from.y}
                  x2={edge.to.x}
                  y2={edge.to.y}
                  stroke="url(#activeEdgeGradient)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.8))' }}
                />
              )}
            </g>
          );
        })}

        {/* Tree Nodes */}
        {nodes.map((node) => {
          const isCurrent = currentNodeId === node.id;
          const isVisited = visitedNodes.includes(node.val);
          const visitIndex = visitedNodes.indexOf(node.val);
          const isHovered = hoveredNodeId === node.id;

          // Determine node visual states:
          // 1. Current node: glowing ring + accent fill
          // 2. Visited node: emerald styling + order badge
          // 3. Neutral unvisited node: muted dark
          let fillColor = '#0e1117';
          let strokeColor = '#27272a';
          let textColor = '#71717a';

          if (isCurrent) {
            fillColor = '#064e3b';
            strokeColor = '#34d399';
            textColor = '#ecfdf5';
          } else if (isVisited) {
            fillColor = '#0c281e';
            strokeColor = '#059669';
            textColor = '#a7f3d0';
          } else if (isHovered) {
            fillColor = '#181d27';
            strokeColor = '#52525b';
            textColor = '#e4e4e7';
          }

          return (
            <g
              key={node.id}
              className="cursor-pointer"
              onMouseEnter={() => onNodeHover && onNodeHover(node)}
              onMouseLeave={() => onNodeHover && onNodeHover(null)}
              onClick={() => onNodeClick && onNodeClick(node)}
            >
              {/* Outer pulsing halo for the currently highlighted node */}
              {isCurrent && !shouldReduceMotion && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={38}
                  fill="url(#activeNodeGlow)"
                  initial={{ scale: 0.8, opacity: 0.4 }}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* Main Node Circle */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={23}
                animate={
                  shouldReduceMotion
                    ? { fill: fillColor, stroke: strokeColor }
                    : {
                        fill: fillColor,
                        stroke: strokeColor,
                        strokeWidth: isCurrent ? 3 : isVisited ? 2.2 : 1.5,
                        scale: isCurrent ? 1.12 : isHovered ? 1.05 : 1
                      }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.25, ease: 'easeOut' }
                }
              />

              {/* Node Value Label */}
              <text
                x={node.x}
                y={node.y + 6}
                textAnchor="middle"
                fill={textColor}
                className="font-mono font-bold text-base select-none pointer-events-none"
              >
                {node.val}
              </text>

              {/* Visited Order Indicator Badge (#1, #2, #3, ...) */}
              {isVisited && (
                <g transform={`translate(${node.x + 14}, ${node.y - 18})`}>
                  <circle cx="0" cy="0" r="9.5" fill="#10b981" />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    className="fill-black font-mono font-bold text-[10px] select-none pointer-events-none"
                  >
                    {visitIndex + 1}
                  </text>
                </g>
              )}

              {/* "Active" badge when current node is being processed */}
              {isCurrent && actionType === 'processing' && (
                <g transform={`translate(${node.x}, ${node.y + 36})`}>
                  <rect
                    x="-24"
                    y="-8"
                    width="48"
                    height="16"
                    rx="8"
                    fill="#10b981"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    className="fill-black font-mono font-bold text-[9px] select-none pointer-events-none uppercase"
                  >
                    VISIT
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
