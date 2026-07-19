import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Footer.css'; // Nhập CSS từ file Footer.css

const title = 'Về Id-Clock System';
const desc = 'ID-Clock System là nền tảng quản lý nhân sự nội bộ, giúp tối ưu hóa quy trình tuyển dụng, quản lý nhân viên và phát triển tổ chức với giao diện thân thiện và hiệu quả.';
const departmentTitle = 'Phòng Ban';
const contactTitle = 'Liên Hệ';
const followTitle = 'Follow Us';

const addressList = [
  { iconName: 'bi-geo-alt-fill', text: 'TP. Hồ Chí Minh, Việt Nam' },
  { iconName: 'bi-telephone-fill', text: '+84 123 456 789' },
  { iconName: 'bi-envelope-fill', text: 'hr@company.com' },
];

const socialList = [
  { iconName: 'bi-facebook', siteLink: '#', className: 'text-white' },
  { iconName: 'bi-twitter', siteLink: '#', className: 'text-white' },
  { iconName: 'bi-instagram', siteLink: '#', className: 'text-white' },
  { iconName: 'bi-linkedin', siteLink: '#', className: 'text-white' },
];

const departmentList = [
  { text: 'Phòng Nhân Sự', link: '/hr' },
  { text: 'Phòng Kế Toán', link: '/accounting' },
  { text: 'Phòng IT', link: '/it' },
  { text: 'Phòng Marketing', link: '/marketing' },
];

const Footer = () => {
  return (
    <footer className="footer-custom">
      <Container>
        <Row className="g-4">
          {/* About Section */}
          <Col md={3}>
            <h5>{title}</h5>
            <p>{desc}</p>
          </Col>

          {/* Departments Section */}
          <Col md={3}>
            <h5>{departmentTitle}</h5>
            <Nav className="flex-column">
              {departmentList.map((val, i) => (
                <Nav.Link
                  as={Link}
                  to={val.link}
                  key={i}
                  className="p-0 mb-2"
                >
                  {val.text}
                </Nav.Link>
              ))}
            </Nav>
          </Col>

          {/* Contact Section */}
          <Col md={3}>
            <h5>{contactTitle}</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-geo-alt-fill me-2"></i>
                Địa chỉ: {addressList[0].text}
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone-fill me-2"></i>
                Số điện thoại: {addressList[1].text}
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope-fill me-2"></i>
                Về nhân sự:{' '}
                <a href="mailto:hr@gmail.com" className="contact-link">
                  hr@gmail.com
                </a>
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope-fill me-2"></i>
                Về hệ thống:{' '}
                <a href="mailto:admin@gmail.com" className="contact-link">
                  admin@gmail.com
                </a>
              </li>
            </ul>
          </Col>

          {/* Follow Us Section */}
          <Col md={3}>
            <h5>{followTitle}</h5>
            <ul className="list-unstyled d-flex gap-2">
              {socialList.map((val, i) => (
                <li key={i}>
                  <a href={val.siteLink} className="social-icon">
                    <i className={`bi ${val.iconName} fs-5`}></i>
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        {/* Bottom Section */}
        <Row className="mt-4">
          <Col className="text-center">
            <p className="mb-0">
              © {new Date().getFullYear()} <Link to="/" className="text-white">idClock System</Link>. Designed by{' '}
              <a href="https://themeforest.net/user/CodexCoder" target="_blank" className="text-white">
                Phòng IT
              </a>
            </p>
            <p className="mt-2">Version: 2.0.0</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;