import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Terminal, Sparkles, Cpu } from 'lucide-react';

export default function TraversalCard({ info, onSelectForVisualizer }) {
  const [activeTab, setActiveTab] = useState('walkthrough'); // 'walkthrough' | 'code' | 'usecases'

  return (
    <div className="flex flex-col bg-dark-900/90 border border-zinc-800/90 hover:border-zinc-700/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl group">
      {/* Top Header Card */}
      <div className="p-5 border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900/80 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-750 font-medium">
            {info.shortRule}
          </span>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            DFS Variant
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
          {info.name}
        </h3>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold">
          <span>Formula:</span>
          <span>{info.rule}</span>
        </div>

        <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
          {info.summary}
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-zinc-800 bg-dark-950/60 p-1 text-xs font-mono">
        <button
          onClick={() => setActiveTab('walkthrough')}
          className={`flex-1 py-1.5 text-center rounded-md transition ${
            activeTab === 'walkthrough'
              ? 'bg-zinc-800 text-emerald-300 font-semibold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Example Tree
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-1.5 text-center rounded-md transition ${
            activeTab === 'code'
              ? 'bg-zinc-800 text-emerald-300 font-semibold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Algorithm
        </button>
        <button
          onClick={() => setActiveTab('usecases')}
          className={`flex-1 py-1.5 text-center rounded-md transition ${
            activeTab === 'usecases'
              ? 'bg-zinc-800 text-emerald-300 font-semibold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Use Cases
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {activeTab === 'walkthrough' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Canonical Result:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {info.resultExampleTree.join(' → ')}
              </span>
            </div>

            <div className="space-y-1.5">
              {info.walkthrough.map((step) => (
                <div
                  key={step.step}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/60 border border-zinc-850 text-xs"
                >
                  <span className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    {step.step}
                  </span>
                  <div>
                    <span className="font-mono font-semibold text-zinc-200">
                      Node {step.node}:
                    </span>{' '}
                    <span className="text-zinc-400 text-[11px]">{step.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="rounded-xl bg-dark-950 border border-zinc-850 p-3 font-mono text-xs space-y-1">
            {info.pseudocode.map((line) => (
              <div key={line.line} className="flex text-zinc-400 hover:text-zinc-200">
                <span className="w-5 select-none text-zinc-600 text-right pr-2">
                  {line.line}
                </span>
                <span className="whitespace-pre">{line.text}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'usecases' && (
          <div className="space-y-2.5">
            {info.useCases.map((uc, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-850">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 mb-0.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>{uc.title}</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-5 leading-relaxed">
                  {uc.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* BST Callout Banner */}
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs flex items-start gap-2.5">
          <Sparkles size={15} className="text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-200/90 leading-relaxed">
            <strong className="text-emerald-300 font-semibold">Special Property: </strong>
            {info.bstSuperpower}
          </p>
        </div>

        {/* Interactive CTA to load in visualizer */}
        <button
          onClick={() => onSelectForVisualizer(info.id)}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800/80 hover:bg-emerald-500 hover:text-black text-zinc-200 text-xs font-semibold transition-all duration-200 group-hover:border-emerald-500/40"
        >
          <span>Visualize {info.name}</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
