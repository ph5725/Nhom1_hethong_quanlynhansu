import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Table.css';
import '../../../styles/Form.css';

const LeaveListShow = () => {
  const [leaves, setLeaves] = useState([]);
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

  // Lấy danh sách leaves
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchLeaves = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/leaves`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setLeaves(response.data.data.leaves); // Truy cập đúng leaves trong data
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch leaves');
      }
    };
    fetchLeaves();
  }, [roleApi]);

  const handleEdit = (id) => {
    navigate(`/m/leaves/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/leaves`;
        const response = await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setLeaves(leaves.filter((leave) => leave.id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to delete leave');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/leaves`;
      const response = await axios.post(`${API_URL}/${id}/approve`, {}, { // Changed to PATCH
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        setLeaves(leaves.map((leave) =>
          leave.id === id ? response.data.data : leave
        ));
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve leave');
    }
  };

  const handleReject = async (id) => {
    try {
      const API_URL = `http://127.0.0.1:8000/api/${roleApi}/leaves`;
      const response = await axios.post(`${API_URL}/${id}/reject`, {}, { // Changed to PATCH
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.data.success) {
        setLeaves(leaves.map((leave) =>
          leave.id === id ? response.data.data : leave
        ));
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject leave');
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Leave Requests</h1>
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
        <Button
          className="btn-add"
          onClick={() => navigate('/m/leaves/create')}
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
              <th>Leave Type</th>
              <th>Approved By</th> {/* Updated header */}
              <th>Request Date</th> {/* New column */}
              <th>Start Date</th>   {/* New column */}
              <th>End Date</th>     {/* New column */}
              <th>Reason</th>       {/* New column */}
              <th>Approved Date</th>
              <th>Note</th>
              <th>Status</th>
              <th className="action">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave, index) => (
              <tr key={leave.id}>
                <td>{index + 1}</td>
                <td>{leave.employee?.fullname || 'N/A'}</td>
                <td>{leave.leave_type?.name || 'N/A'}</td>
                <td>{leave.approved?.fullname || 'N/A'}</td> {/* Updated data access */}
                <td>{leave.request_date}</td>        {/* New column */}
                <td>{leave.start_date}</td>          {/* New column */}
                <td>{leave.end_date}</td>            {/* New column */}
                <td>{leave.reason || 'N/A'}</td>      {/* New column */}
                <td>{leave.approved_date || 'N/A'}</td>
                <td>{leave.note || 'N/A'}</td>
                <td>{leave.status}</td>
                <td className="action">
                  <i
                    className="icon bi bi-pencil"
                    onClick={() => handleEdit(leave.id)}
                  ></i>
                  <i
                    className="icon bi bi-trash"
                    onClick={() => handleDelete(leave.id)}
                  ></i>
                  {leave.status === 'pending' && (
                    <>
                      <i
                        className="icon bi bi-check-circle"
                        onClick={() => handleApprove(leave.id)}
                        title="Approve"
                      ></i>
                      <i
                        className="icon bi bi-x-circle"
                        onClick={() => handleReject(leave.id)}
                        title="Reject"
                      ></i>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default LeaveListShow;