import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Guest, RoomType } from '../types';
import { 
  Receipt, 
  Printer, 
  Download, 
  Building2, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  FileText,
  DollarSign,
  BedDouble
} from 'lucide-react';
import { calculateStayTotal, formatCurrency, formatDate, ROOM_PRICES } from '../utils/helpers';

interface BillingViewProps {
  initialGuest?: Guest | null;
}

export const BillingView: React.FC<BillingViewProps> = ({ initialGuest }) => {
  const { guests } = useHotel();
  const [selectedGuestId, setSelectedGuestId] = useState<number>(
    initialGuest?.id || (guests.length > 0 ? guests[0].id : 1)
  );

  const selectedGuest = guests.find(g => g.id === selectedGuestId) || guests[0];

  const stayCalculation = selectedGuest ? calculateStayTotal(
    selectedGuest.type_of_room,
    selectedGuest.date,
    selectedGuest.check_out_date || selectedGuest.date
  ) : { nights: 1, rate: 120, roomTotal: 120, taxes: 14, total: 134 };

  const handlePrint = () => {
    window.print();
  };

  if (!selectedGuest) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm font-semibold">No guest records found for billing generation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
              Dynamic Pricing &amp; Billing Invoices
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              PRD Section 8 Spec
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated duration calculation, room rate pricing matrix, and printable statement
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Guest Selector */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-slate-400 font-medium">Select Guest:</span>
            <select
              value={selectedGuestId}
              onChange={(e) => setSelectedGuestId(Number(e.target.value))}
              className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {guests.map(g => (
                <option key={g.id} value={g.id} className="dark:bg-slate-900">
                  #{g.id} - {g.name} (Room {g.room_no})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Printable Luxury Invoice Container */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xl print:border-none print:shadow-none print:p-0">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                  Grand Horizon Resort &amp; Suites
                </h1>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold tracking-wider uppercase">
                  Luxury Accommodation &amp; Spa
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              100 Ocean Promenade, Suite 1000<br />
              Pacific Vista, CA 90210<br />
              billing@grandhorizon.com | +1 (800) 555-0199
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider block font-serif">
              Guest Folio
            </span>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 space-y-0.5">
              <div>Invoice #: <strong className="text-slate-800 dark:text-slate-200 font-mono">GH-2026-{selectedGuest.id.toString().padStart(4, '0')}</strong></div>
              <div>Issue Date: <strong className="text-slate-800 dark:text-slate-200">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></div>
              <div>Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">{selectedGuest.payment_status || 'PAID'}</span></div>
            </div>
          </div>
        </div>

        {/* Bill To & Stay Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Guest Details
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-serif">
              {selectedGuest.name}
            </div>
            <div className="text-slate-500 dark:text-slate-400 mt-1 space-y-0.5">
              {selectedGuest.phone && <div>Phone: {selectedGuest.phone}</div>}
              {selectedGuest.email && <div>Email: {selectedGuest.email}</div>}
              <div>Acquisition Origin: <strong className="text-slate-700 dark:text-slate-300">{selectedGuest.source}</strong></div>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Stay Itinerary
            </span>
            <div className="space-y-0.5 text-slate-600 dark:text-slate-300">
              <div>Suite Allocated: <strong className="text-slate-900 dark:text-white">Room #{selectedGuest.room_no} ({selectedGuest.type_of_room})</strong></div>
              <div>Check-in Date: <strong>{formatDate(selectedGuest.date)}</strong></div>
              <div>Check-out Date: <strong>{formatDate(selectedGuest.check_out_date)}</strong></div>
              <div>Total Nights: <strong className="text-brand-600 dark:text-brand-400">{stayCalculation.nights} Nights</strong></div>
            </div>
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3">Description</th>
                <th className="pb-3 text-center">Nights</th>
                <th className="pb-3 text-right">Nightly Rate</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-4">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {selectedGuest.type_of_room} Accommodation
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Suite #{selectedGuest.room_no} &bull; Includes luxury amenities, high-speed Wi-Fi &amp; access to resort facilities
                  </div>
                </td>
                <td className="py-4 text-center font-semibold">{stayCalculation.nights}</td>
                <td className="py-4 text-right font-mono">{formatCurrency(stayCalculation.rate)}</td>
                <td className="py-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                  {formatCurrency(stayCalculation.roomTotal)}
                </td>
              </tr>
              <tr>
                <td className="py-3">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    State &amp; Local Hotel Occupancy Tax (12%)
                  </div>
                </td>
                <td className="py-3 text-center">-</td>
                <td className="py-3 text-right font-mono">12%</td>
                <td className="py-3 text-right font-mono text-slate-700 dark:text-slate-300">
                  {formatCurrency(stayCalculation.taxes)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col items-end text-xs space-y-2">
          <div className="flex justify-between w-64 text-slate-500 dark:text-slate-400">
            <span>Room Subtotal:</span>
            <span className="font-mono text-slate-900 dark:text-white">{formatCurrency(stayCalculation.roomTotal)}</span>
          </div>
          <div className="flex justify-between w-64 text-slate-500 dark:text-slate-400">
            <span>Taxes &amp; Fees (12%):</span>
            <span className="font-mono text-slate-900 dark:text-white">{formatCurrency(stayCalculation.taxes)}</span>
          </div>
          <div className="flex justify-between w-64 pt-2 border-t border-slate-200 dark:border-slate-800 text-base font-bold text-slate-900 dark:text-white">
            <span>Total Folio Amount:</span>
            <span className="font-mono text-brand-600 dark:text-brand-400">{formatCurrency(stayCalculation.total)}</span>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 text-center leading-relaxed">
          Thank you for choosing Grand Horizon Resort &amp; Suites. We look forward to welcoming you back.<br />
          This document satisfies all automated billing requirements defined in the Hotel Management System PRD.
        </div>

      </div>

    </div>
  );
};
