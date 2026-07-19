import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Image, Card, Spinner, Alert } from 'react-bootstrap';

function QrCodeGenerator() {
  const [id, setId] = useState('');
  const [fullname, setFullname] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [qrLoading, setQrLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null); // Thêm state để hiển thị lỗi

  // Lấy thông tin nhân viên từ API
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

        console.log('API Response (User):', response.data); // Log toàn bộ phản hồi

        const { data } = response.data;
        const employeeInfo = data.employee_info;
        if (employeeInfo && typeof employeeInfo === 'object' && employeeInfo.id && employeeInfo.fullname) {
          setId(employeeInfo.id.toString());
          setFullname(employeeInfo.fullname);
          console.log("Fullname: ", employeeInfo.fullname);
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
      console.log('API Response (QR):', response.data); // Log phản hồi từ API qrcode
      const baseUrl = 'http://127.0.0.1:8000'; // Thêm domain của server
      setQrUrl(`${baseUrl}${response.data.qr_url}`); // Ghép domain với qr_url
      setShow(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError(`Error generating QR code: ${error.response?.data?.message || error.message}`);
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <Card.Title>Generate QR Code</Card.Title>
          {loading ? (
            <div className="text-center">
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
              <p><strong>Department:</strong> {id}</p>
              <p><strong>Position:</strong> {fullname}</p>
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={qrLoading || !id || !fullname}
              >
                {qrLoading ? 'Generating...' : 'Generate QR Code'}
              </Button>
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {qrUrl ? (
            <Image src={qrUrl} alt="QR Code" fluid />
          ) : (
            <p>No QR code generated yet.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default QrCodeGenerator;