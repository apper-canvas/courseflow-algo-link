import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/molecules/ProgressBar';
import QuizOption from '@/components/molecules/QuizOption';

const QuizFlow = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const calculatedScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setFinalScore(calculatedScore);
    setShowResults(true);

    const passed = calculatedScore >= quiz.passingScore;
    if (passed) {
      toast.success(`Congratulations! You passed with ${calculatedScore}%`);
      onComplete?.(calculatedScore); // Pass score to parent
    } else {
      toast.error(`You need ${quiz.passingScore}% to pass. You scored ${calculatedScore}%`);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setFinalScore(0);
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isQuestionAnswered = answers[currentQuestionIndex] !== undefined;

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-8 shadow-lg text-center"
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
          finalScore >= quiz.passingScore ? 'bg-success/10' : 'bg-error/10'
        }`}>
          <ApperIcon 
            name={finalScore >= quiz.passingScore ? 'CheckCircle' : 'XCircle'} 
            size={40} 
            className={finalScore >= quiz.passingScore ? 'text-success' : 'text-error'} 
          />
        </div>
        
        <h2 className="text-2xl font-heading font-bold mb-4">
          {finalScore >= quiz.passingScore ? 'Congratulations!' : 'Keep Learning!'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          You scored {finalScore}% on this quiz. 
          {finalScore >= quiz.passingScore ? 
            ' You have successfully completed this lesson!' : 
            ` You need ${quiz.passingScore}% to pass.`
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={restartQuiz}
            className="px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90"
          >
            Retake Quiz
          </Button>
          
          {finalScore >= quiz.passingScore && (
            <Button
              onClick={() => onComplete?.(finalScore)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
            >
              Continue Learning
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-8 shadow-lg"
    >
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}%
          </span>
        </div>
        <ProgressBar progress={((currentQuestionIndex + 1) / quiz.questions.length) * 100} />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-heading font-semibold mb-6">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <QuizOption
                key={index}
                option={option}
                index={index}
                isSelected={answers[currentQuestionIndex] === index}
                onSelect={(answerIndex) => handleAnswerSelect(currentQuestionIndex, answerIndex)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
        >
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isQuestionAnswered}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
        >
          {isLastQuestion ? 'Submit Quiz' : 'Next'}
        </Button>
      </div>
    </motion.div>
  );
}

export default QuizFlow;