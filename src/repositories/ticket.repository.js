
export default class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async createTicket(ticketData) {
        // Lógica de negocio: generar código único antes de persistir
        ticketData.code = `TICKET-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        return await this.dao.create(ticketData);
    }
}