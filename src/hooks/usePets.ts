import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function usePets() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from("pets").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setPets(data ?? []);
    setLoading(false);
  };

  const addPet = async (values: { name: string; species: string; breed: string; age_years: number; weight_kg?: number; photo?: File }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    let photo_url = null;
    if (values.photo) {
      const ext = values.photo.name.split(".").pop();
      const path = `pets/${user.id}/${Date.now()}.${ext}`;
      await supabase.storage.from("pawpal-uploads").upload(path, values.photo);
      const { data: urlData } = supabase.storage.from("pawpal-uploads").getPublicUrl(path);
      photo_url = urlData.publicUrl;
    }
    await supabase.from("pets").insert({ user_id: user.id, name: values.name, species: values.species, breed: values.breed, age_years: values.age_years, weight_kg: values.weight_kg, photo_url });
    await fetchPets();
  };

  const deletePet = async (id: string) => {
    await supabase.from("pets").delete().eq("id", id);
    await fetchPets();
  };

  useEffect(() => { fetchPets(); }, []);
  return { pets, loading, addPet, deletePet, refetch: fetchPets };
}
