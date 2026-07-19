import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const WorkDateStatusEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
    const fetchWorkDateStatus = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/work-date-statuses`;
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setFormData({
            name: response.data.data.name,
            description: response.data.data.description || '',
          });
        } else {
          setServerError(response.data.message);
        }
      } catch (err) {
        setServerError('Failed to fetch work date status');
      }
    };
    fetchWorkDateStatus();
  }, [id, roleApi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/work-date-statuses`;
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        navigate('/admin/work-date-statuses');
      } else {
        setServerError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setServerError('Failed to update work date status');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Edit Work Date Status</h1>
        {serverError && <Alert variant="danger" className="error-message">{serverError}</Alert>}
      </div>
      <div className="form-card">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter work date status name"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter description"
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="form-buttons">
            <Button
              className="btn-cancel"
              onClick={() => navigate('/admin/work-date-statuses')}
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

export default WorkDateStatusEdit;