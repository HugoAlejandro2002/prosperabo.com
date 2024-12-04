import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import { fetchUser } from "./user";
import { UserBack } from "../schemas/user/userBack";
import { Role } from "../enums/user/role";
import { Session } from "../schemas/session/session";

export const getSessionByUserEmail = async (): Promise<Session | null> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return null;
    }
    const { user: { email } } = session;
    const allUserData: UserBack | null = await fetchUser(email ?? 'email');
    return allUserData ? {
      user: {
        id: allUserData?.id ?? 0,
        name: allUserData?.name ?? 'name',
        email: allUserData?.email ?? 'email',
        image: allUserData?.image ?? 'image',
        role: allUserData?.role ?? Role.INVESTOR,
      }
    } : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
