import { Router } from 'express';
import { addItemToCart, getCartItems, clearCart, completeCart, removeItemFromCart } from './cart.controller.js';

const router = Router();

router.post('/:userId/add', addItemToCart);
router.get('/:userId', getCartItems);
router.delete('/:userId/clear', clearCart);
router.put('/:cartId/complete', completeCart);
router.delete('/:userId/remove/:productId', removeItemFromCart);

export default router;
