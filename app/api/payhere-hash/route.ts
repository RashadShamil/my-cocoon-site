import { NextResponse } from "next/server";
import crypto from "crypto-js";

export async function POST(req: Request) {
  try {
    const { order_id, amount, currency } = await req.json();

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;

    if (!merchantSecret || !merchantId) {
        return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Format amount to 2 decimal places (e.g., 1000.00)
    const formattedAmount = parseFloat(amount).toLocaleString('en-us', {minimumFractionDigits: 2}).replaceAll(',', '');

    // 1. Hash the Secret first
    const hashedSecret = crypto.MD5(merchantSecret).toString().toUpperCase();

    // 2. Create the Final Hash: md5(merchant_id + order_id + amount + currency + hashed_secret)
    const hashString = `${merchantId}${order_id}${formattedAmount}${currency}${hashedSecret}`;
    const hash = crypto.MD5(hashString).toString().toUpperCase();

    return NextResponse.json({ hash });

  } catch (error) {
    console.error("Hashing Error:", error);
    return NextResponse.json({ error: "Failed to generate hash" }, { status: 500 });
  }
}