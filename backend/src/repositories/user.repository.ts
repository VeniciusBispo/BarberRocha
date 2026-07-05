import { User, IUser } from '../models/user.model';

export class UserRepository {
    // Criar um novo usuário
    public async create(userData: Partial<IUser>): Promise<IUser> {
        const user = new User(userData);
        return await user.save();
    }

    // Buscar usuário por ID (limpo/lean)
    public async findById(id: string): Promise<any | null> {
        return await User.findById(id).lean();
    }

    // Buscar usuário completo como Documento do Mongoose (necessário para save/save hooks)
    public async findDocumentById(id: string): Promise<IUser | null> {
        return await User.findById(id);
    }

    // Buscar usuário por telefone (lean)
    public async findByPhone(phone: string): Promise<any | null> {
        return await User.findOne({ phone }).lean();
    }

    // Buscar usuário por telefone retornando como Documento do Mongoose
    public async findDocumentByPhone(phone: string): Promise<IUser | null> {
        return await User.findOne({ phone });
    }
}
