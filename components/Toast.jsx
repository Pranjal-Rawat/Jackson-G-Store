'use client';
import { useEffect } from 'react';

export default function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[1000] animate-toast-in">
        <div className="bg-red-600 text-white px-4 py-2 rounded shadow-lg">
          {msg}
        </div>
      </div>
      <style jsx global>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-toast-in { animation: toast-in .25s ease-out both; }
      `}</style>
    </>
  );
}
