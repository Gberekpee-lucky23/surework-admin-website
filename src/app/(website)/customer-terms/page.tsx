import React from "react";
import { getLegalDocumentDetails } from "@/dal/legal";
import { LegalDocumentView } from "@/components/website/LegalDocumentView";

export const metadata = {
  title: "Customer Terms of Service — Surework Nigeria",
  description: "Terms governing customers booking handymen, escrow payments, inspections, and cancellation terms on Surework.",
};

export const dynamic = "force-dynamic";

export default async function CustomerTermsPage() {
  const data = await getLegalDocumentDetails("customer_terms");

  return (
    <LegalDocumentView
      document={data?.published || null}
      badge="Service Seeker Agreement"
      title="Customer Terms of"
      titleGradient="Service"
      complianceNotice="These Customer Terms form a binding agreement between you and Surework, protecting your payments via secured escrow and guaranteeing service standards."
    />
  );
}
