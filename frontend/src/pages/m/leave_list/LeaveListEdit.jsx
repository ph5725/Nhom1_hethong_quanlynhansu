import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const LeaveEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type_id: '',
    request_date: '', // New field
    start_date: '',   // New field
    end_date: '',     // New field
    reason: '',       // New field
    approved_date: '',
    note: '',
    status: '',
  });
  const [employees, setEmployees] = useState([]);
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

  // Lấy thông tin leave và related data
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchData = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/leaves`;
        const [leaveRes, leavesRes] = await Promise.all([
          axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }),
          // API endpoint để lấy danh sách employees và leaveTypes cần được cập nhật
          // Hiện tại bạn đang gọi lại API_URL cho `leavesRes` để lấy employees và leaveTypes.
          // Controller Laravel của bạn (LeaveController@index) trả về cả 'employees' và 'leaveTypes'.
          // Tuy nhiên, nếu bạn muốn chỉ lấy danh sách này một lần mà không cần fetch toàn bộ leaves,
          // bạn có thể tạo một API endpoint riêng (ví dụ: '/api/employees-list' và '/api/leave-types-list')
          // hoặc chỉnh sửa lại hàm index của bạn để chỉ trả về employees và leaveTypes khi cần.
          // Tạm thời, tôi giữ nguyên cách bạn đang lấy danh sách này từ `index` endpoint.
          axios.get(API_URL, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }),
        ]);

        if (leaveRes.data.success) {
          setFormData({
            employee_id: leaveRes.data.data.employee_id || '',
            leave_type_id: leaveRes.data.data.leave_type_id || '',
            request_date: leaveRes.data.data.request_date || '', // New field
            start_date: leaveRes.data.data.start_date || '',     // New field
            end_date: leaveRes.data.data.end_date || '',       // New field
            reason: leaveRes.data.data.reason || '',         // New field
            // approved_by: leaveRes.data.data.approved_by || null, // Nếu cần hiển thị Approved By trong form chỉnh sửa
            approved_date: leaveRes.data.data.approved_date || '',
            note: leaveRes.data.data.note || '',
            status: leaveRes.data.data.status || 'pending',
          });
        } else {
          setServerError(leaveRes.data.message);
        }

        if (leavesRes.data.success) {
          setEmployees(leavesRes.data.data.employees);
          setLeaveTypes(leavesRes.data.data.leaveTypes);
        } else {
          setServerError(leavesRes.data.message);
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
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/leaves`;
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        navigate('/m/leaves');
      } else {
        setServerError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setServerError('Failed to update leave');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Edit Leave Request</h1>
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
          {/* New Fields */}
          <Form.Group className="form-group">
            <Form.Label className="form-label">Request Date</Form.Label>
            <div className="textfield-wrapper">
              <input
                type="date"
                name="request_date"
                value={formData.request_date}
                onChange={handleChange}
                className="form-control"
                isInvalid={!!errors.request_date}
              />
              <i className="icon bi bi-calendar"></i>
            </div>
            {errors.request_date && (
              <div className="invalid-feedback d-block">{errors.request_date}</div>
            )}
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
              <i className="icon bi bi-calendar"></i>
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
              <i className="icon bi bi-calendar"></i>
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

          {/* Existing fields */}
          <Form.Group className="form-group">
            <Form.Label className="form-label">Approved Date</Form.Label>
            <div className="textfield-wrapper">
              <input
                type="date"
                name="approved_date"
                value={formData.approved_date}
                onChange={handleChange}
                className="form-control"
                isInvalid={!!errors.approved_date}
              />
              <i className="icon bi bi-calendar"></i>
            </div>
            {errors.approved_date && (
              <div className="invalid-feedback d-block">{errors.approved_date}</div>
            )}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
              isInvalid={!!errors.status}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
          </Form.Group>
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
              onClick={() => navigate('/m/leaves')}
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

export default LeaveEdit;