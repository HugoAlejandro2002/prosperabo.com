"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { preInvestList } from "data/pre-invest-notify";
import { fetchContributionInvest } from "@/lib/data/contribution";
import { toast } from "@/components/ui/use-toast";
import UploadFile from "@/components/shared/UploadFile";
import useLoadingStore from "@/stores/loading.store";
import { bank } from "../../services/config";
interface SafetyNoticesProps {
  amount: number;
  projectId: number;
  qtyActionsBuy: number;
}
const SafetyNotices = ({
  amount,
  projectId,
  qtyActionsBuy,
}: SafetyNoticesProps) => {
  const [checkin, setCheckState] = useState(false);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckState(e.target.checked);
  };
  const setLoading = useLoadingStore((state) => state.setLoading);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleSubmit = async (file: File, loadingId: string) => {
    console.log(file, loadingId);

    try {
      setLoading(loadingId, true);

      const data = await fetchContributionInvest({
        amount,
        method: "TRANSFER",
        projectId: projectId,
        qtyActionsBuy,
        invoiceFile: file,
      });
      console.log(data);

      // Simulate a delay for loading effect
      setTimeout(() => {
        setIsDialogOpen(true);
        toast({
          title: "¡Transacción exitosa!",
          description: `Su contribución fue registrada por el monto de ${data?.contribution.amount} por la adquisición de ${data?.contribution.qtyPortions} SocioCrédits.`,
          variant: "success",
        });
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error al procesar la inversión.",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setLoading(loadingId, false);
      }, 2000);
    }
  };

  return (
    <div className="mt-4 max-h-svh overflow-y-auto  *:text-center">
      <div className="flex flex-col items-center justify-center  ">
        <h1 className="mb-4 text-3xl font-bold text-white">
          Avisos de Seguridad
        </h1>
        <section id="safety-notices">
          {preInvestList.map((item, index) => (
            <Accordion
              key={index}
              type="multiple"
              className="w-[500px]"
              defaultValue={[
                "item-1",
                "item-2",
                "item-3",
                "item-4",
                "item-5",
                "item-6",
                "item-7",
              ]}
            >
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger>{item?.title}</AccordionTrigger>
                <AccordionContent>{item?.content}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </section>
        <section
          id="check-a"
          className="col-span-5 mt-10 flex items-center space-x-2 text-center text-white"
        >
          <input
            className="peer h-8 w-8 shrink-0 rounded border-2 border-solid border-white checked:checked:bg-background focus-visible:outline-none"
            type="checkbox"
            name="accept"
            id="terms"
            onChange={handleCheckboxChange}
            checked={checkin}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Comprendo toda la información de seguridad
          </label>
        </section>
        <section id="submmit-payment-invoice" className="mt-10 flex max-w-md  ">
          {checkin && (
            // TODO: change account number real
            <UploadFile
              loadingId="invoiceFile"
              onFileUpload={handleSubmit}
              title="Comprobante de pago (Formato: PDF, JPG, PNG.)"
              description={`Seleccione archivo del comprobante de pago de la transferencia bancaria correspondiente a la inversión de Bs. ${amount}. La transferencia debe ser realizada al Número de cuenta: ${bank.account} (Banco ${bank.name}) a nombre de ${bank.companyName}.
                Nota: El comprobante de pago debe ser claro y legible. De lo contrario, no será aceptado.
                Al seleccionar el comprobante se habilitará el botón de continuar.`}
              buttonText="Continuar"
            />
          )}
        </section>
        <section
          id="actions-safety"
          className="col-span-5 mt-16 flex max-w-full justify-around gap-5 whitespace-nowrap text-white max-md:mt-10 max-md:flex-wrap"
        >
          {!checkin && (
            <Button
              type="button"
              variant={"custom"}
              size={"custom"}
              disabled={!checkin}
            >
              Continuar
            </Button>
          )}
        </section>
        {/* SCOPE: SHOW DIALOG WHEN CONTRUBUTION SUCCESSFULLY */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {/* <DialogContent className="h-screen bg-slate-200 sm:max-w-[425px]"> */}
          <DialogContent className="h-screen bg-slate-200 bg-gradient-to-bl from-teal-800 from-0% via-slate-950 via-100% to-accent to-90% sm:max-w-[425px] lg:max-w-full">
            <DialogHeader>
              <DialogTitle className="text-white">
                Resultado de proceso de Pago
              </DialogTitle>
              <DialogDescription>
                presione continuar y se lo redirigirá a su perfil
              </DialogDescription>
            </DialogHeader>
            <h1 className="text-center text-3xl font-bold text-white">
              INVERSIÓN EXITOSA
            </h1>
            <Image
              alt="image success"
              src="/checkmark-circle.svg"
              width={200}
              height={200}
              className="mx-auto"
              style={{
                animationDelay: "0.3s",
                animationFillMode: "forwards",
              }}
            />

            <Button
              type="button"
              variant={"custom"}
              size={"default"}
              className="mx-auto mt-10 w-60"
            >
              <Link href={`/contribution`}>Continuar</Link>
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SafetyNotices;
