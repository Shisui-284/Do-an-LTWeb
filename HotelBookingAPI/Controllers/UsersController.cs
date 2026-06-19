using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Data;
using HotelBookingAPI.Models;

namespace HotelBookingAPI.Controllers
{
    public class UpdateUserDTO
    {
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public string? Password { get; set; } 
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetUsers(
            [FromQuery] string? searchEmail,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Users.AsQueryable();

            // Tìm kiếm theo Email
            if (!string.IsNullOrEmpty(searchEmail))
            {
                query = query.Where(u => u.Email.Contains(searchEmail));
            }

            // Tính toán phân trang
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // Lấy danh sách người dùng cho trang hiện tại
            var users = await query
                .OrderBy(u => u.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Phone,
                    u.Role,
                    u.IsActive
                })
                .ToListAsync();

            // Trả về dữ liệu chuẩn để React dễ đọc
            return Ok(new 
            { 
                Data = users, 
                Pagination = new 
                { 
                    TotalItems = totalItems, 
                    TotalPages = totalPages, 
                    CurrentPage = page, 
                    PageSize = pageSize 
                } 
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDTO userRequest)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound("Không tìm thấy người dùng.");

            // Cập nhật thông tin
            user.Role = userRequest.Role;
            user.IsActive = userRequest.IsActive;
            user.FullName = userRequest.FullName;
            user.Phone = userRequest.Phone;

            // Nếu người dùng gửi mật khẩu mới, hash và lưu lại
            if (!string.IsNullOrWhiteSpace(userRequest.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userRequest.Password);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thông tin người dùng thành công." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound("Không tìm thấy người dùng để xóa.");

            // Kiểm tra ràng buộc dữ liệu
            var managesHotel = await _context.Hotels.AnyAsync(h => h.ManagerId == id);
            if (managesHotel) 
                return BadRequest(new { message = "Không thể xóa tài khoản này vì đang quản lý một khách sạn." });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa tài khoản người dùng thành công." });
        }
    }
}