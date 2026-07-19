import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Table.css';
import '../../../styles/Form.css';

const ContractShow = () => {
  // Khởi tạo các state là mảng rỗng để tránh lỗi .map khi chưa có dữ liệu
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]); // Đổi tên để khớp với mảng trả về
  const [contractTypes, setContractTypes] = useState([]); // Đổi tên để khớp với mảng trả về
  const [salaries, setSalaries] = useState([]); // Sửa lỗi chính tả từ setAlary
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
      setRoleApi('user'); // Role mặc định nếu có lỗi
    }
  }, []);

  // Lấy danh sách hợp đồng và các dữ liệu liên quan
  useEffect(() => {
    // Chỉ chạy khi roleApi đã được xác định
    if (!roleApi) return;

    const fetchData = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/contracts`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });

        // Kiểm tra nếu API trả về thành công và dữ liệu tồn tại
        if (response.data.success && response.data.data) {
          // Cập nhật các state từ các mảng con trong response.data.data
          setContracts(response.data.data.contracts || []); // Đảm bảo luôn là mảng
          setEmployees(response.data.data.employees || []);
          setContractTypes(response.data.data.contractTypes || []);
          setSalaries(response.data.data.salaries || []);
        } else {
          // Xử lý trường hợp success là false hoặc data không có
          setError(response.data.message || 'Lỗi không xác định khi lấy dữ liệu.');
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        setError('Không lấy được danh sách hợp đồng và dữ liệu liên quan.');
      }
    };
    fetchData();
  }, [roleApi]); // Chạy lại khi roleApi thay đổi

  // Các hàm console.log này nên ở ngoài return để không bị lỗi JSX
  console.log("ROLES từ API: ", roleApi);
  console.log("Danh sách Contracts: ", contracts);
  console.log("Danh sách Employees: ", employees);
  console.log("Danh sách Contract Types: ", contractTypes);
  console.log("Danh sách Salaries: ", salaries);


  const handleEdit = (id) => {
    navigate(`/hrm/contracts/edit/${id}`);
  };

  const handleDelete = async (id) => {
    // Thay thế window.confirm bằng một modal tùy chỉnh để tránh lỗi trong môi trường sandbox
    if (window.confirm('Bạn có chắc muốn xóa hợp đồng này?')) {
      try {
        const API_URL = `http://127.0.0.1:8000/api/${roleApi}/contracts`;
        const response = await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (response.data.success) {
          // Lọc bỏ hợp đồng đã xóa khỏi state
          setContracts(contracts.filter((contract) => contract.id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Lỗi khi xóa hợp đồng:', err);
        setError('Không xóa được hợp đồng.');
      }
    }
  };

  return (
    <div className="user-container">
      <div style={{ paddingLeft: '40px', width: '100%', maxWidth: '900px', marginBottom: '24px', textAlign: 'left' }}>
        <h1 className="page-title" style={{ margin: 0, textAlign: 'left' }}>Contracts</h1>
        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
        <Button
          className="btn-add"
          onClick={() => navigate('/hrm/contracts/create')}
        >
          Add
        </Button>
      </div>
      <div className="table-wrapper">
        {/* Đảm bảo contracts là mảng trước khi render bảng */}
        {contracts.length === 0 && !error ? (
          <p>Đang tải dữ liệu hoặc không có hợp đồng nào.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '20px' }}>No.</th>
                <th>Employee</th>
                <th>Contract Type</th>
                <th>Salary Level</th>
                <th>Contract Code</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Sign Date</th>
                <th>Status</th>
                <th>Years of Service</th>
                <th>Note</th>
                <th className="action">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Vòng lặp map sẽ chạy ổn định vì contracts giờ chắc chắn là mảng */}
              {contracts.map((contract, index) => {
                // Tìm thông tin liên quan từ các mảng khác qua ID
                const employee = employees.find(emp => emp.id === contract.employee_id);
                const contractType = contractTypes.find(ct => ct.id === contract.type);
                const salary = salaries.find(sal => sal.id === contract.salary_id);

                return (
                  <tr key={contract.id}>
                    <td>{index + 1}</td>
                    {/* Hiển thị thông tin hoặc 'N/A' nếu không tìm thấy */}
                    <td>{employee?.fullname || 'N/A'}</td>
                    <td>{contractType?.name || 'N/A'}</td>
                    <td>{salary?.salary_level || 'N/A'}</td>
                    <td>{contract.contract_code}</td>
                    <td>{contract.start_date}</td>
                    <td>{contract.end_date || 'N/A'}</td>
                    <td>{contract.sign_date}</td>
                    <td>{contract.status}</td>
                    <td>{contract.year_of_service}</td>
                    <td>{contract.note || 'N/A'}</td>
                    <td className="action">
                      <i
                        className="icon bi bi-pencil"
                        onClick={() => handleEdit(contract.id)}
                      ></i>
                      <i
                        className="icon bi bi-trash"
                        onClick={() => handleDelete(contract.id)}
                      ></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ContractShow;
