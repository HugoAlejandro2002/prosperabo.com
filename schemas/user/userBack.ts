import { Role } from "../../enums/user/role";
import { UserAuthProvider } from "./userAuthProvider";

export interface UserBack {
  id: number,
  name: string,
  email: string,
  emailVerified: boolean | null,
  image: string,
  role: Role,
  updatedAt: Date,
  profile: string | any | null,
  authProviders: UserAuthProvider,
};
