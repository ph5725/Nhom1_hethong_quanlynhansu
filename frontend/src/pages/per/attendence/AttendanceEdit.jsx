import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const AttendanceEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    employee_id: '',
    attendance_date: '',
    check_in: '',
    check_out: '',
    status: '',
  });
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const API_URL = 'http://127.0.0.1:8000/api/attendances';
  const EMPLOYEES_URL = 'http://127.0.0.1:8000/api/attendances/employees';

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

  // Lấy thông tin
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchData = async () => {
      try {
        const [attendanceRes, employeesRes] = await Promise.all([
          axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          }),
          axios.get(EMPLOYEES_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          }),
        ]);

        if (attendanceRes.data.success) {
          setFormData({
            employee_id: attendanceRes.data.data.employee_id || '',
            attendance_date: attendanceRes.data.data.attendance_date || '',
            check_in: attendanceRes.data.data.check_in || '',
            check_out: attendanceRes.data.data.check_out || '',
            status: attendanceRes.data.data.status || '',
          });
        } else {
          setServerError(attendanceRes.data.message);
        }

        if (employeesRes.data.success) {
          setEmployees(employeesRes.data.data);
        } else {
          setServerError(employeesRes.data.message);
        }
      } catch (err) {
        setServerError('Failed to fetch data');
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        navigate('/attendances');
      } else {
        setServerError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setServerError('Failed to update attendance');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Edit Attendance Record</h1>
        {serverError && <Alert variant="danger" className="error-message">{serverError}</Alert>}
      </div>
      <div className="form-card">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Employee</Form.Label>
            <Form.Select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.employee_id}
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullname}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.employee_id}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Attendance Date</Form.Label>
            <div className="textfield-wrapper">
              <input
                type="date"
                name="attendance_date"
                value={formData.attendance_date}
                onChange={handleChange}
                className="form-control"
                isInvalid={!!errors.attendance_date}
              />
              <i className="icon bi bi-calendar"></i>
            </div>
            {errors.attendance_date && (
              <div className="invalid-feedback d-block">{errors.attendance_date}</div>
            )}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Check In</Form.Label>
            <div className="textfield-wrapper">
              <input
                type="time"
                name="check_in"
                value={formData.check_in}
                onChange={handleChange}
                className="form-control"
                isInvalid={!!errors.check_in}
              />
              <i className="icon bi bi-clock"></i>
            </div>
            {errors.check_in && (
              <div className="invalid-feedback d-block">{errors.check_in}</div>
            )}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Check Out</Form.Label>
            <div className="textfield-wrapper">
              <input
                type="time"
                name="check_out"
                value={formData.check_out}
                onChange={handleChange}
                className="form-control"
                isInvalid={!!errors.check_out}
              />
              <i className="icon bi bi-clock"></i>
            </div>
            {errors.check_out && (
              <div className="invalid-feedback d-block">{errors.check_out}</div>
            )}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Status</Form.Label>
            <Form.Control
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter status"
              isInvalid={!!errors.status}
            />
            <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
          </Form.Group>
          <div className="form-buttons">
            <Button
              className="btn-cancel"
              onClick={() => navigate('/attendances')}
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

export default AttendanceEdit;