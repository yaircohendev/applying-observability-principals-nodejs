import express from 'express';
import { orderStock } from './orders.controller';

const router = express.Router();

router.post('/orderStock', orderStock);

export default router;
