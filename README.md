# Gear Store Website

## Công nghệ sử dụng
Frontend: HTML5 (Semantic Web), CSS3 (Flexbox/Grid layout, Glassmorphism design), Vanilla JS (ES6+, DOM Manipulation, Async/Await Fetch API).  
Backend: Node.js, Express Framework (RESTful API Design).  
Database: MongoDB Atlas, Mongoose ODM (Kiểm soát dữ liệu bằng Schema chặt chẽ).  
Cấu hình & Bảo mật: Dotenv (Ẩn kết nối URI & khóa JWT), JWT Token (Header Authorization).  
Kiểm thử & Quản trị: Postman, Git & GitHub.  

## Cài đặt & Chạy thử
Tải dự án từ GitHub về máy tính hoặc sử dụng lệnh Git Clone:  
`git clone https://github.com/[username]/gear-store-website-main.git`  
`cd gear-store-website-main`  

Di chuyển vào thư mục `server/`, tạo mới một tệp tin tên là `.env` (bảo đảm tệp này nằm cùng cấp với `server.js`) và dán nội dung cấu hình sau:  
`PORT=5000`  
`MONGO_URI=mongodb://worgzek:123@ac-4cdhvby-shard-00-00.symoeix.mongodb.net:27017,ac-4cdhvby-shard-00-01.symoeix.mongodb.net:27017,ac-4cdhvby-shard-00-02.symoeix.mongodb.net:27017/?ssl=true&replicaSet=atlas-4pz3vj-shard-0&authSource=admin&appName=Cluster0`  
`JWT_SECRET=mysecretkey`  

Chuỗi kết nối Database trực tuyến đã được thiết lập mở khóa IP Whitelist `0.0.0.0/0`, có thể chạy thử ngay mà không bị chặn tường lửa.  

Mở Terminal trong thư mục `server/` và chạy tuần tự các lệnh sau:  
`cd server`  
`npm install`  
`npm run dev`  

Khi Terminal xuất hiện thông báo:  
`Server dang chay tai port 5000`  
`Ket noi Mongodb thanh cong`  
Hệ thống đã sẵn sàng kết nối.  

Mở trình duyệt bất kỳ (Khuyến nghị: Google Chrome) và truy cập địa chỉ:  
`http://localhost:5000`  

## Ghi chú
- Đảm bảo đã cài đặt Node.js và npm trên máy.  
- Sử dụng Postman để kiểm thử các API.  
- Quản lý mã nguồn bằng Git & GitHub để dễ dàng cộng tác.  

