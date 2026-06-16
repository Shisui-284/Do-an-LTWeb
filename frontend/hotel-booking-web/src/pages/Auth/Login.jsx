import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5154/api/auth/login", formData);
      const { token, user } = response.data;
      
      // Lưu token vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      alert("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ padding: "30px", background: "white", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "400px" }}>
        <h2 style={{ textAlign: "center", color: "var(--neon-blue)", marginBottom: "20px" }}>Đăng Nhập</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
            Đăng Nhập
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: "var(--neon-blue)" }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
