import React from 'react';
import { servicesList } from './constants';

interface ServiceStepProps {
  selectedService: string;
  onSelectService: (name: string, price: number, duration: number) => void;
}

export const ServiceStep: React.FC<ServiceStepProps> = ({
  selectedService,
  onSelectService,
}) => {
  return (
    <div className="booking-step">
      <h3 className="booking-step__title">Selecione o Serviço</h3>
      <div className="services-list">
        {servicesList.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`service-card ${selectedService === item.name ? 'selected' : ''}`}
            onClick={() => onSelectService(item.name, item.price, item.duration)}
            style={{ textAlign: 'left', width: '100%', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer' }}
            aria-pressed={selectedService === item.name}
          >
            {item.badge && <span className="service-card__badge">{item.badge}</span>}
            <div className="service-card__header">
              <h4>{item.name}</h4>
              <span className="service-card__price">R$ {item.price}</span>
            </div>
            <p>{item.desc}</p>
            <span className="service-card__duration">⏱ {item.duration} min</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default ServiceStep;
