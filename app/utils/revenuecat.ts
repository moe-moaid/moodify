import Constants from "expo-constants";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";

export function setupRevenueCat() {
  if (Platform.OS === "ios") {
    Purchases.configure({
      apiKey: Constants?.expoConfig?.extra?.REVENUECAT_API_KEY,
    });
  } else if (Platform.OS === "android") {
    Purchases.configure({
      apiKey: Constants?.expoConfig?.extra?.REVENUECAT_API_KEY,
    });
  }
}
