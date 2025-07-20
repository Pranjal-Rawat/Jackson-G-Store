// File: app/admin/upload/page.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Script      from 'next/script';
import { useSession } from 'next-auth/react';
import { useRouter }  from 'next/navigation';
import { Check, Copy } from 'lucide-react';

const PAGE_SIZE = 10;
const DEBOUNCE  = 300;

/* helper: wrap Cloudinary widget into a single instance */
const openUploadWidget = (ref, cfg, cb) => {
  if (ref.current) { ref.current.open(); return; }
  if (!window.cloudinary) return;
  ref.current = window.cloudinary.createUploadWidget(cfg, cb);
  ref.current.open();
};

export default function AdminImageUploader() {
  /* auth gate */
  const { data:session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status !== 'loading' && !session) router.replace('/admin/login');
  }, [status, session, router]);

  /* state */
  const [uploads, setUploads] = useState([]);   // complete list of URLs
  const [query,   setQuery]   = useState('');
  const [slice,   setSlice]   = useState(PAGE_SIZE);

  const [widgetJS, setWidgetJS] = useState(false);
  const [copied,   setCopied]   = useState('');

  /* debounce search */
  const timerRef = useRef(null);
  const onInput  = v => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setQuery(v.trim());
      setSlice(PAGE_SIZE);
    }, DEBOUNCE);
  };

  /* Esc clears search */
  useEffect(() => {
    const h = e => e.key==='Escape' && onInput('');
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* refs */
  const widgetRef   = useRef(null);
  const envOK = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
                !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  /* open Cloudinary */
  const chooseImages = () => {
    if (!widgetJS || !envOK) return;
    openUploadWidget(
      widgetRef,
      {
        cloudName:    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        folder:       'grocery-store/uploads',
        sources:      ['local','url'],
        multiple:     true,
        clientAllowedFormats:['jpg','jpeg','png','webp'],
        maxFileSize:  5_000_000,
      },
      (_err,res)=>{
        if (res?.event==='success')
          setUploads(u => [res.info.secure_url, ...u]);
      }
    );
  };

  /* list helpers */
  const match  = u => u.toLowerCase().includes(query.toLowerCase());
  const rows   = uploads.filter(match);
  const list   = rows.slice(0, slice);
  const hasMore= list.length < rows.length;

  /* copy helper */
  const copy = url => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(()=>setCopied(''),1500);
  };

  /* auth loading gate */
  if (status==='loading' || !session)
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  /* ── UI ─────────────────────────────────────────────── */
  return (
    <>
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="lazyOnload"
        onLoad={()=>setWidgetJS(true)}
      />

      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* upload btn */}
        <button
          onClick={chooseImages}
          disabled={!widgetJS || !envOK}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {!widgetJS ? 'Loading widget…' : 'Upload Images'}
        </button>
        {!envOK && (
          <p className="text-sm text-red-500 mt-1">
            Missing <code>NEXT_PUBLIC_CLOUDINARY_*</code> env vars.
          </p>
        )}

        {/* search */}
        <input
          defaultValue={query}
          onChange={e=>onInput(e.target.value)}
          placeholder="Search uploaded URL…"
          className="w-full border rounded px-3 py-2"
        />

        {/* gallery */}
        {list.length > 0 && (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map(url=>{
                const name=url.split('/').pop();
                return (
                  <li key={url} className="border rounded overflow-hidden relative group">
                    <img src={url} alt={name} className="w-full h-32 object-cover" />

                    <button
                      onClick={()=>copy(url)}
                      className="absolute top-2 right-2 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy URL"
                    >
                      {copied===url ? <Check size={16}/> : <Copy size={16}/>}
                    </button>

                    <p className="p-2 text-xs break-all max-h-14 overflow-auto">{url}</p>
                  </li>
                );
              })}
            </ul>

            {/* load more */}
            {hasMore && (
              <button
                onClick={()=>setSlice(s=>s+PAGE_SIZE)}
                className="w-full py-2 border rounded hover:bg-gray-50 mt-4"
              >
                Load {PAGE_SIZE} More
              </button>
            )}
          </>
        )}

        {uploads.length===0 && (
          <p className="text-gray-500">
            No uploads yet. Click “Upload Images” to get started.
          </p>
        )}
      </div>
    </>
  );
}
