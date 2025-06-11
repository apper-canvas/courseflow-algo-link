import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import { courseService, userProgressService } from '../services';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const courseData = await courseService.getById(id);
        setCourse(courseData);
        
        // Check if user is enrolled
        const progress = await userProgressService.getProgress(id);
        setIsEnrolled(!!progress);
      } catch (err) {
        setError(err.message || 'Failed to load course');
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCourse();
    }
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await userProgressService.enroll(id);
      setIsEnrolled(true);
      toast.success('Successfully enrolled in course!');
      navigate(`/learning/${id}`);
    } catch (err) {
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    const firstLesson = course.modules?.[0]?.lessons?.[0];
    if (firstLesson) {
      navigate(`/learning/${id}/${firstLesson.id}`);
    } else {
      navigate(`/learning/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonLoader count={1} />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState 
          message={error || 'Course not found'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const totalLessons = course.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                </span>
                <span className="text-sm font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                  {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                </span>
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

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="Clock" size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{formatDuration(course.duration)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="BookOpen" size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Lessons</p>
                  <p className="text-lg font-semibold text-gray-900">{totalLessons}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="FolderOpen" size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Modules</p>
                  <p className="text-lg font-semibold text-gray-900">{course.modules?.length || 0}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="Award" size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Certificate</p>
                  <p className="text-lg font-semibold text-gray-900">Yes</p>
                </div>
              </div>

              {/* Syllabus */}
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Course Syllabus</h2>
                <div className="space-y-4">
                  {course.modules?.map((module, moduleIndex) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: moduleIndex * 0.1 }}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          <ApperIcon name="FolderOpen" size={20} className="mr-2 text-primary" />
                          {module.title}
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2">
                          {module.lessons?.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="flex items-center justify-between py-2">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-500 mr-3">
                                  {lessonIndex + 1}.
                                </span>
                                <span className="text-gray-700">{lesson.title}</span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <ApperIcon name="Clock" size={14} className="mr-1" />
                                  {Math.round(lesson.duration / 60)}m
                                </div>
                                {lesson.quiz && (
                                  <div className="flex items-center">
                                    <ApperIcon name="HelpCircle" size={14} className="mr-1" />
                                    Quiz
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 sticky top-24"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                Ready to start learning?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of students already enrolled in this course.
              </p>
              
              {isEnrolled ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartLearning}
                  className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Continue Learning
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now - Free'}
                </motion.button>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">What you'll learn</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <ApperIcon name="Check" size={16} className="text-success mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Master the fundamentals and advanced concepts</span>
                </li>
                <li className="flex items-start">
                  <ApperIcon name="Check" size={16} className="text-success mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Build practical skills through hands-on projects</span>
                </li>
                <li className="flex items-start">
                  <ApperIcon name="Check" size={16} className="text-success mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Earn a certificate of completion</span>
                </li>
                <li className="flex items-start">
                  <ApperIcon name="Check" size={16} className="text-success mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Learn at your own pace with lifetime access</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;