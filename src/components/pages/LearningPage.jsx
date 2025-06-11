import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LessonSidebarNav from '@/components/organisms/LessonSidebarNav';
import LessonContentArea from '@/components/organisms/LessonContentArea';
import ContentLoader from '@/components/organisms/ContentLoader';
import ErrorDisplay from '@/components/organisms/ErrorDisplay';
import { courseService, userProgressService } from '@/services';

const LearningPage = () => {
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
          // Reset quiz state and video progress for new lesson
          setShowQuiz(false);
          setVideoProgress(progressData.lessonProgress?.[lesson.id] || 0);
        } else {
            setError('Lesson not found within course.');
            toast.error('Lesson not found.');
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
      const updatedProgress = await userProgressService.getProgress(courseId);
      setProgress(updatedProgress);
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
      const updatedProgress = await userProgressService.getProgress(courseId);
      setProgress(updatedProgress);
      setShowQuiz(false);
      
      if (score >= currentLesson.quiz.passingScore) {
        toast.success('Quiz passed! Moving to next lesson.');
        handleNextLesson();
      } else {
        toast.info('Quiz not passed. You can retake it or review the lesson.');
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

  const handleBackToCourse = () => {
    navigate(`/courses/${courseId}`);
  };

  const handleTakeQuizClick = () => {
    setShowQuiz(true);
  };

  if (loading) {
    return (
      <div className="h-full flex">
        <div className="w-80 bg-white border-r border-gray-200">
          <ContentLoader count={1} />
        </div>
        <div className="flex-1 p-8">
          <ContentLoader count={1} />
        </div>
      </div>
    );
  }

  if (error || !course || !currentLesson) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorDisplay 
          message={error || 'Learning content not found'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden">
      <LessonSidebarNav
        course={course}
        currentLessonId={currentLesson.id}
        onLessonSelect={handleLessonSelect}
        progress={progress}
      />
      
      <LessonContentArea
        currentLesson={currentLesson}
        videoProgress={videoProgress}
        showQuiz={showQuiz}
        progress={progress}
        courseId={courseId}
        onVideoProgress={handleVideoProgress}
        onVideoComplete={handleVideoComplete}
        onQuizComplete={handleQuizComplete}
        onNextLesson={handleNextLesson}
        onBackToCourse={handleBackToCourse}
        onTakeQuizClick={handleTakeQuizClick}
      />
    </div>
  );
}

export default LearningPage;