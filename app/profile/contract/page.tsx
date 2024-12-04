"use client";
import ActionSendEmail from "@/components/action-send-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/stores/auth/user/user.store";
import { useOTPStore } from "@/stores/otp/otp.store";
import { useRouterRefStore } from "@/stores/route-ref/routeref.store";
import FileSaver from "file-saver";
import { RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { publicApiUrl } from "../../../services/config";

async function fetchData(payload: any, id: number) {
  const res = await fetch(`${publicApiUrl}/profile/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return data;
}

const ContractPage = () => {
  const { user } = useUserStore();
  const { routeRef } = useRouterRefStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [signedState, setSignedState] = useState(false);

  const contractUrl = "/contrato-inversores.pdf";
  const contractDown = "/contrato-inversores.pdf";

  // "https://drive.google.com/file/d/1234567890/view?usp=sharing";

  const handleOpenContract = () => {
    window.open(contractUrl, "_blank");
  };
  const handleDownloadContract = async () => {
    try {
      const response = await fetch(contractDown);
      const blob = await response.blob();
      FileSaver.saveAs(blob, "contrato.pdf");
    } catch (error) {
      console.error("Error al descargar el contrato:", error);
    }
  };
  // SCOPE: Validation CODE OTP
  const { otp } = useOTPStore();
  const [code, setCodeState] = useState("");
  const [codeError, setCodeError] = useState("");

  async function handlerSignContrat(): Promise<void> {
    setLoading(true);
    // SCOPE: Verify code OTP

    if (code.length == 0 || code !== otp) {
      setLoading(false);
      throw toast({
        title: "Error código inválido",
        description: "Revise que el código sea el enviado a su correo.",
        variant: "destructive",
      });
    }

    // SCOPE: fetchData -> Signin Contract
    const payloadData = {
      commercialContract: true,
      contractSigningDate: new Date().toISOString(),
    };
    if (!user?.id) {
      setLoading(false);
      throw toast({
        title: "Error: Usuario inválido",
        description:
          "Recargue la página por favor. Si continua, inténtalo de nuevo más tarde",
        variant: "destructive",
      });
    }
    try {
      const response = await fetchData(payloadData, user.id);
      console.log("RESPONSE", response);
      setSignedState(response.data.commercialContract);
      toast({
        title: "¡Firma exitosa!",
        description: "Ahora ya puedes continuar invirtiendo...",
        variant: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      // TODO: PENDING CUSTOM DESCRIPTION
      toast({
        title: "Error al firmar el contrato",
        description:
          "Hubo un problema en el proceso. Inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // only numbers
    if (!/^\d*$/.test(inputValue)) {
      setCodeError("El código OTP debe contener solo números");
      return;
    }

    if (inputValue.length > 6) {
      setCodeError("El código OTP debe tener 6 dígitos");
      return;
    }
    //  setCodeState(e.currentTarget.value);
    setCodeState(inputValue);
    setCodeError("");
  };
  return (
    <div className="z-20 grid max-w-[484px] items-center justify-center text-white">
      <h1 className="px-12 pb-12 text-center text-3xl font-light text-white max-md:mt-10 max-md:text-4xl">
        Firma el contrato
      </h1>
      <section
        id="prev-file"
        className="h-[100px]  w-[360px] min-w-min cursor-pointer rounded-2xl bg-white md:w-[500px] "
        onClick={handleOpenContract}
      >
        <div className="flex h-full items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-2 h-8 w-8 text-gray-500"
          >
            <path
              fillRule="evenodd"
              d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 006.75 21a2.25 2.25 0 003.182-3.182l10.94-10.94a2.25 2.25 0 000-3.182z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-gray-500">Abrir contrato PDF</span>
        </div>
      </section>
      <section className="py-6 text-center">
        <Button
          variant={"outline"}
          size={"default"}
          onClick={handleDownloadContract}
        >
          Descargar Contrato
        </Button>
      </section>
      <h3>Firma con el código que enviamos por correo </h3>
      <section
        id="otp"
        className="mt-5 grid justify-center gap-3 md:grid-cols-2 md:justify-items-end "
      >
        <div className="md:col-span-1">
          <Input
            className="bg-white text-black"
            placeholder="Ingrese el código"
            value={code}
            onChange={handleOTPChange}
            maxLength={6}
            type="text"
          />
          {codeError && <div style={{ color: "red" }}>{codeError}</div>}
        </div>
        <div className="flex justify-between gap-3 md:col-span-1">
          <ActionSendEmail />
          {loading ? (
            <Button disabled variant={"outline"} size={"default"}>
              <RefreshCwIcon className="h-4 w-4 animate-spin" />
              {"..."}
            </Button>
          ) : (
            <Button
              variant={"outline"}
              size={"default"}
              onClick={handlerSignContrat}
              className="ml-3"
            >
              Firmar
            </Button>
          )}
        </div>
      </section>
      <section
        id="actions"
        className="mt-20 flex max-w-full justify-around gap-5 whitespace-nowrap text-xl font-extrabold text-white max-md:mt-10 max-md:flex-wrap"
      >
        <Button variant={"outline"} size={"custom"} type="button">
          <Link href={`/profile/safety`}>Regresar</Link>
        </Button>
        <Button
          type="button"
          variant={"custom"}
          size={"custom"}
          disabled={!signedState}
        >
          <Link href={`${routeRef}`}>Continuar</Link>
        </Button>
      </section>
    </div>
  );
};

export default ContractPage;
