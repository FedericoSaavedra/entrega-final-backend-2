import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../dao/models/user.js';
import { createHash, isValidPassword } from '../utils/hash.js';

const router = Router();

// --- REGISTRO ---
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).send({ status: "error", error: "El usuario ya existe" });

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password), // Encriptación solicitada
            role: 'user' // Valor por defecto
        };

        const result = await User.create(user);
        res.send({ status: "success", message: "Usuario registrado", payload: result._id });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error en el servidor" });
    }
});

// --- LOGIN CON JWT ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).send({ status: "error", error: "Credenciales inválidas" });

        if (!isValidPassword(user, password)) return res.status(401).send({ status: "error", error: "Contraseña incorrecta" });

        // Datos que viajan en el token (sin la contraseña)
        const tokenUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        };

        const token = jwt.sign({ user: tokenUser }, 'coderSecret', { expiresIn: '24h' });

        // Respuesta con cookie HTTP-Only para mayor seguridad
        res.cookie('coderCookieToken', token, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true })
           .send({ status: "success", message: "Login exitoso" });
           
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error en el servidor" });
    }
});

// --- RUTA CURRENT (VALIDACIÓN) ---
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Si llega aquí, es porque el token es válido. Passport guarda el payload en req.user
    res.send({ status: "success", payload: req.user });
});

export default router;