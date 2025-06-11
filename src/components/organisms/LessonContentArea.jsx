import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import VideoPlayerComponent from '@/components/organisms/VideoPlayerComponent';
import QuizFlow from '@/components/organisms/QuizFlow';
import ProgressBar from '@/components/molecules/ProgressBar';
import Button from '@/components/atoms/Button';

const LessonContentArea = ({ 
    currentLesson, 
    videoProgress, 
    showQuiz, 
    progress, 
    courseId,
    onVideoProgress, 
    onVideoComplete, 
    onQuizComplete, 
    onNextLesson, 
    onBackToCourse,
    onTakeQuizClick
}) => {
    return (
        <div className="flex-1 overflow-y-auto">
<div className="p-8">
                {/* Lesson Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-heading font-bold text-gray-900">
                            {currentLesson.title}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                Progress: {Math.round(videoProgress)}%
                            </span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <ProgressBar progress={videoProgress} />
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-600">
                        {Math.round(currentLesson.duration / 60)} minutes • 
                        {currentLesson.quiz ? ' Quiz included' : ' No quiz'}
                    </p>
                </div>

                {/* Lesson Content */}
                {currentLesson.content && (
                    <div className="mb-8 bg-gray-50 rounded-lg p-6">
                        <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6">
                            Lesson Content
                        </h2>
                        
                        {/* Learning Objectives */}
                        {currentLesson.content.objectives && (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    Learning Objectives
                                </h3>
                                <ul className="space-y-2">
                                    {currentLesson.content.objectives.map((objective, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                            <span className="text-gray-700">{objective}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Key Points */}
                        {currentLesson.content.keyPoints && (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    Key Points
                                </h3>
                                <ul className="space-y-2">
                                    {currentLesson.content.keyPoints.map((point, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                                            <span className="text-gray-700">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Detailed Content */}
                        {currentLesson.content.detailedContent && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    Detailed Explanation
                                </h3>
                                <div className="prose prose-gray max-w-none">
                                    {currentLesson.content.detailedContent.split('\n\n').map((paragraph, index) => (
                                        <p key={index} className="text-gray-700 leading-relaxed mb-4">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Video or Quiz Content */}
                {showQuiz && currentLesson.quiz ? (
                    <QuizFlow
                        quiz={currentLesson.quiz}
                        onComplete={onQuizComplete}
                    />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                        <div className="aspect-video">
                            <VideoPlayerComponent
                                videoUrl={currentLesson.videoUrl}
                                onProgress={onVideoProgress}
                                onComplete={onVideoComplete}
                                initialProgress={videoProgress}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Lesson Navigation */}
                <div className="mt-8 flex justify-between items-center">
                    <Button
                        onClick={onBackToCourse}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900"
                        icon={<ApperIcon name="ArrowLeft" size={16} />}
                    >
                        Back to Course
                    </Button>

                    <div className="flex items-center space-x-4">
                        {currentLesson.quiz && !showQuiz && progress?.completedLessons?.includes(currentLesson.id) && (
                            <Button
                                onClick={onTakeQuizClick}
                                className="px-4 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90"
                            >
                                Take Quiz
                            </Button>
                        )}
                        
                        <Button
                            onClick={onNextLesson}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                            icon={<ApperIcon name="ArrowRight" size={16} />}
                            iconPosition="right"
                        >
                            Next Lesson
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonContentArea;