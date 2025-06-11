import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ContentLoader from '@/components/organisms/ContentLoader';
import ErrorDisplay from '@/components/organisms/ErrorDisplay';
import CourseDetailHeader from '@/components/organisms/CourseDetailHeader';
import CourseInfoStats from '@/components/organisms/CourseInfoStats';
import CourseSyllabusSection from '@/components/organisms/CourseSyllabusSection';
import EnrollmentActionCard from '@/components/organisms/EnrollmentActionCard';
import { courseService, userProgressService } from '@/services';

const CourseDetailPage = () => {
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
        <ContentLoader count={1} />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorDisplay 
          message={error || 'Course not found'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const totalLessons = course.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;

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
              <CourseDetailHeader course={course} />
              <CourseInfoStats course={course} totalLessons={totalLessons} />
              <CourseSyllabusSection modules={course.modules} />
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <EnrollmentActionCard
            isEnrolled={isEnrolled}
            enrolling={enrolling}
            onEnroll={handleEnroll}
            onStartLearning={handleStartLearning}
          />
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;