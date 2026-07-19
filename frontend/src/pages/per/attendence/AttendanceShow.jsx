import React, { useState, useEffect } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../../../styles/Table.css';
import '../../../styles/Form.css';

const AttendanceShow = () => {
  const [attendances, setAttendances] = useState([]);
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

  // Lấy danh sách 
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchAttendances = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/attendances`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setAttendances(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch attendances');
      }
    };
    fetchAttendances();
  }, [roleApi]);

  return (
    <div className="user-container">
        <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
          <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Attendance Records</h1>
      {error && <Alert variant="danger" className="error-message">{error}</Alert>}
      </div>
      <div className="table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '20px' }}>No.</th>
              <th>Employee</th>
              <th>Attendance Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((attendance, index) => (
              <tr key={attendance.id}>
                <td>{index + 1}</td>
                <td>{attendance.employee?.fullname || 'N/A'}</td>
                <td>{attendance.attendance_date}</td>
                <td>{attendance.check_in}</td>
                <td>{attendance.check_out || 'N/A'}</td>
                <td>{attendance.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AttendanceShow;