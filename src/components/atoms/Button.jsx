import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', disabled = false, icon: Icon, ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={onClick}
            className={`flex items-center justify-center space-x-2 transition-all duration-200 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
            {...props}
        >
            {Icon && Icon}
            {children}
        </motion.button>
    );
};

export default Button;