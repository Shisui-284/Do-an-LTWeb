````markdown
# 🏨 Hotel Booking Website

Hệ thống đặt phòng khách sạn trực tuyến được xây dựng theo mô hình **Frontend - Backend - Database**, cho phép khách hàng tìm kiếm và đặt phòng, Hotel Manager quản lý khách sạn của mình và Admin quản lý toàn bộ hệ thống.

---

# Công nghệ sử dụng

## Frontend

- React 19
- Vite
- React Router DOM
- Axios
- SweetAlert2

## Backend

- ASP.NET Core Web API (.NET)
- Entity Framework Core
- JWT Authentication
- BCrypt Password Hashing
- Swagger

## Database

- Microsoft SQL Server

---

# Cấu trúc dự án

```text
HotelBooking/
│
├── frontend/
│   └── hotel-booking-web/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── ...
│
├── HotelBookingAPI/
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── Migrations/
│   ├── Services/
│   ├── Properties/
│   ├── appsettings.json
│   ├── DB.sql
│   └── HotelBookingAPI.csproj
│
└── README.md
```

---

# Use Case

## 2.1. Use Case của Tourist/User

### Actor

- Tourist/User

### Các chức năng

- Đăng ký
- Đăng nhập
- Tìm kiếm khách sạn
- Xem chi tiết khách sạn
- Đặt phòng
- Xem hồ sơ cá nhân
- Xem lịch sử đặt phòng

### Mô tả

Khách hàng là đối tượng sử dụng chính của hệ thống. Sau khi đăng nhập thành công, khách hàng có thể tìm kiếm khách sạn phù hợp với nhu cầu, xem thông tin chi tiết, đặt phòng trực tuyến và theo dõi lịch sử các đơn đặt phòng của mình.

---

## 2.2. Use Case của Hotel Manager

### Actor

- Hotel Manager

### Các chức năng

- Quản lý khách sạn
- Quản lý loại phòng
- Quản lý phòng
- Xem đơn đặt phòng
- Cập nhật trạng thái đơn đặt phòng

### Mô tả

Hotel Manager chịu trách nhiệm quản lý hoạt động của khách sạn trên hệ thống. Manager có thể cập nhật thông tin khách sạn, quản lý các loại phòng, phòng khách sạn, theo dõi danh sách đặt phòng và xử lý các yêu cầu đặt phòng của khách hàng.

---

## 2.3. Use Case của Admin

### Actor

- Admin

### Các chức năng

- Quản lý người dùng
- Quản lý khách sạn
- Quản lý Hotel Manager
- Theo dõi hệ thống

### Mô tả

Admin là người có quyền cao nhất trong hệ thống, chịu trách nhiệm quản lý dữ liệu, quản lý người dùng, quản lý Hotel Manager, giám sát hoạt động của toàn bộ hệ thống và đảm bảo hệ thống vận hành ổn định.

---

# Cài đặt dự án

## 1. Clone Repository

```bash
git clone <repository-url>
cd HotelBooking
```

---

## 2. Cài đặt Database

Tạo cơ sở dữ liệu SQL Server và thực thi file:

```text
HotelBookingAPI/DB.sql
```

Sau đó chỉnh sửa chuỗi kết nối trong:

```text
HotelBookingAPI/appsettings.json
```

Ví dụ:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=HotelBookingDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

---

## 3. Chạy Backend

```bash
cd HotelBookingAPI
dotnet restore
dotnet run
```

Swagger:

```text
https://localhost:<port>/swagger
```

---

## 4. Chạy Frontend

```bash
cd frontend/hotel-booking-web
npm install
npm run dev
```

Website:

```text
http://localhost:5173
```

---

# Kiến trúc hệ thống

- Frontend: React + Vite
- Backend: ASP.NET Core Web API
- Database: SQL Server
- Xác thực người dùng bằng JWT
- Giao tiếp giữa Frontend và Backend thông qua RESTful API

---
````
