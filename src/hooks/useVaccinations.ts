import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Vaccination } from "@/types";

export function useVaccinations(petId?: string) {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchVaccinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      let query = supabase.from("vaccinations").select("*, pets(name, species)").eq("user_id", user.id).order("date", { ascending: false });
      if (petId) query = query.eq("pet_id", petId);
      const { data, error } = await query;
      if (error) throw error;
      setVaccinations(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch vaccinations");
      console.error("Error fetching vaccinations:", err);
    } finally {
      setLoading(false);
    }
  };

  const addVaccination = async (values: { pet_id: string; vaccine_name: string; date: string; notes?: string }) => {
    setAdding(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase.from("vaccinations").insert({ 
        user_id: user.id, 
        ...values, 
        status: "Upcoming" 
      });
      if (error) throw error;
      
      await fetchVaccinations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add vaccination");
      console.error("Error adding vaccination:", err);
      throw err;
    } finally {
      setAdding(false);
    }
  };

  const markComplete = async (id: string) => {
    setUpdating(true);
    setError(null);
    try {
      const { error } = await supabase.from("vaccinations").update({ status: "Completed" }).eq("id", id);
      if (error) throw error;
      await fetchVaccinations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update vaccination");
      console.error("Error updating vaccination:", err);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => { fetchVaccinations(); }, [petId]);
  return { vaccinations, loading, error, adding, updating, addVaccination, markComplete, refetch: fetchVaccinations };
}
