import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  Building2, 
  Moon, 
  Sun, 
  ShieldCheck, 
  PlusCircle, 
  Database, 
  RotateCcw, 
  Download, 
  Upload,
  User,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '../types';
import { exportGuestsToCsv, exportStaffToCsv, exportToJson } from '../utils/helpers';

interface NavbarProps {
  onOpenBookingModal: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenBookingModal, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) => {
  const { 
    guests, 
    staff, 
    rooms, 
    userRole, 
    setUserRole, 
    darkMode, 
    setDarkMode, 
    resetToDemoData,
    importAllData,
    addToast
  } = useHotel();

  const [dataDropdownOpen, setDataDropdownOpen] = useState(false);

  const occupiedCount = rooms.filter(r => r.status === 'Occupied').length;
  const occupancyRate = Math.round((occupiedCount / rooms.length) * 100);

  const handleExportJson = () => {
    exportToJson({ guests, staff, rooms }, `grand_horizon_backup_${new Date().toISOString().slice(0, 10)}`);
    addToast('success', 'Backup Exported', 'Full JSON database backup downloaded.');
    setDataDropdownOpen(false);
  };

  const handleExportGuests = () => {
    exportGuestsToCsv(guests);
    addToast('success', 'CSV Exported', 'Guest records exported to CSV.');
    setDataDropdownOpen(false);
  };

  const handleExportStaff = () => {
    exportStaffToCsv(staff);
    addToast('success', 'CSV Exported', 'Staff roster exported to CSV.');
    setDataDropdownOpen(false);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          importAllData(data);
        } catch {
          addToast('error', 'Parse Error', 'Uploaded file is not valid JSON.');
        }
      };
      reader.readAsText(file);
    }
    setDataDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Hotel Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20 ring-2 ring-brand-400/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-serif">
                    Grand Horizon
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    5-STAR RESORT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Enterprise Hotel Management System v2.0
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar (Desktop) */}
          <div className="hidden xl:flex items-center gap-6 text-xs text-slate-600 dark:text-slate-300 border-x border-slate-200 dark:border-slate-800 px-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live System: <strong>Active</strong></span>
            </div>
            <div>
              Occupancy: <strong className="text-slate-900 dark:text-white font-semibold">{occupancyRate}%</strong> ({occupiedCount}/{rooms.length} Rooms)
            </div>
            <div>
              Staff On Duty: <strong className="text-slate-900 dark:text-white font-semibold">{staff.length}</strong>
            </div>
          </div>

          {/* Right Actions: Role Selector, Dark Mode, Quick Booking, Data */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Role Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg p-1 text-xs border border-slate-200 dark:border-slate-700/60">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 ml-1.5 mr-1" />
              <select
                value={userRole}
                onChange={(e) => {
                  const newRole = e.target.value as UserRole;
                  setUserRole(newRole);
                  addToast('info', 'Role Switched', `Switched mode to ${newRole.toUpperCase()}.`);
                }}
                className="bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-none cursor-pointer pr-1 py-0.5 text-xs"
              >
                <option value="admin" className="dark:bg-slate-900">Admin</option>
                <option value="receptionist" className="dark:bg-slate-900">Receptionist</option>
                <option value="manager" className="dark:bg-slate-900">Manager</option>
              </select>
            </div>

            {/* Data Management Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDataDropdownOpen(!dataDropdownOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Data Tools (Export / Import / Reset)"
              >
                <Database className="w-4 h-4" />
              </button>

              {dataDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs"
                  onClick={() => setDataDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Data Export & Backup
                  </div>
                  <button
                    onClick={handleExportJson}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-500" />
                    Export Full JSON Backup
                  </button>
                  <button
                    onClick={handleExportGuests}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-500" />
                    Export Guests to CSV
                  </button>
                  <button
                    onClick={handleExportStaff}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-500" />
                    Export Staff to CSV
                  </button>
                  
                  <div className="my-1 border-t border-slate-200 dark:border-slate-800"></div>

                  <label className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-purple-500" />
                    <span>Import JSON Backup</span>
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleImportJson} 
                      className="hidden" 
                    />
                  </label>

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to restore original factory seed records? Current changes will be overwritten.')) {
                        resetToDemoData();
                      }
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Demo Data
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Light / Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* New Booking CTA */}
            <button
              onClick={onOpenBookingModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-medium text-xs shadow-md shadow-brand-500/25 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Booking</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
