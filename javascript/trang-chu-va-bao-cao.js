// : THỐNG KÊ TRANG CHỦ VÀ BÁO CÁO
//
// Cách dùng:
// - Trong script.js: xóa 2 hàm capNhatThongKe() và xuLyInBaoCao() cũ,
//   dán toàn bộ hàm bên dưới vào chỗ đó (KHÔNG cần dán đoạn "TỰ CHẠY" ở cuối).
// - Khi tách file: để nguyên file này, gắn vào trang trang-chu.html và bao-cao.html.

// Đọc một danh sách từ localStorage (lỗi hoặc chưa có thì trả về danh sách rỗng)
function docDanhSach(key) {
    try {
        var data = JSON.parse(localStorage.getItem(key));

        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

// Đếm số phần tử có trạng thái cho trước
function demTheoTrangThai(danhSach, trangThai) {
    return danhSach.filter(function (item) {
        return item.status === trangThai;
    }).length;
}

// Ghi số vào phần tử có id (không có phần tử thì bỏ qua, không báo lỗi)
function ghiSo(id, giaTri) {
    var element = document.getElementById(id);

    if (element) {
        element.textContent = giaTri;
    }
}

function capNhatThongKe() {
    var phong = docDanhSach("rooms");
    var yeuCau = docDanhSach("requests");
    var lich = docDanhSach("calendar");

    var tongPhong = phong.length;
    var phongDangDung = demTheoTrangThai(phong, "Đang sử dụng");
    var phongTrong = demTheoTrangThai(phong, "Trống");
    var phongBaoTri = demTheoTrangThai(phong, "Bảo trì");
    var yeuCauCho = demTheoTrangThai(yeuCau, "Đang chờ");

    // Trang chủ
    ghiSo("totalRooms", tongPhong);
    ghiSo("usedRooms", phongDangDung);
    ghiSo("emptyRooms", phongTrong);
    ghiSo("pendingRequests", yeuCauCho);

    // Báo cáo
    ghiSo("reportTotal", tongPhong);
    ghiSo("reportUsed", phongDangDung);
    ghiSo("reportEmpty", phongTrong);
    ghiSo("reportPending", yeuCauCho);

    ghiSo("reportMaintenance", phongBaoTri);
    ghiSo("reportRequests", yeuCau.length);
    ghiSo("reportApproved", demTheoTrangThai(yeuCau, "Đã duyệt"));
    ghiSo("reportRejected", demTheoTrangThai(yeuCau, "Đã từ chối"));
    ghiSo("reportCalendar", lich.length);

    ghiSo("reportDate", new Date().toLocaleDateString("vi-VN"));
}

function xuLyInBaoCao() {
    var printBtn = document.getElementById("printReportBtn");

    if (printBtn) {
        printBtn.onclick = function () {
            window.print();
        };
    }
}

// TỰ CHẠY: chỉ dùng khi file này đứng riêng (trang không có form đăng nhập).
// Trong index.html đã có DOMContentLoaded của script.js nên đoạn này tự bỏ qua.
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("loginForm")) {
        return;
    }

    capNhatThongKe();
    xuLyInBaoCao();
});
