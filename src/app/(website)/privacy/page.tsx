import React from "react";
import { getLegalDocumentDetails } from "@/dal/legal";
import { LegalDocumentView } from "@/components/website/LegalDocumentView";

export const metadata = {
  title: "Privacy Policy — Surework Nigeria",
  description: "Official Privacy Policy and NDPA compliance declaration for Surework Nigeria.",
};

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const data = await getLegalDocumentDetails("privacy_policy");

  return (
    <LegalDocumentView
      document={data?.published || null}
      badge="Data Protection"
      title="Privacy"
      titleGradient="Policy"
      complianceNotice="Surework is committed to protecting your personal data in strict compliance with the NDPA, the General Application and Implementation Directive, 2025 (GAID), and other applicable Rivers State and federal regulations."
    />
  );
}
