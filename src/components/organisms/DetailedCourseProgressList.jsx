import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/molecules/ProgressRing';
import ProgressBar from '@/components/molecules/ProgressBar';
import IconText from '@/components/molecules/IconText';
import StatusBadge from '@/components/molecules/StatusBadge';

const DetailedCourseProgressList = ({ progressData, getCourseProgress, getAverageQuizScore }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          Detailed Course Progress
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {progressData.map(({ progress, course }, index) => {
          const courseProgress = getCourseProgress(progress, course);
          const averageScore = getAverageQuizScore(progress.quizScores);
          const isCompleted = courseProgress === 100;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {course.instructor}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <IconText 
                        iconName="FileText" 
                        text={`${progress.completedLessons?.length || 0} of ${
                          course.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0
                        } lessons`} 
                      />
                      {averageScore > 0 && (
                        <IconText iconName="Target" text={`Avg. Score: ${averageScore}%`} />
                      )}
                      {progress.certificateEarned && (
                        <StatusBadge label="Certified" type="success" iconName="Award" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Progress</p>
                    <ProgressBar progress={courseProgress} barClassName="bg-gradient-to-r from-primary to-accent" className="w-32" />
                  </div>
                  
                  <ProgressRing progress={courseProgress} size={60} strokeWidth={4}>
                    <span className="text-sm font-bold text-gray-900">
                      {courseProgress}%
                    </span>
                  </ProgressRing>

                  {isCompleted && (
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <ApperIcon name="Check" size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default DetailedCourseProgressList;