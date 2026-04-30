export type ServiceType = "Wash Only" | "Wash and Fold" | "Wash, Fold with Fabric Conditioner";
export type DeliveryOption = "Pick-up" | "Delivery";
export type BookingStatus = "Pending" | "Processing" | "Ready for Pick-up / Delivery" | "Completed";

export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  address?: string;
  role: "customer";
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceType: ServiceType;
  weight: number;
  totalPrice: number;
  deliveryOption: DeliveryOption;
  address?: string;
  status: BookingStatus;
  createdAt: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

export interface Admin {
  id: string;
  isAdmin: boolean;
  email: string;
}
