import React, { createContext, useContext, useState, useEffect } from 'react';
import { Guest, Staff, Room, UserRole, NotificationToast, RoomType } from '../types';
import { INITIAL_GUESTS, INITIAL_STAFF, INITIAL_ROOMS } from '../data/seedData';
import { calculateSalaryForDepartment, calculateStayTotal } from '../utils/helpers';

interface HotelContextType {
  guests: Guest[];
  staff: Staff[];
  rooms: Room[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  toasts: NotificationToast[];
  addToast: (type: NotificationToast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  // Guest actions
  addGuest: (guestData: Omit<Guest, 'id'> & { id?: number }) => boolean;
  updateGuest: (id: number, updates: Partial<Guest>) => boolean;
  deleteGuest: (id: number) => boolean;
  checkInGuest: (id: number) => void;
  checkOutGuest: (id: number) => void;

  // Staff actions
  addStaff: (staffData: Omit<Staff, 'id'> & { id?: number; manualSal?: boolean }) => boolean;
  updateStaff: (id: number, updates: Partial<Staff>) => boolean;
  deleteStaff: (id: number) => boolean;

  // Room actions
  updateRoomStatus: (room_no: number, status: Room['status']) => void;

  // Data management
  resetToDemoData: () => void;
  importAllData: (jsonData: { guests?: Guest[]; staff?: Staff[]; rooms?: Room[] }) => boolean;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const STORAGE_KEYS = {
  GUESTS: 'grand_horizon_guests_v2',
  STAFF: 'grand_horizon_staff_v2',
  ROOMS: 'grand_horizon_rooms_v2',
  DARK_MODE: 'grand_horizon_dark_mode',
  ROLE: 'grand_horizon_user_role',
};

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GUESTS);
      return saved ? JSON.parse(saved) : INITIAL_GUESTS;
    } catch {
      return INITIAL_GUESTS;
    }
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'admin';
    } catch {
      return 'admin';
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  // Apply dark mode class to HTML root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
  }, [darkMode]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, userRole);
  }, [userRole]);

  const addToast = (type: NotificationToast['type'], title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync rooms with guests when bookings change
  const syncRoomWithGuest = (room_no: number, status: Room['status'], guestId?: number, guestName?: string) => {
    setRooms(prevRooms => prevRooms.map(r => {
      if (r.room_no === room_no) {
        return {
          ...r,
          status,
          guest_id: status === 'Occupied' || status === 'Reserved' ? guestId : undefined,
          guest_name: status === 'Occupied' || status === 'Reserved' ? guestName : undefined,
        };
      }
      return r;
    }));
  };

  // ==================== GUEST ACTIONS ====================
  const addGuest = (guestData: Omit<Guest, 'id'> & { id?: number }): boolean => {
    // Generate or validate ID
    const newId = guestData.id || (guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1);
    
    // Check duplicate ID
    if (guests.some(g => g.id === newId)) {
      addToast('error', 'Duplicate ID', `Guest ID ${newId} already exists in database.`);
      return false;
    }

    const { total } = calculateStayTotal(
      guestData.type_of_room,
      guestData.date,
      guestData.check_out_date || guestData.date
    );

    const newGuest: Guest = {
      ...guestData,
      id: newId,
      total_amount: guestData.total_amount ?? total,
      payment_status: guestData.payment_status || (guestData.status === 'Checked In' ? 'Paid' : 'Pending'),
    };

    setGuests(prev => [newGuest, ...prev]);

    // Update Room status
    const roomStatus = newGuest.status === 'Checked In' ? 'Occupied' : newGuest.status === 'Reserved' ? 'Reserved' : 'Available';
    syncRoomWithGuest(newGuest.room_no, roomStatus, newGuest.id, newGuest.name);

    addToast('success', 'Guest Added', `${newGuest.name} was successfully registered for Room ${newGuest.room_no}.`);
    return true;
  };

  const updateGuest = (id: number, updates: Partial<Guest>): boolean => {
    const existing = guests.find(g => g.id === id);
    if (!existing) {
      addToast('error', 'Not Found', `Guest #${id} does not exist.`);
      return false;
    }

    const updated = { ...existing, ...updates };

    // Recalculate billing if dates or room type changed
    if (updates.type_of_room || updates.date || updates.check_out_date) {
      const { total } = calculateStayTotal(
        updated.type_of_room,
        updated.date,
        updated.check_out_date
      );
      if (!updates.total_amount) {
        updated.total_amount = total;
      }
    }

    setGuests(prev => prev.map(g => (g.id === id ? updated : g)));

    // Update room if room number or status changed
    if (updates.room_no || updates.status || updates.name) {
      if (existing.room_no !== updated.room_no) {
        // Free old room
        syncRoomWithGuest(existing.room_no, 'Available');
      }
      const roomStatus = updated.status === 'Checked In' ? 'Occupied' : updated.status === 'Reserved' ? 'Reserved' : 'Available';
      syncRoomWithGuest(updated.room_no, roomStatus, updated.id, updated.name);
    }

    addToast('info', 'Guest Updated', `Record for ${updated.name} has been updated.`);
    return true;
  };

  const deleteGuest = (id: number): boolean => {
    const target = guests.find(g => g.id === id);
    if (!target) {
      addToast('error', 'Delete Failed', `No record found with ID ${id}.`);
      return false;
    }

    setGuests(prev => prev.filter(g => g.id !== id));
    // Release the room
    syncRoomWithGuest(target.room_no, 'Available');

    addToast('warning', 'Guest Removed', `${target.name} (Room ${target.room_no}) was deleted from the system.`);
    return true;
  };

  const checkInGuest = (id: number) => {
    updateGuest(id, { status: 'Checked In' });
    addToast('success', 'Checked In', `Guest #${id} is now checked in!`);
  };

  const checkOutGuest = (id: number) => {
    const target = guests.find(g => g.id === id);
    if (target) {
      updateGuest(id, { status: 'Checked Out', payment_status: 'Paid' });
      syncRoomWithGuest(target.room_no, 'Available');
      addToast('success', 'Checked Out', `Guest #${id} (${target.name}) has checked out. Room ${target.room_no} marked available.`);
    }
  };

  // ==================== STAFF ACTIONS ====================
  const addStaff = (staffData: Omit<Staff, 'id'> & { id?: number; manualSal?: boolean }): boolean => {
    const newId = staffData.id || (staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 101);

    if (staff.some(s => s.id === newId)) {
      addToast('error', 'Duplicate ID', `Staff ID ${newId} already exists in database.`);
      return false;
    }

    // Auto-calculate salary if not manually provided, matching staff.py logic!
    const sal = staffData.manualSal && staffData.sal ? staffData.sal : calculateSalaryForDepartment(staffData.dept);

    const newStaff: Staff = {
      ...staffData,
      id: newId,
      sal,
      shift: staffData.shift || 'Morning',
      status: staffData.status || 'Active',
    };

    setStaff(prev => [newStaff, ...prev]);
    addToast('success', 'Staff Member Added', `${newStaff.name} joined ${newStaff.dept} ($${newStaff.sal}/mo).`);
    return true;
  };

  const updateStaff = (id: number, updates: Partial<Staff>): boolean => {
    const existing = staff.find(s => s.id === id);
    if (!existing) {
      addToast('error', 'Not Found', `Staff #${id} not found.`);
      return false;
    }

    const updated = { ...existing, ...updates };

    // If department changed and salary was not explicitly overridden in updates, auto-recalculate salary!
    // Exactly matches Python staff.py behavior!
    if (updates.dept && !updates.sal && updates.dept !== existing.dept) {
      updated.sal = calculateSalaryForDepartment(updates.dept);
      addToast('info', 'Salary Adjusted', `Department changed to "${updates.dept}". Base salary auto-adjusted to $${updated.sal}.`);
    }

    setStaff(prev => prev.map(s => (s.id === id ? updated : s)));
    addToast('info', 'Staff Updated', `Record for ${updated.name} successfully updated.`);
    return true;
  };

  const deleteStaff = (id: number): boolean => {
    const target = staff.find(s => s.id === id);
    if (!target) {
      addToast('error', 'Delete Failed', `No staff record with ID ${id}.`);
      return false;
    }

    setStaff(prev => prev.filter(s => s.id !== id));
    addToast('warning', 'Staff Removed', `${target.name} has been removed from staff records.`);
    return true;
  };

  // ==================== ROOM ACTIONS ====================
  const updateRoomStatus = (room_no: number, status: Room['status']) => {
    setRooms(prev => prev.map(r => r.room_no === room_no ? { ...r, status } : r));
    addToast('info', 'Room Updated', `Room ${room_no} status set to ${status}.`);
  };

  // ==================== DATA MANAGEMENT ====================
  const resetToDemoData = () => {
    setGuests(INITIAL_GUESTS);
    setStaff(INITIAL_STAFF);
    setRooms(INITIAL_ROOMS);
    localStorage.removeItem(STORAGE_KEYS.GUESTS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.ROOMS);
    addToast('info', 'Reset Complete', 'All guest, staff, and room data restored to pristine demo state.');
  };

  const importAllData = (jsonData: { guests?: Guest[]; staff?: Staff[]; rooms?: Room[] }): boolean => {
    try {
      if (jsonData.guests && Array.isArray(jsonData.guests)) {
        setGuests(jsonData.guests);
      }
      if (jsonData.staff && Array.isArray(jsonData.staff)) {
        setStaff(jsonData.staff);
      }
      if (jsonData.rooms && Array.isArray(jsonData.rooms)) {
        setRooms(jsonData.rooms);
      }
      addToast('success', 'Import Successful', 'Database records imported successfully.');
      return true;
    } catch {
      addToast('error', 'Import Failed', 'Invalid JSON format.');
      return false;
    }
  };

  return (
    <HotelContext.Provider
      value={{
        guests,
        staff,
        rooms,
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        darkMode,
        setDarkMode,
        toasts,
        addToast,
        removeToast,
        addGuest,
        updateGuest,
        deleteGuest,
        checkInGuest,
        checkOutGuest,
        addStaff,
        updateStaff,
        deleteStaff,
        updateRoomStatus,
        resetToDemoData,
        importAllData,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
