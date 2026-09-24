#!/bin/bash
sed -i 's/userRole: '"'"'superadmin'"'"' | '"'"'admin_sekolah'"'"' | '"'"'guru'"'"' | null;/userRole: '"'"'superadmin'"'"' | '"'"'admin_sekolah'"'"' | '"'"'guru'"'"' | null;\n  sekolahId?: string;/' src/components/Sidebar.tsx
sed -i 's/userRole?: "admin" | "guru" | null;/userRole?: "superadmin" | "admin_sekolah" | "guru" | string | null;\n  sekolahId?: string;/' src/components/DashboardView.tsx
sed -i 's/userRole?: "admin" | "guru" | null;/userRole?: "superadmin" | "admin_sekolah" | "guru" | string | null;\n  sekolahId?: string;/' src/components/PengaturanView.tsx
