import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const WorkScheduleCreate = () => {
  const [formData, setFormData] = useState({
    department_id: '',
    employee_id: '',
    shift_id: '',
    status_id: '',
    work_date: '',
    is_day_off: false,
  });
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [workShifts, setWorkShifts] = useState([]);
  const [workDateStatuses, setWorkDateStatuses] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [noEmployeesMessage, setNoEmployeesMessage] = useState('');
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

  // Lấy danh sách related data
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchData = async () => {
      try {
        const SCHEDULE_API_URL = `http://127.0.0.1:8000/api/${roleApi}/work-schedules`;
        const EMPLOYEES_API_URL = `http://127.0.0.1:8000/api/${roleApi}/employees`;
        const [workSchedulesRes, employeesRes] = await Promise.all([
          axios.get(SCHEDULE_API_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          }),
          axios.get(EMPLOYEES_API_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
          }),
        ]);

        if (workSchedulesRes.data.success) {
          setDepartments(workSchedulesRes.data.data.departments);
          setWorkShifts(workSchedulesRes.data.data.workShifts);
          setWorkDateStatuses(workSchedulesRes.data.data.workDateStatuses);
        } else {
          setServerError(workSchedulesRes.data.message);
        }

        if (employeesRes.data.success) {
          setEmployees(employeesRes.data.data); // Lấy danh sách nhân viên từ endpoint employees
        } else {
          setServerError(employeesRes.data.message);
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        setServerError('Failed to fetch data');
      }
    };
    fetchData();
  }, [roleApi]);

  // Lọc nhân viên theo department_id
  useEffect(() => {
    if (formData.department_id) {
      const filtered = employees.filter((employee) => {
        const departmentIdMatch = employee.department_id === parseInt(formData.department_id);
        return departmentIdMatch;
      });
      setFilteredEmployees(filtered);
      setNoEmployeesMessage(filtered.length === 0 ? 'Không tìm thấy nhân viên cho phòng ban này' : '');
      setFormData((prev) => ({ ...prev, employee_id: '' }));
    } else {
      setFilteredEmployees([]);
      setNoEmployeesMessage('');
      setFormData((prev) => ({ ...prev, employee_id: '' }));
    }
  }, [formData.department_id, employees]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/work-schedules`;
      const response = await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        navigate('/hrm/work-schedules');
      } else {
        setServerError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setServerError('Failed to create work schedule');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Add New Work Schedule</h1>
        {serverError && <Alert variant="danger" className="error-message">{serverError}</Alert>}
        {noEmployeesMessage && (
          <Alert variant="warning" className="error-message">
            {noEmployeesMessage}
          </Alert>
        )}
      </div>
      <div className="form-card">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Department</Form.Label>
            <Form.Select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.department_id}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.department_id}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Employee</Form.Label>
            <Form.Select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.employee_id}
              disabled={!formData.department_id}
            >
              <option value="">Select Employee</option>
              {filteredEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullname}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.employee_id}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Work Shift</Form.Label>
            <Form.Select
              name="shift_id"
              value={formData.shift_id}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.shift_id}
            >
              <option value="">Select Work Shift</option>
              {workShifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.shift_name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.shift_id}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Work Date Status</Form.Label>
            <Form.Select
              name="status_id"
              value={formData.status_id}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.status_id}
            >
              <option value="">Select Work Date Status</option>
              {workDateStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.status_id}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Work Date</Form.Label>
            <div className="textfield-wrapper">
              <input
                type="date"
                name="work_date"
                value={formData.work_date}
                onChange={handleChange}
                className="form-control"
                isInvalid={!!errors.work_date}
              />
            </div>
            {errors.work_date && (
              <div className="invalid-feedback d-block">{errors.work_date}</div>
            )}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Check
              type="checkbox"
              name="is_day_off"
              checked={formData.is_day_off}
              onChange={handleChange}
              label="Is Day Off"
              className="form-check"
              isInvalid={!!errors.is_day_off}
            />
            <Form.Control.Feedback type="invalid">{errors.is_day_off}</Form.Control.Feedback>
          </Form.Group>
          <div className="form-buttons">
            <Button
              className="btn-cancel"
              onClick={() => navigate('/hrm/work-schedules')}
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

export default WorkScheduleCreate;