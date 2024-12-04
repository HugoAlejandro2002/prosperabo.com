import Balance from "@/components/contribution/Balance";
import DataTable from "@/components/contribution/DataTable";
import Payment from "@/components/contribution/Payment";
import { fetch_getContributionsByInvestor } from "@/lib/data/contribution";
import React from "react";
import { redirect } from "next/navigation";
import ContractSigning from "@/components/contribution/ContractSigning";
import { getSessionByUserEmail } from "../../services/session";

const page = async () => {
  const session = await getSessionByUserEmail();
  // console.log("session Layout", session);
  if (!session) {
    redirect("/api/auth/signin");
    return null;
  }
  const userId = session.user.id;
  const contributions = await fetch_getContributionsByInvestor(userId);
  return (
    <div className="flex grid-cols-1 flex-col items-center justify-center gap-4 md:grid md:grid-cols-3 md:items-start md:justify-start lg:px-12">
      <section
        id="data-table-projects-list"
        className="mb-10 w-[360px] bg-transparent md:col-span-2  md:row-span-4 md:w-full"
      >
        <DataTable contributions={contributions} />
      </section>
      <section
        id="balance-card"
        className="col-span-1 w-[360px] md:col-span-1 md:row-span-1 md:w-full"
      >
        <Balance />
      </section>

      <section
        id="payment-history"
        className="col-span-1 w-[360px] md:col-span-1 md:row-span-1 md:w-full"
      >
        <Payment />
      </section>

      <section
        id="contrac-signing"
        className=" col-span-1 w-[360px] md:col-span-1 md:row-span-1 md:w-full"
      >
        <ContractSigning />
      </section>
    </div>
  );
};

export default page;
