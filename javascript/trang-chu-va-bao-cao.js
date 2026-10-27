// : THỐNG KÊ TRANG CHỦ VÀ BÁO CÁO

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

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("loginForm")) {
        return;
    }

    capNhatThongKe();
    xuLyInBaoCao();
});
