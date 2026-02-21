import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';
import CartRepository from '../repositories/CartRepository.js';
import { authorization } from '../middlewares/auth.js';

const router = Router();
const productDao = new productDBManager();
const cartDao = new cartDBManager(productDao);
const cartService = new CartRepository(cartDao);


router.post('/:cid/product/:pid', authorization('user'), async (req, res) => {
    try {
        const result = await cartService.addProduct(req.params.cid, req.params.pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});


router.post('/:cid/purchase', async (req, res) => {
    try {
        const result = await cartService.purchase(req.params.cid, req.user.email);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

export default router;