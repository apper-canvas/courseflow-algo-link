import React from 'react';
import InfoStatCard from '@/components/molecules/InfoStatCard';

const ProgressOverview = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <InfoStatCard
                iconName="BookOpen"
                iconBgColor="bg-primary/10"
                iconColor="text-primary"
                value={`${stats.completedCourses}/${stats.totalCourses}`}
                label="Courses Completed"
            />
            <InfoStatCard
                iconName="Play"
                iconBgColor="bg-accent/10"
                iconColor="text-accent"
                value={`${stats.completedLessons}/${stats.totalLessons}`}
                label="Lessons Completed"
                delay={0.1}
            />
            <InfoStatCard
                iconName="Target"
                iconBgColor="bg-success/10"
                iconColor="text-success"
                value={`${stats.averageScore}%`}
                label="Average Quiz Score"
                delay={0.2}
            />
            <InfoStatCard
                iconName="Award"
                iconBgColor="bg-warning/10"
                iconColor="text-warning"
                value={stats.certificates}
                label="Certificates Earned"
                delay={0.3}
            />
        </div>
    );
};

export default ProgressOverview;