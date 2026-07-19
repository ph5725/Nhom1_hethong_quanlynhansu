import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../../styles/Form.css';
import '../../../styles/Table.css';

const UserShow = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
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
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem('access_token');
          if (!token) {
            throw new Error('Không tìm thấy token xác thực.');
          }
          const response = await axios.get('http://127.0.0.1:8000/api/admin/users', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Cache-Control': 'no-cache' // Vô hiệu hóa cache
            }
          });
          console.log('API Response:', response.data);
          const userData = Array.isArray(response.data.data) ? response.data.data : [];
          setUsers(userData);
          setLoading(false);
        } catch (err) {
          console.error('Lỗi API:', err.response ? err.response.data : err.message);
          setError(err.response?.data?.message || 'Unable to load data');
          setLoading(false);
        }
      };
      fetchUsers();
    }, [roleApi]);

    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this data?')) { 
        try {
          // Lưu ý: Đường dẫn API có thể cần được điều chỉnh nếu bạn đang dùng proxy hoặc base URL
          await axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } // Đảm bảo dùng access_token
          });
          setUsers(users.filter(user => user.id !== id));
          setSelectedUsers(selectedUsers.filter(userId => userId !== id));
          console.log=('User id: ', user => user.id);
        } catch (err) {
          console.error('Lỗi xóa:', err.response ? err.response.data : err.message);
          setError('Unable to delete data');
        }
      }
    };

    if (loading) return <div className="content text-center">Loading...</div>;
    if (error) return <div className="error-message text-center">{error}</div>;

    console.log("User: ", users);

    return (
      <div className="user-container">
        <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
          <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>User Manager</h1>
          <button
            className="btn-dark"
            onClick={() => navigate('/admin/users/create')}
            style={{ marginTop: '16px', width: 'fit-content'}}
          >
            Add
          </button>
        </div>

        <div className="table-wrapper">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '20px' }}>No.</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="content text-center">
                    No users
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.roles.map(role => role.name).join(', ')}</td>
                    <td className="action">
                      <i
                        className="bi bi-pencil-square icon update"
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                        title="Edit user"
                      ></i>
                      <i
                        className="bi bi-trash icon delete"
                        onClick={() => handleDelete(user.id)}
                        title="Delete user"
                      ></i>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    );
};

export default UserShow;
