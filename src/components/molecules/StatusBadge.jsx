import React from 'react';

const StatusBadge = ({ label, type = 'default', className = '' }) => {
    const baseStyle = 'px-2 py-1 rounded text-xs font-medium';
    let typeStyle = 'bg-gray-100 text-gray-700'; // default

    if (type === 'primary') {
        typeStyle = 'bg-primary/10 text-primary';
    } else if (type === 'secondary') {
        typeStyle = 'bg-secondary/10 text-secondary';
    } else if (type === 'success') {
        typeStyle = 'bg-success/10 text-success';
    } else if (type === 'warning') {
        typeStyle = 'bg-warning/10 text-warning';
    } else if (type === 'error') {
        typeStyle = 'bg-error/10 text-error';
    } else if (type === 'highlight') {
        typeStyle = 'bg-gradient-to-r from-warning to-yellow-400 text-white';
    }

    return (
        <span className={`${baseStyle} ${typeStyle} ${className}`}>
            {label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
    );
};

export default StatusBadge;