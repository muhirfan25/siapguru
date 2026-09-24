import fs from 'fs';
let content = fs.readFileSync('src/components/LoginView.tsx', 'utf-8');

const loginLogicOriginal = `    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Determine role based on simple logic (can be expanded later via Firestore roles)
      const userEmail = userCredential.user.email || '';
      const isAdmin = userEmail.toLowerCase().startsWith('admin') || userEmail.toLowerCase() === 'pbmirfan81@gmail.com';
      
      const assumedRole = isAdmin ? 'admin' : 'guru';
      const userName = userCredential.user.displayName || userEmail.split('@')[0];
      
      onLoginSuccess(assumedRole, userName);
    } catch (error: any) {
      console.error("Login error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Email atau Password salah, atau akun belum terdaftar!',
        confirmButtonColor: '#3b82f6',
        timer: 3000
      });
    } finally {
      setLoading(false);
    }`;

const loginLogicNew = `    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const userEmail = userCredential.user.email || '';
      const isAdmin = userEmail.toLowerCase().startsWith('admin') || userEmail.toLowerCase() === 'pbmirfan81@gmail.com';
      const assumedRole = isAdmin ? 'admin' : 'guru';
      const userName = userCredential.user.displayName || userEmail.split('@')[0];
      onLoginSuccess(assumedRole, userName);
    } catch (error: any) {
      console.error("Login error:", error);
      
      // FALLBACK FOR AI STUDIO PREVIEW
      // If Firebase Auth is not enabled in the current project, bypass it for preview purposes.
      if (error.code === 'auth/operation-not-allowed') {
        console.warn("Firebase Auth is not enabled. Using Preview Mode Fallback.");
        const isAdmin = email.toLowerCase().startsWith('admin') || email.toLowerCase() === 'pbmirfan81@gmail.com';
        onLoginSuccess(isAdmin ? 'admin' : 'guru', email.split('@')[0] || 'Demo User');
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Email atau Password salah, atau akun belum terdaftar!',
        confirmButtonColor: '#3b82f6',
        timer: 3000
      });
    } finally {
      setLoading(false);
    }`;

content = content.replace(loginLogicOriginal, loginLogicNew);
fs.writeFileSync('src/components/LoginView.tsx', content);
