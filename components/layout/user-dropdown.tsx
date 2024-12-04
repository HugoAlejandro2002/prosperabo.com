"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, RulerIcon } from "lucide-react";
import Popover from "@/components/shared/popover";
import Image from "next/image";
import Link from "next/link";
import { resetAllStores } from "@/stores/index";
import { fetchVerifySignContract } from "@/lib/data/profile";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/auth/user/user.store";
import { useRouterRefStore } from "@/stores/route-ref/routeref.store";
import { toast } from "@/components/ui/use-toast";
import { Session } from "../../schemas/session/session";

export default function UserDropdown({ session }: { session: Session }) {
  const { email, image } = session?.user || {};
  const [openPopover, setOpenPopover] = useState(false);

  const { setProfileExist } = useUserStore();
  const { setRouteRef } = useRouterRefStore();
  const router = useRouter();
  if (!email) return null;

  async function handleSignOut() {
    await signOut();
    resetAllStores();
  }

  async function handleToRoute(event: any) {
    const userId = session.user.id;
    const verifiedContrat = await fetchVerifySignContract(userId);
    console.log("verifiedContrat", verifiedContrat);

    if (verifiedContrat === null) {
      toast({
        title: "Ante de invertir debe completar su perfil",
        description: "Esta acción es necesaria para poder invertir",
        variant: "default",
      });
      setRouteRef(`/#projects`);

      return router.push("/profile");
    } else if (
      verifiedContrat?.contractSigningDate !== null &&
      verifiedContrat?.commercialContract !== null
    ) {
      toast({
        title: "Usted ya tiene un contrato firmado",
        description: "Ahora puede continuar inviertiendo",
        variant: "default",
      });
      return router.push("/");
    } else {
      setProfileExist(true);
      setRouteRef(`/#projects`);
      toast({
        title: "Continúe completando el formulario",
        description: "Este paso es necesario para poder invertir",
        variant: "default",
      });
      return router.push("/profile/work");
    }
  }

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <div className="w-full rounded-md bg-white p-2 sm:w-56">
            <div className="p-2">
              {session?.user?.name && (
                <p className="truncate text-sm font-medium text-gray-900">
                  {session?.user?.name}
                </p>
              )}
              <p className="truncate text-sm text-gray-500">
                {session?.user?.email}
              </p>
            </div>
            {/* cursor-not-allowed*/}
            <div className="text-sm">
              <button
                onClick={handleToRoute}
                className="relative flex w-full  items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              >
                <RulerIcon className="h-4 w-4" />
                <p className="text-sm"> Antes de invertir </p>
              </button>
            </div>
            <Link href={`/contribution`} className="text-sm">
              <button className="relative flex w-full  items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100">
                <LayoutDashboard className="h-4 w-4" />
                <p className="text-sm"> Mi perfil </p>
              </button>
            </Link>
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              onClick={handleSignOut}
              // onClick={() => [signOut(), clearStore()]}
            >
              <LogOut className="h-4 w-4" />
              <p className="text-sm">Logout</p>
            </button>
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
        >
          <Image
            alt={email}
            src={image || `https://avatars.dicebear.com/api/micah/${email}.svg`}
            width={40}
            height={40}
          />
        </button>
      </Popover>
    </div>
  );
}
