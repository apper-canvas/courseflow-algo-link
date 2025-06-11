import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/molecules/ProgressRing';
import ProgressBar from '@/components/molecules/ProgressBar';
import Button from '@/components/atoms/Button';
import IconText from '@/components/molecules/IconText';

const MyCourseProgressCard = ({ course, calculateProgress, getNextLesson, formatLastAccessed, onContinueCourse }) => {
  const navigate = useNavigate();
  const progress = calculateProgress(course);
  const nextLesson = getNextLesson(course);
  const isCompleted = progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <ProgressRing progress={progress} size={60} strokeWidth={4}>
            <span className="text-sm font-bold text-gray-900">
              {progress}%
            </span>
          </ProgressRing>
        </div>
        {isCompleted && (
          <div className="absolute top-4 left-4">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <ApperIcon name="Check" size={16} className="text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-3">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {course.instructor}
          </span>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{progress}%</span>
          </div>
          <ProgressBar progress={progress} barClassName="bg-gradient-to-r from-primary to-accent" />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <IconText iconName="Calendar" text={`Last accessed: ${formatLastAccessed(course.progress.lastAccessed)}`} />
          {course.progress.certificateEarned && (
            <IconText iconName="Award" text="Certified" className="text-success" />
          )}
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={() => onContinueCourse(course)}
            className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
          >
            {isCompleted ? 'Review' : 'Continue'}
          </Button>
          
          <Button
            onClick={() => navigate(`/courses/${course.id}`)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            icon={<ApperIcon name="Info" size={16} />}
          />
        </div>

        {nextLesson && !isCompleted && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Next: {nextLesson.title}
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <IconText iconName="Clock" text={`${Math.round(nextLesson.duration / 60)}m`} />
              {nextLesson.quiz && (
                <IconText iconName="HelpCircle" text="Quiz" className="ml-2" />
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default MyCourseProgressCard;