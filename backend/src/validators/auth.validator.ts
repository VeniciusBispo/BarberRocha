import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string({
            message: 'Name is required'
        }).min(2, 'Name must have at least 2 characters').max(100, 'Name is too long'),
        phone: z.string({
            message: 'Phone number is required'
        }).min(5, 'Phone number is too short').max(20, 'Phone number is too long'),
        password: z.string({
            message: 'Password is required'
        }).min(3, 'Password must be at least 3 characters long').max(100, 'Password is too long')
    })
});

export const loginSchema = z.object({
    body: z.object({
        phone: z.string({
            message: 'Phone number is required'
        }).trim().min(1, 'Phone number cannot be empty'),
        password: z.string({
            message: 'Password is required'
        }).min(1, 'Password cannot be empty')
    })
});

export const changePasswordSchema = z.object({
    body: z.object({
        newPassword: z.string({
            message: 'New password is required'
        }).min(3, 'New password must be at least 3 characters long').max(100, 'New password is too long')
    })
});
