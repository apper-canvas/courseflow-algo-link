import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const CertificateStatsOverview = ({ certificates }) => {
    const categoriesMastered = new Set(certificates.map(c => c.category)).size;

    return (
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
                            {categoriesMastered}
                        </h3>
                        <p className="text-white/80">Categories Mastered</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CertificateStatsOverview;