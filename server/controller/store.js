import Store from "../models/store.js";

// Add Store
const addStore = async (req, res) => {
  try {
    console.log(req.body);
    const addStore = new Store({
      userID: req.body.userId,
      name: req.body.name,
      category: req.body.category,
      address: req.body.address,
      city: req.body.city,
      image: req.body.image,
    });

    const result = await addStore.save();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get All Stores
const getAllStores = async (req, res) => {
  try {
    const findAllStores = await Store.find({}).sort({ _id: -1 }); // -1 for descending;
    res.json(findAllStores);
  } catch (err) {
    res.status(500).send(err);
  }
};

export { addStore, getAllStores };
