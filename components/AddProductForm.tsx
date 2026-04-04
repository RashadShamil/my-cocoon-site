"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { createProductAction } from "@/app/admin/actions";

const Check = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const UploadCloud = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
    <path d="M12 12v9"></path>
    <path d="m16 16-4-4-4 4"></path>
  </svg>
);

const PlusCircle = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 12h8"></path>
    <path d="M12 8v8"></path>
  </svg>
);

export function AddProductForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await createProductAction(formData);

    if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 3000);
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <Button 
        onClick={() => setOpen(true)} 
        size="lg" 
        className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg shadow-primary/20"
      >
        <PlusCircle className="mr-2 h-5 w-5" /> Insert New Dress
      </Button>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] shadow-xl border border-white/40 max-w-xl mx-auto w-full mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Add New Product
        </h2>
        <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-900 border rounded-full px-3 py-1 font-bold">X</button>
      </div>
      
      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-4 flex items-center gap-2">
          <Check className="w-5 h-5"/> Product inserted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input required name="name" type="text" className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Princess Floral Dress" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR)</label>
            <input required name="price" type="number" step="0.01" className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 4500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input required name="category" type="text" className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Party Wear" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          <div className="border border-dashed border-gray-300 rounded-2xl p-6 bg-white/30 text-center relative hover:bg-white/50 transition-colors cursor-pointer">
            <input name="image" type="file" required accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="w-8 h-8 text-primary mx-auto mb-2" />
            <span className="text-sm text-gray-500 font-medium">Click to upload or drag an image</span>
          </div>
        </div>

        <Button disabled={loading} type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-white rounded-full mt-4 h-12 shadow-md">
          {loading ? "Uploading..." : "Save Product"}
        </Button>
      </form>
    </div>
  );
}
