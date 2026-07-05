import { AppointmentRepository } from '../repositories/appointment.repository';
import { UserRepository } from '../repositories/user.repository';
import { IAppointment } from '../models/appointment.model';
import { WhatsAppService } from './whatsapp.service';
import { AppError } from '../errors/app-error';
import { logger } from '../utils/logger';

export class AppointmentService {
    private appointmentRepository: AppointmentRepository;
    private userRepository: UserRepository;

    constructor() {
        this.appointmentRepository = new AppointmentRepository();
        this.userRepository = new UserRepository();
    }

    // Listar todos os agendamentos (Fluxo Admin)
    public async getAllAdminAppointments(): Promise<any[]> {
        return await this.appointmentRepository.findAll();
    }

    // Criar agendamento validando conflitos e criando usuário se necessário (Fluxo Público)
    public async createAppointment(appointmentData: any): Promise<IAppointment> {
        const { barber, date, time, name, phone } = appointmentData;

        if (!barber || !date || !time) {
            throw new AppError('Missing required fields: barber, date and time.', 400);
        }
        if (!name || !phone) {
            throw new AppError('Missing client details: name and phone.', 400);
        }

        // Limpa caracteres não numéricos do telefone
        const cleanPhone = phone.replace(/\D/g, '');

        // Buscar ou criar usuário correspondente
        let user = await this.userRepository.findByPhone(cleanPhone);
        if (!user) {
            logger.info(`[AppointmentService] Criando novo perfil de cliente para o telefone: ${cleanPhone}`);
            user = await this.userRepository.create({
                name: name.trim(),
                phone: cleanPhone,
                password: Math.random().toString(36).substring(2, 10), // Senha aleatória segura
                isAdmin: false,
                mustChangePassword: false
            });
        }

        const appointmentDate = new Date(date);

        // Verificar conflitos de horário
        const existing = await this.appointmentRepository.findByBarberDateTime(barber, appointmentDate, time);
        if (existing) {
            throw new AppError(`The barber ${barber} is already booked at ${time} on this day.`, 409);
        }

        // Salvar agendamento vinculando ao ID do usuário
        const finalAppointmentData = {
            ...appointmentData,
            userId: user._id
        };
        const appointment = await this.appointmentRepository.create(finalAppointmentData);

        // Disparar confirmação do WhatsApp em segundo plano
        this.triggerWhatsAppConfirmation(appointment).catch(err => {
            logger.error('[INTEGRAÇÃO WHATSAPP] Erro em background ao processar o disparo:', err);
        });

        return appointment;
    }

    // Disparador assíncrono de WhatsApp
    private async triggerWhatsAppConfirmation(appointment: IAppointment): Promise<void> {
        try {
            const user = await this.userRepository.findById(appointment.userId.toString());
            if (!user) {
                logger.warn(`[INTEGRAÇÃO WHATSAPP] Disparo abortado: Usuário com ID ${appointment.userId} não localizado.`);
                return;
            }

            // Formatação amigável de data
            const dateFormatted = new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'long',
                timeZone: 'UTC'
            }).format(new Date(appointment.date));

            await WhatsAppService.sendConfirmation(
                user.phone,
                user.name,
                appointment.service,
                appointment.price,
                dateFormatted,
                appointment.time,
                appointment.barber
            );
        } catch (error) {
            logger.error('[INTEGRAÇÃO WHATSAPP] Falha ao recuperar contexto do usuário para confirmação:', error);
        }
    }

    // Atualizar status do agendamento
    public async updateAppointmentStatus(id: string, status: 'confirmed' | 'completed'): Promise<IAppointment> {
        const updated = await this.appointmentRepository.updateStatus(id, status);
        if (!updated) {
            throw new AppError('Appointment not found.', 404);
        }
        return updated;
    }
}
