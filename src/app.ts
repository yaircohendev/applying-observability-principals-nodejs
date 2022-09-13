import express from 'express';
import ordersRoute from './api/orders.routes';

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;

app.use('/orders', ordersRoute);

app.listen(port, async () => {
    console.log(`Server is listening on port ${port}!`);
});
