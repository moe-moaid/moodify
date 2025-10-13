import ClearStorage from "@/components/clear-storage";
import { getGenerationCount } from "@/services/storage";
import { useMoodifyStore } from "@/store/moodify-store";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mood options for caption generation
const MOODS = [
  { id: "aesthetic", label: "✨ Aesthetic", color: "#C084FC" },
  { id: "funny", label: "😂 Funny", color: "#FBBF24" },
  { id: "flirty", label: "💞 Flirty", color: "#F472B6" },
  { id: "motivational", label: "🔥 Motivational", color: "#34D399" },
  { id: "chill", label: "😎 Chill", color: "#60A5FA" },
  { id: "melancholy", label: "🌧️ Melancholy", color: "#9CA3AF" },
  { id: "romantic", label: "💐 Romantic", color: "#FB7185" },
  { id: "sassy", label: "💅 Sassy", color: "#F472B6" },
  { id: "travel", label: "🌍 Travel", color: "#38BDF8" },
  { id: "workVibes", label: "💼 Work Vibes", color: "#818CF8" },
];

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<string>("aesthetic");
  const { setImage, setMood, image } = useMoodifyStore();

  // Request camera permissions and take photo
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera permission is required to take photos"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Gallery permission is required to select photos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Generate vibe and navigate to result screen
  const generateVibe = async () => {
    setMood(selectedMood);
    const count = await getGenerationCount();
    const MAXCOUNT = process.env.EXPO_PUBLIC_FREE_LIMIT
      ? parseInt(process.env.EXPO_PUBLIC_FREE_LIMIT)
      : "";
    console.log("count", MAXCOUNT, count);
    if (MAXCOUNT && count >= MAXCOUNT) {
      router.push("/pro");
    } else {
      router.push("/result");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Moodify ✨</Text>
          <Text style={styles.subtitle}>AI-powered captions for your vibe</Text>
        </View>

        {/* Mood Selector */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>Choose Your Vibe</Text>
          <View style={styles.moodContainer}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                onPress={() => setSelectedMood(mood.id)}
                style={[
                  styles.moodChip,
                  selectedMood === mood.id
                    ? styles.moodChipSelected
                    : styles.moodChipUnselected,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.moodChipText,
                    selectedMood === mood.id
                      ? styles.moodChipTextSelected
                      : styles.moodChipTextUnselected,
                  ]}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          onPress={generateVibe}
          style={styles.generateButton}
          activeOpacity={0.9}
        >
          <Text style={styles.generateButtonText}>⚡ Generate Vibe</Text>
        </TouchableOpacity>
        <ClearStorage />
        {/* Pro Link */}
        <TouchableOpacity
          onPress={() => router.push("/pro")}
          style={styles.proLink}
          activeOpacity={0.7}
        >
          <Text style={styles.proLinkText}>✨ Upgrade to Pro</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  imagePreviewContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  imagePreview: {
    width: "100%",
    height: 256,
  },
  buttonGroup: {
    marginBottom: 32,
    gap: 12,
  },
  uploadButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cameraButton: {
    backgroundColor: "#EC4899",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 18,
  },
  moodSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  moodChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  moodChipSelected: {
    backgroundColor: "#8B5CF6",
  },
  moodChipUnselected: {
    backgroundColor: "#E5E7EB",
  },
  moodChipText: {
    fontWeight: "500",
  },
  moodChipTextSelected: {
    color: "#FFFFFF",
  },
  moodChipTextUnselected: {
    color: "#374151",
  },
  generateButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 20,
  },
  proLink: {
    alignItems: "center",
    paddingVertical: 16,
  },
  proLinkText: {
    color: "#8B5CF6",
    fontWeight: "500",
  },
});
