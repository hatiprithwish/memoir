import { clerkClient } from "@clerk/clerk-sdk-node";

const userList = await clerkClient.users.getUserList();

export default userList;
