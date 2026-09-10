import React from "react";
import { notFound } from "next/navigation";
import { getLegalDocumentDetails, DOCUMENT_CONFIG } from "@/dal/legal";
import { LegalDocumentEditorClient } from "./LegalDocumentEditorClient";

interface PageProps {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { type } = await params;
  const config = DOCUMENT_CONFIG.find((c) => c.type === type);
  return {
    title: config ? `${config.title} — Surework Admin` : "Legal Document — Surework Admin",
  };
}

export default async function LegalDocumentPage({ params }: PageProps) {
  const { type } = await params;
  const data = await getLegalDocumentDetails(type);

  if (!data) {
    notFound();
  }

  return (
    <LegalDocumentEditorClient
      documentType={type}
      config={data.config}
      published={data.published}
      draft={data.draft}
      history={data.history}
      acceptancesCount={data.acceptancesCount}
      totalEligibleUsers={data.totalEligibleUsers}
    />
  );
}
