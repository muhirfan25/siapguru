#!/bin/bash
sed -i '/const \[userName, setUserName\]/i \  const [sekolahId, setSekolahId] = useState<string>(() => {\n    return localStorage.getItem("edadmin_sekolah_id") || "";\n  });\n' src/App.tsx
