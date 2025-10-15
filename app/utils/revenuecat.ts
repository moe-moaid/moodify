import { Platform } from "react-native";
import Purchases from "react-native-purchases";

export function setupRevenueCat() {
  const key = process.env.EXPO_PUBLIC_CAP_API_KEY;
  if (Platform.OS === "android" && key) {
    Purchases.configure({
      apiKey: key,
    });
  }
}
