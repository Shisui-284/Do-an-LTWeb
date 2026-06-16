import React from "react";

export default function BookingModal({
  selectedRoom,
  bookingForm,
  setBookingForm,
  onSubmit,
  onClose,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          Đặt {selectedRoom?.name}
        </h2>
        <p className="modal-price">
          Giá: {selectedRoom?.price.toLocaleString()} VNĐ/đêm
        </p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Họ và Tên:</label>
            <input
              required
              type="text"
              className="form-input"
              value={bookingForm?.guestName || ""}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, guestName: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Số điện thoại:</label>
            <input
              required
              type="tel"
              className="form-input"
              value={bookingForm?.guestPhone || ""}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, guestPhone: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Số lượng phòng:</label>
            <input
              required
              type="number"
              min="1"
              className="form-input"
              value={bookingForm?.roomQuantity || 1}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, roomQuantity: e.target.value })
              }
            />
          </div>
          <div className="form-row">
            <div className="form-col">
              <label className="form-label">Ngày nhận:</label>
              <input
                required
                type="date"
                className="form-input"
                value={bookingForm?.checkInDate || ""}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    checkInDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-col">
              <label className="form-label">Ngày trả:</label>
              <input
                required
                type="date"
                className="form-input"
                value={bookingForm?.checkOutDate || ""}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    checkOutDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-confirm"
            >
              Xác nhận đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
