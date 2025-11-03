import DashboardLayout from "@/components/layout/DashboardLayout";

// Metadata bisa Anda definisikan di sini
export const metadata = {
  title: "DevLens Dashboard",
  description: "Analisis data xAPI Anda.",
};

/**
 * Layout ini HANYA akan berlaku untuk halaman-halaman
 * di dalam folder (dashboard), yaitu /convert dan /analysis.
 * * Ia akan menerima 'children' (page.jsx) dan membungkusnya
 * dengan 'DashboardLayout' kita.
 */
export default function LayoutForDashboardPages({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
