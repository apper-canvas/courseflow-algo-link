import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const LessonItemDisplay = ({ lesson, index, isCompleted, isCurrent, onSelect }) => {
    return (
        <motion.button
            whileHover={{ backgroundColor: '#f8fafc' }}
            onClick={() => onSelect(lesson.id)}
            className={`w-full p-3 text-left flex items-center space-x-3 transition-colors ${
                isCurrent 
                    ? 'bg-primary/10 border-r-4 border-primary' 
                    : 'hover:bg-gray-50'
            }`}
        >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                isCompleted 
                    ? 'bg-success text-white' 
                    : isCurrent 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-500'
            }`}>
                {isCompleted ? (
                    <ApperIcon name="Check" size={14} />
                ) : (
                    <span className="text-xs font-medium">
                        {index + 1}
                    </span>
                )}
            </div>
            
            <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${
                    isCurrent ? 'text-primary' : 'text-gray-900'
                }`}>
                    {lesson.title}
                </p>
                <div className="flex items-center mt-1 space-x-2">
                    <ApperIcon name="Clock" size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">
                        {Math.round(lesson.duration / 60)}m
                    </span>
                    {lesson.quiz && (
                        <>
                            <ApperIcon name="HelpCircle" size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-500">Quiz</span>
                        </>
                    )}
                </div>
            </div>

            {isCurrent && (
                <ApperIcon name="Play" size={16} className="text-primary" />
            )}
        </motion.button>
    );
};

export default LessonItemDisplay;