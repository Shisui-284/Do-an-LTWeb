import React from "react";

export default function SearchBar({ filters, onInputChange, onSearch }) {
  return (
    <form onSubmit={onSearch} className="search-pill">
      <div className="search-block">
        <label className="search-label">Thành phố</label>
        <input
          type="text"
          name="city"
          className="search-input"
          placeholder="VD: Hà Nội..."
          value={filters.city}
          onChange={onInputChange}
        />
      </div>

      <div className="search-block">
        <label className="search-label">Loại phòng</label>
        <input
          type="text"
          name="roomType"
          className="search-input"
          placeholder="VD: Deluxe..."
          value={filters.roomType}
          onChange={onInputChange}
        />
      </div>

      <div className="search-block">
        <label className="search-label">Giá từ (VNĐ)</label>
        <input
          type="number"
          name="minPrice"
          className="search-input"
          placeholder="Từ..."
          value={filters.minPrice}
          onChange={onInputChange}
        />
      </div>

      <div className="search-block">
        <label className="search-label">Giá đến (VNĐ)</label>
        <input
          type="number"
          name="maxPrice"
          className="search-input"
          placeholder="Đến..."
          value={filters.maxPrice}
          onChange={onInputChange}
        />
      </div>

      <div className="search-block">
        <label className="search-label">Ngày nhận</label>
        <input
          type="date"
          name="checkIn"
          className="search-input"
          value={filters.checkIn}
          onChange={onInputChange}
        />
      </div>

      <div className="search-block">
        <label className="search-label">Ngày trả</label>
        <input
          type="date"
          name="checkOut"
          className="search-input"
          value={filters.checkOut}
          onChange={onInputChange}
        />
      </div>

      <button type="submit" className="btn-search">
        Tìm kiếm
      </button>
    </form>
  );
}
