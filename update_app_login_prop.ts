import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const loginRenderOriginal = `      <LoginView 
        onLoginSuccess={(role, name = "") => {
          setUserRole(role);
          setUserName(name);
          setAppState('dashboard');
        }} 
        onBack={() => setAppState('landing')} 
        
      />`;

const loginRenderNew = `      <LoginView 
        onLoginSuccess={(role, name = "") => {
          setUserRole(role);
          setUserName(name);
          setAppState('dashboard');
        }} 
        onBack={() => setAppState('landing')} 
        guruList={guruList}
      />`;

content = content.replace(loginRenderOriginal, loginRenderNew);
fs.writeFileSync('src/App.tsx', content);
