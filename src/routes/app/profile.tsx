import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { CometCard } from "@/components/ui/comet-card";

export const Route = createFileRoute("/app/profile")({
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

function ProfilePage() {
  const { user } = useAuth();
  
  // Local state initialized from user user_metadata
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "");
  const [locationStr, setLocationStr] = useState(user?.user_metadata?.location || "");
  const [favPetType, setFavPetType] = useState(user?.user_metadata?.favorite_pet_type || "Dog");
  const [careGoal, setCareGoal] = useState(user?.user_metadata?.care_goal || "Wellness & Vitality");
  
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressedBlob = await compressImage(file);
      const fileExt = "jpg";
      const path = `avatars/${user.id}/${Date.now()}.${fileExt}`;

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
        data: { avatar_url: publicUrl }
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
    if (!displayName.trim()) {
      toast.error("Username/Display name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          phone: phone,
          location: locationStr,
          favorite_pet_type: favPetType,
          care_goal: careGoal
        }
      });
      if (error) throw error;
      toast.success("Profile settings updated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update profile details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 300, color: "#ffffff", marginBottom: 4 }}>My Profile</h1>
        <p style={{ fontSize: 15, color: "#9a9a9a" }}>Manage your account settings, profile photo, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr] gap-8">
        
        {/* Left Column - Card Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <CometCard>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px", textAlign: "center" }}>
              
              {/* Avatar upload ring */}
              <div style={{ position: "relative", marginBottom: 20 }}>
                <div style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  border: "2px solid rgba(128,82,255,0.4)",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.3)"
                }}>
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #8052ff, #5030cc)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 48,
                      fontWeight: 700,
                      color: "#ffffff"
                    }}>
                      {(displayName || user.email || "?")[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Upload overlay */}
                <label style={{
                  position: "absolute",
                  inset: 4,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.75)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: uploading ? 1 : 0,
                  cursor: "pointer",
                  transition: "opacity 0.2s ease"
                }}
                className="hover:opacity-100"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span style={{ fontSize: 10, color: "#fff", marginTop: 4 }}>{uploading ? "Uploading..." : "Upload Photo"}</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} style={{ display: "none" }} />
                </label>
              </div>

              {/* User text info */}
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#ffffff", margin: 0 }}>{displayName || "PawPal User"}</h2>
              <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 4, marginBottom: 16 }}>{user.email}</p>
              
              <div style={{ display: "inline-block", background: "rgba(128,82,255,0.12)", color: "#8052ff", border: "1px solid rgba(128,82,255,0.2)", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Official Member
              </div>

              {/* Horizontal divider */}
              <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.06)", margin: "24px 0" }} />

              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, textAlign: "left", fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9a9a9a" }}>Joined on</span>
                  <span style={{ color: "#ffffff", fontWeight: 500 }}>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9a9a9a" }}>Status</span>
                  <span style={{ color: "#15846e", fontWeight: 600 }}>Active</span>
                </div>
              </div>

            </div>
          </CometCard>
        </div>

        {/* Right Column - Edit Form */}
        <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 500, color: "#ffffff", marginBottom: 24 }}>Account Details</h3>
          
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Display Name */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>DISPLAY NAME / USERNAME</label>
              <input 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                placeholder="Name" 
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", transition: "all 0.2s" }} 
                onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.12)"; }} 
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>PHONE NUMBER</label>
              <input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="e.g. +1 555 123 4567" 
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", transition: "all 0.2s" }} 
                onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.12)"; }} 
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {/* Location */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>LOCATION</label>
              <input 
                value={locationStr} 
                onChange={(e) => setLocationStr(e.target.value)} 
                placeholder="City, Country" 
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", transition: "all 0.2s" }} 
                onFocus={(e) => { e.currentTarget.style.borderColor = "#8052ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(128,82,255,0.12)"; }} 
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

            <h4 style={{ fontSize: 14, fontWeight: 600, color: "#ffffff", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>Pet Companion Preferences</h4>

            {/* Favorite Pet Type */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>PRIMARY PET COMPANION TYPE</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Dog", "Cat", "Both"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFavPetType(type)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: "pointer",
                      background: favPetType === type ? "rgba(128,82,255,0.15)" : "rgba(255,255,255,0.04)",
                      border: favPetType === type ? "1px solid #8052ff" : "1px solid rgba(255,255,255,0.08)",
                      color: favPetType === type ? "#ffffff" : "#9a9a9a",
                      transition: "all 0.2s"
                    }}
                  >
                    {type === "Dog" ? "🐶 Dog" : type === "Cat" ? "🐱 Cat" : "🐾 Both"}
                  </button>
                ))}
              </div>
            </div>

            {/* Pet Care Goal */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#9a9a9a", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>HEALTH AND CARE FOCUS</label>
              <select 
                value={careGoal} 
                onChange={(e) => setCareGoal(e.target.value)} 
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }}
              >
                <option value="Wellness & Vitality">Wellness & Vitality</option>
                <option value="Active Immunity & Vaccinations">Active Immunity & Vaccinations</option>
                <option value="Diet & Weight Management">Diet & Weight Management</option>
                <option value="Geriatric / Senior Care Support">Geriatric / Senior Care Support</option>
              </select>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "#8052ff",
                color: "#ffffff",
                border: "none",
                borderRadius: 24,
                padding: "14px 28px",
                fontSize: 13,
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                marginTop: 12,
                opacity: saving ? 0.7 : 1,
                alignSelf: "flex-start",
                textTransform: "uppercase",
                letterSpacing: "0.04em"
              }}
            >
              {saving ? "Saving Changes..." : "Save Settings"}
            </motion.button>
          </form>
        </div>

      </div>
    </div>
  );
}
