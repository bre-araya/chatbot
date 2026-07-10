import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../../components/admin/Card';
import { fetchDashboardStats } from '../../features/admin/adminThunks';
import './DashboardPage.css';
import CreateAccountFeature from '../../features/auth/CreateAccountFeature';
import { useState } from 'react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { dashboardStats } = useSelector((state) => state.admin);
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  console.log('DashboardPage rendered, dashboardStats:', dashboardStats);

  useEffect(() => {
    console.log('DashboardPage useEffect, dispatching fetchDashboardStats');
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const data = [
    {
      name: 'Total Chats',
      value: dashboardStats.total_chats || 0,
    },
    {
      name: 'Open Tickets',
      value: dashboardStats.open_tickets || 0,
    },
    {
      name: 'New Users',
      value: dashboardStats.new_users || 0,
    },
    {
      name: 'Active Agents',
      value: dashboardStats.active_agents || 0,
    },
  ];

  const handleCreateAccountSuccess = () => {
    setShowCreateAccount(false);
    // Optionally refresh dashboard stats or other data here
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 3 }}>
        <h1 style={{ textAlign: 'center' }}>Dashboard Statistics</h1>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
     
    </div>
  );
};

export default DashboardPage;
