import * as React from 'react';
import { useState, useEffect } from 'react';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  category: 'tutorial' | 'company' | 'logistics' | 'testimonial';
  publishedAt: string;
  viewCount: number;
}

interface VideoSectionProps {
  className?: string;
  isAuthenticated?: boolean;
}

const VideoSection: React.FC<VideoSectionProps> = ({ className = '', isAuthenticated = false }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'Все видео' },
    { value: 'tutorial', label: 'Обучение' },
    { value: 'company', label: 'О компании' },
    { value: 'logistics', label: 'Логистика' },
    { value: 'testimonial', label: 'Отзывы' }
  ];

  // Mock video data - replace with API call
  useEffect(() => {
    const mockVideos: VideoItem[] = [
      {
        id: '1',
        title: 'Как оформить заявку на морскую перевозку',
        description: 'Пошаговое руководство по оформлению заявки на контейнерные перевозки через платформу Bearplus.',
        thumbnailUrl: '/images/videos/tutorial-1.jpg',
        videoUrl: 'https://example.com/videos/tutorial-1.mp4',
        duration: '5:32',
        category: 'tutorial',
        publishedAt: '2024-01-15T10:00:00Z',
        viewCount: 1250
      },
      {
        id: '2',
        title: 'О компании Bearplus',
        description: 'Узнайте о нашей миссии, ценностях и том, как мы помогаем клиентам в области логистики.',
        thumbnailUrl: '/images/videos/company-intro.jpg',
        videoUrl: 'https://example.com/videos/company-intro.mp4',
        duration: '3:45',
        category: 'company',
        publishedAt: '2024-01-10T14:30:00Z',
        viewCount: 890
      },
      {
        id: '3',
        title: 'Особенности перевозки опасных грузов',
        description: 'Важная информация о требованиях и процедурах при перевозке опасных грузов морским транспортом.',
        thumbnailUrl: '/images/videos/dangerous-cargo.jpg',
        videoUrl: 'https://example.com/videos/dangerous-cargo.mp4',
        duration: '8:15',
        category: 'logistics',
        publishedAt: '2024-01-08T09:15:00Z',
        viewCount: 2100
      },
      {
        id: '4',
        title: 'Отзыв клиента: ООО "ГлобалТрейд"',
        description: 'Директор компании рассказывает о сотрудничестве с Bearplus и результатах работы.',
        thumbnailUrl: '/images/videos/testimonial-1.jpg',
        videoUrl: 'https://example.com/videos/testimonial-1.mp4',
        duration: '2:20',
        category: 'testimonial',
        publishedAt: '2024-01-05T16:45:00Z',
        viewCount: 650
      },
      {
        id: '5',
        title: 'Контейнерные терминалы: выбор и оптимизация',
        description: 'Как правильно выбрать контейнерный терминал и оптимизировать логистические процессы.',
        thumbnailUrl: '/images/videos/terminals.jpg',
        videoUrl: 'https://example.com/videos/terminals.mp4',
        duration: '6:40',
        category: 'logistics',
        publishedAt: '2024-01-03T11:20:00Z',
        viewCount: 1450
      },
      {
        id: '6',
        title: 'Инструктаж по работе с платформой',
        description: 'Полное руководство по использованию всех функций платформы Bearplus для эффективной работы.',
        thumbnailUrl: '/images/videos/platform-guide.jpg',
        videoUrl: 'https://example.com/videos/platform-guide.mp4',
        duration: '12:30',
        category: 'tutorial',
        publishedAt: '2024-01-01T09:00:00Z',
        viewCount: 3200
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setVideos(mockVideos);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleVideoClick = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  const closeVideoPlayer = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl font-bold text-white mb-6">Видеоряд</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="aspect-video bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Видеоряд</h2>
        
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.value
                  ? 'bg-bearplus-green text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div 
            key={video.id} 
            className="card hover:shadow-glow-sm transition-all duration-300 cursor-pointer group"
            onClick={() => handleVideoClick(video)}
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-gray-700 rounded-lg mb-4 overflow-hidden">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-bearplus-green rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                {video.duration}
              </div>
            </div>

            {/* Video Info */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-bearplus-green transition-colors duration-200 line-clamp-2">
              {video.title}
            </h3>

            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {video.description}
            </p>

            {/* Meta Info */}
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{formatViewCount(video.viewCount)} просмотров</span>
              <span>{formatDate(video.publishedAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && isPlaying && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeVideoPlayer}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeVideoPlayer}
              className="absolute -top-12 right-0 text-white hover:text-bearplus-green transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                controls
                autoPlay
                className="w-full h-full"
                poster={selectedVideo.thumbnailUrl}
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Ваш браузер не поддерживает воспроизведение видео.
              </video>
            </div>

            {/* Video Info */}
            <div className="mt-4 text-white">
              <h3 className="text-xl font-bold mb-2">{selectedVideo.title}</h3>
              <p className="text-gray-300">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {filteredVideos.length > 6 && (
        <div className="text-center mt-8">
          <button className="btn-secondary">
            Загрузить еще видео
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredVideos.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-400 mb-2">Видео не найдено</h3>
          <p className="text-gray-500">В выбранной категории пока нет видео</p>
        </div>
      )}
    </div>
  );
};

export default VideoSection;