import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function RoomManager() {
  const { hotelId } = useParams();
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [isEditingType, setIsEditingType] = useState(false);
  const [typeForm, setTypeForm] = useState({
    id: null, name: "", price: "", bedType: "", roomView: "", hasBathtub: false, amenities: "", imageUrl: "", hotelId: Number(hotelId)
  });

  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [roomForm, setRoomForm] = useState({
    id: null, roomNumber: "", isMaintenance: false, isAvailable: true, roomTypeId: null
  });

  const API_BASE_URL = "http://localhost:5154/api";

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/RoomTypes/hotel/${hotelId}`);
      setRoomTypes(response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải loại phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, [hotelId]);

  const handleSelectRoomType = async (rt) => {
    setSelectedRoomType(rt);
    try {
      const response = await axios.get(`${API_BASE_URL}/Rooms/roomtype/${rt.id}`);
      setRooms(response.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách phòng:", error);
    }
  };

  // --- ROOM TYPE ACTIONS ---
  const saveRoomType = async (e) => {
    e.preventDefault();
    try {
      if (isEditingType) {
        await axios.put(`${API_BASE_URL}/RoomTypes/${typeForm.id}`, typeForm);
        alert("Cập nhật Loại phòng thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/RoomTypes`, typeForm);
        alert("Thêm Loại phòng thành công!");
      }
      setTypeForm({ id: null, name: "", price: "", bedType: "", roomView: "", hasBathtub: false, amenities: "", imageUrl: "", hotelId: Number(hotelId) });
      setIsEditingType(false);
      fetchRoomTypes();
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu Loại phòng!");
    }
  };

  const deleteRoomType = async (id) => {
    if (window.confirm("Xóa loại phòng này sẽ ảnh hưởng tới các phòng và đơn đặt. Bạn có chắc chắn?")) {
      try {
        await axios.delete(`${API_BASE_URL}/RoomTypes/${id}`);
        fetchRoomTypes();
        if (selectedRoomType?.id === id) setSelectedRoomType(null);
      } catch (error) {
        alert("Lỗi khi xóa loại phòng!");
      }
    }
  };

  // --- ROOM ACTIONS ---
  const saveRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...roomForm, roomTypeId: selectedRoomType.id };
      if (isEditingRoom) {
        await axios.put(`${API_BASE_URL}/Rooms/${roomForm.id}`, payload);
        alert("Cập nhật phòng thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/Rooms`, payload);
        alert("Thêm phòng thành công!");
      }
      setRoomForm({ id: null, roomNumber: "", isMaintenance: false, isAvailable: true, roomTypeId: null });
      setIsEditingRoom(false);
      handleSelectRoomType(selectedRoomType); // reload rooms
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu phòng!");
    }
  };

  const deleteRoom = async (id) => {
    if (window.confirm("Xóa phòng này?")) {
      try {
        await axios.delete(`${API_BASE_URL}/Rooms/${id}`);
        handleSelectRoomType(selectedRoomType);
      } catch (error) {
        alert("Lỗi khi xóa phòng!");
      }
    }
  };

  const toggleRoomStatus = async (room) => {
    try {
      await axios.put(`${API_BASE_URL}/Rooms/${room.id}/status`, !room.isAvailable, {
        headers: { 'Content-Type': 'application/json' }
      });
      handleSelectRoomType(selectedRoomType);
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái phòng!");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}>Đang tải...</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Quản lý Loại phòng & Phòng (Hotel ID: {hotelId})</h1>
        <Link to="/manager/dashboard" style={{ padding: '8px 15px', background: '#ccc', borderRadius: '5px', textDecoration: 'none', color: '#333' }}>
          ⬅ Quay lại Dashboard
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* CỘT TRÁI: DANH SÁCH LOẠI PHÒNG */}
        <div style={{ flex: '1', minWidth: '350px' }}>
          <h2>1. Loại phòng (Room Types)</h2>
          
          <div style={{ background: '#f5f7fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <h3>{isEditingType ? "Sửa loại phòng" : "Thêm loại phòng mới"}</h3>
            <form onSubmit={saveRoomType} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input required type="text" placeholder="Tên loại (VD: Deluxe)" value={typeForm.name} onChange={e => setTypeForm({...typeForm, name: e.target.value})} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input required type="number" placeholder="Giá (VNĐ)" value={typeForm.price} onChange={e => setTypeForm({...typeForm, price: e.target.value})} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Loại giường (VD: 1 giường đôi)" value={typeForm.bedType} onChange={e => setTypeForm({...typeForm, bedType: e.target.value})} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Hướng nhìn" value={typeForm.roomView} onChange={e => setTypeForm({...typeForm, roomView: e.target.value})} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <label><input type="checkbox" checked={typeForm.hasBathtub} onChange={e => setTypeForm({...typeForm, hasBathtub: e.target.checked})} /> Có bồn tắm</label>
              <textarea placeholder="Tiện ích (phẩy cách)" value={typeForm.amenities} onChange={e => setTypeForm({...typeForm, amenities: e.target.value})} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="URL Hình ảnh" value={typeForm.imageUrl} onChange={e => setTypeForm({...typeForm, imageUrl: e.target.value})} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '8px', background: 'var(--neon-blue)', color: 'white', border: 'none', borderRadius: '5px', flex: 1, cursor: 'pointer' }}>{isEditingType ? "Lưu" : "Thêm"}</button>
                {isEditingType && <button type="button" onClick={() => { setIsEditingType(false); setTypeForm({ id: null, name: "", price: "", bedType: "", roomView: "", hasBathtub: false, amenities: "", imageUrl: "", hotelId: Number(hotelId) }); }} style={{ padding: '8px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Hủy</button>}
              </div>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {roomTypes.map(rt => (
              <div key={rt.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px', boxShadow: selectedRoomType?.id === rt.id ? '0 0 10px rgba(52, 152, 219, 0.5)' : 'none', borderLeft: selectedRoomType?.id === rt.id ? '4px solid var(--neon-blue)' : '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{rt.name}</h3>
                  <strong style={{ color: 'var(--neon-blue)' }}>{rt.price.toLocaleString()}đ</strong>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => handleSelectRoomType(rt)} style={{ padding: '5px 10px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1 }}>Phòng</button>
                  <button onClick={() => { setIsEditingType(true); setTypeForm(rt); }} style={{ padding: '5px 10px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Sửa</button>
                  <button onClick={() => deleteRoomType(rt.id)} style={{ padding: '5px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH PHÒNG THEO LOẠI */}
        {selectedRoomType && (
          <div style={{ flex: '2', minWidth: '400px' }}>
            <h2>2. Quản lý phòng: {selectedRoomType.name}</h2>

            <div style={{ background: '#f5f7fa', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
              <form onSubmit={saveRoom} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input required type="text" placeholder="Số phòng (VD: 101)" value={roomForm.roomNumber} onChange={e => setRoomForm({...roomForm, roomNumber: e.target.value})} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }} />
                <label><input type="checkbox" checked={roomForm.isMaintenance} onChange={e => setRoomForm({...roomForm, isMaintenance: e.target.checked})} /> Bảo trì</label>
                <button type="submit" style={{ padding: '8px 15px', background: 'var(--neon-blue)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{isEditingRoom ? "Lưu" : "Thêm"}</button>
                {isEditingRoom && <button type="button" onClick={() => { setIsEditingRoom(false); setRoomForm({ id: null, roomNumber: "", isMaintenance: false, isAvailable: true, roomTypeId: null }); }} style={{ padding: '8px 15px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Hủy</button>}
              </form>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <thead>
                <tr style={{ background: '#eee' }}>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Số phòng</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Trạng thái Bận/Trống</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Bảo trì</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length > 0 ? rooms.map(room => (
                  <tr key={room.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{room.roomNumber}</td>
                    <td style={{ padding: '10px' }}>
                      <button 
                        onClick={() => toggleRoomStatus(room)}
                        style={{ 
                          padding: '5px 10px', borderRadius: '15px', border: 'none', color: 'white', cursor: 'pointer',
                          background: room.isAvailable ? '#27ae60' : '#e74c3c'
                        }}
                      >
                        {room.isAvailable ? '✔ Trống' : '❌ Có khách'}
                      </button>
                    </td>
                    <td style={{ padding: '10px' }}>
                      {room.isMaintenance ? <span style={{ color: '#f39c12', fontWeight: 'bold' }}>Đang bảo trì</span> : 'Hoạt động'}
                    </td>
                    <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                      <button onClick={() => { setIsEditingRoom(true); setRoomForm(room); }} style={{ padding: '5px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Sửa</button>
                      <button onClick={() => deleteRoom(room.id)} style={{ padding: '5px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Xóa</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Chưa có phòng nào thuộc loại này.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
