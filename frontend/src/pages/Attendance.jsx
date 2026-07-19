import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Image, Card, Spinner, Alert } from 'react-bootstrap';

const Attendance = () => {
  const [id, setId] = useState('');
  const [fullname, setFullname] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [qrLoading, setQrLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No access token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API Response (User):', response.data);

        const { data } = response.data;
        const employeeInfo = data.employee_info;
        if (employeeInfo && typeof employeeInfo === 'object' && employeeInfo.id && employeeInfo.fullname) {
          setId(employeeInfo.id.toString());
          setFullname(employeeInfo.fullname);
        } else {
          setError('Invalid user data format. Expected employee_info with id and fullname.');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response) {
          if (error.response.status === 401) {
            setError('Unauthorized. Please log in again.');
            localStorage.removeItem('access_token');
          } else {
            setError(`Error: ${error.response?.data?.message || error.message}`);
          }
        } else {
          setError('Network error. Please check your connection or server.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const handleGenerate = async () => {
    setQrLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/qrcode', {
        id,
        fullname,
      });
      console.log('API Response (QR):', response.data);
      const baseUrl = 'http://127.0.0.1:8000';
      setQrUrl(`${baseUrl}${response.data.qr_url}`);
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError(`Error generating QR code: ${error.response?.data?.message || error.message}`);
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <Card className="text-center">
        <Card.Body>
          <Card.Title>Generate QR Code</Card.Title>
          {loading ? (
            <div>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <p><strong>ID:</strong> {id}</p>
              <p><strong>Full Name:</strong> {fullname}</p>
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={qrLoading || !id || !fullname}
                className="mt-3"
              >
                {qrLoading ? 'Generating...' : 'Generate QR Code'}
              </Button>
              {qrUrl && (
                <div className="mt-3">
                  <Image src={qrUrl} alt="QR Code" fluid />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Attendance;