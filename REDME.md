# Hệ thống chấm công bằng mã QR  
# 📖 Giới thiệu  
Hệ thống chấm công bằng mã QR là một dự án cuối kỳ môn Phát triển dự án phần mềm, được thiết kế để cung cấp một giải pháp chấm công hiện đại, tiện lợi và chính xác cho các tổ chức. Thay vì sử dụng các phương pháp chấm công truyền thống, hệ thống này tận dụng công nghệ mã QR để tối ưu hóa quy trình chấm công, giúp quản lý thời gian làm việc của nhân viên một cách hiệu quả.  

# Mục tiêu của dự án:  
Cung cấp một giải pháp chấm công nhanh chóng, chính xác và giảm thiểu sai sót.  
Tối ưu hóa quy trình quản lý thời gian làm việc của nhân viên.  
Tạo báo cáo chấm công chi tiết, giúp quản lý dễ dàng theo dõi và đánh giá.  
Nâng cao trải nghiệm người dùng thông qua giao diện trực quan và thân thiện.  
  
# ✨ Tính năng chính  
Chức năng chung:  
>  Đăng nhập/Đăng ký: Cho phép người dùng đăng nhập vào hệ thống để truy cập các chức năng tương ứng.  
  Quản lý tài khoản người dùng: Admin có thể quản lý thông tin tài khoản người dùng (thêm, sửa, xóa).  
  Quản lý loại hợp đồng: Định nghĩa và quản lý các loại hợp đồng lao động khác nhau.  
  Quản lý loại nghỉ phép: Định nghĩa và quản lý các loại hình nghỉ phép (nghỉ ốm, nghỉ phép năm, v.v.).    

Admin (Phân hệ Admin):  
>  Quản lý người dùng: Thêm, sửa, xóa, xem chi tiết thông tin tài khoản người dùng.  
  Quản lý hợp đồng: Quản lý thông tin hợp đồng của nhân viên.  
  Quản lý loại nghỉ phép: Quản lý các loại nghỉ phép và quy định liên quan.  
  Quản lý lương: Cấu hình và quản lý các thông tin liên quan đến lương, bảo hiểm.  

HRM (Phân hệ Quản lý Nhân sự):  
>  Quản lý phòng ban: Thêm, sửa, xóa, xem chi tiết thông tin phòng ban.  
  Quản lý nhân viên: Thêm, sửa, xóa, xem chi tiết thông tin nhân viên (bao gồm vị trí, trình độ học vấn, lịch làm việc).  
  Quản lý hợp đồng: Quản lý hợp đồng của từng nhân viên.  

EM (Phân hệ Nhân viên):  
>  Thông tin cá nhân: Xem và cập nhật thông tin cá nhân.  
  Bảng lương: Xem chi tiết bảng lương.  
  Tạm ứng: Yêu cầu tạm ứng lương.  
  Quản lý nghỉ phép: Xem số ngày nghỉ phép còn lại, tạo đơn xin nghỉ phép.  

Payroll (Phân hệ Bảng lương):  
>  Quản lý lương: Tính toán và quản lý bảng lương cho từng nhân viên.  
  Tạm ứng: Xử lý các yêu cầu tạm ứng lương.
  Quản lý bảo hiểm: Quản lý thông tin bảo hiểm của nhân viên.  

PR (Phân hệ Quan hệ công chúng):  
>  Thông tin cá nhân: Quản lý thông tin cá nhân của nhân viên.  
  Danh sách nghỉ phép: Xem danh sách các đơn xin nghỉ phép.  
  Điểm danh: Thực hiện chấm công.  
  Danh sách công việc: Xem danh sách các công việc được giao.  

Mobile App (Flutter):  
>  Chấm công bằng QR Code: Tính năng cốt lõi cho phép nhân viên chấm công bằng cách quét mã QR.
  Xem thông tin cá nhân: Truy cập thông tin cá nhân.  
  Xem lịch sử chấm công: Theo dõi lịch sử chấm công của bản thân.  
  Gửi đơn xin nghỉ phép: Tạo và gửi đơn xin nghỉ phép trực tiếp từ ứng dụng.  
  Xem bảng lương: Xem bảng lương trên thiết bị di động.  
  
# 🛠️ Công nghệ sử dụng  
Dự án được xây dựng với kiến trúc đa nền tảng, sử dụng các công nghệ hiện đại để đảm bảo hiệu suất và khả năng mở rộng.  
  
Frontend (Web):  
>    React.js: Thư viện JavaScript để xây dựng giao diện người dùng tương tác.  
    Bootstrap: Framework CSS để thiết kế giao diện nhanh chóng và responsive.  
    Axios: Client HTTP để gọi API backend.  
    React Router DOM: Để quản lý routing trong ứng dụng React.  
    Sass: Bộ tiền xử lý CSS mạnh mẽ.  
    Các thư viện khác: @popperjs/core, @react-oauth/google, animate.css, aos, ``body-parser,cors`, `emailjs-com`, `express`, `fs`, `localforage`,`match-sorter`, `nodemailer`, `react-bootstrap`, `react-icons`, `sort-by`, `swiper`.  

Backend (API):  
>    Laravel (PHP): Framework PHP mạnh mẽ để xây dựng API RESTful.  
    RESTful API: Giao tiếp giữa frontend và backend.  
    Laravel Sanctum: Để xác thực API nhẹ và an toàn.
    Axios: Client HTTP cho các yêu cầu backend.
    Vite: Công cụ build frontend nhanh chóng.
    Các thư viện khác: @tailwindcss/forms, alpinejs, autoprefixer, laravel-vite-plugin, postcss, tailwindcss.

Mobile App:
>    Flutter: Framework UI của Google để xây dựng ứng dụng di động đa nền tảng (Android, iOS).
    Dio: Client HTTP mạnh mẽ cho Flutter để gọi API.
    Shared Preferences: Để lưu trữ dữ liệu cục bộ.
    Provider: Để quản lý trạng thái.
    Các thư viện khác: intl, carousel_slider, smooth_page_indicator, cupertino_icons, url_launcher, http, path_provider, json_annotation.  

Cơ sở dữ liệu:
>    MySQL: Hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở.

# ⚙️ Yêu cầu hệ thống  
Để cài đặt và chạy dự án này, bạn cần có các công cụ và phiên bản sau:

>  Node.js: v22.15.0  
  npm: v10.9.2  
  PHP: v8.2.12  
  Composer: v2.4.6  
  MySQL: v9.1.10
  XAMPP/WampServer: WampServer 3.3.7 (đã bao gồm Apache, MySQL, PHP) 
  phpMyAdmin: v5.2.1  
  Visual Studio Code: v1.100.2 hoặc cao hơn  
  Flutter SDK: Phiên bản tương thích với các dependencies trong pubspec.yaml  
  Android Studio / Xcode (tùy chọn, để chạy ứng dụng mobile trên emulator/thiết bị thật)  

# 🚀 Hướng dẫn cài đặt và chạy dự án  
Hãy làm theo các bước dưới đây để thiết lập và chạy dự án trên máy cục bộ.  
  
1. Sao chép dự án  
>  git clone https://github.com/ph5725/nhom1_hethong_quanlynhansu  
  cd nhom1_hethong_quanlynhansu  
  
2. Cài đặt Backend (Laravel)  
>  Di chuyển vào thư mục backend  
    cd backend  
  Cài đặt các dependencies của Composer  
    composer install  
  Tạo file .env từ .env.example  
    cp .env.example .env  
  Tạo key cho ứng dụng Laravel  
    php artisan key:generate  
  Cấu hình cơ sở dữ liệu trong file .env  
    DB_CONNECTION=mysql  
    DB_HOST=127.0.0.1  
    DB_PORT=3306  
    DB_DATABASE=hethong_quanlynhansu  
    DB_USERNAME=root  
    DB_PASSWORD=  
  Chạy migrate để tạo các bảng trong cơ sở dữ liệu  
    php artisan migrate  
  Chạy seeders để thêm dữ liệu mẫu  
    php artisan db:seed  
  Chạy server Laravel  
    php artisan serve  
  
3. Cài đặt Frontend (React)  
>  Di chuyển vào thư mục frontend  
    cd frontend  
  Cài đặt các dependencies của npm  
    npm install  
  Tạo file .env.local  
  REACT_APP_API_URL=http://localhost:8000/api  
  Chạy ứng dụng React  
    npm start  
  
4. Cài đặt Mobile App (Flutter)  
>  Di chuyển vào thư mục mobile app  
    cd mobile  
  Lấy các dependencies của Flutter  
    flutter pub get  
  Cấu hình URL API trong code Flutter  
  Đảm bảo URL API trỏ đến backend Laravel  
  Chạy ứng dụng Flutter  
    flutter run  
  
# 🤝 Đóng góp  
Dự án này là một bài tập cuối kỳ, vì vậy việc đóng góp từ bên ngoài không được khuyến khích trong giai đoạn hiện tại.   
Tuy nhiên, nếu bạn có bất kỳ ý tưởng hoặc đề xuất cải tiến nào, xin vui lòng liên hệ với nhóm phát triển.  
  
# 👥 Nhóm thành viên  
  Dự án được phát triển bởi nhóm sinh viên:  
>    Phùng Cẩm Hồng (Nhóm trưởng)  
    Trần Trung Dũng  
    Nguyễn Mai Hữu Nhân  
    Nguyễn Trọng Tín  
     
Giáo viên hướng dẫn: Thầy Trương Bá Thái  
  
📧 Liên hệ  
Nếu có bất kỳ câu hỏi hoặc cần hỗ trợ, xin vui lòng liên hệ với nhóm trưởng qua email: camhongphung050725@gmail.com  

📄 Giấy phép  
Dự án này được phát triển cho mục đích học tập và không có giấy phép công khai.  
