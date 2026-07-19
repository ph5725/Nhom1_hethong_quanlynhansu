import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const [menu, setMenu] = useState([]);
    const [error, setError] = useState('');
    const [isDark, setIsDark] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://127.0.0.1:8000/api/menu', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMenu(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể lấy menu');
                if (err.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('role');
                    navigate('/login');
                }
            }
        };

        fetchMenu();
    }, [navigate]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        navigate('/');
    };

    const handleAttendance = () => {
        navigate('/atd/attendance'); // Điều hướng đến trang Attendance
    };

    return (
        <div className={`sidebar ${isDark ? 'dark' : 'light'} ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="header-row">
                    <div className="logo">
                        <img src="/logo.png" alt="Logo" className="logo-img" />
                        {!isCollapsed && <span className="logo-text">idClock</span>}
                    </div>
                    <span className="collapse-toggle">
                        <i className={`bi ${isCollapsed ? 'bi-chevron-double-right' : 'bi-chevron-double-left'}`} onClick={toggleCollapse}></i>
                    </span>
                </div>
            </div>
            <div className="sidebar-content">
                {error && <p className="text-danger">{error}</p>}
                {menu.map((section, index) => (
                    <div key={index} className="menu-section">
                        {isCollapsed ? (
                            <div className="menu-divider"></div>
                        ) : (
                            <h3 className="menu-title centered-title">
                                {section.title}
                            </h3>
                        )}
                        <ul>
                            {section.items.map((item, idx) => (
                                <li key={idx}>
                                    <span
                                        className={`menu-content ${location.pathname === item.link ? 'active-button' : ''}`}
                                        onClick={() => navigate(item.link)}
                                    >
                                        <i className={`bi ${item.icon || 'bi-dot'}`}></i>
                                        {!isCollapsed && <span>{item.name}</span>}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="sidebar-footer">
                <button
                    onClick={handleAttendance}
                    className={isDark ? 'btn-light' : 'btn-dark'}
                >
                    <i className="bi bi-qr-code"></i>
                    {!isCollapsed && <span>Attendance</span>}
                </button>
                <button
                    onClick={handleLogout}
                    className={isDark ? 'btn-light' : 'btn-dark'}
                >
                    <i className="bi bi-box-arrow-right"></i>
                    {!isCollapsed && <span>Log out</span>}
                </button>
                <button
                    onClick={toggleTheme}
                    className={isDark ? 'btn-light' : 'btn-dark'}
                >
                    <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon'}`}></i>
                    {!isCollapsed && <span>{isDark ? 'Light' : 'Dark'}</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;