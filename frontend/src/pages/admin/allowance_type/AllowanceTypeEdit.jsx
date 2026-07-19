import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const AllowanceTypeEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [serverError, setServerError] = useState('');
  const [error, setError] = useState('');
    const [roleApi, setRoleApi] = useState(null); // Role dùng cho API
    const navigate = useNavigate();
    const API_URL = null;
    const [errors, setErrors] = useState({});
  
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
    const fetchAllowanceType = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/allowance-types/${id}`;
        const response = await axios.get(API_URL, {
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
        setServerError('Failed to fetch allowance type');
      }
    };
    fetchAllowanceType();
  }, [id, roleApi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/admin/allowance-types/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        navigate('/admin/allowance-types');
      } else {
        setServerError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError(err.response.data.errors);
      } else {
        setServerError('Failed to update allowance type');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Edit Allowance Type</h1>
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
              placeholder="Enter allowance type name"
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
              onClick={() => navigate('/admin/allowance-types')}
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

export default AllowanceTypeEdit;