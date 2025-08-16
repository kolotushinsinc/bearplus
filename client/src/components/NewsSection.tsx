import * as React from 'react';
import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  publishedAt: string;
  category: 'shipping' | 'logistics' | 'regulations' | 'company';
  isImportant: boolean;
}

interface NewsSectionProps {
  className?: string;
  isAuthenticated?: boolean;
}

const NewsSection: React.FC<NewsSectionProps> = ({ className = '', isAuthenticated = false }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'Все новости' },
    { value: 'shipping', label: 'Морские перевозки' },
    { value: 'logistics', label: 'Логистика' },
    { value: 'regulations', label: 'Регулирование' },
    { value: 'company', label: 'Компания' }
  ];

  const categoryColors = {
    shipping: 'bg-blue-600',
    logistics: 'bg-green-600',
    regulations: 'bg-yellow-600',
    company: 'bg-purple-600'
  };

  // Mock news data - replace with API call
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'Новые тарифы на морские перевозки в 2024 году',
        excerpt: 'Обновленные тарифы на контейнерные перевозки по основным направлениям. Снижение стоимости на 15%.',
        content: 'Подробная информация о новых тарифах...',
        imageUrl: '/images/news/shipping-rates.jpg',
        publishedAt: '2024-01-15T10:00:00Z',
        category: 'shipping',
        isImportant: true
      },
      {
        id: '2',
        title: 'Расширение сети партнеров в Азии',
        excerpt: 'Bearplus заключил новые партнерские соглашения с крупными логистическими компаниями в Китае и Японии.',
        content: 'Детали партнерских соглашений...',
        imageUrl: '/images/news/asia-expansion.jpg',
        publishedAt: '2024-01-10T14:30:00Z',
        category: 'company',
        isImportant: false
      },
      {
        id: '3',
        title: 'Новые требования к перевозке опасных грузов',
        excerpt: 'Вступили в силу обновленные международные требования IMDG Code для морских перевозок опасных грузов.',
        content: 'Полный текст новых требований...',
        publishedAt: '2024-01-08T09:15:00Z',
        category: 'regulations',
        isImportant: true
      },
      {
        id: '4',
        title: 'Цифровизация процессов логистики',
        excerpt: 'Внедрение новых цифровых решений для оптимизации логистических процессов и повышения прозрачности.',
        content: 'Описание цифровых решений...',
        publishedAt: '2024-01-05T16:45:00Z',
        category: 'logistics',
        isImportant: false
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setNews(mockNews);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || 'bg-gray-600';
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl font-bold text-white mb-6">Новости</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Новости</h2>
        
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
        {filteredNews.map((item) => (
          <article key={item.id} className="card hover:shadow-glow-sm transition-all duration-300 cursor-pointer group">
            {/* Important Badge */}
            {item.isImportant && (
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Важно
                </span>
              </div>
            )}

            {/* Image */}
            {item.imageUrl ? (
              <div className="h-48 bg-gray-700 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-bearplus-green/20 to-bearplus-green/5 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-bearplus-green/50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Category Badge */}
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(item.category)}`}>
                {categories.find(cat => cat.value === item.category)?.label}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-bearplus-green transition-colors duration-200">
              {item.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
              {item.excerpt}
            </p>

            {/* Date */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {formatDate(item.publishedAt)}
              </span>
              <button className="text-bearplus-green hover:text-bearplus-green/80 text-sm font-medium">
                Читать далее →
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      {filteredNews.length > 6 && (
        <div className="text-center mt-8">
          <button className="btn-secondary">
            Загрузить еще новости
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredNews.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-400 mb-2">Новостей не найдено</h3>
          <p className="text-gray-500">В выбранной категории пока нет новостей</p>
        </div>
      )}
    </div>
  );
};

export default NewsSection;