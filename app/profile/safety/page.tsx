"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/auth/user/user.store";
import { toast } from "@/components/ui/use-toast";
import { preInvestList } from "data/pre-invest-notify";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { publicApiUrl } from "../../../services/config";

const SafetyNotices = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [checkin, setCheckState] = useState(false);

  const { user } = useUserStore();

  // SCOPE: handleSubmit
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setLoading(true);

    console.log("Form submitted:");
    // SCOPE: fetchData -> Signin Contract

    if (!user?.id) {
      throw toast({
        title: "Error: Usuario inválido",
        description:
          "Recargue la página por favor. Si continua, inténtalo de nuevo más tarde",
        variant: "destructive",
      });
    }
    const payloadData = {
      safetyNotices: true,
    };
    try {
      await fetchData(payloadData, user.id);
      toast({
        title: "¡Confirmación exitosa!",
        description: "Ahora puedes continuar con la firma digital",
        variant: "success",
      });
      setTimeout(() => {
        setLoading(false);
        router.push("/profile/contract");
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      // TODO: PENDING CUSTOM DESCRIPTION
      toast({
        title: "Error al guardar la aceptación",
        description:
          "Hubo un problema en el proceso. Inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("", e.target.checked);
    setCheckState(e.target.checked);
  };

  const [acceptedItems, setAcceptedItems] = useState(
    Array(preInvestList.length).fill(false),
  );
  const [openItemIndex, setOpenItemIndex] = useState(0);

  const handleAccept = (index: any) => {
    const newAcceptedItems = [...acceptedItems];
    newAcceptedItems[index] = true;
    setAcceptedItems(newAcceptedItems);
    setOpenItemIndex(index + 1);
  };
  const allItemsAccepted = acceptedItems.every((item) => item === true);

  return (
    <div className='justify-center" z-20'>
      <form id="form-safetyNotices" onSubmit={handleSubmit}>
        <Accordion
          type="single"
          collapsible
          className="w-[360px] md:w-[500px]"
          value={`item-${openItemIndex}`}
        >
          {preInvestList.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item?.title}</AccordionTrigger>
              <AccordionContent className="flex flex-col items-center justify-center gap-2 text-center">
                {item?.content}
                {!acceptedItems[index] && (
                  <Button
                    variant={"outline"}
                    onClick={() => handleAccept(index)}
                    className="mt-4 rounded bg-accent px-4 py-2 text-white hover:bg-accent/80"
                  >
                    Entendido
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

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
        <Alert
          variant={"warning"}
          className={`mt-10 w-[360px] md:w-[500px] ${checkin ? "" : "hidden"}`}
        >
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>¡Atención!</AlertTitle>
          <AlertDescription>
            Con estos datos crearemos tu cuenta, si existen discrepancias por
            ley se debe bloquear tu cuenta.
          </AlertDescription>
        </Alert>
        <section
          id="actions-safety"
          className="col-span-5 mt-16 flex max-w-full justify-around gap-5 whitespace-nowrap text-white max-md:mt-10 max-md:flex-wrap"
        >
          <Button variant={"outline"} size={"custom"} type="button">
            <Link href={`/profile/work`}>Regresar</Link>
          </Button>

          {loading ? (
            <Button disabled size={"custom"}>
              <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
              {/* TODO: {Object.values(hasError).some((error) => error) */}
              {checkin ? "seleccione" : "Por favor espere"}
            </Button>
          ) : (
            <Button
              type="submit"
              variant={"custom"}
              size={"custom"}
              disabled={!checkin || !allItemsAccepted}
            >
              Continuar
            </Button>
          )}
        </section>
      </form>
    </div>
  );
};

export default SafetyNotices;

// REVIEW: eval possible refactor to Store (Singlenton: update profile and setStore)
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
