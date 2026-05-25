import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  // --- 1. STATE TÌM KIẾM & DANH SÁCH ---
  const [filters, setFilters] = useState({
    city: '', minPrice: '', maxPrice: '', roomType: '', checkIn: '', checkOut: '', page: 1, pageSize: 10
  });

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Đổi port 5000 thành port thực tế đang chạy trên máy bạn (ví dụ: 7198, 5066...)
  const API_BASE_URL = 'http://localhost:5154/api'; 

  // --- 2. STATE CHO MODAL ĐẶT PHÒNG ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    guestPhone: '',
    roomQuantity: 1,
    checkInDate: '',
    checkOutDate: ''
  });

  // --- 3. HÀM GỌI API LẤY DỮ LIỆU ---
  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      // Gọi API Search của Backend
      const response = await axios.get(`${API_BASE_URL}/Hotels/search?${params.toString()}`);
      
      // Tùy thuộc vào cách Backend trả về (trực tiếp mảng hay bọc trong object Data)
      setHotels(response.data.data || response.data || []); 
    } catch (error) {
      console.error("Lỗi khi kết nối API:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tự động load dữ liệu lần đầu khi vào trang
  useEffect(() => {
    fetchHotels();
  }, []);

  const handleInputChange = (e) => { setFilters({ ...filters, [e.target.name]: e.target.value }); };
  
  const handleSearch = (e) => { 
    e.preventDefault(); 
    fetchHotels(); 
  };

  // --- 4. CÁC HÀM XỬ LÝ ĐẶT PHÒNG ---
  const openBookingModal = (roomType) => {
    setSelectedRoom(roomType);
    setBookingForm({ ...bookingForm, checkInDate: filters.checkIn, checkOutDate: filters.checkOut });
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
      alert("Vui lòng chọn ngày nhận và trả phòng!");
      return;
    }

    try {
      // Gọi API POST tạo đơn đặt phòng mới
      const bookingData = {
        guestName: bookingForm.guestName,
        guestPhone: bookingForm.guestPhone,
        roomTypeId: selectedRoom.id,
        roomQuantity: Number(bookingForm.roomQuantity),
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        totalPrice: selectedRoom.price * Number(bookingForm.roomQuantity)
      };

      await axios.post(`${API_BASE_URL}/Bookings`, bookingData);
      
      alert("🎉 Đặt phòng thành công! Khách sạn sẽ liên hệ với bạn sớm nhất.");
      closeBookingModal();
      fetchHotels(); // Tải lại danh sách để tự động cập nhật số lượng phòng trống
    } catch (error) {
      alert("Lỗi khi đặt phòng: " + (error.response?.data || "Xin lỗi, đã xảy ra sự cố."));
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', textAlign: 'left', position: 'relative' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Your Home Away From Home</h1>
      
      {/* FORM TÌM KIẾM */}
      <form onSubmit={handleSearch} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div><label style={{ display: 'block', marginBottom: '5px' }}>Thành phố</label><input type="text" name="city" value={filters.city} onChange={handleInputChange} style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
        <div><label style={{ display: 'block', marginBottom: '5px' }}>Loại phòng</label><input type="text" name="roomType" value={filters.roomType} onChange={handleInputChange} style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
        <div><label style={{ display: 'block', marginBottom: '5px' }}>Giá từ (VNĐ)</label><input type="number" name="minPrice" value={filters.minPrice} onChange={handleInputChange} style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
        <div><label style={{ display: 'block', marginBottom: '5px' }}>Giá đến (VNĐ)</label><input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleInputChange} style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
        <div><label style={{ display: 'block', marginBottom: '5px' }}>Ngày nhận</label><input type="date" name="checkIn" value={filters.checkIn} onChange={handleInputChange} style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
        <div><label style={{ display: 'block', marginBottom: '5px' }}>Ngày trả</label><input type="date" name="checkOut" value={filters.checkOut} onChange={handleInputChange} style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#aa3bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Tìm kiếm
          </button>
        </div>
      </form>

      {/* DANH SÁCH KHÁCH SẠN */}
      {loading ? <p style={{ textAlign: 'center' }}>Đang tải dữ liệu từ Backend...</p> : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {hotels.length > 0 ? hotels.map(hotel => (
            <div key={hotel.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
              <h2>🏨 {hotel.name}</h2>
              <p>📍 {hotel.address}, {hotel.city}</p>
              <p>{hotel.description}</p>
              
              {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <h4 style={{ color: '#16a085', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Các loại phòng:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                    {hotel.roomTypes.map(rt => (
                      <div key={rt.id} style={{ border: '1px solid #f1f1f1', padding: '15px', background: '#fafafa', borderRadius: '6px' }}>
                        <h5 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#2980b9' }}>{rt.name}</h5>
                        <p style={{ margin: '5px 0' }}>💵 Giá: <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{rt.price.toLocaleString()} VNĐ</span>/đêm</p>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>🛏️ {rt.bedType} | 🖼️ Hướng: {rt.roomView}</p>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>🛁 Bồn tắm: {rt.hasBathtub ? "Có" : "Không"}</p>
                        
                        <button onClick={() => openBookingModal(rt)} style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                          Đặt phòng nhanh
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )) : (
            <p style={{ textAlign: 'center', color: '#95a5a6' }}>Chưa có dữ liệu. Vui lòng kiểm tra lại kết nối Database hoặc thêm dữ liệu mới!</p>
          )}
        </div>
      )}

      {/* --- MODAL (POPUP) ĐẶT PHÒNG NHANH --- */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', width: '400px', maxWidth: '90%', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Đặt {selectedRoom?.name}</h2>
            <p style={{ color: '#e74c3c', fontWeight: 'bold', marginBottom: '20px' }}>Giá: {selectedRoom?.price.toLocaleString()} VNĐ/đêm</p>
            
            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div><label>Họ và Tên:</label><input required type="text" value={bookingForm.guestName} onChange={e => setBookingForm({...bookingForm, guestName: e.target.value})} style={{ width: '95%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} /></div>
              <div><label>Số điện thoại:</label><input required type="tel" value={bookingForm.guestPhone} onChange={e => setBookingForm({...bookingForm, guestPhone: e.target.value})} style={{ width: '95%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} /></div>
              <div><label>Số lượng phòng:</label><input required type="number" min="1" value={bookingForm.roomQuantity} onChange={e => setBookingForm({...bookingForm, roomQuantity: e.target.value})} style={{ width: '95%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} /></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}><label>Ngày nhận:</label><input required type="date" value={bookingForm.checkInDate} onChange={e => setBookingForm({...bookingForm, checkInDate: e.target.value})} style={{ width: '90%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} /></div>
                <div style={{ flex: 1 }}><label>Ngày trả:</label><input required type="date" value={bookingForm.checkOutDate} onChange={e => setBookingForm({...bookingForm, checkOutDate: e.target.value})} style={{ width: '90%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} /></div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="button" onClick={closeBookingModal} style={{ flex: 1, padding: '10px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Hủy</button>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Xác nhận đặt</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}