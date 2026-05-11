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

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Tìm user để check quyền
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

module.exports = router;