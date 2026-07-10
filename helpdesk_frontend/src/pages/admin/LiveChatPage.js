import React, { useState, useEffect } from 'react';
import { fetchAllTickets, updateTicketAnswer, updateTicketAssignment, deleteTicket } from '../../services/chat/ticketService';
import '../../style/admin/TicketsTable.css';
import '../../style/chat/AnswerField.css';

const LiveChatPage = ({ currentRole }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [updating, setUpdating] = useState(false);
  const [selectedTicketForAssignment, setSelectedTicketForAssignment] = useState(null);
  const [assignmentValue, setAssignmentValue] = useState('');

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const ticketData = await fetchAllTickets(currentRole);
        setTickets(ticketData);
      } catch (err) {
        setError('Failed to load tickets');
        console.error('Error loading tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [currentRole]);

  const handleRowClick = (ticket) => {
    if (currentRole === 'admin') {
      if (ticket.status === 'open') {
        setSelectedTicketForAssignment(ticket);
        setAssignmentValue(ticket.assignment || 'unassigned');
      } else if (ticket.status === 'resolved') {
        const subject = encodeURIComponent(ticket.question);
        const body = encodeURIComponent(ticket.answer);
        const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${ticket.email}&su=${subject}&body=${body}`;
        window.open(mailtoUrl, '_blank');
      }
    } else if (currentRole !== 'admin' && ticket.status === 'open') {
      setSelectedTicket(ticket);
      setAnswerText(ticket.answer || '');
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedTicket || !answerText.trim()) return;

    setUpdating(true);
    try {
      await updateTicketAnswer(selectedTicket.ticket_id, answerText.trim());
      // Update the ticket in the local state
      setTickets(tickets.map(ticket =>
        ticket.ticket_id === selectedTicket.ticket_id
          ? { ...ticket, answer: answerText.trim(), status: 'resolved' }
          : ticket
      ));
      setSelectedTicket(null);
      setAnswerText('');
    } catch (err) {
      console.error('Error updating answer:', err);
      alert('Failed to update answer. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setAnswerText('');
  };

  if (loading) {
    return <div className="tickets-container">Loading tickets...</div>;
  }

  if (error) {
    return <div className="tickets-container">Error: {error}</div>;
  }

  const handleAssignmentChange = async (e) => {
    const newAssignment = e.target.value;
    setAssignmentValue(newAssignment);
  };

  const handleAssignmentSubmit = async () => {
    if (!selectedTicketForAssignment) return;

    try {
      await updateTicketAssignment(selectedTicketForAssignment.ticket_id, assignmentValue);
      setTickets(tickets.map(t =>
        t.ticket_id === selectedTicketForAssignment.ticket_id ? { ...t, assignment: assignmentValue } : t
      ));
      setSelectedTicketForAssignment(null);
      setAssignmentValue('');
    } catch (error) {
      alert('Failed to update assignment. Please try again.');
    }
  };

  const closeAssignmentModal = () => {
    setSelectedTicketForAssignment(null);
    setAssignmentValue('');
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteTicket(ticketId);
      setTickets(tickets.filter(ticket => ticket.ticket_id !== ticketId));
    } catch (error) {
      alert('Failed to delete ticket. Please try again.');
      console.error('Error deleting ticket:', error);
    }
  };

  return (
    <div className="tickets-container">
      <h3 style={{ textAlign: 'center' }}>All Tickets ({tickets.length})</h3>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Question</th>
                <th>Email</th>
                <th>Status</th>
                <th>Assignment</th>
                {tickets.some(ticket => ticket.status !== 'open') && <th>Answer</th>}
                {currentRole === 'admin' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.ticket_id}
                  onClick={() => handleRowClick(ticket)}
                  style={{ cursor: (currentRole === 'technical' || currentRole === 'admin') ? 'pointer' : 'default' }}
                >
                  <td>{ticket.ticket_id}</td>
                  <td>{ticket.question}</td>
                  <td>{ticket.email}</td>
                  <td>{ticket.status}</td>
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentRole === 'admin') {
                        setSelectedTicketForAssignment(ticket);
                        setAssignmentValue(ticket.assignment || 'unassigned');
                      }
                    }}
                    style={{ cursor: currentRole === 'admin' ? 'pointer' : 'default' }}
                  >
                    <button
                      className="assignment-button"
                      disabled={currentRole !== 'admin'}
                      title={currentRole === 'admin' ? 'Click to change assignment' : 'Only admin can change assignment'}
                    >
                      {ticket.assignment || 'unassigned'}
                    </button>
                  </td>
                  {tickets.some(t => t.status !== 'open') && <td>{ticket.status !== 'open' ? (ticket.answer || 'N/A') : ''}</td>}
                  {currentRole === 'admin' && (
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ticket.ticket_id);
                        }}
                        className="delete-ticket-button"
                        style={{ color: 'red', cursor: 'pointer' }}
                        title="Delete Ticket"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Answer Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Enter here your answer for Ticket {selectedTicket.ticket_id}</h4>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              className="answer-textarea"
            />
            <div className="modal-buttons">
              <button onClick={closeModal} disabled={updating}>Cancel</button>
              <button onClick={handleAnswerSubmit} disabled={updating || !answerText.trim()}>
                {updating ? 'Updating...' : 'Submit Answer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {selectedTicketForAssignment && (
        <div className="modal-overlay" onClick={closeAssignmentModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Assign Ticket {selectedTicketForAssignment.ticket_id}</h4>
            <select
              value={assignmentValue}
              onChange={handleAssignmentChange}
            >
              <option value="unassigned">Unassigned</option>
              <option value="admin">Admin</option>
              <option value="technical">Technical Admin</option>
              <option value="support">Customer Service</option>
              <option value="finance">Finance/Accounting</option>
            </select>
            <div className="modal-buttons">
              <button onClick={closeAssignmentModal}>Cancel</button>
              <button onClick={handleAssignmentSubmit}>
                Update Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChatPage;
