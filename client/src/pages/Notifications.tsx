import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Notification } from "@shared/schema";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export default function NotificationsModal({ isOpen, onClose, userId }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchNotifications();
    }
  }, [isOpen, userId]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
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
          <h2 className="text-2xl font-bold font-display">Notificações</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary"
            data-testid="button-close-notifications"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-primary/50 mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  notification.isRead
                    ? "bg-card border-white/5"
                    : "bg-primary/10 border-primary/30"
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
                data-testid={`notification-${notification.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">{notification.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground/50 mt-2">
                      {new Date(notification.createdAt!).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
