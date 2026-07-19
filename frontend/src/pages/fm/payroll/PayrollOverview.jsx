import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Form.css';
import '../../../styles/Table.css';

const PayrollOverview = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [error, setError] = useState('');
    const navigate = useNavigate();
    const [roleApi, setRoleApi] = useState(null); // Role dùng cho API
    const PAYROLL_URL = null;
    
    // Lấy roleApi từ localStorage
    useEffect(() => {
      try {
        const storedRoles = JSON.parse(localStorage.getItem('user_roles')) || [];
        if (!storedRoles.length) {
          throw new Error('Không tìm thấy roles.');
        }
        setRoleApi(storedRoles[0]); // Chọn role đầu tiên
      } catch (err) {
        console.error('Lỗi lấy roles:', err.message);
        setError('Không load được role. Dùng role mặc định.');
        setRoleApi('user'); // Role mặc định
      }
    }, []);
    
    // Lấy danh sách
    useEffect(() => {
      if (!roleApi) return; // Chờ roleApi được set
    const fetchPayrolls = async () => {
      try {
        const PAYROLL_URL = `http://127.0.0.1:8000/api/${roleApi}/payrolls`;
        const response = await axios.get(PAYROLL_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });

        if (response.data.success) {
          setPayrolls(response.data.data);
        } else {
          setError(response.data.error || 'Failed to fetch payroll data');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch payroll data';
        if (err.response?.status === 401) {
          setError('Unauthenticated. Please log in.');
        } else if (err.response?.status === 403) {
          setError('Unauthorized. Only admins or HR can view all payrolls.');
        } else {
          setError(errorMessage);
        }
        console.error('Error fetching payroll overview:', err.response ? err.response.data : err.message);
      }
    };

    fetchPayrolls();
  }, [roleApi]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Payroll Overview</h1>
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
      </div>
      <div className="table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '20px' }}>No.</th>
              <th>Employee</th>
              <th>Basic Pay</th>
              <th>Total Allowance</th>
              <th>Insurance Cost</th>
              <th>Net Salary</th>
              <th style={{ width: '120px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No payroll data available.
                </td>
              </tr>
            ) : (
              payrolls.map((payroll, index) => (
                <tr key={payroll.employee_id}>
                  <td>{index + 1}</td>
                  <td>{payroll.employee_name || 'N/A'}</td>
                  <td>{formatCurrency(payroll.basic_pay)}</td>
                  <td>{formatCurrency(payroll.total_allowance)}</td>
                  <td>{formatCurrency(payroll.insurance_cost)}</td>
                  <td>{formatCurrency(payroll.net_salary)}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/fm/payroll/detail/${payroll.employee_id}`)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default PayrollOverview;