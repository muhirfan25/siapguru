import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace the if-else for subscriptions
const oldLogic = `if (userRole === 'superadmin') {
      // Superadmin might not need to load all schools' data into state, just let components fetch what they need.
      setIsConnected(true);
    } else if (sekolahId) {
      unsubs.push(subscribeCollection<any>(COLLECTIONS.GURU, (data) => {
        setGuruList(data);
        
      }, sekolahId));`;

const newLogic = `if (userRole === 'superadmin' || sekolahId) {
      const targetSekolahId = userRole === 'superadmin' ? undefined : sekolahId;
      unsubs.push(subscribeCollection<any>(COLLECTIONS.GURU, (data) => {
        setGuruList(data);
        setIsConnected(true);
      }, targetSekolahId));`;

content = content.replace(oldLogic, newLogic);

// Make sure to replace all `sekolahId` arguments with `targetSekolahId` for the rest of the subscriptions in that block
const replaceBlock = (str: string) => {
    return str.replace(/, sekolahId\)\);/g, ', targetSekolahId));');
}

// Find the block from `unsubs.push(subscribeCollection<any>(COLLECTIONS.SISWA` down to `}`
// Actually just replace globally in App.tsx since ", sekolahId));" is unique enough
content = content.replace(/, sekolahId\)\);/g, ', targetSekolahId));');

fs.writeFileSync('src/App.tsx', content);
