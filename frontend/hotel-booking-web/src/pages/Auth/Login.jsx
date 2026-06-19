import React, { useState } from "react";
import { Link } from "react-router-dom"; // Đã bỏ useNavigate vì chúng ta dùng location.href
import axios from "axios";
import Swal from "sweetalert2"; // Import thư viện thông báo

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", formData);
      const { token, user } = response.data;
      
      // 1. Lưu thông tin vào bộ nhớ trình duyệt
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // 2. Hiển thị thông báo đăng nhập thành công bằng SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công!',
        text: `Chào mừng bạn quay trở lại.`,
        showConfirmButton: false, // Ẩn nút OK để tự động chuyển trang cho mượt
        timer: 1500 // Thông báo tự động tắt sau 1.5 giây
      }).then(() => {
        // 3. Ép tải lại trang web (Reload) về trang chủ để Navbar nhận diện quyền (Role)
        window.location.href = "/";
      });

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(errorMsg);
      
      // Hiển thị thêm thông báo lỗi nổi bật
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: errorMsg,
        confirmButtonColor: '#e74c3c'
      });
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ padding: "30px", background: "white", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "400px" }}>
        <h2 style={{ textAlign: "center", color: "var(--neon-blue)", marginBottom: "20px" }}>Đăng Nhập</h2>
        {error && <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ fontWeight: "bold", color: "#333" }}>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={{ width: "95%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ fontWeight: "bold", color: "#333" }}>Mật khẩu</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              style={{ width: "95%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc", outline: "none" }}
            />
          </div>
          <button type="submit" className="btn-search" style={{ marginTop: "15px", padding: "12px", fontSize: "16px", cursor: "pointer" }}>
            Đăng Nhập
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: "var(--neon-blue)", fontWeight: "bold", textDecoration: "none" }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}