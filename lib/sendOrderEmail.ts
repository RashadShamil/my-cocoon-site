import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { OrderEmailTemplate } from "@/components/OrderEmailTemplate";
import React from 'react'; // ensure React is imported for rendering

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Cocoonkidssl@gmail.com", // Your designated gmail account
    pass: process.env.SMTP_PASSWORD, // MUST be a 16-digit Google App Password
  },
});

export async function sendCuteOrderEmail(orderData: any, toEmail: string) {
  try {
    // Generate the raw HTML structure synchronously
    const htmlString = await render(OrderEmailTemplate(orderData) as any);

    const info = await transporter.sendMail({
      from: `"Cocoon Kids 🎀" <Cocoonkidssl@gmail.com>`,
      to: toEmail,
      subject: `Order Confirmation - #${orderData.orderNumber}`,
      html: htmlString,
    });

    console.log("Email confirmation successfully sent. Message ID: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Critical error dispatching confirmation email:", error);
    return { success: false, error };
  }
}
