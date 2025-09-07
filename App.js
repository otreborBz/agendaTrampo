import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AuthProvider, { AuthContext } from './src/contexts/auth';
import Routes from './src/routes/routes';
import Loading from './src/components/loading/loading';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function AppRoutes() {
  const { user, initializing } = useContext(AuthContext);

  if (initializing) {
    return <Loading />; // mostra tela de loading enquanto Firebase carrega
  }

  return <Routes user={user} />; // passa o usuário para as rotas
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
