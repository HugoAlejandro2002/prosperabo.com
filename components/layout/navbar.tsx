"use client";

import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { useSessionStore } from "@/stores/index";
import { useEffect, useRef } from "react";
import { useUserStore } from "@/stores/auth/user/user.store";
import { Session } from "../../schemas/session/session";
import { fetchUser } from "../../services/user";
import { UserBackToUserFrontStore } from "../../adapters/auth/userBackToUserFrontStore";

export default function NavBar({ session }: { session: Session | null }) {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);
  const setUserSession = useSessionStore((state) => state.setUserSession);
  const prevSessionRef = useRef<Session | null>(null);

  const { setUser } = useUserStore();

  const getUserByEmail = async (email: string) => {
    try {
      const userBack = await fetchUser(email);
      if (!userBack) throw Error(`User with email '${email}' not found`);
      const userFrontStore = UserBackToUserFrontStore(userBack);
      setUser(userFrontStore);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (session && session !== prevSessionRef.current) {
      prevSessionRef.current = session;
      setUserSession({
        name: session.user?.name || "",
        email: session.user?.email || "",
        image: session.user?.image || "",
      });
      console.log("se ejecuta.....");
      if (session.user?.email) {
        getUserByEmail(session.user.email);
      }
    }
  }, [session, setUserSession, setUser]);

  return (
    <>
      <SignInModal />
      <div
        className={`fixed top-0 flex w-full justify-center ${
          scrolled
            ? "border-b border-accent bg-slate-800/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between md:w-full">
          <Link href="/" className="font-display flex items-center text-2xl">
            <Image
              src="/logo.png"
              alt="Prospera logo"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            ></Image>
            <p></p>
          </Link>
          <div className="">
            {session ? (
              <UserDropdown session={session} />
            ) : (
              <section className="flex justify-between gap-5 self-start">
                <button
                  className="justify-center rounded-xl border-2 border-solid border-white px-2.5 py-1 text-white transition-all hover:bg-white hover:text-black"
                  // className="rounded-full border border-white bg-black p-1.5 px-4 py-2 text-sm text-white transition-all hover:bg-white hover:text-black"
                  onClick={() => setShowSignInModal(true)}
                >
                  Sign In
                </button>
                <Image
                  alt="Auth.js logo"
                  src="/user-guest.png"
                  width={50}
                  height={50}
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
