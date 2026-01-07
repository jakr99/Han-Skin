import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CART_ITEMS = [
  {
    id: '1',
    name: 'Hydrating Hyaluronic Serum',
    size: '30ml',
    price: 42,
    quantity: 1,
    icon: 'flask-outline',
  },
  {
    id: '2',
    name: 'Barrier Repair Moisturizer',
    size: '50ml',
    price: 38,
    quantity: 1,
    icon: 'leaf-outline',
  },
];

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [items, setItems] = useState(CART_ITEMS);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, styles.stepActive]}>
            <Text style={styles.stepNumberActive}>1</Text>
          </View>
          <Text style={styles.stepLabelActive}>Cart</Text>
        </View>
        <View style={[styles.progressLine, styles.lineActive]} />
        <View style={styles.progressStep}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={styles.stepLabel}>Shipping</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressStep}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.stepLabel}>Payment</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cart Items */}
        <Text style={styles.sectionTitle}>Your Items ({items.length})</Text>

        {items.length === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons name="bag-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity
              style={styles.continueShoppingButton}
              onPress={() => router.push('/shop')}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {items.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemImage}>
                  <Ionicons name={item.icon as any} size={32} color="#7A9E9F" />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemSize}>{item.size}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Ionicons name="remove" size={18} color="#6B7280" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Ionicons name="add" size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Free Shipping Banner */}
            {subtotal < 50 && (
              <View style={styles.shippingBanner}>
                <Ionicons name="gift-outline" size={18} color="#7A9E9F" />
                <Text style={styles.shippingBannerText}>
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </Text>
              </View>
            )}

            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={[styles.summaryValue, shipping === 0 && styles.freeText]}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Estimated Tax</Text>
                <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Trust Badges */}
            <View style={styles.trustBadges}>
              <View style={styles.trustBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#7A9E9F" />
                <Text style={styles.trustText}>Secure</Text>
              </View>
              <View style={styles.trustBadge}>
                <Ionicons name="refresh" size={16} color="#7A9E9F" />
                <Text style={styles.trustText}>30-Day Returns</Text>
              </View>
              <View style={styles.trustBadge}>
                <Ionicons name="leaf" size={16} color="#7A9E9F" />
                <Text style={styles.trustText}>Clean Beauty</Text>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Checkout Button */}
      {items.length > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.bottomTotal}>
            <Text style={styles.bottomTotalLabel}>Total</Text>
            <Text style={styles.bottomTotalValue}>${total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.9}>
            <Text style={styles.checkoutButtonText}>Continue to Shipping</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 44,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  progressStep: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(17, 24, 39, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepActive: {
    backgroundColor: '#111111',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  stepNumberActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  stepLabelActive: {
    fontSize: 11,
    color: '#1F2937',
    fontWeight: '500',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(17, 24, 39, 0.08)',
    marginHorizontal: 8,
    marginBottom: 18,
  },
  lineActive: {
    backgroundColor: '#111111',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 20,
  },
  continueShoppingButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#111111',
    borderRadius: 14,
  },
  continueShoppingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  itemSize: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginRight: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 10,
  },
  removeButton: {
    padding: 8,
  },
  shippingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  shippingBannerText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.08)',
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  freeText: {
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.08)',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAFAF8',
    borderTopWidth: 1,
    borderTopColor: 'rgba(17, 24, 39, 0.08)',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  bottomTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bottomTotalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  checkoutButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    paddingVertical: 16,
    borderRadius: 18,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 4,
  },
  checkoutButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
