import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/molecules/ProgressBar';

const ModuleHeader = ({ title, progress }) => {
    return (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center">
                    <ApperIcon name="FolderOpen" size={20} className="mr-2 text-primary" />
                    {title}
                </h3>
                <span className="text-sm text-gray-500">
                    {progress}%
                </span>
            </div>
            <ProgressBar progress={progress} barClassName="bg-accent" />
        </div>
    );
};

export default ModuleHeader;