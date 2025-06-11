import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/molecules/StatusBadge';

const CourseDetailHeader = ({ course }) => {
    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <StatusBadge label={course.category} type="primary" />
                <StatusBadge label={course.difficulty} type="secondary" />
            </div>

            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                {course.title}
            </h1>

            <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-4">
                    <ApperIcon name="User" size={20} className="text-white" />
                </div>
                <div>
                    <p className="font-semibold text-gray-900">{course.instructor}</p>
                    <p className="text-sm text-gray-600">Course Instructor</p>
                </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {course.description}
            </p>
        </>
    );
};

export default CourseDetailHeader;