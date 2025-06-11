import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const difficultyColors = {
  beginner: 'bg-success text-white',
  intermediate: 'bg-warning text-white',
  advanced: 'bg-error text-white'
};

function CourseCard({ course, onClick }) {
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

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
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[course.difficulty]}`}>
            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
            {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <ApperIcon name="Clock" size={14} className="mr-1" />
            {formatDuration(course.duration)}
          </div>
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
          
          <div className="flex items-center text-gray-500 text-sm">
            <ApperIcon name="BookOpen" size={14} className="mr-1" />
            {course.modules?.length || 0} modules
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CourseCard;