import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/molecules/StatusBadge';
import IconText from '@/components/molecules/IconText';
import Button from '@/components/atoms/Button';

const CertificateItemCard = ({ certificate, onViewCertificate }) => {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                    <StatusBadge label={certificate.category} type="primary" />
                    <StatusBadge label="Completed" type="success" />
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
                    <IconText iconName="Calendar" text={formatDate(certificate.completedDate)} className="text-sm text-gray-600" />
                    <IconText iconName="BarChart" text={certificate.difficulty} className="text-sm text-gray-600" />
                </div>

                <div className="flex space-x-3">
                    <Button
                        onClick={() => onViewCertificate(certificate)}
                        className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                    >
                        View Certificate
                    </Button>
                    
                    <Button
                        onClick={() => navigate(`/courses/${certificate.courseId}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        icon={<ApperIcon name="ExternalLink" size={16} />}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default CertificateItemCard;