import { generateCaption } from "@/services/openai";
import {
  getGenerationCount,
  incrementGenerationCount,
} from "@/services/storage";
import { useMoodifyStore } from "@/store/moodify-store";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import checkPremium from "./utils/check-premium";

export default function ResultScreen() {
  const { image, mood, caption, setCaption } = useMoodifyStore();
  const [loading, setLoading] = useState(false);

  // Generate caption on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  // Generate AI caption
  const handleGenerate = async () => {
    setLoading(true);

    try {
      const count = await getGenerationCount();
      const isPremium = checkPremium();
      const MAXCOUNT = process.env.EXPO_PUBLIC_FREE_LIMIT
        ? parseInt(process.env.EXPO_PUBLIC_FREE_LIMIT)
        : "";
      if (!isPremium && MAXCOUNT && count >= MAXCOUNT) {
        router.push("/pro");
      } else {
        const generatedCaption = await generateCaption(mood);
        setCaption(generatedCaption);
        await incrementGenerationCount();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate caption. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Copy caption to clipboard
  const copyToClipboard = async () => {
    if (caption) {
      await Clipboard.setStringAsync(caption);
      Alert.alert("Copied!", "Caption copied to clipboard");
    }
  };

  // Share caption (Instagram intent on mobile)
  const shareCaption = async (caption: string) => {
    if (!caption) return;

    try {
      const result = await Share.share({
        message: caption,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing caption:", error);
      Alert.alert("Error", "Could not share caption");
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color="#8B5CF6" />
          </TouchableOpacity>
          <Text style={styles.title}>Your Vibe ✨</Text>
        </View>

        {/* Caption Display */}
        <View style={styles.captionContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={styles.loadingText}>Generating your vibe...</Text>
            </View>
          ) : (
            <Text style={styles.captionText}>
              {caption || "No caption generated yet"}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        {!loading && caption && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={handleGenerate}
              style={styles.regenerateButton}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={styles.buttonText}>Regenerate</Text>
            </TouchableOpacity>

            <View style={styles.shareButtonsRow}>
              <TouchableOpacity
                onPress={copyToClipboard}
                style={styles.copyButton}
                activeOpacity={0.8}
              >
                <Ionicons name="copy-outline" size={20} color="white" />
                <Text style={styles.smallButtonText}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => shareCaption(caption)}
                style={styles.shareButton}
                activeOpacity={0.8}
              >
                <Ionicons name="share-social-outline" size={20} color="white" />
                <Text style={styles.smallButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Back to Home */}
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.backToHomeButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backToHomeText}>← Create Another</Text>
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  imagePreviewContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  imagePreview: {
    width: "100%",
    height: 288,
  },
  captionContainer: {
    backgroundColor: "#F5F3FF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    color: "#6B7280",
    marginTop: 16,
  },
  captionText: {
    color: "#1F2937",
    fontSize: 18,
    lineHeight: 28,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 16,
  },
  regenerateButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  copyButton: {
    flex: 1,
    backgroundColor: "#EC4899",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
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
  smallButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  backToHomeButton: {
    alignItems: "center",
    paddingVertical: 16,
  },
  backToHomeText: {
    color: "#8B5CF6",
    fontWeight: "500",
  },
});
