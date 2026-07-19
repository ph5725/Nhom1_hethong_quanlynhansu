import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/Form.css'
import '../../styles/Card.css';

const PerDashboard = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const API_URL = 'http://127.0.0.1:8000/api/per/dashboard/personal';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="user-container">
        <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
          <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Employee Dashboard</h1>
      {error && <Alert variant="danger" className="error-message">{error}</Alert>}
      <div className="card-container">
        <div className="dashboard-card">
          <div className="card-title">Total Attendances</div>
          <div className="card-value">{data.total_attendances || 0}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Tasks</div>
          <div className="card-value">{data.total_tasks || 0}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Leaves Applied</div>
          <div className="card-value">{data.total_leaves_applied || 0}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Schedules</div>
          <div className="card-value">{data.total_schedules || 0}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Net Salary</div>
          <div className="card-currency">{formatCurrency(data.net_salary || 0)}</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PerDashboard;