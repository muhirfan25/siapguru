sed -i "s/onLoginSuccess: (role: 'guru' | 'admin') => void;/onLoginSuccess: (role: 'guru' | 'admin', name?: string) => void;/g" src/components/LoginView.tsx
sed -i "s/onLoginSuccess('admin');/onLoginSuccess('admin', 'Admin');/g" src/components/LoginView.tsx
sed -i "s/onLoginSuccess('guru');/onLoginSuccess('guru', matchedGuru ? matchedGuru.nama : 'Guru');/g" src/components/LoginView.tsx
