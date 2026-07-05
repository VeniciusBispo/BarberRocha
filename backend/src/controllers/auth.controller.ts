import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AppError } from '../errors/app-error';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // POST /api/auth/register
    public register = async (req: Request, res: Response): Promise<void> => {
        const user = await this.authService.register(req.body);
        
        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            data: user
        });
    };

    // POST /api/auth/login
    public login = async (req: Request, res: Response): Promise<void> => {
        const { phone, password } = req.body;
        const result = await this.authService.login(phone, password);

        res.status(200).json({
            success: true,
            message: 'Authentication successful.',
            token: result.token,
            user: result.user
        });
    };

    // PATCH /api/auth/change-password
    public changePassword = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { newPassword } = req.body;

        if (!userId) {
            throw new AppError('Unauthorized. User session missing.', 401);
        }

        await this.authService.changePassword(userId, newPassword);

        res.status(200).json({
            success: true,
            message: 'Password changed successfully.'
        });
    };
}
