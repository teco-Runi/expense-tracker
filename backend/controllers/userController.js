import User from "../models/User.js"; // make sure your User model is correct

export const setAvatarController = async (req, res) => {
  try {
    const { userId, avatarImage } = req.body;

    if (!userId || !avatarImage) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.avatarImage = avatarImage;
    await user.save();

    return res.json({ isSet: true, avatarImage: user.avatarImage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};