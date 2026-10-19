
/* =====================================
   1. KHOI TAO DU LIEU PHONG
   ===================================== */

var rooms = [];

function docDuLieu() {
    try {
        var data = localStorage.getItem("rooms");

        if (data) {
            rooms = JSON.parse(data);
        }
    } catch (error) {
        rooms = [];
    }

    if (!Array.isArray(rooms) || rooms.length === 0) {
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
            },
            {
                id: 3,
                code: "A108",
                name: "Phòng học A108",
                building: "A4",
                capacity: 100,
                status: "Trống"
            }
        ];

        luuDuLieu();
    }
}

function luuDuLieu() {
    localStorage.setItem("rooms", JSON.stringify(rooms));
}


/* =====================================
   2. HIEN THI DANH SACH PHONG
   ===================================== */

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


/* =====================================
   3. THEM VA SUA PHONG
   ===================================== */

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
        var capacity = Number(
            document.getElementById("roomCapacity").value
        );
        var status = document.getElementById("roomStatus").value;

        if (capacity <= 0) {
            alert("Sức chứa phải lớn hơn 0!");
            return;
        }

        var trungMa = rooms.some(function (room) {
            return room.code.toLowerCase() === code.toLowerCase()
                && String(room.id) !== id;
        });

        if (trungMa) {
            alert("Mã phòng đã tồn tại!");
            return;
        }

        if (id !== "") {
            var room = rooms.find(function (item) {
                return String(item.id) === id;
            });

            if (!room) return;

            room.code = code;
            room.name = name;
            room.building = building;
            room.capacity = capacity;
            room.status = status;

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

        roomForm.reset();
        roomForm.classList.add("hidden");
    });
}


/* =====================================
   4. SUA THONG TIN PHONG
   ===================================== */

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
    document.getElementById("saveRoomBtn").textContent =
        "Lưu thay đổi";

    document.getElementById("roomForm").classList.remove("hidden");
}


/* =====================================
   5. XOA PHONG
   ===================================== */

function xoaPhong(id) {
    var room = rooms.find(function (item) {
        return item.id === id;
    });

    if (!room) return;

    if (confirm("Bạn có chắc muốn xóa phòng " + room.code + "?")) {
        rooms = rooms.filter(function (item) {
            return item.id !== id;
        });

        luuDuLieu();
        hienThiPhong();

        alert("Đã xóa phòng!");
    }
}


/* =====================================
   6. KHOI CHAY CHUONG TRINH
   ===================================== */

document.addEventListener("DOMContentLoaded", function () {
    docDuLieu();
    hienThiPhong();
    xuLyThemPhong();
});
