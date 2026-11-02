import { Department, RoomType } from '../types';

export const ROOM_PRICES: Record<RoomType, number> = {
  'Standard': 120,
  'Deluxe': 220,
  'Executive Suite': 450,
  'Presidential Suite': 950,
};

export const DEPARTMENT_DEFAULT_SALARIES: Record<string, number> = {
  'cleaning': 2000,
  'food and beverages': 4000,
  'food': 4000,
  'beverage': 4000,
  'management': 6000,
  'front desk': 3500,
  'security': 2500,
  'maintenance': 3000,
};

/**
 * Automatically determine salary based on department matching Python staff.py logic:
 * cleaning -> 2000
 * food and beverages -> 4000
 * management -> 6000
 */
export function calculateSalaryForDepartment(dept: string): number {
  const normalized = dept.toLowerCase().trim();
  if (normalized === 'cleaning') return 2000;
  if (normalized.includes('food') || normalized.includes('beverage')) return 4000;
  if (normalized.includes('manag')) return 6000;
  if (normalized.includes('front')) return 3500;
  if (normalized.includes('sec')) return 2500;
  if (normalized.includes('maint')) return 3000;
  return DEPARTMENT_DEFAULT_SALARIES[normalized] || 3000;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn + 'T00:00:00').getTime();
  const end = new Date(checkOut + 'T00:00:00').getTime();
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
}

export function calculateStayTotal(
  roomType: string,
  checkIn: string,
  checkOut: string
): { nights: number; rate: number; roomTotal: number; taxes: number; total: number } {
  const nights = calculateNights(checkIn, checkOut);
  const rate = ROOM_PRICES[roomType as RoomType] || 150;
  const roomTotal = nights * rate;
  const taxes = Math.round(roomTotal * 0.12);
  const total = roomTotal + taxes;
  return { nights, rate, roomTotal, taxes, total };
}

export function exportToJson(data: any, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportGuestsToCsv(guests: any[]) {
  const headers = ['ID', 'Name', 'Source', 'Room No', 'Date', 'Check Out', 'Type of Room', 'Status', 'Phone', 'Total'];
  const rows = guests.map(g => [
    g.id,
    `"${g.name}"`,
    `"${g.source}"`,
    g.room_no,
    g.date,
    g.check_out_date || '',
    `"${g.type_of_room}"`,
    `"${g.status}"`,
    `"${g.phone || ''}"`,
    g.total_amount || 0
  ]);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hotel_guests_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportStaffToCsv(staff: any[]) {
  const headers = ['ID', 'Name', 'Department', 'Salary', 'Hire Date', 'Shift', 'Phone', 'Status'];
  const rows = staff.map(s => [
    s.id,
    `"${s.name}"`,
    `"${s.dept}"`,
    s.sal,
    s.hiredate,
    `"${s.shift || 'Morning'}"`,
    `"${s.phone || ''}"`,
    `"${s.status || 'Active'}"`
  ]);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hotel_staff_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Validates and parses phone numbers mimicking phonenumber.py logic
 */
export function validatePhoneNumber(rawNumber: string) {
  const cleaned = rawNumber.replace(/[^0-9+]/g, '');
  if (!cleaned || cleaned.length < 7) {
    return {
      valid: false,
      international_format: rawNumber,
      country_name: 'Unknown',
      location: 'Unknown',
      carrier: 'Unknown',
      line_type: 'Unknown',
    };
  }

  let country = 'United States';
  let carrier = 'AT&T Wireless / Verizon';
  let line_type = 'mobile';
  let location = 'North America';

  if (cleaned.startsWith('+44')) {
    country = 'United Kingdom';
    carrier = 'Vodafone UK / EE';
    location = 'London / Greater London';
  } else if (cleaned.startsWith('+91')) {
    country = 'India';
    carrier = 'Reliance Jio / Airtel';
    location = 'Mumbai / New Delhi Telecom Circle';
  } else if (cleaned.startsWith('+971')) {
    country = 'United Arab Emirates';
    carrier = 'e& (Etisalat) / du';
    location = 'Dubai / Abu Dhabi';
  } else if (cleaned.startsWith('+34')) {
    country = 'Spain';
    carrier = 'Movistar / Orange';
    location = 'Madrid / Barcelona';
  } else if (cleaned.startsWith('+65')) {
    country = 'Singapore';
    carrier = 'Singtel';
    location = 'Singapore Central';
  } else if (cleaned.startsWith('+61')) {
    country = 'Australia';
    carrier = 'Telstra';
    location = 'Sydney / New South Wales';
  } else if (cleaned.startsWith('+1')) {
    country = 'United States / Canada';
    carrier = 'Verizon Wireless';
    location = 'California / New York Telecom Circle';
  }

  return {
    valid: true,
    international_format: cleaned.startsWith('+') ? cleaned : `+${cleaned}`,
    country_name: country,
    location: location,
    carrier: carrier,
    line_type: line_type,
  };
}
