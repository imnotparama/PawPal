import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useVaccinations(petId?: string) {
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVaccinations = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    let query = supabase.from("vaccinations").select("*, pets(name, species)").eq("user_id", user.id).order("date", { ascending: false });
    if (petId) query = query.eq("pet_id", petId);
    const { data } = await query;
    setVaccinations(data ?? []);
    setLoading(false);
  };

  const addVaccination = async (values: { pet_id: string; vaccine_name: string; date: string; notes?: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("vaccinations").insert({ user_id: user.id, ...values, status: "Upcoming" });
    await fetchVaccinations();
  };

  const markComplete = async (id: string) => {
    await supabase.from("vaccinations").update({ status: "Completed" }).eq("id", id);
    await fetchVaccinations();
  };

  useEffect(() => { fetchVaccinations(); }, [petId]);
  return { vaccinations, loading, addVaccination, markComplete, refetch: fetchVaccinations };
}
