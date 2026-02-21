// src/repositories/products.repository.js
export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }
    async getAll(params) { return await this.dao.getAllProducts(params); }
    async getById(id) { return await this.dao.getProductByID(id); }
    async update(id, data) { return await this.dao.updateProduct(id, data); }
}