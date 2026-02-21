🚀 Ecommerce Backend - Entrega Final
Este proyecto es el resultado final del curso de Backend, enfocado en una arquitectura profesional, escalable y segura utilizando Node.js, Express y MongoDB.

🛠️ Tecnologías Utilizadas
Node.js & Express: Entorno de ejecución y framework web.

MongoDB & Mongoose: Base de datos NoSQL y ODM.

Passport & JWT: Autenticación y manejo de sesiones.

Nodemailer: Servicio de mailing para recuperación de contraseñas.

Bcrypt: Hasheo de contraseñas.

🏗️ Arquitectura del Proyecto
Se implementó una arquitectura de capas para separar las responsabilidades y facilitar el mantenimiento:

Capas de Persistencia (DAO & Repository): El patrón Repository abstrae la lógica de acceso a datos, permitiendo que el negocio no dependa directamente de la base de datos.

Capas de Negocio (Services): Aquí reside la lógica compleja, como la validación de stock y generación de tickets.

DTO (Data Transfer Object): Utilizado para filtrar información sensible (como contraseñas) en la ruta /api/sessions/current.

🔒 Funcionalidades Principales
1. Sistema de Autorización (RBAC)
Se implementó un middleware de autorización que restringe el acceso según el rol del usuario:

Admin: Gestión de productos (Crear, Editar, Eliminar).

User: Gestión de carrito (Agregar productos, procesar compra).

2. Proceso de Compra y Tickets
Al finalizar una compra (/api/carts/:cid/purchase):

Se verifica el stock de cada producto.

Se genera un Ticket con un código único por el monto total de los productos disponibles.

Los productos sin stock permanecen en el carrito para futuras transacciones.

3. Recuperación de Contraseña
Sistema seguro mediante tokens con expiración de 1 hora.

Valida que la nueva contraseña no sea idéntica a la anterior.

Envío de correos electrónicos mediante Nodemailer.

🚀 Instalación y Uso
Clonar el repositorio.

Ejecutar npm install.

Configurar el archivo .env (ver sección de variables de entorno).

Iniciar el servidor con npm run dev o npm start.

📋 Variables de Entorno (.env)
El proyecto requiere las siguientes variables:
PORT, MONGO_URL, JWT_SECRET, EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL, ADMIN_PASSWORD.
