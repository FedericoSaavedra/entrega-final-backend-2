// src/services/mailing.js
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App Password de Google
    }
});

export const sendRecoveryEmail = async (email, token) => {
    const link = `http://localhost:8080/reset-password?token=${token}`;
    
    await transport.sendMail({
        from: 'Ecommerce <no-reply@tuapp.com>',
        to: email,
        subject: 'Restablecer contraseña',
        html: `
            <h1>Solicitud de cambio de contraseña</h1>
            <p>Haz clic en el siguiente botón para restablecer tu clave. Tienes 1 hora.</p>
            <a href="${link}"><button>Restablecer Contraseña</button></a>
        `
    });
};