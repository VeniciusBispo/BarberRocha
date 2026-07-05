import { Appointment, IAppointment } from '../models/appointment.model';

export class AppointmentRepository {
    // Listar todos os agendamentos cadastrados (com populate e lean para alta performance)
    public async findAll(): Promise<any[]> {
        return await Appointment.find()
            .populate('userId', 'name phone isAdmin')
            .sort({ date: 1, time: 1 })
            .lean();
    }

    // Criar um novo agendamento
    public async create(appointmentData: Partial<IAppointment>): Promise<IAppointment> {
        const appointment = new Appointment(appointmentData);
        return await appointment.save();
    }

    // Buscar agendamento específico para verificar conflitos (com lean para ser o mais leve possível)
    public async findByBarberDateTime(barber: string, date: Date, time: string): Promise<any | null> {
        return await Appointment.findOne({ barber, date, time }).lean();
    }

    // Atualizar status de um agendamento
    public async updateStatus(id: string, status: 'confirmed' | 'completed'): Promise<IAppointment | null> {
        return await Appointment.findByIdAndUpdate(id, { status }, { new: true }).populate('userId', 'name phone isAdmin');
    }

    // Buscar agendamento por ID com populate
    public async findById(id: string): Promise<any | null> {
        return await Appointment.findById(id).populate('userId', 'name phone isAdmin').lean();
    }
}
