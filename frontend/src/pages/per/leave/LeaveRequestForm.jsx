// LeaveRequestForm.jsx
import React, { useState, useEffect } from 'react';
import { FaRegCalendarAlt, FaPlus } from 'react-icons/fa'; // Import icons
import Swal from 'sweetalert2'; // Để hiển thị thông báo thành công/lỗi đẹp hơn

// Bạn có thể tạo một file CSS riêng (ví dụ: Form.css)
// và import nó vào đây, hoặc đặt CSS chung vào App.css
import './Form.css'; // Đảm bảo đường dẫn này đúng

const API_BASE_URL = 'http://localhost:8000/api'; // THAY THẾ BẰNG URL API THỰC TẾ CỦA BẠN

const LeaveRequestForm = ({ onLeaveSubmitted }) => {
  const [formData, setFormData] = useState({
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    note: '',
  });
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    const token = localStorage.getItem('authToken'); // Lấy token từ localStorage
    if (!token) {
      console.error('Authentication token not found.');
      Swal.fire('Error', 'Authentication token not found. Please log in.', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/leave-types`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setLeaveTypes(data.data);
      } else {
        console.error('Failed to fetch leave types:', data.message || 'Unknown error');
        Swal.fire('Error', data.message || 'Failed to load leave types.', 'error');
      }
    } catch (error) {
      console.error('Error fetching leave types:', error);
      Swal.fire('Error', 'Network error or server unavailable.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const token = localStorage.getItem('authToken');

    if (!token) {
      Swal.fire('Error', 'Authentication token not found. Please log in.', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/leaves/submit-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Swal.fire('Success', 'Leave request submitted successfully!', 'success');
        setFormData({
          leave_type_id: '',
          start_date: '',
          end_date: '',
          reason: '',
          note: '',
        });
        if (onLeaveSubmitted) {
          onLeaveSubmitted(data.data); // Gọi callback để thông báo leave mới đã được tạo
        }
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        Swal.fire('Error', data.message || 'Failed to submit leave request.', 'error');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      Swal.fire('Error', 'Network error or server unavailable.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-container">
      <h2 className="page-title">Submit New Leave Request</h2>
      {Object.keys(errors).length > 0 && (
        <div className="error-message">
          Please correct the following errors:
          <ul>
            {Object.values(errors).map((err, index) => (
              <li key={index}>{err[0]}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="leave_type_id" className="form-label">Leave Type</label>
          <select
            id="leave_type_id"
            name="leave_type_id"
            className="form-select"
            value={formData.leave_type_id}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.leave_type_id && <span className="error-message">{errors.leave_type_id[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="start_date" className="form-label">Start Date</label>
          <div className="textfield-wrapper">
            <input
              type="date"
              id="start_date"
              name="start_date"
              className="form-control"
              value={formData.start_date}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <FaRegCalendarAlt className="icon" />
          </div>
          {errors.start_date && <span className="error-message">{errors.start_date[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="end_date" className="form-label">End Date</label>
          <div className="textfield-wrapper">
            <input
              type="date"
              id="end_date"
              name="end_date"
              className="form-control"
              value={formData.end_date}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <FaRegCalendarAlt className="icon" />
          </div>
          {errors.end_date && <span className="error-message">{errors.end_date[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reason" className="form-label">Reason</label>
          <textarea
            id="reason"
            name="reason"
            className="form-control"
            value={formData.reason}
            onChange={handleChange}
            required
            disabled={loading}
          ></textarea>
          {errors.reason && <span className="error-message">{errors.reason[0]}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="note" className="form-label">Note (Optional)</label>
          <textarea
            id="note"
            name="note"
            className="form-control"
            value={formData.note}
            onChange={handleChange}
            disabled={loading}
          ></textarea>
          {errors.note && <span className="error-message">{errors.note[0]}</span>}
        </div>

        <div className="form-buttons">
          <button type="button" className="btn-cancel" onClick={() => { /* Handle cancel logic, maybe navigate back or clear form */ }}>
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Submitting...' : (
              <>
                <FaPlus className="btn-icon" /> Submit Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;