
/* ==================================================
   WEBSITE QUẢN LÝ PHÒNG HỌC

   THÀNH VIÊN 1:
   Đăng nhập, đăng xuất, chuyển trang, quản lý người dùng.

   THÀNH VIÊN 2:
   Thêm, sửa, xóa phòng học và thống kê phòng.

   THÀNH VIÊN 3:
   Lịch học và đặt phòng.

   THÀNH VIÊN 4:
   Duyệt, từ chối yêu cầu đặt phòng.

   THÀNH VIÊN 5:
   Thống kê, báo cáo và tìm kiếm.
   ================================================== */


/* ==================================================
   THÀNH VIÊN 1: ĐĂNG NHẬP VÀ ĐĂNG XUẤT
   Tài khoản demo: admin
   Mật khẩu demo: 123456
   ================================================== */

var loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value;
    var message = document.getElementById("loginMessage");

    if (username === "admin" && password === "123456") {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("role", "admin");

        openWebsite();
    } else {
        message.innerText = "Tên đăng nhập hoặc mật khẩu không đúng!";
        message.style.color = "red";
    }
});


// HIỂN THỊ WEBSITE SAU KHI ĐĂNG NHẬP
function openWebsite() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    var username = sessionStorage.getItem("username");

    document.getElementById("currentUser").innerText =
        username + " - Quản trị viên";

    showPage("home");

    updateStatistics();
    updateRequestStatistics();
    updateRoomSelect();
}


// KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
window.addEventListener("DOMContentLoaded", function() {
    if (sessionStorage.getItem("username")) {
        openWebsite();
    }

    updateStatistics();
    updateRequestStatistics();
});


// ĐĂNG XUẤT
document.getElementById("logoutBtn").addEventListener("click", function() {
    if (confirm("Bạn có chắc muốn đăng xuất không?")) {
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("role");

        document.getElementById("app").classList.add("hidden");
        document.getElementById("loginPage").classList.remove("hidden");

        document.getElementById("loginForm").reset();
        document.getElementById("loginMessage").innerText = "";
    }
});


/* ==================================================
   THÀNH VIÊN 1: SIDEBAR VÀ CHUYỂN TRANG
   ================================================== */

var menuLinks = document.querySelectorAll(".menu-link");

menuLinks.forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault();

        var pageId = this.getAttribute("data-page");

        showPage(pageId);
    });
});


// HIỂN THỊ TRANG ĐƯỢC CHỌN
function showPage(id) {
    var pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.add("hidden");
    });

    var selectedPage = document.getElementById(id);

    if (selectedPage) {
        selectedPage.classList.remove("hidden");
    }

    menuLinks.forEach(function(link) {
        link.classList.remove("active");

        if (link.getAttribute("data-page") === id) {
            link.classList.add("active");
        }
    });

    document.getElementById("searchInput").value = "";

    resetSearch();
}


/* ==================================================
   THÀNH VIÊN 2: QUẢN LÝ PHÒNG HỌC
   Bao gồm thêm, sửa và xóa phòng.
   ================================================== */

// THÊM PHÒNG
document.getElementById("addRoomBtn").addEventListener("click", function() {
    var ma = prompt("Nhập mã phòng:");

    if (ma === null || ma.trim() === "") {
        return;
    }

    ma = ma.trim();

    var rows = document.querySelectorAll("#roomTable tbody tr");

    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].innerText.toLowerCase() === ma.toLowerCase()) {
            alert("Mã phòng đã tồn tại!");
            return;
        }
    }

    var ten = prompt("Nhập tên phòng:");

    if (ten === null || ten.trim() === "") {
        return;
    }

    var toa = prompt("Nhập tòa nhà:");

    if (toa === null || toa.trim() === "") {
        return;
    }

    var sucChua = prompt("Nhập sức chứa:");

    if (sucChua === null || sucChua.trim() === "" ||
        !Number.isInteger(Number(sucChua)) || Number(sucChua) <= 0) {
        alert("Sức chứa phải là số nguyên dương!");
        return;
    }

    var row = document.querySelector("#roomTable tbody").insertRow();

    addCell(row, ma);
    addCell(row, ten.trim());
    addCell(row, toa.trim());
    addCell(row, sucChua);
    addCell(row, "Trống");

    var cell = row.insertCell();

    var editButton = document.createElement("button");
    editButton.className = "edit-room";
    editButton.innerText = "Sửa";

    var deleteButton = document.createElement("button");
    deleteButton.className = "delete-room";
    deleteButton.innerText = "Xóa";

    cell.appendChild(editButton);
    cell.appendChild(deleteButton);

    updateStatistics();
    updateRoomSelect();

    alert("Thêm phòng thành công!");
});


// SỬA VÀ XÓA PHÒNG BẰNG EVENT DELEGATION
document.querySelector("#roomTable tbody").addEventListener("click", function(event) {
    var button = event.target;

    if (button.classList.contains("delete-room")) {
        var row = button.closest("tr");

        if (confirm("Bạn có chắc muốn xóa phòng này không?")) {
            row.remove();

            updateStatistics();
            updateRoomSelect();
        }
    }

    if (button.classList.contains("edit-room")) {
        editRoom(button);
    }
});


// SỬA THÔNG TIN PHÒNG
function editRoom(button) {
    var row = button.closest("tr");

    var ten = prompt("Nhập tên phòng:", row.cells[1].innerText);

    if (ten === null || ten.trim() === "") {
        return;
    }

    var toa = prompt("Nhập tòa nhà:", row.cells[2].innerText);

    if (toa === null || toa.trim() === "") {
        return;
    }

    var sucChua = prompt("Nhập sức chứa:", row.cells[3].innerText);

    if (sucChua === null || sucChua.trim() === "" ||
        !Number.isInteger(Number(sucChua)) || Number(sucChua) <= 0) {
        alert("Sức chứa phải là số nguyên dương!");
        return;
    }

    var trangThai = prompt(
        "Nhập trạng thái: Trống hoặc Đang sử dụng",
        row.cells[4].innerText
    );

    if (trangThai === null) {
        return;
    }

    if (trangThai !== "Trống" && trangThai !== "Đang sử dụng") {
        alert("Trạng thái không hợp lệ!");
        return;
    }

    row.cells[1].textContent = ten.trim();
    row.cells[2].textContent = toa.trim();
    row.cells[3].textContent = sucChua;
    row.cells[4].textContent = trangThai;

    updateStatistics();
    updateRoomSelect();

    alert("Cập nhật phòng thành công!");
}


// TẠO Ô DỮ LIỆU
function addCell(row, value) {
    var cell = row.insertCell();
    cell.textContent = value;
}


/* ==================================================
   THÀNH VIÊN 3: LỊCH HỌC VÀ ĐẶT PHÒNG
   ================================================== */

// CẬP NHẬT DANH SÁCH PHÒNG TRONG FORM ĐẶT PHÒNG
function updateRoomSelect() {
    var select = document.getElementById("roomSelect");
    var rows = document.querySelectorAll("#roomTable tbody tr");

    select.innerHTML = "";

    rows.forEach(function(row) {
        var ma = row.cells[0].innerText;
        var ten = row.cells[1].innerText;
        var trangThai = row.cells[4].innerText;

        if (trangThai === "Trống") {
            var option = document.createElement("option");

            option.value = ma;
            option.textContent = ma + " - " + ten;

            select.appendChild(option);
        }
    });

    if (select.options.length === 0) {
        var option = document.createElement("option");

        option.value = "";
        option.textContent = "Không có phòng trống";

        select.appendChild(option);
        select.disabled = true;
    } else {
        select.disabled = false;
    }
}


// GỬI YÊU CẦU ĐẶT PHÒNG
document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var room = document.getElementById("roomSelect").value;
    var date = document.getElementById("bookingDate").value;
    var start = document.getElementById("startTime").value;
    var end = document.getElementById("endTime").value;
    var purpose = document.getElementById("purpose").value.trim();

    if (!room) {
        alert("Hiện không có phòng trống!");
        return;
    }

    if (start >= end) {
        alert("Thời gian kết thúc phải sau thời gian bắt đầu!");
        return;
    }

    if (date < new Date().toLocaleDateString("en-CA")) {
        alert("Không thể đặt phòng cho ngày đã qua!");
        return;
    }

    // KIỂM TRA TRÙNG LỊCH ĐÃ ĐƯỢC DUYỆT
    var calendarRows = document.querySelectorAll("#calendarTable tbody tr");

    for (var i = 0; i < calendarRows.length; i++) {
        var row = calendarRows[i];

        var calendarDate = row.cells[0].innerText;
        var calendarRoom = row.cells[1].innerText;
        var calendarStart = row.cells[2].innerText;
        var calendarEnd = row.cells[3].innerText;

        if (calendarDate === date && calendarRoom === room &&
            start < calendarEnd && end > calendarStart) {
            alert("Phòng đã có lịch trong khoảng thời gian này!");
            return;
        }
    }

    // KIỂM TRA TRÙNG VỚI YÊU CẦU ĐANG CHỜ DUYỆT
    var requestRows = document.querySelectorAll("#requestTable tbody tr");

    for (var j = 0; j < requestRows.length; j++) {
        var request = requestRows[j];

        if (request.cells[1].innerText === room &&
            request.cells[4].innerText === "Chờ duyệt") {

            var info = request.cells[2].innerText;
            var parts = info.match(
                /^(\d{4}-\d{2}-\d{2}) \((\d{2}:\d{2}) - (\d{2}:\d{2})\)$/
            );

            if (parts && parts[1] === date &&
                start < parts[3] && end > parts[2]) {
                alert("Đã có yêu cầu đặt phòng trùng thời gian đang chờ duyệt!");
                return;
            }
        }
    }

    var row = document.querySelector("#requestTable tbody").insertRow();

    addCell(row, sessionStorage.getItem("username") || "Người dùng");
    addCell(row, room);
    addCell(row, date + " (" + start + " - " + end + ")");
    addCell(row, purpose);
    addCell(row, "Chờ duyệt");

    var cell = row.insertCell();

    var approveButton = document.createElement("button");
    approveButton.className = "approve-request";
    approveButton.innerText = "Duyệt";

    var rejectButton = document.createElement("button");
    rejectButton.className = "reject-request";
    rejectButton.innerText = "Từ chối";

    cell.appendChild(approveButton);
    cell.appendChild(rejectButton);

    this.reset();

    updateRequestStatistics();

    alert("Gửi yêu cầu đặt phòng thành công!");
});


/* ==================================================
   THÀNH VIÊN 4: DUYỆT VÀ TỪ CHỐI YÊU CẦU
   ================================================== */

document.querySelector("#requestTable tbody").addEventListener("click", function(event) {
    var button = event.target;
    var row = button.closest("tr");

    if (!row) {
        return;
    }

    if (button.classList.contains("approve-request")) {
        approveRequest(row);
    }

    if (button.classList.contains("reject-request")) {
        rejectRequest(row);
    }
});


// DUYỆT YÊU CẦU
function approveRequest(row) {
    if (row.cells[4].innerText !== "Chờ duyệt") {
        alert("Yêu cầu này đã được xử lý!");
        return;
    }

    var room = row.cells[1].innerText;
    var info = row.cells[2].innerText;

    var parts = info.match(
        /^(\d{4}-\d{2}-\d{2}) \((\d{2}:\d{2}) - (\d{2}:\d{2})\)$/
    );

    if (!parts) {
        alert("Thông tin ngày giờ không hợp lệ!");
        return;
    }

    var date = parts[1];
    var start = parts[2];
    var end = parts[3];

    // KIỂM TRA LỊCH ĐÃ DUYỆT CÓ BỊ TRÙNG KHÔNG
    var calendarRows = document.querySelectorAll("#calendarTable tbody tr");

    for (var i = 0; i < calendarRows.length; i++) {
        var calendar = calendarRows[i];

        if (calendar.cells[0].innerText === date &&
            calendar.cells[1].innerText === room &&
            start < calendar.cells[3].innerText &&
            end > calendar.cells[2].innerText) {
            alert("Không thể duyệt vì lịch phòng bị trùng!");
            return;
        }
    }

    row.cells[4].textContent = "Đã duyệt";

    // THÊM LỊCH HỌC SAU KHI DUYỆT
    var calendarBody = document.querySelector("#calendarTable tbody");
    var newCalendarRow = calendarBody.insertRow();

    addCell(newCalendarRow, date);
    addCell(newCalendarRow, room);
    addCell(newCalendarRow, start);
    addCell(newCalendarRow, end);
    addCell(newCalendarRow, row.cells[3].innerText);

    updateRequestStatistics();

    alert("Đã duyệt yêu cầu đặt phòng!");
}


// TỪ CHỐI YÊU CẦU
function rejectRequest(row) {
    if (row.cells[4].innerText !== "Chờ duyệt") {
        alert("Yêu cầu này đã được xử lý!");
        return;
    }

    if (confirm("Bạn có chắc muốn từ chối yêu cầu này không?")) {
        row.cells[4].textContent = "Từ chối";

        updateRequestStatistics();

        alert("Đã từ chối yêu cầu đặt phòng!");
    }
}


/* ==================================================
   THÀNH VIÊN 1: QUẢN LÝ NGƯỜI DÙNG
   ================================================== */

// THÊM NGƯỜI DÙNG
document.getElementById("addUserBtn").addEventListener("click", function() {
    var ten = prompt("Nhập họ tên:");

    if (ten === null || ten.trim() === "") {
        return;
    }

    var email = prompt("Nhập email:");

    if (email === null || email.trim() === "") {
        return;
    }

    email = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Email không hợp lệ!");
        return;
    }

    var rows = document.querySelectorAll("#userTable tbody tr");

    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[2].innerText.toLowerCase() === email.toLowerCase()) {
            alert("Email đã tồn tại!");
            return;
        }
    }

    var ma = "U" + String(Date.now()).slice(-6);

    var row = document.querySelector("#userTable tbody").insertRow();

    addCell(row, ma);
    addCell(row, ten.trim());
    addCell(row, email);
    addCell(row, "Người dùng");

    var cell = row.insertCell();

    var deleteButton = document.createElement("button");
    deleteButton.className = "delete-user";
    deleteButton.innerText = "Xóa";

    cell.appendChild(deleteButton);

    alert("Thêm người dùng thành công!");
});


// XÓA NGƯỜI DÙNG
document.querySelector("#userTable tbody").addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-user")) {
        var row = event.target.closest("tr");

        if (confirm("Bạn có chắc muốn xóa người dùng này không?")) {
            row.remove();
        }
    }
});


/* ==================================================
   THÀNH VIÊN 5: THỐNG KÊ VÀ BÁO CÁO
   ================================================== */

// CẬP NHẬT SỐ LƯỢNG PHÒNG
function updateStatistics() {
    var rows = document.querySelectorAll("#roomTable tbody tr");

    var total = rows.length;
    var used = 0;
    var empty = 0;

    rows.forEach(function(row) {
        var status = row.cells[4].innerText;

        if (status === "Đang sử dụng") {
            used++;
        }

        if (status === "Trống") {
            empty++;
        }
    });

    document.getElementById("totalRooms").innerText = total;
    document.getElementById("usedRooms").innerText = used;
    document.getElementById("emptyRooms").innerText = empty;

    document.getElementById("reportTotal").innerText = total;
    document.getElementById("reportUsed").innerText = used;
    document.getElementById("reportEmpty").innerText = empty;
}


// CẬP NHẬT SỐ YÊU CẦU CHỜ DUYỆT
function updateRequestStatistics() {
    var rows = document.querySelectorAll("#requestTable tbody tr");
    var pending = 0;

    rows.forEach(function(row) {
        if (row.cells[4].innerText === "Chờ duyệt") {
            pending++;
        }
    });

    document.getElementById("pendingRequests").innerText = pending;
    document.getElementById("reportPending").innerText = pending;
}


// IN BÁO CÁO
document.getElementById("printReportBtn").addEventListener("click", function() {
    window.print();
});


/* ==================================================
   THÀNH VIÊN 5: TÌM KIẾM DỮ LIỆU
   Tìm kiếm trong bảng của trang đang mở.
   ================================================== */

document.getElementById("searchInput").addEventListener("input", function() {
    var keyword = this.value.toLowerCase().trim();

    var activePage = document.querySelector(".page:not(.hidden)");

    if (!activePage) {
        return;
    }

    var rows = activePage.querySelectorAll("tbody tr");

    rows.forEach(function(row) {
        var text = row.innerText.toLowerCase();

        if (text.includes(keyword)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});


// KHÔI PHỤC HIỂN THỊ CÁC DÒNG KHI CHUYỂN TRANG
function resetSearch() {
    var rows = document.querySelectorAll("tbody tr");

    rows.forEach(function(row) {
        row.style.display = "";
    });
}
```
