export const authorization = (role) => {
    return async (req, res, next) => {
        // 1. Verificamos que el usuario exista
        if (!req.user) return res.status(401).send({ status: "error", error: "No autenticado" });
        
        // 2. Convertimos el parámetro a un arreglo (por si a veces le pasas 'user' y a veces ['user', 'admin'])
        const rolesArray = Array.isArray(role) ? role : [role];
        
        // 3. Verificamos si el rol del usuario está dentro de los permitidos
        if (!rolesArray.includes(req.user.role)) {
            return res.status(403).send({ status: "error", error: "No tienes permisos" });
        }
        
        next();
    };
};