import bcrypt from "bcrypt";
import User from "../models/users.js";

const BCRYPT_SALT_ROUNDS = 10;
let lastAuthenticatedUser = null;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).lean();
    const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;
    if (!isPasswordValid) {
      lastAuthenticatedUser = null;
      return res.status(401).json({ message: "Invalid credentials." });
    }

    lastAuthenticatedUser = user;
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

const getLastLogin = (_req, res) => {
  res.status(200).json(lastAuthenticatedUser || null);
};

const register = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS);

    const registerUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      imageUrl: req.body.imageUrl,
      isAdmin: req.body.isAdmin,
    });

    const savedUser = await registerUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};

export { login, getLastLogin, register };
