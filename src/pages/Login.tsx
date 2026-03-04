import { useState } from "react";
import { motion } from "motion/react";
import { Scale, ArrowRight, Mail, Lock, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { isFirebaseConfigured } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured || !auth) {
      setError("Firebase är inte konfigurerat. Vänligen lägg till miljövariabler.");
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/app");
    } catch (err: any) {
      setError("Misslyckades att logga in. Kontrollera dina uppgifter.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-lexora-bg flex flex-col selection:bg-lexora-text/20 selection:text-lexora-text"
    >
      <header className="p-6">
        <Link to="/" className="flex items-center gap-2 text-lexora-text w-fit hover:opacity-80 transition-opacity">
          <Scale className="w-8 h-8" />
          <span className="font-serif text-2xl font-semibold tracking-tight">Lexora</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-lexora-border p-8 md:p-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-lexora-text mb-3">Logga in</h1>
            <p className="text-lexora-text/70">
              Välkommen tillbaka till Lexora.
            </p>
          </div>

          {!isFirebaseConfigured && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Firebase saknas</p>
                <p>För att inloggning ska fungera måste du konfigurera Firebase-miljövariablerna i AI Studio.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-lexora-text mb-2">E-postadress</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-lexora-text/40" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-lexora-bg border border-lexora-border rounded-xl py-3 pl-11 pr-4 text-lexora-text placeholder:text-lexora-text/40 focus:outline-none focus:ring-2 focus:ring-lexora-text/20 transition-all"
                  placeholder="anna@foretaget.se"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-lexora-text mb-2">Lösenord</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-lexora-text/40" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-lexora-bg border border-lexora-border rounded-xl py-3 pl-11 pr-4 text-lexora-text placeholder:text-lexora-text/40 focus:outline-none focus:ring-2 focus:ring-lexora-text/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !isFirebaseConfigured}
              className="w-full bg-lexora-text text-lexora-bg py-4 rounded-xl text-base font-medium hover:bg-lexora-text/90 transition-colors shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-lexora-bg/30 border-t-lexora-bg rounded-full animate-spin" />
              ) : (
                <>
                  Logga in <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm text-lexora-text/60">
            Har du inget konto? <Link to="/register" className="text-lexora-text font-medium hover:underline">Skapa konto</Link>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
