import { useAuth } from "@clerk/clerk-react";

const { getToken } = useAuth();

async function getUserToken() {
  const token = await getToken();
  return token;
}
