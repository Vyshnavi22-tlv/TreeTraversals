import { useEffect } from 'react';

/**
 * Custom hook for seminar keyboard shortcuts:
 * Space: Play / Pause
 * R: Reset
 * 1: Inorder
 * 2: Preorder
 * 3: Postorder
 * N: Next Step
 */
export function useKeyboardShortcuts({
  onTogglePlay,
  onReset,
  onSelectInorder,
  onSelectPreorder,
  onSelectPostorder,
  onNextStep,
  enabled = true
}) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      // Do not trigger if user is in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onTogglePlay && onTogglePlay();
          break;
        case 'KeyR':
          e.preventDefault();
          onReset && onReset();
          break;
        case 'Digit1':
          e.preventDefault();
          onSelectInorder && onSelectInorder();
          break;
        case 'Digit2':
          e.preventDefault();
          onSelectPreorder && onSelectPreorder();
          break;
        case 'Digit3':
          e.preventDefault();
          onSelectPostorder && onSelectPostorder();
          break;
        case 'KeyN':
          e.preventDefault();
          onNextStep && onNextStep();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    enabled,
    onTogglePlay,
    onReset,
    onSelectInorder,
    onSelectPreorder,
    onSelectPostorder,
    onNextStep
  ]);
}
