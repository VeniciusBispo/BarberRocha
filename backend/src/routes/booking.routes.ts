import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { createBookingSchema, updateBookingStatusSchema } from '../validators/booking.validator';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
const bookingController = new BookingController();

// Vincular rotas aos métodos do controller
router.post(
    '/bookings', 
    validateRequest(createBookingSchema), 
    asyncHandler(bookingController.create)
);

router.get(
    '/bookings', 
    asyncHandler(bookingController.getAll)
);

router.patch(
    '/bookings/:id/status', 
    validateRequest(updateBookingStatusSchema), 
    asyncHandler(bookingController.updateStatus)
);

export default router;
