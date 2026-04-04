"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { sendTestEmailAction } from "@/app/admin/actions";

const Mail = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const Loader2 = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const Check = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export function TestEmailButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleTest() {
    setLoading(true);
    setSuccess(false);

    // Call server action sending mail to yourselves explicitly
    const result = await sendTestEmailAction("Cocoonkidssl@gmail.com");

    if (result?.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert("Error sending test email. Did you add the SMTP_PASSWORD App Password to .env.local?");
    }
    setLoading(false);
  }

  return (
    <Button 
      onClick={handleTest} 
      disabled={loading}
      className={`mt-4 w-full md:w-auto ${success ? 'bg-green-500 hover:bg-green-600' : 'bg-pink-500 hover:bg-pink-600'} text-white rounded-full shadow-lg border-2 border-white/40`}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
       success ? <Check className="mr-2 h-4 w-4" /> : 
                 <Mail className="mr-2 h-4 w-4" />}
      {success ? "Email Sent to Inbox!" : "Send Test Order Email to Inbox"}
    </Button>
  );
}
