"use server";

import { client } from "@/sanity/lib/client";

const writeClient = client.withConfig({
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export async function syncCartToSanity(email: string, cartItems: any[]) {
  try {
    // ✅ TRANSLATION LAYER: Frontend (_id) -> Database (productId)
    const sanityFriendlyItems = cartItems.map((item) => ({
      productId: item._id, // Map the ID here
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      imageUrl: item.imageUrl,
    }));

    const existingCart = await client.fetch(
      `*[_type == "cart" && userEmail == $email][0]._id`,
      { email }
    );

    if (existingCart) {
      await writeClient
        .patch(existingCart)
        .set({ items: sanityFriendlyItems })
        .commit();
    } else {
      await writeClient.create({
        _type: "cart",
        userEmail: email,
        items: sanityFriendlyItems,
      });
    }
  } catch (error) {
    console.error("Error syncing cart:", error);
  }
}

export async function fetchCartFromSanity(email: string) {
  try {
    const cartData = await client.fetch(
      `*[_type == "cart" && userEmail == $email][0].items`,
      { email }
    );

    if (!cartData) return [];

    // ✅ TRANSLATION LAYER: Database (productId) -> Frontend (_id)
    return cartData.map((item: any) => ({
      _id: item.productId, // Map it back so the UI doesn't break
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      imageUrl: item.imageUrl,
    }));

  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}