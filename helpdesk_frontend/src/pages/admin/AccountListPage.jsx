import React, { useEffect, useState } from 'react';
import { getAllAccounts } from '../../services/auth/accountService';
import '../../style/admin/AccountList.css';

const AccountListPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAllAccounts();
        setAccounts(data.accounts);
      } catch (err) {
        setError('Failed to load accounts.');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  if (loading) return <div>Loading accounts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="account-list-page">
      <h2>Account List</h2>
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
    </div>
  );
};

export default AccountListPage;
