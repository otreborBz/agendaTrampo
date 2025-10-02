import { useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AuthProvider, { AuthContext } from './src/contexts/Auth';
import Routes from './src/routes/Routes';
import { colors } from './src/themes/colors/Colors';

export default function App() {
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        // console.log('SDK do Google Mobile Ads inicializado com sucesso!');
      });
  }, []);

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
    return <ActivityIndicator size="large" color={colors.white} style={{ flex: 1 }} />;
  }

  return <Routes />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
});
