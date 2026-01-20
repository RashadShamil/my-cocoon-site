import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

// 1. Create a "Write Client" using the secret token
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN, // ⚠️ Crucial: This allows writing
  useCdn: false, // We want fresh data immediately
  apiVersion: "2023-05-03",
});

export async function POST(req: Request) {
  try {
    // 2. Parse the incoming form data
    const formData = await req.formData();
    
    const productId = formData.get("productId") as string;
    const name = formData.get("name") as string;
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;
    const imageFile = formData.get("image") as File | null;

    if (!productId || !name || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageAssetId = null;

    // 3. If there's an image, upload it to Sanity first
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: imageFile.name,
      });
      
      imageAssetId = asset._id;
    }

    // 4. Create the Review Document
    const doc = {
      _type: 'review',
      name,
      rating,
      comment,
      product: {
        _type: 'reference',
        _ref: productId,
      },
      // Only add images array if an image was uploaded
      ...(imageAssetId && {
        images: [
          {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAssetId,
            }
          }
        ]
      })
    };

    const result = await writeClient.create(doc);

    return NextResponse.json({ message: "Review submitted!", result });

  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}