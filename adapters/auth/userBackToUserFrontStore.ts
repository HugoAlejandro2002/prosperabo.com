import { UserBack } from "../../schemas/user/userBack";
import { UserFrontStore } from "../../schemas/user/userFrontStore";

export const UserBackToUserFrontStore = (userBack: UserBack) => {
  const userFrontStore: UserFrontStore = {
    id: userBack.id,
    email: userBack.email,
    name: userBack.name,
    emailVerified: userBack.emailVerified,
    image: userBack.image,
    profile: userBack.profile,
    role: userBack.role,
    updatedAt: userBack.updatedAt,
  };
  return userFrontStore;
};
