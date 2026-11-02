import React, { useState, useMemo } from 'react';
import { useHotel } from '../context/HotelContext';
import { Staff, Department } from '../types';
import { 
  UserCog, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  BarChart3, 
  Filter, 
  ArrowUpDown, 
  DollarSign, 
  Download, 
  Calendar, 
  Briefcase, 
  X, 
  CheckCircle, 
  AlertCircle,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { 
  exportStaffToCsv, 
  formatCurrency, 
  formatDate, 
  calculateSalaryForDepartment 
} from '../utils/helpers';

interface StaffManagementProps {
  onOpenStaffModal: () => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({ onOpenStaffModal }) => {
  const { staff, updateStaff, deleteStaff } = useHotel();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<'all' | 'id' | 'name' | 'dept' | 'sal' | 'hiredate'>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Staff>('id');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Modals state
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);
  const [showGraphModal, setShowGraphModal] = useState<boolean>(false);

  // Filter & Search Logic
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      // Dept filter
      if (deptFilter !== 'all' && s.dept.toLowerCase() !== deptFilter.toLowerCase()) return false;

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      if (searchField === 'id') return String(s.id).includes(q);
      if (searchField === 'name') return s.name.toLowerCase().includes(q);
      if (searchField === 'dept') return s.dept.toLowerCase().includes(q);
      if (searchField === 'sal') return String(s.sal).includes(q);
      if (searchField === 'hiredate') return s.hiredate.includes(q);

      return (
        String(s.id).includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.dept.toLowerCase().includes(q) ||
        String(s.sal).includes(q) ||
        s.hiredate.includes(q)
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
  }, [staff, searchQuery, searchField, deptFilter, sortField, sortAsc]);

  const toggleSort = (field: keyof Staff) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Salary distribution for Matplotlib graph recreation (brackets: 2000, 4000, 6000)
  const salaryBracketsData = useMemo(() => {
    const sal2000 = staff.filter(s => s.sal === 2000).length;
    const sal4000 = staff.filter(s => s.sal === 4000).length;
    const sal6000 = staff.filter(s => s.sal === 6000).length;
    const otherSal = staff.filter(s => s.sal !== 2000 && s.sal !== 4000 && s.sal !== 6000).length;

    return [
      { label: '$2,000 (Cleaning)', sal: 2000, count: sal2000, color: 'from-amber-500 to-amber-600' },
      { label: '$4,000 (Food & Bev)', sal: 4000, count: sal4000, color: 'from-blue-500 to-blue-600' },
      { label: '$6,000 (Management)', sal: 6000, count: sal6000, color: 'from-purple-500 to-purple-600' },
      { label: 'Other Special Tiers', sal: 0, count: otherSal, color: 'from-emerald-500 to-emerald-600' },
    ];
  }, [staff]);

  const maxSalaryCount = Math.max(...salaryBracketsData.map(b => b.count), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
              Staff & Payroll Directory
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              {staff.length} Active Staff
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Recreation of <code className="text-purple-600 dark:text-purple-400 font-mono">src.modules.staff</code> (SQL Table: `staff` with auto-computed department salary)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowGraphModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-purple-500" />
            <span>Salary Tier Graph</span>
          </button>

          <button
            onClick={() => exportStaffToCsv(staff)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenStaffModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-xs font-semibold shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Record</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        
        {/* Search Field Dropdown (1. ID 2. Name 3. Dept 4. Salary 5. Hiredate from search_staff) */}
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
            <option value="dept" className="dark:bg-slate-900">3. Department</option>
            <option value="sal" className="dark:bg-slate-900">4. Salary</option>
            <option value="hiredate" className="dark:bg-slate-900">5. Hire Date</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter staff by ${searchField === 'all' ? 'any field' : searchField}...`}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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

        {/* Department Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium overflow-x-auto">
          {['all', 'management', 'food and beverages', 'cleaning'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap capitalize transition-all ${
                deptFilter === dept
                  ? 'bg-white dark:bg-navy-900 text-purple-600 dark:text-purple-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {dept === 'all' ? 'All Depts' : dept}
            </button>
          ))}
        </div>

      </div>

      {/* Staff Roster Table */}
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
                    <span>Employee Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('dept')}>
                  <div className="flex items-center gap-1">
                    <span>Department</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('sal')}>
                  <div className="flex items-center gap-1">
                    <span>Monthly Salary</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('hiredate')}>
                  <div className="flex items-center gap-1">
                    <span>Hire Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5">Shift & Status</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <UserCog className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-semibold">No staff records found</p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((emp) => {
                  const deptBadges: Record<string, string> = {
                    'cleaning': 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                    'food and beverages': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                    'management': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
                    'front desk': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                    'security': 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800',
                    'maintenance': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
                  };

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 pl-4 font-mono font-bold text-slate-500 dark:text-slate-400">
                        #{emp.id}
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {emp.name}
                        </div>
                        {emp.phone && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {emp.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${deptBadges[emp.dept.toLowerCase()] || deptBadges['maintenance']}`}>
                          {emp.dept}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                          {formatCurrency(emp.sal)}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">/mo</span>
                      </td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300">
                        {formatDate(emp.hiredate)}
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium">
                            {emp.shift || 'Morning'}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active"></span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-right space-x-1">
                        <button
                          onClick={() => setEditingStaff(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Update Staff"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingStaff(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Delete Staff"
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

      {/* EDIT STAFF MODAL (Recreation of update_staff with automatic salary calculation) */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-500" />
                Update Staff Member #{editingStaff.id}
              </h3>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateStaff(editingStaff.id, editingStaff);
                setEditingStaff(null);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  1. Staff ID
                </label>
                <input
                  type="number"
                  value={editingStaff.id}
                  disabled
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  2. Full Name
                </label>
                <input
                  type="text"
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  3. Department (Auto-calculates salary)
                </label>
                <select
                  value={editingStaff.dept}
                  onChange={(e) => {
                    const newDept = e.target.value;
                    const autoSal = calculateSalaryForDepartment(newDept);
                    setEditingStaff({
                      ...editingStaff,
                      dept: newDept,
                      sal: autoSal
                    });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  <option value="cleaning">cleaning ($2,000/mo)</option>
                  <option value="food and beverages">food and beverages ($4,000/mo)</option>
                  <option value="management">management ($6,000/mo)</option>
                  <option value="front desk">front desk ($3,500/mo)</option>
                  <option value="security">security ($2,500/mo)</option>
                  <option value="maintenance">maintenance ($3,000/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Monthly Salary ($)
                </label>
                <input
                  type="number"
                  value={editingStaff.sal}
                  onChange={(e) => setEditingStaff({ ...editingStaff, sal: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  required
                />
                <span className="text-[10px] text-purple-600 dark:text-purple-400 mt-1 block">
                  *Auto-adjusted based on department, or customize manually.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  4. Hire Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={editingStaff.hiredate}
                  onChange={(e) => setEditingStaff({ ...editingStaff, hiredate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (Recreation of delete_staff) */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Delete Employee #{deletingStaff.id}?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Are you sure you want to remove <strong className="text-slate-800 dark:text-slate-200">{deletingStaff.name}</strong> ({deletingStaff.dept}) from the staff registry?
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeletingStaff(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteStaff(deletingStaff.id);
                  setDeletingStaff(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20"
              >
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MATPLOTLIB GRAPH MODAL (Recreation of graph_staff() showing salary brackets 2000, 4000, 6000) */}
      {showGraphModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  Staff Count by Salary Level
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Simulation of <code className="font-mono text-purple-600">graph_staff()</code> in Python (sal=2000 vs 4000 vs 6000)
                </p>
              </div>
              <button
                onClick={() => setShowGraphModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bar Chart */}
            <div className="mt-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-end justify-around gap-6 h-56 pt-8 pb-2 px-6 border-b border-l border-slate-300 dark:border-slate-700">
                {salaryBracketsData.map((tier) => {
                  const heightPercent = Math.round((tier.count / maxSalaryCount) * 100);
                  return (
                    <div key={tier.label} className="flex flex-col items-center flex-1 group">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {tier.count} Staff
                      </span>
                      <div 
                        className={`w-full max-w-[56px] bg-gradient-to-t ${tier.color} rounded-t-xl transition-all duration-500 hover:brightness-110 shadow-md`}
                        style={{ height: `${heightPercent}%`, minHeight: '12px' }}
                      />
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-2 text-center">
                        {tier.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-3 px-2">
                <span>Y-Axis: Number of Staff</span>
                <span>X-Axis: Salary Brackets (Cleaning / F&amp;B / Management)</span>
              </div>
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
