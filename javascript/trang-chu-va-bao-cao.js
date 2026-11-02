var rooms = [];
var requests = [];
var calendar = [];
var users = [];
var currentUser = null;

function docDuLieu(key, macDinh) {
    try {
        var data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : macDinh;
    } catch (e) {
        return macDinh;
    }
}

function luuDuLieu() {
    localStorage.setItem("rooms", JSON.stringify(rooms));
    localStorage.setItem("requests", JSON.stringify(requests));
    localStorage.setItem("calendar", JSON.stringify(calendar));
    localStorage.setItem("users", JSON.stringify(users));
}

function ghiSo(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
}

function khoiTaoDuLieu() {
    rooms = docDuLieu("rooms", []);
    requests = docDuLieu("requests", []);
    calendar = docDuLieu("calendar", []);
    users = docDuLieu("users", []);

    if (rooms.length === 0) {
        rooms = [
            { id: 1, code: "A101", name: "Phòng học A101", building: "Tòa A", capacity: 40, status: "Trống" },
            { id: 2, code: "A102", name: "Phòng học A102", building: "Tòa A", capacity: 50, status: "Trống" }
        ];
    }

    if (!users.some(u => u.username === "admin")) {
        users.push({ id: 1, username: "admin", password: "123456", fullName: "Quản trị viên", email: "admin@example.com", role: "Quản trị viên" });
    }

    luuDuLieu();
    hienThiPhong();
    hienThiNguoiDung();
    hienThiYeuCau();
    hienThiLich();
    capNhatThongKe();
    capNhatDanhSachPhong();
}

function xuLyDangNhap() {
    var form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var u = document.getElementById("username").value.trim();
        var p = document.getElementById("password").value;
        var msg = document.getElementById("loginMessage");

        var user = users.find(item => item.username === u && item.password === p);

        if (user) {
            currentUser = user;
            document.getElementById("loginPage").classList.add("hidden");
            document.getElementById("app").classList.remove("hidden");
            document.getElementById("currentUser").textContent = user.fullName + " - " + user.role;
            msg.textContent = "";
            form.reset();

            var adminLinks = document.querySelectorAll('.menu-link[data-page="rooms"], .menu-link[data-page="users"], .menu-link[data-page="reports"], .menu-link[data-page="requests"]');
            adminLinks.forEach(l => l.style.display = currentUser.role === "Người dùng" ? "none" : "block");

            hienThiTrang("home");
            capNhatThongKe();
        } else {
            msg.textContent = "Tên đăng nhập hoặc mật khẩu không đúng!";
        }
    });
}

function xuLyDangXuat() {
    var btn = document.getElementById("logoutBtn");
    if (!btn) return;

    btn.addEventListener("click", function () {
        currentUser = null;
        document.getElementById("app").classList.add("hidden");
        document.getElementById("loginPage").classList.remove("hidden");
        document.getElementById("loginForm").reset();
        document.getElementById("username").focus();
    });
}

function hienThiTrang(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.querySelectorAll(".menu-link").forEach(l => l.classList.remove("active"));

    var page = document.getElementById(pageId);
    if (page) page.classList.remove("hidden");

    var link = document.querySelector(`.menu-link[data-page="${pageId}"]`);
    if (link) link.classList.add("active");

    if (pageId === "home" || pageId === "reports") capNhatThongKe();
    if (pageId === "rooms") hienThiPhong();
    if (pageId === "booking") capNhatDanhSachPhong();
    if (pageId === "calendar") hienThiLich();
    if (pageId === "requests") hienThiYeuCau();
    if (pageId === "users") hienThiNguoiDung();
}

function xuLyChuyenTrang() {
    document.querySelectorAll(".menu-link").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            hienThiTrang(link.getAttribute("data-page"));
        });
    });
}

function hienThiPhong() {
    var tbody = document.querySelector("#roomTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    rooms.forEach(room => {
        var row = tbody.insertRow();
        row.insertCell().textContent = room.code;
        row.insertCell().textContent = room.name;
        row.insertCell().textContent = room.building;
        row.insertCell().textContent = room.capacity;
        row.insertCell().textContent = room.status;

        var td = row.insertCell();
        var sua = document.createElement("button");
        sua.textContent = "Sửa";
        sua.onclick = () => suaPhong(room.id);

        var xoa = document.createElement("button");
        xoa.textContent = "Xóa";
        xoa.className = "delete-btn";
        xoa.onclick = () => xoaPhong(room.id);

        td.appendChild(sua);
        td.appendChild(xoa);
    });
}

function xuLyThemPhong() {
    var btn = document.getElementById("addRoomBtn");
    var form = document.getElementById("roomForm");
    var cancel = document.getElementById("cancelRoomBtn");
    if (!btn || !form) return;

    btn.onclick = () => {
        form.reset();
        document.getElementById("roomId").value = "";
        document.getElementById("roomFormTitle").textContent = "Thêm phòng học";
        document.getElementById("saveRoomBtn").textContent = "Thêm phòng";
        form.classList.remove("hidden");
    };

    cancel.onclick = () => {
        form.reset();
        form.classList.add("hidden");
    };

    form.onsubmit = (e) => {
        e.preventDefault();
        var id = document.getElementById("roomId").value;
        var code = document.getElementById("roomCode").value.trim();
        var name = document.getElementById("roomName").value.trim();
        var building = document.getElementById("roomBuilding").value.trim();
        var capacity = Number(document.getElementById("roomCapacity").value);
        var status = document.getElementById("roomStatus").value;

        if (capacity <= 0) {
            alert("Sức chứa phải lớn hơn 0!");
            return;
        }

        if (rooms.some(r => r.code.toLowerCase() === code.toLowerCase() && String(r.id) !== String(id))) {
            alert("Mã phòng đã tồn tại!");
            return;
        }

        if (id !== "") {
            var r = rooms.find(item => String(item.id) === String(id));
            if (r) {
                r.code = code;
                r.name = name;
                r.building = building;
                r.capacity = capacity;
                r.status = status;
            }
        } else {
            var newId = rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1;
            rooms.push({ id: newId, code, name, building, capacity, status });
        }

        luuDuLieu();
        hienThiPhong();
        capNhatDanhSachPhong();
        capNhatThongKe();
        form.reset();
        form.classList.add("hidden");
    };
}

function suaPhong(id) {
    var r = rooms.find(item => item.id === id);
    if (!r) return;

    document.getElementById("roomId").value = r.id;
    document.getElementById("roomCode").value = r.code;
    document.getElementById("roomName").value = r.name;
    document.getElementById("roomBuilding").value = r.building;
    document.getElementById("roomCapacity").value = r.capacity;
    document.getElementById("roomStatus").value = r.status;
    document.getElementById("roomFormTitle").textContent = "Sửa thông tin phòng";
    document.getElementById("saveRoomBtn").textContent = "Lưu thay đổi";
    document.getElementById("roomForm").classList.remove("hidden");
}

function xoaPhong(id) {
    var r = rooms.find(item => item.id === id);
    if (!r) return;

    if (requests.some(req => req.roomId === id && req.status === "Đang chờ")) {
        alert("Không thể xóa phòng đang có yêu cầu chờ duyệt!");
        return;
    }

    if (confirm("Bạn có chắc muốn xóa phòng " + r.code + "?")) {
        rooms = rooms.filter(item => item.id !== id);
        luuDuLieu();
        hienThiPhong();
        capNhatDanhSachPhong();
        capNhatThongKe();
    }
}

function capNhatDanhSachPhong() {
    var select = document.getElementById("roomSelect");
    if (!select) return;

    var val = select.value;
    select.innerHTML = '<option value="">-- Chọn phòng --</option>';

    rooms.forEach(r => {
        var opt = document.createElement("option");
        opt.value = r.id;
        opt.textContent = `${r.code} - ${r.name} (${r.status})`;
        select.appendChild(opt);
    });

    select.value = val;
}

function xuLyDatPhong() {
    var form = document.getElementById("bookingForm");
    if (!form) return;

    form.onsubmit = (e) => {
        e.preventDefault();
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

        if (startTime >= endTime) {
            alert("Thời gian kết thúc phải sau thời gian bắt đầu!");
            return;
        }

        var biTrung = calendar.some(item => item.roomId === roomId && item.date === date && startTime < item.endTime && endTime > item.startTime);
        var choDuyetBiTrung = requests.some(item => item.roomId === roomId && item.date === date && item.status === "Đang chờ" && startTime < item.endTime && endTime > item.startTime);

        if (biTrung || choDuyetBiTrung) {
            alert("Phòng đã có lịch hoặc yêu cầu trùng thời gian!");
            return;
        }

        var newId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
        requests.push({ id: newId, username: currentUser.username, fullName: currentUser.fullName, roomId, date, startTime, endTime, purpose, status: "Đang chờ" });

        luuDuLieu();
        hienThiYeuCau();
        capNhatThongKe();
        form.reset();
        alert("Đã gửi yêu cầu đặt phòng thành công!");
    };
}

function hienThiYeuCau() {
    var tbody = document.querySelector("#requestTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    requests.forEach(req => {
        var r = rooms.find(item => item.id === req.roomId);
        var row = tbody.insertRow();
        row.insertCell().textContent = req.fullName;
        row.insertCell().textContent = r ? r.code : "Đã xóa phòng";
        row.insertCell().textContent = `${req.date} ${req.startTime} - ${req.endTime}`;
        row.insertCell().textContent = req.purpose;

        var statusCell = row.insertCell();
        statusCell.textContent = req.status;
        statusCell.className = req.status === "Đang chờ" ? "status-pending" : (req.status === "Đã duyệt" ? "status-approved" : "status-rejected");

        var td = row.insertCell();
        if (req.status === "Đang chờ") {
            var duyet = document.createElement("button");
            duyet.textContent = "Duyệt";
            duyet.className = "approve-btn";
            duyet.onclick = () => duyetYeuCau(req.id);

            var tuchoi = document.createElement("button");
            tuchoi.textContent = "Từ chối";
            tuchoi.className = "delete-btn";
            tuchoi.onclick = () => tuChoiYeuCau(req.id);

            td.appendChild(duyet);
            td.appendChild(tuchoi);
        } else {
            td.textContent = "Đã xử lý";
        }
    });
}

function duyetYeuCau(id) {
    var req = requests.find(item => item.id === id);
    if (!req) return;

    var r = rooms.find(item => item.id === req.roomId);
    req.status = "Đã duyệt";
    calendar.push({ id: req.id, roomId: req.roomId, roomCode: r ? r.code : "", date: req.date, startTime: req.startTime, endTime: req.endTime, purpose: req.purpose, fullName: req.fullName });

    luuDuLieu();
    hienThiYeuCau();
    hienThiLich();
    capNhatThongKe();
}

function tuChoiYeuCau(id) {
    var req = requests.find(item => item.id === id);
    if (!req) return;

    if (confirm("Bạn có chắc muốn từ chối yêu cầu này?")) {
        req.status = "Đã từ chối";
        luuDuLieu();
        hienThiYeuCau();
        capNhatThongKe();
    }
}

function hienThiLich() {
    var tbody = document.querySelector("#calendarTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    calendar.sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.startTime.localeCompare(b.startTime));

    calendar.forEach(item => {
        var r = rooms.find(room => room.id === item.roomId);
        var row = tbody.insertRow();
        row.insertCell().textContent = item.date;
        row.insertCell().textContent = r ? r.code : item.roomCode;
        row.insertCell().textContent = item.startTime;
        row.insertCell().textContent = item.endTime;
        row.insertCell().textContent = item.purpose;
    });
    luuDuLieu();
}

function hienThiNguoiDung() {
    var tbody = document.querySelector("#userTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    users.forEach(u => {
        var row = tbody.insertRow();
        row.insertCell().textContent = u.id;
        row.insertCell().textContent = u.fullName;
        row.insertCell().textContent = u.email;
        row.insertCell().textContent = u.role;

        var td = row.insertCell();
        if (u.username !== "admin") {
            var btn = document.createElement("button");
            btn.textContent = "Xóa";
            btn.className = "delete-btn";
            btn.onclick = () => xoaNguoiDung(u.id);
            td.appendChild(btn);
        } else {
            td.textContent = "Tài khoản mặc định";
        }
    });
}

function xuLyThemNguoiDung() {
    var btn = document.getElementById("addUserBtn");
    var form = document.getElementById("userForm");
    var cancel = document.getElementById("cancelUserBtn");
    if (!btn || !form) return;

    btn.onclick = () => {
        form.reset();
        form.classList.remove("hidden");
    };
    cancel.onclick = () => {
        form.reset();
        form.classList.add("hidden");
    };

    form.onsubmit = (e) => {
        e.preventDefault();
        var username = document.getElementById("newUsername").value.trim();
        var fullName = document.getElementById("newFullName").value.trim();
        var email = document.getElementById("newEmail").value.trim();
        var role = document.getElementById("newRole").value;
        var password = document.getElementById("newPassword").value;

        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            alert("Tên đăng nhập đã tồn tại!");
            return;
        }

        var newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({ id: newId, username, password, fullName, email, role });

        luuDuLieu();
        hienThiNguoiDung();
        form.reset();
        form.classList.add("hidden");
        alert("Thêm người dùng thành công!");
    };
}

function xoaNguoiDung(id) {
    var u = users.find(item => item.id === id);
    if (!u || u.username === "admin") return;

    if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
        users = users.filter(item => item.id !== id);
        luuDuLieu();
        hienThiNguoiDung();
    }
}

function capNhatThongKe() {
    var tong = rooms.length;
    var dung = rooms.filter(r => r.status === "Đang sử dụng").length;
    var trong = rooms.filter(r => r.status === "Trống").length;
    var baotri = rooms.filter(r => r.status === "Bảo trì").length;
    var cho = requests.filter(r => r.status === "Đang chờ").length;

    ghiSo("totalRooms", tong);
    ghiSo("usedRooms", dung);
    ghiSo("emptyRooms", trong);
    ghiSo("pendingRequests", cho);

    ghiSo("reportTotal", tong);
    ghiSo("reportUsed", dung);
    ghiSo("reportEmpty", trong);
    ghiSo("reportPending", cho);
    ghiSo("reportMaintenance", baotri);
    ghiSo("reportRequests", requests.length);
    ghiSo("reportApproved", requests.filter(r => r.status === "Đã duyệt").length);
    ghiSo("reportRejected", requests.filter(r => r.status === "Đã từ chối").length);
    ghiSo("reportCalendar", calendar.length);
    ghiSo("reportDate", new Date().toLocaleDateString("vi-VN"));
}

function xuLyInBaoCao() {
    var btn = document.getElementById("printReportBtn");
    if (btn) btn.onclick = () => window.print();
}

function xuLyTimKiem() {
    var input = document.getElementById("searchInput");
    if (!input) return;

    input.oninput = () => {
        var q = input.value.trim().toLowerCase();
        var page = document.querySelector(".page:not(.hidden)");
        if (!page) return;

        page.querySelectorAll("tbody tr").forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
        });
    };
}

document.addEventListener("DOMContentLoaded", function () {
    khoiTaoDuLieu();
    xuLyDangNhap();
    xuLyDangXuat();
    xuLyChuyenTrang();
    xuLyThemPhong();
    xuLyDatPhong();
    xuLyThemNguoiDung();
    xuLyInBaoCao();
    xuLyTimKiem();
});
