"use server";

import { client } from "@/sanity/lib/client";

const writeClient = client.withConfig({
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export async function syncCartToSanity(email: string, cartItems: any[]) {
  try {
    // ✅ TRANSFORM 1: Frontend (_id) -> Sanity (productId)
    const sanityFriendlyItems = cartItems.map((item) => ({
      productId: item._id, // Map _id to productId
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

    // ✅ TRANSFORM 2: Sanity (productId) -> Frontend (_id)
    // We map it back so your CartContext doesn't break
    return cartData.map((item: any) => ({
      _id: item.productId,
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