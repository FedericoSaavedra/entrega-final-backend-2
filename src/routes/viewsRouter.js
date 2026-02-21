import { Router } from 'express';
import passport from 'passport';
import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';

const router = Router();
const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);

// --- 1. MIDDLEWARE PARA RUTAS PÚBLICAS ---
// Si el usuario ya está logueado (tiene cookie), lo mandamos a ver los productos
const publicAccess = (req, res, next) => {
    if (req.cookies['coderCookieToken']) return res.redirect('/');
    next();
};

// --- 2. RUTAS PÚBLICAS (No requieren sesión) ---
router.get('/login', publicAccess, (req, res) => {
    res.render('login', { style: 'index.css', title: 'Iniciar Sesión' });
});

router.get('/register', publicAccess, (req, res) => {
    res.render('register', { style: 'index.css', title: 'Registro' });
});

router.get('/forgot-password', publicAccess, (req, res) => {
    res.render('forgotPassword', { style: 'index.css', title: 'Recuperar Contraseña' });
});

router.get('/reset-password', publicAccess, (req, res) => {
    res.render('resetPassword', { style: 'index.css', title: 'Restablecer Contraseña' });
});


// --- 3. MIDDLEWARE PARA RUTAS PRIVADAS ---
// Si no tiene token válido, lo patea automáticamente al /login
const privateAccess = passport.authenticate('jwt', { session: false, failureRedirect: '/login' });

// --- 4. RUTAS PRIVADAS ---
router.get('/', privateAccess, async (req, res) => {
    const products = await ProductService.getAllProducts(req.query);

    res.render('index', {
        title: 'Productos',
        style: 'index.css',
        products: JSON.parse(JSON.stringify(products.docs)),
        user: req.user, // <-- PASAMOS EL USUARIO PARA QUE DIGA "BIENVENIDO"
        prevLink: {
            exist: products.prevLink ? true : false,
            link: products.prevLink
        },
        nextLink: {
            exist: products.nextLink ? true : false,
            link: products.nextLink
        }
    });
});

router.get('/products', privateAccess, async (req, res) => {
    const products = await ProductService.getAllProducts(req.query);

    res.render('index', {
        title: 'Productos',
        style: 'index.css',
        products: JSON.parse(JSON.stringify(products.docs)),
        user: req.user,
        prevLink: {
            exist: products.prevLink ? true : false,
            link: products.prevLink
        },
        nextLink: {
            exist: products.nextLink ? true : false,
            link: products.nextLink
        }
    });
});

router.get('/realtimeproducts', privateAccess, async (req, res) => {
    const products = await ProductService.getAllProducts(req.query);

    res.render('realTimeProducts', {
        title: 'Productos Realtime',
        style: 'index.css',
        products: JSON.parse(JSON.stringify(products.docs))
    });
});

router.get('/cart/:cid', privateAccess, async (req, res) => {
    const response = await CartService.getProductsFromCartByID(req.params.cid);

    if (response.status === 'error') {
        return res.render('notFound', {
            title: 'Not Found',
            style: 'index.css'
        });
    }

    res.render('cart', {
        title: 'Carrito',
        style: 'index.css',
        cartId: req.params.cid,
        products: JSON.parse(JSON.stringify(response.products))
    });
});

export default router;