import { Role } from "../../enums/user/role";

export interface UserFrontStore {
  id?: number;
  email?: string | null;
  name?: string | null;
  companyId?: number | null;
  password?: string | null;
  emailVerified?: boolean | null;
  image?: string | null;
  profile?: string | null;
  role?: Role | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string;
};
