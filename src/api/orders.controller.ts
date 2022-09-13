import { NextFunction, Request, Response } from 'express';
import { saveInDB } from './orders.service';

export const orderStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const results = await saveInDB();
        res.send(results);
    } catch (err) {
        res.status(500).send(`Generic error for user`);
        next(err);
    }
};
