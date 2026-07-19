import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const AllowanceEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    allowance_type_id: '',
    amount: '',
    is_seniority_base: false,
  });
  const [allowanceTypes, setAllowanceTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
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

  // Lấy thông tin allowance và allowance types
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchData = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/allowances`;
        const [allowanceRes, allowancesRes] = await Promise.all([
          axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          }),
          axios.get(API_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          }),
        ]);

        if (allowanceRes.data.success) {
          setFormData({
            allowance_type_id: allowanceRes.data.data.allowance_type_id || '',
            amount: allowanceRes.data.data.amount || '',
            is_seniority_base: allowanceRes.data.data.is_seniority_base || false,
          });
        } else {
          setServerError(allowanceRes.data.message);
        }

        if (allowancesRes.data.success) {
          setAllowanceTypes(allowancesRes.data.data.allowanceTypes);
        } else {
          setServerError(allowancesRes.data.message);
        }
      } catch (err) {
        setServerError('Failed to fetch data');
      }
    };
    fetchData();
  }, [id, roleApi]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/allowances`;
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        navigate('/fm/allowances');
      } else {
        setServerError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setServerError('Failed to update allowance');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Edit Allowance</h1>
        {serverError && <Alert variant="danger" className="error-message">{serverError}</Alert>}
      </div>
      <div className="form-card">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Allowance Type</Form.Label>
            <Form.Select
              name="allowance_type_id"
              value={formData.allowance_type_id}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.allowance_type_id}
            >
              <option value="">Select Allowance Type</option>
              {allowanceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.allowance_type_id}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter amount"
              min="0"
              step="0.01"
              isInvalid={!!errors.amount}
            />
            <Form.Control.Feedback type="invalid">
              {errors.amount}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Check
              type="checkbox"
              name="is_seniority_base"
              checked={formData.is_seniority_base}
              onChange={handleChange}
              label="Seniority Based"
              className="form-control"
              isInvalid={!!errors.is_seniority_base}
            />
            <Form.Control.Feedback type="invalid">
              {errors.is_seniority_base}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="form-buttons">
            <Button
              className="btn-cancel"
              onClick={() => navigate('/fm/allowances')}
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

export default AllowanceEdit;