import React, { useState, useEffect } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Edit2, LogOut, Bell, Lock, Trash2, Phone, Mail, MapPin, User as UserIcon, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import NotificationsModal from "./Notifications";
import SecurityModal from "./Security";
import DeleteAccountModal from "./DeleteAccount";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [editFormData, setEditFormData] = useState(() => ({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    avatar: user?.avatar || null,
  }));

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    } else {
      setEditFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        avatar: user.avatar || null,
      });
    }
  }, [user, setLocation]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const updateData: any = {
        name: editFormData.name,
        phone: editFormData.phone,
      };

      // Only include avatar if it changed (not null/undefined and not the default)
      if (editFormData.avatar && editFormData.avatar !== user?.avatar) {
        updateData.avatar = editFormData.avatar;
      }

      await updateUser(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  if (!user) {
    return (
      <MobileShell>
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MobileShell>
    );
  }

  const menuItems = [
    { icon: Bell, label: "Notificações", action: () => setShowNotifications(true) },
    { icon: Lock, label: "Segurança", action: () => setShowSecurity(true) },
    { icon: Trash2, label: "Deletar Conta", action: () => setShowDeleteAccount(true), destructive: true },
  ];

  return (
    <MobileShell>
      <div className="space-y-6 pb-32">
        {/* Header */}
        <div className="px-6 pt-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold font-display" data-testid="text-page-title">Perfil</h1>
          <Link href="/">
            <div className="w-10 h-10 rounded-full bg-secondary/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-secondary cursor-pointer border border-white/10" data-testid="button-back">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-card to-card/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Background Gradient */}
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

            {/* Profile Content */}
            <div className="px-6 pb-6 -mt-12 relative z-10">
              {/* Avatar */}
              <div className="flex items-end gap-4 mb-6 relative">
                <div className="relative">
                  <img
                    src={isEditing ? (editFormData.avatar || `https://i.pravatar.cc/150?u=${user.id}`) : (user.avatar || `https://i.pravatar.cc/150?u=${user.id}`)}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-card/80 backdrop-blur-md object-cover shadow-lg"
                    data-testid="avatar-profile"
                  />
                  {isEditing && (
                    <label className="absolute inset-0 rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setEditFormData({ ...editFormData, avatar: event.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        data-testid="input-avatar-file"
                      />
                      <Edit2 className="w-6 h-6 text-white" />
                    </label>
                  )}
                </div>
                {!isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/50 mb-1"
                    data-testid="button-edit-profile"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                )}
              </div>

              {isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Nome</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full bg-secondary/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted-foreground outline-none focus:border-primary/50"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      disabled
                      className="w-full bg-secondary/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-muted-foreground placeholder-muted-foreground outline-none"
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Telefone</label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full bg-secondary/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-muted-foreground outline-none focus:border-primary/50"
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-primary text-black hover:bg-primary/90"
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      data-testid="button-save"
                    >
                      {isLoading ? "Salvando..." : "Salvar Mudanças"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsEditing(false);
                        if (user) {
                          setEditFormData({
                            name: user.name || "",
                            phone: user.phone || "",
                            email: user.email || "",
                            avatar: user.avatar || null,
                          });
                        }
                      }}
                      disabled={isLoading}
                      data-testid="button-cancel"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold font-display" data-testid="text-user-name">{user.name}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Membro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "---"}</p>
                  </div>

                  <div className="space-y-2 bg-secondary/30 rounded-xl p-3.5 border border-white/5">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground" data-testid="text-email">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground" data-testid="text-phone">{user.phone || "---"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        {!isEditing && (
          <div className="px-6 grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-white/10 rounded-2xl p-4 text-center"
            >
              <p className="text-2xl font-bold font-display text-primary" data-testid="text-appointments">0</p>
              <p className="text-xs text-muted-foreground mt-1">Total de Agendamentos</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-white/10 rounded-2xl p-4 text-center"
            >
              <p className="text-2xl font-bold font-display text-primary" data-testid="text-spent">R$ 0</p>
              <p className="text-xs text-muted-foreground mt-1">Total Gasto</p>
            </motion.div>
          </div>
        )}

        {/* Menu Items */}
        {!isEditing && (
          <div className="px-6 space-y-2">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  onClick={item.action}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl border transition-all",
                    item.destructive
                      ? "bg-red-500/10 border-red-500/20 hover:border-red-500/50 text-red-400"
                      : "bg-card border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground"
                  )}
                  data-testid={`button-menu-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium flex-1 text-left text-sm">{item.label}</span>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Logout Button */}
        {!isEditing && (
          <div className="px-6">
            <Button
              variant="outline"
              className="w-full text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/50"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        userId={user?.id}
      />
      <SecurityModal
        isOpen={showSecurity}
        onClose={() => setShowSecurity(false)}
        userId={user?.id}
      />
      <DeleteAccountModal
        isOpen={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        userId={user?.id}
        onDeleteSuccess={() => {
          logout();
          setLocation("/login");
        }}
      />
    </MobileShell>
  );
}
