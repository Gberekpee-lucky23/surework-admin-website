import React from "react";
import { getLegalDocumentDetails } from "@/dal/legal";
import { LegalDocumentView } from "@/components/website/LegalDocumentView";

export const metadata = {
  title: "Handyman & Provider Agreement — Surework Nigeria",
  description: "Terms and standards for approved artisans, technicians, and service providers registered on Surework.",
};

export const dynamic = "force-dynamic";

export default async function HandymanTermsPage() {
  const data = await getLegalDocumentDetails("handyman_terms");

  return (
    <LegalDocumentView
      document={data?.published || null}
      badge="Artisan & Provider Agreement"
      title="Handyman & Provider"
      titleGradient="Agreement"
      complianceNotice="This agreement outlines standards of workmanship, safety guidelines, escrow payout conditions, and non-circumvention policies for approved artisans on Surework."
    />
  );
}
