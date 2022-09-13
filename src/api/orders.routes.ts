import express from 'express';
import { validateInput } from './orders.validators';
import { orderStock } from './orders.controller';

const router = express.Router();

router.post('/orderStock', validateInput, orderStock);

export default router;
