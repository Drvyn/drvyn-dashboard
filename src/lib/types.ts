export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'not-interested' | 'to-follow-up' | 'cold-enq' | 'booking-confirmed';
export type InsuranceStatus = 'new' | 'contacted' | 'completed' | 'rejected' | 'not-interested' | 'to-follow-up' | 'cold-enq' | 'booking-confirmed';
export type GeneralRequestStatus = 'new' | 'in-progress' | 'resolved' | 'not-interested' | 'to-follow-up' | 'cold-enq' | 'booking-confirmed';

export interface CartItem {
  packageName: string;
  price: number;
  quantity: number;
}

export interface Booking {
  _id: string;
  brand: string;
  model: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
  year: string;
  phone: string;
  date: string;
  time: string;
  address: string;
  alternatePhone?: string;
  serviceCenter: string;
  totalPrice: number;
  cartItems: CartItem[];
  status: BookingStatus;
  createdAt: string;
}

export interface InsuranceRequest {
  _id: string;
  brand: string;
  model: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
  year: string;
  phone: string;
  companyPolicyName: string;
  createdAt: string;
  type: 'insurance_request';
  status: InsuranceStatus;
}

export interface GeneralRequest {
  _id: string;
  brand: string;
  model: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
  year: string;
  phone: string;
  createdAt: string;
  status: GeneralRequestStatus;
}

export interface Customer {
  phone: string;
  name: string;
  totalBookings: number;
  totalRequests: number;
  lastSeen: string;
  vehicles: { brand: string; model: string; year: string }[];
  address: string;
}