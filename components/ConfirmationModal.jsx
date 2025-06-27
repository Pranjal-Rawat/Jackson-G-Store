'use client';
import React from 'react';

export default function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-[#ffcc29]/40">
        <h4 className="text-lg font-bold mb-4 text-[#ed3237]">Confirm Order</h4>
        <p className="text-sm text-gray-600 mb-6">
          Proceed to place your order on WhatsApp with the above details?
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-tr from-[#ed3237] to-[#ffcc29] hover:from-[#ffcc29] hover:to-[#ed3237] text-white py-2 rounded-xl font-bold transition"
            type="button"
          >
            Yes, Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-[#ed3237] text-[#ed3237] py-2 rounded-xl font-bold hover:bg-[#fff6e3] transition"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
