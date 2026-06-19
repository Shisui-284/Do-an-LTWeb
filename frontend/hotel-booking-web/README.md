# 🏨 Website Đặt Phòng Khách Sạn

Đồ án môn **Lập trình Web** với đề tài **Xây dựng Website Đặt Phòng Khách Sạn**. Hệ thống được phát triển nhằm hỗ trợ người dùng tìm kiếm khách sạn, đặt phòng trực tuyến và quản lý hoạt động đặt phòng thông qua các vai trò khác nhau.

---

## 📖 Giới thiệu

Website được xây dựng theo mô hình Client – Server với:

- Frontend: ReactJS
- Backend: ASP.NET Core Web API
- Cơ sở dữ liệu: SQL Server
- Xác thực người dùng bằng JWT Authentication

Hệ thống hỗ trợ ba vai trò:

- User (Khách hàng)
- Hotel Manager (Quản lý khách sạn)
- Admin (Quản trị viên)

---

## 🚀 Chức năng chính

### 👤 User (Khách hàng)

- Đăng ký tài khoản
- Đăng nhập hệ thống
- Tìm kiếm khách sạn
- Xem thông tin chi tiết khách sạn
- Đặt phòng trực tuyến
- Xem hồ sơ cá nhân
- Xem lịch sử đặt phòng

### 🏨 Hotel Manager

- Quản lý khách sạn
- Quản lý loại phòng
- Quản lý phòng
- Xem danh sách đặt phòng
- Cập nhật trạng thái đơn đặt phòng

### ⚙️ Admin

- Quản lý người dùng
- Quản lý khách sạn
- Quản lý tài khoản Hotel Manager
- Theo dõi hoạt động hệ thống

---

## 🛠 Công nghệ sử dụng

### Frontend

- ReactJS
- React Router
- Axios
- Bootstrap

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- JWT Authentication

### Database

- Microsoft SQL Server

---

## 🏗 Kiến trúc hệ thống

```text
ReactJS Frontend
        ↓
ASP.NET Core Web API
        ↓
SQL Server Database
```

---

## 🗄 Cơ sở dữ liệu

Hệ thống gồm các bảng chính:

- Users
- Hotels
- RoomTypes
- Rooms
- Bookings

Mối quan hệ:

- Users (1) → (N) Bookings
- Hotels (1) → (N) RoomTypes
- RoomTypes (1) → (N) Rooms
- RoomTypes (1) → (N) Bookings
- Users (Manager) (1) → (N) Hotels

---

## 📂 Cấu trúc dự án

```text
Backend
│
├── Controllers
├── Models
├── Data
├── Services
└── Program.cs

Frontend
│
├── pages
├── components
├── services
├── assets
└── App.js
```

---

## ⚙️ Cài đặt dự án

### Backend

```bash
cd Backend
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd Frontend
npm install
npm start
```

---

## 🔐 Xác thực và phân quyền

Hệ thống sử dụng JWT Authentication:

- Đăng nhập thành công tạo JWT Token.
- Token được lưu trên trình duyệt.
- Token được gửi kèm các API cần xác thực.
- Phân quyền theo User, Hotel Manager và Admin.

---

## 🎯 Kết quả đạt được

- Xây dựng thành công hệ thống đặt phòng khách sạn trực tuyến.
- Áp dụng mô hình RESTful API.
- Xây dựng giao diện thân thiện với người dùng.
- Thực hiện phân quyền người dùng theo vai trò.
- Kết nối và quản lý dữ liệu bằng SQL Server.

---

## 🔮 Hướng phát triển

- Thanh toán trực tuyến (VNPay, MoMo).
- Gửi email xác nhận đặt phòng.
- Đánh giá và nhận xét khách sạn.
- Tích hợp bản đồ.
- Phát triển ứng dụng di động.
- Triển khai trên nền tảng Cloud.
