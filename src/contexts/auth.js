import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase/firebaseConnection";

import { saveTermsAcceptance } from "../services/firebase/firestoreService";
import { deleteUserAccount, logoutUser, signInUser, signUpUser, validarSenha } from "../services/firebase/userService";

const TERMS_VERSION = "1.0";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true); // controla o primeiro carregamento

  // Detecta automaticamente se o usuário está logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setInitializing(true);
      if (currentUser) {
        setLoading(true);

        // Busca dados do usuário no Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setUser(snapshot.data());
        }

        setLoading(false);
      } else {
        setUser(null);
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  // Logar o usuario
  async function signIn(email, password) {
    setLoading(true);
    try {
      await signInUser(email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }

  // Cadastro novo usuário
  async function signUp(name, email, password) {
    setLoading(true);
    //Valida a senha
    if (!validarSenha(password)) {
      return { success: false, message: "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número." };
    }

    try {
      const createdUser = await signUpUser(name, email, password);

      // Salva o aceite dos termos de uso
      await saveTermsAcceptance(createdUser.uid, {
        acceptedTerms: true,
        acceptedAt: new Date().toISOString(),
        termsVersion: TERMS_VERSION,
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }

  }

  // Deslogar o usuario
  async function signOut() {
    try {
      await logoutUser();
      return { success: true };
    } catch (error) {
      console.log("Erro ao deslogar:", error);
      return { success: false, message: error.message };
    }
  }

  // Excluir conta do usuário
  async function deleteAccount() {
    setLoading(true);
    try {
      await deleteUserAccount();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initializing,
        signUp,
        signIn,
        signOut,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
