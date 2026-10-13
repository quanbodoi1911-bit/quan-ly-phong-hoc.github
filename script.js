function showPage(id) {
    var pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");
}

function addRoom() {
    var ma = prompt("Nhập mã phòng:");
    if (ma == null || ma == "") return;

    var ten = prompt("Nhập tên phòng:");
    var toa = prompt("Nhập tòa nhà:");
    var sucChua = prompt("Nhập sức chứa:");

    var table = document.getElementById("roomTable");
    var row = table.insertRow();

    row.innerHTML =
        "<td>" + ma + "</td>" +
        "<td>" + ten + "</td>" +
        "<td>" + toa + "</td>" +
        "<td>" + sucChua + "</td>" +
        "<td>Trống</td>" +
        "<td><button onclick='editRoom(this)'>Sửa</button>" +
        "<button onclick='deleteRoom(this)'>Xóa</button></td>";
}

function editRoom(button) {
    var row = button.parentElement.parentElement;
    var tenMoi = prompt("Nhập tên phòng mới:", row.cells[1].innerText);

    if (tenMoi != null && tenMoi != "") {
        row.cells[1].innerText = tenMoi;
    }
}

function deleteRoom(button) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        button.parentElement.parentElement.remove();
    }
}

function bookingRoom(event) {
    event.preventDefault();
    alert("Gửi yêu cầu đặt phòng thành công!");
}

function approve(button) {
    var row = button.parentElement.parentElement;
    row.cells[2].innerText = "Đã duyệt";
}

function reject(button) {
    var row = button.parentElement.parentElement;
    row.cells[2].innerText = "Từ chối";
}

function addUser() {
    var ten = prompt("Nhập họ tên:");
    if (ten == null || ten == "") return;

    var email = prompt("Nhập email:");
    var ma = "U" + (document.getElementById("userTable").rows.length).toString().padStart(3, "0");

    var table = document.getElementById("userTable");
    var row = table.insertRow();

    row.innerHTML =
        "<td>" + ma + "</td>" +
        "<td>" + ten + "</td>" +
        "<td>" + email + "</td>" +
        "<td>Giảng viên</td>" +
        "<td><button onclick='deleteRoom(this)'>Xóa</button></td>";
}
