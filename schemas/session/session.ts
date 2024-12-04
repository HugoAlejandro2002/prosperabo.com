import { Role } from "../../enums/user/role";

export interface Session {
  user: {
    id: number;
    email: string;
    image: string;
    name: string;
    role: Role;
  }
};
