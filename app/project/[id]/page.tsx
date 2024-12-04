import React, { Suspense } from "react";
import Image from "next/image";
import StatusBadge from "@/components/shared/utils/StatusBadge";
import RiskBadge from "@/components/shared/utils/RiskBadge";
import ButtonBack from "@/components/project/ButtonBack";
import { fetchProjectById } from "@/lib/data/projects";
import { Progress } from "@/components/ui/progress";
import CalculatorBuy from "@/components/project/CalculatorBuy";
import ScrollToTop from "@/components/shared/utils/ScrollToTop";
import FinancialStatement from "@/components/project/FinancialStatement";
import TermsConditions from "@/components/project/TermsConditions";
import LinkImage from "@/components/shared/LinkImage";
// import InvestmentSimulator from "@/components/project/InvestmentSimulator";
// REF.: https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
import dynamic from "next/dynamic";
import { publicApiUrl } from "../../../services/config";
const InvestmentSimulator = dynamic(
  () => import("@/components/project/InvestmentSimulator"),
  { ssr: false },
);
// const NoSSR = dynamic(() => import('@/components/project/InvestmentSimulator'), { ssr: false })

const ProjectPage = async ({ params }: { params: { id: string } }) => {
  const project = await fetchProjectById(params.id);
  // console.log("project", project);

  return (
    <div className="z-20 w-full bg-gradient-to-bl from-teal-800 from-0% via-slate-950 via-50% to-accent to-100%">
      <div className="mix-auto ip-4 container h-full pb-48 pt-6 sm:grid-cols-2 md:grid-cols-2 lg:grid lg:grid-cols-2">
        <ScrollToTop />
        <h1 className="col-span-2 justify-center text-center text-2xl font-light text-white max-md:mt-10 max-md:max-w-full max-md:text-2xl lg:text-4xl">
          Elige tus campañas
        </h1>
        <section
          id="logo_company-project"
          className="col-span-2 flex flex-col items-center justify-center px-2 sm:col-span-2  md:col-span-1 lg:col-span-1 lg:px-8"
        >
          <Image
            // src={`${'https://cdn.builder.io/api/v1/image/assets/TEMP/c203068768a3269c9778917767a950f031685da70a981f7eb83432b02ed5a0db'|| "/py-location.svg"}  `}
            src={`${project?.Company?.logoFile || "/py-location.svg"}  `}
            alt={`Logo ${project?.Company.name}`}
            width={400}
            height={250}
            className="w-[300px] rounded-full object-cover max-md:mt-10 sm:mt-10 sm:w-[343px] md:mt-10 md:w-[343px] lg:w-[343px]"
          />
          <div
            id="title-project-networks"
            // className="ml-32 mt-10 flex w-[464px] max-w-full flex-col text-white"
            className="mx-auto mt-10 flex max-w-[364px] flex-col text-white sm:mx-2.5 sm:mt-10 sm:max-w-full md:mx-auto md:mt-10 md:max-w-[464px] lg:mx-auto lg:mt-10 lg:max-w-[464px]"
          >
            <div className="text-center text-5xl font-bold max-md:max-w-full max-md:text-4xl sm:max-w-full sm:text-4xl md:max-w-full md:text-4xl lg:text-5xl">
              {project?.title}
            </div>
            <h3 className="text-center">
              Por la Empresa: {project?.Company?.name}
            </h3>
            <div className="my-4 flex items-center justify-center gap-0.5 lg:gap-3">
              <StatusBadge status={parseInt(project?.status)} />:
              <Progress
                value={Math.min(
                  (1 - project?.availablePortions / project?.qtyPortions) * 100,
                  100,
                )}
                className="w-[150px]"
              />
            </div>
            <section
              id="links-external"
              className="mt-3 flex items-center justify-center gap-2 text-center align-middle sm:mt-10 sm:grid-cols-3 md:mt-6 md:grid-cols-6 lg:mt-6 lg:grid-cols-6"
            >
              <LinkImage
                link={project?.Company?.locationUrl}
                imageUrl="/py-location.svg"
                className="col-span-1 col-start-2"
              />
              <LinkImage
                link={project?.Company?.siteUrl}
                imageUrl="/py-globe.svg"
                className="col-span-1"
              />
              <div className="col-span-3 items-center justify-center sm:col-span-3 md:col-span-3 lg:col-span-3">
                {/* <TermsConditions url={project?.Company?.termsConditionsFile} /> */}
                <TermsConditions
                  url={`${publicApiUrl}/company/${project?.companyId}/${project?.Company?.termsConditionsFile}`}
                  // url={`/api/proxy/${publicApiVersion}/company/${project.companyId}/${project?.Company?.termsConditionsFile}`}
                />
              </div>
            </section>
          </div>
        </section>

        <section
          id="calculate"
          className="col-span-2 mt-10 items-center justify-center sm:mt-0 sm:max-w-full md:col-span-1 md:mt-0 md:max-w-full lg:col-span-1 lg:mt-24"
          suppressHydrationWarning={true}
        >
          <CalculatorBuy
            priceUnit={project?.valueByPortion}
            qtyAvailable={project?.availablePortions}
            projectId={parseInt(project?.id)}
          >
            <FinancialStatement url={project?.financialInfoFile} />
          </CalculatorBuy>
          {project?.rate !== null ? (
            <Suspense fallback={<div>Loading...</div>}>
              <InvestmentSimulator rate={parseInt(project?.rate)} />
            </Suspense>
          ) : (
            <div>Loading...</div>
          )}
        </section>

        <p className="col-span-2 mt-24 justify-center px-4 text-center text-base text-white sm:max-w-full sm:px-5 md:text-xl lg:px-24 lg:text-base">
          {project?.description}
        </p>

        <section
          id="information"
          className="col-span-2 mt-24 px-0 sm:mt-10 sm:max-w-full sm:px-5 md:mt-24 md:px-16 lg:mt-24 lg:px-16"
          // className="col-span-2 mt-24 bg-gradient-to-tl from-teal-800 from-0% via-slate-950 via-70% to-accent to-100%  px-6 sm:mt-10 sm:max-w-full sm:px-5 md:mt-24 md:px-16 lg:mt-24 lg:px-16"
        >
          <div className="z-10 flex items-center justify-center rounded-[36px] border-8 border-solid border-white py-14 max-md:mt-10 max-md:max-w-full max-md:px-5">
            <div className="w-full max-w-[1022px] max-md:max-w-full">
              <div className="flex gap-5 p-4 max-md:flex-col max-md:gap-0">
                <div className="flex w-6/12 flex-col max-md:ml-0 max-md:w-full">
                  <div className="mt-1 flex grow flex-col text-xl font-extrabold text-white max-md:mt-10 max-md:max-w-full">
                    <div className="max-md:max-w-full">
                      MONTO DE FINANCIAMIENTO
                    </div>
                    <div className="mt-5 font-medium max-md:max-w-full">
                      {parseFloat(project?.targetAmount).toLocaleString(
                        "en-BO",
                        {
                          style: "currency",
                          currency: "BOB",
                        },
                      )}
                    </div>
                    <div className="mt-16 max-md:mt-10 max-md:max-w-full">
                      RENDIMIENTO TOTAL ANUAL
                    </div>
                    <div className="mt-4 font-medium max-md:max-w-full">
                      {project?.rate}%
                    </div>

                    <div className="mt-11 uppercase max-md:mt-10 max-md:max-w-full">
                      Meta mínima de inversión
                    </div>
                    <div className="mt-4 font-medium max-md:max-w-full">
                      {parseFloat(project?.minimumAmount).toLocaleString(
                        "en-BO",
                        {
                          style: "currency",
                          currency: "BOB",
                        },
                      )}
                    </div>

                    <div className="mt-16 uppercase max-md:mt-10 max-md:max-w-full">
                      Fecha de Inicio
                    </div>
                    <div className="mt-4 font-medium max-md:max-w-full">
                      {project?.startDate.split("T")[0]}
                    </div>

                    <div className="mt-12 uppercase max-md:mt-10 max-md:max-w-full">
                      Fecha Estimada de Fondeo
                    </div>
                    <div className="mt-4 font-medium max-md:max-w-full">
                      {project?.fundingDate && (
                        <span>
                          {project?.fundingDate !== null
                            ? project?.fundingDate.split("T")[0]
                            : ""}
                        </span>
                      )}
                      {/* // ? new Date(project?.fundingDate).toISOString().slice(0, 10) */}
                      <p>
                        Disclaimer: Comenzarás a recibir tu rendimiento una vez
                        finalizado el fondeo.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex w-6/12 flex-col max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col text-xl font-extrabold text-white max-md:mt-10 max-md:max-w-full">
                    <div className="uppercase max-md:max-w-full">
                      Número Total de Sociocredits emitidos
                    </div>
                    <div className="mt-3.5 font-medium max-md:max-w-full">
                      {project?.qtyPortions - project?.availablePortions}{" "}
                      unidades
                    </div>
                    <div className="mt-16 uppercase max-md:mt-10 max-md:max-w-full">
                      SocioCredits Disponibles
                    </div>
                    <div className="mt-3.5 font-medium max-md:max-w-full">
                      {project?.availablePortions} unidades
                    </div>
                    <div className="mt-14 max-md:mt-10 max-md:max-w-full">
                      VALOR DE SOCIOCREDITS
                    </div>
                    <div className="mt-4 font-medium max-md:max-w-full">
                      {parseFloat(
                        project?.valueByPortion.toString(),
                      ).toLocaleString("en-BO", {
                        style: "currency",
                        currency: "BOB",
                      })}
                    </div>

                    <div className="mt-14 uppercase max-md:mt-10 max-md:max-w-full">
                      Fecha de finalización
                    </div>
                    <div className="mt-4 font-medium max-md:max-w-full">
                      {project?.endDate.split("T")[0]}
                    </div>
                    <div className="mt-14 uppercase max-md:mt-10 max-md:max-w-full">
                      Calificación de riesgo
                    </div>
                    <div className="mt-4 font-medium max-md:max-w-full">
                      <RiskBadge riskLevel={project?.riskLevel} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="button-back"
          className="col-span-2 mt-10 flex items-center justify-center"
        >
          <ButtonBack />
        </section>
      </div>
    </div>
  );
};

export default ProjectPage;
