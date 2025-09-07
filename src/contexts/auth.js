import React, { createContext, useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../src/service/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";

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
        const docRef = doc(db, "appointments", currentUser.uid);
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

    return () => unsubscribe(); // limpa listener ao desmontar
  }, []);

  // Login
  async function signIn(email, password) {
    setLoading(true);
    try {
      const value = await signInWithEmailAndPassword(auth, email, password);
      const uid = value.user.uid;

      const docRef = doc(db, "appointments", uid);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        setUser(snapshot.data());
        await fetchAppointmentsByUser(uid); // carrega agendamentos
        return { success: true, user: snapshot.data() };
      } else {
        alert("Usuário não encontrado no banco de dados.");
        return { success: false };
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") alert("Usuário não encontrado.");
      else if (error.code === "auth/wrong-password") alert("Senha incorreta.");
      else if (error.code === "auth/invalid-email") alert("E-mail inválido.");
      else {
        console.log("Erro no login:", error);
        alert("Erro ao fazer login. Tente novamente.");
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  }

  // Cadastro
  async function signUp(name, email, password) {
    setLoading(true);
    try {
      const value = await createUserWithEmailAndPassword(auth, email, password);
      const uid = value.user.uid;
      const docRef = doc(db, "appointments", uid);
      await setDoc(docRef, { uid, name, email, createdAt: new Date() });
      alert("Usuário criado com sucesso!");
      return { success: true };
    } catch (error) {
      if (error.code === "auth/email-already-in-use") alert("Esse e-mail já está cadastrado.");
      else if (error.code === "auth/weak-password") alert("A senha deve ter pelo menos 6 caracteres.");
      else if (error.code === "auth/invalid-email") alert("O e-mail informado não é válido.");
      else {
        console.log("Erro no cadastro:", error);
        alert("Erro ao criar usuário. Tente novamente.");
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  }

  // Logout
  async function logout() {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setAppointments([]);
      return { success: true };
    } catch (error) {
      console.log("Erro ao deslogar:", error);
      return { success: false };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        appointments,
        loading,
        initializing, // adiciona initializing para controlar tela de loading
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
