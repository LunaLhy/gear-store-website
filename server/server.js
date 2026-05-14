require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');

const app = express();
app.use(express.json());

// --- CẤU HÌNH THƯ MỤC FILE TĨNH (SỬA Ở ĐÂY) ---
app.use(express.static(path.join(__dirname, '../client'))); // Gánh CSS, JS, Images
app.use(express.static(path.join(__dirname, '../client/pages'))); // Gánh tất cả file HTML trong thư mục pages

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/users', authRoutes);

// Định tuyến trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages', 'index.html'));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Ket noi Mongodb thanh cong"))
  .catch((err) => console.error("Error connection:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server dang chay tai port ${PORT}`);
});