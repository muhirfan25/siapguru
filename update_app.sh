sed -i "/const \[userRole, setUserRole\] = useState/a\  const [userName, setUserName] = useState<string>(() => {\n    return localStorage.getItem(\"edadmin_user_name\") || \"\";\n  });" src/App.tsx
sed -i "/localStorage.setItem(\"edadmin_user_role\", userRole);/a\      localStorage.setItem(\"edadmin_user_name\", userName);" src/App.tsx
sed -i "/localStorage.removeItem(\"edadmin_user_role\");/a\      localStorage.removeItem(\"edadmin_user_name\");" src/App.tsx
sed -i "/setUserRole(null);/a\    setUserName(\"\");" src/App.tsx
sed -i "s/onLoginSuccess={(role) => {/onLoginSuccess={(role, name = \"\") => {/" src/App.tsx
sed -i "/setUserRole(role);/a\          setUserName(name);" src/App.tsx
