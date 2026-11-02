import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { RoomType, BookingSource } from '../types';
import { X, BedDouble, Calendar, DollarSign, UserPlus, Sparkles } from 'lucide-react';
import { calculateStayTotal, formatCurrency, ROOM_PRICES } from '../utils/helpers';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRoomNo?: number | null;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({
  isOpen,
  onClose,
  preselectedRoomNo,
}) => {
  const { guests, rooms, addGuest } = useHotel();

  // Next suggested ID
  const nextId = guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1;

  const [id, setId] = useState<number>(nextId);
  const [name, setName] = useState('');
  const [source, setSource] = useState<string>('Website');
  const [roomNo, setRoomNo] = useState<number>(preselectedRoomNo || 102);
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [checkOutDate, setCheckOutDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [typeOfRoom, setTypeOfRoom] = useState<RoomType>('Standard');
  const [status, setStatus] = useState<'Checked In' | 'Reserved'>('Checked In');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Update room type when room number changes
  useEffect(() => {
    const targetRoom = rooms.find(r => r.room_no === roomNo);
    if (targetRoom) {
      setTypeOfRoom(targetRoom.type);
    }
  }, [roomNo, rooms]);

  useEffect(() => {
    if (preselectedRoomNo) {
      setRoomNo(preselectedRoomNo);
    }
  }, [preselectedRoomNo]);

  useEffect(() => {
    if (isOpen) {
      const generatedId = guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1;
      setId(generatedId);
    }
  }, [isOpen, guests]);

  if (!isOpen) return null;

  const stayCalc = calculateStayTotal(typeOfRoom, date, checkOutDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = addGuest({
      id: Number(id),
      name: name.trim(),
      source,
      room_no: Number(roomNo),
      date,
      check_out_date: checkOutDate,
      type_of_room: typeOfRoom,
      status,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      total_amount: stayCalc.total,
      payment_status: status === 'Checked In' ? 'Paid' : 'Pending',
      notes: notes.trim() || undefined,
    });

    if (success) {
      onClose();
      // Reset
      setName('');
      setPhone('');
      setEmail('');
      setNotes('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
              <UserPlus className="w-5 h-5 text-brand-500" />
              Register New Hotel Guest
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Corresponds to SQL: <code className="font-mono text-brand-600">INSERT INTO guest VALUES (...)</code>
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Guest ID (Primary Key) *
              </label>
              <input
                type="number"
                value={id}
                onChange={(e) => setId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Guest Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lord Alistair Vance"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Source of Booking *
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Website">Website</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Booking.com">Booking.com</option>
                <option value="Expedia">Expedia</option>
                <option value="Travel Agency">Travel Agency</option>
                <option value="Phone Reservation">Phone Reservation</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Suite / Room No *
              </label>
              <select
                value={roomNo}
                onChange={(e) => setRoomNo(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              >
                {rooms.map(r => (
                  <option key={r.room_no} value={r.room_no}>
                    Room {r.room_no} &bull; {r.type} (${r.price_per_night}/n) {r.status === 'Available' ? '✅ Free' : `(${r.status})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Check-In Date (date) *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Check-Out Date *
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Type of Room
              </label>
              <select
                value={typeOfRoom}
                onChange={(e) => setTypeOfRoom(e.target.value as RoomType)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Standard">Standard ($120/night)</option>
                <option value="Deluxe">Deluxe ($220/night)</option>
                <option value="Executive Suite">Executive Suite ($450/night)</option>
                <option value="Presidential Suite">Presidential Suite ($950/night)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registration Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Checked In">Immediate Check-In (Mark Occupied)</option>
                <option value="Reserved">Future Reservation (Mark Reserved)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Guest Phone (with country code)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Guest Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@example.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Pricing Estimation Preview Banner */}
          <div className="p-3.5 rounded-2xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/50 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                Automated Pricing Calculation (PRD 8)
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                {stayCalc.nights} Nights @ {formatCurrency(stayCalc.rate)}/night + 12% Tax
              </div>
            </div>
            <div className="text-base font-extrabold text-brand-700 dark:text-brand-300 font-mono">
              {formatCurrency(stayCalc.total)}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-md shadow-brand-500/20 transition-all"
            >
              Save Record into Database
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
