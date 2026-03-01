import { Router } from 'express';
import * as paymentController from './payment.controller.js';
import upload from './uploadMiddleware.js'; // middleware สำหรับอัพโหลดไฟล์

const router = Router();

router.post('/create', upload.single('paymentProof'), paymentController.createPayment);
router.get('/:order_id', paymentController.getPaymentByOrderId);
router.put('/update-status/:order_id', paymentController.updatePaymentStatus);

export default router;
