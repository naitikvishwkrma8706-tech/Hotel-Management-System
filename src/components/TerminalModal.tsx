import React, { useState, useRef, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { X, Terminal as TermIcon, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import { calculateSalaryForDepartment } from '../utils/helpers';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose }) => {
  const { guests, staff, addGuest, deleteGuest, addStaff, deleteStaff } = useHotel();
  const [history, setHistory] = useState<string[]>([
    "*********************************************",
    "*     HOTEL MANAGEMENT SYSTEM MAIN MENU     *",
    "*********************************************",
    "1. Guest records ",
    "2. Staff records ",
    "3. Exit",
    "Type '1', '2', or '3' below and press Enter:"
  ]);
  const [inputVal, setInputVal] = useState("");
  const [currentMenu, setCurrentMenu] = useState<'main' | 'guest' | 'staff' | 'add_guest_step' | 'add_staff_step'>('main');
  const [tempData, setTempData] = useState<any>({});
  const [tempStep, setTempStep] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    setInputVal("");

    const newLog = [...history, `> ${cmd}`];

    if (cmd.toLowerCase() === 'clear' || cmd.toLowerCase() === 'cls') {
      setHistory([
        "*********************************************",
        "*     HOTEL MANAGEMENT SYSTEM MAIN MENU     *",
        "*********************************************",
        "1. Guest records ",
        "2. Staff records ",
        "3. Exit"
      ]);
      setCurrentMenu('main');
      return;
    }

    if (currentMenu === 'main') {
      if (cmd === '1') {
        newLog.push(
          "\n================ GUEST MENU ================",
          "1. Show all guests",
          "2. Add guest",
          "3. Search guest",
          "4. Delete guest",
          "5. View stats / summary",
          "6. Return to Main Menu",
          "Enter choice (1-6):"
        );
        setCurrentMenu('guest');
      } else if (cmd === '2') {
        newLog.push(
          "\n================ STAFF MENU ================",
          "1. Show all staff",
          "2. Add staff",
          "3. Search staff",
          "4. Delete staff",
          "5. View salary tiers",
          "6. Return to Main Menu",
          "Enter choice (1-6):"
        );
        setCurrentMenu('staff');
      } else if (cmd === '3') {
        newLog.push("Exiting terminal mode. Goodbye!");
        setTimeout(() => onClose(), 800);
      } else {
        newLog.push("INVALID INPUT. Please enter 1, 2, or 3.");
      }
    } else if (currentMenu === 'guest') {
      if (cmd === '1') {
        newLog.push("\n--- PANDAS DATAFRAME: GUEST TABLE ---");
        newLog.push("  id  | name                    | source       | room_no | date       | type_of_room");
        newLog.push("----------------------------------------------------------------------------------");
        guests.forEach(g => {
          newLog.push(`  ${String(g.id).padEnd(4)}| ${g.name.padEnd(24)}| ${g.source.padEnd(13)}| ${String(g.room_no).padEnd(8)}| ${g.date} | ${g.type_of_room}`);
        });
        newLog.push(`\nTotal rows: ${guests.length}`);
        newLog.push("\nEnter choice (1-6):");
      } else if (cmd === '2') {
        newLog.push("--- ADD NEW GUEST ---");
        newLog.push("Enter Guest ID (integer):");
        setTempData({});
        setTempStep(1);
        setCurrentMenu('add_guest_step');
      } else if (cmd === '3') {
        newLog.push("Enter guest search keyword (name or room):");
        // we can prompt for search or do next step
        setCurrentMenu('guest');
      } else if (cmd === '4') {
        newLog.push("Enter Guest ID to delete:");
        setCurrentMenu('guest');
      } else if (cmd === '5') {
        newLog.push("\n[Matplotlib Simulation: Rooms Booked & Source Distribution]");
        const sources: Record<string, number> = {};
        guests.forEach(g => sources[g.source] = (sources[g.source] || 0) + 1);
        Object.entries(sources).forEach(([s, cnt]) => {
          newLog.push(`  ${s.padEnd(18)} : ${"█".repeat(cnt * 3)} (${cnt})`);
        });
        newLog.push("\nEnter choice (1-6):");
      } else if (cmd === '6') {
        newLog.push(
          "\n*********************************************",
          "*     HOTEL MANAGEMENT SYSTEM MAIN MENU     *",
          "*********************************************",
          "1. Guest records ",
          "2. Staff records ",
          "3. Exit",
          "Enter choice:"
        );
        setCurrentMenu('main');
      } else {
        newLog.push("Invalid selection. Enter 1-6:");
      }
    } else if (currentMenu === 'staff') {
      if (cmd === '1') {
        newLog.push("\n--- PANDAS DATAFRAME: STAFF TABLE ---");
        newLog.push("  id  | name                 | dept                 | sal   | hiredate  ");
        newLog.push("------------------------------------------------------------------------");
        staff.forEach(s => {
          newLog.push(`  ${String(s.id).padEnd(4)}| ${s.name.padEnd(21)}| ${s.dept.padEnd(21)}| $${String(s.sal).padEnd(5)}| ${s.hiredate}`);
        });
        newLog.push(`\nTotal rows: ${staff.length}`);
        newLog.push("\nEnter choice (1-6):");
      } else if (cmd === '2') {
        newLog.push("--- ADD NEW STAFF ---");
        newLog.push("Enter Staff ID (integer):");
        setTempData({});
        setTempStep(1);
        setCurrentMenu('add_staff_step');
      } else if (cmd === '5') {
        newLog.push("\n[Matplotlib Simulation: Staff Count by Salary Level]");
        const sal2000 = staff.filter(s => s.sal === 2000).length;
        const sal4000 = staff.filter(s => s.sal === 4000).length;
        const sal6000 = staff.filter(s => s.sal === 6000).length;
        newLog.push(`  $2000 (Cleaning)   : ${"█".repeat(sal2000 * 3)} (${sal2000})`);
        newLog.push(`  $4000 (Food & Bev) : ${"█".repeat(sal4000 * 3)} (${sal4000})`);
        newLog.push(`  $6000 (Management) : ${"█".repeat(sal6000 * 3)} (${sal6000})`);
        newLog.push("\nEnter choice (1-6):");
      } else if (cmd === '6') {
        newLog.push(
          "\n*********************************************",
          "*     HOTEL MANAGEMENT SYSTEM MAIN MENU     *",
          "*********************************************",
          "1. Guest records ",
          "2. Staff records ",
          "3. Exit",
          "Enter choice:"
        );
        setCurrentMenu('main');
      } else {
        newLog.push("Enter choice (1-6):");
      }
    } else if (currentMenu === 'add_guest_step') {
      if (tempStep === 1) {
        const id = parseInt(cmd);
        if (isNaN(id)) {
          newLog.push("ID must be an integer. Try again:");
        } else if (guests.some(g => g.id === id)) {
          newLog.push("ID already exists, enter a different ID:");
        } else {
          setTempData({ ...tempData, id });
          setTempStep(2);
          newLog.push("Enter Name:");
        }
      } else if (tempStep === 2) {
        setTempData({ ...tempData, name: cmd });
        setTempStep(3);
        newLog.push("Enter Source of Booking (e.g. Website, Walk-in, Booking.com):");
      } else if (tempStep === 3) {
        setTempData({ ...tempData, source: cmd });
        setTempStep(4);
        newLog.push("Enter Room no (e.g. 101, 201):");
      } else if (tempStep === 4) {
        const room_no = parseInt(cmd) || 102;
        setTempData({ ...tempData, room_no });
        setTempStep(5);
        newLog.push("Enter Date (YYYY-MM-DD):");
      } else if (tempStep === 5) {
        setTempData({ ...tempData, date: cmd || new Date().toISOString().slice(0, 10) });
        setTempStep(6);
        newLog.push("Enter Type of Room (Standard / Deluxe / Executive Suite):");
      } else if (tempStep === 6) {
        const finalGuest = {
          ...tempData,
          type_of_room: cmd || 'Standard',
          status: 'Checked In' as const,
          check_out_date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
        };
        addGuest(finalGuest);
        newLog.push("Record Added Successfully into MySQL database!");
        newLog.push("\nEnter choice (1-6):");
        setCurrentMenu('guest');
      }
    } else if (currentMenu === 'add_staff_step') {
      if (tempStep === 1) {
        const id = parseInt(cmd);
        if (isNaN(id)) {
          newLog.push("ID must be an integer. Try again:");
        } else if (staff.some(s => s.id === id)) {
          newLog.push("ID already exists, enter a different ID:");
        } else {
          setTempData({ ...tempData, id });
          setTempStep(2);
          newLog.push("Enter Name:");
        }
      } else if (tempStep === 2) {
        setTempData({ ...tempData, name: cmd });
        setTempStep(3);
        newLog.push("Enter Department (cleaning / food and beverages / management):");
      } else if (tempStep === 3) {
        const dept = cmd.toLowerCase();
        const sal = calculateSalaryForDepartment(dept);
        const finalStaff = {
          ...tempData,
          dept,
          sal,
          hiredate: new Date().toISOString().slice(0, 10),
        };
        addStaff(finalStaff);
        newLog.push(`Auto-calculated Salary for '${dept}': $${sal}`);
        newLog.push("Staff Record Added Successfully!");
        newLog.push("\nEnter choice (1-6):");
        setCurrentMenu('staff');
      }
    }

    setHistory(newLog);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[650px] font-mono text-xs text-emerald-400">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            </div>
            <div className="ml-3 flex items-center gap-2 text-xs font-semibold text-slate-200">
              <TermIcon className="w-4 h-4 text-emerald-400" />
              <span>Python 3.8 CLI Interactive Shell &mdash; main.py</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistory(["Terminal cleared.", "Type '1', '2', or '3' for main menu:"])}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Clear terminal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 p-4 overflow-y-auto space-y-1 bg-black/90 selection:bg-emerald-500 selection:text-black">
          <div className="text-slate-500 mb-2">
            Connected to local MySQL database `hotel` via SQLAlchemy & pymysql.
          </div>
          {history.map((line, i) => (
            <div 
              key={i} 
              className={line.startsWith('>') ? 'text-amber-300 font-bold' : line.includes('***') ? 'text-cyan-400 font-bold' : 'text-emerald-400'}
            >
              {line}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Command Input Prompt */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 px-4 py-3 bg-slate-900/90 border-t border-slate-800">
          <span className="text-amber-400 font-bold select-none">&gt;&gt;&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type command or option number..."
            className="flex-1 bg-transparent border-none text-emerald-300 font-mono text-xs focus:outline-none placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded transition-colors"
          >
            Execute
          </button>
        </form>
      </div>
    </div>
  );
};
