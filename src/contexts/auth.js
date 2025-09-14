import React, { createContext, useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase/firebaseConnection";
import {signOut as firebaseSignOut, onAuthStateChanged} from "firebase/auth";


import { signInUser, signUpUser, logoutUser } from "../services/firebase/loginService";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true); // controla o primeiro carregamento

  // Função para buscar agendamentos do usuário
  async function fetchAppointmentsByUser(uid) {
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(appointmentsRef, where("uid", "==", uid));
      const snapshot = await getDocs(q);

      const userAppointments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAppointments(userAppointments);
    } catch (error) {
      console.log("Erro ao buscar agendamentos:", error);
      setAppointments([]);
    }
  }

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

        // Busca agendamentos
        await fetchAppointmentsByUser(currentUser.uid);

        setLoading(false);
      } else {
        setUser(null);
        setAppointments([]);
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
    try {
      await signUpUser(name, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);  
    }
  
  }

  // Deslogar o usuario
  async function logout() {
    try {
      await logoutUser();
      return { success: true };
    } catch (error) {
      console.log("Erro ao deslogar:", error);
      return { success: false, message: error.message };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        appointments,
        loading,
        initializing,
        signUp,
        signIn,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
