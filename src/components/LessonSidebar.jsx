import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

function LessonSidebar({ course, currentLessonId, onLessonSelect, progress = {} }) {
  const isLessonCompleted = (lessonId) => {
    return progress.completedLessons?.includes(lessonId) || false;
  };

  const getModuleProgress = (module) => {
    const totalLessons = module.lessons.length;
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
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                <span className="text-sm text-gray-500">
                  {getModuleProgress(module)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getModuleProgress(module)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              {module.lessons?.map((lesson, lessonIndex) => {
                const isCompleted = isLessonCompleted(lesson.id);
                const isCurrent = lesson.id === currentLessonId;

                return (
                  <motion.button
                    key={lesson.id}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    onClick={() => onLessonSelect(lesson.id)}
                    className={`w-full p-3 text-left flex items-center space-x-3 transition-colors ${
                      isCurrent 
                        ? 'bg-primary/10 border-r-4 border-primary' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted 
                        ? 'bg-success text-white' 
                        : isCurrent 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <ApperIcon name="Check" size={14} />
                      ) : (
                        <span className="text-xs font-medium">
                          {lessonIndex + 1}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${
                        isCurrent ? 'text-primary' : 'text-gray-900'
                      }`}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <ApperIcon name="Clock" size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {Math.round(lesson.duration / 60)}m
                        </span>
                        {lesson.quiz && (
                          <>
                            <ApperIcon name="HelpCircle" size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-500">Quiz</span>
                          </>
                        )}
                      </div>
                    </div>

                    {isCurrent && (
                      <ApperIcon name="Play" size={16} className="text-primary" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default LessonSidebar;