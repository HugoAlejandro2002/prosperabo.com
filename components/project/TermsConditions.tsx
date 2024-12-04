"use client";
import React, { Suspense } from "react";
// import PDFViewer from "@/components/shared/PDFViewer";
import dynamic from "next/dynamic";
const PDFViewer = dynamic(() => import("@/components/shared/PDFViewer"), {
  ssr: false,
});
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { publicApiUrl, publicApiVersion } from "../../services/config";

interface FinancialStatementProps {
  url: string | null;
}

const FinancialStatement: React.FC<FinancialStatementProps> = ({ url }) => {
  const replaceOrigin: string | RegExp =
    publicApiUrl || "https://www.services.prosperabo.com/api/v1";

  return (
    <Dialog>
      <DialogTrigger className="mr-1 flex justify-center self-end rounded-[48px] border-[3px] border-solid border-white px-5 text-base font-extrabold sm:mr-2.5 sm:mt-10 md:mr-5 md:mt-0 md:py-4 lg:mr-5 lg:text-xl 2xl:mt-0">
        Términos y condiciones
      </DialogTrigger>
      <DialogContent className="h-screen bg-slate-200 bg-gradient-to-bl from-teal-800 from-0% via-slate-950 via-100% to-accent to-90% sm:max-w-[425px] lg:max-w-full">
        <DialogHeader>
          <DialogTitle className="text-white">
            Términos y condiciones
          </DialogTitle>
          <DialogDescription>...</DialogDescription>
        </DialogHeader>
        <section className="flex h-screen items-center justify-center">
          <iframe
            src={
              url
                ? url?.replace(replaceOrigin, `/api/proxy/${publicApiVersion}`)
                : "/TestPDFfile.pdf"
            }
            height="100%"
            width="80%"
            aria-controls="Términos y Condiciones"
            title="Términos y Condiciones"
            className="hidden h-screen border-0 md:block"
          ></iframe>
          {/* display/renderzed only on screens smaller than md */}
          {url && (
            <Suspense fallback={<div>Loading...</div>}>
              <PDFViewer
                fileUrl={url?.replace(
                  replaceOrigin,
                  `/api/proxy/${publicApiVersion}`,
                )}
              />
            </Suspense>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default FinancialStatement;
