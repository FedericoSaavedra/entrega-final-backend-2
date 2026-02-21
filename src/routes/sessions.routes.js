import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils/hash.js';
// 1. Importamos el manager de carritos
import { cartDBManager } from '../dao/cartDBManager.js'; 

const router = Router();
// 2. Instanciamos el manager
const cartDao = new cartDBManager(); 

// --- REGISTRO ---
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).send({ status: "error", error: "El usuario ya existe" });

        // 3. Creamos un carrito vacío ANTES de guardar al usuario
        const newCart = await cartDao.createCart();

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: 'user',
            cart: newCart._id // 4. Le asignamos el ID del carrito recién creado
        };

        const result = await User.create(user);
        res.send({ status: "success", message: "Usuario registrado", payload: result._id });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).send({ status: "error", error: "Error en el servidor" });
    }
});

// --- LOGIN CON JWT (SOPORTE PARA ADMIN .ENV) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. CHEQUEAMOS SI ES EL ADMIN DEL .ENV
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const tokenUser = {
                first_name: "Admin",
                last_name: "Coder",
                email: email,
                role: 'admin', // Asignamos rol admin directamente
                cart: null     // El admin no suele tener carrito
            };

            const token = jwt.sign({ user: tokenUser }, 'coderSecret', { expiresIn: '24h' });

            return res.cookie('coderCookieToken', token, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true })
                      .send({ status: "success", message: "Login como Administrador exitoso" });
        }

        // 2. SI NO ES ADMIN, BUSCAMOS EN LA BASE DE DATOS (USUARIO NORMAL)
        const user = await User.findOne({ email });
        if (!user) return res.status(401).send({ status: "error", error: "Credenciales inválidas" });

        if (!isValidPassword(user, password)) return res.status(401).send({ status: "error", error: "Contraseña incorrecta" });

        const tokenUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart 
        };

        const token = jwt.sign({ user: tokenUser }, 'coderSecret', { expiresIn: '24h' });

        res.cookie('coderCookieToken', token, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true })
           .send({ status: "success", message: "Login exitoso" });
           
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error en el servidor" });
    }
});

// --- RUTA CURRENT ---
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send({ status: "success", payload: req.user });
});

// --- LOGOUT ---
router.get('/logout', (req, res) => {
    res.clearCookie('coderCookieToken');
    res.redirect('/login');
});

export default router;