

"use server";

import type { SalesProfile } from "@/types";
import { fetchSalesProfiles } from "@/app/sales-profiles/actions";

export async function getSalesProfiles(): Promise<SalesProfile[]> {
  return fetchSalesProfiles();
}
