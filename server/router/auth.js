import express from "express";
import * as auth from "../controller/auth.js";

const router = express.Router();

router.post("/login", auth.login);
router.get("/login", auth.getLastLogin);
router.post("/register", auth.register);

export default router;
