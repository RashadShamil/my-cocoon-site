"use server";

import { client } from "@/sanity/lib/client";

// Create a write client using the token
const writeClient = client.withConfig({
  token: process.env.SANITY_API_TOKEN, // Make sure this is in your .env.local
  useCdn: false, // We need fresh data for carts
});

export async function syncCartToSanity(email: string, cartItems: any[]) {
  try {
    // 1. Check if a cart already exists for this user
    const existingCart = await client.fetch(
      `*[_type == "cart" && userEmail == $email][0]._id`,
      { email }
    );

    if (existingCart) {
      // 2. Update existing cart
      await writeClient
        .patch(existingCart)
        .set({ items: cartItems })
        .commit();
    } else {
      // 3. Create new cart
      await writeClient.create({
        _type: "cart",
        userEmail: email,
        items: cartItems,
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
    return cartData || [];
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}