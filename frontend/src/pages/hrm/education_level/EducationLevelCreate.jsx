import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const EducationLevelCreate = () => {
  const [formData, setFormData] = useState({
    level: '',
    major: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/education-levels`;
      const response = await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        navigate('/hrm/education-levels');
      } else {
        setServerError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setServerError('Failed to create education level');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Add Mew Education Level</h1>
        {serverError && <Alert variant="danger" className="error-message">{serverError}</Alert>}
      </div>
      <div className="form-card">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Level</Form.Label>
            <Form.Control
              type="text"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter education level"
              isInvalid={!!errors.level}
            />
            <Form.Control.Feedback type="invalid">
              {errors.level}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Major</Form.Label>
            <Form.Control
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter major"
              isInvalid={!!errors.major}
            />
            <Form.Control.Feedback type="invalid">
              {errors.major}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="form-buttons">
            <Button
              className="btn-cancel"
              onClick={() => navigate('/hrm/education-levels')}
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

export default EducationLevelCreate;