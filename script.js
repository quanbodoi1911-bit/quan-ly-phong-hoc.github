```javascript
// ==========================================
// THÀNH VIÊN 1: ĐĂNG NHẬP, ĐĂNG XUẤT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    var loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.error("Không tìm thấy loginForm trong index.html");
        return;
    }

    // Đăng nhập
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var username = document.getElementById("username").value.trim();
        var password = document.getElementById("password").value;
        var message = document.getElementById("loginMessage");

        if (username === "admin" && password === "123456") {
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("role", "admin");

            moTrangChu();
            message.innerText = "";
        } else {
            message.innerText = "Sai tên đăng nhập hoặc mật khẩu!";
            message.style.color = "red";
        }
    });

    // Giữ trạng thái đăng nhập trong phiên hiện tại
    if (sessionStorage.getItem("username") === "admin") {
        moTrangChu();
    }

    // Đăng xuất
    var logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            sessionStorage.clear();

            document.getElementById("app").classList.add("hidden");
            document.getElementById("loginPage").classList.remove("hidden");

            loginForm.reset();

            var message = document.getElementById("loginMessage");
            if (message) {
                message.innerText = "";
            }
        });
    }

    // Chuyển trang bằng menu
    var menuLinks = document.querySelectorAll(".menu-link");

    menuLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            var pageId = link.getAttribute("data-page");
            showPage(pageId);

            menuLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });

    // Khởi tạo dữ liệu
    khoiTaoDuLieu();
});


// Mở trang chủ sau khi đăng nhập
function moTrangChu() {
    var loginPage = document.getElementById("loginPage");
    var app = document.getElementById("app");
    var currentUser = document.getElementById("currentUser");

    if (loginPage) {
        loginPage.classList.add("hidden");
    }

    if (app) {
        app.classList.remove("hidden");
    }

    if (currentUser) {
        currentUser.innerText = "admin - Quản trị viên";
    }

    showPage("home");
    updateStatistics();
    updateRequestStatistics();
    updateRoomSelect();
}


// Chuyển trang
function showPage(pageId) {
    var pages = document.querySelectorAll(".page");

    pages.forEach(function (page) {
        page.classList.add("hidden");
    });

    var selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.remove("hidden");
    }
}


// ==========================================
// DỮ LIỆU LƯU TRONG TRÌNH DUYỆT
// ==========================================

var rooms = [];
var requests = [];
var calendar = [];
var users = [
    {
        username: "admin",
        role: "Quản trị viên"
    }
];

var nextRoomId = 1;
var nextRequestId = 1;


// Khởi tạo dữ liệu ban đầu
function khoiTaoDuLieu() {
    // Lấy dữ liệu phòng đã lưu
    try {
        rooms = JSON.parse(localStorage.getItem("rooms")) || [];
        requests = JSON.parse(localStorage.getItem("requests")) || [];
        calendar = JSON.parse(localStorage.getItem("calendar")) || [];
        users = JSON.parse(localStorage.getItem("users")) || users;
    } catch (error) {
        rooms = [];
        requests = [];
        calendar = [];
    }

    // Xác định mã tiếp theo
    rooms.forEach(function (room) {
        if (room.id >= nextRoomId) {
            nextRoomId = room.id + 1;
        }
    });

    requests.forEach(function (request) {
        if (request.id >= nextRequestId) {
            nextRequestId = request.id + 1;
        }
    });

    hienThiPhong();
    hienThiYeuCau();
    hienThiLich();
    hienThiNguoiDung();

    updateStatistics();
    updateRequestStatistics();
    updateRoomSelect();

    ganSuKienPhong();
    ganSuKienDatPhong();
    ganSuKienDuyet();
    ganSuKienNguoiDung();
    ganSuKienBaoCao();
}


// Lưu dữ liệu vào trình duyệt
function luuDuLieu() {
    localStorage.setItem("rooms", JSON.stringify(rooms));
    localStorage.setItem("requests", JSON.stringify(requests));
    localStorage.setItem("calendar", JSON.stringify(calendar));
    localStorage.setItem("users", JSON.stringify(users));
}


// ==========================================
// THÀNH VIÊN 2: QUẢN LÝ PHÒNG HỌC
// ==========================================

function ganSuKienPhong() {
    var roomForm = document.getElementById("roomForm");

    if (roomForm) {
        roomForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var roomId = document.getElementById("roomId").value;
            var roomName = document.getElementById("roomName").value.trim();
            var roomCapacity = Number(
                document.getElementById("roomCapacity").value
            );
            var roomStatus = document.getElementById("roomStatus").value;

            if (roomName === "" || roomCapacity <= 0) {
                alert("Vui lòng nhập thông tin phòng hợp lệ!");
                return;
            }

            if (roomId !== "") {
                var room = rooms.find(function (item) {
                    return item.id === Number(roomId);
                });

                if (room) {
                    room.name = roomName;
                    room.capacity = roomCapacity;
                    room.status = roomStatus;
                }
            } else {
                rooms.push({
                    id: nextRoomId++,
                    name: roomName,
                    capacity: roomCapacity,
                    status: roomStatus
                });
            }

            luuDuLieu();
            hienThiPhong();
            updateStatistics();
            updateRoomSelect();

            roomForm.reset();
            document.getElementById("roomId").value = "";
            document.getElementById("saveRoomBtn").innerText = "Thêm phòng";
        });
    }

    var roomTable = document.getElementById("roomTable");

    if (roomTable) {
        roomTable.addEventListener("click", function (event) {
            var id = Number(event.target.dataset.id);

            if (event.target.classList.contains("edit-room")) {
                var room = rooms.find(function (item) {
                    return item.id === id;
                });

                if (room) {
                    document.getElementById("roomId").value = room.id;
                    document.getElementById("roomName").value = room.name;
                    document.getElementById("roomCapacity").value =
                        room.capacity;
                    document.getElementById("roomStatus").value = room.status;
                    document.getElementById("saveRoomBtn").innerText =
                        "Lưu thay đổi";
                }
            }

            if (event.target.classList.contains("delete-room")) {
                var confirmed = confirm("Bạn có muốn xóa phòng này không?");

                if (confirmed) {
                    rooms = rooms.filter(function (item) {
                        return item.id !== id;
                    });

                    luuDuLieu();
                    hienThiPhong();
                    updateStatistics();
                    updateRoomSelect();
                }
            }
        });
    }
}


// Hiển thị danh sách phòng
function hienThiPhong() {
    var roomTable = document.getElementById("roomTable");

    if (!roomTable) return;

    roomTable.innerHTML = "";

    rooms.forEach(function (room) {
        roomTable.innerHTML += `
            <tr>
                <td>${room.id}</td>
                <td>${room.name}</td>
                <td>${room.capacity}</td>
                <td>${room.status}</td>
                <td>
                    <button class="edit-room" data-id="${room.id}">
                        Sửa
                    </button>
                    <button class="delete-btn delete-room" data-id="${room.id}">
                        Xóa
                    </button>
                </td>
            </tr>
        `;
    });
}


// Cập nhật danh sách phòng trong form đặt phòng
function updateRoomSelect() {
    var roomSelect = document.getElementById("roomSelect");

    if (!roomSelect) return;

    roomSelect.innerHTML = "";

    var availableRooms = rooms.filter(function (room) {
        return room.status === "Trống";
    });

    if (availableRooms.length === 0) {
        roomSelect.innerHTML = '<option value="">Không có phòng trống</option>';
        return;
    }

    availableRooms.forEach(function (room) {
        roomSelect.innerHTML += `
            <option value="${room.id}">
                ${room.name} - ${room.capacity} chỗ
            </option>
        `;
    });
}


// ==========================================
// THÀNH VIÊN 3: ĐẶT PHÒNG HỌC
// ==========================================

function ganSuKienDatPhong() {
    var bookingForm = document.getElementById("bookingForm");

    if (!bookingForm) return;

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var roomId = Number(document.getElementById("roomSelect").value);
        var date = document.getElementById("bookingDate").value;
        var startTime = document.getElementById("startTime").value;
        var endTime = document.getElementById("endTime").value;
        var purpose = document.getElementById("purpose").value.trim();

        if (!roomId || !date || !startTime || !endTime || !purpose) {
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

        // Kiểm tra trùng lịch với các yêu cầu đã được duyệt
        var trungLich = calendar.some(function (item) {
            return item.roomId === roomId &&
                item.date === date &&
                startTime < item.endTime &&
                endTime > item.startTime;
        });

        if (trungLich) {
            alert("Phòng đã có lịch trong khoảng thời gian này!");
            return;
        }

        requests.push({
            id: nextRequestId++,
            username: sessionStorage.getItem("username") || "admin",
            roomId: roomId,
            roomName: room.name,
            date: date,
            startTime: startTime,
            endTime: endTime,
            purpose: purpose,
            status: "Chờ duyệt"
        });

        luuDuLieu();
        hienThiYeuCau();
        updateRequestStatistics();

        bookingForm.reset();

        alert("Đã gửi yêu cầu đặt phòng!");
    });
}


// Lấy ngày hiện tại theo giờ địa phương
function layNgayHienTai() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, "0");
    var day = String(today.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}


// ==========================================
// THÀNH VIÊN 4: DUYỆT YÊU CẦU ĐẶT PHÒNG
// ==========================================

function ganSuKienDuyet() {
    var requestTable = document.getElementById("requestTable");

    if (!requestTable) return;

    requestTable.addEventListener("click", function (event) {
        var id = Number(event.target.dataset.id);

        if (event.target.classList.contains("approve-request")) {
            var request = requests.find(function (item) {
                return item.id === id;
            });

            if (!request || request.status !== "Chờ duyệt") {
                return;
            }

            var trungLich = calendar.some(function (item) {
                return item.roomId === request.roomId &&
                    item.date === request.date &&
                    request.startTime < item.endTime &&
                    request.endTime > item.startTime;
            });

            if (trungLich) {
                alert("Không thể duyệt vì phòng đã có lịch trùng!");
                return;
            }

            request.status = "Đã duyệt";

            calendar.push({
                requestId: request.id,
                roomId: request.roomId,
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
            updateRequestStatistics();

            alert("Đã duyệt yêu cầu!");
        }

        if (event.target.classList.contains("reject-request")) {
            var rejectRequest = requests.find(function (item) {
                return item.id === id;
            });

            if (rejectRequest && rejectRequest.status === "Chờ duyệt") {
                rejectRequest.status = "Từ chối";

                luuDuLieu();
                hienThiYeuCau();
                updateRequestStatistics();

                alert("Đã từ chối yêu cầu!");
            }
        }
    });
}


// Hiển thị yêu cầu đặt phòng
function hienThiYeuCau() {
    var requestTable = document.getElementById("requestTable");

    if (!requestTable) return;

    requestTable.innerHTML = "";

    requests.forEach(function (request) {
        var actions = "";

        if (request.status === "Chờ duyệt") {
            actions = `
                <button class="approve-btn approve-request"
                    data-id="${request.id}">Duyệt</button>
                <button class="delete-btn reject-request"
                    data-id="${request.id}">Từ chối</button>
            `;
        } else {
            actions = "-";
        }

        requestTable.innerHTML += `
            <tr>
                <td>${request.username}</td>
                <td>${request.roomName}</td>
                <td>${request.date}</td>
                <td>${request.startTime} - ${request.endTime}</td>
                <td>${request.purpose}</td>
                <td>${request.status}</td>
                <td>${actions}</td>
            </tr>
        `;
    });
}


// ==========================================
// THÀNH VIÊN 3: LỊCH SỬ SỬ DỤNG PHÒNG
// ==========================================

function hienThiLich() {
    var calendarTable = document.getElementById("calendarTable");

    if (!calendarTable) return;

    calendarTable.innerHTML = "";

    calendar.forEach(function (item) {
        calendarTable.innerHTML += `
            <tr>
                <td>${item.roomName}</td>
                <td>${item.date}</td>
                <td>${item.startTime}</td>
                <td>${item.endTime}</td>
                <td>${item.purpose}</td>
                <td>${item.username}</td>
            </tr>
        `;
    });
}


// ==========================================
// THÀNH VIÊN 1: QUẢN LÝ NGƯỜI DÙNG
// ==========================================

function ganSuKienNguoiDung() {
    var userForm = document.getElementById("userForm");

    if (userForm) {
        userForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var username = document.getElementById("newUsername")
                .value.trim();
            var role = document.getElementById("newRole").value;

            if (username === "") {
                alert("Vui lòng nhập tên người dùng!");
                return;
            }

            var daTonTai = users.some(function (user) {
                return user.username.toLowerCase() === username.toLowerCase();
            });

            if (daTonTai) {
                alert("Tên người dùng đã tồn tại!");
                return;
            }

            users.push({
                username: username,
                role: role
            });

            luuDuLieu();
            hienThiNguoiDung();
            userForm.reset();

            alert("Đã thêm người dùng!");
        });
    }

    var userTable = document.getElementById("userTable");

    if (userTable) {
        userTable.addEventListener("click", function (event) {
            if (!event.target.classList.contains("delete-user")) {
                return;
            }

            var username = event.target.dataset.username;

            if (username === "admin") {
                alert("Không thể xóa tài khoản admin!");
                return;
            }

            users = users.filter(function (user) {
                return user.username !== username;
            });

            luuDuLieu();
            hienThiNguoiDung();
        });
    }
}


// Hiển thị người dùng
function hienThiNguoiDung() {
    var userTable = document.getElementById("userTable");

    if (!userTable) return;

    userTable.innerHTML = "";

    users.forEach(function (user) {
        userTable.innerHTML += `
            <tr>
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>
                    ${
                        user.username === "admin"
                            ? "-"
                            : `<button class="delete-btn delete-user"
                                data-username="${user.username}">Xóa</button>`
                    }
                </td>
            </tr>
        `;
    });
}


// ==========================================
// THÀNH VIÊN 5: THỐNG KÊ
// ==========================================

function updateStatistics() {
    var total = rooms.length;

    var used = rooms.filter(function (room) {
        return room.status === "Đang sử dụng";
    }).length;

    var empty = total - used;

    ganGiaTri("totalRooms", total);
    ganGiaTri("usedRooms", used);
    ganGiaTri("emptyRooms", empty);

    ganGiaTri("reportTotal", total);
    ganGiaTri("reportUsed", used);
    ganGiaTri("reportEmpty", empty);
}


// Đếm yêu cầu đang chờ duyệt
function updateRequestStatistics() {
    var pending = requests.filter(function (request) {
        return request.status === "Chờ duyệt";
    }).length;

    ganGiaTri("pendingRequests", pending);
    ganGiaTri("reportPending", pending);
}


// Gán giá trị cho phần tử HTML
function ganGiaTri(id, value) {
    var element = document.getElementById(id);

    if (element) {
        element.innerText = value;
    }
}


// Nút in báo cáo
function ganSuKienBaoCao() {
    var printButton = document.getElementById("printReportBtn");

    if (printButton) {
        printButton.addEventListener("click", function () {
            window.print();
        });
    }
}
```
