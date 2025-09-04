import * as React from 'react';
import { useState } from 'react';

interface VideoContent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  category: 'tutorial' | 'company' | 'services' | 'testimonial';
  publishedAt: string;
  views: number;
}

const VideoSection: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const videos: VideoContent[] = [
    {
      id: '1',
      title: 'Как оформить заказ на BearPlus',
      description: 'Пошаговое руководство по созданию заказа на международную перевозку через нашу платформу.',
      thumbnailUrl: '/images/videos/tutorial-order.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '5:42',
      category: 'tutorial',
      publishedAt: '2024-01-15T10:00:00Z',
      views: 2450
    },
    {
      id: '2',
      title: 'BearPlus - ваш надежный логистический партнер',
      description: 'Презентация компании и наших основных услуг в сфере международной логистики.',
      thumbnailUrl: '/images/videos/company-intro.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '3:18',
      category: 'company',
      publishedAt: '2024-01-10T14:30:00Z',
      views: 5680
    },
    {
      id: '3',
      title: 'Отзыв клиента: ООО "Торговый дом"',
      description: 'Руководитель компании рассказывает о сотрудничестве с BearPlus и полученных результатах.',
      thumbnailUrl: '/images/videos/testimonial-1.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '4:25',
      category: 'testimonial',
      publishedAt: '2024-01-08T16:45:00Z',
      views: 1890
    },
    {
      id: '4',
      title: 'Таможенное оформление: что нужно знать',
      description: 'Подробный разбор процесса таможенного оформления и необходимых документов.',
      thumbnailUrl: '/images/videos/customs-guide.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '7:33',
      category: 'tutorial',
      publishedAt: '2024-01-05T11:20:00Z',
      views: 3250
    },
    {
      id: '5',
      title: 'Наши складские комплексы',
      description: 'Экскурсия по современным складским комплексам BearPlus с обзором оборудования.',
      thumbnailUrl: '/images/videos/warehouse-tour.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '6:12',
      category: 'services',
      publishedAt: '2024-01-03T09:15:00Z',
      views: 4120
    },
    {
      id: '6',
      title: 'Отслеживание грузов в реальном времени',
      description: 'Демонстрация системы GPS-мониторинга и возможностей отслеживания ваших грузов.',
      thumbnailUrl: '/images/videos/tracking-demo.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '4:47',
      category: 'tutorial',
      publishedAt: '2023-12-28T13:40:00Z',
      views: 2980
    }
  ];

  const featuredVideo = videos[0];
  const otherVideos = videos.slice(1);

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'tutorial': return 'Обучение';
      case 'company': return 'О компании';
      case 'services': return 'Услуги';
      case 'testimonial': return 'Отзывы';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tutorial': return 'bg-blue-600';
      case 'company': return 'bg-purple-600';
      case 'services': return 'bg-green-600';
      case 'testimonial': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const handleVideoClick = (video: VideoContent) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} нед. назад`;
    return `${Math.ceil(diffDays / 30)} мес. назад`;
  };

  return (
    <section className="bg-bearplus-card py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Видео материалы
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Обучающие видео, презентации услуг и отзывы клиентов о работе с BearPlus
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Video */}
          <div className="lg:col-span-2">
            <div className="relative group cursor-pointer" onClick={() => handleVideoClick(featuredVideo)}>
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={featuredVideo.thumbnailUrl || '/images/video-placeholder.jpg'}
                  alt={featuredVideo.title}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                  <div className="w-20 h-20 bg-bearplus-green rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 bg-black/80 text-white text-sm px-2 py-1 rounded">
                  {featuredVideo.duration}
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`${getCategoryColor(featuredVideo.category)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                    {getCategoryName(featuredVideo.category)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-bearplus-green transition-colors">
                  {featuredVideo.title}
                </h3>
                <p className="text-gray-400 mb-3">
                  {featuredVideo.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{formatViews(featuredVideo.views)} просмотров</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(featuredVideo.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Другие видео</h3>
            {otherVideos.map((video) => (
              <div
                key={video.id}
                className="flex space-x-4 p-3 rounded-lg hover:bg-bearplus-card-hover transition-colors cursor-pointer group"
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={video.thumbnailUrl || '/images/video-placeholder.jpg'}
                    alt={video.title}
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                  {/* Mini Play Button */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <div className="w-8 h-8 bg-bearplus-green rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  {/* Duration */}
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    <span className={`${getCategoryColor(video.category)} text-white text-xs font-medium px-2 py-0.5 rounded`}>
                      {getCategoryName(video.category)}
                    </span>
                  </div>
                  <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-bearplus-green transition-colors mb-1">
                    {video.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{formatViews(video.views)}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(video.publishedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <a
            href="https://youtube.com/@bearplus"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>Наш YouTube канал</span>
          </a>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-bearplus-card-dark rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`${getCategoryColor(selectedVideo.category)} text-white text-sm font-medium px-3 py-1 rounded`}>
                    {getCategoryName(selectedVideo.category)}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-2">{selectedVideo.title}</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Video Player */}
              <div className="aspect-video mb-4">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-300">{selectedVideo.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{formatViews(selectedVideo.views)} просмотров</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(selectedVideo.publishedAt)}</span>
                  <span className="mx-2">•</span>
                  <span>Длительность: {selectedVideo.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoSection;