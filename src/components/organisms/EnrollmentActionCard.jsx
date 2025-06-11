import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EnrollmentActionCard = ({ isEnrolled, enrolling, onEnroll, onStartLearning }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 sticky top-24"
        >
            <div className="text-center mb-6">
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                    Ready to start learning?
                </h3>
                <p className="text-gray-600 mb-6">
                    Join thousands of students already enrolled in this course.
                </p>
                
                {isEnrolled ? (
                    <Button
                        onClick={onStartLearning}
                        className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
                    >
                        Continue Learning
                    </Button>
                ) : (
                    <Button
                        onClick={onEnroll}
                        disabled={enrolling}
                        className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
                    >
                        {enrolling ? 'Enrolling...' : 'Enroll Now - Free'}
                    </Button>
                )}
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">What you'll learn</h4>
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <ApperIcon name="Check" size={16} className="text-success mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Master the fundamentals and advanced concepts</span>
                    </li>
                    <li className="flex items-start">
                        <ApperIcon name="Check" size={16} className="text-success mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Build practical skills through hands-on projects</span>
                    </li>
                    <li className="flex items-start">
                        <ApperIcon name="Check" size={16} className="text-success mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Earn a certificate of completion</span>
                    </li>
                    <li className="flex items-start">
                        <ApperIcon name="Check" size={16} className="text-success mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Learn at your own pace with lifetime access</span>
                    </li>
                </ul>
            </div>
        </motion.div>
    );
};

export default EnrollmentActionCard;