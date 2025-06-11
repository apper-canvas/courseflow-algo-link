import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CourseOverviewCard from '@/components/organisms/CourseOverviewCard';
import ContentLoader from '@/components/organisms/ContentLoader';
import ErrorDisplay from '@/components/organisms/ErrorDisplay';
import EmptyDisplay from '@/components/organisms/EmptyDisplay';
import CourseFilterSection from '@/components/organisms/CourseFilterSection';
import { courseService } from '@/services';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await courseService.getAll();
        setCourses(result);
        setFilteredCourses(result);
      } catch (err) {
        setError(err.message || 'Failed to load courses');
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    let filtered = [...courses];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, selectedCategory, selectedDifficulty]);

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    navigate('/'); // Clear search params
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
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          {searchQuery ? `Search results for "${searchQuery}"` : 'Discover Courses'}
        </h1>
        <p className="text-gray-600">
          {searchQuery ? 
            `Found ${filteredCourses.length} courses matching your search` :
            'Learn new skills with our comprehensive course catalog'
          }
        </p>
      </div>

      {/* Filters */}
      <CourseFilterSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
      />

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyDisplay
          title={searchQuery ? "No courses found" : "No courses available"}
          description={searchQuery ? 
            "Try adjusting your search terms or filters" : 
            "Check back soon for new courses"
          }
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CourseOverviewCard 
                course={course} 
                onClick={() => handleCourseClick(course.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;