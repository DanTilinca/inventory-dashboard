const Purchase = require("../models/purchase");
const purchaseStock = require("./purchaseStock");

// Add Purchase Details
const addPurchase = (req, res) => {
  const addPurchaseDetails = new Purchase({
    userID: req.body.userID,
    ProductID: req.body.productID,
    QuantityPurchased: req.body.quantityPurchased,
    PurchaseDate: new Date(req.body.purchaseDate),
    TotalPurchaseAmount: req.body.totalPurchaseAmount,
    PricePerUnit: req.body.pricePerUnit,
  });

  addPurchaseDetails
    .save()
    .then((result) => {
      purchaseStock(req.body.productID, req.body.quantityPurchased);
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Purchase Data
const getPurchaseData = async (req, res) => {
  const findAllPurchaseData = await Purchase.find({})
    .sort({ _id: -1 })
    .populate("ProductID"); // -1 for descending order
  res.json(findAllPurchaseData);
};

// Get total purchase amount
const getTotalPurchaseAmount = async (req, res) => {
  let totalPurchaseAmount = 0;
  const purchaseData = await Purchase.find({});
  purchaseData.forEach((purchase) => {
    totalPurchaseAmount += purchase.TotalPurchaseAmount;
  });
  res.json({ totalPurchaseAmount });
};

// Get total purchase amount in the last 30 days
const getTotalPurchaseAmountLast30Days = async (req, res) => {
  const date30DaysAgo = new Date();
  date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

  const purchaseData = await Purchase.find({
    PurchaseDate: { $gte: date30DaysAgo },
  });

  let totalPurchaseAmount = 0;
  purchaseData.forEach((purchase) => {
    totalPurchaseAmount += purchase.TotalPurchaseAmount;
  });

  res.json({ totalPurchaseAmount });
};

// Get number of purchases in the last 30 days
const getPurchaseCountLast30Days = async (req, res) => {
  try {
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

    const purchaseCount = await Purchase.countDocuments({
      PurchaseDate: { $gte: date30DaysAgo },
    });

    res.status(200).json({ purchaseCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount, getTotalPurchaseAmountLast30Days, getPurchaseCountLast30Days };
