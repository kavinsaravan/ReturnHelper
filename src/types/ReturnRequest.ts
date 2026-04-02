export interface ProgressStep {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface OrderDetails {
  orderId: string;
  retailer: string;
  productName?: string;
  productId?: string;
  amount?: number;
  purchaseDate?: string;
  customerEmail?: string;
  customerName?: string;
  orderUrl?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  retailer: string;
  productName?: string;
  amount?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  shippingLabelUrl?: string;
  pickupScheduled?: string;
  returnInstructions?: string;
  errorMessage?: string;
  progressSteps?: ProgressStep[];
  rawEmailContent?: string;
}

export interface ReturnInitiationRequest {
  orderDetails: OrderDetails;
  instruction: string;
}
