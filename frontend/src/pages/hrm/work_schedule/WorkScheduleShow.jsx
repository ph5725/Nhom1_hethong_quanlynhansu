import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Table.css';
import '../../../styles/Form.css';

const WorkScheduleShow = () => {
  const [schedules, setSchedules] = useState([]);
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

  // Lấy danh sách work schedules
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchSchedules = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/work-schedules`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setSchedules(response.data.data.workSchedules); // Adjusted to match controller response
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch work schedules');
      }
    };
    fetchSchedules();
  }, [roleApi]);

  const handleEdit = (id) => {
    navigate(`/hrm/work-schedules/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this work schedule?')) {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/work-schedules`;
        const response = await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setSchedules(schedules.filter((schedule) => schedule.id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to delete work schedule');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Work Schedules</h1>
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
        <Button
          className="btn-add"
          onClick={() => navigate('/hrm/work-schedules/create')}
        >
          Add
        </Button>
      </div>
      <div className="table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '20px' }}>No.</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Work Date</th>
              <th>Day Off</th>
              <th className="action">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <tr key={schedule.id}>
                <td>{index + 1}</td>
                <td>{schedule.employee?.fullname || 'N/A'}</td>
                <td>{schedule.employee?.department?.name || 'N/A'}</td>
                <td>{schedule.work_shift?.shift_name || 'N/A'}</td>
                <td>{schedule.work_date_status?.name || 'N/A'}</td>
                <td>{schedule.work_date}</td>
                <td>{schedule.is_day_off ? 'Yes' : 'No'}</td>
                <td className="action">
                  <i
                    className="icon bi bi-pencil"
                    onClick={() => handleEdit(schedule.id)}
                  ></i>
                  <i
                    className="icon bi bi-trash"
                    onClick={() => handleDelete(schedule.id)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default WorkScheduleShow;