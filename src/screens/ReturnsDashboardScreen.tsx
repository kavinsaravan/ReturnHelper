import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../../App';
import {ReturnRequest} from '../types/ReturnRequest';
import {ReturnsStorage} from '../services/ReturnsStorage';

type ReturnsDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ReturnsDashboard'
>;

const ReturnsDashboardScreen = () => {
  const navigation = useNavigation<ReturnsDashboardNavigationProp>();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReturns = async () => {
    try {
      const storage = new ReturnsStorage();
      const allReturns = await storage.getAllReturns();
      setReturns(allReturns);
    } catch (error) {
      console.error('Error loading returns:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReturns();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadReturns();
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'processing':
        return '⚙️';
      case 'pending':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '📦';
    }
  };

  const renderReturnItem = ({item}: {item: ReturnRequest}) => (
    <TouchableOpacity
      style={styles.returnCard}
      onPress={() =>
        navigation.navigate('ReturnDetails', {returnId: item.id})
      }>
      <View style={styles.returnHeader}>
        <View style={styles.returnTitleContainer}>
          <Text style={styles.returnIcon}>{getStatusIcon(item.status)}</Text>
          <View style={styles.returnInfo}>
            <Text style={styles.returnRetailer}>{item.retailer}</Text>
            <Text style={styles.returnOrderId}>Order: {item.orderId}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.status)},
          ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.returnDetails}>
        <Text style={styles.returnProduct} numberOfLines={2}>
          {item.productName || 'Product details not available'}
        </Text>
        <Text style={styles.returnDate}>
          Initiated: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {item.trackingNumber && (
        <View style={styles.trackingContainer}>
          <Text style={styles.trackingLabel}>Tracking:</Text>
          <Text style={styles.trackingNumber}>{item.trackingNumber}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📭</Text>
      <Text style={styles.emptyStateTitle}>No Returns Yet</Text>
      <Text style={styles.emptyStateText}>
        When you start a return, it will appear here
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => navigation.navigate('EmailInput')}>
        <Text style={styles.emptyStateButtonText}>Start Your First Return</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading returns...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Returns</Text>
        <Text style={styles.headerSubtitle}>
          {returns.length} {returns.length === 1 ? 'return' : 'returns'}
        </Text>
      </View>

      <FlatList
        data={returns}
        renderItem={renderReturnItem}
        keyExtractor={item => item.id}
        contentContainerStyle={
          returns.length === 0
            ? styles.emptyContainer
            : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366f1"
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('EmailInput')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
  },
  returnCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  returnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  returnTitleContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  returnIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  returnInfo: {
    flex: 1,
  },
  returnRetailer: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  returnOrderId: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  returnDetails: {
    marginBottom: 8,
  },
  returnProduct: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  returnDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  trackingLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
  },
  trackingNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});

export default ReturnsDashboardScreen;
