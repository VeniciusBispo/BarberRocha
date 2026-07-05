import { Booking, IBooking } from '../models/booking.model';

export class BookingRepository {
    // Criar um novo agendamento
    public async create(bookingData: Partial<IBooking>): Promise<IBooking> {
        const booking = new Booking(bookingData);
        return await booking.save();
    }

    // Listar todos os agendamentos com lean
    public async findAll(): Promise<any[]> {
        return await Booking.find().sort({ date: 1, time: 1 }).lean();
    }

    // Buscar agendamento por ID com lean
    public async findById(id: string): Promise<any | null> {
        return await Booking.findById(id).lean();
    }

    // Buscar agendamento específico para verificar conflitos (barbeiro, data e horário) com lean
    public async findByBarberAndDateTime(
        barber: string, 
        date: Date, 
        time: string
    ): Promise<any | null> {
        return await Booking.findOne({ barber, date, time }).lean();
    }

    // Listar agendamentos de um barbeiro específico em um dia com lean
    public async findByBarberAndDate(barber: string, date: Date): Promise<any[]> {
        return await Booking.find({ barber, date }).lean();
    }

    // Atualizar status de um agendamento
    public async updateStatus(id: string, status: 'confirmed' | 'cancelled'): Promise<IBooking | null> {
        return await Booking.findByIdAndUpdate(id, { status }, { new: true });
    }
}
