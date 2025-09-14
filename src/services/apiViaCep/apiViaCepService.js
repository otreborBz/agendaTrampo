import apiViaCep from './apiViaCep';

/**
 * Buscar endereço pelo CEP
 * @param {string} cep
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export async function buscarCep(cep) {
  const cepSanitized = (cep || '').replace(/\D/g, '');
  if (cepSanitized.length !== 8) {
    throw new Error('CEP inválido! Deve conter 8 dígitos.');
  }

  const { data } = await apiViaCep.get(`${cepSanitized}/json/`);

  if (data.erro) {
    throw new Error('CEP não encontrado.');
  }

  return {
    rua: data.logradouro || '',
    bairro: data.bairro || '',
    cidade: data.localidade || '',
    estado: data.uf || '',
    cep: cepSanitized,
  };
}
