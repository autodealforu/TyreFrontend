import type React from "react"
export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">{children}</div>
}
