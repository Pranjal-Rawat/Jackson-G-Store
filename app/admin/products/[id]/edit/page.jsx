// File: app/admin/products/[id]/edit/page.jsx
'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useRouter }                 from 'next/navigation';
import Script                                   from 'next/script';
import { Search, Trash }                        from 'lucide-react';
import productLookup                            from '../../../../../data/productLookup';

/* ---------- static category list ---------- */
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
  const seen=new Set();
  return arr.filter(p=>!seen.has(p.slug)&&seen.add(p.slug));
};

/* ---------- component ---------- */
export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form,setForm]   = useState(null);
  const [status,setStatus]= useState({loading:true,saving:false,success:false,error:''});

  /* widget + quick-search refs */
  const widgetRef  = useRef(null);
  const [widgetJS,setWidgetJS] = useState(false);
  const [widgetErr,setWidgetErr]= useState('');

  const [q,setQ]   = useState('');
  const [list,setList]=useState([]);
  const [show,setShow]=useState(false);
  const debounce = useRef();

  /* suggestion query strings */
  const [titleQuery,setTitleQuery]   = useState('');
  const [slugQuery,setSlugQuery]     = useState('');
  const [catQuery,setCatQuery]       = useState('');

  /* ----- suggestion arrays (max 20) ----- */
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
    const l=catQuery.toLowerCase();
    return categoryOptions.filter(c=>
      c.slug.includes(l) || c.name.toLowerCase().includes(l)
    );
  },[catQuery]);

  const envOK = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
                !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  /* ---------- fetch product ---------- */
  useEffect(()=>{
    if(!id||id.length!==24){
      setStatus({loading:false,saving:false,success:false,error:'Invalid ID'});return;
    }
    fetch(`/api/admin/products?id=${id}`)
      .then(r=>{ if(r.status===401) router.replace('/admin/login'); if(!r.ok) throw new Error(); return r.json(); })
      .then(p=>{
        setForm({
          ...p,
          imageUrl :p.image??'',
          tags     :(p.tags||[]).join(','),
          options  :(p.options||[]).join(','),
        });
        setTitleQuery(p.title||'');
        setSlugQuery(p.slug ||'');
        setCatQuery (p.category||'');
      })
      .catch(()=>setStatus(s=>({...s,error:'Product not found'})))
      .finally(()=>setStatus(s=>({...s,loading:false})));
  },[id,router]);

  /* ---------- quick search ---------- */
  useEffect(()=>{
    clearTimeout(debounce.current);
    if(!q.trim()){setList([]);return;}
    debounce.current=setTimeout(async()=>{
      const r=await fetch(`/api/admin/products?skip=0&limit=5&q=${encodeURIComponent(q.trim())}&table=1`);
      setList(await r.json());
    },300);
    return()=>clearTimeout(debounce.current);
  },[q]);

  /* ---------- field handlers ---------- */
  const onChange = e=>{
    const {name,value,type,checked}=e.target;
    setForm(f=>({...f,[name]:type==='checkbox'?checked:value}));
  };

  const onTitle = e=>{
    const val=e.target.value;
    setTitleQuery(val);
    setForm(f=>({...f,title:val,slug:slugify(val)}));
  };

  const onSlug  = e=>{ setSlugQuery(e.target.value); onChange(e); };
  const onCat   = e=>{ setCatQuery(e.target.value);  onChange(e); };

  /* ---------- Cloudinary ---------- */
  const chooseImage = ()=>{
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
      if(err) return setWidgetErr('Upload failed');
      if(res?.event==='success')
        setForm(f=>({...f,imageUrl:res.info.secure_url}));
    });
  };
  const clearImage = ()=> setForm(f=>({...f,imageUrl:''}));

  /* ---------- submit ---------- */
  const onSubmit=async e=>{
    e.preventDefault(); setWidgetErr(''); setStatus(s=>({...s,saving:true}));
    const patch={id};
    Object.entries(form).forEach(([k,v])=>{
      if(k==='featured'||k==='popular'){patch[k]=v; return;}
      if(v==='') return;
      if(['quantity','price','originalPrice','stock','rank'].includes(k))
        patch[k]=Number(v)||0;
      else if(k==='tags')     patch[k]=v.split(',').map(t=>t.trim()).filter(Boolean);
      else if(k==='options')  patch[k]=v.split(',').map(o=>o.trim()).filter(Boolean);
      else                    patch[k]=v;
    });
    const r=await fetch('/api/admin/products',{
      method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(patch),
    });
    if(r.status===401) return router.replace('/admin/login');
    if(r.ok){
      setStatus({loading:false,saving:false,success:true,error:''});
      setTimeout(()=>router.push('/admin/products?mode=edit&done=1'),1500);
    }else{
      const body=await r.json().catch(()=>({}));
      setStatus({loading:false,saving:false,success:false,error:body.error||'Update failed'});
    }
  };

  /* ---------- early exits ---------- */
  if(status.loading) return <p className="p-6">Loading…</p>;
  if(status.error)   return <p className="p-6 text-red-500">{status.error}</p>;
  if(!form)          return null;

  /* ---------- UI ---------- */
  return (
    <>
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js"
              strategy="lazyOnload" onLoad={()=>setWidgetJS(true)} />

      <div className="max-w-2xl mx-auto p-6 space-y-8">

        {/* quick search (unchanged) */}
        <div className="relative">
          <input value={q} onChange={e=>{setQ(e.target.value);setShow(true);}}
                 placeholder="Search & jump…"
                 className="w-full border rounded px-3 py-2"/>
          {show&&list.length>0&&(
            <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow-sm max-h-56 overflow-auto">
              {list.map(p=>(
                <li key={p._id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer truncate"
                    onClick={()=>router.push(`/admin/products/${p._id}/edit`)}>
                  {p.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <h1 className="text-2xl font-semibold">Update Product</h1>

        {/* image controls */}
        <div className="flex items-center gap-4">
          <button type="button" onClick={chooseImage}
                  disabled={!widgetJS||!envOK}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
            {!widgetJS?'Loading widget…':form.imageUrl?'Replace Image':'Upload Image'}
          </button>
          {form.imageUrl&&(
            <button onClick={clearImage}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded"
                    title="Remove image">
              <Trash size={16} className="text-red-600"/>
            </button>
          )}
        </div>
        {!envOK&&(
          <p className="text-sm text-red-500">
            Missing <code>NEXT_PUBLIC_CLOUDINARY_*</code> env vars.
          </p>
        )}
        {form.imageUrl&&<img src={form.imageUrl} alt=""
                             className="w-full h-48 object-cover rounded"/>}

        {status.success&&<p className="text-green-600">Updated – redirecting…</p>}
        {widgetErr&&   <p className="text-red-500">{widgetErr}</p>}

        {/* ---------- form ---------- */}
        <form onSubmit={onSubmit} className="space-y-4 animate-fade-in">

          {/* Title */}
          <label className="block text-sm font-medium">
            Title
            <input name="title" value={form.title} onChange={onTitle}
                   list="title-suggest"
                   className="mt-1 block w-full border rounded px-3 py-2"/>
          </label>
          <datalist id="title-suggest">
            {titleSuggest.map((p,i)=>
              <option key={p.slug+'-'+i} value={p.title}/>)}
          </datalist>

          {/* Slug */}
          <label className="block text-sm font-medium">
            Slug
            <input name="slug" value={form.slug} onChange={onSlug}
                   list="slug-suggest"
                   className="mt-1 block w-full border rounded px-3 py-2"/>
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
                   className="mt-1 block w-full border rounded px-3 py-2"/>
          </label>
          <datalist id="cat-suggest">
            {catSuggest.map(c=>(
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </datalist>

          {/* Remaining fields */}
          <Text label="Brand"    name="brand"    value={form.brand}    onChange={onChange}/>
          <Text label="Unit"     name="unit"     value={form.unit}     onChange={onChange}/>
          <Text label="Pack Size"name="packSize" value={form.packSize} onChange={onChange}/>

          <NumberPair
            left ={{label:'Quantity',      name:'quantity',      value:form.quantity}}
            right={{label:'Stock',         name:'stock',         value:form.stock}}
            onChange={onChange}/>
          <NumberPair
            left ={{label:'Price (₹)',     name:'price',         value:form.price}}
            right={{label:'Original Price',name:'originalPrice', value:form.originalPrice}}
            onChange={onChange}/>
          <NumberPair
            left ={{label:'Rank',          name:'rank',          value:form.rank}}
            right={null} onChange={onChange}/>

          <Textarea label="Description" name="description"
                    value={form.description} onChange={onChange}/>
          <Text label="Tags (comma-separated)"    name="tags"
                value={form.tags}    onChange={onChange}/>
          <Text label="Options (comma-separated)" name="options"
                value={form.options} onChange={onChange}/>

          <div className="flex gap-8 items-center">
            <Checkbox label="Featured" name="featured"
                      checked={form.featured} onChange={onChange}/>
            <Checkbox label="Popular"  name="popular"
                      checked={form.popular}  onChange={onChange}/>
          </div>

          <button type="submit" disabled={status.saving}
                  className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
            {status.saving?'Saving…':'Update Product'}
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
