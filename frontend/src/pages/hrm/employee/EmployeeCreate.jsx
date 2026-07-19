import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const EmployeeCreate = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    department_id: '',
    education_id: '',
    position_id: '',
    fullname: '',
    date_of_birth: '',
    gender: '',
    birthplace: '',
    ethnicity: '',
    address: '',
    email: '',
    id_card: '',
    image_path: null,
  });
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [positions, setPositions] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [roleApi, setRoleApi] = useState(null);
  const navigate = useNavigate();

  // Fetch roleApi from localStorage
  useEffect(() => {
    try {
      const storedRoles = JSON.parse(localStorage.getItem('user_roles')) || [];
      if (storedRoles.length === 0) {
        throw new Error('No roles found.');
      }
      setRoleApi(storedRoles[0]);
    } catch (err) {
      console.error('Error fetching roles:', err.message);
      setServerError('Failed to load role. Using default role.');
      setRoleApi('user');
    }
  }, []);

  // Fetch related data (departments, users, education levels, positions)
  useEffect(() => {
    if (!roleApi) return;
    const fetchData = async () => {
      try {
        const [departmentsRes, usersRes, educationLevelsRes, positionsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/${roleApi}/departments`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
          }),
          axios.get(`http://127.0.0.1:8000/api/${roleApi}/users`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
          }),
          axios.get(`http://127.0.0.1:8000/api/${roleApi}/education-levels`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
          }),
          axios.get(`http://127.0.0.1:8000/api/${roleApi}/positions`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
          }),
        ]);

        if (departmentsRes.data.success) setDepartments(departmentsRes.data.data.departments || departmentsRes.data.data);
        if (usersRes.data.success) setUsers(usersRes.data.data);
        if (educationLevelsRes.data.success) setEducationLevels(educationLevelsRes.data.data);
        if (positionsRes.data.success) setPositions(positionsRes.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setServerError('Failed to load related data. Please try again.');
      }
    };
    fetchData();
  }, [roleApi]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setErrors({});

    try {
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/employees`;
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      const response = await axios.post(API_URL, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        navigate('/hrm/employees');
      } else {
        setServerError(response.data.message || 'Failed to create employee.');
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setServerError(err.response?.data?.message || 'Failed to create employee.');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Add New Employee</h1>
        {serverError && <Alert variant="danger" className="error-message">{serverError}</Alert>}
      </div>
      <div className="form-card">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label className="form-label">User</Form.Label>
            <Form.Select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.user_id}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.user_id}</Form.Control.Feedback>
          </Form.Group>
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
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.department_id}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Education Level</Form.Label>
            <Form.Select
              name="education_id"
              value={formData.education_id}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.education_id}
            >
              <option value="">Select Education Level</option>
              {educationLevels.map((educationLevel) => (
                <option key={educationLevel.id} value={educationLevel.id}>
                  {educationLevel.level}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.education_id}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Position</Form.Label>
            <Form.Select
              name="position_id"
              value={formData.position_id}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.position_id}
            >
              <option value="">Select Position</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.position_id}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter full name"
              isInvalid={!!errors.fullname}
            />
            <Form.Control.Feedback type="invalid">{errors.fullname}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Date of Birth</Form.Label>
            <div className="textfield-wrapper">
              <Form.Control
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="form-control"
                isInvalid={!!errors.date_of_birth}
              />
            </div>
            <Form.Control.Feedback type="invalid">{errors.date_of_birth}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Gender</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.gender}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Birthplace</Form.Label>
            <Form.Control
              type="text"
              name="birthplace"
              value={formData.birthplace}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter birthplace"
              isInvalid={!!errors.birthplace}
            />
            <Form.Control.Feedback type="invalid">{errors.birthplace}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Ethnicity</Form.Label>
            <Form.Control
              type="text"
              name="ethnicity"
              value={formData.ethnicity}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter ethnicity"
              isInvalid={!!errors.ethnicity}
            />
            <Form.Control.Feedback type="invalid">{errors.ethnicity}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter address"
              isInvalid={!!errors.address}
            />
            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter email"
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">ID Card</Form.Label>
            <Form.Control
              type="text"
              name="id_card"
              value={formData.id_card}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter ID card number"
              isInvalid={!!errors.id_card}
            />
            <Form.Control.Feedback type="invalid">{errors.id_card}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Image</Form.Label>
            <Form.Control
              type="file"
              name="image_path"
              onChange={handleChange}
              className="form-control"
              accept="image/*"
              isInvalid={!!errors.image_path}
            />
            <Form.Control.Feedback type="invalid">{errors.image_path}</Form.Control.Feedback>
          </Form.Group>
          <div className="form-buttons">
            <Button className="btn-cancel" onClick={() => navigate('/hrm/employees')}>
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

export default EmployeeCreate;