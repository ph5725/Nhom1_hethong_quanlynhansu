import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';
import '../../../styles/Table.css';

const AllowanceTypeShow = () => {
  const [allowanceTypes, setAllowanceTypes] = useState([]);
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

  // Lấy danh sách 
  useEffect(() => {
    if (!roleApi) return; // Chờ roleApi được set
    const fetchAllowanceTypes = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/allowance-types`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setAllowanceTypes(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch allowance types');
      }
    };
    fetchAllowanceTypes();
  }, [roleApi]);

  console.log("ROLES từ API: ", roleApi);
  

  const handleEdit = (id) => {
    navigate(`/allowance-types/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this allowance type?')) {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/allowance-types/${id}`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          setAllowanceTypes(allowanceTypes.filter((type) => type.id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to delete allowance type');
      }
    }
  };
  console.log("Danh sách: ", allowanceTypes);

  return (
    <div className="user-container">
        <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
          <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Allowance Types</h1>

        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
        <button
          className="btn-dark"
          onClick={() => navigate('/admin/allowance-types/create')}
          style={{ marginTop: '16px', width: 'fit-content' }}
        >
          Add
        </button>
        </div>
        
        <div className="table-wrapper">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '20px' }}>No.</th>
                <th>Name</th>
                <th>Description</th>
                <th className="action">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allowanceTypes.map((type, index) => (
                <tr key={type.id}>
                  <td>{index + 1}</td>
                  <td>{type.name}</td>
                  <td>{type.description || 'N/A'}</td>
                  <td className="action">
                    <i
                      className="bi bi-pencil-square icon update"
                      onClick={() => navigate(`/admin/allowance-types/edit/${type.id}`)}
                      title="Edit user"
                    ></i>
                    <i
                      className="icon bi bi-trash"
                      onClick={() => handleDelete(type.id)}
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

export default AllowanceTypeShow;