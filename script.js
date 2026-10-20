// ==========================================
// PHẦN CHUNG: DỮ LIỆU TOÀN WEBSITE
// ==========================================

var rooms = [];
var requests = [];
var calendar = [];
var users = [];
var currentUser = null;


// ==========================================
// PHẦN CHUNG: LƯU VÀ ĐỌC DỮ LIỆU
// ==========================================

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


// ==========================================
// THÀNH VIÊN 1(Quân): KHỞI TẠO DỮ LIỆU
// ==========================================

function khoiTaoDuLieu() {
    rooms = docDuLieu("rooms", []);
    requests = docDuLieu("requests", []);
    calendar = docDuLieu("calendar", []);
    users = docDuLieu("users", []);

    // Tạo phòng mẫu nếu chưa có dữ liệu phòng

    if (rooms.length === 0) {
        rooms = [
            {
                id: 1,
                code: "A101",
                name: "Phòng học A101",
                building: "Tòa A",
                capacity: 40,
                status: "Trống"
            },
            {
                id: 2,
                code: "A102",
                name: "Phòng học A102",
                building: "Tòa A",
                capacity: 50,
                status: "Trống"
            }
        ];
    }

    // Tạo tài khoản quản trị viên mặc định

    if (!users.some(function (user) {
        return user.username === "admin";
    })) {
        users.push({
            id: 1,
            username: "admin",
            password: "123456",
            fullName: "Quản trị viên",
            email: "admin@example.com",
            role: "Quản trị viên"
        });
    }

    luuDuLieu();

    hienThiPhong();
    hienThiNguoiDung();
    hienThiYeuCau();
    hienThiLich();
    capNhatThongKe();
    capNhatDanhSachPhong();
}


// ==========================================
// THÀNH VIÊN 1(Quân): ĐĂNG NHẬP
// ==========================================

function xuLyDangNhap() {
    var loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.error("Không tìm thấy form đăng nhập!");
        return;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var username = document.getElementById("username").value.trim();
        var password = document.getElementById("password").value;
        var loginMessage = document.getElementById("loginMessage");

        // Kiểm tra tài khoản trong danh sách người dùng

        var user = users.find(function (item) {
            return item.username === username &&
                   item.password === password;
        });

        if (user) {
            currentUser = user;

            document.getElementById("loginPage").classList.add("hidden");
            document.getElementById("app").classList.remove("hidden");

            document.getElementById("currentUser").textContent =
                user.fullName + " - " + user.role;

            loginMessage.textContent = "";

            loginForm.reset();
            var adminLinks = document.querySelectorAll('.menu-link[data-page="rooms"], .menu-link[data-page="users"], .menu-link[data-page="reports"], .menu-link[data-page="requests"]');
    
            if (currentUser.role === "Người dùng") {
                adminLinks.forEach(link => link.style.display = "none");
            } else {
                adminLinks.forEach(link => link.style.display = "block");
            }

            // Chuyển sang trang chủ sau khi đăng nhập

            hienThiTrang("home");

            capNhatThongKe();

        } else {
            loginMessage.textContent =
                "Tên đăng nhập hoặc mật khẩu không đúng!";
        }
    });
}


// ==========================================
// THÀNH VIÊN 1(Quân): ĐĂNG XUẤT
// ==========================================

function xuLyDangXuat() {
    var logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", function () {
        currentUser = null;

        document.getElementById("app").classList.add("hidden");
        document.getElementById("loginPage").classList.remove("hidden");

        document.getElementById("loginForm").reset();
        document.getElementById("loginMessage").textContent = "";

        // Đưa con trỏ về ô tên đăng nhập

        document.getElementById("username").focus();
    });
}


// ==========================================
// THÀNH VIÊN 1(Quân): SIDEBAR VÀ CHUYỂN TRANG
// ==========================================

function hienThiTrang(pageId) {
    var pages = document.querySelectorAll(".page");
    var links = document.querySelectorAll(".menu-link");

    pages.forEach(function (page) {
        page.classList.add("hidden");
    });

    var pageCanHien = document.getElementById(pageId);

    if (pageCanHien) {
        pageCanHien.classList.remove("hidden");
    }

    links.forEach(function (link) {
        link.classList.remove("active");

        if (link.getAttribute("data-page") === pageId) {
            link.classList.add("active");
        }
    });

    // Cập nhật dữ liệu khi mở từng trang

    if (pageId === "home") {
        capNhatThongKe();
    }

    if (pageId === "rooms") {
        hienThiPhong();
    }

    if (pageId === "booking") {
        capNhatDanhSachPhong();
    }

    if (pageId === "calendar") {
        hienThiLich();
    }

    if (pageId === "requests") {
        hienThiYeuCau();
    }

    if (pageId === "users") {
        hienThiNguoiDung();
    }

    if (pageId === "reports") {
        capNhatThongKe();
    }
}

function xuLyChuyenTrang() {
    var links = document.querySelectorAll(".menu-link");

    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            var pageId = link.getAttribute("data-page");

            hienThiTrang(pageId);
        });
    });
}


// ==========================================
// THÀNH VIÊN 2(Lượng): QUẢN LÝ PHÒNG HỌC
// ==========================================

function hienThiPhong() {
    var tbody = document.querySelector("#roomTable tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    rooms.forEach(function (room) {
        var row = tbody.insertRow();

        row.insertCell().textContent = room.code;
        row.insertCell().textContent = room.name;
        row.insertCell().textContent = room.building;
        row.insertCell().textContent = room.capacity;
        row.insertCell().textContent = room.status;

        var thaoTac = row.insertCell();

        var suaBtn = document.createElement("button");
        suaBtn.textContent = "Sửa";

        suaBtn.addEventListener("click", function () {
            suaPhong(room.id);
        });

        var xoaBtn = document.createElement("button");
        xoaBtn.textContent = "Xóa";
        xoaBtn.className = "delete-btn";

        xoaBtn.addEventListener("click", function () {
            xoaPhong(room.id);
        });

        thaoTac.appendChild(suaBtn);
        thaoTac.appendChild(xoaBtn);
    });
}

function xuLyThemPhong() {
    var addRoomBtn = document.getElementById("addRoomBtn");
    var roomForm = document.getElementById("roomForm");
    var cancelRoomBtn = document.getElementById("cancelRoomBtn");

    addRoomBtn.addEventListener("click", function () {
        roomForm.reset();

        document.getElementById("roomId").value = "";
        document.getElementById("roomFormTitle").textContent =
            "Thêm phòng học";

        document.getElementById("saveRoomBtn").textContent =
            "Thêm phòng";

        roomForm.classList.remove("hidden");
    });

    cancelRoomBtn.addEventListener("click", function () {
        roomForm.reset();
        roomForm.classList.add("hidden");
    });

    roomForm.addEventListener("submit", function (event) {
        event.preventDefault();

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

        // Không cho phép trùng mã phòng

        var trungMa = rooms.some(function (room) {
            return room.code.toLowerCase() === code.toLowerCase() &&
                   String(room.id) !== String(id);
        });

        if (trungMa) {
            alert("Mã phòng đã tồn tại!");
            return;
        }

        if (id !== "") {
            var room = rooms.find(function (item) {
                return String(item.id) === String(id);
            });

            if (room) {
                room.code = code;
                room.name = name;
                room.building = building;
                room.capacity = capacity;
                room.status = status;
            }

            alert("Cập nhật phòng thành công!");
        } else {
            var newId = rooms.length > 0
                ? Math.max.apply(null, rooms.map(function (room) {
                    return Number(room.id) || 0;
                })) + 1
                : 1;

            rooms.push({
                id: newId,
                code: code,
                name: name,
                building: building,
                capacity: capacity,
                status: status
            });

            alert("Thêm phòng thành công!");
        }

        luuDuLieu();
        hienThiPhong();
        capNhatDanhSachPhong();
        capNhatThongKe();

        roomForm.reset();
        roomForm.classList.add("hidden");
    });
}

function suaPhong(id) {
    var room = rooms.find(function (item) {
        return item.id === id;
    });

    if (!room) return;

    document.getElementById("roomId").value = room.id;
    document.getElementById("roomCode").value = room.code;
    document.getElementById("roomName").value = room.name;
    document.getElementById("roomBuilding").value = room.building;
    document.getElementById("roomCapacity").value = room.capacity;
    document.getElementById("roomStatus").value = room.status;

    document.getElementById("roomFormTitle").textContent =
        "Sửa thông tin phòng";

    document.getElementById("saveRoomBtn").textContent = "Lưu thay đổi";

    document.getElementById("roomForm").classList.remove("hidden");
}

function xoaPhong(id) {
    var room = rooms.find(function (item) {
        return item.id === id;
    });

    if (!room) return;

    var coYeuCau = requests.some(function (request) {
        return request.roomId === id && request.status === "Đang chờ";
    });

    if (coYeuCau) {
        alert("Không thể xóa phòng đang có yêu cầu chờ duyệt!");
        return;
    }

    if (confirm("Bạn có chắc muốn xóa phòng " + room.code + "?")) {
        rooms = rooms.filter(function (item) {
            return item.id !== id;
        });

        luuDuLieu();
        hienThiPhong();
        capNhatDanhSachPhong();
        capNhatThongKe();

        alert("Đã xóa phòng!");
    }
}


// ==========================================
// THÀNH VIÊN 3(Duy Linh): DANH SÁCH PHÒNG ĐẶT
// ==========================================

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
        option.textContent =
            room.code + " - " + room.name +
            " (" + room.status + ")";

        roomSelect.appendChild(option);
    });

    if (rooms.some(function (room) {
        return String(room.id) === giaTriCu;
    })) {
        roomSelect.value = giaTriCu;
    }
}


// ==========================================
// THÀNH VIÊN 3(Duy Linh): XỬ LÝ ĐẶT PHÒNG
// ==========================================

function xuLyDatPhong() {
    var bookingForm = document.getElementById("bookingForm");

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

        var room = rooms.find(function (item) {
            return item.id === roomId;
        });

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

        var newId = requests.length > 0
            ? Math.max.apply(null, requests.map(function (item) {
                return Number(item.id) || 0;
            })) + 1
            : 1;

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

        luuDuLieu();
        hienThiYeuCau();
        capNhatThongKe();

        bookingForm.reset();

        alert("Đã gửi yêu cầu đặt phòng thành công!");
    });
}

function layNgayHienTai() {
    var ngay = new Date();
    var nam = ngay.getFullYear();
    var thang = String(ngay.getMonth() + 1).padStart(2, "0");
    var ngayTrongThang = String(ngay.getDate()).padStart(2, "0");

    return nam + "-" + thang + "-" + ngayTrongThang;
}


// ==========================================
// THÀNH VIÊN 4(Công Long): HIỂN THỊ YÊU CẦU ĐẶT PHÒNG
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
// THÀNH VIÊN 4(Công Long): DUYỆT YÊU CẦU
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
    hienThiLich();
    capNhatThongKe();

    alert("Đã duyệt yêu cầu đặt phòng!");
}


// ==========================================
// THÀNH VIÊN 4(Công Long): TỪ CHỐI YÊU CẦU
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
// THÀNH VIÊN 3(Duy Linh): HIỂN THỊ LỊCH HỌC
// ==========================================

function hienThiLich() {
    var tbody = document.querySelector("#calendarTable tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    calendar.sort(function (a, b) {
        if (a.date !== b.date) {
            return a.date.localeCompare(b.date);
        }

        return a.startTime.localeCompare(b.startTime);
    });

    calendar.forEach(function (item) {
        var room = rooms.find(function (r) {
            return r.id === item.roomId;
        });

        var row = tbody.insertRow();

        row.insertCell().textContent = item.date;
        row.insertCell().textContent =
            room ? room.code : (item.roomCode || "Không xác định");

        row.insertCell().textContent = item.startTime;
        row.insertCell().textContent = item.endTime;
        row.insertCell().textContent = item.purpose;
    });

    luuDuLieu();
}


// ==========================================
// THÀNH VIÊN 4(Công Long): QUẢN LÝ NGƯỜI DÙNG
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
// THÀNH VIÊN 5(Đặng Long): THỐNG KÊ TRANG CHỦ VÀ BÁO CÁO
// ==========================================

function capNhatThongKe() {
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

    // Cập nhật trang chủ

    document.getElementById("totalRooms").textContent = tongPhong;
    document.getElementById("usedRooms").textContent = phongDangDung;
    document.getElementById("emptyRooms").textContent = phongTrong;
    document.getElementById("pendingRequests").textContent = yeuCauCho;

    // Cập nhật báo cáo

    document.getElementById("reportTotal").textContent = tongPhong;
    document.getElementById("reportUsed").textContent = phongDangDung;
    document.getElementById("reportEmpty").textContent = phongTrong;
    document.getElementById("reportPending").textContent = yeuCauCho;
}

function xuLyInBaoCao() {
    var printBtn = document.getElementById("printReportBtn");

    printBtn.addEventListener("click", function () {
        window.print();
    });
}


// ==========================================
// PHẦN CHUNG: TÌM KIẾM DỮ LIỆU
// ==========================================

function xuLyTimKiem() {
    var searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", function () {
        var tuKhoa = searchInput.value.trim().toLowerCase();

        var trangDangMo = document.querySelector(".page:not(.hidden)");

        if (!trangDangMo) return;

        var rows = trangDangMo.querySelectorAll("tbody tr");

        rows.forEach(function (row) {
            var noiDung = row.textContent.toLowerCase();

            if (noiDung.includes(tuKhoa)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
}


// ==========================================
// PHẦN CHUNG: KHỞI CHẠY WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Khởi tạo dữ liệu trước khi đăng nhập

    khoiTaoDuLieu();

    // Thành viên 1: đăng nhập và đăng xuất

    xuLyDangNhap();
    xuLyDangXuat();
    xuLyChuyenTrang();

    // Thành viên 2: quản lý phòng học

    xuLyThemPhong();

    // Thành viên 3: đặt phòng

    xuLyDatPhong();

    // Thành viên 1: quản lý người dùng

    xuLyThemNguoiDung();

    // Thành viên 5: báo cáo

    xuLyInBaoCao();

    // Phần chung: tìm kiếm

    xuLyTimKiem();

});

