import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, ChevronRight, Sparkles } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';

export default function QuizSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionIndex }
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestionIndex];
  const userChoice = selectedAnswers[question.id];
  const isAnswered = userChoice !== undefined;
  const isCorrect = userChoice === question.correctAnswer;

  const handleSelectOption = (idx) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: idx
    }));
    setShowExplanation(true);
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowExplanation(selectedAnswers[QUIZ_QUESTIONS[currentQuestionIndex + 1].id] !== undefined);
    } else {
      setSubmitted(true);
      const score = calculateScore();
      if (score >= 4) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowExplanation(selectedAnswers[QUIZ_QUESTIONS[currentQuestionIndex - 1].id] !== undefined);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setSubmitted(false);
    setShowExplanation(false);
  };

  const score = calculateScore();

  return (
    <section id="quiz" className="py-20 border-t border-zinc-800/80 bg-dark-900/30 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold mb-3 border border-emerald-500/20">
            <span>07</span>
            <span>//</span>
            <span>KNOWLEDGE CHECK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Seminar Mastery Quiz
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Test your understanding of tree traversals, BST properties, recursion depth, and tree reconstruction principles.
          </p>
        </div>

        {/* Quiz Container Card */}
        <div className="bg-dark-950/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {!submitted ? (
            <>
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-400">
                  <HelpCircle size={15} className="text-emerald-400" />
                  <span>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                </div>
                <div className="text-zinc-500">
                  Answered: {Object.keys(selectedAnswers).length} / {QUIZ_QUESTIONS.length}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="py-2">
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {question.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((opt, idx) => {
                  const isThisSelected = userChoice === idx;
                  const isThisCorrect = question.correctAnswer === idx;

                  let optionStyle = 'bg-dark-900/70 border-zinc-800/90 hover:border-zinc-700 text-zinc-300';
                  if (isAnswered) {
                    if (isThisCorrect) {
                      optionStyle = 'bg-emerald-500/15 border-emerald-500/60 text-emerald-200 font-semibold shadow-sm shadow-emerald-500/10';
                    } else if (isThisSelected && !isThisCorrect) {
                      optionStyle = 'bg-red-500/15 border-red-500/60 text-red-300';
                    } else {
                      optionStyle = 'bg-dark-900/40 border-zinc-850 text-zinc-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-xl border text-left font-mono text-xs sm:text-sm transition-all duration-150 flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && isThisCorrect && (
                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && isThisSelected && !isThisCorrect && (
                        <XCircle size={18} className="text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Box */}
              {isAnswered && (
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <div className="font-mono font-bold flex items-center gap-1.5">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={14} className="text-amber-400" />
                        <span>Insight:</span>
                      </>
                    )}
                  </div>
                  <p className="text-zinc-300">{question.explanation}</p>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 text-xs font-mono text-zinc-300 transition"
                >
                  Back
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={!isAnswered}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-semibold text-xs font-mono transition shadow-md shadow-emerald-500/20"
                >
                  <span>{currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? 'Finish & Score' : 'Next Question'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </>
          ) : (
            /* Quiz Score Result View */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <Award size={32} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">
                  Quiz Completed!
                </h3>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Seminar Comprehension Score
                </p>
              </div>

              <div className="text-5xl font-mono font-extrabold text-emerald-400">
                {score} / {QUIZ_QUESTIONS.length}
              </div>

              <p className="text-sm text-zinc-300 max-w-md mx-auto">
                {score === 5
                  ? 'Outstanding! You have mastered Inorder, Preorder, Postorder traversals and their algorithmic properties.'
                  : score >= 3
                  ? 'Great performance! You have a solid grasp of binary tree traversal mechanics and invariants.'
                  : 'Good attempt! Review the visualizer steps and complexity cards to solidify your understanding.'}
              </p>

              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  onClick={handleResetQuiz}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-semibold transition"
                >
                  <RotateCcw size={14} />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
