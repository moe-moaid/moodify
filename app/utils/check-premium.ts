import Purchases from "react-native-purchases";

export const checkPremium = async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active.premium;
}