import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, BookOpen, Terminal, Sparkles, Binary } from 'lucide-react';
import HeroTreeSvg from '../components/HeroTreeSvg';

export default function HeroSection({ onStartLearning, onTryVisualizer }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
      {/* Background ambient radial gradients & grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Computer Science Seminar</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-semibold">CS201 Data Structures</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
              TREE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200">TRAVERSALS</span>
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              See how algorithms actually move through a tree.
            </p>

            {/* Subtitle description */}
            <p className="text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
              An interactive visualizer and deep-dive conceptual guide for Inorder, Preorder, and Postorder traversals with real-time call stack tracking.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#binary-tree"
                onClick={(e) => {
                  e.preventDefault();
                  onStartLearning ? onStartLearning() : document.querySelector('#binary-tree')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                <BookOpen size={16} />
                <span>Start Learning</span>
                <ArrowRight size={15} />
              </a>

              <a
                href="#visualizer"
                onClick={(e) => {
                  e.preventDefault();
                  onTryVisualizer ? onTryVisualizer() : document.querySelector('#visualizer')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold text-sm border border-zinc-800 hover:border-zinc-700 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlayCircle size={16} className="text-emerald-400" />
                <span>Try Visualizer</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xs font-mono text-zinc-500">Algorithms</div>
                <div className="text-sm font-mono font-bold text-zinc-200 mt-0.5">3 DFS Core</div>
              </div>
              <div>
                <div className="text-xs font-mono text-zinc-500">Time Complexity</div>
                <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">O(N) Linear</div>
              </div>
              <div>
                <div className="text-xs font-mono text-zinc-500">Stack Space</div>
                <div className="text-sm font-mono font-bold text-zinc-200 mt-0.5">O(H) Height</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Animated SVG Binary Tree */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-6"
          >
            <HeroTreeSvg />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
