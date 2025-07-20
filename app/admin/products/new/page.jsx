'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSession }  from 'next-auth/react';
import { useRouter }   from 'next/navigation';
import Script          from 'next/script';
import productLookup   from '../../../../data/productLookup';

/* ---------- static categories ---------- */
const categoryOptions = [
  { slug:'baby-care',          name:'Baby Care' },
  { slug:'beverages',          name:'Beverages' },
  { slug:'chocolates',         name:'Chocolates' },
  { slug:'condiments-sauces',  name:'Condiments & Sauces' },
  { slug:'dairy-refrigerated', name:'Dairy & Refrigerated' },
  { slug:'frozen-food',        name:'Frozen Food' },
  { slug:'household-cleaning', name:'Household Cleaning' },
  { slug:'ice-creams',         name:'Ice Creams' },
  { slug:'noodles',            name:'Noodles' },
  { slug:'perfumes',           name:'Perfumes' },
  { slug:'personal-care',      name:'Personal Care' },
  { slug:'snacks-bakery',      name:'Snacks & Bakery' },
  { slug:'spices-masalas',     name:'Spices & Masalas' },
  { slug:'staples',            name:'Staples' },
  { slug:'stationary',         name:'Stationary' },
];

/* ---------- helpers ---------- */
const slugify = s =>
  s.toLowerCase().trim()
   .replace(/[\s&/]+/g,'-')
   .replace(/[^a-z0-9-]/g,'')
   .replace(/-+/g,'-')
   .replace(/^-|-$/g,'')
   .slice(0,60);

const openUploadWidget = (ref,cfg,cb) => {
  if (ref.current) return ref.current.open();
  if (!window.cloudinary) return;
  ref.current = window.cloudinary.createUploadWidget(cfg,cb);
  ref.current.open();
};

const uniqBySlug = arr => {
  const seen = new Set();
  return arr.filter(p => !seen.has(p.slug)&&seen.add(p.slug));
};

/* ---------- component ---------- */
export default function NewProductPage() {
  const { data:session, status } = useSession();
  const router = useRouter();

  /* gate */
  useEffect(()=>{ if(status!=='loading' && !session) router.replace('/admin/login'); },
              [status,session,router]);

  /* form state */
  const [form,setForm] = useState({
    title:'', slug:'', category:'', brand:'', unit:'', packSize:'',
    quantity:'', price:'', originalPrice:'', stock:'', rank:'',
    description:'', tags:'', options:'', featured:false, popular:false,
  });

  /* image / status */
  const [imageUrl,setImageUrl] = useState('');
  const [widgetJS,setWidgetJS] = useState(false);
  const [saving,setSaving]     = useState(false);
  const [error,setError]       = useState('');
  const [success,setSuccess]   = useState(false);

  const widgetRef = useRef(null);
  const titleRef  = useRef(null);

  /* query strings for suggestions */
  const [titleQuery,setTitleQuery] = useState('');
  const [slugQuery,setSlugQuery]   = useState('');
  const [catQuery,setCatQuery]     = useState('');

  /* ---------- suggestion arrays ---------- */
  const titleSuggest = useMemo(()=>{
    const base = titleQuery
      ? productLookup.filter(p=>p.title.toLowerCase().includes(titleQuery.toLowerCase()))
      : productLookup;
    return uniqBySlug(base).slice(0,20);
  },[titleQuery]);

  const slugSuggest = useMemo(()=>{
    const base = slugQuery
      ? productLookup.filter(p=>p.slug.toLowerCase().includes(slugQuery.toLowerCase()))
      : productLookup;
    return uniqBySlug(base).slice(0,20);
  },[slugQuery]);

  const catSuggest = useMemo(()=>{
    if(!catQuery) return categoryOptions;
    const l = catQuery.toLowerCase();
    return categoryOptions.filter(c =>
      c.slug.includes(l) || c.name.toLowerCase().includes(l)
    );
  },[catQuery]);

  const envOK = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
                !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(()=>{ titleRef.current?.focus(); },[]);

  /* ---------- handlers ---------- */
  const onTitle = e=>{
    const val=e.target.value;
    setTitleQuery(val);
    setForm(f=>({...f,title:val,slug:slugify(val)}));
  };
  const onSlug  = e=>{ setSlugQuery(e.target.value); onChange(e); };
  const onCat   = e=>{ setCatQuery(e.target.value);  onChange(e); };

  const onChange = e=>{
    const {name,value,type,checked}=e.target;
    setForm(f=>({...f,[name]:type==='checkbox'?checked:value}));
  };

  /* Cloudinary */
  const pickImage = ()=>{
    if(!widgetJS||!envOK) return;
    openUploadWidget(widgetRef,{
      cloudName:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset:process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      folder:'grocery-store/products',
      sources:['local','url'],
      multiple:false,
      clientAllowedFormats:['jpg','jpeg','png','webp'],
      maxFileSize:5_000_000,
    },(err,res)=>{
      if(err) return setError('Upload failed');
      if(res?.event==='success') setImageUrl(res.info.secure_url);
    });
  };
  const clearImage = ()=> setImageUrl('');

  /* submit */
  const onSubmit = async e=>{
    e.preventDefault(); setError(''); setSuccess(false);
    if(!form.title && !form.slug) return setError('Enter a title or slug');
    if(!imageUrl)                 return setError('Upload an image');

    setSaving(true);
    const res = await fetch('/api/admin/products',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        ...form,
        imageUrl,
        quantity     :Number(form.quantity)||0,
        price        :Number(form.price)||0,
        originalPrice:Number(form.originalPrice)||0,
        stock        :Number(form.stock)||0,
        rank         :Number(form.rank)||0,
      }),
    });
    if(res.status===401) return router.replace('/admin/login');

    if(res.ok){
      setSuccess(true); setSaving(false);
      setTimeout(()=>router.push('/admin/products?mode=edit&done=1'),1500);
    }else{
      const body=await res.json().catch(()=>({}));
      setError(body.error||'Failed to create product'); setSaving(false);
    }
  };

  if(status==='loading'||!session)
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  /* ---------- UI ---------- */
  return (
    <>
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js"
              strategy="lazyOnload" onLoad={()=>setWidgetJS(true)}/>

      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-8 animate-fade-in">
        <h1 className="text-2xl font-semibold">Create New Product</h1>

        {/* image controls */}
        <div className="flex items-center gap-4">
          <button type="button" onClick={pickImage}
                  disabled={!widgetJS||!envOK}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
            {!widgetJS?'Loading widget…':imageUrl?'Replace Image':'Upload Image'}
          </button>
          {imageUrl&&
            <button onClick={clearImage}
                    className="text-sm text-red-600 underline">remove</button>}
        </div>
        {!envOK&&(
          <p className="text-sm text-red-500">
            Missing <code>NEXT_PUBLIC_CLOUDINARY_*</code> env vars.
          </p>)}
        {imageUrl&&<img src={imageUrl} alt=""
                        className="w-full h-48 object-cover rounded"/>}

        {success&&<p className="text-green-600">Product created – redirecting…</p>}
        {error  &&<p className="text-red-500">{error}</p>}

        {/* ---------- form ---------- */}
        <form onSubmit={onSubmit} className="space-y-4">

          {/* Title */}
          <label className="block text-sm font-medium">
            Title
            <input ref={titleRef} name="title" value={form.title}
                   onChange={onTitle} list="title-suggest"
                   placeholder="Start typing…"
                   className="mt-1 w-full border rounded px-3 py-2"/>
          </label>
          <datalist id="title-suggest">
            {titleSuggest.map((p,i)=>
              <option key={p.slug+'-'+i} value={p.title}/>)}
          </datalist>

          {/* Slug */}
          <label className="block text-sm font-medium">
            Slug
            <input name="slug" value={form.slug}
                   onChange={onSlug} list="slug-suggest"
                   placeholder="auto-filled, but editable"
                   className="mt-1 w-full border rounded px-3 py-2"/>
          </label>
          <datalist id="slug-suggest">
            {slugSuggest.map((p,i)=>
              <option key={p.slug+'-'+i} value={p.slug}/>)}
          </datalist>

          {/* Category with suggestions */}
          <label className="block text-sm font-medium">
            Category
            <input name="category" value={form.category}
                   onChange={onCat} list="cat-suggest"
                   className="mt-1 w-full border rounded px-3 py-2"/>
          </label>
          <datalist id="cat-suggest">
            {catSuggest.map(c=>
              <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </datalist>

          {/* remaining fields */}
          <Text label="Brand"    name="brand"    value={form.brand}    onChange={onChange}/>
          <Text label="Unit"     name="unit"     value={form.unit}     onChange={onChange}/>
          <Text label="Pack Size"name="packSize" value={form.packSize} onChange={onChange}/>

          <NumberPair
            left ={{label:'Quantity', name:'quantity', value:form.quantity}}
            right={{label:'Stock',    name:'stock',    value:form.stock}}
            onChange={onChange}/>
          <NumberPair
            left ={{label:'Price (₹)', name:'price', value:form.price}}
            right={{label:'Original Price', name:'originalPrice', value:form.originalPrice}}
            onChange={onChange}/>
          <NumberPair
            left={{label:'Rank', name:'rank', value:form.rank}} right={null}
            onChange={onChange}/>

          <Textarea label="Description" name="description"
                    value={form.description} onChange={onChange}/>
          <Text label="Tags (comma-separated)" name="tags"
                value={form.tags} onChange={onChange}/>
          <Text label="Options (comma-separated)" name="options"
                value={form.options} onChange={onChange}/>

          <div className="flex gap-8 items-center">
            <Checkbox label="Featured" name="featured"
                      checked={form.featured} onChange={onChange}/>
            <Checkbox label="Popular"  name="popular"
                      checked={form.popular}  onChange={onChange}/>
          </div>

          <button type="submit" disabled={saving}
                  className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
            {saving?'Saving…':'Create Product'}
          </button>
        </form>
      </div>
    </>
  );
}

/* ---------- tiny helpers ---------- */
function Text({label,...props}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input {...props} className="mt-1 block w-full border rounded px-3 py-2"/>
    </label>
  );
}
function Textarea({label,...props}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <textarea {...props} rows={4}
                className="mt-1 block w-full border rounded px-3 py-2"/>
    </label>
  );
}
function NumberPair({left,right,onChange}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Text {...left}  onChange={onChange}/>
      {right ? <Text {...right} onChange={onChange}/> : <span/>}
    </div>
  );
}
function Checkbox({label,name,checked,onChange}) {
  return (
    <label className="inline-flex items-center gap-2">
      <input type="checkbox" name={name} checked={checked}
             onChange={onChange} className="h-4 w-4"/>
      {label}
    </label>
  );
}
