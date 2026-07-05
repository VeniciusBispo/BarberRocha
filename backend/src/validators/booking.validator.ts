import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createBookingSchema = z.object({
    body: z.object({
        clientName: z.string({
            message: 'Client name is required'
        }).trim().min(1, 'Client name cannot be empty'),
        clientPhone: z.string({
            message: 'Client phone number is required'
        }).trim().min(5, 'Client phone number is too short'),
        service: z.string({
            message: 'Service name is required'
        }).trim().min(1, 'Service name cannot be empty'),
        price: z.number({
            message: 'Service price is required'
        }).min(0, 'Price cannot be negative'),
        duration: z.number({
            message: 'Service duration in minutes is required'
        }).min(1, 'Duration must be at least 1 minute'),
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
        }).regex(timeRegex, 'Appointment time must be in HH:MM format (24-hour style)')
    })
});

export const updateBookingStatusSchema = z.object({
    params: z.object({
        id: z.string().regex(objectIdRegex, 'Invalid booking ID')
    }),
    body: z.object({
        status: z.enum(['confirmed', 'cancelled'], {
            message: "Status must be either 'confirmed' or 'cancelled'"
        })
    })
});
