import { Schema, model, Document } from 'mongoose';
import type { IService } from './service.model';

// Interface do TypeScript para representar o documento de Agendamento
export interface IAppointment extends Document {
    userId: Schema.Types.ObjectId; // Referência para a coleção User
    services: Schema.Types.ObjectId[]; // Referências para a coleção Service
    service: string;               // Nome(s) do(s) serviço(s) compilado(s) automaticamente
    price: number;                 // Preço total compilado automaticamente
    duration: number;              // Tempo de bloqueio total compilado automaticamente (minutos)
    barber: string;
    date: Date;
    time: string;                  // horário formatado (ex: "14:00")
    status: 'pending' | 'confirmed' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}

// Schema do Mongoose para a coleção Appointment
const AppointmentSchema = new Schema<IAppointment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Associação Mongoose com o modelo 'User'
            required: [true, 'User ID reference is required']
        },
        services: [{
            type: Schema.Types.ObjectId,
            ref: 'Service', // Associação Mongoose com o modelo 'Service'
            required: [true, 'At least one service reference is required']
        }],
        service: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            min: [0, 'Price cannot be negative']
        },
        duration: {
            type: Number,
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
            enum: ['pending', 'confirmed', 'completed'],
            default: 'pending'
        }
    },
    {
        timestamps: true // Adiciona createdAt e updatedAt
    }
);

// Middleware Mongoose pre('save') para preencher preço total, tempo bloqueado e sumário de nomes de serviços
AppointmentSchema.pre<IAppointment>('save', async function (next) {
    const appointment = this;

    // Só re-calcula se a lista de serviços foi modificada
    if (!appointment.isModified('services')) {
        return next();
    }

    try {
        // Importa o modelo Service dinamicamente para evitar imports circulares de Typescript
        const { Service } = require('./service.model');

        if (!appointment.services || appointment.services.length === 0) {
            return next(new Error('At least one service is required for the appointment.'));
        }

        // Buscar no MongoDB todos os serviços fornecidos no array
        const dbServices = await Service.find({ _id: { $in: appointment.services }, isActive: true });

        if (dbServices.length === 0) {
            return next(new Error('No valid active services found for the provided service IDs.'));
        }

        // Acumular valores dos serviços cadastrados
        let totalPrice = 0;
        let totalDuration = 0;
        const serviceNames: string[] = [];

        dbServices.forEach((s: IService) => {
            totalPrice += s.price;
            totalDuration += s.duration;
            serviceNames.push(s.name);
        });

        // Grava no documento
        appointment.price = totalPrice;
        appointment.duration = totalDuration;
        appointment.service = serviceNames.join(' + ');

        next();
    } catch (error: any) {
        next(error);
    }
});

// Índice de restrição exclusivo para evitar duplo agendamento no mesmo horário para o mesmo barbeiro
AppointmentSchema.index({ barber: 1, date: 1, time: 1 }, { unique: true });

// Exportando o Modelo
export const Appointment = model<IAppointment>('Appointment', AppointmentSchema);
