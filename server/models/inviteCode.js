import mongoose from "mongoose";

const InviteCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
      },
});

const InviteCode = mongoose.models.inviteCodes || mongoose.model("inviteCodes", InviteCodeSchema);
export default InviteCode;