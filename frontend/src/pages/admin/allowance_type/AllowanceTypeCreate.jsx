import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../../styles/Form.css';

const AllowanceTypeCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false); // Added for consistency
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/admin/allowance-types', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      navigate('/admin/allowance-types'); // Updated to match admin prefix
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setServerError(err.response?.data?.message || 'Cannot create allowance type');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-container">
      <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Add New Allowance Type</h1>
      {serverError && <div className="error-message">{serverError}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <div className="textfield-wrapper">
              <i className="bi bi-tag icon"></i>
              <input
                type="text"
                name="name"
                placeholder="Enter allowance type name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                required
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <div className="textfield-wrapper">
              <i className="bi bi-text-paragraph icon"></i>
              <textarea
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/admin/allowance-types')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllowanceTypeCreate;