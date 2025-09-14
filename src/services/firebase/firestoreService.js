import { db } from './firebaseConnection';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';

/**
 * Buscar agendamentos do usuário
 * @param {string} userId
 * @returns {Promise<Array>} Lista de agendamentos
 */
export async function getAgendamentos(userId) {
  const agendamentosRef = collection(db, 'agendamentos');
  const q = query(agendamentosRef, where('uid', '==', userId));
  const querySnapshot = await getDocs(q);

  const agendamentos = [];
  querySnapshot.forEach((doc) => {
    agendamentos.push({ ...doc.data(), id: doc.id });
  });

  return agendamentos.map((agenda) => ({
    ...agenda,
    status: agenda.status || 'Pendente',
  }));
}

/**
 * Listener em tempo real
 * @param {string} userId
 * @param {function} callback
 * @returns {function} unsubscribe
 */
export function listenAgendamentos(userId, callback) {
  const agendamentosRef = collection(db, 'agendamentos');
  const q = query(agendamentosRef, where('uid', '==', userId));

  return onSnapshot(q, (querySnapshot) => {
    const agendamentos = [];
    querySnapshot.forEach((doc) => {
      agendamentos.push({ ...doc.data(), id: doc.id });
    });
    callback(
      agendamentos.map((agenda) => ({
        ...agenda,
        status: agenda.status || 'Pendente',
      }))
    );
  });
}

/**
 * Criar agendamento
 * @param {Object} agendamento
 */
export async function createAgendamento(agendamento) {
  return await addDoc(collection(db, 'agendamentos'), agendamento);
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
