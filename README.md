Gear Store là một ứng dụng web Full-Stack hoàn chỉnh được phát triển trên kiến trúc Client-Server truyền thống. Hệ thống hướng đến mục tiêu giải quyết nhu cầu trao đổi, mua sắm và tự đăng ký thanh lý các thiết bị Gaming Gear (bàn phím, chuột, tai nghe chuyên dụng...) đã qua sử dụng của cộng đồng game thủ.
Mục tiêu kỹ thuật đạt được:
Kiến trúc phân rã: Tách biệt rõ ràng luồng xử lý giao diện (Client) và logic xử lý nghiệp vụ (Server API).
Xác thực phi trạng thái: Áp dụng tiêu chuẩn công nghiệp mã hóa JWT (JSON Web Token) để kiểm soát phiên đăng nhập và phân quyền (Admin/User).
Quản trị dữ liệu đám mây: Kết nối, đồng bộ dữ liệu thời gian thực lên hệ quản trị NoSQL MongoDB Atlas trực tuyến.

___CÔNG NGHỆ SỬ DỤNG (TECH STACK)___
Frontend: HTML5 (Semantic Web), CSS3 (Flexbox/Grid layout, Glassmorphism design), Vanilla JS (ES6+, DOM Manipulation, Async/Await Fetch API).

Backend: Node.js, Express Framework (RESTful API Design).

Database: MongoDB Atlas, Mongoose ODM (Kiểm soát dữ liệu bằng Schema chặt chẽ).

Cấu hình & Bảo mật: Dotenv (Ẩn kết nối URI & khóa JWT), JWT Token (Header Authorization).

Kiểm thử & Quản trị: Postman, Git & GitHub.

____CÀI ĐẶT & CHẠY THỬ___

Bước 1: Chuẩn bị mã nguồn

Tải dự án từ GitHub về máy tính hoặc sử dụng lệnh Git Clone:

git clone https://github.com/[username]/gear-store-website-main.git

cd gear-store-website-main


Bước 2: Tạo tệp cấu hình bảo mật .env

Di chuyển vào thư mục server/, tạo mới một tệp tin tên là .env (bảo đảm tệp này nằm cùng cấp với server.js) và dán nội dung cấu hình sau:

PORT=5000
MONGO_URI=mongodb://worgzek:123@ac-4cdhvby-shard-00-00.symoeix.mongodb.net:27017,ac-4cdhvby-shard-00-01.symoeix.mongodb.net:27017,ac-4cdhvby-shard-00-02.symoeix.mongodb.net:27017/?ssl=true&replicaSet=atlas-4pz3vj-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=mysecretkey

(Lưu ý: Chuỗi kết nối Database trực tuyến đã được thiết lập mở khóa IP Whitelist 0.0.0.0/0, có thể chạy thử ngay mà không bị chặn tường lửa).

Bước 3: Cài đặt thư viện và Khởi chạy hệ thống

Mở Terminal trong thư mục server/ và chạy tuần tự các lệnh sau:

# Di chuyển vào thư mục server

cd server

# Cài đặt các thư viện Node modules cần thiết

npm install

# Chạy máy chủ ở chế độ phát triển (sử dụng nodemon)

npm run dev

Khi Terminal xuất hiện thông báo:

Server dang chay tai port 5000

Ket noi Mongodb thanh cong

Hệ thống đã sẵn sàng kết nối.

Bước 4: Truy cập ứng dụng

Mở trình duyệt bất kỳ (Khuyến nghị: Google Chrome) và truy cập địa chỉ:

http://localhost:5000


____HẠN CHẾ & HƯỚNG PHÁT TRIỂN___

Hạn chế hiện tại: Để bảo đảm tính đơn giản trong kết nối đồ án cơ sở, hệ thống hiện lưu trữ mật khẩu người dùng dưới dạng chuỗi thô (Plain-text) trực tiếp trong cơ sở dữ liệu và tải ảnh sản phẩm bằng liên kết URL ngoài.

Hướng phát triển: Tích hợp thư viện bcrypt để băm mật khẩu bảo mật tuyệt đối, xây dựng trang thanh toán kết nối API của ví MoMo/VNPAY và nhúng thư viện Multer + Cloudinary hỗ trợ tải ảnh trực tiếp từ thiết bị lên đám mây.
