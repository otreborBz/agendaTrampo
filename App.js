import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AuthProvider, { AuthContext } from './src/contexts/Auth';
import Routes from './src/routes/Routes';
import { colors } from './src/themes/colors/Colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { user, initializing } = useContext(AuthContext);

  if (initializing) {
    return <ActivityIndicator size="large" color='#38b6fb' style={{ flex: 1 }} />;
  }

  return <Routes />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
});
