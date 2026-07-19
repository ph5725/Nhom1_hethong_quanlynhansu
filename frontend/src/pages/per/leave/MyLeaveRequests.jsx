// MyLeaveRequests.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa'; // Import FaPlus
import Swal from 'sweetalert2';
import moment from 'moment';

import './Table.css';
import './Form.css'; // Đảm bảo import để có các CSS chung

const API_BASE_URL = 'http://localhost:8000/api'; // THAY THẾ BẰNG URL API THỰC TẾ CỦA BẠN

// Nhận prop onAddNewClick
const MyLeaveRequests = ({ onAddNewClick, refreshTrigger }) => { // Thêm refreshTrigger
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyLeaves();
  }, [refreshTrigger]); // Thêm refreshTrigger vào dependency array để re-fetch khi có thay đổi

  const fetchMyLeaves = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');

    if (!token) {
      Swal.fire('Error', 'Authentication token not found. Please log in.', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/leaves/my-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setLeaves(data.data.leaves);
      } else {
        setError(data.message || 'Failed to fetch leave requests.');
        Swal.fire('Error', data.message || 'Failed to load leave requests.', 'error');
      }
    } catch (err) {
      console.error('Error fetching my leave requests:', err);
      setError('Network error or server unavailable.');
      Swal.fire('Error', 'Network error or server unavailable.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (leaveId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        try {
          const response = await fetch(`${API_BASE_URL}/leaves/${leaveId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });

          const data = await response.json();

          if (response.ok && data.success) {
            Swal.fire('Deleted!', 'Your leave request has been deleted.', 'success');
            fetchMyLeaves(); // Refresh the list
          } else {
            Swal.fire('Error', data.message || 'Failed to delete leave request.', 'error');
          }
        } catch (error) {
          console.error('Error deleting leave request:', error);
          Swal.fire('Error', 'Network error or server unavailable.', 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleEdit = (leaveId) => {
    Swal.fire('Info', `Edit feature for Leave ID: ${leaveId} is not yet implemented.`, 'info');
    // Khi bạn triển khai edit, bạn có thể chuyển sang một form edit
    // Ví dụ: onEditClick(leaveId);
  };

  if (loading) {
    return (
      <div className="user-container">
        <h2 className="page-title">My Leave Requests</h2>
        <p>Loading leave requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-container">
        <h2 className="page-title">My Leave Requests</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="user-container">
      <h2 className="page-title">My Leave Requests</h2>

      {/* Nút "Submit New Leave" */}
      <button className="btn-add" onClick={onAddNewClick}>
        <FaPlus className="btn-icon" /> Submit New Leave
      </button>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Request Date</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration (days)</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Approved By</th>
              <th>Approved Date</th>
              <th className="action">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length > 0 ? (
              leaves.map((leave, index) => (
                <tr key={leave.id}>
                  <td>{index + 1}</td>
                  <td>{moment(leave.request_date).format('YYYY-MM-DD')}</td>
                  <td>{leave.leave_type?.name || 'N/A'}</td>
                  <td>{moment(leave.start_date).format('YYYY-MM-DD')}</td>
                  <td>{moment(leave.end_date).format('YYYY-MM-DD')}</td>
                  <td>{leave.duration}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                  <td>{leave.approved?.fullname || 'N/A'}</td>
                  <td>{leave.approved_date ? moment(leave.approved_date).format('YYYY-MM-DD') : 'N/A'}</td>
                  <td className="action">
                    {leave.status === 'pending' && (
                      <>
                        <FaEdit className="icon" onClick={() => handleEdit(leave.id)} title="Edit" />
                        <FaTrashAlt className="icon" onClick={() => handleDelete(leave.id)} title="Delete" />
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>No leave requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLeaveRequests;