import React, { useState } from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { GuestManagement } from './components/GuestManagement';
import { StaffManagement } from './components/StaffManagement';
import { RoomRack } from './components/RoomRack';
import { AnalyticsView } from './components/AnalyticsView';
import { BillingView } from './components/BillingView';
import { PhoneVerification } from './components/PhoneVerification';
import { ToastContainer } from './components/ToastContainer';
import { AddGuestModal } from './components/AddGuestModal';
import { AddStaffModal } from './components/AddStaffModal';
import { TerminalModal } from './components/TerminalModal';
import { Guest } from './types';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useHotel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [cliModalOpen, setCliModalOpen] = useState(false);
  const [preselectedRoom, setPreselectedRoom] = useState<number | null>(null);
  const [selectedInvoiceGuest, setSelectedInvoiceGuest] = useState<Guest | null>(null);

  const handleBookRoom = (roomNo: number) => {
    setPreselectedRoom(roomNo);
    setBookingModalOpen(true);
  };

  const handleOpenInvoice = (guest: Guest) => {
    setSelectedInvoiceGuest(guest);
    setActiveTab('billing');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Top Navigation */}
      <Navbar
        onOpenBookingModal={() => {
          setPreselectedRoom(null);
          setBookingModalOpen(true);
        }}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Container */}
      <div className="flex">
        
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
          onOpenCliModal={() => setCliModalOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 lg:pl-64 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
          {activeTab === 'dashboard' && (
            <Dashboard
              onOpenBookingModal={() => {
                setPreselectedRoom(null);
                setBookingModalOpen(true);
              }}
              onOpenStaffModal={() => setStaffModalOpen(true)}
              onOpenCliModal={() => setCliModalOpen(true)}
            />
          )}

          {activeTab === 'guests' && (
            <GuestManagement
              onOpenBookingModal={() => {
                setPreselectedRoom(null);
                setBookingModalOpen(true);
              }}
              onOpenInvoiceModal={handleOpenInvoice}
            />
          )}

          {activeTab === 'staff' && (
            <StaffManagement
              onOpenStaffModal={() => setStaffModalOpen(true)}
            />
          )}

          {activeTab === 'rooms' && (
            <RoomRack
              onBookRoom={handleBookRoom}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}

          {activeTab === 'billing' && (
            <BillingView initialGuest={selectedInvoiceGuest} />
          )}

          {activeTab === 'phone-verify' && (
            <PhoneVerification />
          )}
        </main>
      </div>

      {/* Persistent Modals */}
      <AddGuestModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setPreselectedRoom(null);
        }}
        preselectedRoomNo={preselectedRoom}
      />

      <AddStaffModal
        isOpen={staffModalOpen}
        onClose={() => setStaffModalOpen(false)}
      />

      <TerminalModal
        isOpen={cliModalOpen}
        onClose={() => setCliModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <MainLayout />
    </HotelProvider>
  );
}
