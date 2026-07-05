import React from 'react';
import { Input } from '../../components/ui/Input';

interface SummaryStepProps {
  service: string;
  price: number;
  barber: string;
  dateFormatted: string;
  time: string;
  duration: number;
  name: string;
  phone: string;
  onNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  nameError: string | null;
  phoneError: string | null;
  isSubmitting?: boolean;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  service,
  price,
  barber,
  dateFormatted,
  time,
  duration,
  name,
  phone,
  onNameChange,
  onPhoneChange,
  nameError,
  phoneError,
  isSubmitting = false
}) => {
  return (
    <div className="booking-step">
      <h3 className="booking-step__title">Resumo & Seus Dados</h3>
      
      <div className="summary-box" style={{ marginBottom: '24px' }}>
        <div className="summary-row">
          <span>Serviço:</span>
          <strong>{service} (R$ {price})</strong>
        </div>
        <div className="summary-row">
          <span>Barbeiro:</span>
          <strong>{barber}</strong>
        </div>
        <div className="summary-row">
          <span>Data:</span>
          <strong>{dateFormatted}</strong>
        </div>
        <div className="summary-row">
          <span>Horário:</span>
          <strong>{time} ({duration} min)</strong>
        </div>
      </div>

      <div className="client-info-fields" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--color-gold)', fontFamily: 'var(--font-titles)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Identificação para o Agendamento:
        </h4>
        
        <Input
          label="Nome Completo *"
          type="text"
          placeholder="Seu nome completo..."
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          error={nameError}
          disabled={isSubmitting}
          required
        />

        <Input
          label="WhatsApp (DDD + Número) *"
          type="tel"
          placeholder="(11) 99999-9999"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          error={phoneError}
          disabled={isSubmitting}
          required
        />
      </div>

      <p className="summary-note" style={{ marginTop: '20px' }}>
        Ao confirmar, o agendamento será salvo no banco de dados e o barbeiro receberá os seus dados de contato.
      </p>
    </div>
  );
};
export default SummaryStep;
