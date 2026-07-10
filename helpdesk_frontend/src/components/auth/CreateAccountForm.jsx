import React from 'react';
import { FaEnvelope, FaLock, FaUser, FaBuilding, FaUserPlus, FaPhone } from 'react-icons/fa';
import '../../style/auth/CreateAccount.css';

const CreateAccountForm = ({ formData, error, success, isSubmitting, onChange, onSubmit, onAccountListClick }) => {
  return (
    <div className="create-account-modal-body">
      <h2 className="create-account-title">
        <FaUserPlus /> Create New Account
      </h2>
      
      {error && (
        <div className="create-account-error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="create-account-success-msg">
          {success}
        </div>
      )}
      
      <div className="registration-container">
        <form id="create-account-form" onSubmit={onSubmit} className="create-account-form">
          <div className="fields-container">
            <div className="fields-left">
              <div className="create-account-field">
                <label className="create-account-label">
                  Full Name
                </label>
                <div className="create-account-input-container">
                  <div className="create-account-icon">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                    className="create-account-input"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="create-account-field">
                <label className="create-account-label">
                  Email Address
                </label>
                <div className="create-account-input-container">
                  <div className="create-account-icon">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                    className="create-account-input"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="create-account-field">
                <label className="create-account-label">
                  Phone
                </label>
                <div className="create-account-input-container">
                  <div className="create-account-icon">
                    <FaPhone />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    required
                    className="create-account-input"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            <div className="fields-right">
              <div className="create-account-field">
                <label className="create-account-label">
                  Role
                </label>
                <div className="create-account-input-container">
                  <div className="create-account-icon">
                    <FaBuilding />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={onChange}
                    required
                    className="create-account-select"
                  >
                    <option value="admin">Admin</option>
                    <option value="technical">Technical Admin</option>
                    <option value="support">customer service</option>
                    <option value="finance">Finance/Accounting</option>
                  </select>
                </div>
              </div>

              <div className="create-account-field">
                <label className="create-account-label">
                  Password
                </label>
                <div className="create-account-input-container">
                  <div className="create-account-icon">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    required
                    minLength="8"
                    className="create-account-input"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div className="create-account-field">
                <label className="create-account-label">
                  Confirm Password
                </label>
                <div className="create-account-input-container">
                  <div className="create-account-icon">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={onChange}
                    required
                    minLength="8"
                    className="create-account-input"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="create-account-submit-container" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="create-account-submit-button"
            >
              {isSubmitting ? 'Creating...' : (
                <>
                  <FaUserPlus /> Create Account
                </>
              )}
            </button>
            <button
              type="button"
              className="create-account-submit-button"
              onClick={onAccountListClick}
              style={{ backgroundColor: '#6b7280' }}
            >
              👥 Account List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountForm;
