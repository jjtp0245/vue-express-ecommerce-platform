import { Router } from 'express';
import * as orderController from './order.controller.js';

const router = Router();

router.post('/create', orderController.createOrder);
router.put('/update-status/:order_id', orderController.updateOrderStatus);
router.get('/:order_id', orderController.getOrderById);
router.get('/user/:user_id/details', orderController.getUserOrdersWithDetails);
router.delete('/:order_id', orderController.deleteOrder);
router.get('/count', orderController.getOrderCount);
router.get('/', orderController.getOrders);



export default router;
