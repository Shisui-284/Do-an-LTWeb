USE [master]
GO

-- 1. Kiểm tra và xóa Database nếu đã tồn tại để tránh lỗi
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'HotelBookingDB')
BEGIN
	ALTER DATABASE [HotelBookingDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
	DROP DATABASE [HotelBookingDB];
END
GO

-- 2. Tạo Database (Sử dụng đường dẫn mặc định của SQL Server)
CREATE DATABASE [HotelBookingDB]
GO

USE [HotelBookingDB]
GO

-- =============================================
-- 3. TẠO BẢNG (CREATE TABLES)
-- =============================================

CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED ([MigrationId] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Hotels](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[City] [nvarchar](100) NOT NULL,
	[Address] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[ManagerId] [int] NULL,
 CONSTRAINT [PK_Hotels] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](max) NOT NULL,
	[PasswordHash] [nvarchar](max) NOT NULL,
	[Phone] [nvarchar](max) NOT NULL,
	[Role] [nvarchar](max) NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[RoomTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[HotelId] [int] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
	[BedType] [nvarchar](max) NOT NULL,
	[RoomView] [nvarchar](max) NOT NULL,
	[HasBathtub] [bit] NOT NULL,
	[Amenities] [nvarchar](max) NOT NULL,
	[ImageUrl] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_RoomTypes] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[Rooms](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoomTypeId] [int] NOT NULL,
	[RoomNumber] [nvarchar](50) NOT NULL,
	[IsMaintenance] [bit] NOT NULL,
	[IsAvailable] [bit] NOT NULL DEFAULT (0),
 CONSTRAINT [PK_Rooms] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Bookings](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GuestName] [nvarchar](100) NOT NULL,
	[GuestPhone] [nvarchar](max) NOT NULL,
	[RoomTypeId] [int] NOT NULL,
	[RoomQuantity] [int] NOT NULL,
	[CheckInDate] [datetime2](7) NOT NULL,
	[CheckOutDate] [datetime2](7) NOT NULL,
	[TotalPrice] [decimal](18, 2) NOT NULL,
	[Status] [nvarchar](max) NOT NULL,
	[UserId] [int] NULL,
 CONSTRAINT [PK_Bookings] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- =============================================
-- 4. CHÈN DỮ LIỆU (INSERT DATA)
-- =============================================

GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260525020947_InitialCreate', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260525045736_AddIsAvailableToRoom', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260525054812_UpdateHotelModel', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260615215909_AddJWTAuth', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260615221615_AddUserIdToBooking', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260616101431_AddManagerIdToHotel', N'10.0.8')
GO
SET IDENTITY_INSERT [dbo].[Bookings] ON 

INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (7, N'huu', N'03333333', 17, 1, CAST(N'2026-06-23T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-26T00:00:00.0000000' AS DateTime2), CAST(5700000.00 AS Decimal(18, 2)), N'CheckedIn', 1)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (8, N'nguyen', N'123', 14, 2, CAST(N'2026-06-19T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-25T00:00:00.0000000' AS DateTime2), CAST(33600000.00 AS Decimal(18, 2)), N'Confirmed', 9)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (9, N's', N'123', 21, 1, CAST(N'2026-06-20T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-22T00:00:00.0000000' AS DateTime2), CAST(7600000.00 AS Decimal(18, 2)), N'Cancelled', NULL)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (10, N'b', N'2', 15, 1, CAST(N'2026-06-24T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-30T00:00:00.0000000' AS DateTime2), CAST(19200000.00 AS Decimal(18, 2)), N'Cancelled', 3)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (11, N'nam', N'5365474', 20, 1, CAST(N'2026-06-09T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-12T00:00:00.0000000' AS DateTime2), CAST(7500000.00 AS Decimal(18, 2)), N'CheckedIn', 3)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (12, N'khachhang02', N'0123456789', 17, 1, CAST(N'2026-06-02T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-04T00:00:00.0000000' AS DateTime2), CAST(3800000.00 AS Decimal(18, 2)), N'Confirmed', 15)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (13, N'khachhang02', N'0123456789', 23, 2, CAST(N'2026-06-25T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-27T00:00:00.0000000' AS DateTime2), CAST(2200000.00 AS Decimal(18, 2)), N'CheckedIn', 15)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (14, N'khachhang02', N'0123456789', 34, 1, CAST(N'2026-06-18T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-22T00:00:00.0000000' AS DateTime2), CAST(3400000.00 AS Decimal(18, 2)), N'Cancelled', 15)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (15, N'khachhang01', N'0123456789', 19, 1, CAST(N'2026-06-26T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-27T00:00:00.0000000' AS DateTime2), CAST(4200000.00 AS Decimal(18, 2)), N'Cancelled', 14)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (16, N'khachhang03', N'0312456789', 36, 1, CAST(N'2026-06-17T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-21T00:00:00.0000000' AS DateTime2), CAST(2600000.00 AS Decimal(18, 2)), N'Pending', 16)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (17, N'khachhang03', N'0312456789', 39, 1, CAST(N'2026-06-26T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-27T00:00:00.0000000' AS DateTime2), CAST(1500000.00 AS Decimal(18, 2)), N'Cancelled', 16)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (18, N'khachhang04', N'0412356789', 38, 2, CAST(N'2026-06-12T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-13T00:00:00.0000000' AS DateTime2), CAST(1200000.00 AS Decimal(18, 2)), N'Pending', 17)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (19, N'khachhang04', N'0412356789', 21, 1, CAST(N'2026-06-26T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-27T00:00:00.0000000' AS DateTime2), CAST(3800000.00 AS Decimal(18, 2)), N'Cancelled', 17)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (20, N'khachhang05', N'0512346789', 27, 1, CAST(N'2026-06-17T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-20T00:00:00.0000000' AS DateTime2), CAST(2700000.00 AS Decimal(18, 2)), N'Confirmed', 18)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (21, N'khachhang05', N'0512346789', 30, 1, CAST(N'2026-07-01T00:00:00.0000000' AS DateTime2), CAST(N'2026-07-02T00:00:00.0000000' AS DateTime2), CAST(500000.00 AS Decimal(18, 2)), N'Pending', 18)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (22, N'khachhang06', N'0612345789', 12, 1, CAST(N'2026-06-17T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-18T00:00:00.0000000' AS DateTime2), CAST(4500000.00 AS Decimal(18, 2)), N'Confirmed', 19)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (23, N'khachhang06', N'0612345789', 40, 2, CAST(N'2026-06-23T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-25T00:00:00.0000000' AS DateTime2), CAST(4000000.00 AS Decimal(18, 2)), N'Pending', 19)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (24, N'khachhang07', N'0712345689', 15, 1, CAST(N'2026-06-02T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-04T00:00:00.0000000' AS DateTime2), CAST(6400000.00 AS Decimal(18, 2)), N'Pending', 20)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (25, N'khachhang07', N'0712345689', 26, 2, CAST(N'2026-06-17T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-20T00:00:00.0000000' AS DateTime2), CAST(3000000.00 AS Decimal(18, 2)), N'Pending', 20)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (26, N'khachhang08', N'0812345679', 22, 1, CAST(N'2026-06-25T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-27T00:00:00.0000000' AS DateTime2), CAST(6200000.00 AS Decimal(18, 2)), N'Pending', 21)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (27, N'khachhang08', N'0812345679', 40, 1, CAST(N'2026-06-04T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-05T00:00:00.0000000' AS DateTime2), CAST(1000000.00 AS Decimal(18, 2)), N'Pending', 21)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (28, N'khachhang08', N'0812345679', 24, 1, CAST(N'2026-07-01T00:00:00.0000000' AS DateTime2), CAST(N'2026-07-02T00:00:00.0000000' AS DateTime2), CAST(850000.00 AS Decimal(18, 2)), N'Pending', 21)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (29, N'khachhang09', N'0912345678', 28, 1, CAST(N'2026-06-18T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-20T00:00:00.0000000' AS DateTime2), CAST(1200000.00 AS Decimal(18, 2)), N'Confirmed', 22)
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (30, N'khachhang09', N'0912345678', 34, 1, CAST(N'2026-06-25T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-27T00:00:00.0000000' AS DateTime2), CAST(1700000.00 AS Decimal(18, 2)), N'Pending', 22)
SET IDENTITY_INSERT [dbo].[Bookings] OFF
GO
SET IDENTITY_INSERT [dbo].[Hotels] ON 

INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (11, N'Sofitel Legend Metropole Hà Nội', N'Hà Nội', N'15 Ngô Quyền, Quận Hoàn Kiếm', N'Khách sạn mang đậm kiến trúc Pháp cổ kính, nổi bật với sự sang trọng và bề dày lịch sử hơn một thế kỷ ngay giữa lòng thủ đô.', 12)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (12, N'Sapa Jade Hill Resort & Spa', N'Lào Cai', N'Thôn Lý, Xã Lao Chải, Thị xã Sa Pa', N'Khu nghỉ dưỡng sinh thái độc đáo với các biệt thự mái cọ ẩn mình giữa thung lũng sương mù và ruộng bậc thang hùng vĩ.', 11)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (13, N'Vinpearl Resort & Spa Đà Nẵng', N'Đà Nẵng', N'23 Trường Sa, Phường Hải Hòa, Quận Ngũ Hành Sơn', N'Khu nghỉ dưỡng 5 sao ven biển với kiến trúc tân cổ điển, sở hữu hệ thống hồ bơi vô cực tuyệt đẹp và bãi biển riêng tư.', 11)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (14, N'Little Riverside Hoi An', N'Quảng Nam', N'09 Phan Bội Châu, Phường Cẩm Châu, TP. Hội An', N'Khách sạn mang phong cách boutique hoài cổ, nằm hiền hòa bên bờ sông Thu Bồn thơ mộng, chỉ cách phố cổ vài bước chân.', 13)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (15, N'Ana Mandara Villas Dalat', N'Lâm Đồng', N'Đường Lê Lai, Phường 5, TP. Đà Lạt', N'Quần thể biệt thự cổ kiểu Pháp được phục dựng nguyên bản, nằm lọt thỏm giữa những đồi thông xanh mát và yên tĩnh.', 10)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (16, N'Havana Nha Trang Hotel', N'Khánh Hòa', N'38 Trần Phú, Phường Lộc Thọ, TP. Nha Trang', N'Khách sạn cao tầng hiện đại bậc nhất mặt đường Trần Phú, với đường hầm xuyên biển độc đáo và tầm nhìn toàn cảnh vịnh Nha Trang.', 12)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (17, N'Caravelle Saigon Hotel', N'Hồ Chí Minh', N'19-23 Công trường Lam Sơn, Quận 1', N'Biểu tượng lưu trú sang trọng tọa lạc ngay "trái tim" Sài Gòn, liền kề Nhà hát Thành phố và các khu mua sắm sầm uất.', 11)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (18, N'Sunset Sanato Resort & Villas', N'Kiên Giang', N'Bắc Bãi Trường, Tổ 3, Ấp Đường Bào, Xã Dương Tơ, TP. Phú Quốc', N'Khu nghỉ dưỡng phức hợp ven biển nổi tiếng với các kiến trúc nghệ thuật trên cát và là nơi ngắm hoàng hôn đẹp nhất đảo ngọc.', 13)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (19, N'Mường Thanh Luxury Quảng Ninh', N'Quảng Ninh', N'Tổ 1, Khu 2, Phường Bãi Cháy, TP. Hạ Long', N'Khách sạn quy mô lớn với thiết kế kính sang trọng, cung cấp tầm nhìn ôm trọn Di sản thiên nhiên thế giới Vịnh Hạ Long.', 10)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (20, N'The Imperial Hotel Vũng Tàu', N'Bà Rịa - Vũng Tàu', N'159 Thùy Vân, Phường Thắng Tam, TP. Vũng Tàu', N'Khách sạn duy nhất tại Vũng Tàu lấy cảm hứng từ kiến trúc phục hưng Châu Âu nguy nga, lộng lẫy ngay sát bãi biển.', 10)
SET IDENTITY_INSERT [dbo].[Hotels] OFF
GO
SET IDENTITY_INSERT [dbo].[Rooms] ON 

INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (18, 12, N'101', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (19, 12, N'102', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (20, 12, N'201', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (21, 12, N'202', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (22, 13, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (23, 13, N'201', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (24, 14, N'101', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (25, 14, N'102', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (26, 15, N'1', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (27, 15, N'2', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (28, 16, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (34, 18, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (35, 18, N'201', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (36, 18, N'301', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (37, 19, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (38, 19, N'102', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (39, 19, N'201', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (40, 19, N'202', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (41, 19, N'301', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (42, 19, N'302', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (43, 20, N'101', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (44, 20, N'102', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (45, 21, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (46, 21, N'102', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (47, 21, N'103', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (48, 22, N'101', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (49, 22, N'102', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (51, 17, N'102', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (53, 26, N'202', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (54, 26, N'201', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (55, 26, N'203', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (56, 27, N'301', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (57, 27, N'302', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (58, 27, N'303', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (59, 17, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (60, 17, N'103', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (61, 17, N'104', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (62, 23, N'201', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (63, 23, N'202', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (64, 24, N'301', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (65, 24, N'302', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (66, 24, N'303', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (67, 24, N'304', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (68, 25, N'401', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (69, 25, N'402', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (70, 28, N'202', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (71, 28, N'201', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (72, 29, N'301', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (73, 29, N'302', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (74, 30, N'201', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (75, 30, N'202', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (76, 30, N'203', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (77, 31, N'301', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (78, 31, N'302', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (79, 31, N'303', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (80, 31, N'304', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (81, 31, N'305', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (82, 32, N'1a', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (83, 32, N'2a', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (84, 32, N'3a', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (86, 33, N'1b', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (87, 33, N'2b', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (88, 33, N'3b', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (89, 34, N'401', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (90, 34, N'402', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (91, 34, N'403', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (92, 34, N'404', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (93, 35, N'501', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (94, 35, N'502', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (95, 35, N'503', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (96, 35, N'504', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (97, 36, N'102', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (98, 36, N'103', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (99, 36, N'104', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (100, 37, N'202', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (102, 37, N'203', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (103, 37, N'204', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (104, 38, N'202', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (105, 16, N'102', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (106, 16, N'103', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (107, 16, N'104', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (108, 38, N'201', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (109, 39, N'301', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (110, 39, N'302', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (111, 39, N'303', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (112, 39, N'304', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (113, 39, N'305', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (114, 40, N'201', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (115, 40, N'202', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (116, 40, N'203', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (117, 40, N'204', 0, 1)
SET IDENTITY_INSERT [dbo].[Rooms] OFF
GO
SET IDENTITY_INSERT [dbo].[RoomTypes] ON 

INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (12, 11, N'Premium Century Room', CAST(4500000.00 AS Decimal(18, 2)), N'1 Giường King (Cỡ lớn)', N'Hướng sân vườn trong nhà (Courtyard)', 1, N'Máy pha Espresso, Nội thất tân cổ điển, Dịch vụ chỉnh trang phòng', N'https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/95/2016/12/21150217/3557979_XL-1.jpg')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (13, 11, N'Classic Room', CAST(2000000.00 AS Decimal(18, 2)), N'Giường đôi', N'View Hồ đá', 1, N'Đầy đủ tiện nghi, máy lạnh, bàn Bida', N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh21szB2ZEwNnn_OC1uNyLm-8dkD8rqVwxvA&s')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (14, 12, N'Bungalow Mountain View', CAST(2800000.00 AS Decimal(18, 2)), N'1 Giường đôi lớn', N'Thung lũng Mường Hoa & Ruộng bậc thang', 1, N'Lò sưởi củi, Ban công riêng, Miễn phí trà thảo mộc', N'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (15, 13, N'Deluxe Ocean View', CAST(3200000.00 AS Decimal(18, 2)), N'2 Giường đơn (Twin)', N'Trực diện Biển Non Nước', 1, N'Ban công, Smart TV 55 inch, Tủ lạnh Minibar', N'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (16, 14, N'Little Suite River View', CAST(2100000.00 AS Decimal(18, 2)), N'1 Giường King', N'Sông Thu Bồn', 1, N'Xe đạp miễn phí, Bàn làm việc cổ điển, Nước suối hàng ngày', N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHp-GXhisTRvSgmRXsoAnC7vVuADUi1LUNsg&s')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (17, 15, N'Le Petit Room', CAST(1900000.00 AS Decimal(18, 2)), N'1 Giường đôi (Queen)', N'Đồi thông & Vườn hoa', 1, N'Quạt sưởi, Sàn gỗ sồi, Kiến trúc Pháp nguyên bản', N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4WFCBiuo04xliySYlxYzDCqlQ7c3aiVzyEA&s')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (18, 16, N'Club Suite Ocean View', CAST(3500000.00 AS Decimal(18, 2)), N'1 Giường đôi & 1 Giường đơn (Family)', N'Toàn cảnh Vịnh Nha Trang', 1, N'Đặc quyền Club Lounge, Cửa sổ kính sát trần, Bếp nhỏ', N'https://tse1.mm.bing.net/th/id/OIP.2_PN9NOHcfKeCp-qv02ixgHaEo?pid=Api&P=0&h=180')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (19, 17, N'Signature Studio', CAST(4200000.00 AS Decimal(18, 2)), N'1 Giường King siêu lớn', N'Nhà hát Thành phố', 1, N'Máy lọc không khí, Chăn ga lụa tơ tằm, Khu vực sofa tiếp khách', N'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (20, 18, N'Standard Sunset Room', CAST(2500000.00 AS Decimal(18, 2)), N'1 Giường đôi', N'Hồ bơi trung tâm', 1, N'Ghế dài tắm nắng ngoài hiên, Miễn phí vé khu check-in nghệ thuật', N'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (21, 19, N'Executive Suite', CAST(3800000.00 AS Decimal(18, 2)), N'1 Giường King', N'Vịnh Hạ Long & Vòng quay Mặt Trời', 1, N'Bàn làm việc giám đốc, Khu vực ăn uống riêng, Phục vụ 24/7', N'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (22, 20, N'Grand Deluxe King', CAST(3100000.00 AS Decimal(18, 2)), N'1 Giường King phong cách hoàng gia', N'Biển Thùy Vân', 1, N'Nội thất gỗ gụ, Giấy dán tường cổ điển, Dép đi trong nhà cao cấp', N'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (23, 15, N'Economy Single', CAST(550000.00 AS Decimal(18, 2)), N'1 giường đơn', N'Hướng nội bộ / Không cửa sổ', 0, N'Wifi, quạt máy, tủ đồ cá nhân, nhà vệ sinh chung', N'https://datphong.tructuyenvietnam.com/wp-content/uploads/2013/09/saomai_bach_duong-6-1024x682.jpg')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (24, 15, N'Standard City View', CAST(850000.00 AS Decimal(18, 2)), N'1 giường đôi lớn', N'Hướng thành phố', 0, N'Wifi tốc độ cao, TV màn hình phẳng, điều hòa, nước khoáng miễn phí, tủ lạnh mini.', N'https://asiky.com/files/images/Article/tin-tuc/chup-anh-khach-san.jpg')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (25, 15, N'Deluxe Garden View', CAST(1500000.00 AS Decimal(18, 2)), N'1 giường đôi lớn hoặc 2 giường đơn', N'Hướng vườn', 1, N'Wifi, TV truyền hình cáp, minibar, máy sấy tóc, ấm đun nước, bàn làm việc, két an toàn.', N'https://studiochupanhdep.com/Upload/Newsimages/phong-khach-san-tt-studio.jpg')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (26, 19, N'Economy Single', CAST(500000.00 AS Decimal(18, 2)), N'1 giường đơn (Single Bed)', N'Hướng nội bộ / Không cửa sổ', 0, N'Wifi, quạt máy, tủ quần áo nhỏ, bàn làm việc cơ bản, phòng tắm chung hoặc riêng', N'https://www.cet.edu.vn/wp-content/uploads/2018/01/phong-standard-loai-phong-tieu-chuan.jpg')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (27, 19, N'Standard Double', CAST(900000.00 AS Decimal(18, 2)), N'1 giường đôi (Double Bed)', N'Hướng phố', 0, N'Wifi tốc độ cao, TV màn hình phẳng, điều hòa 2 chiều, minibar, ấm đun nước, trà/cà phê miễn phí.', N'https://tse3.mm.bing.net/th/id/OIP.wdhoGf150fu2VfQFj05x0gHaEo?pid=Api&P=0&h=180')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (28, 20, N'Economy Single', CAST(600000.00 AS Decimal(18, 2)), N'1 giường đơn', N'Hướng nội bộ', 0, N'Wifi, quạt máy, tủ quần áo nhỏ, bàn làm việc cơ bản, phòng tắm chung hoặc riêng', N'https://poliva.vn/wp-content/uploads/2019/08/phong-don-la-gi-1-1.jpg')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (29, 20, N'Deluxe Ocean View', CAST(1800000.00 AS Decimal(18, 2)), N'2 giường đơn', N'Hướng biển', 1, N'Wifi, TV truyền hình cáp, két an toàn, khu vực tiếp khách nhỏ với sofa, bàn trang điểm, máy sấy tóc, áo choàng tắm.', N'https://acihome.vn/uploads/15/mau-thiet-ke-noi-that-phong-2-giuong-don-ben-trong-khach-san-3-4-5-sao-2.JPG')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (30, 12, N'Economy', CAST(500000.00 AS Decimal(18, 2)), N'1 giường đơn (Single Bed)', N'Không cửa sổ', 0, N'Wifi, quạt máy, tủ quần áo nhỏ, bàn làm việc cơ bản, phòng tắm chung hoặc riêng', N'https://miahotelvungtau.com/wp-content/uploads/2022/02/z3560936096983_56fe9e8ff37fb24665b46d313ea2ca63.jpg')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (31, 12, N'Standard Double', CAST(900000.00 AS Decimal(18, 2)), N'1 giường đôi (Double Bed)', N'Hướng phố', 0, N'Wifi tốc độ cao, TV màn hình phẳng, điều hòa 2 chiều, minibar, ấm đun nước, trà/cà phê miễn phí.', N'https://tse3.mm.bing.net/th/id/OIP.wdhoGf150fu2VfQFj05x0gHaEo?pid=Api&P=0&h=180')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (32, 13, N'Standard Double', CAST(900000.00 AS Decimal(18, 2)), N'giường đôi (Double Bed)', N'hướng phố', 0, N'Wifi tốc độ cao, TV màn hình phẳng, điều hòa 2 chiều, minibar, ấm đun nước, trà/cà phê miễn phí', N'https://vinapad.com/wp-content/uploads/2019/01/Phong-ngu-khach-san-mini.jpg')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (33, 13, N'Deluxe', CAST(2000000.00 AS Decimal(18, 2)), N'1 giường King', N'Hướng biển', 1, N'Wifi, TV truyền hình cáp, két an toàn, khu vực tiếp khách nhỏ với sofa, bàn trang điểm, máy sấy tóc, áo choàng tắm.', N'https://studiochupanhdep.com/Upload/Images/Album/anh-phong-khach-san-dep-08.jpg')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (34, 17, N'Standard City View', CAST(850000.00 AS Decimal(18, 2)), N'1 giường đôi lớn', N'Hướng thành phố', 0, N'Wifi tốc độ cao, TV màn hình phẳng, điều hòa, nước khoáng miễn phí, tủ lạnh mini.', N'https://cuanhua-loithep.com/wp-content/uploads/2025/10/phong-ngu-1-giuong-don-khach-san-1dece7.webp')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (35, 17, N'Deluxe Garden View', CAST(1500000.00 AS Decimal(18, 2)), N'2 giường đơn', N'Hướng vườn', 0, N'Wifi, TV truyền hình cáp, minibar, máy sấy tóc, ấm đun nước, bàn làm việc, két an toàn.', N'https://tse3.mm.bing.net/th/id/OIP.ABOVu86iY7AUs9xOjleNZQHaEK?pid=Api&P=0&h=180')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (36, 16, N'Standard Room', CAST(650000.00 AS Decimal(18, 2)), N'1 giường đôi lớn', N'Hướng phố / Không cửa sổ', 0, N'Wifi, máy lạnh, TV, tủ lạnh nhỏ, nước uống miễn phí.', N'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrZhk_pb3o3kRINd4eQLyrO-b-xac3l-SqjaHPQobWHKlLGPvFkCoUvd4ceUF9HhwwhRAKUJfwZUvABXUVWEm71dQOtsYyDomMxDiGur1Xj1nbxoHTlkjJi-wKYt-LqzSRqhBCIMrL0Fw/w1200-h630-p-k-no-nu/anh1.webp')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (37, 16, N'Superior Ocean View', CAST(1100000.00 AS Decimal(18, 2)), N'1 giường đôi lớn', N'Hướng biển một phần', 0, N' Wifi, máy lạnh, TV, bàn làm việc, ấm đun nước, tủ quần áo, view biển.', N'https://eholiday.vn/wp-content/uploads/2023/05/Khach-san-Muong-Thanh-Grand-Nha-Trang-Phong-Deluxe-Ocean-View.jpg')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (38, 14, N'Cozy Standard', CAST(600000.00 AS Decimal(18, 2)), N'1 giường đôi', N'Hướng vườn nhỏ', 0, N'Wifi, máy sưởi (rất cần thiết tại Đà Lạt), ấm đun nước, trà túi lọc, tủ quần áo, gương trang điểm', N'https://ik.imagekit.io/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/10023913-f51a692462bd8c5cf166b72829a0f5b2.jpeg?_src=imagekit&tr=dpr-2')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (39, 14, N'Valley View Deluxe', CAST(1500000.00 AS Decimal(18, 2)), N'1 giường King', N'Hướng thung lũng (view cực chill)', 1, N'Wifi, máy sưởi, ghế bành đặt cạnh cửa sổ để ngắm cảnh, máy sấy tóc, minibar, trà/cà phê cao cấp.', N'https://ik.imagekit.io/tvlk/blog/2022/11/khach-san-trung-tam-da-lat-33-1024x683.jpg?tr=dpr-2,w-675')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (40, 18, N'Pine View Superior', CAST(1000000.00 AS Decimal(18, 2)), N'1 giường đôi lớn', N'Hướng biển trực diện', 0, N'Wifi, máy lạnh, sofa thư giãn tại ban công, TV, minibar, máy sấy tóc, bàn trang điểm, view biển trọn vẹn.', N'https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2018/02/gian-phong-nghi-co-view-huong-bien-tuyet-dep.png')
SET IDENTITY_INSERT [dbo].[RoomTypes] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (3, N'Manager', N'manager@gmail.com', N'$2a$11$WaVtGkNs3BktxtidtC5eeegNyY9xuajSVR4fHC41E6AUFnhQe2XfW', N'039999901', N'HotelManager', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (4, N'Quản trị viên', N'admin@example.com', N'$2a$11$GN6dGGUn8v4JAEkNfOqK0eW3.gXTEKz4kPp2.n2T5VdZ5v8X8YM/a', N'0123456789', N'Admin', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (7, N'Test Admin', N'testadmin@example.com', N'$2a$11$BkIBY0TJWwnk.Ce9NM1kiO024d6yJc6LuK4eiXX1bnvpXzzyrffHu', N'0123456789', N'Admin', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (8, N'Manager Test', N'mgr2@example.com', N'$2a$11$Lx1CffaRyINj2UkwMPK2rug5fK5xJPdYPl83spuCxIMXgvSa1xAmq', N'0987654321', N'HotelManager', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (10, N'manager01', N'manager01@gmail.com', N'$2a$11$F/l.x0BechllHO4DVUe6iexG/JbgOPwD5dVKS.kPLkotv0avCe/ce', N'0999999991', N'HotelManager', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (11, N'manager02', N'manager02@gmail.com', N'$2a$11$cTo6HELRqI.Sg6tJALzw0OQjkuCBdqhXXLIT1PeHJB6j6qOJD6eDm', N'0999999992', N'HotelManager', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (12, N'manager03', N'manager03@gmail.com', N'$2a$11$WggElrHW9Ead5Mgrgsw2Y.gZW32eSJh15yKpVgEcgKt0hhy.ePXaa', N'0999999993', N'HotelManager', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (13, N'manager04', N'manager04@gmail.com', N'$2a$11$Udcld9IJjBZWlE/F5pHT0uBjlADMgEqGgY8qMiXgsBYXyZAs/dCxy', N'0999999994', N'HotelManager', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (14, N'khachhang01', N'khachhang01@gmail.com', N'$2a$11$wBdABID00JhszWQnqSF99Ot308iEFXgdy2RA2.pvGRLRuq.rf3X3a', N'0988888881', N'Tourist', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (15, N'khachhang02', N'khachhang02@gmail.com', N'$2a$11$xE7tCvyn.b2hOspqJvdJ1.2SnOm44umbMtRQezBwvjpFQwaEBdht.', N'0988888882', N'Tourist', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (16, N'khachhang03', N'khachhang03@gmail.com', N'$2a$11$sLSFet8qnoshL3CUog/kfeHUse.tB2yHObzDeIrl5Eh6U/9H4o2wC', N'0988888883', N'Tourist', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (17, N'khachhang04', N'khachhang04@gmail.com', N'$2a$11$OitlvBE6D4G8WcIlVWlzC.Z7/BWGCU3f.21fCQhozW13ctsr6UZXq', N'0988888884', N'Tourist', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (18, N'khachhang05', N'khachhang05@gmail.com', N'$2a$11$d8wOxlGzP8mzMT3tFPo1XOZl74SUCESLUNJR3SdTG38GXhI5V4f1S', N'0988888885', N'Tourist', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (19, N'khachhang06', N'khachhang06@gmail.com', N'$2a$11$spoWe7RUuIDx/M98h.ryUO7gkyG8w0zZLTds4MPDoajNK3LOWBM6G', N'0988888886', N'Tourist', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (20, N'khachhang07', N'khachhang07@gmail.com', N'$2a$11$lG9yA3c5SUlVORHoRsyJ3Oaw2bWrx7ns1GfPemb.LoMEXmkyI2Gh.', N'0988888887', N'Tourist', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (21, N'khachhang08', N'khachhang08@gmail.com', N'$2a$11$4uFptdDT9qbn7P41Hgxbd.OL6J0oR2Ju7Q.eetmviQ8jdc0w2N2Te', N'0988888888', N'Tourist', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (22, N'khachhang09', N'khachhang09@gmail.com', N'$2a$11$V1zfFTluFhn9VP42NJrxd./cNfBjmtE1nbf955H8hNGtOb3wsGuj6', N'0988888889', N'Tourist', 1)
SET IDENTITY_INSERT [dbo].[Users] OFF
GO

-- =============================================
-- 5. TẠO CHỈ MỤC & KHÓA NGOẠI (INDEXES & FOREIGN KEYS)
-- =============================================

CREATE NONCLUSTERED INDEX [IX_Bookings_RoomTypeId] ON [dbo].[Bookings] ([RoomTypeId] ASC)
GO
CREATE NONCLUSTERED INDEX [IX_Rooms_RoomTypeId] ON [dbo].[Rooms] ([RoomTypeId] ASC)
GO
CREATE NONCLUSTERED INDEX [IX_RoomTypes_HotelId] ON [dbo].[RoomTypes] ([HotelId] ASC)
GO

ALTER TABLE [dbo].[Bookings] WITH CHECK ADD CONSTRAINT [FK_Bookings_RoomTypes_RoomTypeId] FOREIGN KEY([RoomTypeId]) REFERENCES [dbo].[RoomTypes] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Rooms] WITH CHECK ADD CONSTRAINT [FK_Rooms_RoomTypes_RoomTypeId] FOREIGN KEY([RoomTypeId]) REFERENCES [dbo].[RoomTypes] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RoomTypes] WITH CHECK ADD CONSTRAINT [FK_RoomTypes_Hotels_HotelId] FOREIGN KEY([HotelId]) REFERENCES [dbo].[Hotels] ([Id]) ON DELETE CASCADE
GO

PRINT 'Tạo Database HotelBookingDB và chèn dữ liệu thành công!'