import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Purchases from 'react-native-purchases';

const PRO_FEATURES = [
  { icon: 'infinite', title: 'Unlimited Captions', description: 'Generate as many vibes as you want' },
  { icon: 'sparkles', title: 'Exclusive Styles', description: 'Access premium mood styles' },
  { icon: 'flash', title: 'Faster Generation', description: 'Priority AI processing' },
  { icon: 'save', title: 'Save History', description: 'Keep all your favorite captions' },
];

export default function ProScreen() {
  const handlePurchase = async () => {
    // alert('Purchase flow coming soon! 🚀');
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      if (currentOffering?.availablePackages.length! > 0) {
        const purchaseResult = await Purchases.purchasePackage(
          currentOffering?.availablePackages[0]!
        );
        if (purchaseResult.customerInfo.entitlements.active.premium) {
          alert("🎉 Premium unlocked!");
        }
      }

    } catch (e: any) {
      if (!e.userCancelled) console.error('Purchase failed: ', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Close Button */}
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Ionicons name="close-circle" size={32} color="white" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.title}>Moodify Pro</Text>
          <Text style={styles.subtitle}>Unlock the full power of AI captions</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {PRO_FEATURES.map((feature, index) => (
            <View 
              key={index}
              style={[
                styles.featureItem,
                index < PRO_FEATURES.length - 1 && styles.featureItemBorder
              ]}
            >
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={24} color="#8B5CF6" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View style={styles.pricingContainer}>
          <Text style={styles.price}>$4.99/month</Text>
          <Text style={styles.pricingDetails}>Cancel anytime • 7-day free trial</Text>
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          onPress={handlePurchase}
          style={styles.purchaseButton}
          activeOpacity={0.9}
        >
          <Text style={styles.purchaseButtonText}>Start Free Trial</Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B5CF6',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#E9D5FF',
    fontSize: 18,
    textAlign: 'center',
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  featureItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  featureIcon: {
    backgroundColor: '#F5F3FF',
    borderRadius: 24,
    padding: 12,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 4,
  },
  featureDescription: {
    color: '#6B7280',
  },
  pricingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  price: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pricingDetails: {
    color: '#E9D5FF',
    textAlign: 'center',
  },
  purchaseButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  purchaseButtonText: {
    color: '#8B5CF6',
    fontWeight: 'bold',
    fontSize: 20,
  },
  terms: {
    color: '#E9D5FF',
    textAlign: 'center',
    fontSize: 12,
  },
});
