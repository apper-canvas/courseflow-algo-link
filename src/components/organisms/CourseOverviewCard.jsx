import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import CourseMetaInfo from '@/components/molecules/CourseMetaInfo';
import IconText from '@/components/molecules/IconText';

const CourseOverviewCard = ({ course, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-250 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <CourseMetaInfo category={course.category} difficulty={course.difficulty} />
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <CourseMetaInfo category={course.category} difficulty={course.difficulty} duration={course.duration} />
        </div>
        
        <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-3">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{course.instructor}</span>
          </div>
          
          <IconText 
            iconName="BookOpen" 
            text={`${course.modules?.length || 0} modules`} 
            className="text-gray-500 text-sm" 
          />
        </div>
      </div>
    </motion.div>
  );
}

export default CourseOverviewCard;