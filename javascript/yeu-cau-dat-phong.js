document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.getElementById("bookingForm");
    const alertBox = document.getElementById("alertBox");

    // Đặt ngày tối thiểu cho input date là ngày hôm nay
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("bookingDate").setAttribute("min", today);

    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Lấy dữ liệu từ form
        const roomCode = document.getElementById("roomCode").value;
        const bookingDate = document.getElementById("bookingDate").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;
        const requesterName = document.getElementById("requesterName").value.trim();
        const purpose = document.getElementById("purpose").value.trim();

        // 1. Kiểm tra thời gian bắt đầu phải nhỏ hơn thời gian kết thúc
        if (startTime >= endTime) {
            showAlert("Thời gian kết thúc phải sau thời gian bắt đầu!", "error");
            return;
        }

        // 2. Lấy danh sách lịch hiện có từ LocalStorage
        const existingSchedules = JSON.parse(localStorage.getItem("roomSchedules")) || [];

        // 3. Kiểm tra xung đột / trùng lịch
        const isConflicted = existingSchedules.some(schedule => {
            if (schedule.roomCode === roomCode && schedule.bookingDate === bookingDate && schedule.status !== "Rejected") {
                const existStart = schedule.startTime;
                const existEnd = schedule.endTime;
                
                return (startTime < existEnd && endTime > existStart);
            }
            return false;
        });

        if (isConflicted) {
            showAlert(`Phòng ${roomCode} đã có lịch sử dụng trong khoảng thời gian này (${startTime} - ${endTime}). Vui lòng chọn giờ khác!`, "error");
            return;
        }

        // 4. Tạo đối tượng đặt phòng mới
        const newBooking = {
            id: "BK_" + Date.now(),
            roomCode: roomCode,
            bookingDate: bookingDate,
            startTime: startTime,
            endTime: endTime,
            requesterName: requesterName,
            purpose: purpose,
            status: "Pending", // Trạng thái mặc định: Chờ duyệt
            createdAt: new Date().toISOString()
        };

        // 5. Lưu vào LocalStorage
        existingSchedules.push(newBooking);
        localStorage.setItem("roomSchedules", JSON.stringify(existingSchedules));

        // 6. Thông báo thành công & Reset Form
        showAlert("Gửi yêu cầu đặt phòng thành công! Lịch của bạn đang chờ phê duyệt.", "success");
        bookingForm.reset();
    });

    function showAlert(message, type) {
        alertBox.textContent = message;
        alertBox.className = `alert-message ${type === "error" ? "alert-error" : "alert-success"}`;
        alertBox.style.display = "block";

        setTimeout(() => {
            alertBox.style.display = "none";
        }, 5000);
    }
});