export default function HotelCard({ hotel, onOpenModal }) {
  return (
    <div className="hotel-card">
      <h2 className="hotel-name">🏨 {hotel.name}</h2>
      <p className="hotel-description">{hotel.description}</p>
      <div className="room-grid">
        {hotel.roomTypes?.map((rt) => (
          <div key={rt.id} className="room-card">
            <h5 className="room-title">{rt.name}</h5>
            <p className="room-price">💵 {rt.price.toLocaleString()} VNĐ</p>
            <button
              onClick={() => onOpenModal(rt)}
              className="btn-book"
            >
              Đặt phòng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
