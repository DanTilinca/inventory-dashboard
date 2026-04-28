import express from "express";
import * as inviteCode from "../controller/inviteCode.js";

const router = express.Router();

// Check Invite Code
router.get("/checkInviteCode/:code", inviteCode.checkInviteCode);

// Add Invite Code
router.post("/addCode", inviteCode.addCode);

// Remove Invite Code
router.delete("/removeCode/:code", inviteCode.removeCode);

// Get All Invite Codes
router.get("/getAllCodes", inviteCode.getAllCodes);

export default router;