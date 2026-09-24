import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('setGlobalSekolahId')) {
  // 1. Add import
  content = content.replace(
    `export {`, 
    `export { setGlobalSekolahId,\n`
  ); // wait, it imports from ./lib/firebase

  content = content.replace(
    `savePengaturan,`,
    `savePengaturan,\n  setGlobalSekolahId,`
  );

  // 2. Add effect
  const effectStr = `
  useEffect(() => {
    setGlobalSekolahId(sekolahId);
  }, [sekolahId]);
  `;
  content = content.replace(
    `const [isLoading, setIsLoading] = useState(true);`,
    `const [isLoading, setIsLoading] = useState(true);\n${effectStr}`
  );
  
  fs.writeFileSync('src/App.tsx', content);
  console.log('App.tsx updated');
}
