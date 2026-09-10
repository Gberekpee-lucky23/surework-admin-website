import React from "react";
import { getLegalDocumentDetails } from "@/dal/legal";
import { LegalDocumentView } from "@/components/website/LegalDocumentView";

export const metadata = {
  title: "Terms and Conditions — Surework Nigeria",
  description: "Official Terms and Conditions for Surework platform users, customers, and service providers across Nigeria.",
};

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const data = await getLegalDocumentDetails("terms_and_conditions");

  return (
    <LegalDocumentView
      document={data?.published || null}
      badge="Legal Agreement"
      title="Terms and"
      titleGradient="Conditions"
      complianceNotice="This agreement is drafted in compliance with the Federal Competition and Consumer Protection Act, 2018 (FCCPA), the Nigeria Data Protection Act, 2023 (NDPA), and the General Application and Implementation Directive, 2025 (GAID)."
    />
  );
}
