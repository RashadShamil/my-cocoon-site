import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { sendCuteOrderEmail, sendAdminNotificationEmail } from "@/lib/sendOrderEmail";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2023-05-03",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart, formData, total, paymentMethod } = body; // ✅ Added paymentMethod

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderDate = new Date().toISOString().split('T')[0];

    const orderDoc = {
      _type: 'order',
      orderNumber,
      customerName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.district}`,
      paymentMethod, // ✅ Save the method
      totalAmount: total,
      status: 'pending', 
      orderDate: orderDate,
      items: cart.map((item: any) => ({
        _key: item._id + (item.size || ""),
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size || "Standard",
        product: {
            _type: 'reference',
            _ref: item._id
        }
      })),
    };

    const result = await writeClient.create(orderDoc);

    // Send emails
    try {
      await sendCuteOrderEmail(orderDoc, formData.email);
      await sendAdminNotificationEmail(orderDoc);
    } catch (emailErr) {
      console.error("Failed to send emails:", emailErr);
    }

    return NextResponse.json({ message: "Order Created", orderId: result._id });

  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}