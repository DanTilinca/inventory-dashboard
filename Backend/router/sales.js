const express = require("express");
const router = express.Router();
const sales = require("../controller/sales");

// Add Sales
router.post("/add", sales.addSales);

// Get All Sales
router.get("/get", sales.getSalesData);

// Get Monthly Sales
router.get("/getmonthly", sales.getMonthlySales);

// Get Total Sales Amount
router.get("/get/totalsaleamount", sales.getTotalSalesAmount);

// Get Total Sales Amount in the Last 30 Days
router.get("/get/totalsaleamountlast30days", sales.getTotalSalesAmountLast30Days);

// Get number of sales in the last 30 days
router.get("/get/salescountlast30days", sales.getSalesCountLast30Days);

module.exports = router;

// http://localhost:4000/api/sales/add POST
// http://localhost:4000/api/sales/get GET
// http://localhost:4000/api/sales/getmonthly GET
// http://localhost:4000/api/sales/get/totalsaleamount GET
// http://localhost:4000/api/sales/get/totalsaleamountlast30days GET
// http://localhost:4000/api/sales/get/salescountlast30days GET
