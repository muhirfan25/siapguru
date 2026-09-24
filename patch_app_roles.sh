#!/bin/bash

# Update App.tsx state to include sekolahId
sed -i "s/const \[userRole, setUserRole\] = useState<'guru' | 'admin' | null>/const \[userRole, setUserRole\] = useState<'superadmin' | 'admin_sekolah' | 'guru' | null>/" src/App.tsx
sed -i "s/onLoginSuccess={(role, name) => {/onLoginSuccess={(role, name, sid) => {/" src/App.tsx
sed -i "s/setUserName(name || '');/setUserName(name || '');\n          setSekolahId(sid || '');/" src/App.tsx

