import * as React from 'react';
import { useState, useRef } from 'react';

interface VideoInstructionBlockProps {
  className?: string;
}

const VideoInstructionBlock: React.FC<VideoInstructionBlockProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Видео инструкция</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Подробное руководство по работе с платформой BearPlus
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="card p-8">
          {/* Video Container */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
            <video
              ref={videoRef}
              className="w-full h-full"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              poster="/images/video-poster.jpg"
            >
              <source src="/videos/bearplus-instruction.mp4" type="video/mp4" />
              <div className="flex items-center justify-center h-full bg-gray-800">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎥</div>
                  <p className="text-gray-400">Видео скоро будет доступно</p>
                </div>
              </div>
            </video>
            
            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer hover:bg-black/50 transition-colors"
                onClick={handlePlayPause}
              >
                <div className="w-20 h-20 bg-bearplus-green rounded-full flex items-center justify-center hover:bg-bearplus-green/90 transition-colors">
                  <svg className="w-10 h-10 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 min-w-[40px]">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #00ff88 0%, #00ff88 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
                }}
              />
              <span className="text-sm text-gray-400 min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={handlePlayPause}
                className="flex items-center justify-center w-12 h-12 bg-bearplus-green rounded-full hover:bg-bearplus-green/90 transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <div className="text-sm text-gray-400">
                Воспроизведение • Пауза • Перемотка
              </div>
            </div>
          </div>

          {/* Video Description */}
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-3">
              Полное руководство по работе с BearPlus
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
              В этом видео вы узнаете, как эффективно использовать все возможности платформы: 
              от регистрации и расчета стоимости до отслеживания груза и работы с документами.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default VideoInstructionBlock;