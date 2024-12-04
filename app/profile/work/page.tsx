"use client";
import Select from "@/components/shared/Select";
import Selection from "@/components/shared/Selection";
import { activities } from "data/main-activities";
import { useState } from "react";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/auth/user/user.store";
import { toast } from "@/components/ui/use-toast";
import { publicApiUrl } from "../../../services/config";
// type Profile = {
//   [key in keyof ProfileModel]: ProfileModel[key];
// };
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
// const WorkPage = () => {
const WorkPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    occupation: "",
    sector: "",
    activity: "",
  });
  // SCOPE: Handler Errors
  const [hasError, setErrors] = useState({
    occupation: false,
    sector: false,
    activity: false,
  });

  const occupationOptions = [
    { label: "Empleado", value: "Empleado" },
    { label: "Freelancer", value: "Freelancer" },
    { label: "Negocio Propio", value: "Negocio Propio" },
    { label: "Jubilad@", value: "Jubilad@" },
    { label: "Estudiante", value: "Estudiante" },
    { label: "Independiente", value: "Independiente" },
  ];

  const sectorOptions = [
    { label: "Servicios", value: "Servicios" },
    { label: "Industrial", value: "Industrial" },
    { label: "Comercio", value: "Comercio" },
    { label: "Agropecuario", value: "Agropecuario" },
    { label: "Gobierno", value: "Gobierno" },
  ];

  // SCOPE: handleInputs
  function handlerOccupationSelected(option: string): void {
    setFormState((prevState) => ({
      ...prevState,
      occupation: option,
    }));
    setLoading(false);
  }

  function handlerSectorSelected(option: string): void {
    setFormState((prevState) => ({
      ...prevState,
      sector: option,
    }));
    setLoading(false);
  }

  function handlerActivitySelected(option: string): void {
    setFormState((prevState) => ({
      ...prevState,
      activity: option,
    }));
    setLoading(false);
  }
  const { user, profileExist } = useUserStore();

  // SCOPE: handleSubmit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handleSubmit", formState);
    setLoading(true);
    // Validate the form fields
    const newErrors = {
      activity: formState.activity === "",
      occupation: formState.occupation === "",
      sector: formState.sector === "",
    };

    setErrors(newErrors);
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error);
    if (!hasErrors) {
      console.log("Form submitted:", formState);
      // SCOPE: API
      // const payloadData: Omit<Profile, "id"> = {
      const payloadData = {
        occupation: formState.occupation,
        sector: formState.sector,
        mainActivity: formState.activity,
      };

      if (!user?.id) {
        throw toast({
          title: "Error: Usuario inválido",
          description:
            "Recargue la página por favor. Si continua, inténtalo de nuevo más tarde",
          variant: "destructive",
        });
      }
      try {
        setLoading(true);
        const profile = await fetchData(payloadData, user.id); // send API
        console.log("PROFIEL", profile);
        setTimeout(() => {
          router.push("/profile/safety");
        }, 1000);
      } catch (error) {
        console.error("Error handlerOnCreate:", error);
        // setError(error?.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-shadow-500 z-20 flex flex-col justify-center">
      <Form.Root onSubmit={handleSubmit}>
        <section
          id="occupation"
          className="mt-4 w-[360px] max-w-full max-md:mt-10 md:w-[687px]"
        >
          <Selection
            title="Ocupación"
            options={occupationOptions}
            onSelected={handlerOccupationSelected}
          />
          {hasError.occupation && (
            <div className="mt-4 text-red-500">Este campo es requerido</div>
          )}
        </section>

        <section
          id="sector"
          className="mt-16 w-[360px] max-w-full max-md:mt-10 md:w-[687px]"
        >
          <Selection
            title="Sector"
            options={sectorOptions}
            onSelected={handlerSectorSelected}
          />
          {hasError.sector && (
            <div className="mt-4 text-red-500">Este campo es requerido</div>
          )}
        </section>

        <section
          id="select-main-activity"
          className="mt-16 w-[360px] max-w-full max-md:mt-10 md:w-[687px] lg:ml-0"
        >
          <Select
            title="Actividad principal"
            optionDefault="Selecciona tu actividad principal"
            options={activities}
            onSelected={handlerActivitySelected}
          />
          {hasError.activity && (
            <div className="mt-4 text-red-500">Este campo es requerido</div>
          )}
        </section>

        <section
          id="actions"
          className="mt-20 flex w-[360px] max-w-full justify-around gap-5 whitespace-nowrap text-xl font-extrabold text-white max-md:mt-10 max-md:flex-wrap md:w-[687px]"
        >
          <Button
            variant={"outline"}
            size={"custom"}
            type="button"
            disabled={profileExist}
          >
            <Link href={`/profile/`}>Regresar</Link>
          </Button>
          {loading ? (
            <Button disabled size={"custom"}>
              <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
              {Object.values(hasError).some((error) => error)
                ? "seleccione"
                : "Por favor espere"}
            </Button>
          ) : (
            <Button type="submit" variant={"custom"} size={"custom"}>
              Continuar
            </Button>
          )}
          {/* <button
            type="submit"
            className="justify-center rounded-[50px] border border-solid border-accent bg-accent px-14 py-3 max-md:px-2"
          >
            Continuar
          </button> */}
        </section>
      </Form.Root>
    </div>
  );
};

export default WorkPage;
