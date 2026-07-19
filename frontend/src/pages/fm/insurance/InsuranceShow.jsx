import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Table.css';
import '../../../styles/Form.css';

const InsuranceShow = () => {
  const [insurances, setInsurances] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [roleApi, setRoleApi] = useState(null); // Role dùng cho API
  
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
  
  // Lấy danh sách insurances
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchInsurances = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/insurances`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setInsurances(response.data.data.insurances); // Truy cập đúng insurances trong data
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch insurances');
      }
    };
    fetchInsurances();
  }, [roleApi]);

  const handleEdit = async (id) => {
    navigate(`/fm/insurances/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this insurance?')) {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/insurances`;
        const response = await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setInsurances(insurances.filter((insurance) => insurance.id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to delete insurance');
      }
    }
  };

  return (
    <div className="user-container">
        <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
          <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Insurances</h1>
      {error && <Alert variant="danger" className="error-message">{error}</Alert>}
      <Button
        className="btn-add"
        onClick={() => navigate('/fm/insurances/create')}
      >
        Add
      </Button>
      </div>
      <div className="table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '20px' }}>No.</th>
              <th>Insurance Type</th>
              <th>Employee %</th>
              <th>Company %</th>
              <th>Total %</th>
              <th>Note</th>
              <th className="action">Actions</th>
            </tr>
          </thead>
          <tbody>
            {insurances.map((insurance, index) => (
              <tr key={insurance.id}>
                <td>{index + 1}</td>
                <td>{insurance.insurance_type?.name || 'N/A'}</td>
                <td>{insurance.default_employee_pct}</td>
                <td>{insurance.default_company_pct}</td>
                <td>{insurance.default_total_pct}</td>
                <td>{insurance.note || 'N/A'}</td>
                <td className="action">
                  <i
                    className="icon bi bi-pencil"
                    onClick={() => handleEdit(insurance.id)}
                  ></i>
                  <i
                    className="icon bi-trash"
                    onClick={() => handleDelete(insurance.id)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default InsuranceShow;