import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { createAccount, getAllAccounts } from '../../services/auth/accountService';
import CreateAccountForm from '../../components/auth/CreateAccountForm';
import '../../style/auth/CreateAccount.css';

const CreateAccountFeature = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'support',
  });

  // Add useEffect to update role if user is logged in and role is available
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role) {
        setFormData(prev => ({ ...prev, role: userData.role }));
      }
    }
  }, []);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Account list state
  const [showAccountList, setShowAccountList] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Full name is required';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!validateEmail(value)) error = 'Please enter a valid email address';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Real-time validation
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      await createAccount(formData);
      setSuccess('Account created successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'support',
      });
      
      // Notify parent component of successful account creation
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccountListClick = async () => {
    setShowAccountList(true);
    setAccountsError('');
    setAccountsLoading(true);

    try {
      const data = await getAllAccounts();
      setAccounts(data.accounts);
    } catch (err) {
      setAccountsError('Failed to load accounts.');
    } finally {
      setAccountsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="create-account-success">
        <div className="create-account-success-icon">
          <FaCheckCircle />
        </div>
        <h2 className="create-account-success-title">Account Created Successfully!</h2>
        <p className="create-account-success-text">
          The new account has been created successfully.
        </p>
        <div>
          <button
            onClick={() => setSuccess('')}
            className="create-account-success-button"
          >
            Create Another Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-account-wrapper">
      <CreateAccountForm
        formData={formData}
        fieldErrors={fieldErrors}
        error={error}
        success={success}
        isSubmitting={isSubmitting}
        passwordStrength={getPasswordStrength(formData.password)}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        onSubmit={handleSubmit}
        onAccountListClick={handleAccountListClick}
      />

      {/* Account List Modal */}
      {showAccountList && (
        <div className="account-list-modal-overlay" onClick={() => setShowAccountList(false)}>
          <div className="account-list-modal" onClick={(e) => e.stopPropagation()}>
            <div className="account-list-modal-header">
              <h3>Account List</h3>
              <button
                className="account-list-modal-close"
                onClick={() => setShowAccountList(false)}
              >
                ×
              </button>
            </div>
            <div className="account-list-modal-content">
              {accountsLoading && <div>Loading accounts...</div>}
              {accountsError && <div className="error">{accountsError}</div>}
              {!accountsLoading && !accountsError && (
                <table className="account-list-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map(account => (
                      <tr key={account.id}>
                        <td>{account.name}</td>
                        <td>{account.email}</td>
                        <td>{account.phone}</td>
                        <td>{account.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccountFeature;
