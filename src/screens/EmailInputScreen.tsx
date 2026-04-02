import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../App';
import {EmailParser} from '../services/EmailParser';
import {ReturnsAgent} from '../services/ReturnsAgent';

type EmailInputScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EmailInput'
>;

const EmailInputScreen = () => {
  const navigation = useNavigation<EmailInputScreenNavigationProp>();
  const [emailContent, setEmailContent] = useState('');
  const [returnInstruction, setReturnInstruction] = useState('return this');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handlePickDocument = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Not Supported on Web',
        'File upload is only available on mobile apps. Please paste your email content instead.',
      );
      return;
    }

    // Note: DocumentPicker only works on native platforms
    Alert.alert(
      'Feature Coming Soon',
      'File upload will be available in a future update. Please paste your email content for now.',
    );
  };

  const handleSubmit = async () => {
    if (!emailContent.trim() && !selectedFile) {
      Alert.alert('Error', 'Please paste email content or select a file');
      return;
    }

    setIsProcessing(true);

    try {
      // Parse the email to extract order details
      const emailParser = new EmailParser();
      const orderDetails = await emailParser.parseEmail(emailContent);

      if (!orderDetails) {
        Alert.alert('Error', 'Could not parse order information from email');
        setIsProcessing(false);
        return;
      }

      // Initialize the returns agent
      const agent = new ReturnsAgent();
      const returnRequest = await agent.initiateReturn({
        orderDetails,
        instruction: returnInstruction,
      });

      setIsProcessing(false);

      Alert.alert(
        'Return Initiated!',
        `Your return request has been submitted. Return ID: ${returnRequest.id}`,
        [
          {
            text: 'View Details',
            onPress: () =>
              navigation.navigate('ReturnDetails', {
                returnId: returnRequest.id,
              }),
          },
          {
            text: 'OK',
            onPress: () => navigation.navigate('ReturnsDashboard'),
          },
        ],
      );
    } catch (error) {
      setIsProcessing(false);
      Alert.alert(
        'Error',
        'Failed to process return request. Please try again.',
      );
      console.error('Return processing error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Forward Your Order Email</Text>
        <Text style={styles.subtitle}>
          Paste your order confirmation email or upload it from your device
        </Text>

        {/* Email Content Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Email Content</Text>
          <TextInput
            style={styles.emailInput}
            multiline
            numberOfLines={10}
            placeholder="Paste your order confirmation email here..."
            value={emailContent}
            onChangeText={setEmailContent}
            textAlignVertical="top"
          />
        </View>

        {/* File Upload Option */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handlePickDocument}>
          <Text style={styles.uploadButtonText}>
            {selectedFile ? selectedFile : '📎 Upload Email File'}
          </Text>
        </TouchableOpacity>

        {/* Return Instruction */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Your Instruction</Text>
          <TextInput
            style={styles.instructionInput}
            placeholder="E.g., return this, return item 1, etc."
            value={returnInstruction}
            onChangeText={setReturnInstruction}
          />
          <Text style={styles.hint}>
            Tell us what you want to do with this order
          </Text>
        </View>

        {/* Example Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 What we'll do:</Text>
          <Text style={styles.infoText}>
            • Parse your order details from the email
          </Text>
          <Text style={styles.infoText}>
            • Navigate to the retailer's return portal
          </Text>
          <Text style={styles.infoText}>• Fill out all return forms</Text>
          <Text style={styles.infoText}>
            • Generate and send you the shipping label
          </Text>
          <Text style={styles.infoText}>
            • Schedule a courier pickup if available
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isProcessing && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isProcessing}>
          {isProcessing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.submitButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Start Return Process</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emailInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 200,
  },
  instructionInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  uploadButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default EmailInputScreen;
