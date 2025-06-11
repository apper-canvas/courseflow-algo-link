import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const CourseInfoStats = ({ course, totalLessons }) => {
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const StatItem = ({ iconName, label, value }) => (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ApperIcon name={iconName} size={24} className="text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatItem iconName="Clock" label="Duration" value={formatDuration(course.duration)} />
            <StatItem iconName="BookOpen" label="Lessons" value={totalLessons} />
            <StatItem iconName="FolderOpen" label="Modules" value={course.modules?.length || 0} />
            <StatItem iconName="Award" label="Certificate" value="Yes" />
        </div>
    );
};

export default CourseInfoStats;