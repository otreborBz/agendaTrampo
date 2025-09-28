// services/adMobService/AdMobService.ts
import { TestIds } from 'react-native-google-mobile-ads';

/**
 * Banner Ad Unit ID
 * - Em desenvolvimento (__DEV__), usa TestIds.BANNER
 * - Em produção, substitua pelo seu ID real do AdMob
 */
export const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy'; // ✅ substitua pelo seu ID real

/**
 * Interstitial Ad Unit ID
 * - Em desenvolvimento (__DEV__), usa TestIds.INTERSTITIAL
 * - Em produção, substitua pelo seu ID real do AdMob
 */
export const adUnitIdInterstitial = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz'; // ✅ substitua pelo seu ID real
