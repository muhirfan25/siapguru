sed -i '/interface DashboardViewProps {/a\  userRole?: "admin" | "guru" | null;\n  userName?: string;' src/components/DashboardView.tsx
sed -i 's/export const DashboardView: React.FC<DashboardViewProps> = ({/export const DashboardView: React.FC<DashboardViewProps> = ({\n  userRole,\n  userName,/' src/components/DashboardView.tsx
