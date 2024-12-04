import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { UserFrontStore } from "../../../schemas/user/userFrontStore";

type User = UserFrontStore;

// SCOPE: STORE
interface State {
  user: User | null;
  profileExist: boolean;
}
interface Actions {
  setUser: (user: User) => void;
  setProfileExist: (profileExist: boolean) => void;
  reset: () => void;
}

const useUserStore = create<State & Actions>()(
  devtools(
    // TODO: Eval persist
    persist(
      (set) => ({
        user: null,
        profileExist: false,
        setUser: (user) => set({ user: user }),
        setProfileExist: (newProfileExist: boolean) =>
          set({ profileExist: newProfileExist }),
        reset() {
          set({ user: null });
          set({ profileExist: false });
        },
      }),
      { name: "user-store" },
    ),
  ),
);

export { useUserStore };
