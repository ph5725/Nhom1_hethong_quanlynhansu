import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/Form.css'
import '../../styles/Card.css';

const FmDashboard = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const API_URL = 'http://127.0.0.1:8000/api/fm/dashboard/fm';

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
          <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Financial Management Dashboard</h1>
      {error && <Alert variant="danger" className="error-message">{error}</Alert>}
      <div className="card-container">
        <div className="dashboard-card">
          <div className="card-title">Total Salaries</div>
          <div className="card-value">{data.total_salaries || 0}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Allowances</div>
          <div className="card-value">{data.total_allowances || 0}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Insurances</div>
          <div className="card-value">{data.total_insurances || 0}</div>
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

export default FmDashboard;