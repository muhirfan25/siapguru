import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Imports
if (!content.includes('KelolaSekolahView')) {
  content = content.replace(
    'import { LoginView } from "./components/LoginView";',
    'import { LoginView } from "./components/LoginView";\nimport { DashboardSuperadminView } from "./components/DashboardSuperadminView";'
  );
}

// 2. Roles and sekolahId
content = content.replace(
  /const \[userRole, setUserRole\] = useState<'guru' \| 'admin' \| null>\(\(\) => \{[^}]*\}\);/,
  `const [userRole, setUserRole] = useState<'superadmin' | 'admin_sekolah' | 'guru' | null>(() => {
    return (localStorage.getItem("edadmin_user_role") as 'superadmin' | 'admin_sekolah' | 'guru' | null) || null;
  });
  
  const [sekolahId, setSekolahId] = useState<string>(() => {
    return localStorage.getItem("edadmin_sekolah_id") || "";
  });`
);

// 3. sync auth state
content = content.replace(
  /localStorage\.setItem\("edadmin_user_name", userName\);/g,
  `localStorage.setItem("edadmin_user_name", userName);\n      localStorage.setItem("edadmin_sekolah_id", sekolahId);`
);
content = content.replace(
  /localStorage\.removeItem\("edadmin_user_name"\);/g,
  `localStorage.removeItem("edadmin_user_name");\n      localStorage.removeItem("edadmin_sekolah_id");`
);
content = content.replace(
  /\[appState, userRole\]/g,
  `[appState, userRole, sekolahId, userName]`
);

content = content.replace(
  /setUserName\(""\);/g,
  `setUserName("");\n    setSekolahId("");`
);

// 4. Subscriptions to include sekolahId
const collectionMapping = [
  { coll: 'GURU', set: 'setGuruList' },
  { coll: 'SISWA', set: 'setSiswaList' },
  { coll: 'MAPEL', set: 'setMapelList' },
  { coll: 'JADWAL', set: 'setJadwalList' },
  { coll: 'LOG_ABSENSI', set: 'setAbsensiList' },
  { coll: 'DATA_NILAI', set: 'setNilaiList' },
  { coll: 'JURNAL_AGENDA', set: 'setAgendaList' },
  { coll: 'SISWA_BIMBINGAN', set: 'setSiswaBimbinganList' },
  { coll: 'BIMBINGAN_WALI', set: 'setBimbinganList' },
  { coll: 'CATATAN_GURU', set: 'setCatatanList' },
  { coll: 'ARSIP_PERANGKAT', set: 'setArsipList' },
];

let subContent = '  useEffect(() => {\n    let unsubs: Array<() => void> = [];\n\n';
subContent += `    if (userRole === 'superadmin') {
      // Superadmin might not need to load all schools' data into state, just let components fetch what they need.
      setIsConnected(true);
    } else if (sekolahId) {\n`;

collectionMapping.forEach(({coll, set}) => {
  subContent += `      unsubs.push(subscribeCollection<any>(COLLECTIONS.${coll}, (data) => {
        ${set}(data);
        ${coll === 'SISWA' ? 'setIsConnected(true);' : ''}
      }, sekolahId));\n\n`;
});

subContent += `      unsubs.push(subscribePengaturan((cfg) => {
        if (cfg && Object.keys(cfg).length > 0) {
          setConfig((prev) => ({ ...prev, ...cfg }));
        }
      }, sekolahId));
    }
    
    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [userRole, sekolahId]);`;

// Replace existing useEffect for subscriptions
const useEffStart = content.indexOf('  // Subscribe to Firebase real-time collections');
const useEffEnd = content.indexOf('  }, []);') + 9;
if (useEffStart > -1 && useEffEnd > useEffStart) {
  content = content.substring(0, useEffStart) + '  // Subscribe to Firebase real-time collections\n' + subContent + content.substring(useEffEnd);
}

// 5. App State Rendering
content = content.replace(
  /<LoginView [^>]+>/,
  `<LoginView 
          onLoginSuccess={(role, name, sid) => {
            setUserRole(role);
            setUserName(name || '');
            setSekolahId(sid || '');
            setAppState('dashboard');
            setActiveTab('dashboard');
          }}
          onBack={() => setAppState('landing')} 
        />`
);

content = content.replace(/userRole={userRole}/g, 'userRole={userRole} sekolahId={sekolahId}');

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx patched successfully');
