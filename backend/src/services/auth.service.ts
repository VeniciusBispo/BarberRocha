import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { AppError } from '../errors/app-error';
import { env } from '../config/env.config';

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    // Regra de Negócio: Registrar um novo usuário
    public async register(userData: Partial<IUser>): Promise<any> {
        const { phone } = userData;

        if (!phone) {
            throw new AppError('Phone number is required.', 400);
        }

        // Verificar se telefone já existe
        const existingUser = await this.userRepository.findByPhone(phone);
        if (existingUser) {
            throw new AppError('A user with this phone number is already registered.', 409);
        }

        // Força isAdmin a false por segurança em registros públicos
        const newUser = await this.userRepository.create({
            ...userData,
            isAdmin: false,
            mustChangePassword: false
        });

        return {
            id: newUser._id,
            name: newUser.name,
            phone: newUser.phone,
            isAdmin: newUser.isAdmin,
            createdAt: newUser.createdAt
        };
    }

    // Regra de Negócio: Login e geração de Token JWT
    public async login(phone: string, candidatePassword: string): Promise<{ token: string; user: any }> {
        // Encontrar usuário (necessário como Mongoose Document para usar comparePassword)
        const user = await this.userRepository.findDocumentByPhone(phone);
        if (!user) {
            throw new AppError('Invalid phone number or password.', 401);
        }

        // Comparar a senha
        const isMatch = await user.comparePassword(candidatePassword);
        if (!isMatch) {
            throw new AppError('Invalid phone number or password.', 401);
        }

        // Gerar token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                isAdmin: user.isAdmin,
                mustChangePassword: user.mustChangePassword
            }
        };
    }

    // Regra de Negócio: Trocar de senha
    public async changePassword(userId: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findDocumentById(userId);
        if (!user) {
            throw new AppError('User not found.', 404);
        }

        user.password = newPassword;
        user.mustChangePassword = false;
        await user.save();
    }
}
