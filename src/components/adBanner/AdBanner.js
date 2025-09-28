import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { adUnitId } from '../../services/adMobService/AdMobService';

export default function AdBanner() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 50, marginVertical: 10 }}>
      <BannerAd
        unitId={adUnitId} // usa TestIds.BANNER em dev, ID real em produção
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} // banner responsivo
        requestOptions={{ requestNonPersonalizedAdsOnly: true }} // garante anúncios não personalizados
      />
    </View>
  );
}
