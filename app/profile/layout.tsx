import { redirect } from "next/navigation";
import { fetchVerifySignContract } from "@/lib/data/profile";
import { getSessionByUserEmail } from "../../services/session";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionByUserEmail();
  console.log("session Layout", session);
  if (!session) {
    redirect("/api/auth/signin");
    return null;
  }
  const userId = session.user.id;
  const verifiedContrat = await fetchVerifySignContract(userId);
  console.log("verifiedContrat", verifiedContrat);

  // if (verifiedContrat === null) {
  //   return null; // ISSUE: RETURN NULL NOT WORKING page blanck for new users
  // }
  if (
    verifiedContrat != null &&
    (await verifiedContrat.commercialContract) !== null &&
    (await verifiedContrat?.contractSigningDate) !== null
  ) {
    redirect("/");
    return null; // not continue after redirect
  }

  return (
    <section className="z-10 flex min-h-screen w-full flex-col items-center justify-center bg-black py-2 pb-32 max-md:max-w-full max-md:px-5">
      <h1 className="mt-14 px-12 pb-12 pt-12 text-center text-5xl font-light text-white max-md:mt-10 max-md:text-4xl">
        Antes de invertir
      </h1>
      {children}
    </section>
  );
}
