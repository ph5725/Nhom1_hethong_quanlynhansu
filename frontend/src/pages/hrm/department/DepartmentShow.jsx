import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Table.css';
import '../../../styles/Form.css';

const DepartmentShow = () => {
  const [departments, setDepartments] = useState([]);
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
  
  // Lấy danh sách departments
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchDepartments = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/departments`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setDepartments(response.data.data.departments); // Adjusted to match controller response
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch departments');
      }
    };
    fetchDepartments();
  }, [roleApi]);

  const handleEdit = (id) => {
    navigate(`/hrm/departments/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/departments`;
        const response = await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setDepartments(departments.filter((department) => department.id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to delete department');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Departments</h1>
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
        <Button
          className="btn-add"
          onClick={() => navigate('/hrm/departments/create')}
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
              <th>Address</th>
              <th>Phone</th>
              <th>Manager</th>
              <th className="action">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department, index) => (
              <tr key={department.id}>
                <td>{index + 1}</td>
                <td>{department.name}</td>
                <td>{department.address || 'N/A'}</td>
                <td>{department.phone || 'N/A'}</td>
                <td>{department.manager?.fullname || 'N/A'}</td> {/* Adjusted to match controller's 'manager' relation */}
                <td className="action">
                  <i
                    className="icon bi bi-pencil"
                    onClick={() => handleEdit(department.id)}
                  ></i>
                  <i
                    className="icon bi bi-trash"
                    onClick={() => handleDelete(department.id)}
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

export default DepartmentShow;