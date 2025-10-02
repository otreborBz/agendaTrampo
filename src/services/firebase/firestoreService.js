import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from './firebaseConnection';

/**
 * Transforma um documento do Firestore em um objeto de agendamento, garantindo o ID.
 * @param {import('firebase/firestore').DocumentSnapshot} doc - O documento do Firestore.
 * @returns {object} O objeto de agendamento com id.
 */
const transformDocToAgendamento = (doc) => ({
  ...doc.data(),
  id: doc.id,
});

/**
 * Buscar agendamentos do usuário
 * @param {string} userId
 * @returns {Promise<Array>} Lista de agendamentos
 */
export async function getAgendamentos(userId) {
  const agendamentosRef = collection(db, 'agendamentos');
  const q = query(agendamentosRef, where('uid', '==', userId));
  const querySnapshot = await getDocs(q);

  // Usa a função auxiliar para transformar os documentos e evitar repetição de código.
  return querySnapshot.docs.map(transformDocToAgendamento);
}

/**
 * Listener em tempo real
 * @param {string} userId
 * @param {function} onData - Callback para sucesso, recebe a lista de agendamentos.
 * @param {function} onError - Callback para falha.
 * @returns {function} unsubscribe
 */
export function listenAgendamentos(userId, onData, onError) {
  const agendamentosRef = collection(db, 'agendamentos');
  const q = query(agendamentosRef, where('uid', '==', userId));

  return onSnapshot(q,
    (querySnapshot) => { // Callback de sucesso
      const agendamentos = querySnapshot.docs.map(transformDocToAgendamento);
      onData(agendamentos);
    },
    (error) => { // Callback de erro
      console.error("Erro no listener de agendamentos:", error);
      onError(error);
    }
  );
}

/**
 * Criar agendamento
 * @param {Object} agendamento
 */
export async function createAgendamento(agendamento) {
  // Garante que todo novo agendamento tenha um status padrão e data de criação.
  const newAgendamento = {
    ...agendamento,
    status: agendamento.status || 'Pendente',
    createdAt: new Date(),
  };
  return await addDoc(collection(db, 'agendamentos'), newAgendamento);
}

/**
 * Atualizar agendamento
 * @param {string} id
 * @param {Object} data
 */
export async function updateAgendamento(id, data) {
  const agendamentoRef = doc(db, 'agendamentos', id);
  return await updateDoc(agendamentoRef, data);
}

/**
 * Deletar agendamento
 * @param {string} id
 */
export async function deleteAgendamento(id) {
  const agendamentoRef = doc(db, 'agendamentos', id);
  return await deleteDoc(agendamentoRef);
}

/**
 * Salva o aceite dos termos de uso de um usuário.
 * @param {string} uid - O ID do usuário.
 * @param {object} termsData - Os dados do aceite dos termos.
 */
export const saveTermsAcceptance = async (uid, termsData) => {
  if (!uid) {
    throw new Error("UID do usuário é necessário para salvar o aceite dos termos.");
  }
  try {
    const termsRef = doc(db, 'user_terms', uid);
    await setDoc(termsRef, termsData);
  } catch (error) {
    console.error("Erro ao salvar aceite dos termos: ", error);
    throw new Error("Não foi possível salvar o aceite dos termos.");
  }
};

/**
 * Exclui todos os dados de um usuário do Firestore (perfil, agendamentos, termos).
 * @param {string} userId - O ID do usuário a ser excluído.
 * @throws {Error} Lança um erro se a exclusão falhar.
 */
export async function deleteUserData(userId) {
  if (!userId) {
    throw new Error("UID do usuário é necessário para excluir os dados.");
  }

  try {
    // 1. Excluir agendamentos do usuário
    const agendamentosRef = collection(db, 'agendamentos');
    const q = query(agendamentosRef, where('uid', '==', userId));
    const querySnapshot = await getDocs(q);
    // Usar um lote para deletar todos os documentos de uma vez é mais eficiente
    const deletePromises = [];
    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(document.ref));
    });
    await Promise.all(deletePromises);

    // 2. Excluir documento do usuário da coleção 'users'
    await deleteDoc(doc(db, 'users', userId));

    // 3. Excluir documento de aceite de termos da coleção 'user_terms'
    await deleteDoc(doc(db, 'user_terms', userId));

  } catch (error) {
    console.error("Erro ao excluir dados do usuário do Firestore:", error);
    throw new Error("Não foi possível excluir os dados do usuário. Tente novamente.");
  }
}
