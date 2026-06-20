import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://corsproxy.io/?http://dangphuongnam423-001-site1.dtempurl.com/api/auth/register", formData);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ padding: "30px", background: "white", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "450px" }}>
        <h2 style={{ textAlign: "center", color: "var(--neon-blue)", marginBottom: "20px" }}>Đăng Ký Tài Khoản</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label>Họ và Tên</label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
              style={{ width: "95%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
          <div>
            <label>Số điện thoại</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              style={{ width: "95%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
          <div>
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={{ width: "95%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
          <div>
            <label>Mật khẩu</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              style={{ width: "95%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
          <button type="submit" className="btn-search" style={{ marginTop: "10px" }}>
            Đăng Ký
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Đã có tài khoản? <Link to="/login" style={{ color: "var(--neon-blue)" }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
