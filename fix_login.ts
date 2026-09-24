import fs from 'fs';
let content = fs.readFileSync('src/components/LoginView.tsx', 'utf-8');

const targetTryCatch = `        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
          if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // After creation, if it's superadmin, we don't need a users doc strictly, but good to have
            if (email === 'pbmirfan81@gmail.com') {
              await setDoc(doc(firestore, COLLECTIONS.USERS, userCredential.user.uid), {
                email,
                role: 'superadmin',
                updatedAt: Date.now()
              });
            } else {
              // Create default admin_sekolah doc
              await setDoc(doc(firestore, COLLECTIONS.USERS, userCredential.user.uid), {
                email,
                role: 'admin_sekolah',
                sekolahId: '',
                updatedAt: Date.now()
              });
            }
          } else {
            throw error; // Rethrow other errors
          }
        }`;

const replacementTryCatch = `        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
          if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            try {
              userCredential = await createUserWithEmailAndPassword(auth, email, password);
              // After creation, if it's superadmin, we don't need a users doc strictly, but good to have
              if (email === 'pbmirfan81@gmail.com') {
                await setDoc(doc(firestore, COLLECTIONS.USERS, userCredential.user.uid), {
                  email,
                  role: 'superadmin',
                  updatedAt: Date.now()
                });
              } else {
                // Create default admin_sekolah doc
                await setDoc(doc(firestore, COLLECTIONS.USERS, userCredential.user.uid), {
                  email,
                  role: 'admin_sekolah',
                  sekolahId: '',
                  updatedAt: Date.now()
                });
              }
            } catch (createError: any) {
              if (createError.code === 'auth/email-already-in-use') {
                throw new Error('password-salah');
              }
              throw createError;
            }
          } else {
            throw error; // Rethrow other errors
          }
        }`;

content = content.replace(targetTryCatch, replacementTryCatch);

const targetOuterCatch = `      } catch (error: any) {
        console.error("Login admin error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: error.code === 'auth/email-already-in-use' ? 'Password salah untuk email ini!' : 'Email atau Password salah!',
          confirmButtonColor: '#3b82f6',
          timer: 3000
        });
      }`;

const replacementOuterCatch = `      } catch (error: any) {
        if (error.message !== 'password-salah') {
          console.error("Login admin error:", error);
        }
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: (error.message === 'password-salah' || error.code === 'auth/email-already-in-use') ? 'Password salah untuk email ini!' : 'Email atau Password salah!',
          confirmButtonColor: '#3b82f6',
          timer: 3000
        });
      }`;

content = content.replace(targetOuterCatch, replacementOuterCatch);

fs.writeFileSync('src/components/LoginView.tsx', content);
console.log("LoginView patched");
