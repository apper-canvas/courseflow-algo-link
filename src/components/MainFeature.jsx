import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import CourseCard from './CourseCard';
import SkeletonLoader from './SkeletonLoader';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import { courseService } from '../services';

const categories = [
  { id: 'all', label: 'All Courses', icon: 'Grid3X3' },
  { id: 'programming', label: 'Programming', icon: 'Code' },
  { id: 'design', label: 'Design', icon: 'Palette' },
  { id: 'business', label: 'Business', icon: 'Briefcase' },
  { id: 'marketing', label: 'Marketing', icon: 'TrendingUp' },
  { id: 'data-science', label: 'Data Science', icon: 'BarChart' }
];

const difficulties = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' }
];

function MainFeature() {
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
      <div className="mb-8 space-y-6">
        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5'
                }`}
              >
                <ApperIcon name={category.icon} size={16} />
                <span className="font-medium">{category.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Difficulty Level</h3>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <motion.button
                key={difficulty.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                  selectedDifficulty === difficulty.id
                    ? 'bg-secondary text-white border-secondary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-secondary hover:bg-secondary/5'
                }`}
              >
                <span className="font-medium">{difficulty.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No courses found" : "No courses available"}
          description={searchQuery ? 
            "Try adjusting your search terms or filters" : 
            "Check back soon for new courses"
          }
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedCategory('all');
            setSelectedDifficulty('all');
            navigate('/');
          }}
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
              <CourseCard 
                course={course} 
                onClick={() => handleCourseClick(course.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default MainFeature;