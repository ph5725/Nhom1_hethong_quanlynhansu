import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const SalaryEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    salary_level: '',
    basic_salary: '',
    base_coefficient: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
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

  // Lấy thông tin
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchSalary = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/salaries`;
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setFormData({
            salary_level: response.data.data.salary_level,
            basic_salary: response.data.data.basic_salary,
            base_coefficient: response.data.data.base_coefficient,
          });
        } else {
          setServerError(response.data.message);
        }
      } catch (err) {
        setServerError('Failed to fetch salary');
      }
    };
    fetchSalary();
  }, [id, roleApi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/salaries`;
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        navigate('/fm/salaries');
      } else {
        setServerError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setServerError('Failed to update salary');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Edit Salary</h1>
        {serverError && <Alert variant="danger" className="error-message">{serverError}</Alert>}
      </div>
      <div className="form-card">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Salary Level</Form.Label>
            <Form.Control
              type="text"
              name="salary_level"
              value={formData.salary_level}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter salary level"
              isInvalid={!!errors.salary_level}
            />
            <Form.Control.Feedback type="invalid">
              {errors.salary_level}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Basic Salary</Form.Label>
            <Form.Control
              type="number"
              name="basic_salary"
              value={formData.basic_salary}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter basic salary"
              min="0"
              step="0.01"
              isInvalid={!!errors.basic_salary}
            />
            <Form.Control.Feedback type="invalid">
              {errors.basic_salary}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Base Coefficient</Form.Label>
            <Form.Control
              type="number"
              name="base_coefficient"
              value={formData.base_coefficient}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter base coefficient"
              min="0"
              step="0.01"
              isInvalid={!!errors.base_coefficient}
            />
            <Form.Control.Feedback type="invalid">
              {errors.base_coefficient}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="form-buttons">
            <Button
              className="btn-cancel"
              onClick={() => navigate('/fm/salaries')}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-save">
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SalaryEdit;