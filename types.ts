
export interface Shipment {
  id: string;
  status: 'In Transit' | 'Delivered' | 'Pending' | 'Out for Delivery';
  origin: string;
  destination: string;
  estimatedArrival: string;
  currentLocation: string;
  weight: string;
  history: ShipmentEvent[];
}

export interface ShipmentEvent {
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface QuoteRequest {
  origin: string;
  destination: string;
  weight: number;
  serviceType: 'Standard' | 'Express' | 'Luxury';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface User {
  name: string;
  email: string;
  role: 'Client' | 'Admin';
}
