import express from "express";
import * as store from "../controller/store.js";

const app = express.Router();

// Add Store 
app.post("/add", store.addStore);

// Get All Stores
app.get("/get", store.getAllStores);

export default app;
