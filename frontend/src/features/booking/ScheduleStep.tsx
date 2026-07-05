import React from 'react';
import { Clock } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

interface DayItem {
  iso: string;
  formatted: string;
  week: string;
  num: number;
  mes: string;
}

interface ScheduleStepProps {
  selectedDate: string;
  selectedTime: string;
  daysList: DayItem[];
  hoursList: string[];
  loadingHours: boolean;
  onSelectDate: (dayIso: string, formatted: string) => void;
  onSelectTime: (time: string) => void;
}

export const ScheduleStep: React.FC<ScheduleStepProps> = ({
  selectedDate,
  selectedTime,
  daysList,
  hoursList,
  loadingHours,
  onSelectDate,
  onSelectTime,
}) => {
  return (
    <div className="booking-step">
      <h3 className="booking-step__title">Selecione Dia & Horário</h3>
      
      <div className="calendar-grid">
        {daysList.map((day) => (
          <button
            key={day.iso}
            type="button"
            className={`calendar-day-card ${selectedDate === day.iso ? 'selected' : ''}`}
            onClick={() => onSelectDate(day.iso, day.formatted)}
            aria-pressed={selectedDate === day.iso}
          >
            <span className="calendar-day-card__week">{day.week}</span>
            <span className="calendar-day-card__number">{day.num}</span>
            <span className="calendar-day-card__month">{day.mes}</span>
          </button>
        ))}
      </div>

      {selectedDate && (
        <div className="hours-section">
          <h4 className="hours-title"><Clock size={16} /> Horários Disponíveis:</h4>
          
          {loadingHours ? (
            <div className="hours-grid">
              <Skeleton variant="rect" height="42px" width="100%" count={8} />
            </div>
          ) : (
            <div className="hours-grid">
              {hoursList.map((hour) => (
                <button 
                  key={hour}
                  type="button"
                  className={`hour-btn ${selectedTime === hour ? 'selected' : ''}`}
                  onClick={() => onSelectTime(hour)}
                  aria-pressed={selectedTime === hour}
                >
                  {hour}
                </button>
              ))}
              {hoursList.length === 0 && (
                <p className="no-hours" role="status">Nenhum horário livre. Escolha outro dia!</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ScheduleStep;
