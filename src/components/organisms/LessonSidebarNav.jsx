import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ModuleHeader from '@/components/molecules/ModuleHeader';
import LessonItemDisplay from '@/components/molecules/LessonItemDisplay';

const LessonSidebarNav = ({ course, currentLessonId, onLessonSelect, progress = {} }) => {
  const isLessonCompleted = (lessonId) => {
    return progress.completedLessons?.includes(lessonId) || false;
  };

  const getModuleProgress = (module) => {
    const totalLessons = module.lessons?.length || 0;
    if (totalLessons === 0) return 0;
    const completedLessons = module.lessons.filter(lesson => 
      isLessonCompleted(lesson.id)
    ).length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-heading font-semibold text-gray-900 mb-2">
          {course.title}
        </h2>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="User" size={16} className="mr-2" />
          {course.instructor}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {course.modules?.map((module, moduleIndex) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: moduleIndex * 0.1 }}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <ModuleHeader title={module.title} progress={getModuleProgress(module)} />

            <div className="space-y-1">
              {module.lessons?.map((lesson, lessonIndex) => (
                <LessonItemDisplay
                  key={lesson.id}
                  lesson={lesson}
                  index={lessonIndex}
                  isCompleted={isLessonCompleted(lesson.id)}
                  isCurrent={lesson.id === currentLessonId}
                  onSelect={onLessonSelect}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default LessonSidebarNav;