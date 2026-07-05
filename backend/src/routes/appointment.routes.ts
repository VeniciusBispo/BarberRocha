import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createAppointmentSchema, updateAppointmentStatusSchema } from '../validators/appointment.validator';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
const appointmentController = new AppointmentController();

// GET /api/appointments/admin (Protegido Admin)
router.get(
    '/appointments/admin',
    authenticateJWT,
    requireAdmin,
    asyncHandler(appointmentController.getAllAdminAppointments)
);

// POST /api/appointments (Público)
router.post(
    '/appointments',
    validateRequest(createAppointmentSchema),
    asyncHandler(appointmentController.createAppointment)
);

// PATCH /api/appointments/:id/status (Protegido Admin)
router.patch(
    '/appointments/:id/status',
    authenticateJWT,
    requireAdmin,
    validateRequest(updateAppointmentStatusSchema),
    asyncHandler(appointmentController.updateStatus)
);

export default router;
