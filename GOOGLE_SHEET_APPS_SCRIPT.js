/**
 * MÃ NGUỒN GOOGLE APPS SCRIPT ĐỒNG BỘ DỮ LIỆU TỰ ĐỘNG
 * Dành cho: KHÓA ĐÀO TẠO OHANA AI ACADEMY (LÀM CHỦ AI KINH DOANH THỰC CHIẾN)
 * 
 * HƯỚNG DẪN CÀI ĐẶT 1 PHÚT TRÊN GOOGLE SHEETS:
 * -------------------------------------------------------------
 * 1. Mở một Google Sheet mới (Đặt tên: "DANH SÁCH ĐĂNG KÝ OHANA AI ACADEMY").
 * 2. Đặt tiêu đề cho các cột ở Dòng 1:
 *    - Cột A: Thời gian
 *    - Cột B: Họ và tên
 *    - Cột C: Số điện thoại (Zalo)
 *    - Cột D: Email
 *    - Cột E: Nhu cầu chính
 *    - Cột F: Khảo sát trình độ AI
 *    - Cột G: Khóa học & Gói
 *    - Cột H: Nguồn đăng ký
 *    - Cột I: Ghi chú chi tiết
 *    - Cột J: Trạng thái tư vấn (Mới / Đã gọi / Đã chốt)
 * 
 * 3. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 4. Xóa hết mã cũ trong editor, copy và dán toàn bộ đoạn code bên dưới vào.
 * 5. Nhấn Lưu (Ctrl + S).
 * 6. Nhấn nút "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment):
 *    - Loại triển khai: Ứng dụng web (Web app).
 *    - Mô tả: Ohana AI Academy Webhook v2.
 *    - Thực thi dưới dạng (Execute as): Tôi (Địa chỉ email của bạn).
 *    - Người có quyền truy cập (Who has access): BẤT KỲ AI (Anyone) -> (Bắt buộc để web gửi được dữ liệu).
 * 7. Nhấn "Triển khai" (Deploy) và bấm "Cấp quyền truy cập" (Authorize access).
 * 8. Copy đường link URL Web App (dạng: https://script.google.com/macros/s/.../exec).
 *    Link này đã có thể nhận dữ liệu ngay lập tức từ Landing Page!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(parseErr) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var time = data.time || Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    var fullName = data.full_name || data.name || "";
    var phone = "'" + (data.phone || ""); // Thêm dấu ' để giữ nguyên số 0 ở đầu
    var email = data.email || "";
    var demand = data.demand || data.company || "";
    var aiLevel = data.ai_level || "Chưa khảo sát";
    var ticket = data.ticket || "Ohana AI Academy (Học bổng 49%)";
    var source = data.source || "Landing Page Ohana AI Academy";
    var note = data.note || ("Nhu cầu: " + demand + " | Khảo sát AI: " + aiLevel);
    var status = data.status || "moi";

    // Thêm dòng mới vào Google Sheet (10 Cột)
    sheet.appendRow([
      time,
      fullName,
      phone,
      email,
      demand,
      aiLevel,
      ticket,
      source,
      note,
      status
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 
      ok: true, 
      message: "Đã lưu vào Google Sheet thành công!",
      time: time
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      ok: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    service: "Ohana AI Academy Google Sheet Webhook Active"
  })).setMimeType(ContentService.MimeType.JSON);
}
