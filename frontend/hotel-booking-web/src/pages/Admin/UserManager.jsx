import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchEmail, setSearchEmail] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1 });

  const API_BASE_URL = "http://localhost:5154/api";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Users`, {
        params: {
          searchEmail: searchEmail,
          page: pagination.page,
          pageSize: pagination.pageSize
        }
      });
      setUsers(response.data.data || []);
      if (response.data.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          page: response.data.pagination.currentPage
        }));
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const user = users.find(u => u.id === userId);
      await axios.put(`${API_BASE_URL}/Users/${userId}`, { ...user, role: newRole });
      alert("Cập nhật quyền thành công!");
      fetchUsers();
    } catch (error) {
      alert("Lỗi khi cập nhật quyền.");
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    if (window.confirm(`Bạn có chắc muốn ${currentStatus ? 'khóa' : 'mở khóa'} tài khoản này?`)) {
      try {
        const user = users.find(u => u.id === userId);
        await axios.put(`${API_BASE_URL}/Users/${userId}`, { ...user, isActive: !currentStatus });
        fetchUsers();
      } catch (error) {
        alert("Lỗi khi cập nhật trạng thái tài khoản.");
      }
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#e74c3c' }}>Quản lý Người Dùng</h1>
        <Link to="/admin/dashboard" style={{ padding: '8px 15px', background: '#ccc', borderRadius: '5px', textDecoration: 'none', color: '#333' }}>
          ⬅ Quay lại Dashboard
        </Link>
      </div>

      <div style={{ background: '#f5f7fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Tìm theo email..." 
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '250px' }}
          />
          <button type="submit" style={{ padding: '8px 15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Tìm kiếm</button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Đang tải...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>ID</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Họ và Tên</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Email</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Phân Quyền (Role)</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Trạng thái</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee', background: !u.isActive ? '#fdf2f2' : 'white' }}>
                  <td style={{ padding: '12px' }}>{u.id}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{u.fullName}</td>
                  <td style={{ padding: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>
                    <select 
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={{ padding: '5px', borderRadius: '5px' }}
                    >
                      <option value="Tourist">Tourist (Khách)</option>
                      <option value="HotelManager">Hotel Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold',
                      background: u.isActive ? '#27ae60' : '#e74c3c', color: 'white'
                    }}>
                      {u.isActive ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={() => handleToggleActive(u.id, u.isActive)}
                      style={{ padding: '5px 10px', background: u.isActive ? '#e74c3c' : '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      {u.isActive ? 'Khóa TK' : 'Mở khóa'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy người dùng.</td></tr>
              )}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
              <button 
                onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                disabled={pagination.page === 1}
                style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', background: pagination.page === 1 ? '#eee' : 'white', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer' }}
              >
                Trang trước
              </button>
              <span style={{ padding: '8px 16px', background: '#3498db', color: 'white', borderRadius: '5px' }}>
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <button 
                onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                disabled={pagination.page === pagination.totalPages}
                style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', background: pagination.page === pagination.totalPages ? '#eee' : 'white', cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer' }}
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
