import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: 'String',
    lastName : 'String',
    email: 'String',
    password: 'String',
    phoneNumber: 'Number',
    imageUrl: 'String',
    isAdmin: { type: 'Boolean', default: false },
});

const User = mongoose.models.users || mongoose.model("users", UserSchema);
export default User;