import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Table.css';
import '../../../styles/Form.css';

const AllowanceShow = () => {
  const [allowances, setAllowances] = useState([]);
  const [error, setError] = useState('');
  const [roleApi, setRoleApi] = useState(null); // Role dùng cho API
  const navigate = useNavigate();
  
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
  
  // Lấy danh sách allowances
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchAllowances = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/allowances`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setAllowances(response.data.data.allowances); // Truy cập đúng allowances trong data
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch allowances');
      }
    };
    fetchAllowances();
  }, [roleApi]);

  const handleEdit = (id) => {
    navigate(`/fm/allowances/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this allowance?')) {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/allowances`;
        const response = await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setAllowances(allowances.filter((allowance) => allowance.id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to delete allowance');
      }
    }
  };

  return (
    <div className="user-container">
        <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
          <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Allowances</h1>
      {error && <Alert variant="danger" className="error-message">{error}</Alert>}
      <Button
        className="btn-add"
        onClick={() => navigate('/fm/allowances/create')}
      >
        Add
      </Button>
      </div>
      <div className="table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '20px' }}>No.</th>
              <th>Allowance Type</th>
              <th>Amount</th>
              <th>Seniority Based</th>
              <th className="action">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allowances.map((allowance, index) => (
              <tr key={allowance.id}>
                <td>{index + 1}</td>
                <td>{allowance.allowance_type?.name || 'N/A'}</td>
                <td>{allowance.amount}</td>
                <td>{allowance.is_seniority_base ? 'Yes' : 'No'}</td>
                <td className="action">
                  <i
                    className="icon bi bi-pencil"
                    onClick={() => handleEdit(allowance.id)}
                  ></i>
                  <i
                    className="icon bi bi-trash"
                    onClick={() => handleDelete(allowance.id)}
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

export default AllowanceShow;