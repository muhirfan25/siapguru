import fs from 'fs';

// App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace(
  `<ResetDatabaseView onSuccessReset={handleSuccessReset} />`,
  `<ResetDatabaseView onSuccessReset={handleSuccessReset} userRole={userRole} sekolahId={sekolahId} />`
);
fs.writeFileSync('src/App.tsx', appContent);

// ResetDatabaseView.tsx
let resetContent = fs.readFileSync('src/components/ResetDatabaseView.tsx', 'utf-8');

const regexProps = /interface ResetDatabaseViewProps \{[\s\S]*?\}/;
resetContent = resetContent.replace(regexProps, `interface ResetDatabaseViewProps {
  onSuccessReset: () => void;
  userRole?: string | null;
  sekolahId?: string;
}`);

resetContent = resetContent.replace(
  `export const ResetDatabaseView: React.FC<ResetDatabaseViewProps> = ({ onSuccessReset }) => {`,
  `export const ResetDatabaseView: React.FC<ResetDatabaseViewProps> = ({ onSuccessReset, userRole, sekolahId }) => {`
);

resetContent = resetContent.replace(
  `await clearAllDatabaseCollections();`,
  `const targetSekolahId = userRole === 'superadmin' ? undefined : sekolahId;
      await clearAllDatabaseCollections(targetSekolahId);`
);

// Optional: update wording so it says "of all schools" for superadmin, or "of your school" for admin.
resetContent = resetContent.replace(
  `Seluruh isi database telah dibersihkan secara permanen`,
  `Data berhasil dihapus`
);

fs.writeFileSync('src/components/ResetDatabaseView.tsx', resetContent);
console.log("ResetDB patched");
