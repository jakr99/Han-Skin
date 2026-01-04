import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileSubScreen from '../../../components/ProfileSubScreen';

const COLORS = {
  card: '#FFFFFF',
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  tertiaryText: '#9CA3AF',
  accent: '#D4A574',
  border: '#E8E4DF',
};

const FAQ_ITEMS = [
  { question: 'How do I scan a product?', answer: 'Use the scan tab to take a photo of any skincare product barcode.' },
  { question: 'How are recommendations made?', answer: 'We analyze your skin profile and ingredient preferences to suggest products.' },
  { question: 'Can I change my skin type?', answer: 'Yes! Go to Edit Skin Profile to update your information anytime.' },
  { question: 'How do I cancel my subscription?', answer: 'Go to Subscription settings and select "Cancel subscription".' },
];

export default function HelpScreen() {
  return (
    <ProfileSubScreen title="Help & Support">
      {/* FAQ */}
      <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
      <View style={styles.card}>
        {FAQ_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.faqItem,
              index === FAQ_ITEMS.length - 1 && styles.faqItemLast,
            ]}
          >
            <View style={styles.faqContent}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.tertiaryText} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Contact */}
      <Text style={styles.sectionHeader}>Contact Us</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.contactRow}>
          <View style={styles.contactIcon}>
            <Ionicons name="mail-outline" size={18} color={COLORS.accent} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Email Support</Text>
            <Text style={styles.contactValue}>support@hanskin.app</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.tertiaryText} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.contactRow, styles.contactRowLast]}>
          <View style={styles.contactIcon}>
            <Ionicons name="chatbubble-outline" size={18} color={COLORS.accent} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Live Chat</Text>
            <Text style={styles.contactValue}>Available 9am - 5pm PST</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.tertiaryText} />
        </TouchableOpacity>
      </View>

      {/* Feedback */}
      <Text style={styles.sectionHeader}>Feedback</Text>
      <View style={styles.card}>
        <Text style={styles.feedbackText}>
          We'd love to hear from you! Help us improve the app with your feedback.
        </Text>
        <TouchableOpacity style={styles.feedbackButton}>
          <Text style={styles.feedbackButtonText}>Send Feedback</Text>
        </TouchableOpacity>
      </View>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  faqItemLast: {
    borderBottomWidth: 0,
  },
  faqContent: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primaryText,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 13,
    color: COLORS.secondaryText,
    lineHeight: 18,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactRowLast: {
    borderBottomWidth: 0,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F5F3F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primaryText,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },
  feedbackText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 20,
    padding: 16,
    paddingBottom: 12,
  },
  feedbackButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.accent,
  },
  feedbackButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
