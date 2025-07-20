// File: app/admin/products/[id]/delete/page.jsx
'use client';

import { useEffect, useState }      from 'react';
import { useRouter, useParams }     from 'next/navigation';

const FALLBACK_IMG = '/fallback-thumb.svg';   // tiny 1×1 or svg in /public

export default function DeleteProductPage() {
  const { id }   = useParams();
  const router   = useRouter();

  const [product, setProduct] = useState(null);
  const [status,  setStatus]  = useState({
    loading: true,
    deleting: false,
    error: '',
  });

  /* ── fetch product once ─────────────────────────────────────── */
  useEffect(() => {
    if (!id || id.length !== 24) {
      setStatus({ loading: false, deleting: false, error: 'Invalid ID' });
      return;
    }

    fetch(`/api/admin/products?id=${id}`)
      .then(res => {
        if (res.status === 401) router.replace('/admin/login');
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(setProduct)
      .catch(() => setStatus(s => ({ ...s, error: 'Product not found' })))
      .finally(() => setStatus(s => ({ ...s, loading: false })));
  }, [id, router]);

  /* ── delete handler ─────────────────────────────────────────── */
  const handleDelete = async () => {
    setStatus(s => ({ ...s, deleting: true, error: '' }));

    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });

    if (res.status === 401) return router.replace('/admin/login');

    if (res.ok) {
      router.push('/admin/products?mode=delete&done=1');
    } else {
      const body  = await res.json().catch(() => ({}));
      setStatus({ loading: false, deleting: false, error: body.error || 'Delete failed' });
    }
  };

  /* ── UI ─────────────────────────────────────────────────────── */
  if (status.loading) return <p className="p-6">Loading product…</p>;
  if (status.error)   return <p className="p-6 text-red-500">{status.error}</p>;
  if (!product)       return null;

  return (
    <div className="max-w-md mx-auto text-center space-y-6 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold text-red-600">Delete Product</h1>

      <img
        src={product.image || FALLBACK_IMG}
        onError={e => { e.currentTarget.src = FALLBACK_IMG; }}
        alt={product.title}
        className="w-32 h-32 object-cover rounded mx-auto"
      />

      <p>
        Are you sure you want to permanently delete<br />
        <strong>{product.title}</strong>?
      </p>

      {status.error && <p className="text-red-500">{status.error}</p>}

      <div className="flex justify-center gap-4">
        <button
          onClick={handleDelete}
          disabled={status.deleting}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {status.deleting ? 'Deleting…' : 'Yes, Delete'}
        </button>

        <button
          onClick={() => router.back()}
          disabled={status.deleting}
          className="px-4 py-2 text-gray-600 hover:underline disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
