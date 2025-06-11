import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import IconText from '@/components/molecules/IconText';

const CourseSyllabusSection = ({ modules }) => {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Course Syllabus</h2>
            <div className="space-y-4">
                {modules?.map((module, moduleIndex) => (
                    <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: moduleIndex * 0.1 }}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                                <ApperIcon name="FolderOpen" size={20} className="mr-2 text-primary" />
                                {module.title}
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="space-y-2">
                                {module.lessons?.map((lesson, lessonIndex) => (
                                    <div key={lesson.id} className="flex items-center justify-between py-2">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-500 mr-3">
                                                {lessonIndex + 1}.
                                            </span>
                                            <span className="text-gray-700">{lesson.title}</span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <IconText iconName="Clock" text={`${Math.round(lesson.duration / 60)}m`} />
                                            {lesson.quiz && (
                                                <IconText iconName="HelpCircle" text="Quiz" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CourseSyllabusSection;