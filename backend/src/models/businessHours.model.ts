import { Schema, model, Document } from 'mongoose';

// Interface do TypeScript representando o documento de Horários de Funcionamento (BusinessHours)
export interface IBusinessHours extends Document {
    dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    isOpen: boolean; // Indica se abre no dia
    openTime: string; // Ex: "09:00"
    closeTime: string; // Ex: "20:00"
    lunchStart?: string; // Ex: "12:00" (opcional)
    lunchEnd?: string; // Ex: "13:00" (opcional)
    createdAt: Date;
    updatedAt: Date;
}

// Regex para validação estrita de horários no formato de 24 horas (HH:MM)
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

// Schema do Mongoose para a coleção de Horários de Funcionamento
const BusinessHoursSchema = new Schema<IBusinessHours>(
    {
        dayOfWeek: {
            type: Number,
            required: [true, 'Day of week is required'],
            min: [0, 'Day must be between 0 (Sunday) and 6 (Saturday)'],
            max: [6, 'Day must be between 0 (Sunday) and 6 (Saturday)'],
            unique: true // Apenas uma configuração por dia da semana
        },
        isOpen: {
            type: Boolean,
            default: true
        },
        openTime: {
            type: String,
            required: [true, 'Opening time is required'],
            validate: {
                validator: (val: string) => timeRegex.test(val),
                message: 'Opening time must be in HH:MM format (24-hour style).'
            }
        },
        closeTime: {
            type: String,
            required: [true, 'Closing time is required'],
            validate: {
                validator: (val: string) => timeRegex.test(val),
                message: 'Closing time must be in HH:MM format (24-hour style).'
            }
        },
        lunchStart: {
            type: String,
            validate: {
                validator: (val: string) => !val || timeRegex.test(val),
                message: 'Lunch start time must be in HH:MM format (24-hour style).'
            }
        },
        lunchEnd: {
            type: String,
            validate: {
                validator: (val: string) => !val || timeRegex.test(val),
                message: 'Lunch end time must be in HH:MM format (24-hour style).'
            }
        }
    },
    {
        timestamps: true // Cria createdAt e updatedAt automaticamente
    }
);

// Exportando o modelo
export const BusinessHours = model<IBusinessHours>('BusinessHours', BusinessHoursSchema);
