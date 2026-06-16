import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManagerDashboard() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:5154/api";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    const user = JSON.parse(storedUser);
    if (user.role !== "HotelManager" && user.role !== "Admin") {
      alert("Bạn không có quyền truy cập trang này!");
      navigate("/");
      return;
    }

    const fetchHotels = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Hotels/manager/${user.id}`);
        setHotels(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách khách sạn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [navigate]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Đang tải dữ liệu...</div>;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Dashboard Quản lý Khách sạn</h1>
      
      {hotels.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {hotels.map((hotel) => (
            <div key={hotel.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <h2 style={{ marginTop: 0 }}>{hotel.name}</h2>
              <p style={{ color: '#555' }}>📍 {hotel.city} - {hotel.address}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <Link 
                  to={`/manager/hotel/${hotel.id}/rooms`}
                  style={{ padding: '10px', background: 'var(--neon-blue)', color: 'white', textAlign: 'center', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  🚪 Quản lý Phòng & Loại phòng
                </Link>
                <Link 
                  to={`/manager/hotel/${hotel.id}/bookings`}
                  style={{ padding: '10px', background: '#27ae60', color: 'white', textAlign: 'center', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  📅 Quản lý Đặt phòng
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Bạn chưa được phân công quản lý khách sạn nào.</p>
          <p>Vui lòng liên hệ Admin để được cấp quyền quản lý khách sạn.</p>
        </div>
      )}
    </div>
  );
}
