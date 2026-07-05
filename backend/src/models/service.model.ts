import { Schema, model, Document } from 'mongoose';

// Interface do TypeScript representando o documento de Serviço (Service)
export interface IService extends Document {
    name: string;
    description?: string;
    price: number;
    duration: number; // duração estimada em minutos
    isActive: boolean; // status de visibilidade
    createdAt: Date;
    updatedAt: Date;
}

// Schema do Mongoose para a coleção de Serviços
const ServiceSchema = new Schema<IService>(
    {
        name: {
            type: String,
            required: [true, 'Service name is required'],
            unique: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Service price is required'],
            min: [0, 'Price cannot be negative']
        },
        duration: {
            type: Number,
            required: [true, 'Service duration (minutes) is required'],
            min: [1, 'Duration must be at least 1 minute']
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true // Cria createdAt e updatedAt automaticamente
    }
);

// Exportando o modelo
export const Service = model<IService>('Service', ServiceSchema);
