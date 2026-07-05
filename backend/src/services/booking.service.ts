import { BookingRepository } from '../repositories/booking.repository';
import { IBooking } from '../models/booking.model';
import { AppError } from '../errors/app-error';

export class BookingService {
    private bookingRepository: BookingRepository;

    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    // Criar um novo agendamento com validação de regras de negócio
    public async createBooking(bookingData: Partial<IBooking>): Promise<IBooking> {
        const { barber, date, time } = bookingData;

        if (!barber || !date || !time) {
            throw new AppError('Missing required fields: barber, date, and time are mandatory.', 400);
        }

        const bookingDate = new Date(date);

        // Impedir agendamento duplicado (mesmo barbeiro, mesmo dia, mesmo horário)
        const existingBooking = await this.bookingRepository.findByBarberAndDateTime(
            barber,
            bookingDate,
            time
        );

        if (existingBooking) {
            throw new AppError(`The barber ${barber} is already booked at ${time} on this date.`, 409);
        }

        return await this.bookingRepository.create({
            ...bookingData,
            date: bookingDate,
            status: 'pending'
        });
    }

    // Listar todos os agendamentos cadastrados
    public async getAllBookings(): Promise<IBooking[]> {
        return await this.bookingRepository.findAll();
    }

    // Atualizar status
    public async updateBookingStatus(id: string, status: 'confirmed' | 'cancelled'): Promise<IBooking> {
        const updated = await this.bookingRepository.updateStatus(id, status);
        if (!updated) {
            throw new AppError('Booking not found.', 404);
        }
        return updated;
    }
}
