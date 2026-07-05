import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePets } from "@/hooks/usePets";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { useChat } from "@/hooks/useChat";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Camera, Lock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/dashboard/profile/")({
  component: ProfilePage,
});

async function compressImage(file: File): Promise<Blob | File> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.8
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Stats / Hooks
  const { pets } = usePets();
  const { records } = useMedicalRecords();
  const { messages } = useChat();

  // Form states
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Preference states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = "My Profile — PawPal AI";
    }
    async function loadUser() {
      setUserLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setFullName(user.user_metadata?.full_name || "");
          setDisplayName(user.user_metadata?.display_name || "");
          setAvatarUrl(user.user_metadata?.avatar_url || null);
          
          const prefs = user.user_metadata?.preferences || {};
          setEmailNotifications(prefs.emailNotifications !== false);
          setHealthAlerts(prefs.healthAlerts !== false);
          setWeeklySummary(prefs.weeklySummary === true);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setUserLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const compressedBlob = await compressImage(file);
      const path = `avatars/${user.id}/avatar.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("pawpal-uploads")
        .upload(path, compressedBlob, {
          upsert: true,
          contentType: "image/jpeg"
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("pawpal-uploads").getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      // Update auth user metadata with avatar_url
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatarUrl: publicUrl, avatar_url: publicUrl }
      });
      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success("Profile photo updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          display_name: displayName
        }
      });
      if (error) throw error;
      toast.success("Profile updated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update profile settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePreference = async (key: string, value: boolean) => {
    if (!user) return;

    let newPrefs = {
      emailNotifications,
      healthAlerts,
      weeklySummary,
      [key]: value
    };

    if (key === "emailNotifications") setEmailNotifications(value);
    if (key === "healthAlerts") setHealthAlerts(value);
    if (key === "weeklySummary") setWeeklySummary(value);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { preferences: newPrefs }
      });
      if (error) throw error;
      toast.success("Preferences updated!");
    } catch (err) {
      toast.error("Failed to save preference setting");
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (error) throw error;
      toast.success("Reset email sent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset email");
    }
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requires administrator approval. Please contact support@pawpal.ai.");
  };

  if (userLoading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000000" }}>
        <div className="w-8 h-8 rounded-full bg-[#8052ff] animate-pulse" />
      </div>
    );
  }

  if (!user) return null;

  const email = user.email ?? "";
  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const userChatCount = messages.filter((m) => m.role === "user").length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 48px", background: "#000000", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 4, fontFamily: "'Space Grotesk', sans-serif" }}>My Profile</h1>
        <p style={{ fontSize: 15, color: "#9a9a9a", fontFamily: "'Space Grotesk', sans-serif" }}>Manage your account and preferences</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
        
        {/* LEFT COLUMN — IDENTITY CARD */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ width: 400, flexShrink: 0 }}
        >
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 32,
            textAlign: "center"
          }}>
            {/* Avatar container */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              <div style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #8052ff, #5030cc)"
              }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ color: "#ffffff", fontSize: 32, fontWeight: 600 }}>
                    {(fullName || displayName || email || "?")[0].toUpperCase()}
                  </span>
                )}
              </div>

              {/* Camera upload button */}
              <label style={{
                marginTop: -14,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(128,82,255,0.2)",
                border: "1px solid #8052ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#8052ff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(128,82,255,0.2)"; }}
              >
                <Camera size={13} color="#ffffff" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} style={{ display: "none" }} />
              </label>
            </div>

            {/* Name + Email */}
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#ffffff", marginTop: 16, marginBottom: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
              {fullName || displayName || "PawPal User"}
            </h2>
            <p style={{ fontSize: 14, color: "#9a9a9a", marginTop: 4, marginBottom: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
              {email}
            </p>

            {/* Member Since Badge */}
            <div style={{
              display: "inline-block",
              background: "rgba(128,82,255,0.1)",
              border: "1px solid rgba(128,82,255,0.2)",
              color: "#8052ff",
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 12,
              marginTop: 12,
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              Member since {memberSince}
            </div>

            {/* Stats Row */}
            <div style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: 24,
              padding: "0 8px"
            }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 600, color: "#ffffff", fontFamily: "'Space Grotesk', sans-serif" }}>{pets.length}</span>
                <span style={{ fontSize: 11, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2, fontFamily: "'Space Grotesk', sans-serif" }}>Pets</span>
              </div>
              <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 600, color: "#ffffff", fontFamily: "'Space Grotesk', sans-serif" }}>{records.length}</span>
                <span style={{ fontSize: 11, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2, fontFamily: "'Space Grotesk', sans-serif" }}>Records</span>
              </div>
              <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 600, color: "#ffffff", fontFamily: "'Space Grotesk', sans-serif" }}>{userChatCount}</span>
                <span style={{ fontSize: 11, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2, fontFamily: "'Space Grotesk', sans-serif" }}>Chats</span>
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{
              marginTop: 32,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 24
            }}>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "1px solid rgba(255,107,107,0.3)",
                      color: "#ff6b6b",
                      borderRadius: 24,
                      padding: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "'Space Grotesk', sans-serif"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,107,107,0.08)";
                      e.currentTarget.style.borderColor = "#ff6b6b";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "rgba(255,107,107,0.3)";
                    }}
                  >
                    Delete Account
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, fontFamily: "'Space Grotesk', sans-serif" }}>
                  <AlertDialogHeader>
                    <AlertDialogTitle style={{ color: "#ffffff", fontSize: 18, fontWeight: 600 }}>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription style={{ color: "#9a9a9a", fontSize: 14, lineHeight: 1.5 }}>
                      This will permanently delete your account, {pets[0]?.name ? `${pets[0].name}'s profile` : 'all pet profiles'}, all vaccinations, medical records, and chat history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter style={{ marginTop: 16 }}>
                    <AlertDialogCancel style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#ffffff", borderRadius: 24, padding: "8px 16px", cursor: "pointer" }}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      style={{ background: "#ff4444", color: "#ffffff", border: "none", borderRadius: 24, padding: "8px 16px", cursor: "pointer" }}
                    >
                      Yes, delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

          </div>
        </motion.div>

        {/* RIGHT COLUMN — SETTINGS */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, minWidth: 280 }}>
          
          {/* CARD 1 — Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: 28
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Personal Information</h3>
            <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 4, marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>Update your name and display preferences</p>

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: "#9a9a9a", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.03em" }}>Full Name</label>
                <input 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", transition: "all 0.2s" }} 
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.1)"; }} 
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: "#9a9a9a", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.03em" }}>Display Name / Nickname (Optional)</label>
                <input 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", transition: "all 0.2s" }} 
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.1)"; }} 
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: "#8052ff",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 24,
                    padding: "10px 24px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    boxShadow: "0 0 16px rgba(128,82,255,0.35)",
                    transition: "all 0.2s",
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 24px rgba(128,82,255,0.5)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 16px rgba(128,82,255,0.35)"; }}
                >
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* CARD 2 — Account & Security */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: 28
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Account & Security</h3>

            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 12, color: "#9a9a9a", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.03em" }}>Email Address</label>
              <div style={{
                position: "relative",
                display: "flex",
                alignItems: "center"
              }}>
                <input 
                  value={email} 
                  readOnly 
                  style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 40px 12px 16px", color: "#9a9a9a", fontSize: 14, outline: "none", cursor: "not-allowed" }} 
                />
                <Lock size={15} color="#9a9a9a" style={{ position: "absolute", right: 16 }} />
              </div>
              <span style={{ fontSize: 11, color: "#9a9a9a", display: "block", marginTop: 6, fontFamily: "'Space Grotesk', sans-serif" }}>Email cannot be changed</span>
            </div>

            <div style={{ marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.03em" }}>Password Management</h4>
              <button
                onClick={handleResetPassword}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#ffffff",
                  borderRadius: 24,
                  padding: "10px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                }}
              >
                Send Password Reset Email
              </button>
            </div>
          </motion.div>

          {/* CARD 3 — Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: 28
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>Preferences</h3>

            {/* Toggle Items */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Item 1 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#ffffff", display: "block" }}>Email Notifications</span>
                  <span style={{ fontSize: 12, color: "#9a9a9a", marginTop: 2, display: "block" }}>Receive vaccination reminders via email</span>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={(checked) => handleTogglePreference("emailNotifications", checked)} 
                  className="data-[state=checked]:bg-[#8052ff]"
                />
              </div>

              {/* Item 2 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#ffffff", display: "block" }}>AI Health Alerts</span>
                  <span style={{ fontSize: 12, color: "#9a9a9a", marginTop: 2, display: "block" }}>Get notified when AI detects urgent symptoms</span>
                </div>
                <Switch 
                  checked={healthAlerts} 
                  onCheckedChange={(checked) => handleTogglePreference("healthAlerts", checked)} 
                  className="data-[state=checked]:bg-[#8052ff]"
                />
              </div>

              {/* Item 3 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#ffffff", display: "block" }}>Weekly Health Summary</span>
                  <span style={{ fontSize: 12, color: "#9a9a9a", marginTop: 2, display: "block" }}>Receive a weekly digest of your pets' health</span>
                </div>
                <Switch 
                  checked={weeklySummary} 
                  onCheckedChange={(checked) => handleTogglePreference("weeklySummary", checked)} 
                  className="data-[state=checked]:bg-[#8052ff]"
                />
              </div>
            </div>
          </motion.div>

          {/* CARD 4 — My Pets Quick View */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: 28
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>My Pets</h3>
              <Link to="/app/pets" style={{ fontSize: 13, fontWeight: 500, color: "#8052ff", textDecoration: "none" }}>
                Manage →
              </Link>
            </div>

            {pets.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, color: "#9a9a9a" }}>No pets yet.</span>
                <Link to="/app/pets" style={{ fontSize: 13, color: "#8052ff", textDecoration: "none", fontWeight: 500 }}>
                  Add Pet →
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {pets.map((pet) => (
                  <div 
                    key={pet.id}
                    onClick={() => navigate({ to: "/app/pets" })}
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 16,
                      padding: "12px 16px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: 100,
                      textAlign: "center",
                      background: "rgba(0,0,0,0.2)",
                      transition: "all 0.15s ease"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(128,82,255,0.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {pet.photo_url ? (
                        <img src={pet.photo_url} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ color: "#ffffff", fontSize: 18, fontWeight: 600 }}>{pet.name[0]}</span>
                      )}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#ffffff", marginTop: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                      {pet.name}
                    </span>
                    <span style={{ fontSize: 11, color: "#9a9a9a", marginTop: 2 }}>
                      {pet.species}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>

      </div>
    </div>
  );
}
