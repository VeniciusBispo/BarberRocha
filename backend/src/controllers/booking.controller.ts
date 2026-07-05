import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';

export class BookingController {
    private bookingService: BookingService;

    constructor() {
        this.bookingService = new BookingService();
    }

    // POST /api/bookings
    public create = async (req: Request, res: Response): Promise<void> => {
        const booking = await this.bookingService.createBooking(req.body);
        
        res.status(201).json({
            success: true,
            data: booking
        });
    };

    // GET /api/bookings
    public getAll = async (req: Request, res: Response): Promise<void> => {
        const bookings = await this.bookingService.getAllBookings();
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    };

    // PATCH /api/bookings/:id/status
    public updateStatus = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await this.bookingService.updateBookingStatus(id, status);

        res.status(200).json({
            success: true,
            data: booking
        });
    };
}
