import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Room, RoomStatus } from '../types';
import { 
  BedDouble, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Wrench, 
  Users, 
  DollarSign, 
  Filter, 
  X,
  PlusCircle,
  Eye
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface RoomRackProps {
  onBookRoom: (roomNo: number) => void;
}

export const RoomRack: React.FC<RoomRackProps> = ({ onBookRoom }) => {
  const { rooms, updateRoomStatus, setActiveTab } = useHotel();
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | 'all'>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const filteredRooms = rooms.filter(r => {
    if (selectedFloor !== 'all' && r.floor !== selectedFloor) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    return true;
  });

  const availableCount = rooms.filter(r => r.status === 'Available').length;
  const occupiedCount = rooms.filter(r => r.status === 'Occupied').length;
  const reservedCount = rooms.filter(r => r.status === 'Reserved').length;
  const maintenanceCount = rooms.filter(r => r.status === 'Maintenance').length;

  const statusConfig: Record<RoomStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
    'Available': {
      label: 'Available',
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      dot: 'bg-emerald-500'
    },
    'Occupied': {
      label: 'Occupied',
      bg: 'bg-blue-50/70 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800/60',
      dot: 'bg-blue-500'
    },
    'Reserved': {
      label: 'Reserved',
      bg: 'bg-amber-50/70 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800/60',
      dot: 'bg-amber-500'
    },
    'Maintenance': {
      label: 'Maintenance',
      bg: 'bg-purple-50/70 dark:bg-purple-950/30',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800/60',
      dot: 'bg-purple-500'
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header and Summary stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
            Interactive Room Rack &amp; Floor Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time visual occupancy grid across all 4 hotel wings
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{availableCount} Available</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>{occupiedCount} Occupied</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>{reservedCount} Reserved</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>{maintenanceCount} Housekeeping</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        
        {/* Floor Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
          <span className="text-slate-400 font-semibold mr-1">Floor:</span>
          {['all', 1, 2, 3, 4].map(f => (
            <button
              key={f}
              onClick={() => setSelectedFloor(f as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedFloor === f
                  ? 'bg-brand-500 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f === 'all' ? 'All Floors' : `Floor ${f}`}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
          <span className="text-slate-400 font-semibold mr-1">Status:</span>
          {['all', 'Available', 'Occupied', 'Reserved', 'Maintenance'].map(s => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedStatus === s
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

      </div>

      {/* Room Rack Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRooms.map(room => {
          const cfg = statusConfig[room.status];

          return (
            <div
              key={room.room_no}
              onClick={() => setSelectedRoom(room)}
              className={`p-4 rounded-2xl border ${cfg.border} ${cfg.bg} transition-all duration-200 hover:shadow-md hover:scale-[1.01] cursor-pointer relative group flex flex-col justify-between`}
            >
              <div>
                {/* Top: Room Number & Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900 dark:text-white font-mono">
                      #{room.room_no}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Floor {room.floor}
                    </span>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.border} ${cfg.text} bg-white/70 dark:bg-slate-900/70`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                    {cfg.label}
                  </span>
                </div>

                {/* Room Category & Nightly Price */}
                <div className="mb-3">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {room.type}
                  </div>
                  <div className="text-xs font-semibold text-brand-600 dark:text-brand-400 font-mono">
                    {formatCurrency(room.price_per_night)} <span className="text-[10px] text-slate-400 font-normal">/night</span>
                  </div>
                </div>

                {/* Occupant Info if Occupied or Reserved */}
                {room.guest_name ? (
                  <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 text-xs mb-3">
                    <div className="text-[10px] text-slate-400 font-medium">Guest in Residence:</div>
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {room.guest_name}
                    </div>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 text-xs mb-3">
                    <span className="text-[11px] text-slate-400 italic">No active resident</span>
                  </div>
                )}
              </div>

              {/* Amenities tags */}
              <div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {room.amenities.slice(0, 2).map((a, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                      {a}
                    </span>
                  ))}
                  {room.amenities.length > 2 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/60 dark:bg-slate-800/60 text-slate-400">
                      +{room.amenities.length - 2}
                    </span>
                  )}
                </div>

                {/* Action button */}
                {room.status === 'Available' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookRoom(room.room_no);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Book Suite</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoom(room);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Manage Room</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ROOM DETAILS & STATUS CONTROL MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                  Suite #{selectedRoom.room_no}
                </span>
                <span className="text-xs text-slate-400">
                  (Floor {selectedRoom.floor})
                </span>
              </div>
              <button onClick={() => setSelectedRoom(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Room Category</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRoom.type}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Nightly Rate</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">{formatCurrency(selectedRoom.price_per_night)}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
                  Included Luxury Amenities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoom.amenities.map((am, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              {selectedRoom.guest_name && (
                <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs">
                  <span className="text-blue-500 font-semibold block mb-0.5">Active Resident</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedRoom.guest_name}</span>
                </div>
              )}

              {/* Status Change Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Change Suite Status:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['Available', 'Occupied', 'Reserved', 'Maintenance'] as RoomStatus[]).map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        updateRoomStatus(selectedRoom.room_no, status);
                        setSelectedRoom({ ...selectedRoom, status });
                      }}
                      className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                        selectedRoom.status === status
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {selectedRoom.status === 'Available' ? (
                <button
                  onClick={() => {
                    const rNo = selectedRoom.room_no;
                    setSelectedRoom(null);
                    onBookRoom(rNo);
                  }}
                  className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-500/20"
                >
                  Book This Room Now
                </button>
              ) : (
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="w-full py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-800 text-xs font-semibold"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
