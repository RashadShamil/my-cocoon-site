import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        {/* Simple Loading Spinner */}
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Verifying...</h2>
        <p className="text-gray-500">Please wait while we log you in.</p>
      </div>
      
      {/* The invisible worker that handles the handshake */}
      <AuthenticateWithRedirectCallback />
    </div>
  );
}