import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export default function SecurityModal({ isOpen, onClose, userId }: SecurityModalProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Erro ao atualizar senha");
        return;
      }

      setSuccess("Senha atualizada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    } catch (error) {
      setError("Erro ao atualizar senha");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-background rounded-t-3xl border-t border-white/10 max-h-[80vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-background/80 backdrop-blur px-6 pt-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-bold font-display">Segurança</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary"
            data-testid="button-close-security"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
              data-testid="text-error"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm"
              data-testid="text-success"
            >
              {success}
            </motion.div>
          )}

          {!isChangingPassword ? (
            <Button
              className="w-full bg-primary text-black hover:bg-primary/90"
              onClick={() => {
                setIsChangingPassword(true);
                setError("");
                setSuccess("");
              }}
              data-testid="button-change-password"
            >
              <Lock className="w-4 h-4 mr-2" />
              Mudar Senha
            </Button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Senha Atual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="w-full bg-secondary/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted-foreground outline-none focus:border-primary/50"
                  data-testid="input-current-password"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Nova Senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha"
                  className="w-full bg-secondary/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted-foreground outline-none focus:border-primary/50"
                  data-testid="input-new-password"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Confirmar Senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a nova senha"
                  className="w-full bg-secondary/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted-foreground outline-none focus:border-primary/50"
                  data-testid="input-confirm-password"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-primary text-black hover:bg-primary/90"
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  data-testid="button-save-password"
                >
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  disabled={isLoading}
                  data-testid="button-cancel-password"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
