import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProgressOverview from '@/components/organisms/ProgressOverview';
import DetailedCourseProgressList from '@/components/organisms/DetailedCourseProgressList';
import ContentLoader from '@/components/organisms/ContentLoader';
import ErrorDisplay from '@/components/organisms/ErrorDisplay';
import EmptyDisplay from '@/components/organisms/EmptyDisplay';
import { courseService, userProgressService } from '@/services';

const ProgressPage = () => {
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
  const navigate = useNavigate();

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
    const newStats = {
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
      
      newStats.totalLessons += courseLessons;
      newStats.completedLessons += progress.completedLessons?.length || 0;
      
      if (progress.completedLessons?.length === courseLessons && courseLessons > 0) {
        newStats.completedCourses++;
      }
      
      if (progress.certificateEarned) {
        newStats.certificates++;
      }
      
      if (progress.quizScores) {
        Object.values(progress.quizScores).forEach(score => {
          totalScores += score;
          scoreCount++;
        });
      }
    });

    if (scoreCount > 0) {
      newStats.averageScore = Math.round(totalScores / scoreCount);
    }

    setStats(newStats);
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
        <ContentLoader count={3} />
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
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          Learning Progress
        </h1>
        <p className="text-gray-600">
          Track your learning journey and achievements
        </p>
      </div>

      {progressData.length === 0 ? (
        <EmptyDisplay
          title="No progress to show yet"
          description="Start learning to see your progress and achievements here"
          actionLabel="Browse Courses"
          onAction={() => navigate('/')}
        />
      ) : (
        <>
          <ProgressOverview stats={stats} />
          <DetailedCourseProgressList 
            progressData={progressData} 
            getCourseProgress={getCourseProgress} 
            getAverageQuizScore={getAverageQuizScore} 
          />
        </>
      )}
    </div>
  );
}

export default ProgressPage;