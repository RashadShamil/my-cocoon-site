"use server";

import { createClient } from "next-sanity";
import { revalidatePath } from "next/cache";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-05-03",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function createProductAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;

    if (!name || !price) {
      throw new Error("Name and Price are required.");
    }

    const imageFile = formData.get("image") as File;
    let imageAssetId = null;

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const imageAsset = await client.assets.upload("image", buffer, {
        filename: imageFile.name,
      });
      imageAssetId = imageAsset._id;
    }

    const newProduct = {
      _type: "product",
      name,
      slug: { _type: "slug", current: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") },
      price,
      category: category || "dress",
      ...(imageAssetId && { 
        image: { 
          _type: "image", 
          asset: { _type: "reference", _ref: imageAssetId } 
        } 
      })
    };

    await client.create(newProduct);
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating product from Server Action:", error);
    return { success: false, error: error.message };
  }
}
