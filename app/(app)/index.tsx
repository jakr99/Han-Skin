import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={styles.container}>
      {/* Background Gradient - matches OnboardingContainer */}
      <LinearGradient
        colors={['#FDF5F0', '#F5F0F5', '#F0F5F5']}
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
          <Text style={styles.greeting}>{greeting}</Text>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <View style={styles.profilePlaceholder}>
              <Ionicons name="person" size={18} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Scan Your Skin Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Scan your skin</Text>
            <Text style={styles.heroSubtitle}>Track hydration, texture & progress</Text>
            <TouchableOpacity style={styles.analyzeButton} onPress={() => router.push('/scan')}>
              <Text style={styles.analyzeButtonText}>Analyze Skin</Text>
            </TouchableOpacity>
            <Text style={styles.heroNote}>30s scan • track progress over time</Text>
          </View>
          <View style={styles.heroImageContainer}>
            <View style={styles.faceIllustration}>
              <Ionicons name="scan-outline" size={60} color="#B8C9C4" />
            </View>
          </View>
        </View>

        {/* Two Cards Row */}
        <View style={styles.cardsRow}>
          {/* Scan Products Card */}
          <View style={styles.smallCard}>
            <View style={styles.smallCardIcon}>
              <Ionicons name="barcode-outline" size={24} color="#7A9E9F" />
            </View>
            <Text style={styles.smallCardTitle}>Scan Products</Text>
            <Text style={styles.smallCardSubtitle}>Check the safety of your skincare</Text>
            <TouchableOpacity style={styles.smallCardButton} onPress={() => router.push('/barcode')}>
              <Text style={styles.smallCardButtonText}>Scan Barcode</Text>
            </TouchableOpacity>
          </View>

          {/* Shop Card */}
          <View style={styles.smallCard}>
            <View style={styles.smallCardIcon}>
              <Ionicons name="bag-outline" size={24} color="#7A9E9F" />
            </View>
            <Text style={styles.smallCardTitle}>Shop</Text>
            <Text style={styles.smallCardSubtitle}>Curated for your skin</Text>
            <TouchableOpacity style={styles.smallCardButton} onPress={() => router.push('/shop')}>
              <Text style={styles.smallCardButtonText}>View Products</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Routine */}
        <View style={styles.routineCard}>
          <View style={styles.routineHeader}>
            <View style={styles.routineTitleRow}>
              <Ionicons name="water" size={18} color="#7A9E9F" />
              <Text style={styles.routineTitle}>Today's Routine</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>4 day streak</Text>
              <Ionicons name="checkmark-circle" size={14} color="#7A9E9F" />
            </View>
          </View>

          <View style={styles.routineColumns}>
            {/* Morning Column */}
            <View style={styles.routineColumn}>
              <View style={styles.columnHeader}>
                <Ionicons name="sunny-outline" size={14} color="#6B7280" />
                <Text style={styles.columnTitle}>Morning</Text>
                <Text style={styles.columnStatus}>(Completed)</Text>
              </View>
              <View style={styles.routineItem}>
                <Ionicons name="checkmark-circle" size={16} color="#7A9E9F" />
                <Text style={styles.routineItemText}>Cleanser</Text>
              </View>
              <View style={styles.routineItem}>
                <Ionicons name="checkmark-circle" size={16} color="#7A9E9F" />
                <Text style={styles.routineItemText}>Serum</Text>
              </View>
              <View style={styles.routineItem}>
                <Ionicons name="checkmark-circle" size={16} color="#7A9E9F" />
                <Text style={styles.routineItemText}>Moisturizer</Text>
              </View>
            </View>

            {/* Evening Column */}
            <View style={styles.routineColumn}>
              <View style={styles.columnHeader}>
                <Ionicons name="moon-outline" size={14} color="#6B7280" />
                <Text style={styles.columnTitle}>Evening</Text>
              </View>
              <View style={styles.routineItem}>
                <Ionicons name="ellipse-outline" size={16} color="#D1D5DB" />
                <Text style={styles.routineItemTextPending}>Cleanser</Text>
              </View>
              <View style={styles.routineItem}>
                <Ionicons name="ellipse-outline" size={16} color="#D1D5DB" />
                <Text style={styles.routineItemTextPending}>Serum</Text>
              </View>
              <View style={styles.routineItem}>
                <Ionicons name="ellipse-outline" size={16} color="#D1D5DB" />
                <Text style={styles.routineItemTextPending}>Moisturizer</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.editLink}>
            <Text style={styles.editLinkText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended for You */}
        <View style={styles.recommendedSection}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScroll}
          >
            {/* Product Card 1 */}
            <View style={styles.productCard}>
              <View style={styles.productImagePlaceholder}>
                <Ionicons name="flask-outline" size={40} color="#B8C9C4" />
              </View>
              <Text style={styles.productName}>Hydrating{'\n'}Facial Serum</Text>
              <Text style={styles.productPrice}>$32</Text>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>

            {/* Product Card 2 */}
            <View style={styles.productCard}>
              <View style={styles.productImagePlaceholder}>
                <Ionicons name="water-outline" size={40} color="#B8C9C4" />
              </View>
              <Text style={styles.productName}>Soothing{'\n'}Moisturizer</Text>
              <Text style={styles.productPrice}>$24</Text>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>

            {/* Product Card 3 */}
            <View style={styles.productCard}>
              <View style={styles.productImagePlaceholder}>
                <Ionicons name="sunny-outline" size={40} color="#B8C9C4" />
              </View>
              <Text style={styles.productName}>Daily{'\n'}Sunscreen</Text>
              <Text style={styles.productPrice}>$28</Text>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Bottom spacing for tab bar */}
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

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 17,
    fontWeight: '500',
    color: '#3D3D3D',
  },
  profileButton: {
    padding: 4,
  },
  profilePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: '#E5E2DE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hero Card
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
  },
  analyzeButton: {
    backgroundColor: '#7A9E9F',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroNote: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  heroImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  faceIllustration: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(184, 201, 196, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Two Cards Row
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  smallCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  smallCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(122, 158, 159, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  smallCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  smallCardSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 15,
  },
  smallCardButton: {
    backgroundColor: 'rgba(122, 158, 159, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  smallCardButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A9E9F',
  },

  // Routine Card
  routineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  routineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 12,
    color: '#7A9E9F',
    fontWeight: '500',
  },
  routineColumns: {
    flexDirection: 'row',
    gap: 20,
  },
  routineColumn: {
    flex: 1,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  columnTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  columnStatus: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  routineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  routineItemText: {
    fontSize: 13,
    color: '#4B5563',
  },
  routineItemTextPending: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  editLink: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  editLinkText: {
    fontSize: 12,
    color: '#7A9E9F',
    fontWeight: '500',
  },

  // Recommended Section
  recommendedSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 14,
  },
  productsScroll: {
    gap: 12,
  },
  productCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E2DE',
  },
  productImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(122, 158, 159, 0.08)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 17,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#7A9E9F',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
