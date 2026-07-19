import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [displayRole, setDisplayRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDisplayRole(''); // Reset display role

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });

      const { access_token, user, roles } = response.data;

      // Lưu access_token vào localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_roles', JSON.stringify(roles));

      // Hiển thị vai trò đầu tiên trong mảng roles (nếu có)
      if (roles && roles.length > 0) {
        setDisplayRole(roles[0]);
      }

      console.log("ROLES từ API: ", roles);

      // Logic điều hướng
      if (roles[0].includes('admin')) {
        navigate('/admin');
      } else if (roles.includes('hrm')) {
        navigate('/hrm');
      } else if (roles.includes('fm')) {
        navigate('/fm');
      } else if (roles.includes('m')) {
        navigate('/m');
      } else if (roles.includes('per')) {
        navigate('/per');
      } else {
        setError('Tài khoản của bạn không có quyền truy cập vào trang này.');
      }

    } catch (err) {
      // Xử lý lỗi từ API
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-page">
      <Container fluid className="login-container">
        <Row className="login-row">
          <Col xs={12} className="text-center mb-4">
            <img src="/logo.png" alt="Company Logo" className="user-icon" />
          </Col>
          <Col xs={12} md={6} className="login-form-section d-flex justify-content-center align-items-center">
            <div className="login-form-content">
              <h2 className="title" style={{ color: '#E0F2F7' }}>Login</h2>
              <Form onSubmit={handleSubmit} className="w-100">
                <Form.Group className="mb-3">
                  <div className="textfield-wrapper">
                    <span className="icon">
                      <i className="bi bi-envelope-fill"></i>
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Gmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="custom-input"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <div className="textfield-wrapper">
                    <span className="icon">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="custom-input"
                    />
                  </div>
                </Form.Group>
                <div className="d-flex justify-content-center">
                  <button className="btn-light" type="submit">
                    Đăng nhập
                  </button>
                </div>
                {error && <p className="text-danger text-center mt-2">{error}</p>}
                {displayRole && (
                  <p className="text-success text-center mt-2">
                    Đăng nhập thành công! Vai trò: {displayRole}
                  </p>
                )}
              </Form>
            </div>
          </Col>
          <Col xs={12} md={6} className="welcome-section d-flex justify-content-center align-items-center">
            <div className="welcome-content">
              <h2 className="title">WELCOM BACK!</h2>
              <p className="content">Smart HR - Smart Business</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;