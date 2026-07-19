import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Form.css';

const EmployeeEdit = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        user_id: '',
        department_id: '',
        education_id: '',
        position_id: '',
        fullname: '',
        date_of_birth: '',
        gender: '',
        birthplace: '',
        ethnicity: '',
        address: '',
        email: '',
        id_card: '',
        image_path: null, // Ban đầu là null hoặc chuỗi đường dẫn từ API
    });
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [educationLevels, setEducationLevels] = useState([]);
    const [positions, setPositions] = useState([]);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [error, setError] = useState('');
    const [roleApi, setRoleApi] = useState(null); // Role dùng cho API
    const navigate = useNavigate();

    // State để lưu URL của ảnh hiện tại từ DB
    const [currentImagePreview, setCurrentImagePreview] = useState('');

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

    // Lấy thông tin employee và related data
    useEffect(() => {
        if (!roleApi) return; // Chờ roleApi được set
        const fetchData = async () => {
            try {
                const API_URL = `http://127.0.0.1:8000/api/${roleApi}/employees`;
                const [employeeRes, departmentsRes, usersRes, educationLevelsRes, positionsRes] = await Promise.all([
                    axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }),
                    axios.get(`http://127.0.0.1:8000/api/${roleApi}/departments`, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }),
                    axios.get(`http://127.0.0.1:8000/api/${roleApi}/users`, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }),
                    axios.get(`http://127.0.0.1:8000/api/${roleApi}/education-levels`, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }),
                    axios.get(`http://127.0.0.1:8000/api/${roleApi}/positions`, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }),
                ]);

                if (employeeRes.data.success) {
                    const employeeData = employeeRes.data.data;
                    setFormData({
                        user_id: employeeData.user_id || '',
                        department_id: employeeData.department_id || '',
                        education_id: employeeData.education_id || '',
                        position_id: employeeData.position_id || '',
                        fullname: employeeData.fullname || '',
                        date_of_birth: employeeData.date_of_birth || '',
                        gender: employeeData.gender || '',
                        birthplace: employeeData.birthplace || '',
                        ethnicity: employeeData.ethnicity || '',
                        address: employeeData.address || '',
                        email: employeeData.email || '',
                        id_card: employeeData.id_card || '',
                        // Lưu đường dẫn ảnh hiện có vào formData
                        image_path: employeeData.image_path || null,
                    });
                    // Lưu đường dẫn ảnh hiện có để hiển thị preview
                    setCurrentImagePreview(employeeData.image_path ? `http://127.0.0.1:8000/storage/${employeeData.image_path}` : '');
                } else {
                    setServerError(employeeRes.data.message);
                }

                if (departmentsRes.data.success) setDepartments(departmentsRes.data.data.departments);
                if (usersRes.data.success) setUsers(usersRes.data.data);
                if (educationLevelsRes.data.success) setEducationLevels(educationLevelsRes.data.data);
                if (positionsRes.data.success) setPositions(positionsRes.data.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setServerError('Failed to fetch data');
            }
        };
        fetchData();
    }, [id, roleApi]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image_path') {
            // Khi người dùng chọn file mới, cập nhật formData với đối tượng File
            setFormData({ ...formData, [name]: files[0] });
            // Tạo URL tạm thời để hiển thị preview ảnh mới
            if (files[0]) {
                setCurrentImagePreview(URL.createObjectURL(files[0]));
            } else {
                // Nếu không có file nào được chọn, clear preview
                setCurrentImagePreview('');
                // Đồng thời set lại image_path trong formData về null nếu muốn xóa ảnh cũ
                setFormData({ ...formData, image_path: null });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const API_URL = `http://127.0.0.1:8000/api/${roleApi}/employees`;
            const formDataToSend = new FormData();

            // Thêm các trường dữ liệu vào FormData
            // Kiểm tra và thêm từng trường, trừ trường image_path nếu nó là chuỗi (tức là ảnh cũ)
            Object.keys(formData).forEach((key) => {
                if (key === 'image_path') {
                    // Nếu image_path là một File object (người dùng đã chọn ảnh mới)
                    if (formData[key] instanceof File) {
                        formDataToSend.append(key, formData[key]);
                    }
                    // Nếu image_path là null (người dùng muốn xóa ảnh cũ, hoặc không có ảnh)
                    else if (formData[key] === null) {
                        // Gửi một giá trị rỗng hoặc null để backend xử lý xóa ảnh
                        formDataToSend.append(key, ''); // Backend sẽ nhận '' và hiểu là xóa
                    }
                    // Nếu image_path là một chuỗi (ảnh cũ không thay đổi), không thêm vào FormDataToSend
                    // Backend sẽ giữ lại ảnh cũ nếu không có dữ liệu mới cho image_path
                } else if (formData[key] !== null && formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Quan trọng: Thêm _method=PUT để Laravel nhận diện là PUT request khi dùng FormData
            formDataToSend.append('_method', 'PUT');

            const response = await axios.post(`${API_URL}/${id}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'multipart/form-data', // Cần thiết khi gửi FormData
                },
            });
            if (response.data.success) {
                navigate('/hrm/employees');
            } else {
                setServerError(response.data.message);
            }
        } catch (err) {
            console.error("Error updating employee:", err);
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setServerError('Failed to update employee');
            }
        }
    };

    return (
        <div className="user-container">
            <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
                <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Edit Employee</h1>
                {serverError && <Alert variant="danger" className="error-message">{serverError}</Alert>}
                {error && <Alert variant="warning" className="error-message">{error}</Alert>} {/* Hiển thị lỗi role */}
            </div>
            <div className="form-card">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">User</Form.Label>
                        <Form.Select
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            className="form-select"
                            isInvalid={!!errors.user_id}
                        >
                            <option value="">Select User</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.user_id}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Department</Form.Label>
                        <Form.Select
                            name="department_id"
                            value={formData.department_id}
                            onChange={handleChange}
                            className="form-select"
                            isInvalid={!!errors.department_id}
                        >
                            <option value="">Select Department</option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.department_id}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Education Level</Form.Label>
                        <Form.Select
                            name="education_id"
                            value={formData.education_id}
                            onChange={handleChange}
                            className="form-select"
                            isInvalid={!!errors.education_id}
                        >
                            <option value="">Select Education Level</option>
                            {educationLevels.map((educationLevel) => (
                                <option key={educationLevel.id} value={educationLevel.id}>
                                    {educationLevel.level}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.education_id}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Position</Form.Label>
                        <Form.Select
                            name="position_id"
                            value={formData.position_id}
                            onChange={handleChange}
                            className="form-select"
                            isInvalid={!!errors.position_id}
                        >
                            <option value="">Select Position</option>
                            {positions.map((position) => (
                                <option key={position.id} value={position.id}>
                                    {position.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.position_id}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter full name"
                            isInvalid={!!errors.fullname}
                        />
                        <Form.Control.Feedback type="invalid">{errors.fullname}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Date of Birth</Form.Label>
                        <div className="textfield-wrapper">
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="form-control"
                                // isInvalid={!!errors.date_of_birth} // Không cần isInvalid ở đây nếu đã có feedback dưới
                            />
                        </div>
                        {errors.date_of_birth && (
                            <div className="invalid-feedback d-block">{errors.date_of_birth}</div>
                        )}
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Gender</Form.Label>
                        <Form.Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="form-select"
                            isInvalid={!!errors.gender}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Birthplace</Form.Label>
                        <Form.Control
                            type="text"
                            name="birthplace"
                            value={formData.birthplace}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter birthplace"
                            isInvalid={!!errors.birthplace}
                        />
                        <Form.Control.Feedback type="invalid">{errors.birthplace}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Ethnicity</Form.Label>
                        <Form.Control
                            type="text"
                            name="ethnicity"
                            value={formData.ethnicity}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter ethnicity"
                            isInvalid={!!errors.ethnicity}
                        />
                        <Form.Control.Feedback type="invalid">{errors.ethnicity}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter address"
                            isInvalid={!!errors.address}
                        />
                        <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter email"
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">ID Card</Form.Label>
                        <Form.Control
                            type="text"
                            name="id_card"
                            value={formData.id_card}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter ID card number"
                            isInvalid={!!errors.id_card}
                        />
                        <Form.Control.Feedback type="invalid">{errors.id_card}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label className="form-label">Image</Form.Label>
                        {/* Hiển thị ảnh hiện tại nếu có */}
                        {currentImagePreview && (
                            <div className="mb-2">
                                <img src={currentImagePreview} alt="Current Employee" style={{ maxWidth: '200px', height: 'auto', border: '1px solid #ddd' }} />
                            </div>
                        )}
                        <Form.Control
                            type="file"
                            name="image_path"
                            onChange={handleChange}
                            className="form-control"
                            accept="image/*"
                            isInvalid={!!errors.image_path}
                        />
                        <Form.Control.Feedback type="invalid">{errors.image_path}</Form.Control.Feedback>
                    </Form.Group>
                    <div className="form-buttons">
                        <Button
                            className="btn-cancel"
                            onClick={() => navigate('/hrm/employees')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="btn-save">
                            Save
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default EmployeeEdit;