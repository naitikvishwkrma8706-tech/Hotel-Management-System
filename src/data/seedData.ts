import { Guest, Staff, Room } from '../types';

export const INITIAL_ROOMS: Room[] = [
  // Floor 1 - Standard Rooms ($120/night)
  { room_no: 101, floor: 1, type: 'Standard', price_per_night: 120, status: 'Occupied', guest_id: 1, guest_name: 'Arthur Pendelton', capacity: 2, amenities: ['King Bed', 'Free Wi-Fi', 'Smart TV', 'City View'] },
  { room_no: 102, floor: 1, type: 'Standard', price_per_night: 120, status: 'Available', capacity: 2, amenities: ['Queen Bed', 'Free Wi-Fi', 'Coffee Maker'] },
  { room_no: 103, floor: 1, type: 'Standard', price_per_night: 120, status: 'Reserved', guest_id: 2, guest_name: 'Elena Rostova', capacity: 2, amenities: ['Twin Beds', 'Free Wi-Fi', 'Work Desk'] },
  { room_no: 104, floor: 1, type: 'Standard', price_per_night: 120, status: 'Available', capacity: 2, amenities: ['King Bed', 'Free Wi-Fi', 'Smart TV'] },
  { room_no: 105, floor: 1, type: 'Standard', price_per_night: 120, status: 'Maintenance', capacity: 2, amenities: ['Queen Bed', 'Free Wi-Fi', 'Balcony'] },
  { room_no: 106, floor: 1, type: 'Standard', price_per_night: 120, status: 'Occupied', guest_id: 3, guest_name: 'Marcus Vance', capacity: 2, amenities: ['King Bed', 'Free Wi-Fi', 'City View'] },

  // Floor 2 - Deluxe Rooms ($220/night)
  { room_no: 201, floor: 2, type: 'Deluxe', price_per_night: 220, status: 'Occupied', guest_id: 4, guest_name: 'Sophia Sterling', capacity: 3, amenities: ['King Bed', 'Ocean View', 'Mini Bar', 'Bathtub', 'High-Speed Wi-Fi'] },
  { room_no: 202, floor: 2, type: 'Deluxe', price_per_night: 220, status: 'Available', capacity: 3, amenities: ['King Bed', 'Ocean View', 'Mini Bar', 'Balcony'] },
  { room_no: 203, floor: 2, type: 'Deluxe', price_per_night: 220, status: 'Reserved', guest_id: 5, guest_name: 'Julian Croft', capacity: 3, amenities: ['Double Queen', 'Garden View', 'Mini Bar', 'Espresso Machine'] },
  { room_no: 204, floor: 2, type: 'Deluxe', price_per_night: 220, status: 'Occupied', guest_id: 6, guest_name: 'Amara Chen', capacity: 3, amenities: ['King Bed', 'Ocean View', 'Smart Sound System', 'Bathtub'] },
  { room_no: 205, floor: 2, type: 'Deluxe', price_per_night: 220, status: 'Available', capacity: 3, amenities: ['King Bed', 'Pool View', 'Private Terrace'] },
  { room_no: 206, floor: 2, type: 'Deluxe', price_per_night: 220, status: 'Occupied', guest_id: 7, guest_name: 'David Kim', capacity: 3, amenities: ['King Bed', 'Ocean View', 'Mini Bar'] },

  // Floor 3 - Executive Suites ($450/night)
  { room_no: 301, floor: 3, type: 'Executive Suite', price_per_night: 450, status: 'Occupied', guest_id: 8, guest_name: 'Lady Beatrice Montgomery', capacity: 4, amenities: ['Master Suite', 'Panoramic View', 'Private Lounge', 'Jacuzzi', 'Butler Service'] },
  { room_no: 302, floor: 3, type: 'Executive Suite', price_per_night: 450, status: 'Available', capacity: 4, amenities: ['Master Suite', 'City Skyline View', 'Living Room', 'Dining Area', 'Jacuzzi'] },
  { room_no: 303, floor: 3, type: 'Executive Suite', price_per_night: 450, status: 'Reserved', guest_id: 9, guest_name: 'Carlos Santana', capacity: 4, amenities: ['Master Suite', 'Panoramic Ocean View', 'Walk-in Closet', 'Champagne Bar'] },
  { room_no: 304, floor: 3, type: 'Executive Suite', price_per_night: 450, status: 'Available', capacity: 4, amenities: ['Master Suite', 'Private Office', 'Conference Setup', 'Wine Cooler'] },

  // Floor 4 - Presidential Suites ($950/night)
  { room_no: 401, floor: 4, type: 'Presidential Suite', price_per_night: 950, status: 'Occupied', guest_id: 10, guest_name: 'Ambassador Tariq Al-Mansoor', capacity: 6, amenities: ['Penthouse Level', '360° Terrace', 'Private Heated Pool', 'Private Chef Kitchen', '24/7 Butler'] },
  { room_no: 402, floor: 4, type: 'Presidential Suite', price_per_night: 950, status: 'Available', capacity: 6, amenities: ['Penthouse Level', 'Grand Piano', 'Helipad Access', 'Sauna & Steam Room', 'Private Elevator'] }
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 1,
    name: 'Arthur Pendelton',
    source: 'Website',
    room_no: 101,
    date: '2026-11-01',
    check_out_date: '2026-11-05',
    type_of_room: 'Standard',
    status: 'Checked In',
    phone: '+1 (555) 234-8901',
    email: 'arthur.p@example.com',
    total_amount: 480,
    payment_status: 'Paid',
    notes: 'Requested quiet room away from elevator.'
  },
  {
    id: 2,
    name: 'Elena Rostova',
    source: 'Booking.com',
    room_no: 103,
    date: '2026-11-03',
    check_out_date: '2026-11-07',
    type_of_room: 'Standard',
    status: 'Reserved',
    phone: '+44 20 7946 0912',
    email: 'elena.rostova@example.co.uk',
    total_amount: 480,
    payment_status: 'Pending',
    notes: 'Late arrival expected (around 9 PM).'
  },
  {
    id: 3,
    name: 'Marcus Vance',
    source: 'Walk-in',
    room_no: 106,
    date: '2026-10-31',
    check_out_date: '2026-11-04',
    type_of_room: 'Standard',
    status: 'Checked In',
    phone: '+1 (555) 782-3490',
    email: 'm.vance@example.org',
    total_amount: 480,
    payment_status: 'Paid',
    notes: 'Company business traveler.'
  },
  {
    id: 4,
    name: 'Sophia Sterling',
    source: 'Expedia',
    room_no: 201,
    date: '2026-11-01',
    check_out_date: '2026-11-06',
    type_of_room: 'Deluxe',
    status: 'Checked In',
    phone: '+1 (555) 901-4432',
    email: 'sophia.s@lifestyle.com',
    total_amount: 1100,
    payment_status: 'Paid',
    notes: 'Celebrating wedding anniversary. Complimentary champagne delivered.'
  },
  {
    id: 5,
    name: 'Julian Croft',
    source: 'Travel Agency',
    room_no: 203,
    date: '2026-11-04',
    check_out_date: '2026-11-09',
    type_of_room: 'Deluxe',
    status: 'Reserved',
    phone: '+61 2 9385 1111',
    email: 'j.croft@pacificadventures.au',
    total_amount: 1100,
    payment_status: 'Partial',
    notes: 'Requested baby crib setup.'
  },
  {
    id: 6,
    name: 'Amara Chen',
    source: 'Website',
    room_no: 204,
    date: '2026-10-30',
    check_out_date: '2026-11-03',
    type_of_room: 'Deluxe',
    status: 'Checked In',
    phone: '+65 6789 0123',
    email: 'amara.chen@techglobal.sg',
    total_amount: 880,
    payment_status: 'Paid',
    notes: 'Requires invoice addressed to corporation.'
  },
  {
    id: 7,
    name: 'David Kim',
    source: 'Walk-in',
    room_no: 206,
    date: '2026-11-02',
    check_out_date: '2026-11-06',
    type_of_room: 'Deluxe',
    status: 'Checked In',
    phone: '+1 (555) 432-8765',
    email: 'david.kim@seoulventures.com',
    total_amount: 880,
    payment_status: 'Paid'
  },
  {
    id: 8,
    name: 'Lady Beatrice Montgomery',
    source: 'Travel Agency',
    room_no: 301,
    date: '2026-10-28',
    check_out_date: '2026-11-08',
    type_of_room: 'Executive Suite',
    status: 'Checked In',
    phone: '+44 131 496 0888',
    email: 'beatrice@montgomerytrust.org',
    total_amount: 4950,
    payment_status: 'Paid',
    notes: 'VIP Guest. Personalized butler service assigned.'
  },
  {
    id: 9,
    name: 'Carlos Santana',
    source: 'Website',
    room_no: 303,
    date: '2026-11-05',
    check_out_date: '2026-11-12',
    type_of_room: 'Executive Suite',
    status: 'Reserved',
    phone: '+34 91 123 4567',
    email: 'csantana@musica.es',
    total_amount: 3150,
    payment_status: 'Pending',
    notes: 'Airport limousine pickup booked.'
  },
  {
    id: 10,
    name: 'Ambassador Tariq Al-Mansoor',
    source: 'Travel Agency',
    room_no: 401,
    date: '2026-10-29',
    check_out_date: '2026-11-07',
    type_of_room: 'Presidential Suite',
    status: 'Checked In',
    phone: '+971 4 312 9000',
    email: 'delegation@almansoor.ae',
    total_amount: 8550,
    payment_status: 'Paid',
    notes: 'VVIP diplomatic guest. Private security protocol active.'
  },
  {
    id: 11,
    name: 'Chloe Tremblay',
    source: 'Booking.com',
    room_no: 104,
    date: '2026-10-25',
    check_out_date: '2026-10-29',
    type_of_room: 'Standard',
    status: 'Checked Out',
    phone: '+1 (514) 872-1100',
    email: 'chloe.t@montreal.ca',
    total_amount: 480,
    payment_status: 'Paid'
  },
  {
    id: 12,
    name: 'Vikram Malhotra',
    source: 'Website',
    room_no: 202,
    date: '2026-10-22',
    check_out_date: '2026-10-26',
    type_of_room: 'Deluxe',
    status: 'Checked Out',
    phone: '+91 98200 12345',
    email: 'vikram.m@innovate.in',
    total_amount: 880,
    payment_status: 'Paid'
  }
];

export const INITIAL_STAFF: Staff[] = [
  // Management (Salary: $6,000 as per PRD / TRD specifications)
  {
    id: 101,
    name: 'Eleanor Hawthorne',
    dept: 'management',
    sal: 6000,
    hiredate: '2021-03-15',
    phone: '+1 (555) 111-2233',
    email: 'e.hawthorne@grandhorizon.com',
    shift: 'Morning',
    status: 'Active'
  },
  {
    id: 102,
    name: 'Rajiv Mehra',
    dept: 'management',
    sal: 6000,
    hiredate: '2022-07-01',
    phone: '+1 (555) 222-3344',
    email: 'r.mehra@grandhorizon.com',
    shift: 'Morning',
    status: 'Active'
  },

  // Food and Beverages (Salary: $4,000 as per PRD / TRD specifications)
  {
    id: 201,
    name: 'Chef Antoine Laurent',
    dept: 'food and beverages',
    sal: 4000,
    hiredate: '2020-11-10',
    phone: '+1 (555) 333-4455',
    email: 'a.laurent@grandhorizon.com',
    shift: 'Evening',
    status: 'Active'
  },
  {
    id: 202,
    name: 'Gabriella Rossi',
    dept: 'food and beverages',
    sal: 4000,
    hiredate: '2023-02-14',
    phone: '+1 (555) 444-5566',
    email: 'g.rossi@grandhorizon.com',
    shift: 'Morning',
    status: 'Active'
  },
  {
    id: 203,
    name: 'Mateo Morales',
    dept: 'food and beverages',
    sal: 4000,
    hiredate: '2023-09-01',
    phone: '+1 (555) 555-6677',
    email: 'm.morales@grandhorizon.com',
    shift: 'Night',
    status: 'Active'
  },

  // Cleaning / Housekeeping (Salary: $2,000 as per PRD / TRD specifications)
  {
    id: 301,
    name: 'Maria Santos',
    dept: 'cleaning',
    sal: 2000,
    hiredate: '2022-01-20',
    phone: '+1 (555) 666-7788',
    email: 'm.santos@grandhorizon.com',
    shift: 'Morning',
    status: 'Active'
  },
  {
    id: 302,
    name: 'Sunita Patel',
    dept: 'cleaning',
    sal: 2000,
    hiredate: '2022-05-15',
    phone: '+1 (555) 777-8899',
    email: 's.patel@grandhorizon.com',
    shift: 'Morning',
    status: 'Active'
  },
  {
    id: 303,
    name: 'David O\'Connor',
    dept: 'cleaning',
    sal: 2000,
    hiredate: '2023-04-10',
    phone: '+1 (555) 888-9900',
    email: 'd.oconnor@grandhorizon.com',
    shift: 'Evening',
    status: 'Active'
  },
  {
    id: 304,
    name: 'Fatima Zahra',
    dept: 'cleaning',
    sal: 2000,
    hiredate: '2024-01-15',
    phone: '+1 (555) 999-0011',
    email: 'f.zahra@grandhorizon.com',
    shift: 'Night',
    status: 'Active'
  },

  // Front Desk
  {
    id: 401,
    name: 'Liam Gallagher',
    dept: 'front desk',
    sal: 3500,
    hiredate: '2023-06-12',
    phone: '+1 (555) 123-9876',
    email: 'l.gallagher@grandhorizon.com',
    shift: 'Morning',
    status: 'Active'
  },
  {
    id: 402,
    name: 'Zara Washington',
    dept: 'front desk',
    sal: 3500,
    hiredate: '2024-03-01',
    phone: '+1 (555) 234-0987',
    email: 'z.washington@grandhorizon.com',
    shift: 'Evening',
    status: 'Active'
  },

  // Security & Maintenance
  {
    id: 501,
    name: 'Viktor Reznov',
    dept: 'security',
    sal: 2500,
    hiredate: '2022-09-18',
    phone: '+1 (555) 345-1098',
    email: 'v.reznov@grandhorizon.com',
    shift: 'Night',
    status: 'Active'
  },
  {
    id: 601,
    name: 'Kenji Sato',
    dept: 'maintenance',
    sal: 3000,
    hiredate: '2021-11-05',
    phone: '+1 (555) 456-2109',
    email: 'k.sato@grandhorizon.com',
    shift: 'Morning',
    status: 'Active'
  }
];
