import {NextFunction, Request, Response} from 'express';
import {BaseError} from '../shared/classes/base-error';
import {APIError} from '../shared/classes/api-error';
import {saveInDB} from './orders.service';
import {logger} from "../shared/classes/logger";
import {randCreditCard, randNumber, randUser} from '@ngneat/falso';
import {metrics} from "../core/metrics";

export const orderStock = async (req: Request, res: Response, next: NextFunction) => {
    const end = metrics.OrderTimeHistogram.startTimer();
    const log$ = logger.child({methodName: 'orderStock'})
    const order = {
        price: randNumber({min: 10, max: 1000}),
        credit_card: randCreditCard(),
        state: 'placed'
    };
    const user = randUser();
    try {
        log$.info({message: 'Placing stock order', user, order})
        if (req.body?.fail) {
            throw Error('Failed to place order');
        }
        const results = await saveInDB();
        order.state = 'successful';
        log$.info({
            message: 'Stock order placed successfully',
            user,
            order
        })
        res.send(results);
    } catch (err) {
        order.state = 'failed';
        log$.error({message: 'Stock order failed', user, order, error: err})
        const message = err instanceof APIError ? err.message : `Generic error for user`;
        res.status((<BaseError>err)?.httpCode || 500).send(message);
        next(err);
    }
    end({price: order.price, state: order.state})
};
