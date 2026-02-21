import { ticketModel } from '../dao/models/ticketModel.js';

export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    // 📌 Crear carrito
    async createCart() {
        return await this.dao.createCart();
    }

    // 📌 Obtener carrito por ID
    async getById(id) {
        return await this.dao.getProductsFromCartByID(id);
    }

    // 📌 Agregar producto
    async addProduct(cid, pid) {
        return await this.dao.addProductByID(cid, pid);
    }

    // 📌 Actualizar todos los productos
    async updateProducts(cid, products) {
        return await this.dao.updateAllProducts(cid, products);
    }

    // 📌 Actualizar cantidad de un producto
    async updateProductQuantity(cid, pid, quantity) {
        return await this.dao.updateProductByID(cid, pid, quantity);
    }

    // 📌 Eliminar producto específico
    async deleteProduct(cid, pid) {
    // 1. Obtenemos el carrito actual
    const cart = await this.dao.getProductsFromCartByID(cid);
    
    // 2. Buscamos el producto dentro del carrito
    const itemIndex = cart.products.findIndex(p => p.product._id.toString() === pid);

    if (itemIndex !== -1) {
        const item = cart.products[itemIndex];
        
        if (item.quantity > 1) {
            // Si hay más de uno, restamos uno a la cantidad
            item.quantity -= 1;
            return await this.dao.updateAllProducts(cid, cart.products);
        } else {
            // Si hay solo uno, lo eliminamos por completo
            return await this.dao.deleteProductByID(cid, pid);
        }
    }
}
    // 📌 Vaciar carrito
    async emptyCart(cid) {
        return await this.dao.deleteAllProducts(cid);
    }

    // 🧾 Lógica de compra
    async purchase(cid, userEmail) {
        const cart = await this.dao.getProductsFromCartByID(cid);

        let totalAmount = 0;
        const outOfStock = [];

        for (const item of cart.products) {
            const product = item.product;

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                totalAmount += product.price * item.quantity;
            } else {
                outOfStock.push(item.product._id);
            }
        }

        let ticket = null;

        if (totalAmount > 0) {
            ticket = await ticketModel.create({
                code: `TICKET-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
                amount: totalAmount,
                purchaser: userEmail
            });
        }

        const remainingProducts = cart.products.filter(item =>
            outOfStock.some(id => id.equals(item.product._id))
        );

        await this.dao.updateAllProducts(cid, remainingProducts);

        return { ticket, outOfStock };
    }
}