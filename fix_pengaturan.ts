import fs from 'fs';
let content = fs.readFileSync('src/components/PengaturanView.tsx', 'utf-8');

// Update Props
const propsRegex = /interface PengaturanViewProps \{[\s\S]*?\}/;
content = content.replace(propsRegex, `interface PengaturanViewProps {
  config: Pengaturan;
  userRole?: string | null;
  sekolahId?: string;
}`);

// Update Component signature
content = content.replace(
  `export const PengaturanView: React.FC<PengaturanViewProps> = ({ config }) => {`,
  `export const PengaturanView: React.FC<PengaturanViewProps> = ({ config, userRole, sekolahId }) => {`
);

// Update savePengaturan call
content = content.replace(
  `await savePengaturan(form);`,
  `const targetSekolahId = userRole === 'superadmin' ? undefined : sekolahId;
      await savePengaturan(form, targetSekolahId);`
);

fs.writeFileSync('src/components/PengaturanView.tsx', content);

// Update App.tsx where PengaturanView is used
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace(
  `<PengaturanView config={config} />`,
  `<PengaturanView config={config} userRole={userRole} sekolahId={sekolahId} />`
);
fs.writeFileSync('src/App.tsx', appContent);

console.log("PengaturanView patched");
