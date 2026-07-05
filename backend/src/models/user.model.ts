import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface do TypeScript representando o documento de Usuário
export interface IUser extends Document {
    name: string;
    phone: string;
    password: string;
    isAdmin: boolean;
    mustChangePassword: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema do Mongoose para a coleção User
const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        mustChangePassword: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true // Cria createdAt e updatedAt automaticamente
    }
);

// Middleware Mongoose pre('save') para criptografar a senha automaticamente
UserSchema.pre<IUser>('save', async function (next) {
    const user = this;

    // Só faz o hash da senha se ela foi modificada (ou criada nova)
    if (!user.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (error: any) {
        next(error);
    }
});

// Método para verificar a senha (comparar a senha informada com o hash salvo no banco)
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Exportando o Modelo
export const User = model<IUser>('User', UserSchema);
