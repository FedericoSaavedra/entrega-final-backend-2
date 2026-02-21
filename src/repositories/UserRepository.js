
export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getUserById(id) {
        return await this.dao.getById(id);
    }

    async createUser(userDto) {
        // Aquí podrías agregar lógica extra antes de guardar
        return await this.dao.create(userDto);
    }
}