import React, { useState, useEffect } from 'react';
import Card from '../../components/admin/Card';
import api from '../../services/chat/api';

const KnowledgeBasePage = () => {
  const [faqs, setFaqs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await api.get('/faqs/');
      if (response.data.success) {
        setFaqs(response.data.faqs);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    }
  };

  const handleAddClick = () => {
    setShowForm(true);
    setEditingFaqId(null);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleEditClick = (faq) => {
    setShowForm(true);
    setEditingFaqId(faq.id);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
  };

  const handleDeleteClick = async (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const response = await api.delete(`/faqs/${faqId}/delete/`);
      if (response.data.success) {
        fetchFaqs();
      } else {
        alert('Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      question: newQuestion,
      answer: newAnswer,
    };
    try {
      let response;
      if (editingFaqId) {
        response = await api.put(`/faqs/${editingFaqId}/update/`, payload);
      } else {
        response = await api.post('/faqs/create/', payload);
      }
      if (response.data.success) {
        setShowForm(false);
        setEditingFaqId(null);
        setNewQuestion('');
        setNewAnswer('');
        fetchFaqs();
      } else {
        alert('Failed to save FAQ');
      }
    } catch (error) {
      console.error('Failed to save FAQ:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFaqId(null);
    setNewQuestion('');
    setNewAnswer('');
  };

  const totalPages = Math.ceil(faqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFaqs = faqs.slice(startIndex, endIndex);

  return (
    <div className="knowledge-base">
      <Card title="Frequently Asked Questions">
        <div className="faq-table-container">
          <table className="kb-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFaqs.map((faq) => (
                <tr key={faq.id}>
                  <td>{faq.question}</td>
                  <td>{faq.answer}</td>
                  <td className="actions actions-horizontal">
                    <button
                      className="btn-link"
                      onClick={() => handleEditClick(faq)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDeleteClick(faq.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {showForm && (
                <tr className="faq-input-row">
                  <td>
                    <textarea
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Enter question"
                      required
                      rows={2}
                      className="faq-textarea"
                    />
                  </td>
                  <td>
                    <textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Enter answer"
                      required
                      rows={2}
                      className="faq-textarea"
                    />
                  </td>
                  <td className="actions actions-form">
                    <button
                      type="submit"
                      className="btn-primary"
                      onClick={handleSubmit}
                    >
                      {editingFaqId ? 'Update' : 'Add'}
                    </button>
                    <button
                      type="button"
                      className="btn-link"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!showForm && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn-link"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn-link"
            >
              Next
            </button>
          </div>
        )}
        {!showForm && (
          <button className="btn-primary" onClick={handleAddClick}>
            ADD FAQ
          </button>
        )}
      </Card>
    </div>
  );
};

export default KnowledgeBasePage;
