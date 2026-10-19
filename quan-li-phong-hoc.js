
/* Lấy các phần tử từ HTML */
const roomForm = document.getElementById("roomForm");
const addRoomBtn = document.getElementById("addRoomBtn");
const cancelRoomBtn = document.getElementById("cancelRoomBtn");
const saveRoomBtn = document.getElementById("saveRoomBtn");
const roomFormTitle = document.getElementById("roomFormTitle");
const roomTableBody = document.querySelector("#roomTable tbody");

/* Lấy các ô nhập liệu */
const roomId = document.getElementById("roomId");
const roomCode = document.getElementById("roomCode");
const roomName = document.getElementById("roomName");
const roomBuilding = document.getElementById("roomBuilding");
const roomCapacity = document.getElementById("roomCapacity");
const roomStatus = document.getElementById("roomStatus");

/* Danh sách lưu các phòng học */
let danhSachPhong = [];

/* ID tự tăng của phòng học */
let idTiepTheo = 1;


/* Hiển thị danh sách phòng học */
function hienThiPhong() {
    roomTableBody.innerHTML = "";

    danhSachPhong.forEach(function(phong) {
        let dong = document.createElement("tr");

        dong.innerHTML = `
            <td>${phong.maPhong}</td>
            <td>${phong.tenPhong}</td>
            <td>${phong.toaNha}</td>
            <td>${phong.sucChua}</td>
            <td>${phong.trangThai}</td>
            <td>
                <button type="button" class="edit-btn"
                    onclick="suaPhong(${phong.id})">
                    Sửa
                </button>

                <button type="button" class="delete-btn"
                    onclick="xoaPhong(${phong.id})">
                    Xóa
                </button>
            </td>
        `;

        roomTableBody.appendChild(dong);
    });
}


/* Mở form để thêm phòng mới */
addRoomBtn.addEventListener("click", function() {
    roomForm.reset();

    roomId.value = "";
    roomFormTitle.textContent = "Thêm phòng học";
    saveRoomBtn.textContent = "Thêm phòng";

    roomForm.classList.remove("hidden");
});


/* Thêm phòng hoặc cập nhật phòng khi bấm Lưu */
roomForm.addEventListener("submit", function(event) {
    event.preventDefault();

    let maPhong = roomCode.value.trim();
    let tenPhong = roomName.value.trim();
    let toaNha = roomBuilding.value.trim();
    let sucChua = Number(roomCapacity.value);
    let trangThai = roomStatus.value;

    /* Kiểm tra dữ liệu */
    if (maPhong === "" || tenPhong === "" || toaNha === "") {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (!Number.isInteger(sucChua) || sucChua < 1) {
        alert("Sức chứa phải là số nguyên lớn hơn 0!");
        return;
    }

    /* Kiểm tra mã phòng có bị trùng không */
    let phongTrung = danhSachPhong.find(function(phong) {
        return phong.maPhong.toLowerCase() === maPhong.toLowerCase()
            && phong.id !== Number(roomId.value);
    });

    if (phongTrung) {
        alert("Mã phòng đã tồn tại!");
        return;
    }

    /* Nếu có ID thì cập nhật phòng cũ */
    if (roomId.value !== "") {
        let id = Number(roomId.value);

        let phong = danhSachPhong.find(function(p) {
            return p.id === id;
        });

        if (phong) {
            phong.maPhong = maPhong;
            phong.tenPhong = tenPhong;
            phong.toaNha = toaNha;
            phong.sucChua = sucChua;
            phong.trangThai = trangThai;
        }

        alert("Cập nhật phòng học thành công!");
    } else {
        /* Nếu chưa có ID thì thêm phòng mới */
        let phongMoi = {
            id: idTiepTheo,
            maPhong: maPhong,
            tenPhong: tenPhong,
            toaNha: toaNha,
            sucChua: sucChua,
            trangThai: trangThai
        };

        danhSachPhong.push(phongMoi);
        idTiepTheo++;

        alert("Thêm phòng học thành công!");
    }

    /* Cập nhật bảng và đóng form */
    hienThiPhong();
    roomForm.reset();
    roomId.value = "";
    roomForm.classList.add("hidden");
});


/* Sửa thông tin phòng học */
function suaPhong(id) {
    let phong = danhSachPhong.find(function(p) {
        return p.id === id;
    });

    if (phong) {
        roomId.value = phong.id;
        roomCode.value = phong.maPhong;
        roomName.value = phong.tenPhong;
        roomBuilding.value = phong.toaNha;
        roomCapacity.value = phong.sucChua;
        roomStatus.value = phong.trangThai;

        roomFormTitle.textContent = "Sửa phòng học";
        saveRoomBtn.textContent = "Lưu thay đổi";

        roomForm.classList.remove("hidden");
    }
}


/* Xóa phòng học */
function xoaPhong(id) {
    let xacNhan = confirm("Bạn có chắc chắn muốn xóa phòng học này?");

    if (xacNhan) {
        danhSachPhong = danhSachPhong.filter(function(phong) {
            return phong.id !== id;
        });

        hienThiPhong();
        alert("Đã xóa phòng học!");
    }
}


/* Hủy thao tác thêm hoặc sửa */
cancelRoomBtn.addEventListener("click", function() {
    roomForm.reset();
    roomId.value = "";
    roomForm.classList.add("hidden");
});


/* Hiển thị bảng khi mở trang */
hienThiPhong();
