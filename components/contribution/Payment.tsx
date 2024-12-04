"use client"; // directive to enable client-side rendering.
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useContributionStore } from "@/stores/contribution/contribution.store";
import { publicStoragePaymentUrl } from "../../services/config";

const Payment = () => {
  const { contribution } = useContributionStore();

  return (
    <>
      {contribution && (
        <div
          id="card-container"
          className="rounded-2xl border-[5px] border-solid border-white p-4 text-white"
        >
          <h2 className="py-2 text-center text-3xl font-bold">Transacción </h2>
          <section id="payment-detail" className="grid grid-cols-5 ">
            <section id="labels" className="col-span-3 flex flex-col gap-y-5">
              <label className="font-bold">Código</label>
              <Separator />

              <label className="text-base font-light">Método de pago</label>
              <Separator />

              <label className="text-base font-light">Monto</label>
              <Separator />

              <label className="text-base font-light">Estado de Pago</label>
              <Separator />

              <label className="text-base font-light">Fecha</label>
              <Separator />
              <label className="text-base font-light">
                Comprobante proporcionado
              </label>
            </section>
            <section id="values" className="col-span-2 flex flex-col gap-y-5">
              <label
                className={`font-bold ${
                  contribution?.payment.transactionId ? " " : "text-red-500"
                } `}
              >
                {contribution?.payment.transactionId}
              </label>
              <Separator />
              <label className="text-base font-light">
                {contribution?.payment.method}
              </label>
              <Separator />
              <label className="text-base font-light">{`${contribution?.payment.amount.toLocaleString(
                "en-BO",
                {
                  style: "currency",
                  currency: "BOB",
                },
              )}`}</label>

              <Separator />
              <label className="text-base font-light">
                {contribution?.payment.status}
              </label>

              <Separator />
              <label className="text-base font-light">
                {contribution?.payment.createdAt.toString().split("T")[0]}
              </label>

              <Separator />

              {contribution?.contributorId &&
                contribution?.payment.invoiceFile !== null && (
                  <a
                    href={`${publicStoragePaymentUrl}/${contribution?.contributorId}/${contribution?.projectId}/${contribution?.payment.invoiceFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-xl border-none bg-transparent px-4 text-base font-light"
                  >
                    📄 Ver Factura
                  </a>
                )}
            </section>
          </section>
        </div>
      )}
    </>
  );
};

export default Payment;
