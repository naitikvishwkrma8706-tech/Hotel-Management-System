import React from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  BedDouble, 
  BarChart3, 
  Receipt, 
  PhoneCall,
  Terminal,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenCliModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  mobileOpen, 
  setMobileOpen,
  onOpenCliModal
}) => {
  const { activeTab, setActiveTab, guests, staff, rooms, userRole } = useHotel();

  const activeGuestsCount = guests.filter(g => g.status === 'Checked In').length;
  const availableRoomsCount = rooms.filter(r => r.status === 'Available').length;

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Executive Dashboard', 
      icon: LayoutDashboard,
      badge: null,
      roles: ['admin', 'manager', 'receptionist'] 
    },
    { 
      id: 'guests', 
      label: 'Guest Records', 
      icon: Users,
      badge: `${activeGuestsCount} In-house`,
      roles: ['admin', 'manager', 'receptionist'] 
    },
    { 
      id: 'staff', 
      label: 'Staff Management', 
      icon: UserCog,
      badge: `${staff.length} Active`,
      roles: ['admin', 'manager'] 
    },
    { 
      id: 'rooms', 
      label: 'Room Matrix & Rack', 
      icon: BedDouble,
      badge: `${availableRoomsCount} Free`,
      roles: ['admin', 'manager', 'receptionist'] 
    },
    { 
      id: 'analytics', 
      label: 'Visual Reports & Charts', 
      icon: BarChart3,
      badge: 'Matplotlib+',
      roles: ['admin', 'manager'] 
    },
    { 
      id: 'billing', 
      label: 'Dynamic Billing & Invoices', 
      icon: Receipt,
      badge: 'Auto-rate',
      roles: ['admin', 'manager', 'receptionist'] 
    },
    { 
      id: 'phone-verify', 
      label: 'Guest Phone Verification', 
      icon: PhoneCall,
      badge: 'API Tool',
      roles: ['admin', 'manager', 'receptionist'] 
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  const visibleItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-16 bottom-0 left-0 z-30 w-64 bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out
        lg:translate-x-0
        ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-4 space-y-6 overflow-y-auto">
          
          {/* Main Navigation */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Management Modules
            </div>
            <nav className="space-y-1">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-500/15 to-brand-500/5 text-brand-700 dark:text-brand-300 border-l-4 border-brand-500 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-brand-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Interactive Python CLI Simulator CTA */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-navy-900 border border-slate-700/60 text-white shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold block">CLI Terminal View</span>
                <span className="text-[10px] text-slate-400">Python 3.8+ Monolith</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              Experience the original terminal interactive menu reconstructed live in your browser.
            </p>
            <button
              onClick={() => {
                onOpenCliModal();
                setMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Launch Terminal Simulator</span>
            </button>
          </div>

        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-navy-950/40">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Vercel Ready</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">v2.4.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
