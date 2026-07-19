import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';
import '../../../styles/PayrollCard.css';

const PayrollDetail = () => {
  const { employeeId } = useParams();
  const [payroll, setPayroll] = useState(null);
  const [error, setError] = useState('');

  // Fetch payroll details
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const PAYROLL_URL = `http://127.0.0.1:8000/api/payrolls/${employeeId}`;
        const response = await axios.get(PAYROLL_URL);

        // Directly set the payroll data since the response doesn't have a 'success' flag
        setPayroll(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch payroll details';
        setError(errorMessage);
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
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>
          Payroll Details
        </h1>
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
        {!error && <Alert variant="info">Loading...</Alert>}
      </Container>
    );
  }

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>
          Payroll Details for {payroll.employee_name || 'N/A'}
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

export default PayrollDetail;