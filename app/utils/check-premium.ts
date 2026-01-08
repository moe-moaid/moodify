import Purchases from "react-native-purchases";

const checkPremium = async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active.premium;
}
export default checkPremium
