import React from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  Users, 
  BedDouble, 
  DollarSign, 
  UserCog, 
  TrendingUp, 
  CheckCircle, 
  Calendar, 
  ArrowUpRight, 
  Sparkles,
  PhoneCall,
  Terminal,
  Receipt,
  Clock,
  ChevronRight
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

interface DashboardProps {
  onOpenBookingModal: () => void;
  onOpenStaffModal: () => void;
  onOpenCliModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenBookingModal,
  onOpenStaffModal,
  onOpenCliModal,
}) => {
  const { guests, staff, rooms, setActiveTab, checkInGuest, checkOutGuest } = useHotel();

  // Metrics
  const checkedInGuests = guests.filter(g => g.status === 'Checked In');
  const reservedGuests = guests.filter(g => g.status === 'Reserved');
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied');
  const availableRooms = rooms.filter(r => r.status === 'Available');
  const occupancyPercent = Math.round((occupiedRooms.length / rooms.length) * 100);

  const totalRevenue = guests.reduce((sum, g) => sum + (g.total_amount || 0), 0);
  const totalStaffPayroll = staff.reduce((sum, s) => sum + s.sal, 0);

  // Booking source distribution
  const sourceCounts: Record<string, number> = {};
  guests.forEach(g => {
    sourceCounts[g.source] = (sourceCounts[g.source] || 0) + 1;
  });

  // Recent guests
  const recentGuests = [...guests].slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-slate-900 to-navy-850 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grand Horizon Resort Management Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif text-white">
              Welcome back, General Manager
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Your luxury property is running smoothly today. There are currently <strong className="text-white font-semibold">{checkedInGuests.length} guests in residence</strong> and <strong className="text-white font-semibold">{availableRooms.length} luxury rooms</strong> ready for new arrivals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenBookingModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2"
            >
              <BedDouble className="w-4 h-4" />
              <span>Express Check-In</span>
            </button>
            <button
              onClick={onOpenCliModal}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Python CLI Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Occupancy Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Occupancy Rate
            </span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {occupancyPercent}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({occupiedRooms.length}/{rooms.length} Suites)
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-brand-500 to-brand-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{availableRooms.length} Available</span>
            <span>{reservedGuests.length} Reserved</span>
          </div>
        </div>

        {/* Guests In-House */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Guests
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {checkedInGuests.length}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> In Residence
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Total Recorded:</span>
            <strong className="text-slate-700 dark:text-slate-200">{guests.length} Guests</strong>
          </div>
        </div>

        {/* Staff Payroll & Active Duty */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Staff Workforce
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <UserCog className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {staff.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Staff Members
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Monthly Payroll:</span>
            <strong className="text-purple-600 dark:text-purple-400 font-semibold">{formatCurrency(totalStaffPayroll)}</strong>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Recorded Billing
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Avg Stay Value:</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {formatCurrency(guests.length > 0 ? Math.round(totalRevenue / guests.length) : 0)}
            </strong>
          </div>
        </div>

      </div>

      {/* Main Grid: Quick Actions & Live Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Modules & Distribution */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Quick Actions Panel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Quick Operations
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenBookingModal}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 w-fit mb-2">
                  <BedDouble className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  New Guest
                </div>
                <div className="text-[10px] text-slate-400">Register booking</div>
              </button>

              <button
                onClick={onOpenStaffModal}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 w-fit mb-2">
                  <UserCog className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Add Staff
                </div>
                <div className="text-[10px] text-slate-400">Hire employee</div>
              </button>

              <button
                onClick={() => setActiveTab('rooms')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 w-fit mb-2">
                  <BedDouble className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Room Rack
                </div>
                <div className="text-[10px] text-slate-400">Floor map</div>
              </button>

              <button
                onClick={() => setActiveTab('phone-verify')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 w-fit mb-2">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  Phone Check
                </div>
                <div className="text-[10px] text-slate-400">Validate caller</div>
              </button>
            </div>
          </div>

          {/* Booking Sources (From Matplotlib graph_guest feature!) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Booking Origin Breakdown
              </h3>
              <button 
                onClick={() => setActiveTab('analytics')}
                className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
              >
                Full Analytics <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(sourceCounts).map(([src, count]) => {
                const percent = Math.round((count / guests.length) * 100);
                return (
                  <div key={src} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{src}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">{count} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-brand-500 h-1.5 rounded-full" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: In-House Guests Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Current In-House & Upcoming Guests
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live database feed of currently registered hotel residents
                </p>
              </div>
              <button
                onClick={() => setActiveTab('guests')}
                className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
              >
                View All {guests.length} Records <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pl-1">Room</th>
                    <th className="pb-3">Guest Name</th>
                    <th className="pb-3">Source</th>
                    <th className="pb-3">Dates</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-1">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {recentGuests.map((guest) => {
                    const statusColors = {
                      'Checked In': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                      'Reserved': 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                      'Checked Out': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
                    };

                    return (
                      <tr key={guest.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 pl-1">
                          <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                            #{guest.room_no}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {guest.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {guest.type_of_room}
                          </div>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">
                          {guest.source}
                        </td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">
                          <div>In: {formatDate(guest.date)}</div>
                          <div className="text-[10px]">Out: {formatDate(guest.check_out_date)}</div>
                        </td>
                        <td className="py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors[guest.status as keyof typeof statusColors] || statusColors['Checked In']}`}>
                            {guest.status}
                          </span>
                        </td>
                        <td className="py-3 text-right pr-1 space-x-1">
                          {guest.status === 'Reserved' && (
                            <button
                              onClick={() => checkInGuest(guest.id)}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[10px] shadow-sm transition-colors"
                            >
                              Check In
                            </button>
                          )}
                          {guest.status === 'Checked In' && (
                            <button
                              onClick={() => checkOutGuest(guest.id)}
                              className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-medium text-[10px] transition-colors"
                            >
                              Check Out
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
