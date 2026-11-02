import React, { useState, useMemo } from 'react';
import { useHotel } from '../context/HotelContext';
import { Guest, RoomType, BookingSource } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  BarChart3, 
  Filter, 
  ArrowUpDown, 
  FileText, 
  CheckCircle2, 
  X, 
  BedDouble,
  DollarSign,
  Download,
  AlertCircle
} from 'lucide-react';
import { exportGuestsToCsv, formatCurrency, formatDate, ROOM_PRICES } from '../utils/helpers';

interface GuestManagementProps {
  onOpenBookingModal: () => void;
  onOpenInvoiceModal: (guest: Guest) => void;
}

export const GuestManagement: React.FC<GuestManagementProps> = ({
  onOpenBookingModal,
  onOpenInvoiceModal,
}) => {
  const { guests, rooms, updateGuest, deleteGuest, checkInGuest, checkOutGuest, addToast } = useHotel();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<'all' | 'id' | 'name' | 'source' | 'room_no' | 'date' | 'type_of_room'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Guest>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Modals state
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);
  const [showGraphModal, setShowGraphModal] = useState<boolean>(false);
  const [graphMode, setGraphMode] = useState<'rooms' | 'source'>('rooms');

  // Filter & Search Logic
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      // Status filter
      if (statusFilter !== 'all' && g.status !== statusFilter) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      if (searchField === 'id') return String(g.id).includes(q);
      if (searchField === 'name') return g.name.toLowerCase().includes(q);
      if (searchField === 'source') return g.source.toLowerCase().includes(q);
      if (searchField === 'room_no') return String(g.room_no).includes(q);
      if (searchField === 'date') return g.date.includes(q);
      if (searchField === 'type_of_room') return g.type_of_room.toLowerCase().includes(q);

      // 'all' search
      return (
        String(g.id).includes(q) ||
        g.name.toLowerCase().includes(q) ||
        g.source.toLowerCase().includes(q) ||
        String(g.room_no).includes(q) ||
        g.date.includes(q) ||
        g.type_of_room.toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA! < valB!) return sortAsc ? -1 : 1;
      if (valA! > valB!) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [guests, searchQuery, searchField, statusFilter, sortField, sortAsc]);

  const toggleSort = (field: keyof Guest) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Aggregations for Matplotlib Graph recreation
  const roomBookingsData = useMemo(() => {
    const counts: Record<number, number> = {};
    guests.forEach(g => counts[g.room_no] = (counts[g.room_no] || 0) + 1);
    return Object.entries(counts).map(([room, count]) => ({
      room_no: Number(room),
      count
    })).sort((a, b) => a.room_no - b.room_no);
  }, [guests]);

  const sourceBookingsData = useMemo(() => {
    const counts: Record<string, number> = {};
    guests.forEach(g => counts[g.source] = (counts[g.source] || 0) + 1);
    return Object.entries(counts).map(([source, count]) => ({
      source,
      count,
      percent: Math.round((count / guests.length) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [guests]);

  const maxRoomCount = Math.max(...roomBookingsData.map(d => d.count), 1);
  const maxSourceCount = Math.max(...sourceBookingsData.map(d => d.count), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
              Guest Database Management
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
              {guests.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Recreation of <code className="text-brand-600 dark:text-brand-400 font-mono">src.modules.guest</code> (SQL Table: `guest`)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowGraphModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-brand-500" />
            <span>Matplotlib Visuals</span>
          </button>

          <button
            onClick={() => exportGuestsToCsv(guests)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenBookingModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-semibold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guest Record</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        
        {/* Search Field Dropdown (1. ID 2. Name 3. Source 4. Room no 5. Date 6. Type of Room from search_guest) */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Search by:</span>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as any)}
            className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all" className="dark:bg-slate-900">All Fields</option>
            <option value="id" className="dark:bg-slate-900">1. ID</option>
            <option value="name" className="dark:bg-slate-900">2. Name</option>
            <option value="source" className="dark:bg-slate-900">3. Source of Booking</option>
            <option value="room_no" className="dark:bg-slate-900">4. Room No</option>
            <option value="date" className="dark:bg-slate-900">5. Date</option>
            <option value="type_of_room" className="dark:bg-slate-900">6. Type of Room</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter records by ${searchField === 'all' ? 'any detail' : searchField}...`}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
          {['all', 'Checked In', 'Reserved', 'Checked Out'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === status
                  ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status === 'all' ? 'All Status' : status}
            </button>
          ))}
        </div>

      </div>

      {/* Guest Table */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider select-none">
                <th className="py-3.5 pl-4 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('id')}>
                  <div className="flex items-center gap-1">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Guest Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('room_no')}>
                  <div className="flex items-center gap-1">
                    <span>Room</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('type_of_room')}>
                  <div className="flex items-center gap-1">
                    <span>Category</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('source')}>
                  <div className="flex items-center gap-1">
                    <span>Source</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('date')}>
                  <div className="flex items-center gap-1">
                    <span>Booking Dates</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5">Billing</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-semibold">No guests found</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or add a new guest.</p>
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const statusColors = {
                    'Checked In': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                    'Reserved': 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                    'Checked Out': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
                  };

                  return (
                    <tr 
                      key={guest.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 pl-4 font-mono font-bold text-slate-500 dark:text-slate-400">
                        #{guest.id}
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {guest.name}
                        </div>
                        {guest.phone && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {guest.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5">
                        <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs border border-slate-200 dark:border-slate-700">
                          {guest.room_no}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                        {guest.type_of_room}
                      </td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {guest.source}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-400">
                        <div>In: {formatDate(guest.date)}</div>
                        <div className="text-[10px] text-slate-400">Out: {formatDate(guest.check_out_date)}</div>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors[guest.status as keyof typeof statusColors] || statusColors['Checked In']}`}>
                          {guest.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(guest.total_amount || 0)}
                        </div>
                        <span className={`text-[10px] font-medium ${guest.payment_status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {guest.payment_status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-right space-x-1">
                        <button
                          onClick={() => onOpenInvoiceModal(guest)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Generate Invoice (PRD 8)"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingGuest(guest)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Update Guest"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingGuest(guest)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Delete Guest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT GUEST MODAL (Recreation of update_guest) */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-brand-500" />
                Update Guest Record #{editingGuest.id}
              </h3>
              <button onClick={() => setEditingGuest(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateGuest(editingGuest.id, editingGuest);
                setEditingGuest(null);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  1. Guest Name
                </label>
                <input
                  type="text"
                  value={editingGuest.name}
                  onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    2. Source of Booking
                  </label>
                  <select
                    value={editingGuest.source}
                    onChange={(e) => setEditingGuest({ ...editingGuest, source: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
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
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Room Number
                  </label>
                  <select
                    value={editingGuest.room_no}
                    onChange={(e) => {
                      const roomNo = Number(e.target.value);
                      const targetRoom = rooms.find(r => r.room_no === roomNo);
                      setEditingGuest({
                        ...editingGuest,
                        room_no: roomNo,
                        type_of_room: targetRoom ? targetRoom.type : editingGuest.type_of_room
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {rooms.map(r => (
                      <option key={r.room_no} value={r.room_no}>
                        Room {r.room_no} ({r.type} - ${r.price_per_night}/n)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    3. Check-In Date
                  </label>
                  <input
                    type="date"
                    value={editingGuest.date}
                    onChange={(e) => setEditingGuest({ ...editingGuest, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    value={editingGuest.check_out_date}
                    onChange={(e) => setEditingGuest({ ...editingGuest, check_out_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    4. Room Type
                  </label>
                  <select
                    value={editingGuest.type_of_room}
                    onChange={(e) => setEditingGuest({ ...editingGuest, type_of_room: e.target.value as RoomType })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Standard">Standard ($120)</option>
                    <option value="Deluxe">Deluxe ($220)</option>
                    <option value="Executive Suite">Executive Suite ($450)</option>
                    <option value="Presidential Suite">Presidential Suite ($950)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editingGuest.status}
                    onChange={(e) => setEditingGuest({ ...editingGuest, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Checked In">Checked In</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Checked Out">Checked Out</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (Recreation of delete_guest) */}
      {deletingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Delete Guest Record #{deletingGuest.id}?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Are you sure you want to remove <strong className="text-slate-800 dark:text-slate-200">{deletingGuest.name}</strong> from Room {deletingGuest.room_no}? This will free up the room and delete the record.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeletingGuest(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteGuest(deletingGuest.id);
                  setDeletingGuest(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MATPLOTLIB GRAPH MODAL (Recreation of graph_guest() with option 1: Rooms Booked & 2: Source of Booking) */}
      {showGraphModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <BarChart3 className="w-5 h-5 text-brand-500" />
                  Matplotlib Graphical Analysis Simulation
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Interactive representation of <code className="font-mono text-brand-600">graph_guest()</code> in Python
                </p>
              </div>
              <button
                onClick={() => setShowGraphModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle between Graph 1 and Graph 2 */}
            <div className="flex items-center justify-center gap-2 my-5">
              <button
                onClick={() => setGraphMode('rooms')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  graphMode === 'rooms'
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                1. Rooms Booked Bar Chart
              </button>
              <button
                onClick={() => setGraphMode('source')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  graphMode === 'source'
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                2. Source of Booking Chart
              </button>
            </div>

            {/* Chart Area */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
              {graphMode === 'rooms' ? (
                <div>
                  <div className="text-center mb-6">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Rooms Booked Frequency
                    </h4>
                    <p className="text-xs text-slate-500">
                      Query: <code className="font-mono text-xs">SELECT room_no, COUNT(*) FROM guest GROUP BY room_no</code>
                    </p>
                  </div>

                  {/* Bar Chart Visualization */}
                  <div className="flex items-end justify-center gap-3 h-52 pt-6 pb-2 px-4 border-b border-l border-slate-300 dark:border-slate-700">
                    {roomBookingsData.map((d) => {
                      const heightPercent = Math.round((d.count / maxRoomCount) * 100);
                      return (
                        <div key={d.room_no} className="flex flex-col items-center flex-1 group">
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.count}
                          </span>
                          <div 
                            className="w-full max-w-[36px] bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg transition-all duration-500 hover:brightness-110"
                            style={{ height: `${heightPercent}%`, minHeight: '8px' }}
                          />
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
                            #{d.room_no}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 px-1">
                    <span>Y-Axis: Total Bookings</span>
                    <span>X-Axis: Room Numbers</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-6">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Bookings by Acquisition Channel
                    </h4>
                    <p className="text-xs text-slate-500">
                      Query: <code className="font-mono text-xs">SELECT source, COUNT(*) FROM guest GROUP BY source</code>
                    </p>
                  </div>

                  {/* Horizontal Bar Chart Visualization */}
                  <div className="space-y-4 max-w-lg mx-auto py-2">
                    {sourceBookingsData.map((d) => (
                      <div key={d.source} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span>{d.source}</span>
                          <span className="text-slate-500">{d.count} bookings ({d.percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-brand-500 h-3 rounded-full transition-all duration-700"
                            style={{ width: `${(d.count / maxSourceCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowGraphModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                Close Visualization
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
