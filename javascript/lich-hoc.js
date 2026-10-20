
/* DỮ LIỆU TẠM THỜI MÔ PHỎNG CHO TRANG LỊCH HỌC*/
var rooms = [
    { id: 1, code: "A101" },
    { id: 2, code: "A102" }
];

var calendar = [
    { id: 1, roomId: 1, date: "2026-10-20", startTime: "07:00", endTime: "09:00", purpose: "Học môn Lập trình Web" },
    { id: 2, roomId: 2, date: "2026-10-21", startTime: "09:30", endTime: "11:30", purpose: "Họp nhóm đồ án" },
    { id: 3, roomId: 1, date: "2026-10-22", startTime: "13:00", endTime: "15:00", purpose: "Học môn Cơ sở dữ liệu" }
];


// HÀM HIỂN THỊ LỊCH HỌC VÀO BẢNG
function hienThiLich() {
    var tbody = document.querySelector("#calendarTable tbody");
    if (!tbody) return;

    // Xóa dữ liệu cũ trước khi điền mới
    tbody.innerHTML = "";

    // Sắp xếp lịch học theo ngày và giờ tăng dần
    calendar.sort(function (a, b) {
        if (a.date !== b.date) {
            return a.date.localeCompare(b.date);
        }
        return a.startTime.localeCompare(b.startTime);
    });

    // Đổ dữ liệu vào bảng
    calendar.forEach(function (item) {
        // Tìm tên phòng dựa vào roomId
        var room = rooms.find(function (r) {
            return r.id === item.roomId;
        });

        // Tạo 1 dòng mới trong bảng
        var row = tbody.insertRow();
        
        row.insertCell().textContent = item.date;
        row.insertCell().textContent = room ? room.code : "Không xác định";
        row.insertCell().textContent = item.startTime;
        row.insertCell().textContent = item.endTime;
        row.insertCell().textContent = item.purpose;
    });
}


// KHỞI CHẠY KHI TẢI TRANG
document.addEventListener("DOMContentLoaded", function () {
    hienThiLich();
});