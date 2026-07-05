import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { MedicalRecord } from "@/types";

export function useMedicalRecords(petId?: string) {
  const cacheKey = `pawpal_cache_records_${petId || "all"}`;
  const [records, setRecords] = useState<MedicalRecord[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(cacheKey);
        return cached ? JSON.parse(cached) : [];
      }
    } catch (e) {
      console.error("Error loading records cache:", e);
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        return !localStorage.getItem(cacheKey);
      }
    } catch (e) {}
    return true;
  });
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchRecords = async () => {
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      let query = supabase.from("medical_records").select("*, pets(name, species)").eq("user_id", user.id).order("date", { ascending: false });
      if (petId) query = query.eq("pet_id", petId);
      const { data, error } = await query;
      if (error) throw error;
      const freshData = data ?? [];
      setRecords(freshData);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(cacheKey, JSON.stringify(freshData));
        }
      } catch (e) {}
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch medical records");
      console.error("Error fetching medical records:", err);
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (values: { pet_id: string; title: string; record_type: string; doctor_name?: string; clinic_name?: string; date: string; notes?: string; file?: File }) => {
    setAdding(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      let file_url = null;
      if (values.file) {
        const rawExt = values.file.name.split(".").pop() || "";
        const cleanExt = rawExt.replace(/[^a-zA-Z0-9]/g, "");
        const ext = cleanExt || "pdf";
        const path = `records/${user.id}/${Date.now()}.${ext}`;
        if (path.includes("..") || path.includes("../")) {
          throw new Error("Security check failed: Path traversal detected");
        }
        const { error: uploadError } = await supabase.storage.from("pawpal-uploads").upload(path, values.file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("pawpal-uploads").getPublicUrl(path);
        file_url = urlData.publicUrl;
      }
      
      const { error } = await supabase.from("medical_records").insert({ 
        user_id: user.id, 
        pet_id: values.pet_id, 
        title: values.title, 
        record_type: values.record_type, 
        doctor_name: values.doctor_name, 
        clinic_name: values.clinic_name, 
        date: values.date, 
        notes: values.notes, 
        file_url 
      });
      if (error) throw error;
      
      await fetchRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add medical record");
      console.error("Error adding medical record:", err);
      throw err;
    } finally {
      setAdding(false);
    }
  };

  const deleteRecord = async (id: string) => {
    setDeleting(true);
    setError(null);
    try {
      const { error } = await supabase.from("medical_records").delete().eq("id", id);
      if (error) throw error;
      await fetchRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete medical record");
      console.error("Error deleting medical record:", err);
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => { fetchRecords(); }, [petId]);
  return { records, loading, error, adding, deleting, addRecord, deleteRecord, refetch: fetchRecords };
}
