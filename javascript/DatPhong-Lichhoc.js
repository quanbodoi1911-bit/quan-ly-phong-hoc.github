
var rooms = [
    { id: 1, code: "A101", name: "Phòng học A101", building: "Tòa A", capacity: 40, status: "Trống" },
    { id: 2, code: "A102", name: "Phòng học A102", building: "Tòa A", capacity: 50, status: "Trống" }
];
var requests = [];
var calendar = [];
var currentUser = { id: 2, username: "user1", fullName: "Người dùng 1", role: "Người dùng" };

//  SIDEBAR VÀ CHUYỂN TRANG

function xuLyChuyenTrang() {
    var links = document.querySelectorAll(".menu-link");

    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            // event.preventDefault();
            // Trong thực tế, bạn sẽ dùng window.location.href để chuyển sang file HTML khác
            // Ví dụ: window.location.href = link.getAttribute("data-page") + ".html";
            alert("Sẽ chuyển đến trang: " + link.getAttribute("data-page") + ".html");
        });
    });
}

function xuLyDangXuat() {
    var logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            alert("Đăng xuất thành công!");
            // window.location.href = "login.html";
        });
    }
}


//  DANH SÁCH PHÒNG ĐẶT

function capNhatDanhSachPhong() {
    var roomSelect = document.getElementById("roomSelect");

    if (!roomSelect) return;

    var giaTriCu = roomSelect.value;

    roomSelect.innerHTML = "";

    var optionDau = document.createElement("option");
    optionDau.value = "";
    optionDau.textContent = "-- Chọn phòng --";

    roomSelect.appendChild(optionDau);

    rooms.forEach(function (room) {
        var option = document.createElement("option");

        option.value = room.id;
        option.textContent = room.code + " - " + room.name + " (" + room.status + ")";

        roomSelect.appendChild(option);
    });

    if (rooms.some(function (room) { return String(room.id) === giaTriCu; })) {
        roomSelect.value = giaTriCu;
    }
}


// XỬ LÝ ĐẶT PHÒNG

function layNgayHienTai() {
    var ngay = new Date();
    var nam = ngay.getFullYear();
    var thang = String(ngay.getMonth() + 1).padStart(2, "0");
    var ngayTrongThang = String(ngay.getDate()).padStart(2, "0");

    return nam + "-" + thang + "-" + ngayTrongThang;
}

function xuLyDatPhong() {
    var bookingForm = document.getElementById("bookingForm");

    if (!bookingForm) return;

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!currentUser) {
            alert("Vui lòng đăng nhập trước!");
            return;
        }

        var roomId = Number(document.getElementById("roomSelect").value);
        var date = document.getElementById("bookingDate").value;
        var startTime = document.getElementById("startTime").value;
        var endTime = document.getElementById("endTime").value;
        var purpose = document.getElementById("purpose").value.trim();

        if (!roomId) {
            alert("Vui lòng chọn phòng!");
            return;
        }

        if (date < layNgayHienTai()) {
            alert("Không thể đặt phòng trong quá khứ!");
            return;
        }

        if (startTime >= endTime) {
            alert("Thời gian kết thúc phải sau thời gian bắt đầu!");
            return;
        }

        var room = rooms.find(function (item) { return item.id === roomId; });

        if (!room) {
            alert("Không tìm thấy phòng!");
            return;
        }

        // Kiểm tra trùng giờ với yêu cầu đã được duyệt
        var biTrung = calendar.some(function (item) {
            return item.roomId === roomId &&
                   item.date === date &&
                   startTime < item.endTime &&
                   endTime > item.startTime;
        });

        // Kiểm tra trùng giờ với yêu cầu đang chờ
        var choDuyetBiTrung = requests.some(function (item) {
            return item.roomId === roomId &&
                   item.date === date &&
                   item.status === "Đang chờ" &&
                   startTime < item.endTime &&
                   endTime > item.startTime;
        });

        if (biTrung || choDuyetBiTrung) {
            alert("Phòng đã có lịch hoặc yêu cầu trùng thời gian!");
            return;
        }

        var newId = requests.length > 0 ? Math.max.apply(null, requests.map(function (item) { return Number(item.id) || 0; })) + 1 : 1;

        requests.push({
            id: newId,
            username: currentUser.username,
            fullName: currentUser.fullName,
            roomId: roomId,
            date: date,
            startTime: startTime,
            endTime: endTime,
            purpose: purpose,
            status: "Đang chờ"
        });

        bookingForm.reset();

        alert("Đã gửi yêu cầu đặt phòng thành công!\nBạn có thể kiểm tra ở trang Yêu cầu đặt phòng.");
        console.log("Danh sách yêu cầu hiện tại:", requests);
    });
}

// KHỞI CHẠY KHI TẢI TRANG
document.addEventListener("DOMContentLoaded", function () {
    // Cập nhật tên người dùng hiển thị
    if (currentUser) {
        document.getElementById("currentUser").textContent = currentUser.fullName + " - " + currentUser.role;
    }

    xuLyChuyenTrang();
    xuLyDangXuat();
    capNhatDanhSachPhong();
    xuLyDatPhong();
});