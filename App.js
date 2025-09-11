import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AuthProvider, { AuthContext } from './src/contexts/auth';
import Routes from './src/routes/routes';
import Loading from './src/components/loading/loading';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
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
    return <Loading />; 
  }

  return <Routes user={user} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
