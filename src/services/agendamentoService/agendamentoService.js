import { createAgendamento, updateAgendamento } from '../firebase/firestoreService';

/**
 * Salva ou atualiza um agendamento no Firestore.
 * @param {object} agendamentoData - Os dados do agendamento.
 * @param {string|null} agendamentoId - O ID do agendamento para edição, ou null para criação.
 * @throws {Error} - Lança um erro se campos obrigatórios estiverem faltando ou se houver falha na operação.
 */
export async function salvarAgendamento(agendamentoData, agendamentoId = null) {
  const { nomeCliente, telefone, dataHora, ...rest } = agendamentoData;

  if (!nomeCliente || !telefone || !dataHora) {
    throw new Error("Preencha todos os campos obrigatórios: Nome, Telefone, Data e Hora.");
  }

  const dadosParaSalvar = {
    nomeCliente,
    telefone,
    dataHora: dataHora.toISOString(),
    ...rest,
    servico: rest.servico || null,
    valor: rest.valor || null,
    endereco: rest.endereco && Object.values(rest.endereco).some(e => e) ? rest.endereco : null,
  };

  try {
    if (agendamentoId) {
      await updateAgendamento(agendamentoId, dadosParaSalvar);
    } else {
      await createAgendamento(dadosParaSalvar);
    }
  } catch (error) {
    console.error("Erro em salvarAgendamento:", error);
    throw new Error(`Não foi possível ${agendamentoId ? 'atualizar' : 'cadastrar'} o agendamento.`);
  }
}
