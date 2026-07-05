import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface SuccessStepProps {
  service: string;
  barber: string;
  dateFormatted: string;
  time: string;
  onReset: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({
  service,
  barber,
  dateFormatted,
  time,
  onReset,
}) => {
  return (
    <div className="booking-success">
      <CheckCircle size={64} className="success-icon" style={{ color: 'var(--color-success)' }} />
      <h3>Agendado com Sucesso!</h3>
      <p>Seu horário foi reservado no banco de dados e o barbeiro já foi notificado.</p>
      
      <div className="summary-box" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <div><strong>{service}</strong></div>
        <div>Barbeiro: {barber}</div>
        <div>Dia: {dateFormatted} às {time}</div>
      </div>
      
      <Button 
        variant="primary" 
        onClick={onReset}
      >
        Novo Agendamento
      </Button>
    </div>
  );
};
export default SuccessStep;
