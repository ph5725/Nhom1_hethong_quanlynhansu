import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Table.css';
import '../../../styles/Form.css';

const EmployeeShow = () => {
  const [employees, setEmployees] = useState([]);
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

  // Lấy danh sách employees
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchEmployees = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/employees`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setEmployees(response.data.data); // Adjusted to match controller response
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch employees');
      }
    };
    fetchEmployees();
  }, [roleApi]);

  const handleEdit = (id) => {
    navigate(`/hrm/employees/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/employees`;
        const response = await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setEmployees(employees.filter((employee) => employee.id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Employees</h1>
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
        <Button
          className="btn-add"
          onClick={() => navigate('/hrm/employees/create')}
        >
          Add
        </Button>
      </div>
      <div className="table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '20px' }}>No.</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>User</th>
              <th>Education Level</th>
              <th>Position</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Birthplace</th>
              <th>Ethnicity</th>
              <th>Address</th>
              <th>Email</th>
              <th>ID Card</th>
              <th>Image</th>
              <th className="action">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={employee.id}>
                <td>{index + 1}</td>
                <td>{employee.fullname}</td>
                <td>{employee.department?.name || 'N/A'}</td>
                <td>{employee.user?.name || 'N/A'}</td>
                <td>{employee.education_level?.level || 'N/A'}</td>
                <td>{employee.position?.name || 'N/A'}</td>
                <td>{employee.date_of_birth}</td>
                <td>{employee.gender}</td>
                <td>{employee.birthplace}</td>
                <td>{employee.ethnicity}</td>
                <td>{employee.address}</td>
                <td>{employee.email}</td>
                <td>{employee.id_card || 'N/A'}</td>
                <td>
                  {employee.image_path ? (
                    <img src={employee.image_path} alt="Employee" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="action">
                  <i
                    className="icon bi bi-pencil"
                    onClick={() => handleEdit(employee.id)}
                  ></i>
                  <i
                    className="icon bi bi-trash"
                    onClick={() => handleDelete(employee.id)}
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

export default EmployeeShow;