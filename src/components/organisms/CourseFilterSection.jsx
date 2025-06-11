import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

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

const CourseFilterSection = ({ selectedCategory, setSelectedCategory, selectedDifficulty, setSelectedDifficulty }) => {
    return (
        <div className="mb-8 space-y-6">
            {/* Category Filter */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-lg border ${
                                selectedCategory === category.id
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5'
                            }`}
                            icon={<ApperIcon name={category.icon} size={16} />}
                        >
                            <span className="font-medium">{category.label}</span>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Difficulty Filter */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Difficulty Level</h3>
                <div className="flex flex-wrap gap-2">
                    {difficulties.map((difficulty) => (
                        <Button
                            key={difficulty.id}
                            onClick={() => setSelectedDifficulty(difficulty.id)}
                            className={`px-4 py-2 rounded-lg border ${
                                selectedDifficulty === difficulty.id
                                    ? 'bg-secondary text-white border-secondary'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-secondary hover:bg-secondary/5'
                            }`}
                        >
                            <span className="font-medium">{difficulty.label}</span>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseFilterSection;