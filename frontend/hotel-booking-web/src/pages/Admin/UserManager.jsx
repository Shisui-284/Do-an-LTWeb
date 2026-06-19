import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchEmail, setSearchEmail] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1 });
  const [sortBy, setSortBy] = useState("fullName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [allUsers, setAllUsers] = useState([]); // Store all users for client-side filtering

  const API_BASE_URL = "/api";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Users`, {
        params: {
          searchEmail: searchEmail,
          page: 1,
          pageSize: 1000 // Get all users for client-side filtering
        }
      });
      let data = response.data.data || [];
      setAllUsers(data);
      applyFiltersAndSort(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = (data) => {
    // Apply search filter
    if (searchEmail) {
      data = data.filter(u => u.email?.toLowerCase().includes(searchEmail.toLowerCase()));
    }
    
    // Apply role filter
    if (filterRole) {
      data = data.filter(u => u.role === filterRole);
    }
    
    // Apply status filter
    if (filterStatus) {
      const isActive = filterStatus === 'active';
      data = data.filter(u => u.isActive === isActive);
    }
    
    // Apply sorting
    data.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "fullName") {
        aVal = a.fullName;
        bVal = b.fullName;
      } else if (sortBy === "email") {
        aVal = a.email;
        bVal = b.email;
      } else if (sortBy === "role") {
        aVal = a.role;
        bVal = b.role;
      }
      
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    // Apply pagination
    const totalPages = Math.ceil(data.length / pagination.pageSize);
    const startIdx = (pagination.page - 1) * pagination.pageSize;
    const endIdx = startIdx + pagination.pageSize;
    
    setUsers(data.slice(startIdx, endIdx));
    setPagination(prev => ({ ...prev, totalPages }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (allUsers.length > 0) {
      setPagination(prev => ({ ...prev, page: 1 }));
      applyFiltersAndSort(allUsers);
    }
  }, [searchEmail, filterRole, filterStatus, sortBy, sortOrder]);

  useEffect(() => {
    if (allUsers.length > 0) {
      applyFiltersAndSort(allUsers);
    }
  }, [pagination.page]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  // Cập nhật quyền (Role)
  const handleRoleChange = async (userId, newRole) => {
    try {
      const user = users.find(u => u.id === userId);
      // Chỉ gửi cấu trúc DTO gồm role và isActive lên Backend để không bị bắt lỗi mật khẩu
      await axios.put(`${API_BASE_URL}/Users/${userId}`, { 
        role: newRole, 
        isActive: user.isActive 
      });
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Quyền đã được cập nhật.',
        timer: 1500,
        showConfirmButton: false
      });
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại!',
        text: "Có lỗi xảy ra khi cập nhật quyền!",
        confirmButtonColor: '#e74c3c'
      });
    }
  };

  // Khóa hoặc mở khóa tài khoản (Fix lỗi payload)
  const handleToggleActive = (userId, currentStatus) => {
    const actionText = currentStatus ? 'khóa' : 'mở khóa';
    
    // 1. Hiện Popup xác nhận bằng SweetAlert2 
    Swal.fire({
      title: `Bạn có chắc muốn ${actionText} tài khoản này?`,
      text: currentStatus ? "Người dùng sẽ không thể đăng nhập vào hệ thống!" : "Người dùng sẽ được cấp lại quyền truy cập.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus ? '#e74c3c' : '#27ae60', // Đỏ nếu Khóa, Xanh nếu Mở khóa
      cancelButtonColor: '#95a5a6',
      confirmButtonText: `Xác nhận ${actionText}`,
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      
      // 2. Nếu người dùng bấm "Vâng..." thì mới gọi API
      if (result.isConfirmed) {
        try {
          const user = users.find(u => u.id === userId);
          // Chỉ gửi cấu trúc DTO gồm role và isActive lên Backend
          await axios.put(`${API_BASE_URL}/Users/${userId}`, { 
            role: user.role, 
            isActive: !currentStatus 
          });
          
          // 3. Thông báo thành công
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Trạng thái tài khoản đã được cập nhật.',
            timer: 1500, // Tự động tắt sau 1.5 giây
            showConfirmButton: false // Ẩn nút OK cho mượt
          });
          
          fetchUsers(); // Tải lại danh sách
          
        } catch (error) {
          // 4. Thông báo thất bại
          Swal.fire({
            icon: 'error',
            title: 'Thất bại!',
            text: "Có lỗi xảy ra khi cập nhật trạng thái tài khoản!",
            confirmButtonColor: '#e74c3c'
          });
        }
      }
    });
  };

  // Hàm thực hiện xóa hẳn tài khoản người dùng
  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Hành động này sẽ xóa vĩnh viễn dữ liệu và không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c', // Màu đỏ cho nút Xóa
      cancelButtonColor: '#95a5a6',  // Màu xám cho nút Hủy
      confirmButtonText: 'Xác nhận xóa',
      cancelButtonText: 'Hủy bỏ'
    }).then(async (result) => {
      // 2. Nếu người dùng bấm nút " Xóa "
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/Users/${userId}`);

          // Thông báo xóa thành công
          Swal.fire('Đã xóa!', 'Dữ liệu đã được dọn sạch.', 'success');

          // Gọi lại hàm tải danh sách
          fetchUsers();
          setSelectedUser(null);
          setRooms([]);
        } catch (error) {
          Swal.fire('Lỗi!', 'Không thể xóa do dữ liệu đang bị ràng buộc.', 'error');
        }
      }
    });
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#e74c3c' }}>Quản lý Người Dùng</h1>
        <Link to="/admin/dashboard" style={{ padding: '8px 15px', background: '#ccc', borderRadius: '5px', textDecoration: 'none', color: '#333' }}>
          ⬅ Quay lại Dashboard
        </Link>
      </div>

      <div style={{ background: '#f5f7fa', padding: '20px', borderRadius: '10px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Tìm theo email..." 
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <select 
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">Tất cả vai trò</option>
          <option value="Tourist">Tourist</option>
          <option value="HotelManager">Hotel Manager</option>
          <option value="Admin">Admin</option>
        </select>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Đã khóa</option>
        </select>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="fullName">Sắp xếp: Tên</option>
          <option value="email">Sắp xếp: Email</option>
          <option value="role">Sắp xếp: Vai trò</option>
        </select>
        <button 
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', background: '#3498db', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {sortOrder === 'asc' ? '⬆️ Tăng dần' : '⬇️ Giảm dần'}
        </button>
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
                  <td style={{ padding: '12px', display: 'flex', gap: '5px' }}>
                    <button 
                      onClick={() => handleToggleActive(u.id, u.isActive)}
                      style={{ padding: '5px 10px', background: u.isActive ? '#e74c3c' : '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      {u.isActive ? 'Khóa TK' : 'Mở khóa'}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      style={{ padding: '5px 10px', background: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy người dùng.</td></tr>
              )}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifycontent: 'center', gap: '10px', marginTop: '30px' }}>
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