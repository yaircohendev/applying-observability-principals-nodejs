import {Histogram} from "prom-client";

export const OrderTimeHistogram = new Histogram({
    name: 'order_time_duration',
    buckets: [1, 2, 3, 4, 5, 6],
    help: 'Duration of order time',
    labelNames: ['price', 'state']
});

export const metrics = {
    OrderTimeHistogram
};
