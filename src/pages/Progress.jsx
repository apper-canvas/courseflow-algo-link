import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ProgressRing from '../components/ProgressRing';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { courseService, userProgressService } from '../services';

function Progress() {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
    certificates: 0
  });

  useEffect(() => {
    const loadProgressData = async () => {
      setLoading(true);
      setError(null);
      try {
        const allProgress = await userProgressService.getAllProgress();
        const enrichedProgress = await Promise.all(
          allProgress.map(async (progress) => {
            const course = await courseService.getById(progress.courseId);
            return { ...progress, course };
          })
        );
        
        setProgressData(enrichedProgress);
        calculateStats(enrichedProgress);
      } catch (err) {
        setError(err.message || 'Failed to load progress data');
        toast.error('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, []);

  const calculateStats = (data) => {
    const stats = {
      totalCourses: data.length,
      completedCourses: 0,
      totalLessons: 0,
      completedLessons: 0,
      averageScore: 0,
      certificates: 0
    };

    let totalScores = 0;
    let scoreCount = 0;

    data.forEach(({ progress, course }) => {
      const courseLessons = course.modules?.reduce((acc, module) => 
        acc + (module.lessons?.length || 0), 0
      ) || 0;
      
      stats.totalLessons += courseLessons;
      stats.completedLessons += progress.completedLessons?.length || 0;
      
      if (progress.completedLessons?.length === courseLessons && courseLessons > 0) {
        stats.completedCourses++;
      }
      
      if (progress.certificateEarned) {
        stats.certificates++;
      }
      
      if (progress.quizScores) {
        Object.values(progress.quizScores).forEach(score => {
          totalScores += score;
          scoreCount++;
        });
      }
    });

    if (scoreCount > 0) {
      stats.averageScore = Math.round(totalScores / scoreCount);
    }

    setStats(stats);
  };

  const getCourseProgress = (progress, course) => {
    if (!course.modules) return 0;
    
    const totalLessons = course.modules.reduce((acc, module) => 
      acc + (module.lessons?.length || 0), 0
    );
    
    if (totalLessons === 0) return 0;
    
    const completedLessons = progress.completedLessons?.length || 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getAverageQuizScore = (quizScores) => {
    if (!quizScores || Object.keys(quizScores).length === 0) return 0;
    const scores = Object.values(quizScores);
    return Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
        <SkeletonLoader count={3} />
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
          Learning Progress
        </h1>
        <p className="text-gray-600">
          Track your learning journey and achievements
        </p>
      </div>

      {progressData.length === 0 ? (
        <EmptyState
          title="No progress to show yet"
          description="Start learning to see your progress and achievements here"
          actionLabel="Browse Courses"
          onAction={() => navigate('/')}
        />
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="BookOpen" size={24} className="text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.completedCourses}/{stats.totalCourses}
                  </h3>
                  <p className="text-gray-600">Courses Completed</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="Play" size={24} className="text-accent" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.completedLessons}/{stats.totalLessons}
                  </h3>
                  <p className="text-gray-600">Lessons Completed</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="Target" size={24} className="text-success" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.averageScore}%
                  </h3>
                  <p className="text-gray-600">Average Quiz Score</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="Award" size={24} className="text-warning" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.certificates}
                  </h3>
                  <p className="text-gray-600">Certificates Earned</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Course Progress Details */}
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
                            <span>
                              {progress.completedLessons?.length || 0} of {
                                course.modules?.reduce((acc, module) => 
                                  acc + (module.lessons?.length || 0), 0
                                ) || 0
                              } lessons
                            </span>
                            {averageScore > 0 && (
                              <span>Avg. Score: {averageScore}%</span>
                            )}
                            {progress.certificateEarned && (
                              <div className="flex items-center text-success">
                                <ApperIcon name="Award" size={14} className="mr-1" />
                                <span>Certified</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Progress</p>
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                              style={{ width: `${courseProgress}%` }}
                            />
                          </div>
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
        </>
      )}
    </div>
  );
}

export default Progress;