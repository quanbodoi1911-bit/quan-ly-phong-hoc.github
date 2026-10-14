// ========================================
// THÀNH VIÊN 1: ĐĂNG NHẬP VÀ ĐĂNG XUẤT
// ========================================

var rooms = [];
var requests = [];
var calendar = [];
var users = [];

var nextRoomId = 1;
var nextRequestId = 1;

document.addEventListener("DOMContentLoaded", function () {
    khoiTaoDuLieu();

    var loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var username = document.getElementById("username").value.trim();
        var password = document.getElementById("password").value;
        var message = document.getElementById("loginMessage");

        if (username === "admin" && password === "123456") {
            sessionStorage.setItem("username", "admin");
            sessionStorage.setItem("role", "Quản trị viên");

            message.innerText = "";
            moTrangChu();
        } else {
            message.innerText = "Sai tên đăng nhập hoặc mật khẩu!";
            message.style.color = "red";
        }
    });

    document.getElementById("logoutBtn").addEventListener("click", function () {
        sessionStorage.clear();

        document.getElementById("app").classList.add("hidden");
        document.getElementById("loginPage").classList.remove("hidden");
        document.getElementById("loginForm").reset();
        document.getElementById("loginMessage").innerText = "";
    });

    document.querySelectorAll(".menu-link").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            showPage(link.dataset.page);

            document.querySelectorAll(".menu-link").forEach(function (item) {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });

    ganSuKienPhong();
    ganSuKienDatPhong();
    ganSuKienDuyet();
    ganSuKienNguoiDung();

    document.getElementById("printReportBtn").addEventListener("click", function () {
        window.print();
    });

    document.getElementById("addRoomBtn").addEventListener("click", function () {
        moFormPhong();
    });

    document.getElementById("cancelRoomBtn").addEventListener("click", function () {
        dongFormPhong();
    });

    document.getElementById("addUserBtn").addEventListener("click", function () {
        document.getElementById("userForm").classList.toggle("hidden");
    });

    document.getElementById("cancelUserBtn").addEventListener("click", function () {
        document.getElementById("userForm").reset();
        document.getElementById("userForm").classList.add("hidden");
    });

    document.getElementById("searchInput").addEventListener("input", function () {
        var keyword = this.value.toLowerCase();

        document.querySelectorAll(".page:not(.hidden) tbody tr").forEach(function (row) {
            row.style.display = row.innerText.toLowerCase().includes(keyword)
                ? ""
                : "none";
        });
    });

    if (sessionStorage.getItem("username") === "admin") {
        moTrangChu();
    }
});


// MỞ TRANG CHỦ
function moTrangChu() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("currentUser").innerText = "admin - Quản trị viên";

    showPage("home");
    capNhatThongKe();
}


// CHUYỂN TRANG
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(function (page) {
        page.classList.add("hidden");
    });

    var page = document.getElementById(pageId);

    if (page) {
        page.classList.remove("hidden");
    }
}


// ========================================
// DỮ LIỆU VÀ LƯU TRỮ
// ========================================

function khoiTaoDuLieu() {
    try {
        rooms = JSON.parse(localStorage.getItem("rooms"));
        requests = JSON.parse(localStorage.getItem("requests"));
        calendar = JSON.parse(localStorage.getItem("calendar"));
        users = JSON.parse(localStorage.getItem("users"));
    } catch (error) {
        rooms = null;
        requests = null;
        calendar = null;
        users = null;
    }

    if (!Array.isArray(rooms)) {
        rooms = [
            {
                id: 1,
                code: "A101",
                name: "Phòng A101",
                building: "Tòa A",
                capacity: 50,
                status: "Trống"
            },
            {
                id: 2,
                code: "A102",
                name: "Phòng A102",
                building: "Tòa A",
                capacity: 45,
                status: "Đang sử dụng"
            }
        ];
    }

    if (!Array.isArray(requests)) requests = [];
    if (!Array.isArray(calendar)) calendar = [];

    if (!Array.isArray(users)) {
        users = [
            {
                id: 1,
                username: "admin",
                password: "123456",
                fullName: "Quản trị viên",
                email: "admin@gmail.com",
                role: "Quản trị viên"
            }
        ];
    }

    rooms.forEach(function (room) {
        if (room.id >= nextRoomId) nextRoomId = room.id + 1;
    });

    requests.forEach(function (request) {
        if (request.id >= nextRequestId) nextRequestId = request.id + 1;
    });

    // Bổ sung thông tin cho dữ liệu cũ
    rooms.forEach(function (room) {
        if (!room.code) room.code = "P" + room.id;
        if (!room.building) room.building = "Chưa xác định";
    });

    users.forEach(function (user, index) {
        if (!user.id) user.id = index + 1;
        if (!user.fullName) user.fullName = user.username;
        if (!user.email) user.email = "";
        if (!user.password && user.username === "admin") {
            user.password = "123456";
        }
    });

    luuDuLieu();
    hienThiPhong();
    hienThiYeuCau();
    hienThiLich();
    hienThiNguoiDung();
    updateRoomSelect();
    capNhatThongKe();
}

function luuDuLieu() {
    localStorage.setItem("rooms", JSON.stringify(rooms));
    localStorage.setItem("requests", JSON.stringify(requests));
    localStorage.setItem("calendar", JSON.stringify(calendar));
    localStorage.setItem("users", JSON.stringify(users));
}


// ========================================
// THÀNH VIÊN 2: QUẢN LÝ PHÒNG HỌC
// ========================================

function moFormPhong() {
    document.getElementById("roomForm").reset();
    document.getElementById("roomId").value = "";
    document.getElementById("roomFormTitle").innerText = "Thêm phòng học";
    document.getElementById("saveRoomBtn").innerText = "Thêm phòng";
    document.getElementById("roomForm").classList.remove("hidden");
}

function dongFormPhong() {
    document.getElementById("roomForm").reset();
    document.getElementById("roomId").value = "";
    document.getElementById("roomForm").classList.add("hidden");
}

function ganSuKienPhong() {
    document.getElementById("roomForm").addEventListener("submit", function (event) {
        event.preventDefault();

        var id = document.getElementById("roomId").value;
        var code = document.getElementById("roomCode").value.trim();
        var name = document.getElementById("roomName").value.trim();
        var building = document.getElementById("roomBuilding").value.trim();
        var capacity = Number(document.getElementById("roomCapacity").value);
        var status = document.getElementById("roomStatus").value;

        if (code === "" || name === "" || building === "" || capacity <= 0) {
            alert("Vui lòng nhập đầy đủ thông tin phòng!");
            return;
        }

        var trungMa = rooms.some(function (room) {
            return room.code.toLowerCase() === code.toLowerCase()
                && room.id !== Number(id);
        });

        if (trungMa) {
            alert("Mã phòng đã tồn tại!");
            return;
        }

        if (id !== "") {
            var room = rooms.find(function (item) {
                return item.id === Number(id);
            });

            if (room) {
                room.code = code;
                room.name = name;
                room.building = building;
                room.capacity = capacity;
                room.status = status;
            }
        } else {
            rooms.push({
                id: nextRoomId++,
                code: code,
                name: name,
                building: building,
                capacity: capacity,
                status: status
            });
        }

        luuDuLieu();
        hienThiPhong();
        updateRoomSelect();
        capNhatThongKe();
        dongFormPhong();

        alert(id === "" ? "Đã thêm phòng thành công!" : "Đã cập nhật phòng!");
    });

    document.getElementById("roomTable").addEventListener("click", function (event) {
        var button = event.target.closest("button");
        if (!button) return;

        var id = Number(button.dataset.id);

        if (button.classList.contains("edit-room")) {
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
            document.getElementById("roomFormTitle").innerText = "Sửa phòng học";
            document.getElementById("saveRoomBtn").innerText = "Lưu thay đổi";
            document.getElementById("roomForm").classList.remove("hidden");
        }

        if (button.classList.contains("delete-room")) {
            var confirmed = confirm("Bạn có chắc muốn xóa phòng này không?");
            if (!confirmed) return;

            rooms = rooms.filter(function (item) {
                return item.id !== id;
            });

            // Xóa yêu cầu chưa duyệt liên quan đến phòng đã xóa
            requests = requests.filter(function (request) {
                return request.roomId !== id || request.status !== "Chờ duyệt";
            });

            luuDuLieu();
            hienThiPhong();
            hienThiYeuCau();
            updateRoomSelect();
            capNhatThongKe();
        }
    });
}

function hienThiPhong() {
    var tbody = document.querySelector("#roomTable tbody");
    tbody.innerHTML = "";

    rooms.forEach(function (room) {
        tbody.innerHTML += `
            <tr>
                <td>${room.code}</td>
                <td>${room.name}</td>
                <td>${room.building}</td>
                <td>${room.capacity}</td>
                <td>${room.status}</td>
                <td>
                    <button class="edit-room" data-id="${room.id}">Sửa</button>
                    <button class="delete-btn delete-room" data-id="${room.id}">Xóa</button>
                </td>
            </tr>
        `;
    });
}

function updateRoomSelect() {
    var select = document.getElementById("roomSelect");
    select.innerHTML = "";

    var availableRooms = rooms.filter(function (room) {
        return room.status === "Trống";
    });

    if (availableRooms.length === 0) {
        select.innerHTML = '<option value="">Không có phòng trống</option>';
        return;
    }

    availableRooms.forEach(function (room) {
        select.innerHTML += `
            <option value="${room.id}">
                ${room.code} - ${room.name} (${room.capacity} chỗ)
            </option>
        `;
    });
}


// ========================================
// THÀNH VIÊN 3: ĐẶT PHÒNG
// ========================================

function ganSuKienDatPhong() {
    document.getElementById("bookingForm").addEventListener("submit", function (event) {
        event.preventDefault();

        var roomId = Number(document.getElementById("roomSelect").value);
        var date = document.getElementById("bookingDate").value;
        var startTime = document.getElementById("startTime").value;
        var endTime = document.getElementById("endTime").value;
        var purpose = document.getElementById("purpose").value.trim();

        if (!roomId || !date || !startTime || !endTime || purpose === "") {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (date < layNgayHienTai()) {
            alert("Không thể đặt phòng vào ngày đã qua!");
            return;
        }

        if (startTime >= endTime) {
            alert("Giờ kết thúc phải sau giờ bắt đầu!");
            return;
        }

        var room = rooms.find(function (item) {
            return item.id === roomId;
        });

        if (!room || room.status !== "Trống") {
            alert("Phòng này hiện không thể đặt!");
            return;
        }

        var trungLich = calendar.some(function (item) {
            return item.roomId === roomId
                && item.date === date
                && startTime < item.endTime
                && endTime > item.startTime;
        });

        if (trungLich) {
            alert("Phòng đã có lịch trong thời gian này!");
            return;
        }

        requests.push({
            id: nextRequestId++,
            username: sessionStorage.getItem("username") || "admin",
            roomId: roomId,
            roomCode: room.code,
            roomName: room.name,
            date: date,
            startTime: startTime,
            endTime: endTime,
            purpose: purpose,
            status: "Chờ duyệt"
        });

        luuDuLieu();
        hienThiYeuCau();
        capNhatThongKe();
        this.reset();

        alert("Đã gửi yêu cầu đặt phòng!");
    });
}

function layNgayHienTai() {
    var today = new Date();

    return today.getFullYear() + "-"
        + String(today.getMonth() + 1).padStart(2, "0") + "-"
        + String(today.getDate()).padStart(2, "0");
}


// ========================================
// THÀNH VIÊN 4: DUYỆT YÊU CẦU
// ========================================

function ganSuKienDuyet() {
    document.getElementById("requestTable").addEventListener("click", function (event) {
        var button = event.target.closest("button");
        if (!button) return;

        var id = Number(button.dataset.id);
        var request = requests.find(function (item) {
            return item.id === id;
        });

        if (!request || request.status !== "Chờ duyệt") return;

        if (button.classList.contains("approve-request")) {
            var trungLich = calendar.some(function (item) {
                return item.roomId === request.roomId
                    && item.date === request.date
                    && request.startTime < item.endTime
                    && request.endTime > item.startTime;
            });

            if (trungLich) {
                alert("Không thể duyệt vì phòng đã có lịch trùng!");
                return;
            }

            request.status = "Đã duyệt";

            calendar.push({
                roomId: request.roomId,
                roomCode: request.roomCode,
                roomName: request.roomName,
                date: request.date,
                startTime: request.startTime,
                endTime: request.endTime,
                purpose: request.purpose,
                username: request.username
            });

            luuDuLieu();
            hienThiYeuCau();
            hienThiLich();
            capNhatThongKe();

            alert("Đã duyệt yêu cầu!");
        }

        if (button.classList.contains("reject-request")) {
            request.status = "Từ chối";

            luuDuLieu();
            hienThiYeuCau();
            capNhatThongKe();

            alert("Đã từ chối yêu cầu!");
        }
    });
}

function hienThiYeuCau() {
    var tbody = document.querySelector("#requestTable tbody");
    tbody.innerHTML = "";

    requests.forEach(function (request) {
        var actions = "-";

        if (request.status === "Chờ duyệt") {
            actions = `
                <button class="approve-btn approve-request" data-id="${request.id}">Duyệt</button>
                <button class="delete-btn reject-request" data-id="${request.id}">Từ chối</button>
            `;
        }

        tbody.innerHTML += `
            <tr>
                <td>${request.username}</td>
                <td>${request.roomCode || request.roomName}</td>
                <td>${request.date} (${request.startTime} - ${request.endTime})</td>
                <td>${request.purpose}</td>
                <td class="${request.status === "Chờ duyệt" ? "status-pending" : request.status === "Đã duyệt" ? "status-approved" : "status-rejected"}">${request.status}</td>
                <td>${actions}</td>
            </tr>
        `;
    });
}


// ========================================
// THÀNH VIÊN 3: LỊCH HỌC
// ========================================

function hienThiLich() {
    var tbody = document.querySelector("#calendarTable tbody");
    tbody.innerHTML = "";

    calendar.forEach(function (item) {
        tbody.innerHTML += `
            <tr>
                <td>${item.date}</td>
                <td>${item.roomCode || item.roomName}</td>
                <td>${item.startTime}</td>
                <td>${item.endTime}</td>
                <td>${item.purpose}</td>
            </tr>
        `;
    });
}


// ========================================
// THÀNH VIÊN 1: QUẢN LÝ NGƯỜI DÙNG
// ========================================

function ganSuKienNguoiDung() {
    document.getElementById("userForm").addEventListener("submit", function (event) {
        event.preventDefault();

        var username = document.getElementById("newUsername").value.trim();
        var fullName = document.getElementById("newFullName").value.trim();
        var email = document.getElementById("newEmail").value.trim();
        var role = document.getElementById("newRole").value;
        var password = document.getElementById("newPassword").value;

        if (users.some(function (user) {
            return user.username.toLowerCase() === username.toLowerCase();
        })) {
            alert("Tên đăng nhập đã tồn tại!");
            return;
        }

        users.push({
            id: users.length ? Math.max(...users.map(function (user) {
                return user.id || 0;
            })) + 1 : 1,
            username: username,
            password: password,
            fullName: fullName,
            email: email,
            role: role
        });

        luuDuLieu();
        hienThiNguoiDung();

        this.reset();
        this.classList.add("hidden");

        alert("Đã thêm người dùng!");
    });

    document.getElementById("userTable").addEventListener("click", function (event) {
        var button = event.target.closest(".delete-user");
        if (!button) return;

        var id = Number(button.dataset.id);
        var user = users.find(function (item) {
            return item.id === id;
        });

        if (!user || user.username === "admin") {
            alert("Không thể xóa tài khoản admin!");
            return;
        }

        if (confirm("Bạn có muốn xóa người dùng này không?")) {
            users = users.filter(function (item) {
                return item.id !== id;
            });

            luuDuLieu();
            hienThiNguoiDung();
        }
    });
}

function hienThiNguoiDung() {
    var tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";

    users.forEach(function (user) {
        tbody.innerHTML += `
            <tr>
                <td>U${String(user.id).padStart(3, "0")}</td>
                <td>${user.fullName || user.username}</td>
                <td>${user.email || ""}</td>
                <td>${user.role}</td>
                <td>
                    ${user.username === "admin"
                        ? "-"
                        : `<button class="delete-btn delete-user" data-id="${user.id}">Xóa</button>`}
                </td>
            </tr>
        `;
    });
}


// ========================================
// THÀNH VIÊN 5: THỐNG KÊ VÀ BÁO CÁO
// ========================================

function capNhatThongKe() {
    var total = rooms.length;

    var used = rooms.filter(function (room) {
        return room.status === "Đang sử dụng";
    }).length;

    var empty = rooms.filter(function (room) {
        return room.status === "Trống";
    }).length;

    var pending = requests.filter(function (request) {
        return request.status === "Chờ duyệt";
    }).length;

    ganGiaTri("totalRooms", total);
    ganGiaTri("usedRooms", used);
    ganGiaTri("emptyRooms", empty);
    ganGiaTri("pendingRequests", pending);

    ganGiaTri("reportTotal", total);
    ganGiaTri("reportUsed", used);
    ganGiaTri("reportEmpty", empty);
    ganGiaTri("reportPending", pending);
}

function ganGiaTri(id, value) {
    var element = document.getElementById(id);

    if (element) {
        element.innerText = value;
    }
}
```
