import React from 'react';
import StatusBadge from '@/components/molecules/StatusBadge';
import IconText from '@/components/molecules/IconText';

const CourseMetaInfo = ({ category, difficulty, duration, className = '' }) => {
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const difficultyColors = {
        beginner: 'bg-success text-white',
        intermediate: 'bg-warning text-white',
        advanced: 'bg-error text-white'
    };

    return (
        <div className={`flex items-center justify-between ${className}`}>
            <StatusBadge label={category} type="primary" />
            <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[difficulty]}`}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
                {duration && (
                    <IconText iconName="Clock" text={formatDuration(duration)} className="text-gray-500 text-sm" />
                )}
            </div>
        </div>
    );
};

export default CourseMetaInfo;