import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CertificateDisplayModal from '@/components/organisms/CertificateDisplayModal';
import CertificateStatsOverview from '@/components/organisms/CertificateStatsOverview';
import CertificateItemCard from '@/components/organisms/CertificateItemCard';
import ContentLoader from '@/components/organisms/ContentLoader';
import ErrorDisplay from '@/components/organisms/ErrorDisplay';
import EmptyDisplay from '@/components/organisms/EmptyDisplay';
import { courseService, userProgressService } from '@/services';

const CertificatesPage = () => {
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
          My Certificates
        </h1>
        <p className="text-gray-600">
          Showcase your achievements and completed courses
        </p>
      </div>

      {/* Achievement Stats */}
      {certificates.length > 0 && (
        <CertificateStatsOverview certificates={certificates} />
      )}

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <EmptyDisplay
          title="No certificates earned yet"
          description="Complete courses to earn certificates and showcase your achievements"
          actionLabel="Browse Courses"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <CertificateItemCard
              key={certificate.id}
              certificate={certificate}
              onViewCertificate={handleViewCertificate}
            />
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateDisplayModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        certificate={selectedCertificate}
      />
    </div>
  );
}

export default CertificatesPage;