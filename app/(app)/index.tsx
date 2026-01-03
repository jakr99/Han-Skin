import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF8F0', '#FFF5EB', '#FEF0E8', '#FCE8E0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>{greeting}, Anna </Text>
              <Text style={styles.waveEmoji}>👋</Text>
            </View>
            <Text style={styles.subtitle}>Here's your skincare plan for today.</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={24} color="#D4A574" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Morning Routine Card */}
        <View style={styles.routineCard}>
          <View style={styles.routineCardContent}>
            <View style={styles.routineCardLeft}>
              <Text style={styles.routineCardTitle}>Start Your Morning Routine</Text>
              <View style={styles.stepsRow}>
                <Text style={styles.stepsText}>3 steps to boost radiance </Text>
                <Text style={styles.sparkle}>✨</Text>
              </View>
              <TouchableOpacity
                style={styles.beginButton}
                onPress={() => router.push('/routine')}
              >
                <Text style={styles.beginButtonText}>Begin Routine </Text>
                <Ionicons name="chevron-forward" size={14} color="#5C5C5C" />
              </TouchableOpacity>
              <Text style={styles.progressText}>3 out of 5 steps completed</Text>
            </View>
            <View style={styles.routineCardRight}>
              <View style={styles.productImages}>
                <View style={[styles.productCircle, { backgroundColor: '#F5EFE6' }]}>
                  <Ionicons name="flask-outline" size={20} color="#D4A574" />
                </View>
                <View style={[styles.productCircle, { backgroundColor: '#E8F4F0', marginLeft: -10 }]}>
                  <Ionicons name="water-outline" size={20} color="#7A9E9F" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Log Today's Skin Button */}
        <TouchableOpacity style={styles.logSkinButton} onPress={() => router.push('/scan')}>
          <Ionicons name="happy-outline" size={20} color="#6B7280" />
          <Text style={styles.logSkinText}>Log Today's Skin</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/routine')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3E2' }]}>
              <Ionicons name="water" size={24} color="#E8B86D" />
            </View>
            <Text style={styles.actionTitle}>Routine</Text>
            <Text style={styles.actionSubtitle}>View your{'\n'}AM/PM steps</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/barcode')}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F4F8' }]}>
              <Ionicons name="scan-outline" size={24} color="#7BA3A8" />
            </View>
            <Text style={styles.actionTitle}>Scan</Text>
            <Text style={styles.actionSubtitle}>Check product{'\n'}by barcode</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/scan')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFF8E7' }]}>
              <Ionicons name="sparkles" size={24} color="#E8C547" />
            </View>
            <Text style={styles.actionTitle}>Analyze</Text>
            <Text style={styles.actionSubtitle}>Update your{'\n'}skin reading</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/shop')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEF0F0' }]}>
              <Ionicons name="gift" size={24} color="#E8A4A4" />
            </View>
            <Text style={styles.actionTitle}>Top Picks</Text>
            <Text style={styles.actionSubtitle}>Products</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Top Picks */}
        <View style={styles.topPicksSection}>
          <Text style={styles.sectionTitle}>Today's Top Picks</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScroll}
          >
            {/* Product 1 */}
            <View style={styles.productCard}>
              <View style={styles.bestSellerBadge}>
                <Text style={styles.bestSellerText}>Best Seller</Text>
              </View>
              <View style={styles.productImagePlaceholder}>
                <Ionicons name="flask" size={40} color="#E8A86D" />
              </View>
              <Text style={styles.productBrand}>COSRX</Text>
              <Text style={styles.productName}>The Vitamin C 13 Serum</Text>
              <Text style={styles.productPrice}>$21.00</Text>
              <Text style={styles.productDescription}>Brightens & evens skin tone</Text>
            </View>

            {/* Product 2 */}
            <View style={styles.productCard}>
              <View style={styles.productImagePlaceholder}>
                <Ionicons name="leaf" size={40} color="#7A9E9F" />
              </View>
              <Text style={styles.productBrand}>Anua</Text>
              <Text style={styles.productName}>Heartleaf 77% Toner</Text>
              <Text style={styles.productPrice}>$20.00</Text>
              <Text style={styles.productDescription}>Calms & hydrates sensitive skin</Text>
            </View>

            {/* Product 3 */}
            <View style={styles.productCard}>
              <View style={styles.productImagePlaceholder}>
                <Ionicons name="sunny" size={40} color="#E8C547" />
              </View>
              <Text style={styles.productBrand}>Beauty of Joseon</Text>
              <Text style={styles.productName}>Relief Sun SPF50+</Text>
              <Text style={styles.productPrice}>$18.00</Text>
              <Text style={styles.productDescription}>Lightweight daily protection</Text>
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
  },
  waveEmoji: {
    fontSize: 22,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3E6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F5E6D3',
  },
  routineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  routineCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routineCardLeft: {
    flex: 1,
  },
  routineCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepsText: {
    fontSize: 13,
    color: '#6B7280',
  },
  sparkle: {
    fontSize: 13,
  },
  beginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0E8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  beginButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C5C5C',
  },
  progressText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  routineCardRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImages: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logSkinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logSkinText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#4B5563',
    marginLeft: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionItem: {
    alignItems: 'center',
    width: '23%',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 13,
  },
  topPicksSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  productsScroll: {
    gap: 12,
  },
  productCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bestSellerBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FEF3E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  bestSellerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D4A574',
  },
  productImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  productBrand: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 6,
    lineHeight: 17,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 14,
  },
});
