import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Search from "./pages/Tourist/Search";
import HotelDetail from "./pages/Tourist/HotelDetail";
import Profile from "./pages/Tourist/Profile";
import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import RoomManager from "./pages/Manager/RoomManager";
import BookingManager from "./pages/Manager/BookingManager";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManager from "./pages/Admin/UserManager";
import HotelAdminManager from "./pages/Admin/HotelAdminManager";

// Khởi tạo trang giới thiệu đơn giản của bạn
const About = () => (
  <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    <h1> Giới thiệu Dự án</h1>
    <p>
      Hệ thống đặt phòng khách sạn trực tuyến - Đồ án lập trình Web nâng cao.
    </p>
    <p>
      Phát triển bởi Nhóm 3 thành viên sử dụng ASP.NET Core Web API & ReactJS.
    </p>
  </div>
);

function Navigation() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="luxury-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" className="nav-logo">
          <span style={{ color: "white" }}> ĐỒ ÁN</span>{" "}
          <span style={{ color: "var(--neon-blue)" }}>BOOKING</span>
        </Link>
        <Link to="/"> Trang chủ</Link>
        <Link to="/search"> Tìm kiếm</Link>
        {user?.role === 'HotelManager' && (
          <Link to="/manager/dashboard" style={{ color: "var(--neon-blue)", fontWeight: "bold" }}>⚙️ Quản lý Khách sạn</Link>
        )}
        {user?.role === 'Admin' && (
          <Link to="/admin/dashboard" style={{ color: "#e74c3c", fontWeight: "bold" }}>🛡️ Admin Dashboard</Link>
        )}
        <Link to="/about">Giới thiệu</Link>
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/profile" style={{ color: 'white' }}>Xin chào, <strong>{user.fullName}</strong></Link>
            <button 
              onClick={handleLogout} 
              style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ background: 'var(--neon-blue)', padding: '8px 20px', borderRadius: '20px', color: 'white' }}>Đăng nhập</Link>
            <Link to="/register" style={{ border: '1px solid var(--neon-blue)', padding: '8px 20px', borderRadius: '20px', color: 'var(--neon-blue)' }}>Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/hotel/:hotelId/rooms" element={<RoomManager />} />
        <Route path="/manager/hotel/:hotelId/bookings" element={<BookingManager />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManager />} />
        <Route path="/admin/hotels" element={<HotelAdminManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
