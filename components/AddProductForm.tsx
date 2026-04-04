"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { createProductAction, updateProductAction } from "@/app/admin/actions";

// Hardcoded SVGs to fix Lucide missing exports
const Check = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
const UploadCloud = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path></svg>);
const PlusCircle = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>);
const Trash2 = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>);

export function AddProductForm({ initialData = null, onClose = () => {} }: { initialData?: any, onClose?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // States prepopulated 
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [category, setCategory] = useState(initialData?.category || "party");
  const [description, setDescription] = useState(initialData?.description || "");
  const [sizeOptions, setSizeOptions] = useState<{size: string, price: number}[]>(initialData?.sizeOptions || []);

  const addSize = () => setSizeOptions([...sizeOptions, { size: "", price: 0 }]);
  const removeSize = (i: number) => setSizeOptions(sizeOptions.filter((_, idx) => idx !== i));
  const updateSize = (i: number, key: string, val: string | number) => {
    const updated = [...sizeOptions];
    updated[i] = { ...updated[i], [key]: val };
    setSizeOptions(updated);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("sizeOptions", JSON.stringify(sizeOptions));

    let res;
    if (initialData?._id) {
       res = await updateProductAction(initialData._id, formData);
    } else {
       res = await createProductAction(formData);
    }

    if (res?.success) {
      setSuccess(true);
      if (!initialData) {
        setName(""); setPrice(""); setDescription(""); setSizeOptions([]);
      }
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="p-2 space-y-5 relative">
      {initialData && (
        <button type="button" onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
           <Trash2 className="w-5 h-5"/> Close
        </button>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-4 flex items-center gap-2">
          <Check className="w-5 h-5"/> {initialData ? "Product updated!" : "Product inserted successfully!"}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Dress Name</label>
          <input name="name" required value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Enchanted Bloom..." />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Base Price (LKR)</label>
          <input name="price" type="number" required value={price} onChange={e=>setPrice(e.target.value)} className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="3500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
        <textarea name="description" value={description} onChange={e=>setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Lovely pink dress perfect for..." />
      </div>

      <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
        <label className="block text-sm font-bold text-pink-800 mb-2">Sizes & Variants</label>
        {sizeOptions.map((opt, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input placeholder="Size Label (e.g. 3-4 Yrs)" value={opt.size} onChange={(e) => updateSize(i, "size", e.target.value)} className="flex-1 px-3 py-1 rounded-lg border-2 border-pink-200" />
            <input type="number" placeholder="Specific Price" value={opt.price} onChange={(e) => updateSize(i, "price", Number(e.target.value))} className="w-32 px-3 py-1 rounded-lg border-2 border-pink-200" />
            <button type="button" onClick={() => removeSize(i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5"/></button>
          </div>
        ))}
        <button type="button" onClick={addSize} className="text-sm font-bold text-primary hover:text-accent flex items-center gap-1 mt-2">
          <PlusCircle className="w-4 h-4"/> Add Size Variant
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Main Image</label>
          <div className="w-full h-24 border-2 border-dashed border-pink-300 rounded-xl flex items-center justify-center bg-pink-50 hover:bg-pink-100 transition cursor-pointer relative">
            <input type="file" name="image" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center pointer-events-none">
              <UploadCloud className="w-6 h-6 text-pink-500 mb-1" />
              <span className="text-xs font-semibold text-pink-600">Primary Drop</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Gallery Images (Multiple)</label>
          <div className="w-full h-24 border-2 border-dashed border-purple-300 rounded-xl flex items-center justify-center bg-purple-50 hover:bg-purple-100 transition cursor-pointer relative">
            <input type="file" name="gallery" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center pointer-events-none">
              <UploadCloud className="w-6 h-6 text-purple-500 mb-1" />
              <span className="text-xs font-semibold text-purple-600">Multi Dropzone</span>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-secondary text-white rounded-xl shadow-md py-3 text-lg font-bold">
        {loading ? "Processing..." : initialData ? "Update Inventory" : "Insert Inventory Item"}
      </Button>
    </form>
  );
}
