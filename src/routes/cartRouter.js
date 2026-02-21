import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';
import CartRepository from '../repositories/CartRepository.js';
import { authorization } from '../middlewares/auth.js';
import passport from 'passport';

const router = Router();

const productDao = new productDBManager();
const cartDao = new cartDBManager(productDao);
const cartService = new CartRepository(cartDao);


// ✅ CREAR CARRITO
router.post('/', async (req, res) => {
    try {
        const newCart = await cartService.createCart(); 
        res.send({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});


// ✅ OBTENER CARRITO POR ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartService.getById(req.params.cid); 
        res.send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(404).send({ status: 'error', message: error.message });
    }
});


// ✅ AGREGAR PRODUCTO
router.post(
    '/:cid/product/:pid', 
    passport.authenticate('jwt', { session: false }), 
    authorization('user'), // <-- Así de limpio
    async (req, res) => {
        try {
            const result = await cartService.addProduct(req.params.cid, req.params.pid);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    }
);


// ✅ COMPRAR CARRITO
router.post(
    '/:cid/purchase',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const result = await cartService.purchase(req.params.cid, req.user.email);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message });
        }
    }
);

// ✅ ELIMINAR UN PRODUCTO ESPECÍFICO 
router.delete('/:cid/product/:pid', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await cartService.deleteProduct(cid, pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// ✅ VACIAR TODO EL CARRITO
router.delete('/:cid', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const result = await cartService.emptyCart(req.params.cid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

export default router;