import api from './api';

export const fetchAllTickets = async (role = null) => {
  try {
    const params = role ? { role } : {};
    const response = await api.get('/tickets/all/', { params });
    return response.data.tickets;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const updateTicketAnswer = async (ticketId, answer) => {
  try {
    const response = await api.patch('/tickets/' + ticketId + '/', { answer });
    return response.data.ticket;
  } catch (error) {
    console.error('Error updating ticket answer:', error);
    throw error;
  }
};

export const updateTicketAssignment = async (ticketId, assignment) => {
  try {
    const response = await api.patch('/tickets/' + ticketId + '/assignment/', { assignment });
    return response.data.ticket;
  } catch (error) {
    console.error('Error updating ticket assignment:', error);
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    const response = await api.delete('/tickets/' + ticketId + '/delete/');
    return response.data;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};
