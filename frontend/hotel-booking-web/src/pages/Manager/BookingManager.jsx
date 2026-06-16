import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function BookingManager() {
  const { hotelId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting & Pagination
  const [filters, setFilters] = useState({ status: "", searchName: "" });
  const [sortOptions, setSortOptions] = useState({ sortBy: "date", sortOrder: "desc" });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1 });

  const API_BASE_URL = "http://localhost:5154/api";

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.searchName) params.append("searchName", filters.searchName);
      params.append("sortBy", sortOptions.sortBy);
      params.append("sortOrder", sortOptions.sortOrder);
      params.append("page", pagination.page);
      params.append("pageSize", pagination.pageSize);

      const response = await axios.get(`${API_BASE_URL}/Bookings/hotel/${hotelId}?${params.toString()}`);
      setBookings(response.data.data || []);
      if (response.data.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          page: response.data.pagination.currentPage
        }));
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách đặt phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [hotelId, filters.status, sortOptions, pagination.page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBookings();
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    if (window.confirm(`Bạn có chắc muốn chuyển trạng thái sang "${newStatus}"?`)) {
      try {
        await axios.put(`${API_BASE_URL}/Bookings/${bookingId}`, { status: newStatus });
        fetchBookings();
      } catch (error) {
        alert("Lỗi khi cập nhật trạng thái!");
      }
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Quản lý Đặt phòng (Hotel ID: {hotelId})</h1>
        <Link to="/manager/dashboard" style={{ padding: '8px 15px', background: '#ccc', borderRadius: '5px', textDecoration: 'none', color: '#333' }}>
          ⬅ Quay lại Dashboard
        </Link>
      </div>

      {/* Control Panel */}
      <div style={{ background: '#f5f7fa', padding: '20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label>Tên khách:</label>
          <input 
            type="text" 
            placeholder="Tìm theo tên..." 
            value={filters.searchName}
            onChange={(e) => setFilters({ ...filters, searchName: e.target.value })}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '8px 15px', background: 'var(--neon-blue)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Tìm</button>
        </form>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label>Trạng thái:</label>
          <select 
            value={filters.status} 
            onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPagination({ ...pagination, page: 1 }); }}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="">Tất cả</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Confirmed">Đã xác nhận</option>
            <option value="CheckedIn">Đã nhận phòng</option>
            <option value="CheckedOut">Đã trả phòng</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label>Sắp xếp:</label>
          <select 
            value={`${sortOptions.sortBy}_${sortOptions.sortOrder}`} 
            onChange={(e) => {
              const [by, order] = e.target.value.split('_');
              setSortOptions({ sortBy: by, sortOrder: order });
            }}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="date_desc">Ngày nhận (Mới nhất)</option>
            <option value="date_asc">Ngày nhận (Cũ nhất)</option>
            <option value="price_desc">Giá (Cao nhất)</option>
            <option value="price_asc">Giá (Thấp nhất)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Đang tải dữ liệu...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Mã</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Khách hàng</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Loại phòng</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Ngày nhận - Trả</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Tổng tiền</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Trạng thái</th>
                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>#{b.id}</td>
                  <td style={{ padding: '12px' }}>
                    <strong>{b.guestName}</strong><br/>
                    <small>{b.guestPhone}</small>
                  </td>
                  <td style={{ padding: '12px' }}>{b.roomTypeName} (x{b.roomQuantity})</td>
                  <td style={{ padding: '12px' }}>
                    {new Date(b.checkInDate).toLocaleDateString()} - <br/>
                    {new Date(b.checkOutDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--neon-blue)', fontWeight: 'bold' }}>
                    {b.totalPrice.toLocaleString()}đ
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold',
                      background: b.status === 'Pending' ? '#f39c12' : 
                                  b.status === 'Confirmed' ? '#3498db' : 
                                  b.status === 'CheckedIn' ? '#27ae60' : 
                                  b.status === 'Cancelled' ? '#e74c3c' : '#95a5a6',
                      color: 'white'
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <select 
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      style={{ padding: '5px', borderRadius: '5px' }}
                    >
                      <option value="Pending" disabled>Chờ duyệt</option>
                      <option value="Confirmed">Xác nhận</option>
                      <option value="CheckedIn">Nhận phòng</option>
                      <option value="CheckedOut">Trả phòng</option>
                      <option value="Cancelled">Hủy</option>
                    </select>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
              <button 
                onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                disabled={pagination.page === 1}
                style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', background: pagination.page === 1 ? '#eee' : 'white', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer' }}
              >
                Trang trước
              </button>
              <span style={{ padding: '8px 16px', background: 'var(--neon-blue)', color: 'white', borderRadius: '5px' }}>
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
