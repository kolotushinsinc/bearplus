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
    <div className="py-8 space-y-16">
      {/* Hero Section with Calculator */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Добро пожаловать в <span className="text-gradient">BearPlus</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
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

      {/* Call to Action Section */}
      <section className="text-center">
        <div className="card max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Готовы начать работу с BearPlus?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам компаний, которые доверяют нам свою логистику.
            Получите персональную консультацию и специальные условия.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            {!isAuthenticated ? (
              <>
                <a href="/register" className="btn-primary sm:w-auto">
                  Начать работу
                </a>
                <button className="btn-secondary sm:w-auto">
                  Получить демо
                </button>
              </>
            ) : (
              <>
                <a href="/dashboard" className="btn-primary sm:w-auto">
                  Перейти в кабинет
                </a>
                <button className="btn-secondary sm:w-auto">
                  Создать заявку
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-bearplus-green mb-2">500+</div>
            <div className="text-gray-400">Активных маршрутов</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-bearplus-green mb-2">50+</div>
            <div className="text-gray-400">Портов по всему миру</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-bearplus-green mb-2">10,000+</div>
            <div className="text-gray-400">Доставленных грузов</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-bearplus-green mb-2">98%</div>
            <div className="text-gray-400">Довольных клиентов</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;