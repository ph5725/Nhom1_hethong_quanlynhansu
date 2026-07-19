import React, { useState, useEffect } from 'react';
import { Container, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/Form.css';
import '../../styles/Table.css';

const MyWorkSchedule = () => {
    const [workSchedule, setWorkSchedule] = useState(null);
    const [error, setError] = useState('');
    const [employeeId, setEmployeeId] = useState(null);
    const [roleApi, setRoleApi] = useState(null); // Role dùng cho API

    // Fetch user data to get employee_id
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const USER_URL = 'http://127.0.0.1:8000/api/user';
                const response = await axios.get(USER_URL, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
                });

                if (response.data.success) {
                    const employee = response.data.data.user.employee;
                    setEmployeeId(employee.id);
                } else {
                    setError('Failed to retrieve user data');
                }
            } catch (err) {
                const errorMessage = err.response?.data?.error || 'Failed to fetch user data';
                if (err.response?.status === 401) {
                    setError('Unauthenticated. Please log in.');
                } else {
                    setError(errorMessage);
                }
                console.error('Error fetching user data:', err.response ? err.response.data : err.message);
            }
        };

        fetchUserData();
    }, []);

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

    // Lấy danh sách work schedule
    useEffect(() => {
        if (!roleApi) return; // Chờ roleApi được set
        if (!employeeId) return;

        const fetchWorkSchedule = async () => {
            try {
                const WORK_SCHEDULE_URL = `http://127.0.0.1:8000/api/${roleApi}/my-schedule/show/${employeeId}`;
                const response = await axios.get(WORK_SCHEDULE_URL, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
                });

                if (response.data.success) {
                    setWorkSchedule(response.data.data);
                } else {
                    setError('Failed to retrieve work schedule');
                }
            } catch (err) {
                const errorMessage = err.response?.data?.error || 'Failed to fetch work schedule';
                if (err.response?.status === 401) {
                    setError('Unauthenticated. Please log in.');
                } else {
                    setError(errorMessage);
                }
                console.error('Error fetching work schedule:', err.response ? err.response.data : err.message);
            }
        };

        fetchWorkSchedule();
    }, [employeeId, roleApi]);

    return (
        <div className="user-container">
            <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
                <h1 className="page-title">My Work Schedule</h1>
                {error && <Alert variant="danger" className="error-message">{error}</Alert>}
            </div>
            <div className="table-wrapper">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Work Date</th>
                            <th>Shift</th>
                            <th>Status</th>
                            <th>Is Day Off</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workSchedule ? (
                            <tr key={workSchedule.id}>
                                <td>1</td>
                                <td>{new Date(workSchedule.work_date).toLocaleDateString()}</td>
                                <td>{workSchedule.work_shift?.shift_name || 'N/A'}</td>
                                <td>{workSchedule.work_date_status?.name || 'N/A'}</td>
                                <td>{workSchedule.is_day_off ? 'Yes' : 'No'}</td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>
                                    No work schedule data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default MyWorkSchedule;