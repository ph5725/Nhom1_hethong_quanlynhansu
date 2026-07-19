import React, { useEffect, useState } from 'react';
import { Container, Button, Image, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/Table.css';
import '../../styles/Form.css';

const PersonalInformation = () => {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleApi, setRoleApi] = useState(null);

  // Fetch roleApi from localStorage
  useEffect(() => {
    try {
      const storedRoles = JSON.parse(localStorage.getItem('user_roles')) || [];
      if (!storedRoles.length) {
        throw new Error('No roles found.');
      }
      setRoleApi(storedRoles[0]);
    } catch (err) {
      console.error('Error fetching roles:', err.message);
      setError('Failed to load role. Using default role.');
      setRoleApi('user');
    }
  }, []);

  // Fetch personal information
  useEffect(() => {
    if (!roleApi) return;

    const fetchPersonalInformation = async () => {
      try {
        const API_URL = `http://192.168.1.6:8000/api/${roleApi}/personal-information`;
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.data.success) {
          setEmployee(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch personal information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInformation();
  }, [roleApi]);

  if (loading) {
    return (
      <Container className="user-container">
        <h1 className="title">Personal Information</h1>
        <Alert variant="info">Loading...</Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="user-container">
        <h1 className="title">Personal Information</h1>
        <Alert variant="danger" className="error-message">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!employee) {
    return (
      <Container className="user-container">
        <h1 className="title">Personal Information</h1>
        <Alert variant="warning" className="error-message">
          No employee information found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="user-container" style={{ padding: '36px', maxWidth: '800px' }}>
      <h1 className="page-title" style={{ color: 'var(--brand-dark)', margin: 0, textAlign: 'left', fontWeight: 'bold' }}>
        Information
      </h1>

      <div style={{ marginTop: '20px' }}>
        {/* Personal Information Section */}
        <div style={{ marginBottom: '30px'}}>
          <h4 className="subtitle" style={{ color: 'var(--brand-dark)', marginBottom: '20px', fontWeight: '600' }}>
            Personal Information
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', color: 'var(--brand-dark)'}}>
            <Image
              src={employee.image_path ? `http://127.0.0.1:8000/${employee.image_path}` : 'https://via.placeholder.com/150'}
              alt="Employee"
              roundedCircle
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                border: '2px solid var(--brand-dark)',
              }}
            />
            <div>
              <p className="content" style={{ margin: 0, fontSize: '16px' }}>
                <strong>Full Name:</strong> {employee.fullname || 'N/A'}
              </p>
              <p className="content" style={{ margin: 0, fontSize: '16px' }}>
                <strong>Email:</strong> {employee.email || 'N/A'}
              </p>
            </div>
          </div>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)'}}>
            <strong>Date of Birth:</strong> {employee.date_of_birth || 'N/A'}
          </p>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)'}}>
            <strong>Gender:</strong> {employee.gender || 'N/A'}
          </p>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)' }}>
            <strong>Birthplace:</strong> {employee.birthplace || 'N/A'}
          </p>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)' }}>
            <strong>Ethnicity:</strong> {employee.ethnicity || 'N/A'}
          </p>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)' }}>
            <strong>Address:</strong> {employee.address || 'N/A'}
          </p>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)' }}>
            <strong>ID Card:</strong> {employee.id_card || 'N/A'}
          </p>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)' }}>
            <strong>Created At:</strong>{' '}
            {employee.created_at ? new Date(employee.created_at).toLocaleString() : 'N/A'}
          </p>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)' }}>
            <strong>Updated At:</strong>{' '}
            {employee.updated_at ? new Date(employee.updated_at).toLocaleString() : 'N/A'}
          </p>
          <Button
            className="btn-dark"
            style={{ marginTop: '20px', backgroundColor: 'var(--brand-dark)', border: 'none' }}
          >
            Change password
          </Button>
        </div>

        {/* Separator */}
        <hr style={{ border: '1px solid var(--brand-dark)', margin: '30px 0', width: '600px', alignItems: 'center'}} />

        {/* Work Information Section */}
        <div>
          <h4 className="subtitle" style={{ color: 'var(--brand-dark)', marginBottom: '20px', fontWeight: '600' }}>
            Work Information
          </h4>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)' }}>
            <strong>Department:</strong> {employee.department?.name || 'N/A'}
          </p>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)' }}>
            <strong>Position:</strong> {employee.position?.name || 'N/A'}
          </p>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)' }}>
            <strong>Education Level:</strong> {employee.educationLevel?.level || 'N/A'}
          </p>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)' }}>
            <strong>Username:</strong> {employee.user?.name || 'N/A'}
          </p>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)' }}>
            <strong>Contract ID:</strong> {employee.contract?.id || 'N/A'}
          </p>
          <p className="content" style={{ margin: '8px 0', fontSize: '16px', color: 'var(--brand-dark)' }}>
            <strong>Salary ID:</strong> {employee.contract?.salary_id || 'N/A'}
          </p>
        </div>
      </div>
    </Container>
  );
};

export default PersonalInformation;