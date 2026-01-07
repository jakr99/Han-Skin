import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────

const USER_STATS = [
  { label: 'Scans', value: '24' },
  { label: 'Reviews', value: '8' },
  { label: 'Saved', value: '16' },
  { label: 'Streak', value: '12' },
];

const MY_PRODUCTS = [
  { id: '1', name: 'Vitamin C Serum', brand: 'COSRX', icon: 'sunny', color: '#FFB74D' },
  { id: '2', name: 'Snail Mucin', brand: 'COSRX', icon: 'water', color: '#81C784' },
  { id: '3', name: 'Heartleaf Toner', brand: 'Anua', icon: 'leaf', color: '#A5D6A7' },
  { id: '4', name: 'Sunscreen', brand: 'Beauty of Joseon', icon: 'sunny-outline', color: '#FFD54F' },
];

const MENU_SECTIONS = [
  {
    title: 'My Activity',
    items: [
      { id: 'scans', icon: 'scan-outline', label: 'Scan History' },
      { id: 'reviews', icon: 'chatbubble-outline', label: 'My Reviews' },
      { id: 'saved', icon: 'heart-outline', label: 'Saved Products' },
    ],
  },
  {
    title: 'Skin Profile',
    items: [
      { id: 'skin-type', icon: 'water-outline', label: 'Skin Type', value: 'Combination' },
      { id: 'concerns', icon: 'fitness-outline', label: 'Concerns', value: '3 selected' },
      { id: 'ingredients', icon: 'flask-outline', label: 'Ingredient Preferences' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { id: 'notifications', icon: 'notifications-outline', label: 'Notifications' },
      { id: 'account', icon: 'person-outline', label: 'Account' },
      { id: 'help', icon: 'help-circle-outline', label: 'Help & Support' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function ProfileExampleScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>My Page</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>S</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>Steve</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Lv.3</Text>
                </View>
              </View>
              <Text style={styles.userEmail}>steve@email.com</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            {USER_STATS.map((stat, index) => (
              <TouchableOpacity key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Skin Match Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreLabel}>Your Skin Match Score</Text>
            <Text style={styles.scoreDescription}>Based on your profile and scan history</Text>
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>78</Text>
          </View>
        </View>

        {/* My Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScroll}
          >
            {MY_PRODUCTS.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productItem}>
                <View style={[styles.productIcon, { backgroundColor: `${product.color}20` }]}>
                  <Ionicons name={product.icon as any} size={24} color={product.color} />
                </View>
                <Text style={styles.productBrand}>{product.brand}</Text>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addProductItem}>
              <View style={styles.addProductIcon}>
                <Ionicons name="add" size={24} color="#9CA3AF" />
              </View>
              <Text style={styles.addProductText}>Add</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    index === section.items.length - 1 && styles.menuItemLast,
                  ]}
                >
                  <Ionicons name={item.icon as any} size={20} color="#374151" />
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                  {item.value && (
                    <Text style={styles.menuItemValue}>{item.value}</Text>
                  )}
                  <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: 12,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  levelBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  // Score Card
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  scoreLeft: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#10B981',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },

  // My Products
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  seeAllText: {
    fontSize: 13,
    color: '#6B7280',
  },
  productsScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  productItem: {
    width: 90,
    alignItems: 'center',
  },
  productIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  addProductItem: {
    width: 90,
    alignItems: 'center',
  },
  addProductIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addProductText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Menu Sections
  menuSection: {
    marginBottom: 12,
  },
  menuSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 15,
    color: '#111',
  },
  menuItemValue: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#EF4444',
  },
});
