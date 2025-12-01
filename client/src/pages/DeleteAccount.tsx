import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onDeleteSuccess: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  userId,
  onDeleteSuccess,
}: DeleteAccountModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Erro ao deletar conta");
        return;
      }

      onDeleteSuccess();
    } catch (error) {
      setError("Erro ao deletar conta");
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
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-background rounded-2xl border border-white/10 p-6 mx-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display">Deletar Conta</h2>
            <p className="text-xs text-muted-foreground">Ação permanente</p>
          </div>
        </div>

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

        {!isConfirming ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja deletar sua conta? Esta ação é irreversível e todos os seus dados serão
              perdidos permanentemente.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
                data-testid="button-cancel-delete"
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-red-500 text-white hover:bg-red-600"
                onClick={() => setIsConfirming(true)}
                data-testid="button-confirm-delete"
              >
                Deletar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-white">Tem certeza mesmo? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsConfirming(false)}
                disabled={isLoading}
                data-testid="button-back"
              >
                Voltar
              </Button>
              <Button
                className="flex-1 bg-red-500 text-white hover:bg-red-600"
                onClick={handleDeleteAccount}
                disabled={isLoading}
                data-testid="button-delete-forever"
              >
                {isLoading ? "Deletando..." : "Deletar Para Sempre"}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
