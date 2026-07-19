import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Table.css';
import '../../../styles/Form.css';

const RoleShow = () => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [roleApi, setRoleApi] = useState(null); // Role dùng cho API
  const navigate = useNavigate();
  const API_URL = null;

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
    const fetchRoles = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/roles`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setRoles(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch roles');
      }
    };
    fetchRoles();
  }, [roleApi]);

  const handleEdit = (id) => {
    navigate(`/admin/roles/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/roles/${id}`;
        const response = await axios.delete(`${API_URL}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setRoles(roles.filter((role) => role.id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to delete role');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Roles</h1>
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
        <Button
          className="btn-add"
          onClick={() => navigate('/admin/roles/create')}
        >
          Add
        </Button>
      </div>
      <div className="table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '20px' }}>No.</th>
              <th>Name</th>
              <th>Guard Name</th>
              <th>Description</th>
              <th className="action">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={role.id}>
                <td>{index + 1}</td>
                <td>{role.name}</td>
                <td>{role.guard_name}</td>
                <td>{role.description || 'N/A'}</td>
                <td className="action">
                  <i
                    className="icon bi bi-pencil"
                    onClick={() => handleEdit(role.id)}
                  ></i>
                  <i
                    className="icon bi bi-trash"
                    onClick={() => handleDelete(role.id)}
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

export default RoleShow;