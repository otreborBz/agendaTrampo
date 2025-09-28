import { useEffect, useState } from "react";
import { View, Button, Alert } from "react-native";
import { InterstitialAd, AdEventType, TestIds } from "react-native-google-mobile-ads";
import { adUnitIdInterstitial } from "../../services/adMobService/AdMobService";

// Cria o Interstitial Ad
const interstitial = InterstitialAd.createForAdRequest(
  __DEV__ ? TestIds.INTERSTITIAL : adUnitIdInterstitial,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

export default function AdInterstitial() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Evento quando o anúncio carrega
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
      console.log("[InterstitialAd] Anúncio carregado!");
    });

    // Evento quando o anúncio é fechado
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      console.log("[InterstitialAd] Anúncio fechado, recarregando...");
      interstitial.load(); // recarrega automaticamente
    });

    // Evento de erro
    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (err) => {
      console.error("[InterstitialAd ERROR]:", err);
    });

    // Carrega o primeiro anúncio
    interstitial.load();

    // Cleanup
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  // Mostrar anúncio
  const showAd = () => {
    if (loaded) {
      interstitial.show();
    } else {
      Alert.alert("Atenção", "O anúncio ainda não está carregado. Por favor, tente novamente em alguns segundos.");
    }
  };

  return (
    <View style={{ alignItems: "center", marginVertical: 10 }}>
      <Button title="Mostrar Interstitial" onPress={showAd} />
    </View>
  );
}
