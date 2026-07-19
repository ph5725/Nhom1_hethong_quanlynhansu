import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const ContractCreate = () => {
  const [formData, setFormData] = useState({
    employee_id: '',
    type: '',
    salary_id: '',
    contract_code: '',
    start_date: '',
    end_date: '',
    sign_date: '',
    contract_file: '',
    status: '',
    note: '',
    year_of_service: '',
  });
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [roleApi, setRoleApi] = useState(null); // Role dùng cho API
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
    const fetchData = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/contracts`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });

        if (response.data.success) {
          setEmployees(response.data.data.employees);
          setSalaries(response.data.data.salaries);
          setContractTypes(response.data.data.contractTypes);
        }
      } catch (err) {
        setServerError('Failed to fetch data');
      }
    };
    fetchData();
  }, [roleApi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/contracts`;
      const response = await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        navigate('/hrm/contracts');
      } else {
        setServerError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setServerError('Failed to create contract');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Add New Contract</h1>
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
            <Form.Label className="form-label">Contract Type</Form.Label>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.type}
            >
              <option value="">Select Contract Type</option>
              {contractTypes.map((contractType) => (
                <option key={contractType.id} value={contractType.id}>
                  {contractType.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Salary Level</Form.Label>
            <Form.Select
              name="salary_id"
              value={formData.salary_id}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.salary_id}
            >
              <option value="">Select Salary Level</option>
              {salaries.map((salary) => (
                <option key={salary.id} value={salary.id}>
                  {salary.salary_level}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.salary_id}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Contract Code</Form.Label>
            <Form.Control
              type="text"
              name="contract_code"
              value={formData.contract_code}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter contract code"
              isInvalid={!!errors.contract_code}
            />
            <Form.Control.Feedback type="invalid">{errors.contract_code}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Start Date</Form.Label>
            <div className="textfield-wrapper">
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="form-control"
                isInvalid={!!errors.start_date}
              />
            </div>
            {errors.start_date && (
              <div className="invalid-feedback d-block">{errors.start_date}</div>
            )}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">End Date</Form.Label>
            <div className="textfield-wrapper">
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="form-control"
                isInvalid={!!errors.end_date}
              />
            </div>
            {errors.end_date && (
              <div className="invalid-feedback d-block">{errors.end_date}</div>
            )}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Sign Date</Form.Label>
            <div className="textfield-wrapper">
              <input
                type="date"
                name="sign_date"
                value={formData.sign_date}
                onChange={handleChange}
                className="form-control"
                isInvalid={!!errors.sign_date}
              />
            </div>
            {errors.sign_date && (
              <div className="invalid-feedback d-block">{errors.sign_date}</div>
            )}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Contract File</Form.Label>
            <Form.Control
              type="text"
              name="contract_file"
              value={formData.contract_file}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter contract file path (optional)"
              isInvalid={!!errors.contract_file}
            />
            <Form.Control.Feedback type="invalid">{errors.contract_file}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Status</Form.Label>
            <Form.Control
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter contract status"
              isInvalid={!!errors.status}
            />
            <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
          </Form.Group>
          {/* <Form.Group className="form-group">
            <Form.Label className="form-label">Years of Service</Form.Label>
            <Form.Control
              type="number"
              name="year_of_service"
              value={formData.year_of_service}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter years of service"
              isInvalid={!!errors.year_of_service}
              min="0"
            />
            <Form.Control.Feedback type="invalid">{errors.year_of_service}</Form.Control.Feedback> */}
          {/* </Form.Group> */}
          <Form.Group className="form-group">
            <Form.Label className="form-label">Note</Form.Label>
            <Form.Control
              as="textarea"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter note (optional)"
              isInvalid={!!errors.note}
            />
            <Form.Control.Feedback type="invalid">{errors.note}</Form.Control.Feedback>
          </Form.Group>
          <div className="form-buttons">
            <Button
              className="btn-cancel"
              onClick={() => navigate('/hrm/contracts')}
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

export default ContractCreate;