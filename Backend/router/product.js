const express = require("express");
const app = express();
const product = require("../controller/product");

// Add Product
app.post("/add", product.addProduct);

// Get All Products
app.get("/get", product.getAllProducts);

// Delete Selected Product Item
app.get("/delete/:id", product.deleteSelectedProduct);

// Update Selected Product
app.post("/update", product.updateSelectedProduct);

// Search Product
app.get("/search", product.searchProduct);

// Import Products
app.post("/import", product.importProducts);

// http://localhost:4000/api/product/search?searchTerm=fa

module.exports = app;
