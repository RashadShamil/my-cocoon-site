"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { createProductAction, updateProductAction } from "@/app/admin/actions";

// Hardcoded SVGs to fix Lucide missing exports
const Check = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
const UploadCloud = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path></svg>);
const PlusCircle = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>);
const Trash2 = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>);
const XIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

export function AddProductForm({ initialData = null, onClose = () => {} }: { initialData?: any, onClose?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // States prepopulated 
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [category, setCategory] = useState(initialData?.category || "Casual Dresses");
  const [description, setDescription] = useState(initialData?.description || "");
  const [sizeOptions, setSizeOptions] = useState<{size: string, price: number}[]>(initialData?.sizeOptions || []);
  const [colors, setColors] = useState<any[]>(initialData?.colors?.map((c: any) => ({
    ...c,
    imagePreview: c.imageUrl || null
  })) || []);
  const [isSale, setIsSale] = useState(initialData?.isSale || false);
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice || "");

  // Image states
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]); // simplified for new uploads

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImageFile(e.target.files[0]);
      setMainImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setGalleryFiles(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(f => URL.createObjectURL(f));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addColor = () => setColors([...colors, { colorName: "", colorHex: "#000000", sizes: [] }]);
  const removeColor = (i: number) => setColors(colors.filter((_, idx) => idx !== i));
  const updateColor = (i: number, key: string, val: string) => {
    const updated = [...colors];
    updated[i] = { ...updated[i], [key]: val } as any;
    setColors(updated);
  };
  
  const addColorSize = (colorIdx: number) => {
    const updated = [...colors];
    updated[colorIdx].sizes.push({ size: "", price: Number(price) || 0, stock: 0 });
    setColors(updated);
  };
  const removeColorSize = (colorIdx: number, sizeIdx: number) => {
    const updated = [...colors];
    updated[colorIdx].sizes = updated[colorIdx].sizes.filter((_: any, idx: number) => idx !== sizeIdx);
    setColors(updated);
  };
  const updateColorSize = (colorIdx: number, sizeIdx: number, key: string, val: string | number) => {
    const updated = [...colors];
    updated[colorIdx].sizes[sizeIdx] = { ...updated[colorIdx].sizes[sizeIdx], [key]: val } as any;
    setColors(updated);
  };

  const handleColorImageChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const updated = [...colors];
      updated[i] = { ...updated[i], imageFile: e.target.files[0], imagePreview: URL.createObjectURL(e.target.files[0]) };
      setColors(updated);
    }
  };

  const removeColorImage = (i: number) => {
    const updated = [...colors];
    updated[i] = { ...updated[i], imageFile: null, imagePreview: null, imageUrl: null };
    setColors(updated);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("sizeOptions", JSON.stringify(sizeOptions));
    
    const colorsToSubmit = colors.map((c: any) => {
       const copy = { ...c };
       delete copy.imageFile;
       delete copy.imagePreview;
       delete copy.imageUrl;
       return copy;
    });
    formData.append("colors", JSON.stringify(colorsToSubmit));
    
    colors.forEach((c: any, idx: number) => {
      if (c.imageFile) {
        formData.append(`colorImage-${idx}`, c.imageFile);
      }
    });
    
    // We handle files manually to override the ones from the form inputs
    formData.delete("image");
    if (mainImageFile) formData.append("image", mainImageFile);
    
    formData.delete("gallery");
    galleryFiles.forEach(file => formData.append("gallery", file));

    let res;
    if (initialData?._id) {
       res = await updateProductAction(initialData._id, formData);
    } else {
       res = await createProductAction(formData);
    }

    if (res?.success) {
      setSuccess(true);
      if (!initialData) {
        setName(""); setPrice(""); setDescription(""); setSizeOptions([]); setColors([]); setIsSale(false); setOriginalPrice("");
        setMainImageFile(null); setMainImagePreview(null); setGalleryFiles([]); setGalleryPreviews([]);
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
    <form onSubmit={handleSubmit} className="p-6 pt-12 space-y-5 relative">
      <button 
        type="button" 
        onClick={onClose} 
        className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-100 rounded-full text-gray-500 hover:text-red-600 transition-colors z-10"
        title="Close"
      >
         <XIcon className="w-5 h-5"/>
      </button>
      
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select name="category" value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white">
            <option value="Casual Dresses">Casual Dresses</option>
            <option value="Infant Wear">Infant Wear</option>
            <option value="Party Wear">Party Wear</option>
            <option value="Girls' Tops">Girls' Tops</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Selling Price (LKR)</label>
          <input name="price" type="number" required value={price} onChange={e=>setPrice(e.target.value)} className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="3500" />
        </div>
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer p-2 border-2 border-pink-200 rounded-xl bg-pink-50 w-full mb-[2px]">
            <input type="checkbox" name="isSale" checked={isSale} onChange={e=>setIsSale(e.target.checked)} value="true" className="w-5 h-5 accent-primary" />
            <span className="text-sm font-semibold text-gray-700">Mark as Sale Item</span>
          </label>
        </div>
      </div>

      {isSale && (
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price (Before Sale, LKR)</label>
          <input name="originalPrice" type="number" required value={originalPrice} onChange={e=>setOriginalPrice(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-gray-50 text-gray-500" placeholder="5000" />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
        <textarea name="description" value={description} onChange={e=>setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Lovely pink dress perfect for..." />
      </div>

      <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
        <label className="block text-sm font-bold text-pink-800 mb-2">Color Variants & Sizes</label>
        {colors.map((color, i) => (
          <div key={i} className="mb-4 p-4 border border-pink-200 bg-white rounded-xl relative shadow-sm">
            <button type="button" onClick={() => removeColor(i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5"/>
            </button>
            <div className="grid grid-cols-2 gap-4 mb-3 pr-8">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Color Name</label>
                <input placeholder="e.g. Midnight Blue" value={color.colorName} onChange={(e) => updateColor(i, "colorName", e.target.value)} className="w-full px-3 py-1.5 rounded-lg border-2 border-pink-100 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Color Hex</label>
                <div className="flex gap-2">
                  <input type="color" value={color.colorHex} onChange={(e) => updateColor(i, "colorHex", e.target.value)} className="w-10 h-8 rounded cursor-pointer border-0 p-0" />
                  <input value={color.colorHex} onChange={(e) => updateColor(i, "colorHex", e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border-2 border-pink-100 focus:border-primary outline-none uppercase" />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Color Image (Optional)</label>
              {color.imagePreview ? (
                <div className="relative w-24 h-32 rounded-xl overflow-hidden border-2 border-pink-200">
                  <img src={color.imagePreview} alt="Color Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeColorImage(i)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 text-red-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-32 border-2 border-dashed border-pink-300 rounded-xl flex items-center justify-center bg-pink-50 hover:bg-pink-100 transition cursor-pointer relative">
                  <input type="file" accept="image/*" onChange={(e) => handleColorImageChange(i, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="flex flex-col items-center pointer-events-none p-1 text-center">
                    <UploadCloud className="w-5 h-5 text-pink-500 mb-1" />
                    <span className="text-[10px] font-semibold text-pink-600">Color Pic</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pl-4 border-l-2 border-pink-200 mt-4">
              <label className="block text-xs font-bold text-gray-700 mb-2">Sizes & Stock for {color.colorName || 'Color'}</label>
              {color.sizes.map((sz: any, j: number) => (
                <div key={j} className="flex gap-2 mb-2 items-center">
                  <input placeholder="Size (e.g. 3-4 Yrs)" value={sz.size} onChange={(e) => updateColorSize(i, j, "size", e.target.value)} className="flex-1 px-2 py-1 text-sm rounded border-2 border-pink-100 focus:border-primary outline-none" />
                  <input type="number" placeholder="Price" value={sz.price} onChange={(e) => updateColorSize(i, j, "price", Number(e.target.value))} className="w-24 px-2 py-1 text-sm rounded border-2 border-pink-100 focus:border-primary outline-none" />
                  <input type="number" placeholder="Stock" value={sz.stock} onChange={(e) => updateColorSize(i, j, "stock", Number(e.target.value))} className="w-20 px-2 py-1 text-sm rounded border-2 border-pink-100 focus:border-primary outline-none" />
                  <button type="button" onClick={() => removeColorSize(i, j)} className="text-red-400 hover:text-red-600"><XIcon className="w-4 h-4"/></button>
                </div>
              ))}
              <button type="button" onClick={() => addColorSize(i)} className="text-xs font-bold text-primary hover:text-accent flex items-center gap-1 mt-2">
                <PlusCircle className="w-3 h-3"/> Add Size
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addColor} className="text-sm font-bold text-primary hover:text-accent flex items-center gap-1 mt-2">
          <PlusCircle className="w-4 h-4"/> Add Color Variant
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Main Image</label>
          {mainImagePreview ? (
            <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-pink-200">
              <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={removeMainImage} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full h-32 border-2 border-dashed border-pink-300 rounded-xl flex items-center justify-center bg-pink-50 hover:bg-pink-100 transition cursor-pointer relative">
              <input type="file" accept="image/*" onChange={handleMainImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center pointer-events-none">
                <UploadCloud className="w-6 h-6 text-pink-500 mb-1" />
                <span className="text-xs font-semibold text-pink-600">Primary Drop</span>
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Gallery Images (Multiple)</label>
          <div className="flex gap-2 overflow-x-auto pb-2 min-h-[8rem]">
            {galleryPreviews.map((preview, idx) => (
              <div key={idx} className="relative w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden border-2 border-purple-200">
                <img src={preview} alt="Gallery" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 text-red-500 z-10">
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="relative w-24 h-32 flex-shrink-0 border-2 border-dashed border-purple-300 rounded-xl flex items-center justify-center bg-purple-50 hover:bg-purple-100 transition cursor-pointer">
              <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center pointer-events-none text-center p-1">
                <PlusCircle className="w-5 h-5 text-purple-500 mb-1" />
                <span className="text-[10px] font-semibold text-purple-600">Add More</span>
              </div>
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
