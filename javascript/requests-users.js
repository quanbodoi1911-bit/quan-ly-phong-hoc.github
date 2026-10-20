
var requests = JSON.parse(localStorage.getItem("requests")) || [];
var users = JSON.parse(localStorage.getItem("users")) || [];
var rooms = JSON.parse(localStorage.getItem("rooms")) || [];
var calendar = JSON.parse(localStorage.getItem("calendar")) || [];

if (!users.some(function (u) { return u.username === "admin"; })) {
    users.push({ id: 1, username: "admin", password: "123456", fullName: "Quản trị viên", email: "admin@example.com", role: "Quản trị viên" });
    localStorage.setItem("users", JSON.stringify(users));
}

function luu() {
    localStorage.setItem("requests", JSON.stringify(requests));
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("calendar", JSON.stringify(calendar));
}

function hienThiTrang(pageId) {
    document.querySelectorAll(".page").forEach(function (p) { p.classList.add("hidden"); });
    document.querySelectorAll(".menu-link").forEach(function (l) { l.classList.remove("active"); });

    var targetPage = document.getElementById(pageId);
    var targetLink = document.querySelector('.menu-link[data-page="' + pageId + '"]');
    if (targetPage) targetPage.classList.remove("hidden");
    if (targetLink) targetLink.classList.add("active");

    if (pageId === "requests") hienThiYeuCau();
    if (pageId === "users") hienThiNguoiDung();
}


function hienThiYeuCau() {
    var tbody = document.querySelector("#requestTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    requests.forEach(function (req) {
        var room = rooms.find(function (r) { return r.id === req.roomId; });
        var row = tbody.insertRow();

        row.insertCell().textContent = req.fullName;
        row.insertCell().textContent = room ? room.code : "Đã xóa phòng";
        row.insertCell().textContent = req.date + " " + req.startTime + " - " + req.endTime;
        row.insertCell().textContent = req.purpose;

        var statusCell = row.insertCell();
        statusCell.textContent = req.status;
        statusCell.className = req.status === "Đang chờ" ? "status-pending" : (req.status === "Đã duyệt" ? "status-approved" : "status-rejected");

        var actionCell = row.insertCell();
        if (req.status === "Đang chờ") {
            var btnDuyet = document.createElement("button");
            btnDuyet.textContent = "Duyệt";
            btnDuyet.className = "approve-btn";
            btnDuyet.onclick = function () { duyetYeuCau(req.id); };

            var btnTuChoi = document.createElement("button");
            btnTuChoi.textContent = "Từ chối";
            btnTuChoi.className = "delete-btn";
            btnTuChoi.onclick = function () { tuChoiYeuCau(req.id); };

            actionCell.appendChild(btnDuyet);
            actionCell.appendChild(btnTuChoi);
        } else {
            actionCell.textContent = "Đã xử lý";
        }
    });
}

function duyetYeuCau(id) {
    var req = requests.find(function (item) { return item.id === id; });
    if (!req) return;

    // Kiểm tra trùng lịch trước khi duyệt
    var biTrung = calendar.some(function (c) {
        return c.roomId === req.roomId && c.date === req.date && req.startTime < c.endTime && req.endTime > c.startTime;
    });

    if (biTrung) {
        alert("Không thể duyệt vì phòng này đã có lịch trùng thời gian!");
        return;
    }

    req.status = "Đã duyệt";
    var room = rooms.find(function (r) { return r.id === req.roomId; });
    calendar.push({
        id: req.id, roomId: req.roomId, roomCode: room ? room.code : "",
        date: req.date, startTime: req.startTime, endTime: req.endTime, purpose: req.purpose, fullName: req.fullName
    });

    luu();
    hienThiYeuCau();
    alert("Đã duyệt yêu cầu đặt phòng!");
}

function tuChoiYeuCau(id) {
    var req = requests.find(function (item) { return item.id === id; });
    if (req && confirm("Bạn có chắc muốn từ chối yêu cầu này?")) {
        req.status = "Đã từ chối";
        luu();
        hienThiYeuCau();
        alert("Đã từ chối yêu cầu!");
    }
}


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
        if (user.username !== "admin") {
            var btnXoa = document.createElement("button");
            btnXoa.textContent = "Xóa";
            btnXoa.className = "delete-btn";
            btnXoa.onclick = function () { xoaNguoiDung(user.id); };
            actionCell.appendChild(btnXoa);
        } else {
            actionCell.textContent = "Mặc định";
        }
    });
}

function xuLyThemNguoiDung() {
    var userForm = document.getElementById("userForm");
    document.getElementById("addUserBtn").onclick = function () { userForm.reset(); userForm.classList.remove("hidden"); };
    document.getElementById("cancelUserBtn").onclick = function () { userForm.reset(); userForm.classList.add("hidden"); };

    userForm.onsubmit = function (e) {
        e.preventDefault();
        var username = document.getElementById("newUsername").value.trim();
        var password = document.getElementById("newPassword").value;

        if (users.some(function (u) { return u.username.toLowerCase() === username.toLowerCase(); })) {
            alert("Tên đăng nhập đã tồn tại!");
            return;
        }
        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        users.push({
            id: users.length > 0 ? Math.max.apply(null, users.map(function (u) { return u.id || 0; })) + 1 : 1,
            username: username,
            password: password,
            fullName: document.getElementById("newFullName").value.trim(),
            email: document.getElementById("newEmail").value.trim(),
            role: document.getElementById("newRole").value
        });

        luu();
        hienThiNguoiDung();
        userForm.reset();
        userForm.classList.add("hidden");
        alert("Thêm người dùng thành công!");
    };
}

function xoaNguoiDung(id) {
    if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
        users = users.filter(function (u) { return u.id !== id; });
        luu();
        hienThiNguoiDung();
        alert("Đã xóa người dùng!");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Đăng ký sự kiện click cho các nút Sidebar
    document.querySelectorAll(".menu-link").forEach(function (link) {
        link.onclick = function (e) {
            e.preventDefault();
            hienThiTrang(link.getAttribute("data-page"));
        };
    });

    hienThiTrang("requests");
    xuLyThemNguoiDung();
});