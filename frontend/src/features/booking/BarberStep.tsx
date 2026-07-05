import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { barbersList } from './constants';

interface BarberStepProps {
  selectedBarber: string;
  onSelectBarber: (name: string) => void;
}

export const BarberStep: React.FC<BarberStepProps> = ({
  selectedBarber,
  onSelectBarber,
}) => {
  return (
    <div className="booking-step">
      <h3 className="booking-step__title">Selecione o Barbeiro</h3>
      <div className="barbers-list">
        {barbersList.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`barber-card ${selectedBarber === item.name ? 'selected' : ''}`}
            onClick={() => onSelectBarber(item.name)}
            style={{ width: '100%', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer' }}
            aria-pressed={selectedBarber === item.name}
          >
            {item.avatar ? (
              <img src={item.avatar} alt={item.name} className="barber-card__avatar" />
            ) : (
              <div className="barber-card__avatar barber-card__avatar--any">
                <UserIcon size={32} />
              </div>
            )}
            <h4>{item.name}</h4>
            <p>{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
export default BarberStep;
