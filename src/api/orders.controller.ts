import {NextFunction, Request, Response} from 'express';
import {BaseError} from '../shared/classes/base-error';
import {APIError} from '../shared/classes/api-error';
import {saveInDB} from './orders.service';
import {logger} from "../shared/classes/logger";
import {randCreditCard, randNumber, randUser} from '@ngneat/falso';
import * as opentelemetry from '@opentelemetry/api';
import {SpanStatusCode} from '@opentelemetry/api';

export const orderStock = async (req: Request, res: Response, next: NextFunction) => {
    const tracer = opentelemetry.trace.getTracer('stockly');
    const span = tracer.startSpan('placingStockOrder')
    const log$ = logger.child({methodName: 'orderStock'})
    const order = {
        price: randNumber({min: 10, max: 1000}),
        credit_card: randCreditCard(),
        state: 'placed'
    };
    const user = randUser();
    try {
        const placeOrderEvent = {message: 'Placing stock order', user, order};
        log$.info(placeOrderEvent)
        span.setAttribute('log', JSON.stringify(placeOrderEvent));
        const results = await saveInDB(req.body?.fail);
        order.state = 'successful';
        log$.info({
            message: 'Stock order placed successfully',
            user,
            order
        })
        res.send(results);
        span.setStatus({code: SpanStatusCode.OK})
    } catch (err) {
        span.setStatus({code: SpanStatusCode.ERROR, message: err.message})
        order.state = 'failed';
        log$.error({message: 'Stock order failed', user, order, error: err})
        const message = err instanceof APIError ? err.message : `Generic error for user`;
        res.status((<BaseError>err)?.httpCode || 500).send(message);
        next(err);
    }
    span.end();
};
