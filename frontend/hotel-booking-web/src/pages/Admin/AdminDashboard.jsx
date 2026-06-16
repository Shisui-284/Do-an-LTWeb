import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    const user = JSON.parse(storedUser);
    if (user.role !== "Admin") {
      alert("Chỉ Admin mới có quyền truy cập trang này!");
      navigate("/");
      return;
    }
  }, [navigate]);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', color: '#e74c3c' }}>🛡️ Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        
        <div style={{ border: '1px solid #eee', borderRadius: '10px', padding: '30px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background: '#fdfbfb' }}>
          <h2 style={{ margin: '0 0 15px 0' }}>👥 Quản lý Người Dùng</h2>
          <p style={{ color: '#555', marginBottom: '20px' }}>Xem danh sách, phân quyền Admin/HotelManager, Khóa hoặc Mở khóa tài khoản.</p>
          <Link 
            to="/admin/users"
            style={{ display: 'inline-block', padding: '10px 20px', background: '#3498db', color: 'white', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Vào trang Quản lý
          </Link>
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: '10px', padding: '30px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background: '#fdfbfb' }}>
          <h2 style={{ margin: '0 0 15px 0' }}>🏨 Quản lý Khách Sạn</h2>
          <p style={{ color: '#555', marginBottom: '20px' }}>Thêm, Sửa, Xóa khách sạn trên toàn hệ thống và Phân công Quản lý (Manager).</p>
          <Link 
            to="/admin/hotels"
            style={{ display: 'inline-block', padding: '10px 20px', background: '#e67e22', color: 'white', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Vào trang Quản lý
          </Link>
        </div>

      </div>
    </div>
  );
}
