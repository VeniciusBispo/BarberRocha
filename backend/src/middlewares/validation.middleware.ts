import { Request, Response, NextFunction, RequestHandler } from 'express';
import { z } from 'zod';
import { AppError } from '../errors/app-error';

export const validateRequest = (schema: z.ZodType<any, any, any>): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            
            req.body = parsed.body || req.body;
            req.query = parsed.query as any || req.query;
            req.params = parsed.params as any || req.params;
            
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.issues.map(err => {
                    const field = err.path.join('.').replace('body.', '').replace('params.', '').replace('query.', '');
                    return `'${field}': ${err.message}`;
                });
                next(new AppError(`Validation error: ${errors.join(', ')}`, 400));
            } else {
                next(error);
            }
        }
    };
};
