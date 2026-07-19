import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const InsuranceEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    type: '',
    default_employee_pct: '',
    default_company_pct: '',
    default_total_pct: '',
    note: '',
  });
  const [insuranceTypes, setInsuranceTypes] = useState([]);
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

  // Lấy thông tin insurance và insurance types
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchData = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/insurances`;
        const [insuranceRes, insurancesRes] = await Promise.all([
          axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          }),
          axios.get(API_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          }),
        ]);

        if (insuranceRes.data.success) {
          setFormData({
            type: insuranceRes.data.data.type || '',
            default_employee_pct: insuranceRes.data.data.default_employee_pct || '',
            default_company_pct: insuranceRes.data.data.default_company_pct || '',
            default_total_pct: insuranceRes.data.data.default_total_pct || '',
            note: insuranceRes.data.data.note || '',
          });
        } else {
          setServerError(insuranceRes.data.message);
        }

        if (insurancesRes.data.success) {
          setInsuranceTypes(insurancesRes.data.data.insuranceTypes);
        } else {
          setServerError(insurancesRes.data.message);
        }
      } catch (err) {
        setServerError('Failed to fetch data');
      }
    };
    fetchData();
  }, [id, roleApi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/insurances`;
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        navigate('/fm/insurances');
      } else {
        setServerError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setServerError('Failed to update insurance');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Edit Insurance</h1>
        {serverError && <Alert variant="danger" className="error-message">{serverError}</Alert>}
      </div>
      <div className="form-card">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Insurance Type</Form.Label>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.type}
            >
              <option value="">Select Insurance Type</option>
              {insuranceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.type}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Employee Percentage</Form.Label>
            <Form.Control
              type="number"
              name="default_employee_pct"
              value={formData.default_employee_pct}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter employee percentage"
              min="0"
              step="0.01"
              isInvalid={!!errors.default_employee_pct}
            />
            <Form.Control.Feedback type="invalid">
              {errors.default_employee_pct}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Company Percentage</Form.Label>
            <Form.Control
              type="number"
              name="default_company_pct"
              value={formData.default_company_pct}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter company percentage"
              min="0"
              step="0.01"
              isInvalid={!!errors.default_company_pct}
            />
            <Form.Control.Feedback type="invalid">
              {errors.default_company_pct}
            </Form.Control.Feedback>
          </Form.Group>
          {/* <Form.Group className="form-group">
            <Form.Label className="form-label">Total Percentage</Form.Label>
            <Form.Control
              type="number"
              name="default_total_pct"
              value={formData.default_total_pct}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter total percentage"
              min="0"
              step="0.01"
              isInvalid={!!errors.default_total_pct}
            />
            <Form.Control.Feedback type="invalid">
              {errors.default_total_pct}
            </Form.Control.Feedback>
          </Form.Group> */}
          <Form.Group className="form-group">
            <Form.Label className="form-label">Note</Form.Label>
            <Form.Control
              as="textarea"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter note"
              isInvalid={!!errors.note}
            />
            <Form.Control.Feedback type="invalid">
              {errors.note}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="form-buttons">
            <Button
              className="btn-cancel"
              onClick={() => navigate('/fm/insurances')}
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

export default InsuranceEdit;