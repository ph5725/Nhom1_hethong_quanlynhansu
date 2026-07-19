import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../../styles/Form.css';

const UserCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roles: [],
    password: ''
  });
  const [rolesList, setRolesList] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('Không tìm thấy token xác thực.');

        const response = await axios.get('http://127.0.0.1:8000/api/admin/roles', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });

        const fetchedRoles = Array.isArray(response.data.data) ? response.data.data : [];
        setRolesList(fetchedRoles);

        // Chọn mặc định role có name là 'per'
        const defaultRole = fetchedRoles.find(role => role.name === 'per');
        if (defaultRole) {
          setFormData(prev => ({ ...prev, roles: [defaultRole.id] }));
        }

        setLoadingRoles(false);
      } catch (err) {
        console.error('Lỗi khi tải danh sách vai trò:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.message || 'Không thể tải danh sách vai trò');
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const roleId = parseInt(e.target.value);
    setFormData(prev => {
      if (e.target.checked) {
        return { ...prev, roles: [...prev.roles, roleId] };
      } else {
        return { ...prev, roles: prev.roles.filter(id => id !== roleId) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/admin/users', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      navigate('/admin/users');
    } catch (err) {
      console.error('Lỗi tạo:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Cannot create user');
    }
  };

  return (
    <div className="user-container">
      <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Add New User</h1>
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
                placeholder="username"
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
                placeholder="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Roles</label>
            {loadingRoles ? (
              <div className="content">Đang tải vai trò...</div>
            ) : (
              <div className="checkbox-group">
                {rolesList.map((role) => (
                  <div key={role.id} className="form-check">
                    <input
                      type="checkbox"
                      id={`role-${role.id}`}
                      name="roles"
                      value={role.id}
                      checked={formData.roles.includes(role.id)}
                      onChange={handleRoleChange}
                    />
                    <label className = 'body' style = {{color: '#343a40', paddingLeft: '16px'}} htmlFor={`role-${role.id}`}>{role.name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="textfield-wrapper">
              <i className="bi bi-lock icon"></i>
              <input
                type="password"
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/admin/users')}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreate;
