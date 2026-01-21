import { NextResponse } from "next/server";
import crypto from "crypto-js";
import { createClient } from "next-sanity";

// Setup Sanity Client (Must have Write access)
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN, 
  useCdn: false,
  apiVersion: "2023-05-03",
});

export async function POST(req: Request) {
  try {
    // 1. Parse the incoming data from PayHere
    const formData = await req.formData();
    const merchant_id = formData.get("merchant_id");
    const order_id = formData.get("order_id"); // This is our Sanity Document ID
    const payhere_amount = formData.get("payhere_amount");
    const payhere_currency = formData.get("payhere_currency");
    const status_code = formData.get("status_code");
    const md5sig = formData.get("md5sig"); // The security signature

    // 2. Verify the Signature (Security Check)
    const secret = process.env.PAYHERE_MERCHANT_SECRET as string;
    const hashedSecret = crypto.MD5(secret).toString().toUpperCase();
    
    const localMd5sig = crypto.MD5(
      `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`
    ).toString().toUpperCase();

    if (localMd5sig !== md5sig) {
      // Someone is trying to fake a payment!
      return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
    }

    // 3. Update Sanity Order Status
    // Status Code 2 means "Success"
    if (status_code === "2") {
      await client
        .patch(order_id as string)
        .set({ status: 'paid' })
        .commit();
        
      console.log(`Order ${order_id} marked as Paid.`);
    }

    return NextResponse.json({ message: "Notification received" });

  } catch (error) {
    console.error("PayHere Notify Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}