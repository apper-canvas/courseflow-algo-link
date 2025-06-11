import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ProgressRing from '../components/ProgressRing';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { courseService, userProgressService } from '../services';

function MyLearning() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEnrolledCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const progressData = await userProgressService.getAllProgress();
        const coursePromises = progressData.map(async (progress) => {
          const course = await courseService.getById(progress.courseId);
          return { ...course, progress };
        });
        const courses = await Promise.all(coursePromises);
        setEnrolledCourses(courses);
      } catch (err) {
        setError(err.message || 'Failed to load your courses');
        toast.error('Failed to load your courses');
      } finally {
        setLoading(false);
      }
    };

    loadEnrolledCourses();
  }, []);

  const calculateProgress = (course) => {
    if (!course.progress || !course.modules) return 0;
    
    const totalLessons = course.modules.reduce((acc, module) => 
      acc + (module.lessons?.length || 0), 0
    );
    
    if (totalLessons === 0) return 0;
    
    const completedLessons = course.progress.completedLessons?.length || 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getNextLesson = (course) => {
    if (!course.modules || !course.progress) return null;
    
    for (const module of course.modules) {
      for (const lesson of module.lessons || []) {
        if (!course.progress.completedLessons?.includes(lesson.id)) {
          return lesson;
        }
      }
    }
    return null;
  };

  const handleContinueCourse = (course) => {
    const nextLesson = getNextLesson(course);
    if (nextLesson) {
      navigate(`/learning/${course.id}/${nextLesson.id}`);
    } else {
      navigate(`/learning/${course.id}`);
    }
  };

  const formatLastAccessed = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const accessed = new Date(date);
    const diffMs = now - accessed;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return accessed.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState 
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          My Learning
        </h1>
        <p className="text-gray-600">
          Continue your learning journey with {enrolledCourses.length} enrolled courses
        </p>
      </div>

      {/* Course Grid */}
      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No courses enrolled yet"
          description="Start your learning journey by browsing our course catalog"
          actionLabel="Browse Courses"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course, index) => {
            const progress = calculateProgress(course);
            const nextLesson = getNextLesson(course);
            const isCompleted = progress === 100;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Last accessed: {formatLastAccessed(course.progress.lastAccessed)}</span>
                    {course.progress.certificateEarned && (
                      <div className="flex items-center text-success">
                        <ApperIcon name="Award" size={14} className="mr-1" />
                        <span>Certified</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleContinueCourse(course)}
                      className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      {isCompleted ? 'Review' : 'Continue'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <ApperIcon name="Info" size={16} />
                    </motion.button>
                  </div>

                  {nextLesson && !isCompleted && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Next: {nextLesson.title}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <ApperIcon name="Clock" size={12} className="mr-1" />
                        {Math.round(nextLesson.duration / 60)}m
                        {nextLesson.quiz && (
                          <>
                            <ApperIcon name="HelpCircle" size={12} className="ml-2 mr-1" />
                            Quiz
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyLearning;