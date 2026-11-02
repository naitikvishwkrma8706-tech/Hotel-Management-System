import React, { useMemo } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  BedDouble, 
  PieChart, 
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const AnalyticsView: React.FC = () => {
  const { guests, staff, rooms } = useHotel();

  // 1. Rooms Booked frequency (graph_guest option 1)
  const roomBookings = useMemo(() => {
    const counts: Record<number, number> = {};
    guests.forEach(g => counts[g.room_no] = (counts[g.room_no] || 0) + 1);
    return Object.entries(counts).map(([room, count]) => ({
      room: Number(room),
      count
    })).sort((a, b) => a.room - b.room);
  }, [guests]);
  const maxRoomBookings = Math.max(...roomBookings.map(r => r.count), 1);

  // 2. Source of booking (graph_guest option 2)
  const sourceDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    guests.forEach(g => counts[g.source] = (counts[g.source] || 0) + 1);
    return Object.entries(counts).map(([source, count]) => ({
      source,
      count,
      percent: Math.round((count / guests.length) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [guests]);
  const maxSource = Math.max(...sourceDistribution.map(s => s.count), 1);

  // 3. Staff Salary tiers (graph_staff: 2000 vs 4000 vs 6000)
  const salaryTiers = useMemo(() => {
    const sal2000 = staff.filter(s => s.sal === 2000).length;
    const sal4000 = staff.filter(s => s.sal === 4000).length;
    const sal6000 = staff.filter(s => s.sal === 6000).length;
    const other = staff.filter(s => s.sal !== 2000 && s.sal !== 4000 && s.sal !== 6000).length;

    return [
      { tier: '$2,000 / mo', role: 'Cleaning / Housekeeping', count: sal2000, color: 'bg-amber-500' },
      { tier: '$4,000 / mo', role: 'Food & Beverages', count: sal4000, color: 'bg-blue-500' },
      { tier: '$6,000 / mo', role: 'Executive Management', count: sal6000, color: 'bg-purple-500' },
      { tier: 'Special Tiers', role: 'Front Desk / Security / Ops', count: other, color: 'bg-emerald-500' },
    ];
  }, [staff]);
  const maxSalCount = Math.max(...salaryTiers.map(t => t.count), 1);

  // 4. Revenue by Room Type
  const revenueByType = useMemo(() => {
    const rev: Record<string, number> = {
      'Standard': 0,
      'Deluxe': 0,
      'Executive Suite': 0,
      'Presidential Suite': 0,
    };
    guests.forEach(g => {
      rev[g.type_of_room] = (rev[g.type_of_room] || 0) + (g.total_amount || 0);
    });
    return Object.entries(rev).map(([type, amount]) => ({
      type,
      amount
    }));
  }, [guests]);
  const maxRev = Math.max(...revenueByType.map(r => r.amount), 1);

  // 5. Department Headcount & Payroll
  const deptStats = useMemo(() => {
    const depts: Record<string, { count: number; totalSal: number }> = {};
    staff.forEach(s => {
      const d = s.dept.toLowerCase();
      if (!depts[d]) depts[d] = { count: 0, totalSal: 0 };
      depts[d].count += 1;
      depts[d].totalSal += s.sal;
    });
    return Object.entries(depts).map(([dept, data]) => ({
      dept,
      count: data.count,
      totalSal: data.totalSal
    })).sort((a, b) => b.totalSal - a.totalSal);
  }, [staff]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
              Visual Reports &amp; Statistical Analytics
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
              Matplotlib 3.8+ Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time interactive dashboard reconstructing and elevating all SQL analytical routines
          </p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Rooms Booked Bar Chart (graph_guest choice 1) */}
        <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-brand-500" />
                Rooms Booked Distribution
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Frequency of individual suite reservations (<code className="font-mono text-brand-600">graph_guest()</code>)
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              GROUP BY room_no
            </span>
          </div>

          <div className="h-56 flex items-end justify-center gap-2 pt-6 pb-2 px-2 border-b border-l border-slate-200 dark:border-slate-800">
            {roomBookings.map((d) => {
              const heightPercent = Math.round((d.count / maxRoomBookings) * 100);
              return (
                <div key={d.room} className="flex flex-col items-center flex-1 group">
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </span>
                  <div
                    className="w-full max-w-[28px] bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-md hover:brightness-110 transition-all duration-300"
                    style={{ height: `${heightPercent}%`, minHeight: '10px' }}
                  />
                  <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">
                    {d.room}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 px-1">
            <span>Y: Booking Counts</span>
            <span>X: Room Numbers</span>
          </div>
        </div>

        {/* Chart 2: Source of Booking (graph_guest choice 2) */}
        <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-500" />
                Acquisition Channel Breakdown
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Volume of bookings by origin channel (<code className="font-mono text-blue-600">graph_guest()</code>)
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              GROUP BY source
            </span>
          </div>

          <div className="space-y-3.5 py-3">
            {sourceDistribution.map((d) => (
              <div key={d.source} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{d.source}</span>
                  <span className="text-slate-500 dark:text-slate-400">{d.count} bookings ({d.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-brand-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(d.count / maxSource) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Staff Salary Distribution (graph_staff: 2000, 4000, 6000) */}
        <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-500" />
                Staff Count by Salary Bracket
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Department tier distribution (<code className="font-mono text-purple-600">graph_staff()</code>)
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              WHERE sal IN (2000, 4000, 6000)
            </span>
          </div>

          <div className="h-56 flex items-end justify-around gap-6 pt-6 pb-2 px-4 border-b border-l border-slate-200 dark:border-slate-800">
            {salaryTiers.map((t) => {
              const heightPercent = Math.round((t.count / maxSalCount) * 100);
              return (
                <div key={t.tier} className="flex flex-col items-center flex-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t.count}
                  </span>
                  <div
                    className={`w-full max-w-[44px] ${t.color} rounded-t-lg transition-all duration-500 shadow-sm`}
                    style={{ height: `${heightPercent}%`, minHeight: '12px' }}
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 text-center">
                    {t.tier}
                  </span>
                  <span className="text-[9px] text-slate-400 text-center truncate max-w-[80px]">
                    {t.role}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 px-1">
            <span>Y: Employee Count</span>
            <span>X: Salary Tiers</span>
          </div>
        </div>

        {/* Chart 4: Revenue by Room Category */}
        <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Gross Revenue by Room Category
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Financial contribution per suite classification
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              PRD 8 Billing Matrix
            </span>
          </div>

          <div className="space-y-4 py-2">
            {revenueByType.map((r) => {
              const percent = Math.round((r.amount / maxRev) * 100);
              return (
                <div key={r.type} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{r.type}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      {formatCurrency(r.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-teal-400 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Departmental Operational Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3">Department</th>
                <th className="pb-3">Headcount</th>
                <th className="pb-3">Monthly Payroll</th>
                <th className="pb-3">Average Compensation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {deptStats.map(d => (
                <tr key={d.dept} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3 capitalize text-slate-900 dark:text-white font-semibold">{d.dept}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{d.count} employees</td>
                  <td className="py-3 text-purple-600 dark:text-purple-400 font-mono font-bold">{formatCurrency(d.totalSal)}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400 font-mono">{formatCurrency(Math.round(d.totalSal / d.count))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
