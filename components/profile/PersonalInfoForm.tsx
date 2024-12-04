"use client";
import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { Input } from "../ui/input";
import GenderSelection from "@/components/profile/GenderSelection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RefreshCwIcon, UploadCloudIcon } from "lucide-react";
import Select from "@/components/shared/Select";
import { regions } from "data/bo-depts";
import { useSessionStore } from "@/stores/auth/session.store";
import { getMaxDate, getMinDate } from "@/lib/utils/date.util";
import { PersonalInfo } from "../../schemas/profile/personalInfo";

interface FormProps {
  onSubmit: (profileForm: any) => void;
  profileForm?: PersonalInfo;
  //  contactForm?: IMainCompanyContact;
  // onSubmitForm: (contactForm: IMainCompanyContact) => void;
}

// const PersonalInfoForm = () => {
const PersonalInfoForm: React.FC<FormProps> = ({ profileForm, onSubmit }) => {
  // const { data: session } = useSession(); // REQUIRED  <SessionProvider> is added to pages/_app.js.
  // const [file, setFile] = useState<File | null>();

  const userSession = useSessionStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [checkin, setCheckState] = useState(false);

  const [formState, setFormState] = useState({
    gender: profileForm?.gender || "",
    birthDate: profileForm?.birthDate || null,
    address: profileForm?.address || "",
    frontIdentityFile: profileForm?.frontIdentityFile || File,
    reverseIdentityFile: profileForm?.reverseIdentityFile || File || "",
  });
  // SCOPE: Handler Errors
  const [hasError, setErrors] = useState({
    gender: false,
    birthDate: false,
    address: false,
    frontIdentityFile: false,
    reverseIdentityFile: false,
  });
  function checkHasErrors() {
    const newErrors = {
      gender: !formState.gender || formState.gender === "",
      address: !formState.address || formState.address === "",
      birthDate: !formState.birthDate || formState.birthDate === null || formState.birthDate === new Date(),
      frontIdentityFile: !formState.frontIdentityFile || formState.frontIdentityFile === File,
      reverseIdentityFile: !formState.reverseIdentityFile || formState.reverseIdentityFile === File,
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error);
    return hasErrors;
  }
  // SCOPE: handleSubmit
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    console.log("handleSubmit", formState);
    setLoading(true);
    const hasErrors = checkHasErrors(); // Validate the form fields

    if (!hasErrors) {
      console.log("Form submitted:", formState);
      setTimeout(() => {
        onSubmit(formState);
        // TODO: next send API
        setLoading(false);
        // router.push("/profile/work");
      }, 1500);
    }
  }
  // SCOPE: handleInputs
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const selectedFile = event.target.files?.[0] || "";
    console.log(field, "Archivo seleccionado:", selectedFile);
    setFormState({ ...formState, [field]: selectedFile });
    setLoading(false);
    // checkHasErrors(); // Validate the form fields
    // setFormState((prevFormData) => ({ ...prevFormData, [field]: event.target.files?[0]|| "" }));
  };
  function handlerGenderSelected(option: string): void {
    setFormState((prevState) => ({
      ...prevState,
      gender: option,
    }));
    console.log("option", option);
    setLoading(false);
  }
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevFormData) => ({
      ...prevFormData,
      birthDate: new Date(e.target.value), //.toISOString().slice(0, 10),
      // birthDate: e.target.value, //.toISOString().slice(0, 10),
    }));
    setLoading(false);
    console.log(new Date(e.target.value), "handleDateChange", e.target.value);
  };
  function handlerAddressSelected(option: string): void {
    console.log("address", option);
    setFormState((prevFormData) => ({
      ...prevFormData,
      address: option,
    }));
    setLoading(false);
  }
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("", e.target.checked);
    setCheckState(e.target.checked);
  };
  return (
    <div>
      <Form.Root
        onSubmit={handleSubmit}
        className="grid w-full grid-cols-6 md:grid-cols-5 max-md:mt-10 gap-y-4"
      >
        <Form.Field name="name" className="col-span-6 md:col-span-3 mb-[10px]">
          <Form.Label className="text-2xl font-semibold text-white max-md:mt-10 max-md:max-w-full">
            Nombre
          </Form.Label>
          <Form.Message match="valueMissing"></Form.Message>
          <Form.Control asChild className="mt-3" required>
            <Input
              disabled={!!userSession.name}
              type="text"
              value={userSession.name}
              min={3}
              aria-label="Nombre"
              required
              className="h-[52px] shrink-0 rounded-3xl bg-white max-md:max-w-full"
            />
          </Form.Control>
        </Form.Field>
        <Form.Field name="gender" className="col-span-6 md:col-span-2 lg:ml-10">
          <GenderSelection onSelected={handlerGenderSelected} />
          {hasError.gender && (
            <div className="text-[13px] text-red-500 opacity-[0.8]">
              Este campo es requerido
            </div>
          )}
        </Form.Field>
        <Form.Field name="birtday" className="col-span-6 md:col-span-2 mb-[10px] mt-10">
          <Form.Label className="text-2xl font-semibold text-white max-md:mt-10 max-md:max-w-full">
            Fecha de nacimiento
          </Form.Label>
          <Form.Control asChild className="mt-6 ">
            <input
              type="date"
              name="birthdate"
              className="flex w-full flex-col justify-center rounded-2xl border-4 border-solid border-white bg-black px-7 py-2 text-white *:text-white hover:bg-white hover:text-black max-md:px-5 "
              value={
                formState?.birthDate
                  ? new Date(formState.birthDate).toISOString().slice(0, 10)
                  : ""
              }
              onChange={handleDateChange}
              min={getMaxDate()}
              max={getMinDate()}
            />
          </Form.Control>
          {hasError.birthDate && (
            <div className="text-[13px] text-red-500 opacity-[0.8]">
              Este campo es requerido
            </div>
          )}
        </Form.Field>
        <Form.Field name="address" className="col-span-6 md:col-span-2 md:col-start-4 mt-10">
          <Select
            title="Lugar de nacimiento"
            optionDefault="Departamentos"
            options={regions}
            onSelected={handlerAddressSelected}
          />
          {hasError.address && (
            <div className="mt-4 text-red-500">Este campo es requerido</div>
          )}
        </Form.Field>

        <Form.Field name="identityFront" className="col-span-6 md:col-span-2 mt-8">
          <Form.Label className="text-2xl font-semibold text-white max-md:mt-10 max-md:max-w-full">
            Carnet de identidad
          </Form.Label>
          <label htmlFor="identityFront">
            <div className="mt-9 flex flex-col justify-center rounded-3xl border-4 border-solid border-white px-4 py-3.5 text-stone-300 max-md:px-5">
              <div className="flex justify-between gap-2.5 py-1.5 pr-5 text-accent max-md:pr-5">
                {typeof formState.frontIdentityFile === "string"
                  ? `${formState.frontIdentityFile}`
                  : formState.frontIdentityFile === File
                  ? "Carga el anverso"
                  : `${formState.frontIdentityFile.name}`}

                <UploadCloudIcon />
              </div>
              <input
                id="identityFront"
                type="file"
                name="frontIdentityFile"
                accept="image/jpeg, image/png"
                className="hidden"
                onChange={(e) => handleFileChange(e, "frontIdentityFile")}
              />
            </div>
          </label>
          {hasError.frontIdentityFile && (
            <div className="text-[13px] text-red-500 opacity-[0.8]">
              Este campo es requerido
            </div>
          )}
        </Form.Field>
        <Form.Field
          name="identityBack"
          className="col-span-6 md:col-span-2 md:col-start-4 md:mt-16"
        >
          <label htmlFor="identityBack">
            <div className="mt-9 flex flex-col justify-center rounded-3xl border-4 border-solid border-white px-4 py-3.5 text-stone-300 max-md:px-5">
              <div className="flex justify-between gap-2.5 py-1.5 pr-5 text-accent max-md:pr-5">
                {formState.reverseIdentityFile === File
                  ? "Carga el reverso"
                  : `${formState.reverseIdentityFile?.name}`}
                <UploadCloudIcon />
              </div>
              <input
                id="identityBack"
                type="file"
                name="reverseIdentityFile"
                accept="image/jpeg, image/png"
                className="hidden"
                onChange={(e) => handleFileChange(e, "reverseIdentityFile")}
              />
            </div>
          </label>
          {hasError.reverseIdentityFile && (
            <div className="text-[13px] text-red-500 opacity-[0.8]">
              Este campo es requerido
            </div>
          )}
        </Form.Field>
        <section
          id="check-a"
          className="col-span-6 md:col-span-5 mt-10 flex items-center space-x-2 text-white"
        >
          {/* <Checkbox id="terms" onChange={handleCheckboxChange} /> */}
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
            ¿Tus datos están correctos?
          </label>
        </section>

        <section className="col-span-6 md:col-span-5 mt-16 flex max-w-full justify-around gap-5 whitespace-nowrap text-white max-md:mt-10 max-md:flex-wrap">
          <Button variant={"outline"} size={"custom"} type="button">
            <Link href={`/`}>Regresar</Link>
          </Button>
          {loading ? (
            <Button disabled size={"custom"}>
              <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
              {Object.values(hasError).some((error) => error)
                ? "seleccione"
                : "Por favor espere"}
            </Button>
          ) : (
            <Button
              type="submit"
              variant={"custom"}
              size={"custom"}
              disabled={!checkin}
            >
              Continuar
            </Button>
          )}
        </section>
      </Form.Root>
    </div>
  );
};

export default PersonalInfoForm;
