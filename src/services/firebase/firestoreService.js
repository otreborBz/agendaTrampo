import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
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
