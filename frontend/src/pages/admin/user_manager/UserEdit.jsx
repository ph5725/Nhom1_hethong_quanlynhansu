import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../../styles/Form.css';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roles: [] // Đây sẽ là mảng các ID vai trò
  });

  // rolesList vẫn cần để hiển thị tất cả các tùy chọn checkbox
  const [rolesList, setRolesList] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [roleApi, setRoleApi] = useState(null); // Role dùng cho API

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

  // Lấy thông tin
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('Authorization token not found. Please log in.');
          setLoadingUser(false);
          return;
        }
        const res = await axios.get(`http://127.0.0.1:8000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = res.data.data;
        console.log('Fetched User Data:', user); // DEBUG: Kiểm tra dữ liệu user

        // --- CHỈNH SỬA Ở ĐÂY ---
        // Lấy role_id từ đối tượng pivot của mỗi vai trò
        const userRoleIds = user.roles ? user.roles.map(r => r.pivot.role_id) : [];
        console.log('User\'s current role IDs (from pivot):', userRoleIds); // DEBUG

        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          roles: userRoleIds // Gán trực tiếp mảng các ID vai trò
        }));
        setLoadingUser(false);
      } catch (err) {
        console.error('Lỗi khi tải user:', err);
        setError('Unable to load user data. Please check the network and server.');
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [id, roleApi]);

  // Load roles list (tất cả các vai trò có thể có)
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('Authorization token not found. Please log in.');
          setLoadingRoles(false);
          return;
        }
        const res = await axios.get(`http://127.0.0.1:8000/api/admin/roles`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const roles = Array.isArray(res.data.data) ? res.data.data : [];
        console.log('Fetched Roles List (All Roles):', roles); // DEBUG: Kiểm tra danh sách tất cả roles
        setRolesList(roles);
        setLoadingRoles(false);
      } catch (err) {
        console.error('Error loading roles data:', err);
        setError('Unable to load roles data. Please check the network and server.');
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  // KHÔNG CẦN useEffect thứ hai để đồng bộ roles nữa,
  // vì formData.roles đã được thiết lập đúng trong fetchUser.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e) => {
    const roleId = parseInt(e.target.value); // roleId là ID từ checkbox value
    setFormData(prev => {
      if (e.target.checked) {
        // Thêm roleId nếu chưa có
        if (!prev.roles.includes(roleId)) {
          const newRoles = [...prev.roles, roleId];
          console.log('Roles after adding (IDs):', newRoles);
          return { ...prev, roles: newRoles };
        }
        return prev;
      } else {
        // Bỏ roleId nếu có
        const newRoles = prev.roles.filter(id => id !== roleId);
        console.log('Roles after removing (IDs):', newRoles);
        return { ...prev, roles: newRoles };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log('FormData before submit:', formData); // DEBUG: Rất quan trọng để kiểm tra formData.roles tại đây!

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Authorization token not found. Please log in.');
        setIsSubmitting(false);
        return;
      }
      const res = await axios.put(`http://127.0.0.1:8000/api/admin/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Update success response:', res.data);
      alert('User updated successfully!');
      navigate('/admin/users');
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(`Không thể cập nhật người dùng: ${errorMessages.join('; ')}`);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(`Không thể cập nhật người dùng: ${err.response.data.message}`);
      } else {
        setError('Không thể cập nhật người dùng. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingUser || loadingRoles) {
    return <div className="content">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="user-container">
      <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Edit User</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="textfield-wrapper">
              <i className="bi bi-person icon"></i>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="textfield-wrapper">
              <i className="bi bi-envelope icon"></i>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Roles</label>
            {loadingRoles ? (
              <div className="content">Loading...</div>
            ) : (
              <div className="checkbox-group">
                {rolesList.length > 0 ? (
                  rolesList.map((role) => (
                    <div key={role.id} className="form-check">
                      <input
                        type="checkbox"
                        id={`role-${role.id}`}
                        name="roles"
                        value={role.id}
                        checked={formData.roles.includes(role.id)} // So sánh bằng ID
                        onChange={handleRoleChange}
                      />
                      <label
                        className='body'
                        style={{ color: '#343a40', paddingLeft: '16px' }}
                        htmlFor={`role-${role.id}`}
                      >
                        {role.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="content">No roles available or failed to load roles.</div>
                )}
              </div>
            )}
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/admin/users')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;