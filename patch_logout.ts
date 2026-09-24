import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const logoutOriginal = `  const handleLogout = () => {
    setUserRole(null);
    setUserName("");
    setAppState('landing');
    setActiveTab('dashboard');
  };`;

const logoutNew = `  const handleLogout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (error) {
      console.error(error);
    }
    setUserRole(null);
    setUserName("");
    setAppState('landing');
    setActiveTab('dashboard');
  };`;

content = content.replace(logoutOriginal, logoutNew);
fs.writeFileSync('src/App.tsx', content);
