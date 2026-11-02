export type RoomType = 'Standard' | 'Deluxe' | 'Executive Suite' | 'Presidential Suite';

export type BookingSource = 
  | 'Walk-in' 
  | 'Website' 
  | 'Booking.com' 
  | 'Expedia' 
  | 'Travel Agency' 
  | 'Phone Reservation';

export type GuestStatus = 'Checked In' | 'Reserved' | 'Checked Out';

export interface Guest {
  id: number;
  name: string;
  source: BookingSource | string;
  room_no: number;
  date: string; // YYYY-MM-DD
  check_out_date: string; // YYYY-MM-DD
  type_of_room: RoomType | string;
  status: GuestStatus;
  phone?: string;
  email?: string;
  total_amount?: number;
  payment_status?: 'Paid' | 'Pending' | 'Partial';
  notes?: string;
}

export type Department = 
  | 'cleaning' 
  | 'food and beverages' 
  | 'management' 
  | 'front desk' 
  | 'security' 
  | 'maintenance';

export interface Staff {
  id: number;
  name: string;
  dept: Department | string;
  sal: number;
  hiredate: string; // YYYY-MM-DD
  phone?: string;
  email?: string;
  shift?: 'Morning' | 'Evening' | 'Night';
  status?: 'Active' | 'On Leave';
}

export type RoomStatus = 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';

export interface Room {
  room_no: number;
  floor: number;
  type: RoomType;
  price_per_night: number;
  status: RoomStatus;
  guest_id?: number;
  guest_name?: string;
  capacity: number;
  amenities: string[];
}

export type UserRole = 'admin' | 'receptionist' | 'manager';

export interface NotificationToast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
