import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/Form.css'
import '../../styles/Card.css';

const HrmDashboard = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const API_URL = 'http://127.0.0.1:8000/api/hrm/dashboard/hrm';

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
          <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>HRM Dashboard</h1>
      {error && <Alert variant="danger" className="error-message">{error}</Alert>}
      <div className="card-container">
        <div className="dashboard-card">
          <div className="card-title">Total Contracts</div>
          <div className="card-value">{data.total_contracts || 0}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Employees</div>
          <div className="card-value">{data.total_employees || 0}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Positions</div>
          <div className="card-value">{data.total_positions || 0}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Departments</div>
          <div className="card-value">{data.total_departments || 0}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Education Levels</div>
          <div className="card-value">{data.total_education_levels || 0}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Work Schedules</div>
          <div className="card-value">{data.total_work_schedules || 0}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Net Salary</div>
          <div className="card-currency">{formatCurrency(data.total_net_salary || 0)}</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HrmDashboard;