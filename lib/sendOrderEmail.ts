import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { OrderEmailTemplate } from "@/components/OrderEmailTemplate";
import { StatusEmailTemplate } from "@/components/StatusEmailTemplate";
import { AdminEmailTemplate } from "@/components/AdminEmailTemplate";
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

export async function sendStatusUpdateEmail(orderData: any, status: string, toEmail: string) {
  try {
    const htmlString = await render(StatusEmailTemplate({ ...orderData, status }) as any);

    const info = await transporter.sendMail({
      from: `"Cocoon Kids 🎀" <Cocoonkidssl@gmail.com>`,
      to: toEmail,
      subject: `Order Status Update - #${orderData.orderNumber || orderData._id?.slice(0,8).toUpperCase()}`,
      html: htmlString,
    });

    console.log("Status update email successfully sent. Message ID: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error dispatching status update email:", error);
    return { success: false, error };
  }
}

export async function sendAdminNotificationEmail(orderData: any) {
  try {
    const htmlString = await render(AdminEmailTemplate(orderData) as any);
    
    // Get admins from .env.local or fallback
    const adminEmailsStr = process.env.ADMIN_EMAILS || "shamilrashad@gmail.com";
    const adminEmails = adminEmailsStr.split(',').map(e => e.trim());

    const info = await transporter.sendMail({
      from: `"Cocoon Kids System" <Cocoonkidssl@gmail.com>`,
      to: adminEmails,
      subject: `[NEW ORDER] #${orderData.orderNumber || orderData._id?.slice(0,8).toUpperCase()} - LKR ${orderData.totalAmount}`,
      html: htmlString,
    });

    console.log("Admin notification email sent. Message ID: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error dispatching admin notification email:", error);
    return { success: false, error };
  }
}
