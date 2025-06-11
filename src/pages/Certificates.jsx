import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import CertificateModal from '../components/CertificateModal';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { courseService, userProgressService } from '../services';

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCertificates = async () => {
      setLoading(true);
      setError(null);
      try {
        const allProgress = await userProgressService.getAllProgress();
        const completedCourses = allProgress.filter(progress => progress.certificateEarned);
        
        const certificateData = await Promise.all(
          completedCourses.map(async (progress) => {
            const course = await courseService.getById(progress.courseId);
            return {
              id: `cert-${course.id}`,
              courseId: course.id,
              courseTitle: course.title,
              instructor: course.instructor,
              completedDate: progress.lastAccessed, // In real app, this would be completion date
              thumbnail: course.thumbnail,
              category: course.category,
              difficulty: course.difficulty
            };
          })
        );
        
        setCertificates(certificateData);
      } catch (err) {
        setError(err.message || 'Failed to load certificates');
        toast.error('Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
          My Certificates
        </h1>
        <p className="text-gray-600">
          Showcase your achievements and completed courses
        </p>
      </div>

      {/* Achievement Stats */}
      {certificates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ApperIcon name="Award" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold">{certificates.length}</h3>
                <p className="text-white/80">Certificates Earned</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-accent to-success rounded-lg p-6 text-white"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold">100%</h3>
                <p className="text-white/80">Completion Rate</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-warning to-error rounded-lg p-6 text-white"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ApperIcon name="Star" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold">
                  {new Set(certificates.map(c => c.category)).size}
                </h3>
                <p className="text-white/80">Categories Mastered</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <EmptyState
          title="No certificates earned yet"
          description="Complete courses to earn certificates and showcase your achievements"
          actionLabel="Browse Courses"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={certificate.thumbnail}
                  alt={certificate.courseTitle}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-warning to-yellow-400 rounded-full flex items-center justify-center">
                    <ApperIcon name="Award" size={24} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {certificate.category.charAt(0).toUpperCase() + certificate.category.slice(1)}
                  </span>
                  <span className="text-sm font-medium text-success bg-success/10 px-2 py-1 rounded">
                    Completed
                  </span>
                </div>

                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2 line-clamp-2">
                  {certificate.courseTitle}
                </h3>

                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-3">
                    <ApperIcon name="User" size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {certificate.instructor}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Calendar" size={14} className="mr-1" />
                    {formatDate(certificate.completedDate)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="BarChart" size={14} className="mr-1" />
                    {certificate.difficulty}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewCertificate(certificate)}
                    className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    View Certificate
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/courses/${certificate.courseId}`)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ApperIcon name="ExternalLink" size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        certificate={selectedCertificate}
      />
    </div>
  );
}

export default Certificates;