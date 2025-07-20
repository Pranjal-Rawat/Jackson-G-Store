// File: app/admin/products/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const PAGE_SIZE = 10; // ← change to 20 if you like

export default function ProductDashboard() {
  const params  = useSearchParams();
  const mode    = params.get('mode'); // null | 'edit' | 'delete'
  const router  = useRouter();

  /* state */
  const [rows,   setRows]   = useState([]);
  const [skip,   setSkip]   = useState(0);
  const [hasMore,setMore]   = useState(true);
  const [loading,setLoad]   = useState(false);
  const [error,  setErr]    = useState('');

  const [input,  setInput]  = useState('');
  const [query,  setQuery]  = useState('');

  /* helper: fetch slice ------------------------------------ */
  const fetchRows = async ({ reset = false } = {}) => {
    if (loading) return;
    setLoad(true);

    try {
      const res  = await fetch(
        `/api/admin/products?skip=${reset ? 0 : skip}&limit=${PAGE_SIZE}&q=${encodeURIComponent(query)}&table=1`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();

      setRows(prev => (reset ? data : [...prev, ...data]));
      setSkip(prev => (reset ? data.length : prev + data.length));
      setMore(data.length === PAGE_SIZE);
    } catch {
      setErr('Failed to load products');
    } finally {
      setLoad(false);
    }
  };

  /* initial + query change -------------------------------- */
  useEffect(() => {
    fetchRows({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  /* actions */
  const goEdit   = id => router.push(`/admin/products/${id}/edit`);
  const goDelete = id => router.push(`/admin/products/${id}/delete`);

  /* search submit */
  const onSearch = e => {
    e.preventDefault();
    setQuery(input.trim());
  };

  /* ui ----------------------------------------------------- */
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-white rounded shadow">

      {/* heading */}
      <h1 className="text-2xl font-semibold">
        {mode === 'edit'
          ? 'Update Product'
          : mode === 'delete'
          ? 'Delete a Product'
          : 'All Products'}
      </h1>

      {/* search */}
      <form onSubmit={onSearch} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search title / slug / brand…"
          className="flex-1 border rounded px-3 py-2"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-1">
          <Search size={18} /> Search
        </button>
      </form>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-3">Image</th>
              <th className="py-2 pr-3">Title</th>
              <th className="py-2 pr-3">Price&nbsp;(₹)</th>
              <th className="py-2 pr-3">Stock</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(p => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="py-2 pr-3">
                  {p.image
                    ? <img src={p.image} alt="" className="w-12 h-12 object-cover rounded" />
                    : <span className="text-gray-400">—</span>}
                </td>
                <td className="py-2 pr-3 truncate max-w-xs">{p.title}</td>
                <td className="py-2 pr-3">{p.price?.toFixed?.(2) ?? '—'}</td>
                <td className="py-2 pr-3">{p.stock ?? '—'}</td>
                <td className="py-2">
                  {mode === 'edit' && (
                    <button
                      onClick={() => goEdit(p._id)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  )}

                  {mode === 'delete' && (
                    <button
                      onClick={() => goDelete(p._id)}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}

                  {!mode && <span className="text-gray-400">—</span>}
                </td>
              </tr>
            ))}

            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* load more */}
      {hasMore && !loading && (
        <button
          onClick={() => fetchRows()}
          className="w-full py-2 border rounded hover:bg-gray-50"
        >
          Load {PAGE_SIZE} More
        </button>
      )}
      {loading && <p className="text-center text-sm text-gray-500 py-2">Loading…</p>}
      {!hasMore && rows.length > 0 && (
        <p className="text-center text-sm text-gray-500">No more products.</p>
      )}
    </div>
  );
}
