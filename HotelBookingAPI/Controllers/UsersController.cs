using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Data;
using HotelBookingAPI.Models;

namespace HotelBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult> GetUsers(
            [FromQuery] string? searchEmail,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(searchEmail))
            {
                query = query.Where(u => u.Email.Contains(searchEmail));
            }

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

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

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User userRequest)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng.");
            }

            // Chỉ cho phép cập nhật Role và IsActive từ Admin
            user.Role = userRequest.Role;
            user.IsActive = userRequest.IsActive;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin người dùng thành công." });
        }
    }
}