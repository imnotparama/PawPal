import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Pet } from "@/types";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("pawpal_cache_pets");
        return cached ? JSON.parse(cached) : [];
      }
    } catch (e) {
      console.error("Error loading pets cache:", e);
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        return !localStorage.getItem("pawpal_cache_pets");
      }
    } catch (e) {}
    return true;
  });
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchPets = async () => {
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data, error } = await supabase.from("pets").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      const freshData = data ?? [];
      setPets(freshData);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("pawpal_cache_pets", JSON.stringify(freshData));
        }
      } catch (e) {}
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch pets");
      console.error("Error fetching pets:", err);
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (values: { name: string; species: string; breed: string; age_years: number; weight_kg?: number; photo?: File }) => {
    setAdding(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      let photo_url = null;
      if (values.photo) {
        const rawExt = values.photo.name.split(".").pop() || "";
        const cleanExt = rawExt.replace(/[^a-zA-Z0-9]/g, "");
        const ext = cleanExt || "jpg";
        const path = `pets/${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("pawpal-uploads").upload(path, values.photo);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("pawpal-uploads").getPublicUrl(path);
        photo_url = urlData.publicUrl;
      }
      
      const { error } = await supabase.from("pets").insert({ 
        user_id: user.id, 
        name: values.name, 
        species: values.species, 
        breed: values.breed, 
        age_years: values.age_years, 
        weight_kg: values.weight_kg, 
        photo_url 
      });
      if (error) throw error;
      
      await fetchPets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add pet");
      console.error("Error adding pet:", err);
      throw err;
    } finally {
      setAdding(false);
    }
  };

  const deletePet = async (id: string) => {
    setDeleting(true);
    setError(null);
    try {
      const { error } = await supabase.from("pets").delete().eq("id", id);
      if (error) throw error;
      await fetchPets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete pet");
      console.error("Error deleting pet:", err);
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => { fetchPets(); }, []);
  return { pets, loading, error, adding, deleting, addPet, deletePet, refetch: fetchPets };
}
