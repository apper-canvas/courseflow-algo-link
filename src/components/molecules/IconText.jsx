import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const IconText = ({ iconName, text, size = 14, className = '', iconClassName = '' }) => {
    return (
        <div className={`flex items-center ${className}`}>
            <ApperIcon name={iconName} size={size} className={`mr-1 ${iconClassName}`} />
            <span>{text}</span>
        </div>
    );
};

export default IconText;