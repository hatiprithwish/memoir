import { User } from "../models/user.models.js";

export const getUser = async (req, res) => {
  try {
    const clerkUser = await clerkClient.users.getUser(req.auth.userId);
    const dbUser = await User.findOne({ userId: clerkUser.id });

    if (!dbUser) {
      dbUser = await User.create({
        userId: clerkUser.id,
        username: clerkUser.username,
        email: clerkUser.primaryEmailAddress,
        avatar: clerkUser.imageUrl,
      });
    }

    return res.status(200).json(dbUser);
  } catch (error) {
    console.error(`Failed to fetch user: ${error.message}`);
    return res
      .status(500)
      .json({ message: `Failed to fetch user: ${error.message}` });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    if (allUsers.length === 0) {
      return res.status(404).json({ message: "No user found" });
    } else {
      return res.status(200).json(allUsers);
    }
  } catch (error) {
    console.error(`Failed to fetch all users: ${error.message}`);
    return res
      .status(500)
      .json({ message: `Failed to fetch all users: ${error.message}` });
  }
};
