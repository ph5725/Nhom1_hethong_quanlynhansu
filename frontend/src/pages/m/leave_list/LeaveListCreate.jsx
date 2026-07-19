import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const LeaveCreate = () => {
  const [formData, setFormData] = useState({
    // employee_id: '', // Bỏ trường này nếu đây là form cho nhân viên tự submit
    // Nếu là form cho HR/Admin tạo hộ, thì giữ lại và cần thêm logic để lấy employee_id từ input
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    note: '',
    // request_date, status, approved_by, approved_date sẽ được server tự động điền
  });
  const [employees, setEmployees] = useState([]); // Có thể không cần nếu là form tự submit
  const [leaveTypes, setLeaveTypes] = useState([]);
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

  // Lấy danh sách related data (chủ yếu là Leave Types)
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchData = async () => {
      try {
        // Tối ưu: Nếu chỉ cần leave types và employees cho form này,
        // thì nên tạo một endpoint riêng trên Laravel để chỉ trả về những dữ liệu cần thiết.
        // Hiện tại, controller 'index' trả về cả leaves, employees và leaveTypes.
        // Tùy theo quyền hạn của `roleApi`, bạn có thể gọi endpoint phù hợp.
        // Ví dụ, nếu employee tự submit, họ chỉ cần leave types.
        // Nếu admin/HR tạo, họ cần cả employee list và leave types.
        let API_URL_FOR_LOOKUPS = `http://127.0.0.1:8000/api/${roleApi}/leaves`; // Hoặc endpoint khác chuyên biệt
        const response = await axios.get(API_URL_FOR_LOOKUPS, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          // Chỉ set nếu có dữ liệu
          if (response.data.data.employees) {
            setEmployees(response.data.data.employees);
          }
          if (response.data.data.leaveTypes) {
            setLeaveTypes(response.data.data.leaveTypes);
          }
        } else {
          setServerError(response.data.message);
        }
      } catch (err) {
        setServerError('Failed to fetch initial data for form');
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
      // Đối với nhân viên tự submit, route là 'leaves/submit'
      // Đối với Admin/HR tạo hộ, route là 'leaves' (phương thức POST)
      const submitEndpoint = (roleApi === 'employee') ? 'leaves/submit' : 'leaves';
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/${submitEndpoint}`;

      // Nếu là form tự submit cho nhân viên, không cần gửi employee_id, request_date, status.
      // Laravel controller (submitLeaveRequest) sẽ tự động điền chúng.
      const dataToSend = (roleApi === 'employee') ? {
          leave_type_id: formData.leave_type_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          reason: formData.reason,
          note: formData.note,
      } : formData; // Nếu là admin/HR, gửi toàn bộ formData

      const response = await axios.post(API_URL, dataToSend, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        navigate('/m/leaves'); // Điều hướng về trang danh sách
      } else {
        setServerError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setServerError(err.response?.data?.message || 'Failed to create leave request');
      }
    }
  };

  // Logic để hiển thị trường employee_id chỉ khi roleApi không phải là 'employee'
  const isEmployeeRole = roleApi === 'employee';

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Create Leave Request</h1>
        {serverError && <Alert variant="danger" className="error-message">{serverError}</Alert>}
      </div>
      <div className="form-card">
        <Form onSubmit={handleSubmit}>
          {!isEmployeeRole && ( // Chỉ hiển thị trường Employee nếu không phải là vai trò 'employee'
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
          )}

          <Form.Group className="form-group">
            <Form.Label className="form-label">Leave Type</Form.Label>
            <Form.Select
              name="leave_type_id"
              value={formData.leave_type_id}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.leave_type_id}
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.map((leaveType) => (
                <option key={leaveType.id} value={leaveType.id}>
                  {leaveType.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.leave_type_id}</Form.Control.Feedback>
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
            <Form.Label className="form-label">Reason</Form.Label>
            <Form.Control
              as="textarea"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter reason for leave"
              isInvalid={!!errors.reason}
            />
            <Form.Control.Feedback type="invalid">{errors.reason}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label className="form-label">Note</Form.Label>
            <Form.Control
              as="textarea"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter any additional notes (optional)"
              isInvalid={!!errors.note}
            />
            <Form.Control.Feedback type="invalid">{errors.note}</Form.Control.Feedback>
          </Form.Group>

          {/* Các trường request_date, approved_date, approved_by, status sẽ được Laravel Controller tự động điền */}
          {/* Không cần hiển thị chúng trong form tạo mới */}

          <div className="form-buttons">
            <Button
              className="btn-cancel"
              onClick={() => navigate('/m/leaves')}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-save">
              Submit Leave Request
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LeaveCreate;