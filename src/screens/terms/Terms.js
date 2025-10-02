import { ScrollView, Text, View,TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

export default function TermsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Termos de Uso</Text>

        <Text style={styles.paragraph}>
          Ao utilizar o aplicativo Agenda Trampo, você concorda com os presentes Termos de Uso.
          Caso não concorde, recomendamos que não utilize o aplicativo.
        </Text>

        <Text style={styles.subtitle}>1. Descrição do Serviço</Text>
        <Text style={styles.paragraph}>
          O Agenda Trampo é destinado ao uso pessoal para organização de compromissos e agendamentos.
          Atualmente, não há interação entre usuários.
        </Text>

        <Text style={styles.subtitle}>2. Cadastro do Usuário</Text>
        <Text style={styles.paragraph}>
          O usuário deve fornecer nome, e-mail e senha válidos. O usuário é responsável por manter a
          confidencialidade de suas credenciais.
        </Text>

        <Text style={styles.subtitle}>3. Coleta de Dados</Text>
        <Text style={styles.paragraph}>
          O aplicativo coleta nome, e-mail e senha para cadastro, além de informações inseridas nos
          agendamentos (nome, endereço, telefone). Esses dados são armazenados em servidores do
          Firebase.
        </Text>

        <Text style={styles.subtitle}>4. Anúncios</Text>
        <Text style={styles.paragraph}>
          O app exibe anúncios através da plataforma AdMob. O usuário reconhece e concorda com a
          exibição desses anúncios.
        </Text>

        <Text style={styles.subtitle}>5. Responsabilidade</Text>
        <Text style={styles.paragraph}>
          O usuário é o único responsável pelas informações inseridas. O aplicativo é fornecido "como está",
          sem garantias de funcionamento contínuo.
        </Text>

        <Text style={styles.title}>Política de Privacidade</Text>

        <Text style={styles.subtitle}>1. Informações Coletadas</Text>
        <Text style={styles.paragraph}>
          Nome, e-mail e senha para login. Informações adicionais (nome, endereço, telefone) nos
          agendamentos. Todos os dados são enviados e armazenados no Firebase.
        </Text>

        <Text style={styles.subtitle}>2. Uso das Informações</Text>
        <Text style={styles.paragraph}>
          Os dados são utilizados para permitir login, salvar agendamentos e exibir anúncios personalizados
          via AdMob.
        </Text>

        <Text style={styles.subtitle}>3. Direitos do Usuário</Text>
        <Text style={styles.paragraph}>
          O usuário pode solicitar acesso, correção ou exclusão de seus dados entrando em contato pelo e-mail:
          codebr.contato@gmail.com.
        </Text>

        <Text style={styles.subtitle}>4. Alterações</Text>
        <Text style={styles.paragraph}>
          Os Termos de Uso e a Política de Privacidade podem ser atualizados periodicamente. A versão
          mais recente estará sempre disponível dentro do aplicativo.
        </Text>

        <Text style={styles.subtitle}>5. Contato</Text>
        <Text style={styles.paragraph}>
          Em caso de dúvidas, envie um e-mail para: codebr.contato@gmail.com
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


