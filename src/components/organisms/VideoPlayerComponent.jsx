import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/molecules/ProgressBar';
import Button from '@/components/atoms/Button';

const VideoPlayerComponent = ({ videoUrl, onProgress, onComplete, initialProgress = 0 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const total = video.duration;
      setCurrentTime(current);
      
      if (total > 0) {
        const progress = (current / total) * 100;
        onProgress?.(progress);
        
        // Mark as complete when 90% watched
        if (progress >= 90 && current > 0) { // Add current > 0 check to prevent false positives on load
          onComplete?.();
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      // Set initial progress
      if (initialProgress > 0) {
        video.currentTime = (initialProgress / 100) * video.duration;
      }
    };

    const handlePlayPause = () => setIsPlaying(!video.paused);

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlayPause);
    video.addEventListener('pause', handlePlayPause);
    video.addEventListener('ended', handleEnded);


    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlayPause);
      video.removeEventListener('pause', handlePlayPause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete, initialProgress]);

  // Hide controls after a delay
  useEffect(() => {
    if (isPlaying) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000); // Hide after 3 seconds of inactivity
    }
    return () => clearTimeout(controlsTimeoutRef.current);
  }, [isPlaying, showControls]);


  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (clickX / width) * 100;
    const newTime = (percentage / 100) * duration;
    
    videoRef.current.currentTime = newTime;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current.parentElement; // Assuming parent is the container
    if (!document.fullscreenElement) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) { /* Safari */
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) { /* IE11 */
        videoContainer.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleMouseMove = () => {
    setShowControls(true);
    if (isPlaying) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      />
      
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
          >
            {/* Play/Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <Button
                onClick={togglePlay}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                icon={<ApperIcon name={isPlaying ? 'Pause' : 'Play'} size={24} className="text-white ml-1" />}
              />
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
              {/* Progress Bar */}
              <div
                ref={progressRef}
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4 overflow-hidden"
                onClick={handleProgressClick}
              >
                <ProgressBar progress={progressPercentage} barClassName="bg-primary" />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={togglePlay}
                    className="text-white hover:text-primary p-0"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    icon={<ApperIcon name={isPlaying ? 'Pause' : 'Play'} size={20} />}
                  />
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={toggleMute}
                      className="text-white hover:text-primary p-0"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      icon={<ApperIcon name={isMuted ? 'VolumeX' : 'Volume2'} size={20} />}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-white/20 rounded-full appearance-none slider"
                    />
                  </div>
                  
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <Button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-primary p-0"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  icon={<ApperIcon name={isFullscreen ? 'Minimize' : 'Maximize'} size={20} />}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default VideoPlayerComponent;