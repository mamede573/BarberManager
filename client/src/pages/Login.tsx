import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulating login - in a real app, this would call an API
      setTimeout(() => {
        setLocation("/");
      }, 500);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex flex-col items-center justify-center px-6 py-8">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
            <LogIn className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-bold font-display text-white mb-2">
            BarberApp
          </h1>
          <p className="text-muted-foreground">Bem-vindo de volta</p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleLogin}
          className="space-y-4 mb-8"
        >
          {/* Email Input */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground outline-none focus:border-primary/50 focus:bg-secondary/70 transition-all"
              data-testid="input-email-login"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground outline-none focus:border-primary/50 focus:bg-secondary/70 transition-all"
              data-testid="input-password-login"
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded bg-secondary/50 border border-white/10 cursor-pointer"
              />
              Lembrar-me
            </label>
            <button
              type="button"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-black font-bold h-12 rounded-xl mt-6 flex items-center justify-center gap-2 transition-all"
            data-testid="button-login"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                Entrar
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </motion.form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Não tem conta?
            </span>
          </div>
        </div>

        {/* Signup Link */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setLocation("/signup")}
          className="w-full border border-white/10 hover:border-primary/30 bg-secondary/30 hover:bg-secondary/50 text-white font-bold h-12 rounded-xl transition-all"
          data-testid="button-signup-link"
        >
          Criar Nova Conta
        </motion.button>

        {/* Demo Login Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-xl text-center"
        >
          <p className="text-xs text-muted-foreground mb-2">
            Credenciais de demo:
          </p>
          <p className="text-xs text-white">
            <span className="text-primary">Email:</span> demo@barber.com
          </p>
          <p className="text-xs text-white">
            <span className="text-primary">Senha:</span> 123456
          </p>
        </motion.div>
      </div>
    </div>
  );
}
