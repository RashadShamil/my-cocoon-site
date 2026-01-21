"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// --- INLINE ICONS ---
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.04-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
);
const HeartIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>;
const AlertCircleIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>;
const UserIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const MailIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
const LockIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const ArrowRightIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const CheckCircleIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;

export default function SignupPage() {
  const containerRef = useRef(null);
  const { isLoaded, signUp, setActive } = useSignUp();
  // We use useUser to check if the user is ALREADY signed in 
  // (e.g. if they came from the Login page via Google auto-registration)
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // ✅ REDIRECT IF ALREADY SIGNED IN
  // This handles the case where a user clicks "Google" on Login, 
  // gets auto-registered, and is redirected here by your Env Vars.
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, user, router]);


  // Function to handle Google Sign-Up
  const signUpWithGoogle = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/"
      });
    } catch (err: any) {
      console.error("Google sign up error:", err);
      setError("Failed to sign up with Google. Please try again.");
      setIsLoading(false);
    }
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");

    try {
      await signUp.create({ firstName, emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error("Signup error:", err);
      const errorMessage = err.errors?.[0]?.longMessage || "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerifyPress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      } else {
        console.log("Verification status:", completeSignUp.status);
      }
    } catch (err: any) {
       console.error("Verification error:", err);
       const errorMessage = err.errors?.[0]?.longMessage || "Invalid code. Please try again.";
       setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <div className="fixed inset-0 z-[-20] h-full w-full bg-[url('/Pbanner-bg.jpg')] bg-cover bg-center bg-no-repeat md:hidden" />
      <motion.div style={{ y }} className="hidden md:block fixed top-0 left-0 w-full h-[150vh] -z-10">
        <img src="/banner-bg.jpg" alt="Background" className="w-full h-full object-cover object-top" />
      </motion.div>

      <div className="w-full max-w-md px-4 relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-white/60 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/30 rounded-full blur-[80px]" />

          <div className="text-center mb-8 relative">
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }} className="inline-flex p-3 rounded-full bg-primary/10 mb-4 text-primary shadow-sm">
                 <HeartIcon className="w-6 h-6 fill-primary/20" />
             </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                {pendingVerification ? "Verify Email" : "Sign Up"}
            </h1>
            <p className="text-muted-foreground">
                {pendingVerification ? `We've sent a code to ${email}` : "Create an account to start your journey."}
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 relative z-10">
              <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
          {!pendingVerification ? (
            // --- FORM 1: Initial Sign Up ---
            <motion.div key="signup-container">
              <form onSubmit={onSubmit} className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input id="name" placeholder="Full Name" type="text" autoCapitalize="words" autoCorrect="off" disabled={isLoading} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="pl-10 bg-white/80 border-gray-200 focus:border-primary focus:ring-primary rounded-xl py-6" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input id="email" placeholder="name@example.com" type="email" autoCapitalize="none" autoComplete="email" autoCorrect="off" disabled={isLoading} value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-white/80 border-gray-200 focus:border-primary focus:ring-primary rounded-xl py-6" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input id="password" placeholder="Create Password" type="password" autoComplete="new-password" disabled={isLoading} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-white/80 border-gray-200 focus:border-primary focus:ring-primary rounded-xl py-6" />
                  </div>
                </div>

                {/* ✅ REQUIRED FOR CLERK BOT PROTECTION (Fixes the console error) */}
                <div id="clerk-captcha" />

                <Button disabled={isLoading || !isLoaded} className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4">
                  {isLoading ? ( <ArrowRightIcon className="mr-2 h-4 w-4 animate-spin" /> ) : ( "Create Account" )}
                </Button>
              </form>

              {/* Google Sign Up Button Section */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/50 backdrop-blur-md px-2 text-muted-foreground rounded-full">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button 
              type="button"
              variant="outline" 
              onClick={signUpWithGoogle}
              disabled={isLoading || !isLoaded}
              className="w-full bg-white/80 hover:bg-white border-gray-200 text-gray-700 py-6 rounded-xl text-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <GoogleIcon />
              Sign up with Google
            </Button>

          </motion.div>
          ) : (
            // --- FORM 2: Verification Code ---
            <motion.form key="verification-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={onVerifyPress} className="space-y-5 relative z-10">
                 <div className="space-y-2">
                 <div className="relative">
                  <CheckCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input id="code" placeholder="Enter Verification Code" type="text" inputMode="numeric" autoComplete="one-time-code" disabled={isLoading} value={code} onChange={(e) => setCode(e.target.value)} className="pl-10 bg-white/80 border-primary/30 focus:border-primary focus:ring-primary rounded-xl py-6 text-lg tracking-widest" />
                </div>
              </div>
               <Button disabled={isLoading || !isLoaded} className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4">
                {isLoading ? ( <ArrowRightIcon className="mr-2 h-4 w-4 animate-spin" /> ) : ( "Verify Email" )}
              </Button>
               <button type="button" onClick={() => setPendingVerification(false)} className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                  Go back
               </button>
            </motion.form>
          )}
          </AnimatePresence>

          {!pendingVerification && (
            <p className="px-8 text-center text-sm text-muted-foreground relative z-10 mt-8">
                Already have an account?{" "}
                <Link href="/login" className="hover:text-primary underline underline-offset-4 font-semibold transition-colors">
                Sign in
                </Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}