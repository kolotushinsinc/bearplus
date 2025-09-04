import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'logistics' | 'shipping' | 'customs' | 'company' | 'industry';
  imageUrl?: string;
  publishedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  readTime: number; // in minutes
  tags: string[];
  featured: boolean;
}

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      
      // Mock news data - replace with API call
      const mockNews: NewsArticle[] = [
        {
          id: '1',
          title: 'Новые тарифы на морские перевозки из Китая в Россию',
          excerpt: 'С 1 февраля 2024 года вступают в силу обновленные тарифы на контейнерные перевозки. Снижение стоимости до 15% на популярных маршрутах.',
          content: 'Полный текст новости...',
          category: 'shipping',
          imageUrl: '/images/news/shipping-rates.jpg',
          publishedAt: '2024-01-16T10:00:00Z',
          author: {
            name: 'Анна Петрова',
            avatar: '/avatars/anna.jpg'
          },
          readTime: 3,
          tags: ['тарифы', 'морские перевозки', 'Китай'],
          featured: true
        },
        {
          id: '2',
          title: 'Изменения в таможенном законодательстве РФ',
          excerpt: 'Правительство утвердило новые правила таможенного оформления, которые упростят процедуры для малого и среднего бизнеса.',
          content: 'Полный текст новости...',
          category: 'customs',
          imageUrl: '/images/news/customs-changes.jpg',
          publishedAt: '2024-01-15T14:30:00Z',
          author: {
            name: 'Михаил Сидоров',
            avatar: '/avatars/mikhail.jpg'
          },
          readTime: 5,
          tags: ['таможня', 'законодательство', 'бизнес'],
          featured: false
        },
        {
          id: '3',
          title: 'BearPlus расширяет сеть складских комплексов',
          excerpt: 'Открытие нового логистического центра в Санкт-Петербурге площадью 25,000 кв.м. с современным оборудованием.',
          content: 'Полный текст новости...',
          category: 'company',
          imageUrl: '/images/news/warehouse-expansion.jpg',
          publishedAt: '2024-01-14T16:00:00Z',
          author: {
            name: 'Екатерина Иванова',
            avatar: '/avatars/ekaterina.jpg'
          },
          readTime: 4,
          tags: ['складские услуги', 'расширение', 'Санкт-Петербург'],
          featured: true
        },
        {
          id: '4',
          title: 'Тенденции рынка логистики в 2024 году',
          excerpt: 'Аналитический обзор ключевых трендов: цифровизация, экологичность и оптимизация цепей поставок.',
          content: 'Полный текст новости...',
          category: 'industry',
          imageUrl: '/images/news/logistics-trends.jpg',
          publishedAt: '2024-01-12T09:15:00Z',
          author: {
            name: 'Дмитрий Козлов',
            avatar: '/avatars/dmitry.jpg'
          },
          readTime: 7,
          tags: ['аналитика', 'тренды', 'логистика'],
          featured: false
        },
        {
          id: '5',
          title: 'Новый сервис отслеживания грузов в реальном времени',
          excerpt: 'Запуск инновационной системы GPS-мониторинга для всех видов перевозок с детальной аналитикой.',
          content: 'Полный текст новости...',
          category: 'logistics',
          imageUrl: '/images/news/gps-tracking.jpg',
          publishedAt: '2024-01-10T11:45:00Z',
          author: {
            name: 'Алексей Морозов',
            avatar: '/avatars/alexey.jpg'
          },
          readTime: 6,
          tags: ['технологии', 'отслеживание', 'GPS'],
          featured: false
        }
      ];

      setTimeout(() => {
        setNews(mockNews);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching news:', error);
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Все новости', icon: '📰' },
    { id: 'logistics', name: 'Логистика', icon: '📦' },
    { id: 'shipping', name: 'Перевозки', icon: '🚢' },
    { id: 'customs', name: 'Таможня', icon: '📋' },
    { id: 'company', name: 'Компания', icon: '🏢' },
    { id: 'industry', name: 'Отрасль', icon: '🏭' }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(article => article.category === selectedCategory);

  const featuredNews = news.filter(article => article.featured);
  const regularNews = filteredNews.filter(article => !article.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryName = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.name : category;
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : '📰';
  };

  return (
    <section className="bg-bearplus-bg py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Новости и статьи
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Актуальная информация о логистике, изменениях в отрасли и деятельности нашей компании
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-bearplus-green text-black font-semibold'
                  : 'bg-bearplus-card text-gray-300 hover:bg-bearplus-card-hover'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bearplus-green"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured News */}
            {selectedCategory === 'all' && featuredNews.length > 0 && (
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-white mb-6">Рекомендуемые</h3>
                <div className="space-y-6">
                  {featuredNews.map((article) => (
                    <article
                      key={article.id}
                      className="bg-bearplus-card rounded-xl overflow-hidden hover:bg-bearplus-card-hover transition-colors group"
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <div className="h-48 md:h-full bg-gray-700 relative overflow-hidden">
                            {article.imageUrl ? (
                              <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">
                                {getCategoryIcon(article.category)}
                              </div>
                            )}
                            <div className="absolute top-4 left-4">
                              <span className="bg-bearplus-green text-black text-xs font-semibold px-3 py-1 rounded-full">
                                {getCategoryName(article.category)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center text-sm text-gray-400 mb-3">
                            <span>{formatDate(article.publishedAt)}</span>
                            <span className="mx-2">•</span>
                            <span>{article.readTime} мин чтения</span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-bearplus-green transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-400 mb-4 line-clamp-3">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                {article.author.avatar ? (
                                  <img
                                    src={article.author.avatar}
                                    alt={article.author.name}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs">{article.author.name[0]}</span>
                                )}
                              </div>
                              <span className="text-sm text-gray-400">{article.author.name}</span>
                            </div>
                            <Link
                              to={`/news/${article.id}`}
                              className="text-bearplus-green hover:text-bearplus-green/80 text-sm font-medium"
                            >
                              Читать далее →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Regular News */}
            <div className={selectedCategory === 'all' ? 'lg:col-span-1' : 'lg:col-span-3'}>
              <h3 className="text-2xl font-bold text-white mb-6">
                {selectedCategory === 'all' ? 'Последние новости' : getCategoryName(selectedCategory)}
              </h3>
              <div className={`grid gap-6 ${selectedCategory === 'all' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {(selectedCategory === 'all' ? regularNews : filteredNews).map((article) => (
                  <article
                    key={article.id}
                    className="bg-bearplus-card rounded-xl overflow-hidden hover:bg-bearplus-card-hover transition-colors group"
                  >
                    <div className="h-48 bg-gray-700 relative overflow-hidden">
                      {article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {getCategoryIcon(article.category)}
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-bearplus-green text-black text-xs font-semibold px-3 py-1 rounded-full">
                          {getCategoryName(article.category)}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-400 mb-3">
                        <span>{formatDate(article.publishedAt)}</span>
                        <span className="mx-2">•</span>
                        <span>{article.readTime} мин</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-bearplus-green transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                            {article.author.avatar ? (
                              <img
                                src={article.author.avatar}
                                alt={article.author.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-xs">{article.author.name[0]}</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">{article.author.name}</span>
                        </div>
                        <Link
                          to={`/news/${article.id}`}
                          className="text-bearplus-green hover:text-bearplus-green/80 text-sm font-medium"
                        >
                          →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link
            to="/news"
            className="inline-flex items-center px-8 py-4 bg-bearplus-green text-black font-semibold rounded-lg hover:bg-bearplus-green/90 transition-colors"
          >
            <span>Все новости</span>
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;