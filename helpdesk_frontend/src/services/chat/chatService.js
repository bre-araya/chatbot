import api from "./api";

export const sendMessage = async (message, session_id = null, email = null) => {
  const payload = { message };
  if (session_id) payload.session_id = session_id;
  if (email) payload.email = email;
  return api.post("/chat/ask/", payload);
};

export const fetchMessages = async (userEmail) => {
  return api.get("/chat/messages", { params: { userEmail } });
};

export const createTicket = async (ticketData) => {
  return api.post("/tickets/create/", ticketData);
};
