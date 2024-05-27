const express = require("express");
const router = express.Router();
const purchase = require("../controller/purchase");

// Add Purchase
router.post("/add", purchase.addPurchase);

// Get All Purchase Data
router.get("/get", purchase.getPurchaseData);

// Get The Total Purchase Amount
router.get("/get/totalpurchaseamount", purchase.getTotalPurchaseAmount);

// Get Total Purchase Amount in the Last 30 Days
router.get("/get/totalpurchaseamountlast30days", purchase.getTotalPurchaseAmountLast30Days);

// Get number of purchases in the last 30 days
router.get("/get/purchasecountlast30days", purchase.getPurchaseCountLast30Days);

module.exports = router;

// http://localhost:4000/api/purchase/add POST
// http://localhost:4000/api/purchase/get GET
// http://localhost:4000/api/purchase/get/totalpurchaseamount GET
// http://localhost:4000/api/purchase/get/totalpurchaseamountlast30days GET
// http://localhost:4000/api/purchase/get/purchasecountlast30days GET