import { UserBack } from "../schemas/user/userBack";
import { publicApiUrl } from "./config";

export const fetchUser = async (email: string): Promise<UserBack | null> => {
  try {
    const response = await fetch(
      `${publicApiUrl}/users?email=${email}`,
    );
    const resToJson = await response.json();
    const user: UserBack = resToJson.data;
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};
