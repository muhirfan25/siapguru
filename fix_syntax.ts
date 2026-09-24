import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(
  /<LoginView[\s\S]*?guruList=\{guruList\}\s*\/>/,
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
fs.writeFileSync('src/App.tsx', content);
