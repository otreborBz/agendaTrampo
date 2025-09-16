import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Salva a lista de serviços no AsyncStorage
 * @param {Array} servicos - Lista de serviços para salvar
 */
export async function salvarServicos(servicos) {
  try {
    await AsyncStorage.setItem('@servicos', JSON.stringify(servicos));
    console.log("Serviços salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar serviços:", error);
  }
}


/**
 * Recupera a lista de serviços do AsyncStorage
 * @returns {Array} Lista de serviços ou []
 */
export async function carregarServicos() {
  try {
    const data = await AsyncStorage.getItem('@servicos');
    console.log('data: ', data)
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
    return [];
  }
}
