import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1 });

  // State cho Modal Sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState({ 
    id: null, role: "", isActive: true, password: "", fullName: "", phone: "" 
  });

  const API_BASE_URL = "http://localhost:5154/api";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Users`, {
        params: { searchEmail, page: pagination.page, pageSize: pagination.pageSize }
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
  }, [pagination.page]); // Tự động load lại khi thay đổi trang

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const openEditModal = (user) => {
    setEditingUser({ 
      id: user.id, 
      role: user.role, 
      isActive: user.isActive, 
      password: "", 
      fullName: user.fullName, 
      phone: user.phone || "" 
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/Users/${editingUser.id}`, {
        role: editingUser.role,
        isActive: editingUser.isActive,
        password: editingUser.password || null,
        fullName: editingUser.fullName,
        phone: editingUser.phone
      });
      Swal.fire('Thành công!', 'Đã cập nhật thông tin người dùng.', 'success');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      Swal.fire('Lỗi!', 'Không thể cập nhật thông tin.', 'error');
    }
  };

  const handleToggleActive = (userId, currentStatus) => {
    Swal.fire({
      title: `Bạn có chắc muốn ${currentStatus ? 'khóa' : 'mở khóa'} tài khoản này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const user = users.find(u => u.id === userId);
          await axios.put(`${API_BASE_URL}/Users/${userId}`, { 
            role: user.role, 
            isActive: !currentStatus,
            fullName: user.fullName,
            phone: user.phone 
          });
          fetchUsers();
        } catch { Swal.fire('Lỗi!', 'Không thể cập nhật trạng thái.', 'error'); }
      }
    });
  };

  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: 'Xóa tài khoản?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      confirmButtonText: 'Xác nhận xóa'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/Users/${userId}`);
          fetchUsers();
        } catch { Swal.fire('Lỗi!', 'Không thể xóa.', 'error'); }
      }
    });
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#e74c3c' }}>Quản lý Người Dùng</h1>
        <Link to="/admin/dashboard" style={{ padding: '8px 15px', background: '#ccc', borderRadius: '5px', textDecoration: 'none', color: '#333' }}>⬅ Quay lại Dashboard</Link>
      </div>

      {/* Modal Sửa */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: '10%', left: '35%', background: 'white', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', zIndex: 1000, boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: '350px' }}>
          <h3>Sửa thông tin</h3>
          <label>Họ và tên:</label><br />
          <input value={editingUser.fullName} onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})} style={{ width: '100%', marginBottom: '10px' }} /><br />
          <label>Số điện thoại:</label><br />
          <input value={editingUser.phone} onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})} style={{ width: '100%', marginBottom: '10px' }} /><br />
          <label>Mật khẩu mới:</label><br />
          <input type="password" placeholder="Để trống nếu không đổi" onChange={(e) => setEditingUser({...editingUser, password: e.target.value})} style={{ width: '100%', marginBottom: '10px' }} /><br />
          <label>Quyền:</label><br />
          <select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})} style={{ width: '100%', marginBottom: '10px' }}>
            <option value="Tourist">Tourist</option>
            <option value="HotelManager">Hotel Manager</option>
            <option value="Admin">Admin</option>
          </select>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={handleSaveEdit} style={{ background: '#27ae60', color: 'white', border: 'none', padding: '10px', flex: 1, cursor: 'pointer' }}>Lưu</button>
            <button onClick={() => setIsEditModalOpen(false)} style={{ background: '#ccc', border: 'none', padding: '10px', flex: 1, cursor: 'pointer' }}>Hủy</button>
          </div>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>ID</th><th>Họ và Tên</th><th>Email</th><th>SĐT</th><th>Role</th><th>Trạng thái</th><th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{u.id}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.role}</td>
              <td>{u.isActive ? 'Hoạt động' : 'Đã khóa'}</td>
              <td style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => openEditModal(u)} style={{ background: '#f39c12', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>Sửa</button>
                <button onClick={() => handleToggleActive(u.id, u.isActive)} style={{ background: u.isActive ? '#e74c3c' : '#27ae60', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>
                  {u.isActive ? 'Khóa' : 'Mở'}
                </button>
                <button onClick={() => handleDeleteUser(u.id)} style={{ background: '#7f8c8d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Khối phân trang */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
        <button 
          disabled={pagination.page === 1}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          style={{ padding: '8px 16px', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer' }}
        >
          Trước
        </button>
        <span>Trang <strong>{pagination.page}</strong> / <strong>{pagination.totalPages}</strong></span>
        <button 
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          style={{ padding: '8px 16px', cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}
        >
          Sau
        </button>
      </div>
    </div>
  );
}