import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MyCourseProgressCard from '@/components/organisms/MyCourseProgressCard';
import ContentLoader from '@/components/organisms/ContentLoader';
import ErrorDisplay from '@/components/organisms/ErrorDisplay';
import EmptyDisplay from '@/components/organisms/EmptyDisplay';
import { courseService, userProgressService } from '@/services';

const MyLearningPage = () => {
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
            <ContentLoader key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorDisplay 
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
              My Learning
            </h1>
            <p className="text-gray-600">
              Continue your learning journey with {enrolledCourses.length} enrolled courses
            </p>
          </div>
          <Button
            onClick={() => navigate('/notes')}
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary-dark"
          >
            <ApperIcon name="FileText" size={16} />
            My Notes
          </Button>
        </div>
      </div>

      {/* Course Grid */}
      {enrolledCourses.length === 0 ? (
        <EmptyDisplay
          title="No courses enrolled yet"
          description="Start your learning journey by browsing our course catalog"
          actionLabel="Browse Courses"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <MyCourseProgressCard 
              key={course.id}
              course={course}
              calculateProgress={calculateProgress}
              getNextLesson={getNextLesson}
              formatLastAccessed={formatLastAccessed}
              onContinueCourse={handleContinueCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyLearningPage;