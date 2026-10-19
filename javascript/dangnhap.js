// khai bao bien
var rooms = [];
var requests = [];
var calendar = [];
var users = [];
var currentUser = null;

// ĐỌC VÀ LƯU DỮ LIỆU

function docDuLieu(key, macDinh) {
var data = localStorage.getItem(key);

```
if (data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        return macDinh;
    }
}

return macDinh;
```

}

function luuDuLieu() {
localStorage.setItem("rooms", JSON.stringify(rooms));
localStorage.setItem("requests", JSON.stringify(requests));
localStorage.setItem("calendar", JSON.stringify(calendar));
localStorage.setItem("users", JSON.stringify(users));
}

// THÀNH VIÊN 1: KHỞI TẠO DỮ LIỆU

function khoiTaoDuLieu() {
rooms = docDuLieu("rooms", []);
requests = docDuLieu("requests", []);
calendar = docDuLieu("calendar", []);
users = docDuLieu("users", []);

```
// Tạo tài khoản admin nếu chưa có
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

// Tạo mã người dùng tiếp theo
if (users.length === 0) {
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

hienThiNguoiDung();
```

}

// THÀNH VIÊN 1: ĐĂNG NHẬP

function xuLyDangNhap() {
var loginForm = document.getElementById("loginForm");

```
if (!loginForm) {
    return;
}

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value;
    var loginMessage = document.getElementById("loginMessage");

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

        hienThiTrang("home");
        hienThiNguoiDung();

    } else {
        loginMessage.textContent =
            "Tên đăng nhập hoặc mật khẩu không đúng!";
    }
});
```

}
// ĐĂNG XUẤT

function xuLyDangXuat() {
var logoutBtn = document.getElementById("logoutBtn");

```
if (!logoutBtn) {
    return;
}

logoutBtn.addEventListener("click", function () {
    currentUser = null;

    document.getElementById("app").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");

    document.getElementById("loginForm").reset();
    document.getElementById("loginMessage").textContent = "";

    document.getElementById("username").focus();
});
```

}

//THÀNH VIÊN 1: SIDEBAR VÀ CHUYỂN TRANG

function hienThiTrang(pageId) {
var pages = document.querySelectorAll(".page");
var links = document.querySelectorAll(".menu-link");

```
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

if (pageId === "users") {
    hienThiNguoiDung();
}
```

}

function xuLyChuyenTrang() {
var links = document.querySelectorAll(".menu-link");

```
links.forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        var pageId = link.getAttribute("data-page");

        hienThiTrang(pageId);
    });
});
```

}

//  HIỂN THỊ NGƯỜI DÙNG

function hienThiNguoiDung() {
var userTable = document.getElementById("userTable");

```
if (!userTable) {
    return;
}

userTable.innerHTML = "";

users.forEach(function (user, index) {
    var row = document.createElement("tr");

    row.innerHTML =
        "<td>" + (index + 1) + "</td>" +
        "<td>" + anNoiDung(user.username) + "</td>" +
        "<td>" + anNoiDung(user.fullName) + "</td>" +
        "<td>" + anNoiDung(user.email || "") + "</td>" +
        "<td>" + anNoiDung(user.role || "") + "</td>" +
        "<td></td>";

    var cell = row.lastElementChild;

    var editButton = document.createElement("button");
    editButton.textContent = "Sửa";

    editButton.addEventListener("click", function () {
        suaNguoiDung(user.id);
    });

    cell.appendChild(editButton);

    // Không cho xóa tài khoản admin
    if (user.username !== "admin") {
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Xóa";

        deleteButton.addEventListener("click", function () {
            xoaNguoiDung(user.id);
        });

        cell.appendChild(deleteButton);
    }

    userTable.appendChild(row);
});
```

}
// HỖ TRỢ HIỂN THỊ NỘI DUNG AN TOÀN HƠN

function anNoiDung(text) {
var div = document.createElement("div");

```
div.textContent = text == null ? "" : String(text);

return div.innerHTML;
```

}

// ========================================
// THÀNH VIÊN 1: THÊM VÀ SỬA NGƯỜI DÙNG
// ========================================

function xuLyFormNguoiDung() {
var userForm = document.getElementById("userForm");

```
if (!userForm) {
    return;
}

userForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var id = document.getElementById("userId").value;
    var username = document.getElementById("userUsername").value.trim();
    var fullName = document.getElementById("userFullName").value.trim();
    var password = document.getElementById("userPassword").value;
    var email = document.getElementById("userEmail").value.trim();
    var role = document.getElementById("userRole").value;

    if (username === "" || fullName === "") {
        alert("Vui lòng nhập tên đăng nhập và họ tên!");
        return;
    }

    // Kiểm tra tên đăng nhập trùng
    var trungTen = users.some(function (user) {
        return user.username === username &&
               String(user.id) !== id;
    });

    if (trungTen) {
        alert("Tên đăng nhập đã tồn tại!");
        return;
    }

    if (id === "") {
        // Thêm người dùng mới
        if (password === "") {
            alert("Vui lòng nhập mật khẩu!");
            return;
        }

        var newId = 1;

        users.forEach(function (user) {
            if (user.id >= newId) {
                newId = user.id + 1;
            }
        });

        users.push({
            id: newId,
            username: username,
            password: password,
            fullName: fullName,
            email: email,
            role: role
        });

        alert("Thêm người dùng thành công!");

    } else {
        // Cập nhật người dùng
        var user = users.find(function (item) {
            return String(item.id) === id;
        });

        if (user) {
            user.username = username;
            user.fullName = fullName;
            user.email = email;
            user.role = role;

            // Chỉ đổi mật khẩu nếu nhập mật khẩu mới
            if (password !== "") {
                user.password = password;
            }

            // Cập nhật tên hiển thị nếu sửa tài khoản đang đăng nhập
            if (currentUser && currentUser.id === user.id) {
                currentUser = user;

                document.getElementById("currentUser").textContent =
                    user.fullName + " - " + user.role;
            }

            alert("Cập nhật người dùng thành công!");
        }
    }

    luuDuLieu();
    hienThiNguoiDung();
    lamMoiFormNguoiDung();
});
```

}

// ========================================
// THÀNH VIÊN 1: SỬA NGƯỜI DÙNG
// ========================================

function suaNguoiDung(id) {
var user = users.find(function (item) {
return item.id === id;
});

```
if (!user) {
    return;
}

document.getElementById("userId").value = user.id;
document.getElementById("userUsername").value = user.username;
document.getElementById("userFullName").value = user.fullName;
document.getElementById("userPassword").value = "";
document.getElementById("userEmail").value = user.email || "";
document.getElementById("userRole").value = user.role;

document.getElementById("saveUserBtn").textContent = "Lưu thay đổi";

document.getElementById("userPassword").placeholder =
    "Để trống nếu không đổi mật khẩu";
```

}

// ========================================
// THÀNH VIÊN 1: XÓA NGƯỜI DÙNG
// ========================================

function xoaNguoiDung(id) {
var user = users.find(function (item) {
return item.id === id;
});

```
if (!user) {
    return;
}

if (user.username === "admin") {
    alert("Không thể xóa tài khoản admin!");
    return;
}

if (!confirm("Bạn có chắc muốn xóa người dùng này?")) {
    return;
}

users = users.filter(function (item) {
    return item.id !== id;
});

luuDuLieu();
hienThiNguoiDung();

alert("Xóa người dùng thành công!");
```

}

// ========================================
// THÀNH VIÊN 1: LÀM MỚI FORM
// ========================================

function lamMoiFormNguoiDung() {
var userForm = document.getElementById("userForm");

```
if (userForm) {
    userForm.reset();
}

document.getElementById("userId").value = "";
document.getElementById("saveUserBtn").textContent =
    "Thêm người dùng";

document.getElementById("userPassword").placeholder =
    "Nhập mật khẩu";
```

}

function xuLyLamMoiForm() {
var cancelButton = document.getElementById("cancelUserBtn");

```
if (cancelButton) {
    cancelButton.addEventListener("click", function () {
        lamMoiFormNguoiDung();
    });
}
```

}

// ========================================
// KHỞI CHẠY WEBSITE
// ========================================

document.addEventListener("DOMContentLoaded", function () {
khoiTaoDuLieu();

```
xuLyDangNhap();
xuLyDangXuat();
xuLyChuyenTrang();

xuLyFormNguoiDung();
xuLyLamMoiForm();
```

});
