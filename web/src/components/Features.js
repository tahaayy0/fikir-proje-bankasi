import React from 'react';

const Features = () => {
  const features = [
    {
      icon: 'fas fa-lightbulb',
      title: 'Fikir Topluyoruz',
      description: 'Yaratıcı fikirlerinizi dinliyor ve değerlendiriyoruz.'
    },
    {
      icon: 'fas fa-users',
      title: 'Topluluk Oylaması',
      description: 'Fikirleriniz topluluk tarafından oylanır ve desteklenir.'
    },
    {
      icon: 'fas fa-cogs',
      title: 'Projeye Dönüştürüyoruz',
      description: 'Onaylanan fikirlerinizi somut projelere dönüştürüyoruz.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Takip Sistemi',
      description: 'Başvurunuzun durumunu gerçek zamanlı takip edin.'
    },
    {
      icon: 'fas fa-handshake',
      title: 'Destek ve Mentorluk',
      description: 'Projelerinizi desteklemek için gerekli kaynakları sağlıyoruz.'
    },
    {
      icon: 'fas fa-trophy',
      title: 'Öne Çıkan Fikirler',
      description: 'En çok oy alan fikirler öne çıkarılır ve desteklenir.'
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title">Nasıl Çalışır?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 