import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createAppointmentSchema = z.object({
    body: z.object({
        barber: z.string({
            message: 'Barber name is required'
        }).trim().min(1, 'Barber name cannot be empty'),
        date: z.string({
            message: 'Appointment date is required'
        }).refine(val => !isNaN(Date.parse(val)), {
            message: 'Invalid date format'
        }),
        time: z.string({
            message: 'Appointment time is required'
        }).regex(timeRegex, 'Appointment time must be in HH:MM format (24-hour style)'),
        name: z.string({
            message: 'Client name is required'
        }).trim().min(2, 'Name must be at least 2 characters'),
        phone: z.string({
            message: 'Client phone number is required'
        }).trim().min(10, 'Phone number must have at least 10 digits (including DDD)'),
        services: z.array(z.string().regex(objectIdRegex, 'Invalid Service ID')).optional(),
        service: z.string().trim().optional(),
        price: z.number().min(0, 'Price cannot be negative').optional(),
        duration: z.number().min(1, 'Duration must be at least 1 minute').optional()
    }).refine(data => {
        // Se 'services' não for fornecido ou for vazio, os dados brutos devem estar presentes
        if (!data.services || data.services.length === 0) {
            return !!data.service && data.price !== undefined && data.duration !== undefined;
        }
        return true;
    }, {
        message: 'Must provide either a list of valid service IDs or raw service details (service name, price, duration).',
        path: ['service']
    })
});

export const updateAppointmentStatusSchema = z.object({
    params: z.object({
        id: z.string().regex(objectIdRegex, 'Invalid appointment ID')
    }),
    body: z.object({
        status: z.enum(['confirmed', 'completed'], {
            message: "Status must be either 'confirmed' or 'completed'"
        })
    })
});
