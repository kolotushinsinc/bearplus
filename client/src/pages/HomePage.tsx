import * as React from 'react';
import { useAppSelector } from '../hooks/redux';
import ShippingCalculator from '../components/ShippingCalculator';
import NewsSection from '../components/NewsSection';
import VideoSection from '../components/VideoSection';
import TariffBlocks from '../components/TariffBlocks';
import CompanyInfoBlock from '../components/CompanyInfoBlock';
import HelpBlock from '../components/HelpBlock';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="py-12 space-y-20 tech-container">
      {/* Modern Hero Section */}
      <section className="text-center mb-16 animate-fade-in">
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Добро пожаловать в <span className="text-gradient">BearPlus</span>
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tech-primary/5 to-transparent blur-3xl"></div>
        </div>
        <p className="text-lg text-tech-text-secondary mb-12 max-w-4xl mx-auto leading-relaxed">
          Профессиональная логистическая платформа для международных перевозок.
          Рассчитайте стоимость доставки, отследите груз и управляйте логистикой в одном месте.
        </p>
      </section>

      {/* Shipping Calculator */}
      <section id="calculator">
        <ShippingCalculator />
      </section>

      {/* News and Video sections - position depends on authentication */}
      {!isAuthenticated && (
        <>
          <section>
            <NewsSection isAuthenticated={isAuthenticated} />
          </section>
          
          <section>
            <VideoSection isAuthenticated={isAuthenticated} />
          </section>
        </>
      )}

      {/* Tariff Blocks */}
      <section>
        <TariffBlocks />
      </section>

      {/* Company Info Block */}
      <section>
        <CompanyInfoBlock />
      </section>

      {/* Help Block */}
      <section>
        <HelpBlock />
      </section>

      {/* News and Video sections for authenticated users - moved lower */}
      {isAuthenticated && (
        <>
          <section>
            <NewsSection isAuthenticated={isAuthenticated} />
          </section>
          
          <section>
            <VideoSection isAuthenticated={isAuthenticated} />
          </section>
        </>
      )}

      {/* Modern CTA Section */}
      <section className="text-center animate-fade-in">
        <div className="card max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-tech-primary/5 via-transparent to-tech-secondary/5"></div>
          <div className="relative z-10">
            <h2 className="text-tech-title mb-6">
              Готовы начать работу с BearPlus?
            </h2>
            <p className="text-tech-body mb-10 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам компаний, которые доверяют нам свою логистику.
              Получите персональную консультацию и специальные условия.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
              {!isAuthenticated ? (
                <>
                  <a href="/register" className="btn-primary btn-sm">
                    ✨ Начать работу
                  </a>
                  <button className="btn-secondary btn-sm">
                    📞 Получить демо
                  </button>
                </>
              ) : (
                <>
                  <a href="/dashboard" className="btn-primary btn-sm">
                    🏠 Кабинет
                  </a>
                  <button className="btn-secondary btn-sm">
                    ➕ Создать заявку
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modern Statistics Section */}
      <section className="animate-slide-up">
        <div className="text-center mb-12">
          <h2 className="text-tech-title mb-4">BearPlus в цифрах</h2>
          <p className="text-tech-body max-w-2xl mx-auto">
            Наши достижения говорят сами за себя
          </p>
        </div>
        <div className="grid tech-grid-4 gap-6">
          <div className="card card-interactive text-center group">
            <div className="text-3xl font-bold text-gradient mb-3 group-hover:animate-pulse-glow">500+</div>
            <div className="text-tech-caption font-medium">Активных маршрутов</div>
            <div className="text-tech-text-muted text-xs mt-1">по всему миру</div>
          </div>
          <div className="card card-interactive text-center group">
            <div className="text-3xl font-bold text-gradient mb-3 group-hover:animate-pulse-glow">50+</div>
            <div className="text-tech-caption font-medium">Портов</div>
            <div className="text-tech-text-muted text-xs mt-1">в нашей сети</div>
          </div>
          <div className="card card-interactive text-center group">
            <div className="text-3xl font-bold text-gradient mb-3 group-hover:animate-pulse-glow">10,000+</div>
            <div className="text-tech-caption font-medium">Доставленных грузов</div>
            <div className="text-tech-text-muted text-xs mt-1">за последний год</div>
          </div>
          <div className="card card-interactive text-center group">
            <div className="text-3xl font-bold text-gradient mb-3 group-hover:animate-pulse-glow">98%</div>
            <div className="text-tech-caption font-medium">Довольных клиентов</div>
            <div className="text-tech-text-muted text-xs mt-1">рекомендуют нас</div>
          </div>
        </div>
      </section>

      {/* Modern Trust Section */}
      <section className="card bg-tech-surface border-tech-border-light relative overflow-hidden animate-slide-in-left">
        <div className="absolute inset-0 bg-gradient-to-br from-tech-primary/8 via-transparent to-tech-secondary/8"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-tech-title mb-10">Нам доверяют</h2>
          <div className="grid tech-grid-3 gap-8">
            <div className="text-center group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">🏆</div>
              <h3 className="text-tech-subtitle text-gradient mb-3">Сертификаты качества</h3>
              <p className="text-tech-caption">ISO 9001:2015, FIATA, Российский Союз Экспедиторов</p>
            </div>
            <div className="text-center group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">🛡️</div>
              <h3 className="text-tech-subtitle text-gradient mb-3">100% страхование</h3>
              <p className="text-tech-caption">Полное страхование грузов и ответственности перевозчика</p>
            </div>
            <div className="text-center group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h3 className="text-tech-subtitle text-gradient mb-3">24/7 поддержка</h3>
              <p className="text-tech-caption">Круглосуточная техническая поддержка и оперативное реагирование</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern News Section */}
      <section className="card animate-slide-up">
        <div className="text-center mb-10">
          <h2 className="text-tech-title mb-4">Последние обновления</h2>
          <p className="text-tech-body max-w-2xl mx-auto">
            Следите за новостями логистической отрасли и обновлениями платформы
          </p>
        </div>
        <div className="grid tech-grid-3 gap-6">
          <div className="card-interactive bg-tech-surface p-6 border border-tech-border group">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-tech-primary rounded-full"></div>
              <div className="text-tech-mono text-tech-primary">15.01.2024</div>
            </div>
            <h3 className="text-tech-subtitle text-white mb-3 group-hover:text-gradient transition-colors">
              Новые маршруты в Европу
            </h3>
            <p className="text-tech-caption mb-6">
              Запущены прямые контейнерные линии из Владивостока в порты Северной Европы.
            </p>
            <button className="btn-secondary btn-xs">
              Читать далее →
            </button>
          </div>
          <div className="card-interactive bg-tech-surface p-6 border border-tech-border group">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-tech-secondary rounded-full"></div>
              <div className="text-tech-mono text-tech-secondary">10.01.2024</div>
            </div>
            <h3 className="text-tech-subtitle text-white mb-3 group-hover:text-gradient transition-colors">
              Обновление платформы
            </h3>
            <p className="text-tech-caption mb-6">
              Улучшенный интерфейс калькулятора и новые возможности отслеживания грузов.
            </p>
            <button className="btn-secondary btn-xs">
              Читать далее →
            </button>
          </div>
          <div className="card-interactive bg-tech-surface p-6 border border-tech-border group">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-tech-accent rounded-full"></div>
              <div className="text-tech-mono text-tech-accent">05.01.2024</div>
            </div>
            <h3 className="text-tech-subtitle text-white mb-3 group-hover:text-gradient transition-colors">
              Льготные тарифы на ЖД
            </h3>
            <p className="text-tech-caption mb-6">
              Специальные предложения по железнодорожным перевозкам на направлении Восток-Запад.
            </p>
            <button className="btn-secondary btn-xs">
              Читать далее →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;