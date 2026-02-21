// src/dto/user.dto.js
export default class UserDTO {
    constructor(user) {
        // Combinamos nombre y apellido como pide la lógica profesional
        this.fullName = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.role = user.role;
        this.cart = user.cart;
        // El password NO se incluye aquí
    }
}