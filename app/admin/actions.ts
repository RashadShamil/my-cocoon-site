"use server";

import { createClient } from "next-sanity";
import { revalidatePath } from "next/cache";
import { sendCuteOrderEmail, sendStatusUpdateEmail } from "@/lib/sendOrderEmail";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-05-03",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function deleteProductAction(id: string) {
  try {
    await client.delete(id);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function handleFileUpload(file: File) {
  if (!file || file.size === 0) return null;
  const arrayBuffer = await file.arrayBuffer();
  const asset = await client.assets.upload("image", Buffer.from(arrayBuffer), { filename: file.name });
  return asset._id;
}

export async function createProductAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const description = formData.get("description") as string || "";
    const sizeOptionsStr = formData.get("sizeOptions") as string;
    const colorsStr = formData.get("colors") as string;
    const isSale = formData.get("isSale") === "true";
    const originalPriceStr = formData.get("originalPrice");
    const originalPrice = originalPriceStr ? Number(originalPriceStr) : undefined;
    
    let sizeOptions = [];
    if (sizeOptionsStr) {
      sizeOptions = JSON.parse(sizeOptionsStr).map((s: any, idx: number) => ({ ...s, _key: `size-${idx}` }));
    }

    let colors = [];
    if (colorsStr) {
      const parsedColors = JSON.parse(colorsStr);
      for (let idx = 0; idx < parsedColors.length; idx++) {
        let c = parsedColors[idx];
        const colorImageFile = formData.get(`colorImage-${idx}`) as File;
        let imageObj = c.image; 
        
        if (colorImageFile && colorImageFile.size > 0) {
           const assetId = await handleFileUpload(colorImageFile);
           if (assetId) {
             imageObj = { _type: "image", asset: { _type: "reference", _ref: assetId } };
           }
        }
        
        colors.push({
          ...c,
          _key: `color-${idx}`,
          image: imageObj,
          sizes: c.sizes?.map((s: any, sIdx: number) => ({ ...s, _key: `size-${idx}-${sIdx}` }))
        });
      }
    }

    if (!name || !price) throw new Error("Name and Price are required.");

    // Upload Main Image
    const mainImageFile = formData.get("image") as File;
    const mainAssetId = await handleFileUpload(mainImageFile);

    // Upload Gallery Images
    const galleryFiles = formData.getAll("gallery") as File[];
    const galleryAssets = [];
    for (const file of galleryFiles) {
      const assetId = await handleFileUpload(file);
      if (assetId) {
         galleryAssets.push({ _type: "image", _key: assetId, asset: { _type: "reference", _ref: assetId } });
      }
    }

    const newProduct = {
      _type: "product",
      name,
      slug: { _type: "slug", current: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") },
      price,
      description,
      sizeOptions,
      colors,
      category: category || "Casual Dresses",
      isSale,
      ...(originalPrice && { originalPrice }),
      ...(mainAssetId && { image: { _type: "image", asset: { _type: "reference", _ref: mainAssetId } } }),
      ...(galleryAssets.length > 0 && { gallery: galleryAssets })
    };

    await client.create(newProduct);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const description = formData.get("description") as string || "";
    const sizeOptionsStr = formData.get("sizeOptions") as string;
    const colorsStr = formData.get("colors") as string;
    const isSale = formData.get("isSale") === "true";
    const originalPriceStr = formData.get("originalPrice");
    const originalPrice = originalPriceStr ? Number(originalPriceStr) : null; // Use null to clear it if it was removed
    
    let sizeOptions = [];
    if (sizeOptionsStr) {
      sizeOptions = JSON.parse(sizeOptionsStr).map((s: any, idx: number) => ({ ...s, _key: `size-${idx}` }));
    }

    let colors = [];
    if (colorsStr) {
      const parsedColors = JSON.parse(colorsStr);
      for (let idx = 0; idx < parsedColors.length; idx++) {
        let c = parsedColors[idx];
        const colorImageFile = formData.get(`colorImage-${idx}`) as File;
        let imageObj = c.image; 
        
        if (colorImageFile && colorImageFile.size > 0) {
           const assetId = await handleFileUpload(colorImageFile);
           if (assetId) {
             imageObj = { _type: "image", asset: { _type: "reference", _ref: assetId } };
           }
        }
        
        colors.push({
          ...c,
          _key: `color-${idx}`,
          image: imageObj,
          sizes: c.sizes?.map((s: any, sIdx: number) => ({ ...s, _key: `size-${idx}-${sIdx}` }))
        });
      }
    }

    const updates: any = {
      name,
      price,
      category: category || "Casual Dresses",
      description,
      sizeOptions,
      colors,
      isSale,
      ...(originalPrice !== null ? { originalPrice } : {}) // we'll just not send it if null, or maybe we want to unset it. Let's send it if not null. Wait, setting to null in Sanity unsets it. So we can just set originalPrice: originalPrice
    };
    // actually, let's just assign originalPrice directly
    updates.originalPrice = originalPrice;

    // Replace Image if explicitly provided
    const mainImageFile = formData.get("image") as File;
    if (mainImageFile && mainImageFile.size > 0) {
      const mainAssetId = await handleFileUpload(mainImageFile);
      updates.image = { _type: "image", asset: { _type: "reference", _ref: mainAssetId } };
    }

    // Only set gallery if new ones are uploaded (for simplicity logic: replacing wholesale)
    const galleryFiles = formData.getAll("gallery") as File[];
    if (galleryFiles.length > 0 && galleryFiles[0].size > 0) {
      const galleryAssets = [];
      for (const file of galleryFiles) {
        const assetId = await handleFileUpload(file);
        if (assetId) galleryAssets.push({ _type: "image", _key: assetId, asset: { _type: "reference", _ref: assetId } });
      }
      updates.gallery = galleryAssets;
    }

    await client.patch(id).set(updates).commit();
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendTestEmailAction(toEmail: string) {
  // Pass dummy data simulating an order transaction
  return await sendCuteOrderEmail({
    customerName: "Magic Customer",
    orderNumber: "PINK-1234",
    totalAmount: 6500,
    items: [
      { productName: "Enchanted Bloom Frock", quantity: 1, price: 4500 },
      { productName: "Sparkle Tiara", quantity: 1, price: 2000 }
    ]
  }, toEmail);
}

export async function updateOrderStatusAction(orderId: string, newStatus: string, orderData: any) {
  try {
    await client.patch(orderId).set({ status: newStatus }).commit();
    revalidatePath("/admin/orders", "page");
    revalidatePath("/admin", "page");
    
    if (orderData && orderData.email) {
      await sendStatusUpdateEmail(orderData, newStatus, orderData.email);
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
