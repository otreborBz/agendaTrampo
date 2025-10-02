import { createUserWithEmailAndPassword, deleteUser, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConnection';
import { deleteUserData as deleteFirestoreUserData } from './firestoreService';

/**
 * Autentica um usuário com email e senha e busca seus dados no Firestore.
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<object>} - Retorna o objeto do usuário do Firestore.
 * @throws {Error} - Lança um erro com uma mensagem amigável em caso de falha.
 */
export async function signInUser(email, password) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      // O usuário existe na autenticação, mas não no Firestore.
      // Isso pode acontecer se o documento foi excluído manualmente.
      // Vamos recriar o documento do usuário para evitar o bloqueio do login.
      console.warn(`Recriando documento para o usuário ${user.uid} que não foi encontrado no Firestore.`);
      const userData = { uid: user.uid, email: user.email, name: user.email, createdAt: new Date() };
      await setDoc(userDocRef, userData);
      return userData;
    }
  } catch (error) {
    if (["auth/user-not-found", "auth/wrong-password", "auth/invalid-credential"].includes(error.code)) {
      throw new Error("E-mail ou senha inválidos.");
    }
    console.error("Erro em signInUser:", error);
    throw new Error("Não foi possível fazer login. Tente novamente.");
  }
}

/**
 * Cria um novo usuário com email/senha e salva seus dados no Firestore.
 * @param {string} name - O nome do usuário.
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<object>} - Retorna o objeto do usuário criado em caso de sucesso.
 * @throws {Error} - Lança um erro com uma mensagem amigável em caso de falha.
 */
export async function signUpUser(name, email, password) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, { uid: user.uid, name, email, createdAt: new Date() });
    return user;
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Este e-mail já está em uso.");
    } else if (error.code === "auth/weak-password") {
      throw new Error("A senha deve ter pelo menos 6 caracteres.");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("O e-mail informado não é válido.");
    }
    console.error("Erro em signUpUser:", error);
    throw new Error("Não foi possível criar o usuário. Tente novamente.");
  }
}


/**
 * Desloga o usuário atual do Firebase.
 * @returns {Promise<void>}
 * @throws {Error} Lança um erro se não for possível fazer logout.
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro em logoutUser:", error);
    throw new Error("Não foi possível fazer logout. Tente novamente.");
  }
}

/** 
Verifica senha inserida se tem minuscula, maiuscula, numero e minimo de 8 caracter
@returns {boolean}
@throws {Error}
**/
export function validarSenha(senha) {
  const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!regexSenha.test(senha)) {
    throw new Error("A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.");
  }
  return true;
}

/**
 * 
 * @param {String} email 
 * @returns { boolean}
 * @throws {Error}
 */
export async function redefinirSenha(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw new Error("Não foi possível redefinir a senha. Verifique o email digitado e tente novamente.");
  }
}

/**
 * Exclui a conta do usuário logado e todos os seus dados.
 * Requer que o usuário tenha feito login recentemente.
 * @returns {Promise<void>}
 * @throws {Error} Lança um erro com uma mensagem amigável em caso de falha.
 */
export async function deleteUserAccount() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Nenhum usuário logado para excluir.");
  }

  try {
    // 1. Excluir todos os dados do usuário no Firestore
    await deleteFirestoreUserData(user.uid);

    // 2. Excluir o usuário do Firebase Authentication
    await deleteUser(user);

  } catch (error) {
    console.error("Erro ao excluir conta do usuário:", error);
    if (error.code === 'auth/requires-recent-login') {
      throw new Error("Esta é uma operação sensível. Por favor, faça login novamente antes de excluir sua conta.");
    }
    throw new Error("Não foi possível excluir a conta. Tente novamente mais tarde.");
  }
}
