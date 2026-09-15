import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import WhatIsBinaryTree from './sections/WhatIsBinaryTree';
import WhatIsTraversal from './sections/WhatIsTraversal';
import TraversalCardsSection from './sections/TraversalCardsSection';
import VisualizerSection from './sections/VisualizerSection';
import BuildYourOwnTreeSection from './sections/BuildYourOwnTreeSection';
import ComparisonSection from './sections/ComparisonSection';
import ComplexitySection from './sections/ComplexitySection';
import Footer from './sections/Footer';
import PresentationModal from './components/PresentationModal';
import ShortcutsModal from './components/ShortcutsModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  const [selectedTraversal, setSelectedTraversal] = useState('inorder');
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Smooth scroll helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTraversalFromCard = (type) => {
    setSelectedTraversal(type);
    scrollToSection('visualizer');
  };

  // Enable keyboard shortcuts
  useKeyboardShortcuts({
    onSelectInorder: () => setSelectedTraversal('inorder'),
    onSelectPreorder: () => setSelectedTraversal('preorder'),
    onSelectPostorder: () => setSelectedTraversal('postorder'),
    enabled: !isPresentationOpen && !isShortcutsOpen
  });

  return (
    <div className="min-h-screen bg-dark-950 text-zinc-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Navigation Bar */}
      <Navbar
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* 1. Hero Section */}
        <HeroSection
          onStartLearning={() => scrollToSection('binary-tree')}
          onTryVisualizer={() => scrollToSection('visualizer')}
        />

        {/* 2. What is a Binary Tree? */}
        <WhatIsBinaryTree />

        {/* 3. What is Tree Traversal? */}
        <WhatIsTraversal />

        {/* 4. Traversal Method Cards */}
        <TraversalCardsSection
          onSelectTraversal={handleSelectTraversalFromCard}
        />

        {/* 5. Interactive Visualizer Workbench (Split-View Debugger) */}
        <VisualizerSection
          selectedTraversal={selectedTraversal}
          onTraversalChange={setSelectedTraversal}
        />

        {/* 6. Feature 1: Build Your Own Tree */}
        <BuildYourOwnTreeSection />

        {/* 7. Three Traversals. One Tree. (Synchronized Comparison & Play All) */}
        <ComparisonSection />

        {/* 8. Feature 2: How Efficient Are They? (Time O(n) & Space O(h)) */}
        <ComplexitySection />
      </main>

      {/* 9. Footer */}
      <Footer onOpenShortcuts={() => setIsShortcutsOpen(true)} />

      {/* Modals */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
