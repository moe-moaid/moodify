import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Text, TouchableOpacity, StyleSheet } from "react-native";

function ClearStorage() {
  const resetStorage = async () => {
    await AsyncStorage.clear();
    Alert.alert("Storage cleared", "All local data has been reset.");
    console.log("button clicked");
  };
  if (!__DEV__) return null; //only show if dev mode, hide on prod
  return (
    <TouchableOpacity onLongPress={resetStorage} style={styles.clearButton}>
      <Text>Clear Storage</Text>
    </TouchableOpacity>
  );
}

export default ClearStorage;

const styles = StyleSheet.create({
    clearButton: {
    flex: 1,
    backgroundColor: "#EC4899",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    }
})
