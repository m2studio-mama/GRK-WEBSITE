'use client';

import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

export default function WhatsAppFAB() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="animate-fade-in-up bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-4 w-64">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-black text-sm">GRK Fan Club</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <p className="text-gray-400 text-xs font-serif mb-4 leading-relaxed">
            Chat with our team for registration help, coordinator contact, or general inquiries.
          </p>
          <a
            href="https://wa.me/918122267108?text=Hi%20GRK%20Fan%20Club%2C%20I%20need%20help!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-emerald-500 transition-colors"
          >
            <MessageCircle size={14} /> Chat on WhatsApp
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-emerald-600 text-white shadow-2xl flex items-center justify-center hover:bg-emerald-500 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Open WhatsApp chat"
      >
        {open ? <X size={22} /> : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M11.999 2.018c-5.488 0-9.955 4.458-9.957 9.94 0 1.754.458 3.466 1.33 4.973L2 22l5.207-1.363a9.978 9.978 0 0 0 4.785 1.217h.004c5.487 0 9.954-4.459 9.956-9.94.001-2.657-1.032-5.153-2.907-7.031A9.918 9.918 0 0 0 11.999 2.018zm0 18.2h-.003a8.297 8.297 0 0 1-4.227-1.156l-.303-.18-3.09.81.824-3.012-.197-.31a8.273 8.273 0 0 1-1.27-4.393c.002-4.572 3.722-8.293 8.295-8.293 2.217 0 4.299.865 5.865 2.434a8.242 8.242 0 0 1 2.423 5.862c-.002 4.573-3.722 8.238-8.317 8.238z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
