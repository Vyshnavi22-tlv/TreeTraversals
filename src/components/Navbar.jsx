import React, { useState, useEffect } from 'react';
import { Network, Sparkles, Presentation, Command, Github, Menu, X, BookOpen, Layers, PlayCircle, BarChart3, HelpCircle, TreePine } from 'lucide-react';

export default function Navbar({ onOpenPresentation, onOpenShortcuts }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Binary Tree', href: '#binary-tree', icon: BookOpen },
    { name: 'Traversals', href: '#traversals', icon: Layers },
    { name: 'Visualizer', href: '#visualizer', icon: PlayCircle, highlight: true },
    { name: 'Build Tree', href: '#build-tree', icon: TreePine },
    { name: 'Comparison', href: '#comparison', icon: BarChart3 },
    { name: 'Complexity', href: '#complexity', icon: Network },
    { name: 'Quiz', href: '#quiz', icon: HelpCircle },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-950/85 backdrop-blur-md border-b border-zinc-800/80 shadow-lg shadow-black/40'
          : 'bg-dark-950/40 backdrop-blur-sm border-b border-white/[0.05]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="5" r="3" />
              <circle cx="6" cy="19" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="12" y1="8" x2="6" y2="16" />
              <line x1="12" y1="8" x2="18" y2="16" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold tracking-tight text-white text-base group-hover:text-emerald-300 transition-colors">
                TREE TRAVERSALS
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SEMINAR
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wide hidden sm:block">
              Interactive CS Educational Suite
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-dark-900/60 p-1 rounded-full border border-zinc-800/80">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                link.highlight
                  ? 'text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action Tools */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Shortcuts Button */}
          <button
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
          >
            <Command size={13} className="text-zinc-500" />
            <span>Keys</span>
          </button>

          {/* Presentation Mode Toggle */}
          <button
            onClick={onOpenPresentation}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 shadow-sm transition-all"
          >
            <Presentation size={14} />
            <span>Presentation Mode</span>
          </button>
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenPresentation}
            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            title="Presentation Mode"
          >
            <Presentation size={16} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-dark-950/95 border-b border-zinc-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  link.highlight
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <Icon size={16} className="text-emerald-400" />
                <span>{link.name}</span>
              </a>
            );
          })}
          <div className="pt-2 border-t border-zinc-800/80 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShortcuts();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300"
            >
              <Command size={14} /> Keyboard Keys
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
