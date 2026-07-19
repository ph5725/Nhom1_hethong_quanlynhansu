import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Table.css';
import '../../../styles/Form.css';

const WorkShiftShow = () => {
  const [workShifts, setWorkShifts] = useState([]);
  const [error, setError] = useState('');
  const [roleApi, setRoleApi] = useState(null); // Role dùng cho API
  const navigate = useNavigate();
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
    const fetchWorkShifts = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/work-shifts`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setWorkShifts(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch work shifts');
      }
    };
    fetchWorkShifts();
  }, [roleApi]);

  const handleEdit = (id) => {
    navigate(`/admin/work-shifts/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this work shift?')) {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/work-shifts`;
        const response = await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setWorkShifts(workShifts.filter((shift) => shift.id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to delete work shift');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Work Shifts</h1>
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
        <Button
          className="btn-add"
          onClick={() => navigate('/admin/work-shifts/create')}
        >
          Add
        </Button>
      </div>
      <div className="table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '20px' }}>No.</th>
              <th>Shift Name</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Break Time (min)</th>
              <th className="action">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workShifts.map((shift, index) => (
              <tr key={shift.id}>
                <td>{index + 1}</td>
                <td>{shift.shift_name}</td>
                <td>{shift.start_time}</td>
                <td>{shift.end_time}</td>
                <td>{shift.break_time}</td>
                <td className="action">
                  <i
                    className="icon bi bi-pencil"
                    onClick={() => handleEdit(shift.id)}
                  ></i>
                  <i
                    className="icon bi bi-trash"
                    onClick={() => handleDelete(shift.id)}
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

export default WorkShiftShow;