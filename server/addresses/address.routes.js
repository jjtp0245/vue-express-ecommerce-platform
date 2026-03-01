import { Router } from 'express';
import * as addressController from './address.controller.js';

const router = Router();

router.get('/', addressController.getAddresses);
router.get('/:address_id', addressController.getAddressById);
router.post('/add', addressController.insertAddress);
router.put('/update/:address_id', addressController.updateAddress);
router.delete('/delete/:address_id', addressController.deleteAddress);
router.put('/set-default', addressController.setDefaultAddress);
router.get('/default/:userId', addressController.getDefaultAddress);


export default router;
