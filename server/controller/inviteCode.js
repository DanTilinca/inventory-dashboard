import InviteCode from "../models/inviteCode.js";

// Check Invite Code
const checkInviteCode = async (req, res) => {
  try {
    const code = req.params.code;
    const inviteCode = await InviteCode.findOne({ code: code });

    if (inviteCode) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (err) {
    res.status(500).json({ valid: false, message: err.message });
  }
};

// Add Invite Code
const addCode = async (req, res) => {
    const code = req.body.code;
    const inviteCode = new InviteCode({ code: code });

    try {
        await inviteCode.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Remove Invite Code
const removeCode = async (req, res) => {
    const code = req.params.code;

    try {
        await InviteCode.deleteOne({ code: code });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get All Invite Codes
const getAllCodes = async (req, res) => {
    try {
        const allCodes = await InviteCode.find().sort({ _id: -1 }); // -1 for descending
        res.json(allCodes);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export {
  checkInviteCode,
  addCode,
  removeCode,
  getAllCodes,
};