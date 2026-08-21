import React from "react";
import { fetchDynamicWebsiteCategories } from "@/dal/categories";
import { ServicesClient } from "./ServicesClient";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ServicesPage() {
  const categories = await fetchDynamicWebsiteCategories();
  return <ServicesClient initialCategories={categories} />;
}
