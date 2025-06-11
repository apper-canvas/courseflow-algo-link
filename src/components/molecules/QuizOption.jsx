import React from 'react';
import { motion } from 'framer-motion';

const QuizOption = ({ option, index, isSelected, onSelect }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(index)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                isSelected
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
        >
            <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    isSelected
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                }`}>
                    {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                </div>
                <span className="font-medium">{option}</span>
            </div>
        </motion.button>
    );
};

export default QuizOption;