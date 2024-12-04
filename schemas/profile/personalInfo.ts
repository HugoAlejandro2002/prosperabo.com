import { Gender } from "../../enums/profile/gender";

export interface PersonalInfo {
  gender: Gender | null;
  birthDate: string | Date | null;
  address: string;
  frontIdentityFile: File | string | null;
  reverseIdentityFile: File | null;
};
