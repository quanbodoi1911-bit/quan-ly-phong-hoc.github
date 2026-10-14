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
// THÀNH VIÊN 1: KHỞI TẠO DỮ LIỆU
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
// THÀNH VIÊN 1: ĐĂNG NHẬP
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
        var loginMess
