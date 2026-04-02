import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from '../../App';
import {ReturnRequest} from '../types/ReturnRequest';
import {ReturnsStorage} from '../services/ReturnsStorage';

type ReturnDetailsRouteProp = RouteProp<RootStackParamList, 'ReturnDetails'>;

const ReturnDetailsScreen = () => {
  const route = useRoute<ReturnDetailsRouteProp>();
  const {returnId} = route.params;
  const [returnData, setReturnData] = useState<ReturnRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReturnDetails();
  }, [returnId]);

  const loadReturnDetails = async () => {
    try {
      const storage = new ReturnsStorage();
      const data = await storage.getReturn(returnId);
      setReturnData(data);
    } catch (error) {
      console.error('Error loading return details:', error);
      Alert.alert('Error', 'Failed to load return details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadLabel = async () => {
    if (returnData?.shippingLabelUrl) {
      try {
        await Linking.openURL(returnData.shippingLabelUrl);
      } catch (error) {
        Alert.alert('Error', 'Failed to open shipping label');
      }
    }
  };

  const handleTrackShipment = async () => {
    if (returnData?.trackingUrl) {
      try {
        await Linking.openURL(returnData.trackingUrl);
      } catch (error) {
        Alert.alert('Error', 'Failed to open tracking URL');
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (!returnData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Return not found</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'processing':
        return '#f59e0b';
      case 'pending':
        return '#6b7280';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Status Header */}
        <View style={styles.statusSection}>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(returnData.status)},
            ]}>
            <Text style={styles.statusText}>
              {returnData.status.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.returnId}>Return ID: {returnData.id}</Text>
        </View>

        {/* Order Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Retailer" value={returnData.retailer} />
            <InfoRow label="Order ID" value={returnData.orderId} />
            {returnData.productName && (
              <InfoRow label="Product" value={returnData.productName} />
            )}
            {returnData.amount && (
              <InfoRow label="Amount" value={`$${returnData.amount}`} />
            )}
            <InfoRow
              label="Initiated"
              value={new Date(returnData.createdAt).toLocaleString()}
            />
          </View>
        </View>

        {/* Progress Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.timeline}>
            {returnData.progressSteps?.map((step, index) => (
              <TimelineItem
                key={index}
                title={step.title}
                description={step.description}
                timestamp={step.timestamp}
                isCompleted={step.completed}
                isLast={index === returnData.progressSteps!.length - 1}
              />
            )) || (
              <View style={styles.noProgressContainer}>
                <Text style={styles.noProgressText}>
                  No progress updates yet
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Shipping Information */}
        {returnData.trackingNumber && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping</Text>
            <View style={styles.infoCard}>
              <InfoRow
                label="Tracking Number"
                value={returnData.trackingNumber}
              />
              {returnData.carrier && (
                <InfoRow label="Carrier" value={returnData.carrier} />
              )}
              {returnData.pickupScheduled && (
                <InfoRow
                  label="Pickup Scheduled"
                  value={new Date(
                    returnData.pickupScheduled,
                  ).toLocaleDateString()}
                />
              )}
            </View>

            {returnData.trackingUrl && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleTrackShipment}>
                <Text style={styles.actionButtonText}>
                  🔍 Track Shipment
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Shipping Label */}
        {returnData.shippingLabelUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Label</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleDownloadLabel}>
              <Text style={styles.primaryButtonText}>
                📄 Download Shipping Label
              </Text>
            </TouchableOpacity>
            <Text style={styles.hint}>
              Print this label and attach it to your package
            </Text>
          </View>
        )}

        {/* Return Instructions */}
        {returnData.returnInstructions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Return Instructions</Text>
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsText}>
                {returnData.returnInstructions}
              </Text>
            </View>
          </View>
        )}

        {/* Error Details (if failed) */}
        {returnData.status === 'failed' && returnData.errorMessage && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Error Details</Text>
            <View style={styles.errorCard}>
              <Text style={styles.errorCardText}>
                {returnData.errorMessage}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const InfoRow = ({label, value}: {label: string; value: string}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const TimelineItem = ({
  title,
  description,
  timestamp,
  isCompleted,
  isLast,
}: {
  title: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
  isLast: boolean;
}) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineIndicator}>
      <View
        style={[
          styles.timelineDot,
          isCompleted ? styles.timelineDotCompleted : styles.timelineDotPending,
        ]}>
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </View>
      {!isLast && (
        <View
          style={[
            styles.timelineLine,
            isCompleted
              ? styles.timelineLineCompleted
              : styles.timelineLinePending,
          ]}
        />
      )}
    </View>
    <View style={styles.timelineContent}>
      <Text style={styles.timelineTitle}>{title}</Text>
      <Text style={styles.timelineDescription}>{description}</Text>
      <Text style={styles.timelineTimestamp}>
        {new Date(timestamp).toLocaleString()}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
  },
  statusSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  returnId: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  timeline: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotCompleted: {
    backgroundColor: '#10b981',
  },
  timelineDotPending: {
    backgroundColor: '#e5e7eb',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    minHeight: 40,
  },
  timelineLineCompleted: {
    backgroundColor: '#10b981',
  },
  timelineLinePending: {
    backgroundColor: '#e5e7eb',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  timelineTimestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  noProgressContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noProgressText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  instructionsCard: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  instructionsText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  errorCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorCardText: {
    fontSize: 14,
    color: '#991b1b',
    lineHeight: 20,
  },
});

export default ReturnDetailsScreen;
