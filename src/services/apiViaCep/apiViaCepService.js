
import  apiViaCep from './apiViaCep';
import { Alert } from 'react-native';

/**
 * Buscar endereço pelo CEP
 * @param {string} cep - CEP a ser buscado
 * @returns {Object|null} - Retorna objeto com rua, bairro, cidade, estado e cep, ou null se erro
 */
export const buscarCep = async (cep) => {
  try {
    const cepSanitized = cep.replace(/\D/g, '');
    if (cepSanitized.length !== 8) {
      Alert.alert('Erro', 'CEP inválido! Deve conter 8 dígitos.');
      return null;
    }

    const response = await apiViaCep.get(`${cepSanitized}/json/`);
    const data = response.data;

    if (data.erro) {
      Alert.alert('Erro', 'CEP não encontrado.');
      return null;
    }

    return {
      rua: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
      cep: cepSanitized,
    };

  } catch (error) {
    Alert.alert('Erro', 'Não foi possível buscar o CEP. Tente novamente.');
    return null;
  }
};
