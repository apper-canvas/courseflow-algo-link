import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

function CertificateModal({ isOpen, onClose, certificate }) {
  if (!certificate) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Course Certificate',
        text: `I've completed the ${certificate.courseTitle} course!`,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(
        `I've completed the ${certificate.courseTitle} course! ${window.location.href}`
      );
    }
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    console.log('Download certificate:', certificate);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>

              {/* Certificate Design */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name="Award" size={32} className="text-white" />
                </div>

                <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                  Certificate of Completion
                </h1>

                <p className="text-gray-600 mb-8">
                  This is to certify that you have successfully completed
                </p>

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                    {certificate.courseTitle}
                  </h2>
                  <p className="text-gray-600">
                    Completed on {new Date(certificate.completedDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-8 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ApperIcon name="CheckCircle" size={24} className="text-success" />
                    </div>
                    <p className="text-sm text-gray-600">Course Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ApperIcon name="Star" size={24} className="text-info" />
                    </div>
                    <p className="text-sm text-gray-600">Skills Gained</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ApperIcon name="Trophy" size={24} className="text-accent" />
                    </div>
                    <p className="text-sm text-gray-600">Achievement Unlocked</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <ApperIcon name="Download" size={18} />
                    <span>Download Certificate</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                  >
                    <ApperIcon name="Share2" size={18} />
                    <span>Share Achievement</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CertificateModal;