using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelBookingAPI.Models
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }

        public int? UserId { get; set; }

        // --- Thông tin Đặt phòng nhanh (Không bắt buộc phải có tài khoản User) ---
        [Required, StringLength(100)]
        public string GuestName { get; set; } 

        [Required, Phone]
        public string GuestPhone { get; set; }

        // --- Thông tin Phòng đặt ---
        public int RoomTypeId { get; set; }
        [ForeignKey("RoomTypeId")]
        public RoomType? RoomType { get; set; }

        [Required]
        public int RoomQuantity { get; set; } // Số lượng phòng

        [Required]
        public DateTime CheckInDate { get; set; } // Ngày nhận phòng

        [Required]
        public DateTime CheckOutDate { get; set; } // Ngày trả phòng

        public decimal TotalPrice { get; set; } // Tổng tiền

        // --- Trạng thái theo yêu cầu (b) ---
        [Required]
        public string Status { get; set; } = "Pending"; 
        // Các trạng thái: "Pending" (Chờ duyệt), "Confirmed" (Đã xác nhận), "CheckedIn" (Đã nhận phòng), "Cancelled" (Khách hủy)
    }
}