import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { Department } from '../types';
import { X, UserCog, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { calculateSalaryForDepartment, formatCurrency } from '../utils/helpers';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose }) => {
  const { staff, addStaff } = useHotel();

  const nextId = staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 101;

  const [id, setId] = useState<number>(nextId);
  const [name, setName] = useState('');
  const [dept, setDept] = useState<string>('cleaning');
  const [sal, setSal] = useState<number>(2000);
  const [manualSal, setManualSal] = useState<boolean>(false);
  const [hiredate, setHiredate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [shift, setShift] = useState<'Morning' | 'Evening' | 'Night'>('Morning');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Automatically recalculate salary whenever department changes unless manually overridden
  useEffect(() => {
    if (!manualSal) {
      setSal(calculateSalaryForDepartment(dept));
    }
  }, [dept, manualSal]);

  useEffect(() => {
    if (isOpen) {
      const generatedId = staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 101;
      setId(generatedId);
    }
  }, [isOpen, staff]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = addStaff({
      id: Number(id),
      name: name.trim(),
      dept: dept.trim(),
      sal: Number(sal),
      manualSal,
      hiredate,
      shift,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      status: 'Active',
    });

    if (success) {
      onClose();
      setName('');
      setPhone('');
      setEmail('');
      setManualSal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
              <UserCog className="w-5 h-5 text-purple-500" />
              Add Hotel Staff Member
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Corresponds to SQL: <code className="font-mono text-purple-600">INSERT INTO staff VALUES (...)</code>
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Staff ID (PK) *
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
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jean-Luc Picard"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department (Auto-assigns salary) *
              </label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white capitalize font-medium"
              >
                <option value="cleaning">Cleaning ($2,000/mo)</option>
                <option value="food and beverages">Food and Beverages ($4,000/mo)</option>
                <option value="management">Management ($6,000/mo)</option>
                <option value="front desk">Front Desk ($3,500/mo)</option>
                <option value="security">Security ($2,500/mo)</option>
                <option value="maintenance">Maintenance ($3,000/mo)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Monthly Salary ($) *
                </label>
                <label className="text-[10px] text-purple-600 dark:text-purple-400 flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={manualSal}
                    onChange={(e) => setManualSal(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-0"
                  />
                  <span>Manual Override</span>
                </label>
              </div>
              <input
                type="number"
                value={sal}
                onChange={(e) => {
                  setSal(Number(e.target.value));
                  setManualSal(true);
                }}
                className={`w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold ${
                  manualSal ? 'bg-purple-50/50 dark:bg-purple-950/30' : 'bg-slate-50 dark:bg-slate-800'
                }`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hire Date (hiredate) *
              </label>
              <input
                type="date"
                value={hiredate}
                onChange={(e) => setHiredate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Shift
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Morning">Morning Shift (07:00 - 15:30)</option>
                <option value="Evening">Evening Shift (15:00 - 23:30)</option>
                <option value="Night">Night Shift (23:00 - 07:30)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
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
                Staff Corporate Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@grandhorizon.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Salary Tier Note matching staff.py logic */}
          <div className="p-3 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 text-[11px] text-purple-800 dark:text-purple-300 flex items-center justify-between">
            <span>Standard baseline salary for <strong>{dept}</strong>:</span>
            <span className="font-mono font-bold text-xs">{formatCurrency(sal)}/mo</span>
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
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-500/20 transition-all"
            >
              Add Staff Record
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
