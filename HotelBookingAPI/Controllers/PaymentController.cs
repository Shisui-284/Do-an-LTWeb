using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[Route("api/[controller]")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly IConfiguration _config;
    public PaymentController(IConfiguration config) => _config = config;

    [HttpPost("create-payment-url")]
    public IActionResult CreatePayment([FromBody] decimal amount)
    {
        var tmnCode = _config["VnPay:TmnCode"];
        var hashSecret = _config["VnPay:HashSecret"];
        var baseUrl = _config["VnPay:BaseUrl"];
        var returnUrl = _config["VnPay:ReturnUrl"];

        // Tạo chuỗi tham số gửi lên VNPAY
        var pay = new SortedList<string, string>
        {
            {"vnp_Amount", (amount * 100).ToString()},
            {"vnp_Command", "pay"},
            {"vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss")},
            {"vnp_CurrCode", "VND"},
            {"vnp_IpAddr", "127.0.0.1"},
            {"vnp_Locale", "vn"},
            {"vnp_OrderInfo", "Thanh toan don dat phong"},
            {"vnp_OrderType", "other"},
            {"vnp_ReturnUrl", returnUrl},
            {"vnp_TmnCode", tmnCode},
            {"vnp_TxnRef", DateTime.Now.Ticks.ToString()},
            {"vnp_Version", "2.1.0"}
        };

        // Ghép chuỗi và ký Hash
        string query = string.Join("&", pay.Select(x => $"{x.Key}={x.Value}"));
        string vnp_SecureHash = VnPayLibrary.HmacSHA512(hashSecret, query);
        string paymentUrl = $"{baseUrl}?{query}&vnp_SecureHash={vnp_SecureHash}";

        return Ok(new { url = paymentUrl });
    }
}