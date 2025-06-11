import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const InfoStatCard = ({ iconName, iconBgColor, iconColor, value, label, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white rounded-lg p-6 shadow-md"
        >
            <div className="flex items-center">
                <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center`}>
                    <ApperIcon name={iconName} size={24} className={iconColor} />
                </div>
                <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                        {value}
                    </h3>
                    <p className="text-gray-600">{label}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default InfoStatCard;