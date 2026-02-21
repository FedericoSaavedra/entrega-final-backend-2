
import UserDTO from '../dto/user.dto.js';

export const getCurrentUser = async (req, res) => {
    if (!req.user) return res.status(401).send("No hay usuario activo");
    
    // Transformamos el usuario de la DB al formato seguro
    const userSafeData = new UserDTO(req.user);
    
    res.json({ status: "success", payload: userSafeData });
};