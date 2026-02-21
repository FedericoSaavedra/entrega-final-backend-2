// src/repositories/CartRepository.js
export default class CartRepository {
    constructor(dao) {
        this.dao = dao; // Recibe el cartDBManager
    }

    async getCart(id) {
        return await this.dao.getProductsFromCartByID(id);
    }

    async create() {
        return await this.dao.createCart();
    }

    async addProduct(cid, pid) {
        return await this.dao.addProductByID(cid, pid);
    }

    async updateAll(cid, products) {
        return await this.dao.updateAllProducts(cid, products);
    }

    async updateQuantity(cid, pid, quantity) {
        return await this.dao.updateProductByID(cid, pid, quantity);
    }

    async deleteProduct(cid, pid) {
        return await this.dao.deleteProductByID(cid, pid);
    }

    async emptyCart(cid) {
        return await this.dao.deleteAllProducts(cid);
    }

    // Aquí irá la lógica de purchase (Ticket) solicitada en la entrega
    async purchase(cid, userEmail) {
        // Lógica de negocio para validar stock y generar ticket
    }
}