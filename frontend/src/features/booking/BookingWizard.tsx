import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { AppointmentService } from '../../services/appointment.service';
import { validateName, validatePhone } from '../../utils/validators';
import { maskPhone } from '../../utils/masks';
import { ServiceStep } from './ServiceStep';
import { BarberStep } from './BarberStep';
import { ScheduleStep } from './ScheduleStep';
import { SummaryStep } from './SummaryStep';
import { SuccessStep } from './SuccessStep';
import { Button } from '../../components/ui/Button';

interface DayItem {
  iso: string;
  formatted: string;
  week: string;
  num: number;
  mes: string;
}

export const BookingWizard: React.FC = () => {
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  
  // Passos do Wizard (1 a 4)
  const [step, setStep] = useState(1);
  const maxSteps = 4;

  // Estados das seleções
  const [service, setService] = useState('');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(0);
  const [barber, setBarber] = useState('');
  const [date, setDate] = useState('');
  const [dateFormatted, setDateFormatted] = useState('');
  const [time, setTime] = useState('');

  // Estados de identificação do cliente (para o agendamento público sem login)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Estados de carga e dados do Calendário
  const [daysList, setDaysList] = useState<DayItem[]>([]);
  const [hoursList, setHoursList] = useState<string[]>([]);
  const [loadingHours, setLoadingHours] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Se houver um usuário logado (ex. admin testando ou um usuário antigo), autopreenche os campos de dados
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(maskPhone(user.phone));
    }
  }, [user]);

  // Inicializa o calendário semanal (Terça a Sábado) no mount
  useEffect(() => {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    let diasGerados = 0;
    const dataAtual = new Date();
    const tempDays: DayItem[] = [];
    
    // Se hoje for Domingo (0) ou Segunda (1), avança para Terça (2)
    if (dataAtual.getDay() === 0) {
      dataAtual.setDate(dataAtual.getDate() + 2);
    } else if (dataAtual.getDay() === 1) {
      dataAtual.setDate(dataAtual.getDate() + 1);
    }
    
    while (diasGerados < 5) {
      const diaSemanaIndex = dataAtual.getDay();
      
      // Apenas Terça (2) a Sábado (6)
      if (diaSemanaIndex >= 2 && diaSemanaIndex <= 6) {
        const diaNum = dataAtual.getDate();
        const diaSemanaTexto = diasSemana[diaSemanaIndex];
        const mesTexto = meses[dataAtual.getMonth()];
        
        const ano = dataAtual.getFullYear();
        const mesStr = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const diaStr = String(diaNum).padStart(2, '0');
        const dataIso = `${ano}-${mesStr}-${diaStr}`;
        
        tempDays.push({
          iso: dataIso,
          formatted: `${diaSemanaTexto}, ${diaNum} de ${mesTexto}`,
          week: diaSemanaTexto,
          num: diaNum,
          mes: mesTexto
        });
        diasGerados++;
      }
      
      dataAtual.setDate(dataAtual.getDate() + 1);
    }
    
    setDaysList(tempDays);
  }, []);

  // Simulação de requisição de horários ocupados com efeito Skeleton
  const handleSelectDay = useCallback((dayIso: string, formatted: string) => {
    setDate(dayIso);
    setDateFormatted(formatted);
    setTime(''); // Reseta horário anterior
    setLoadingHours(true);

    const baseHours = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
    ];

    setTimeout(() => {
      const seed = parseInt(dayIso.replace(/-/g, ''), 10);
      const filteredHours = baseHours.filter((_, idx) => {
        const pseudoRandom = Math.sin(seed + idx) * 10000;
        return (pseudoRandom - Math.floor(pseudoRandom)) <= 0.65;
      });
      setHoursList(filteredHours);
      setLoadingHours(false);
    }, 450);
  }, []);

  const handleServiceSelect = useCallback((name: string, priceVal: number, durationVal: number) => {
    setService(name);
    setPrice(priceVal);
    setDuration(durationVal);
    setTimeout(() => setStep(2), 300);
  }, []);

  const handleBarberSelect = useCallback((name: string) => {
    setBarber(name);
    setTimeout(() => setStep(3), 300);
  }, []);

  const handleBookingSubmit = async () => {
    // Validações dos campos de identificação (Passo 4)
    const activeNameError = validateName(name);
    const activePhoneError = validatePhone(phone);

    if (activeNameError || activePhoneError) {
      setNameError(activeNameError);
      setPhoneError(activePhoneError);
      showToast('Por favor, preencha os seus dados corretamente.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const dateObj = new Date(date);
      
      // Envia os dados do agendamento com nome e telefone limpos para a API pública
      await AppointmentService.create({
        service,
        price,
        duration,
        barber,
        date: dateObj.toISOString(),
        time,
        name: name.trim(),
        phone: phone.replace(/\D/g, '') // Remove a máscara do WhatsApp
      });

      showToast('Agendamento realizado com sucesso!', 'success');
      setSuccess(true);
      setStep(4);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || 'Erro ao processar agendamento. Escolha outro horário.', 
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return service !== '';
    if (step === 2) return barber !== '';
    if (step === 3) return date !== '' && time !== '';
    return true;
  };

  const handleReset = () => {
    setService('');
    setPrice(0);
    setDuration(0);
    setBarber('');
    setDate('');
    setTime('');
    if (!user) {
      setName('');
      setPhone('');
    }
    setNameError(null);
    setPhoneError(null);
    setSuccess(false);
    setStep(1);
  };

  return (
    <div className="booking-card">
      <div className="booking-card__header">
        <h2 className="booking-card__title">Agendamento Online</h2>
        {user && <button onClick={logout} className="btn-logout">Sair</button>}
      </div>

      {/* Progress Steps */}
      {!success && (
        <div className="booking-progress">
          <div className="booking-progress__bar" style={{ width: `${((step - 1) / (maxSteps - 1)) * 100}%` }}></div>
          <div className={`booking-progress__step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`} aria-label="Passo 1">1</div>
          <div className={`booking-progress__step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`} aria-label="Passo 2">2</div>
          <div className={`booking-progress__step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`} aria-label="Passo 3">3</div>
          <div className={`booking-progress__step ${step >= 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}`} aria-label="Passo 4">4</div>
        </div>
      )}

      {/* Step Content */}
      <div className="booking-content">
        {!success && step === 1 && (
          <ServiceStep 
            selectedService={service} 
            onSelectService={handleServiceSelect} 
          />
        )}

        {!success && step === 2 && (
          <BarberStep 
            selectedBarber={barber} 
            onSelectBarber={handleBarberSelect} 
          />
        )}

        {!success && step === 3 && (
          <ScheduleStep
            selectedDate={date}
            selectedTime={time}
            daysList={daysList}
            hoursList={hoursList}
            loadingHours={loadingHours}
            onSelectDate={handleSelectDay}
            onSelectTime={setTime}
          />
        )}

        {!success && step === 4 && (
          <SummaryStep
            service={service}
            price={price}
            barber={barber}
            dateFormatted={dateFormatted}
            time={time}
            duration={duration}
            name={name}
            phone={phone}
            onNameChange={(val) => {
              setName(val);
              setNameError(null);
            }}
            onPhoneChange={(val) => {
              setPhone(maskPhone(val));
              setPhoneError(null);
            }}
            nameError={nameError}
            phoneError={phoneError}
            isSubmitting={isSubmitting}
          />
        )}

        {success && (
          <SuccessStep
            service={service}
            barber={barber}
            dateFormatted={dateFormatted}
            time={time}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Botões do Rodapé do Wizard */}
      {!success && (
        <div className="booking-footer">
          <Button 
            variant="secondary" 
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || isSubmitting}
          >
            Voltar
          </Button>
          
          {step < maxSteps ? (
            <Button 
              variant="primary" 
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid() || isSubmitting}
            >
              Avançar
            </Button>
          ) : (
            <Button 
              variant="success" 
              onClick={handleBookingSubmit}
              loading={isSubmitting}
            >
              Confirmar Reserva
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
export default BookingWizard;
