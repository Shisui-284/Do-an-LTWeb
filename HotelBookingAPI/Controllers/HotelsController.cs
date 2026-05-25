using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Data;
using HotelBookingAPI.Models;

namespace HotelBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HotelsController(AppDbContext context)
        {
            _context = context;
        }

        // API 1: Lấy toàn bộ danh sách khách sạn (Giữ nguyên của bạn của bạn)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hotel>>> GetHotels()
        {
            return await _context.Hotels.ToListAsync();
        }

        // API 2: Tìm kiếm nâng cao dành cho Khách du lịch (Bộ lọc, Ngày trống, Phân trang, Sắp xếp)
        [HttpGet("search")]
        public async Task<IActionResult> SearchHotels(
            [FromQuery] string? city,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? roomType,
            [FromQuery] DateTime? checkIn,
            [FromQuery] DateTime? checkOut,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6,
            [FromQuery] string sortBy = "name",
            [FromQuery] string sortOrder = "asc")
        {
            // Tải trước dữ liệu liên quan (Hotels -> RoomTypes -> Rooms & Bookings) để tính toán
            var query = _context.Hotels
                .Include(h => h.RoomTypes!)
                    .ThenInclude(rt => rt.Rooms)
                .Include(h => h.RoomTypes!)
                    .ThenInclude(rt => rt.Bookings)
                .AsQueryable();

            // 1. LỌC THEO THÀNH PHỐ
            if (!string.IsNullOrEmpty(city))
            {
                query = query.Where(h => h.City.Contains(city));
            }

            // 2. LỌC NÂNG CAO THEO ĐIỀU KIỆN CỦA LOẠI PHÒNG VÀ NGÀY TRỐNG
            if (minPrice.HasValue || maxPrice.HasValue || !string.IsNullOrEmpty(roomType) || (checkIn.HasValue && checkOut.HasValue))
            {
                query = query.Where(h => h.RoomTypes!.Any(rt =>
                    (!minPrice.HasValue || rt.Price >= minPrice.Value) &&
                    (!maxPrice.HasValue || rt.Price <= maxPrice.Value) &&
                    (string.IsNullOrEmpty(roomType) || rt.Name.Contains(roomType)) &&
                    // Thuật toán kiểm tra ngày trống: Tổng số phòng hiện có trừ đi số phòng đã bị đặt trong khoảng thời gian đó phải > 0
                    (!checkIn.HasValue || !checkOut.HasValue ||
                        (rt.Rooms!.Count(r => !r.IsMaintenance) - 
                         rt.Bookings!.Where(b => b.Status != "Cancelled" && b.CheckInDate < checkOut.Value && b.CheckOutDate > checkIn.Value)
                                     .Sum(b => b.RoomQuantity) > 0)
                    )
                ));
            }

            // 3. SẮP XẾP (SORTING)
            if (sortBy.ToLower() == "name")
            {
                query = sortOrder.ToLower() == "desc" ? query.OrderByDescending(h => h.Name) : query.OrderBy(h => h.Name);
            }
            else if (sortBy.ToLower() == "city")
            {
                query = sortOrder.ToLower() == "desc" ? query.OrderByDescending(h => h.City) : query.OrderBy(h => h.City);
            }

            // 4. PHÂN TRANG (PAGINATION)
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var hotels = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(h => new {
                    h.Id,
                    h.Name,
                    h.City,
                    h.Address,
                    h.Description,
                    // Chỉ trả về các loại phòng thỏa mãn bộ lọc để hiển thị đúng giá lẻ
                    RoomTypes = h.RoomTypes!.Select(rt => new {
                        rt.Id,
                        rt.Name,
                        rt.Price,
                        rt.BedType,
                        rt.RoomView,
                        rt.HasBathtub,
                        rt.Amenities,
                        rt.ImageUrl
                    })
                })
                .ToListAsync();

            return Ok(new {
                Data = hotels,
                Pagination = new {
                    TotalItems = totalItems,
                    TotalPages = totalPages,
                    CurrentPage = page,
                    PageSize = pageSize
                }
            });
        }

        // API 3: Thêm một khách sạn mới (Giữ nguyên)
        [HttpPost]
        public async Task<ActionResult<Hotel>> PostHotel(Hotel hotel)
        {
            _context.Hotels.Add(hotel);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetHotels", new { id = hotel.Id }, hotel);
        }
    }
}