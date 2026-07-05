import { Schema, model, Document } from 'mongoose';

// Interface representando um Agendamento no TypeScript
export interface IBooking extends Document {
    clientName: string;
    clientPhone: string;
    service: string;
    price: number;
    duration: number; // duração em minutos
    barber: string;
    date: Date;       // data do agendamento (Y-M-D)
    time: string;       // horário (ex: "14:30")
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

// Schema do Mongoose correspondente
const BookingSchema = new Schema<IBooking>(
    {
        clientName: {
            type: String,
            required: [true, 'Client name is required'],
            trim: true
        },
        clientPhone: {
            type: String,
            required: [true, 'Client phone number is required'],
            trim: true
        },
        service: {
            type: String,
            required: [true, 'Service name is required'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Service price is required'],
            min: [0, 'Price cannot be negative']
        },
        duration: {
            type: Number,
            required: [true, 'Service duration in minutes is required'],
            min: [1, 'Duration must be at least 1 minute']
        },
        barber: {
            type: String,
            required: [true, 'Barber name is required'],
            trim: true
        },
        date: {
            type: Date,
            required: [true, 'Appointment date is required']
        },
        time: {
            type: String,
            required: [true, 'Appointment time is required'],
            trim: true
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending'
        }
    },
    {
        timestamps: true // Adiciona automaticamente createdAt e updatedAt
    }
);

// Índices para performance e restrição (por exemplo, impedir agendamentos repetidos para o mesmo barbeiro no mesmo dia e hora)
BookingSchema.index({ barber: 1, date: 1, time: 1 }, { unique: true });

// Criando e exportando o Model
export const Booking = model<IBooking>('Booking', BookingSchema);
