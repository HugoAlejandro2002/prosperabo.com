"use client";
import React, { Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { publicApiUrl, publicApiVersion } from "../../services/config";
const PDFViewer = dynamic(() => import("@/components/shared/PDFViewer"), {
  ssr: false,
});

interface FinancialStatementProps {
  url: string | null;
}

const FinancialStatement: React.FC<FinancialStatementProps> = ({ url }) => {
  const replaceOrigin: string | RegExp =
    publicApiUrl || "https://www.services.prosperabo.com/api/v1";
  return (
    <Dialog>
      <DialogTrigger className="w-fit grow justify-center rounded-2xl border-4 border-solid border-white px-5 py-4 text-center max-md:px-5">
        Extracto Financiero
      </DialogTrigger>
      <DialogContent className="h-screen bg-slate-200 bg-gradient-to-bl from-teal-800 from-0% via-slate-950 via-100% to-accent to-90% sm:max-w-[425px] lg:max-w-full">
        <DialogHeader>
          <DialogTitle className="text-white">Extracto Financiero</DialogTitle>
          <DialogDescription>...</DialogDescription>
        </DialogHeader>
        <section className="flex h-screen w-full items-center justify-center">
          {/* display/renderzed only on screens larger than md */}
          <iframe
            // suppressHydrationWarning={true}
            src={
              url
                ? url?.replace(replaceOrigin, `/api/proxy/${publicApiVersion}`)
                : "/TestPDFfile.pdf"
            }
            height="100%"
            width="100%"
            aria-controls="Extracto Financiero"
            title="Extracto Financiero"
            className="hidden md:block"
            // className="h-screen border-0"
          ></iframe>

          {/* display/renderzed only on screens smaller than md */}
          <Suspense fallback={<div>Loading...</div>}>
            <PDFViewer
              fileUrl={
                url
                  ? url?.replace(
                      replaceOrigin,
                      `/api/proxy/${publicApiVersion}`,
                    )
                  : "/TestPDFfile.pdf"
              }
            />
            /
          </Suspense>
          {/* <PDFViewer fileUrl="/TestPDFfile.pdf" /> */}
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default FinancialStatement;
