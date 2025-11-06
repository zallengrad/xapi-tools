import { redirect } from "next/navigation";

export default function AnalysisIdRootPage({ params }) {
  // Arahkan ke tab "Overview" secara default
  redirect(`/dashboard/analysis/${params.id}/overview`);
  return null;
}
