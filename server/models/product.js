const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: String, required: true },
    images: [String],  
    price: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    category: { type: String, required: true },    
    countInStock: { type: Number, required: true, default: 0 },
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Product', ProductSchema);
