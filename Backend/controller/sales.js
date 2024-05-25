const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");

// Add Sales
const addSales = (req, res) => {
  const addSale = new Sales({
    userID: req.body.userID,
    ProductID: req.body.productID,
    StoreID: req.body.storeID,
    StockSold: req.body.stockSold,
    SaleDate: new Date(req.body.saleDate),
    TotalSaleAmount: req.body.totalSaleAmount,
    PricePerUnit: req.body.pricePerUnit,
  });

  addSale
    .save()
    .then((result) => {
      soldStock(req.body.productID, req.body.stockSold);
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Sales Data
const getSalesData = async (req, res) => {
  const findAllSalesData = await Sales.find({})
    .sort({ _id: -1 })
    .populate("ProductID")
    .populate("StoreID"); // -1 for descending order
  res.json(findAllSalesData);
};

// Get total sales amount
const getTotalSalesAmount = async (req, res) => {
  let totalSaleAmount = 0;
  const salesData = await Sales.find({});
  salesData.forEach((sale) => {
    totalSaleAmount += sale.TotalSaleAmount;
  });
  res.json({ totalSaleAmount });
};

// Get total sales amount in the last 30 days
const getTotalSalesAmountLast30Days = async (req, res) => {
  const date30DaysAgo = new Date();
  date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

  const salesData = await Sales.find({
    SaleDate: { $gte: date30DaysAgo },
  });

  let totalSaleAmount = 0;
  salesData.forEach((sale) => {
    totalSaleAmount += sale.TotalSaleAmount;
  });

  res.json({ totalSaleAmount });
};

// Get monthly sales in the last 12 months
const getMonthlySales = async (req, res) => {
  try {
    const date12MonthsAgo = new Date();
    date12MonthsAgo.setMonth(date12MonthsAgo.getMonth() - 12);

    const sales = await Sales.find({
      SaleDate: { $gte: date12MonthsAgo },
    });

    const salesAmount = new Array(12).fill(0);

    sales.forEach((sale) => {
      const saleDate = new Date(sale.SaleDate);
      const monthDiff = (new Date().getFullYear() - saleDate.getFullYear()) * 12 + new Date().getMonth() - saleDate.getMonth();
      
      if (monthDiff >= 0 && monthDiff < 12) {
        salesAmount[11 - monthDiff] += sale.TotalSaleAmount; // Store amounts in reverse order
      }
    });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get number of sales in the last 30 days
const getSalesCountLast30Days = async (req, res) => {
  try {
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

    const salesCount = await Sales.countDocuments({
      SaleDate: { $gte: date30DaysAgo },
    });

    res.status(200).json({ salesCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addSales, getMonthlySales, getSalesData, getTotalSalesAmount, getTotalSalesAmountLast30Days, getSalesCountLast30Days };
