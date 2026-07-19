import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const WorkShiftEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    shift_name: '',
    start_time: '',
    end_time: '',
    break_time: '',
  });
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});
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
    const fetchWorkShift = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/work-shifts`;
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setFormData({
            shift_name: response.data.data.shift_name,
            start_time: response.data.data.start_time,
            end_time: response.data.data.end_time,
            break_time: response.data.data.break_time,
          });
        } else {
          setServerError(response.data.message);
        }
      } catch (err) {
        setServerError('Failed to fetch work shift');
      }
    };
    fetchWorkShift();
  }, [id, roleApi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/work-shifts`;
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        navigate('/admin/work-shifts');
      } else {
        setServerError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setServerError('Failed to update work shift');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Edit Work Shift</h1>
        {serverError && <Alert variant="danger" className="error-message">{serverError}</Alert>}
      </div>
      <div className="form-card">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Shift Name</Form.Label>
            <Form.Control
              type="text"
              name="shift_name"
              value={formData.shift_name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter shift name"
              isInvalid={!!errors.shift_name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.shift_name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Start Time</Form.Label>
            <Form.Control
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="form-control"
              isInvalid={!!errors.start_time}
            />
            <Form.Control.Feedback type="invalid">
              {errors.start_time}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">End Time</Form.Label>
            <Form.Control
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="form-control"
              isInvalid={!!errors.end_time}
            />
            <Form.Control.Feedback type="invalid">
              {errors.end_time}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Break Time (minutes)</Form.Label>
            <Form.Control
              type="number"
              name="break_time"
              value={formData.break_time}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter break time in minutes"
              min="0"
              isInvalid={!!errors.break_time}
            />
            <Form.Control.Feedback type="invalid">
              {errors.break_time}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="form-buttons">
            <Button
              className="btn-cancel"
              onClick={() => navigate('/admin/work-shifts')}
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

export default WorkShiftEdit;