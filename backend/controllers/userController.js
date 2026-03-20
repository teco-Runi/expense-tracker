import User from "../models/User.js"; // your Mongoose user model
import bcrypt from "bcryptjs";

// REGISTER CONTROLLER
export const registerControllers = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "Email already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userToReturn = { ...newUser._doc };
    delete userToReturn.password;

    res.status(201).json({ success: true, message: "User registered successfully", user: userToReturn });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN CONTROLLER
export const loginControllers = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const userToReturn = { ...user._doc };
    delete userToReturn.password;

    res.status(200).json({ success: true, message: "Login successful", user: userToReturn });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};