// ==========================================
// DỮ LIỆU ĐỒNG BỘ LOCALSTORAGE
// ==========================================

var rooms = [];
var requests = [];
var calendar = [];
var users = [];
var currentUser = null;

function docDuLieu(key, macDinh) {
    try {
        var data = localStorage.getItem(key);

        if (data) {
            var ketQua = JSON.parse(data);

            if (Array.isArray(ketQua)) {
                return ketQua;
            }
        }
    } catch (error) {
        console.error("Lỗi đọc dữ liệu:", key, error);
    }

    return macDinh;
}

function luuDuLieu() {
    localStorage.setItem("rooms", JSON.stringify(rooms));
    localStorage.setItem("requests", JSON.stringify(requests));
    localStorage.setItem("calendar", JSON.stringify(calendar));
    localStorage.setItem("users", JSON.stringify(users));
}

function capNhatThongKe() {
    // Hàm phụ trợ đồng bộ với trang chủ của nhóm
    var tongPhong = rooms.length;

    var phongDangDung = rooms.filter(function (room) {
        return room.status === "Đang sử dụng";
    }).length;

    var phongTrong = rooms.filter(function (room) {
        return room.status === "Trống";
    }).length;

    var yeuCauCho = requests.filter(function (request) {
        return request.status === "Đang chờ";
    }).length;

    var elTotal = document.getElementById("totalRooms");
    if (elTotal) elTotal.textContent = tongPhong;
    var elUsed = document.getElementById("usedRooms");
    if (elUsed) elUsed.textContent = phongDangDung;
    var elEmpty = document.getElementById("emptyRooms");
    if (elEmpty) elEmpty.textContent = phongTrong;
    var elPending = document.getElementById("pendingRequests");
    if (elPending) elPending.textContent = yeuCauCho;
}

// ==========================================
// THÀNH VIÊN 4: HIỂN THỊ YÊU CẦU ĐẶT PHÒNG
// ==========================================

function hienThiYeuCau() {
    var tbody = document.querySelector("#requestTable tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    requests.forEach(function (request) {
        var room = rooms.find(function (item) {
            return item.id === request.roomId;
        });

        var row = tbody.insertRow();

        row.insertCell().textContent = request.fullName;
        row.insertCell().textContent = room ? room.code : "Đã xóa phòng";

        row.insertCell().textContent =
            request.date + " " + request.startTime +
            " - " + request.endTime;

        row.insertCell().textContent = request.purpose;

        var statusCell = row.insertCell();
        statusCell.textContent = request.status;

        if (request.status === "Đang chờ") {
            statusCell.className = "status-pending";
        } else if (request.status === "Đã duyệt") {
            statusCell.className = "status-approved";
        } else {
            statusCell.className = "status-rejected";
        }

        var actionCell = row.insertCell();

        if (request.status === "Đang chờ") {
            var duyetBtn = document.createElement("button");
            duyetBtn.textContent = "Duyệt";
            duyetBtn.className = "approve-btn";

            duyetBtn.addEventListener("click", function () {
                duyetYeuCau(request.id);
            });

            var tuChoiBtn = document.createElement("button");
            tuChoiBtn.textContent = "Từ chối";
            tuChoiBtn.className = "delete-btn";

            tuChoiBtn.addEventListener("click", function () {
                tuChoiYeuCau(request.id);
            });

            actionCell.appendChild(duyetBtn);
            actionCell.appendChild(tuChoiBtn);
        } else {
            actionCell.textContent = "Đã xử lý";
        }
    });
}

// ==========================================
// THÀNH VIÊN 4: DUYỆT YÊU CẦU
// ==========================================

function duyetYeuCau(id) {
    var request = requests.find(function (item) {
        return item.id === id;
    });

    if (!request) return;

    // Kiểm tra lại lịch trước khi duyệt

    var biTrung = calendar.some(function (item) {
        return item.roomId === request.roomId &&
               item.date === request.date &&
               request.startTime < item.endTime &&
               request.endTime > item.startTime;
    });

    if (biTrung) {
        alert("Không thể duyệt vì lịch phòng bị trùng!");
        return;
    }

    request.status = "Đã duyệt";

    var room = rooms.find(function (item) {
        return item.id === request.roomId;
    });

    calendar.push({
        id: request.id,
        roomId: request.roomId,
        roomCode: room ? room.code : "",
        date: request.date,
        startTime: request.startTime,
        endTime: request.endTime,
        purpose: request.purpose,
        fullName: request.fullName
    });

    luuDuLieu();
    hienThiYeuCau();
    capNhatThongKe();

    alert("Đã duyệt yêu cầu đặt phòng!");
}

// ==========================================
// THÀNH VIÊN 4: TỪ CHỐI YÊU CẦU
// ==========================================

function tuChoiYeuCau(id) {
    var request = requests.find(function (item) {
        return item.id === id;
    });

    if (!request) return;

    if (confirm("Bạn có chắc muốn từ chối yêu cầu này?")) {
        request.status = "Đã từ chối";

        luuDuLieu();
        hienThiYeuCau();
        capNhatThongKe();

        alert("Đã từ chối yêu cầu!");
    }
}

// ==========================================
// THÀNH VIÊN 1: QUẢN LÝ NGƯỜI DÙNG
// ==========================================

function hienThiNguoiDung() {
    var tbody = document.querySelector("#userTable tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    users.forEach(function (user) {
        var row = tbody.insertRow();

        row.insertCell().textContent = user.id;
        row.insertCell().textContent = user.fullName;
        row.insertCell().textContent = user.email;
        row.insertCell().textContent = user.role;

        var actionCell = row.insertCell();

        // Không cho xóa tài khoản admin mặc định

        if (user.username !== "admin") {
            var xoaBtn = document.createElement("button");
            xoaBtn.textContent = "Xóa";
            xoaBtn.className = "delete-btn";

            xoaBtn.addEventListener("click", function () {
                xoaNguoiDung(user.id);
            });

            actionCell.appendChild(xoaBtn);
        } else {
            actionCell.textContent = "Tài khoản mặc định";
        }
    });
}

function xuLyThemNguoiDung() {
    var addUserBtn = document.getElementById("addUserBtn");
    var userForm = document.getElementById("userForm");
    var cancelUserBtn = document.getElementById("cancelUserBtn");

    if (!addUserBtn || !userForm || !cancelUserBtn) return;

    addUserBtn.addEventListener("click", function () {
        userForm.reset();
        userForm.classList.remove("hidden");
    });

    cancelUserBtn.addEventListener("click", function () {
        userForm.reset();
        userForm.classList.add("hidden");
    });

    userForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var username = document.getElementById("newUsername").value.trim();
        var fullName = document.getElementById("newFullName").value.trim();
        var email = document.getElementById("newEmail").value.trim();
        var role = document.getElementById("newRole").value;
        var password = document.getElementById("newPassword").value;

        var trungTen = users.some(function (user) {
            return user.username.toLowerCase() === username.toLowerCase();
        });

        if (trungTen) {
            alert("Tên đăng nhập đã tồn tại!");
            return;
        }

        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        var newId = users.length > 0
            ? Math.max.apply(null, users.map(function (user) {
                return Number(user.id) || 0;
            })) + 1
            : 1;

        users.push({
            id: newId,
            username: username,
            password: password,
            fullName: fullName,
            email: email,
            role: role
        });

        luuDuLieu();
        hienThiNguoiDung();

        userForm.reset();
        userForm.classList.add("hidden");

        alert("Thêm người dùng thành công!");
    });
}

function xoaNguoiDung(id) {
    var user = users.find(function (item) {
        return item.id === id;
    });

    if (!user) return;

    if (user.username === "admin") {
        alert("Không thể xóa tài khoản admin!");
        return;
    }

    if (currentUser && currentUser.id === id) {
        alert("Không thể xóa tài khoản đang đăng nhập!");
        return;
    }

    if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
        users = users.filter(function (item) {
            return item.id !== id;
        });

        luuDuLieu();
        hienThiNguoiDung();

        alert("Đã xóa người dùng!");
    }
}

// ==========================================
// KHỞI CHẠY KHI MỞ TRANG
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    // Đọc dữ liệu từ LocalStorage
    rooms = docDuLieu("rooms", []);
    requests = docDuLieu("requests", []);
    calendar = docDuLieu("calendar", []);
    users = docDuLieu("users", []);

    // Tạo tài khoản admin mặc định nếu chưa có
    if (!users.some(function (user) { return user.username === "admin"; })) {
        users.push({
            id: 1,
            username: "admin",
            password: "123456",
            fullName: "Quản trị viên",
            email: "admin@example.com",
            role: "Quản trị viên"
        });
        luuDuLieu();
    }

    // Khởi chạy giao diện và sự kiện
    hienThiYeuCau();
    hienThiNguoiDung();
    xuLyThemNguoiDung();
});