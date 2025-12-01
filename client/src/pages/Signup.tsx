import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";
import { signup } from "@/lib/api";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        name,
        email,
        password,
      });
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
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
            Criar Conta
          </h1>
          <p className="text-muted-foreground">Junte-se ao BarberApp</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
            data-testid="text-error"
          >
            {error}
          </motion.div>
        )}

        {/* Signup Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSignup}
          className="space-y-4 mb-8"
        >
          {/* Name Input */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground outline-none focus:border-primary/50 focus:bg-secondary/70 transition-all"
              data-testid="input-name-signup"
              required
            />
          </div>

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
              data-testid="input-email-signup"
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
              data-testid="input-password-signup"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground outline-none focus:border-primary/50 focus:bg-secondary/70 transition-all"
              data-testid="input-confirm-password-signup"
              required
            />
          </div>

          {/* Signup Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-black font-bold h-12 rounded-xl mt-6 flex items-center justify-center gap-2 transition-all"
            data-testid="button-signup"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Criando conta...
              </>
            ) : (
              <>
                Criar Conta
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
              Já tem conta?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setLocation("/login")}
          className="w-full border border-white/10 hover:border-primary/30 bg-secondary/30 hover:bg-secondary/50 text-white font-bold h-12 rounded-xl transition-all"
          data-testid="button-login-link"
        >
          Voltar para Login
        </motion.button>
      </div>
    </div>
  );
}
