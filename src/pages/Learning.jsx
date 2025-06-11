import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import VideoPlayer from '../components/VideoPlayer';
import QuizComponent from '../components/QuizComponent';
import LessonSidebar from '../components/LessonSidebar';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import { courseService, userProgressService } from '../services';

function Learning() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseData, progressData] = await Promise.all([
          courseService.getById(courseId),
          userProgressService.getProgress(courseId)
        ]);
        
        setCourse(courseData);
        setProgress(progressData);

        // Find current lesson
        let lesson = null;
        if (lessonId) {
          // Find lesson by ID
          for (const module of courseData.modules || []) {
            lesson = module.lessons?.find(l => l.id === lessonId);
            if (lesson) break;
          }
        } else {
          // Get first lesson
          lesson = courseData.modules?.[0]?.lessons?.[0];
        }

        if (lesson) {
          setCurrentLesson(lesson);
          // Update URL if needed
          if (!lessonId) {
            navigate(`/learning/${courseId}/${lesson.id}`, { replace: true });
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load learning data');
        toast.error('Failed to load learning data');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadData();
    }
  }, [courseId, lessonId, navigate]);

  const handleLessonSelect = (newLessonId) => {
    navigate(`/learning/${courseId}/${newLessonId}`);
  };

  const handleVideoProgress = async (progressPercent) => {
    setVideoProgress(progressPercent);
    
    // Save progress
    try {
      await userProgressService.updateProgress(courseId, {
        lessonId: currentLesson.id,
        progress: progressPercent
      });
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const handleVideoComplete = async () => {
    try {
      await userProgressService.completeLesson(courseId, currentLesson.id);
      setProgress(await userProgressService.getProgress(courseId));
      toast.success('Lesson completed!');
      
      // Show quiz if available
      if (currentLesson.quiz) {
        setShowQuiz(true);
      } else {
        // Move to next lesson
        handleNextLesson();
      }
    } catch (err) {
      toast.error('Failed to mark lesson as complete');
    }
  };

  const handleQuizComplete = async (score) => {
    try {
      await userProgressService.completeQuiz(courseId, currentLesson.id, score);
      setProgress(await userProgressService.getProgress(courseId));
      setShowQuiz(false);
      
      if (score >= currentLesson.quiz.passingScore) {
        toast.success('Quiz passed! Moving to next lesson.');
        handleNextLesson();
      }
    } catch (err) {
      toast.error('Failed to save quiz results');
    }
  };

  const handleNextLesson = () => {
    // Find next lesson
    let foundCurrent = false;
    for (const module of course.modules || []) {
      for (const lesson of module.lessons || []) {
        if (foundCurrent) {
          navigate(`/learning/${courseId}/${lesson.id}`);
          return;
        }
        if (lesson.id === currentLesson.id) {
          foundCurrent = true;
        }
      }
    }
    
    // No next lesson - course complete
    toast.success('Congratulations! You have completed the course!');
    navigate('/certificates');
  };

  if (loading) {
    return (
      <div className="h-full flex">
        <div className="w-80 bg-white border-r border-gray-200">
          <SkeletonLoader count={1} />
        </div>
        <div className="flex-1 p-8">
          <SkeletonLoader count={1} />
        </div>
      </div>
    );
  }

  if (error || !course || !currentLesson) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState 
          message={error || 'Learning content not found'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden">
      <LessonSidebar
        course={course}
        currentLessonId={currentLesson.id}
        onLessonSelect={handleLessonSelect}
        progress={progress}
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Lesson Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                {currentLesson.title}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Progress: {Math.round(videoProgress)}%
                </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              {Math.round(currentLesson.duration / 60)} minutes • 
              {currentLesson.quiz ? ' Quiz included' : ' No quiz'}
            </p>
          </div>

          {/* Video or Quiz Content */}
          {showQuiz && currentLesson.quiz ? (
            <QuizComponent
              quiz={currentLesson.quiz}
              onComplete={handleQuizComplete}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="aspect-video">
                <VideoPlayer
                  videoUrl={currentLesson.videoUrl}
                  onProgress={handleVideoProgress}
                  onComplete={handleVideoComplete}
                  initialProgress={videoProgress}
                />
              </div>
            </motion.div>
          )}

          {/* Lesson Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              <span>Back to Course</span>
            </button>

            <div className="flex items-center space-x-4">
              {currentLesson.quiz && !showQuiz && progress?.completedLessons?.includes(currentLesson.id) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowQuiz(true)}
                  className="px-4 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                >
                  Take Quiz
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextLesson}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <span>Next Lesson</span>
                <ApperIcon name="ArrowRight" size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Learning;