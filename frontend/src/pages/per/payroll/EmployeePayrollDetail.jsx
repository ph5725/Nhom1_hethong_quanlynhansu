import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../../../styles/Form.css';
import '../../../styles/PayrollCard.css';

const EmployeePayrollDetail = () => {
  const [payroll, setPayroll] = useState(null);
  const [error, setError] = useState('');
  const [employeeId, setEmployeeId] = useState(null);

  // Fetch user data to get employee_id
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const USER_URL = 'http://127.0.0.1:8000/api/user';
        const response = await axios.get(USER_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });

        if (response.data.success) {
          const employee = response.data.data.user.employee;
          setEmployeeId(employee.id);
          // Optionally save user data to localStorage for future use
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
        } else {
          setError('Failed to retrieve user data');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch user data';
        if (err.response?.status === 401) {
          setError('Unauthenticated. Please log in.');
        } else {
          setError(errorMessage);
        }
        console.error('Error fetching user data:', err.response ? err.response.data : err.message);
      }
    };

    fetchUserData();
  }, []);

  // Fetch payroll details after getting employee_id
  useEffect(() => {
    if (!employeeId) return;

    const fetchPayroll = async () => {
      try {
        const PAYROLL_URL = 'http://127.0.0.1:8000/api/per/my-payroll';
        const response = await axios.get(PAYROLL_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        setPayroll(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch payroll details';
        if (err.response?.status === 401) {
          setError('Unauthenticated. Please log in.');
        } else if (err.response?.status === 404) {
          setError('No active contract or employee record found.');
        } else {
          setError(errorMessage);
        }
        console.error('Error fetching payroll details:', err.response ? err.response.data : err.message);
      }
    };

    fetchPayroll();
  }, [employeeId]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
  };

  if (!payroll) {
    return (
      <Container className="user-container">
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>My Payroll Details</h1>
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
        {!error && <Alert variant="info">Loading...</Alert>}
      </Container>
    );
  }

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>
          My Payroll Details for {payroll.employee_name || 'N/A'}
        </h1>
      </div>
      {error && <Alert variant="danger" className="error-message">{error}</Alert>}
      <div className="section-title">Basic Pay</div>
      <div className="card-container">
        <div className="payroll-card">
          <div className="card-title">Basic Pay</div>
          <div className="card-currency">{formatCurrency(payroll.basic_pay)}</div>
        </div>
      </div>
      <div className="section-title">Allowances</div>
      <div className="card-container">
        <div className="payroll-card">
          <div className="card-title">Total Allowance</div>
          <div className="card-currency">{formatCurrency(payroll.total_allowance)}</div>
        </div>
      </div>
      <div className="section-title">Insurance & Net Salary</div>
      <div className="card-container">
        <div className="payroll-card">
          <div className="card-title">Insurance Cost</div>
          <div className="card-currency">{formatCurrency(payroll.insurance_cost)}</div>
        </div>
        <div className="payroll-card">
          <div className="card-title">Net Salary</div>
          <div className="card-currency">{formatCurrency(payroll.net_salary)}</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePayrollDetail;