import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TouristHome() {
  // 1. State lưu các tham số bộ lọc
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
    page: 1,
    pageSize: 4,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // 2. State lưu dữ liệu trả về từ API
  const [hotels, setHotels] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });
  const [loading, setLoading] = useState(false);

  // Hàm gọi API xuống Backend
  const searchHotels = async () => {
    setLoading(true);
    try {
      // Chuyển đổi object filters thành query string params
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const response = await axios.get(`http://localhost:5000/api/Hotels/search?${queryParams.toString()}`);
      setHotels(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Lỗi khi kết nối API tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tự động gọi lại API khi người dùng chuyển trang hoặc thay đổi tiêu chí sắp xếp
  useEffect(() => {
    searchHotels();
  }, [filters.page, filters.sortBy, filters.sortOrder]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchHotels();
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>🌴 Tìm Kiếm & Đặt Phòng Khách Sạn</h1>
      
      {/* FORM TÌM KIẾM & BỘ LỌC */}
      <form onSubmit={handleSearchSubmit} style={{
        background: '#f8f9fa', padding: '20px', borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px'
      }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Thành phố</label>
          <input type="text" name="city" value={filters.city} onChange={handleInputChange} placeholder="VD: Hà Nội, Đà Nẵng..." style={{ width: '90%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Loại phòng</label>
          <input type="text" name="roomType" value={filters.roomType} onChange={handleInputChange} placeholder="VD: Deluxe, Standard..." style={{ width: '90%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Giá tối thiểu (VNĐ)</label>
          <input type="number" name="minPrice" value={filters.minPrice} onChange={handleInputChange} placeholder="Từ..." style={{ width: '90%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Giá tối đa (VNĐ)</label>
          <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleInputChange} placeholder="Đến..." style={{ width: '90%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Ngày nhận phòng</label>
          <input type="date" name="checkIn" value={filters.checkIn} onChange={handleInputChange} style={{ width: '90%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Ngày trả phòng</label>
          <input type="date" name="checkOut" value={filters.checkOut} onChange={handleInputChange} style={{ width: '90%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            🔍 Tìm kiếm phòng trống
          </button>
        </div>
      </form>

      {/* THANH ĐIỀU KHIỂN SẮP XẾP */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Kết quả tìm thấy ({pagination.totalItems || 0} khách sạn)</h3>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Sắp xếp theo:</label>
          <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} style={{ padding: '6px', borderRadius: '4px' }}>
            <option value="name">Tên khách sạn</option>
            <option value="city">Thành phố</option>
          </select>
          <select value={filters.sortOrder} onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })} style={{ padding: '6px', borderRadius: '4px', marginLeft: '5px' }}>
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>
      </div>

      {/* DANH SÁCH KẾT QUẢ KHÁCH SẠN */}
      {loading ? <p style={{ textAlign: 'center' }}>Đang tải dữ liệu...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {hotels.map(hotel => (
            <div key={hotel.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h2 style={{ color: '#2c3e50', marginTop: '0' }}>🏨 {hotel.name}</h2>
              <p style={{ color: '#7f8c8d' }}>📍 <strong>Địa chỉ:</strong> {hotel.address}, {hotel.city}</p>
              <p>{hotel.description}</p>
              
              <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', color: '#16a085' }}>Các loại phòng khả dụng:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                {hotel.roomTypes.map(rt => (
                  <div key={rt.id} style={{ border: '1px solid #f1f1f1', padding: '15px', borderRadius: '6px', background: '#fafafa' }}>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#2980b9' }}>{rt.name}</h5>
                    <p style={{ margin: '5px 0' }}>💵 <strong>Giá:</strong> <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{rt.price.toLocaleString()} VNĐ</span>/đêm</p>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>🛏️ {rt.bedType} | 🖼️ Hướng: {rt.roomView}</p>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>🛁 Bồn tắm: {rt.hasBathtub ? "Có" : "Không"}</p>
                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#7f8c8d' }}>✨ Tiện ích: {rt.amenities}</p>
                    
                    <button style={{ width: '100%', marginTop: '10px', padding: '8px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Đặt phòng nhanh
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {hotels.length === 0 && <p style={{ textAlign: 'center', color: '#95a5a6' }}>Không tìm thấy khách sạn nào phù hợp với bộ lọc.</p>}
        </div>
      )}

      {/* THANH PHÂN TRANG */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '10px' }}>
        <button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}>
          ⬅️ Trang trước
        </button>
        <span style={{ alignSelf: 'center', fontWeight: 'bold' }}>Trang {pagination.currentPage} / {pagination.totalPages}</span>
        <button disabled={filters.page >= pagination.totalPages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}>
          Trang sau ➡️
        </button>
      </div>
    </div>
  );
}