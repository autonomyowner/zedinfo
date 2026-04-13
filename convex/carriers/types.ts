export interface CarrierCredentials {
  apiId?: string;
  apiToken?: string;
  bearerToken?: string;
}

export interface ShipmentData {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  wilaya: string;
  commune?: string;
  totalAmount: number;
  weight?: number;
  isCod: boolean;
}

export interface CarrierAdapter {
  testConnection(): Promise<boolean>;
  getFees(fromWilaya: number, toWilaya: number, weight?: number): Promise<number>;
  createShipment(order: ShipmentData): Promise<{ tracking: string; label?: string }>;
  getTrackingUrl(tracking: string): string;
}
