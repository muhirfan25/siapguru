import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add Firebase Auth imports
content = content.replace(
  'import { \n  subscribeCollection',
  'import { onAuthStateChanged, signOut } from "firebase/auth";\nimport { auth } from "./lib/firebase";\nimport { \n  subscribeCollection'
);

// Replace Auth State Hooks
const authHooksOriginal = `  // Authentication State
  const [appState, setAppState] = useState<'landing' | 'login' | 'dashboard'>(() => {
    return (localStorage.getItem("edadmin_auth_state") as 'landing' | 'login' | 'dashboard') || "landing";
  });
  
  const [userRole, setUserRole] = useState<'guru' | 'admin' | null>(() => {
    return (localStorage.getItem("edadmin_user_role") as 'guru' | 'admin' | null) || null;
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("edadmin_user_name") || "";
  });

  // Sync auth state
  useEffect(() => {
    localStorage.setItem("edadmin_auth_state", appState);
    if (userRole) {
      localStorage.setItem("edadmin_user_role", userRole);
      localStorage.setItem("edadmin_user_name", userName);
    } else {
      localStorage.removeItem("edadmin_user_role");
      localStorage.removeItem("edadmin_user_name");
    }
  }, [appState, userRole, userName]);`;

const authHooksNew = `  // Authentication State
  const [appState, setAppState] = useState<'landing' | 'login' | 'dashboard'>(() => {
    return (localStorage.getItem("edadmin_auth_state") as 'landing' | 'login' | 'dashboard') || "landing";
  });
  const [userRole, setUserRole] = useState<'guru' | 'admin' | null>(() => {
    return (localStorage.getItem("edadmin_user_role") as 'guru' | 'admin' | null) || null;
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("edadmin_user_name") || "";
  });

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If a user is logged in, we check if they are the special admin, or a guru.
        // For simplicity, if their email starts with 'admin', or they are the superadmin email, they are admin.
        // Otherwise, they are a guru.
        const email = user.email || '';
        const isAdmin = email.toLowerCase().startsWith('admin') || email.toLowerCase() === 'pbmirfan81@gmail.com';
        
        setUserRole(isAdmin ? 'admin' : 'guru');
        setUserName(user.displayName || email.split('@')[0] || 'User');
        setAppState('dashboard');
        
        localStorage.setItem("edadmin_auth_state", 'dashboard');
        localStorage.setItem("edadmin_user_role", isAdmin ? 'admin' : 'guru');
        localStorage.setItem("edadmin_user_name", user.displayName || email.split('@')[0]);
      } else {
        // Logged out
        if (appState === 'dashboard') {
          setAppState('landing');
        }
        setUserRole(null);
        setUserName('');
        localStorage.removeItem("edadmin_auth_state");
        localStorage.removeItem("edadmin_user_role");
        localStorage.removeItem("edadmin_user_name");
      }
    });

    return () => unsubscribe();
  }, [appState]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAppState('landing');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };`;

content = content.replace(authHooksOriginal, authHooksNew);

// Replace onLogout={...} with onLogout={handleLogout}
content = content.replace(
  /onLogout=\{\(\) => \{\n\s*setAppState\('landing'\);\n\s*setUserRole\(null\);\n\s*setUserName\(''\);\n\s*\}\}/g,
  'onLogout={handleLogout}'
);

fs.writeFileSync('src/App.tsx', content);
