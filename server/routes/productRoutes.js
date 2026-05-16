const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const User = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Ban chua dang nhap" });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);        
        const user = await User.findById(decoded.id);

        if (user && user.isAdmin) {
            const product = new Product(req.body);
            const createdProduct = await product.save();
            res.status(201).json(createdProduct);
        } else {
            res.status(403).json({ message: "khong co quyen" });
        }

    } catch (error) {
        res.status(401).json({ message: "Token khong hop le" });
    }
});

router.get('/', async (req, res) => {
    try {
        const { keyword, category, brand } = req.query;
        let query = {};

        if (keyword && keyword.trim() !== "") {
            const cleanKeyword = keyword.trim();
            const regexPattern = cleanKeyword.split(/\s+/).join('|');
            
            query.name = { 
                $regex: regexPattern, 
                $options: 'i' 
            };
        }

        if (category) {
            query.category = category;
        }
        if (brand) {
            query.brand = brand;
        }

        const products = await Product.find(query);
        res.json(products);

    } catch (error) {
        res.status(500).json({ message: "error" });
    }
});
//GET /api/products/:id 
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Khong tim thay san pham"
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Khong the load chi tiet san pham"
    });
  }
});

//PUT /api/products/:id
router.put('/:id', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Chua dang nhap" });
        }
        const token = authHeader.split(' ')[1];

        // 2. Giải mã token để lấy ID người dùng
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Tìm user trong DB và check isAdmin
        const user = await User.findById(decoded.id);

        if (user && user.isAdmin) {
            // 4. Nếu là Admin, tiến hành tìm và cập nhật bằng ID lấy từ URL (req.params.id)
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id, 
                req.body, 
                { new: true } // Tham số này để MongoDB trả về data MỚI SAU KHI SỬA
            );

            if (updatedProduct) {
                res.json(updatedProduct);
            } else {
                res.status(404).json({ message: "Khong tim thay san pham" });
            }
        } else {
            res.status(403).json({ message: "Ban khong co quyen sua san pham" });
        }

    } catch (error) {
        res.status(401).json({ message: "Token khong hop le" });
    }
});

//DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Chua dang nhap" });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);        
        const user = await User.findById(decoded.id);

        if (user && user.isAdmin) {
            const deletedProduct = await Product.findByIdAndDelete(req.params.id);

            if (deletedProduct) {
                res.json({ message: "Da xoa thanh cong" });
            } else {
                res.status(404).json({ message: "Khong tim thay san pham" });
            }
        } else {
            res.status(403).json({ message: "Ban khong co quyen xoa san pham" });
        }

    } catch (error) {
        res.status(401).json({ message: "Token khong hop le" });
    }
});
module.exports = router;