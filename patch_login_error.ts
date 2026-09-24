import fs from 'fs';
let content = fs.readFileSync('src/components/LoginView.tsx', 'utf-8');

const original = `    } catch (error: any) {
      console.error("Login error:", error);
      
      // FALLBACK FOR AI STUDIO PREVIEW
      // If Firebase Auth is not enabled in the current project, bypass it for preview purposes.
      if (error.code === 'auth/operation-not-allowed') {
        console.warn("Firebase Auth is not enabled. Using Preview Mode Fallback.");
        const isAdmin = email.toLowerCase().startsWith('admin') || email.toLowerCase() === 'pbmirfan81@gmail.com';
        onLoginSuccess(isAdmin ? 'admin' : 'guru', email.split('@')[0] || 'Demo User');
        return;
      }`;

const replacement = `    } catch (error: any) {
      // FALLBACK FOR AI STUDIO PREVIEW
      // If Firebase Auth is not enabled in the current project, bypass it for preview purposes.
      if (error.code === 'auth/operation-not-allowed') {
        console.warn("Firebase Auth is not enabled. Using Preview Mode Fallback.");
        const isAdmin = email.toLowerCase().startsWith('admin') || email.toLowerCase() === 'pbmirfan81@gmail.com';
        onLoginSuccess(isAdmin ? 'admin' : 'guru', email.split('@')[0] || 'Demo User');
        setLoading(false);
        return;
      }

      console.error("Login error:", error);`;

content = content.replace(original, replacement);
fs.writeFileSync('src/components/LoginView.tsx', content);
