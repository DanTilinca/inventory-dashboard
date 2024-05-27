const Product = require("../models/Product");
const Purchase = require("../models/purchase");
const Sales = require("../models/sales");

// Add Product
const addProduct = (req, res) => {
  console.log("req: ", req.body.userId);
  const addProduct = new Product({
    userID: req.body.userId,
    name: req.body.name,
    category: req.body.category,
    stock: 0,
    description: req.body.description,
  });

  addProduct
    .save()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Products
const getAllProducts = async (req, res) => {
  const findAllProducts = await Product.find({}).sort({ _id: -1 }); // -1 for descending;
  res.json(findAllProducts);
};

// Delete Selected Product
const deleteSelectedProduct = async (req, res) => {
  const deleteProduct = await Product.deleteOne(
    { _id: req.params.id }
  );
  const deletePurchaseProduct = await Purchase.deleteOne(
    { ProductID: req.params.id }
  );

  const deleteSaleProduct = await Sales.deleteOne(
    { ProductID: req.params.id }
  );
  res.json({ deleteProduct, deletePurchaseProduct, deleteSaleProduct });
};

// Update Selected Product
const updateSelectedProduct = async (req, res) => {
  try {
    const updatedResult = await Product.findByIdAndUpdate(
      { _id: req.body.productID },
      {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
      },
      { new: true }
    );
    console.log(updatedResult);
    res.json(updatedResult);
  } catch (error) {
    console.log(error);
    res.status(402).send("Error");
  }
};

// Search Products
const searchProduct = async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const products = await Product.find({
    name: { $regex: searchTerm, $options: "i" },
  });
  res.json(products);
};

// Import Products
const importProducts = async (req, res) => {
  const products = req.body;
  console.log("Received products for import:", products);

  try {
    const result = await Product.insertMany(products);
    res.status(200).send(result);
  } catch (err) {
    console.error("Error inserting products:", err);
    res.status(400).send({ error: "Failed to import products" });
  }
};

// Delete All Products
const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.status(200).send({ message: "All products deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting products", error });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteSelectedProduct,
  updateSelectedProduct,
  searchProduct,
  importProducts,
  deleteAllProducts
};