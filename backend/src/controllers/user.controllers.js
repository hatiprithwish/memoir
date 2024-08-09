import { User } from "../models/user.models.js";

export const fetchUser = async (req, res) => {
  try {
    const { userId, username } = req.body;

    let dbUser = await User.findOne({ userId: userId });
    if (!dbUser) {
      dbUser = await User.create({ userId, username });
    }

    return res.status(200).json(dbUser);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to fetch user: ${error.message}` });
  }
};
