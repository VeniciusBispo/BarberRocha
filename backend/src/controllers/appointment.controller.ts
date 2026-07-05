import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointment.service';

export class AppointmentController {
    private appointmentService: AppointmentService;

    constructor() {
        this.appointmentService = new AppointmentService();
    }

    // GET /api/appointments/admin
    public getAllAdminAppointments = async (req: Request, res: Response): Promise<void> => {
        const appointments = await this.appointmentService.getAllAdminAppointments();
        
        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    };

    // POST /api/appointments
    public createAppointment = async (req: Request, res: Response): Promise<void> => {
        const appointment = await this.appointmentService.createAppointment(req.body);

        res.status(201).json({
            success: true,
            message: 'Appointment successfully scheduled.',
            data: appointment
        });
    };

    // PATCH /api/appointments/:id/status
    public updateStatus = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await this.appointmentService.updateAppointmentStatus(id, status);

        res.status(200).json({
            success: true,
            message: `Appointment status updated to ${status}.`,
            data: appointment
        });
    };
}
