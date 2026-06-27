import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useMedicalRecords(petId?: string) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    let query = supabase.from("medical_records").select("*, pets(name, species)").eq("user_id", user.id).order("date", { ascending: false });
    if (petId) query = query.eq("pet_id", petId);
    const { data } = await query;
    setRecords(data ?? []);
    setLoading(false);
  };

  const addRecord = async (values: { pet_id: string; title: string; record_type: string; doctor_name?: string; clinic_name?: string; date: string; notes?: string; file?: File }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    let file_url = null;
    if (values.file) {
      const ext = values.file.name.split(".").pop();
      const path = `records/${user.id}/${Date.now()}.${ext}`;
      await supabase.storage.from("pawpal-uploads").upload(path, values.file);
      const { data: urlData } = supabase.storage.from("pawpal-uploads").getPublicUrl(path);
      file_url = urlData.publicUrl;
    }
    await supabase.from("medical_records").insert({ user_id: user.id, pet_id: values.pet_id, title: values.title, record_type: values.record_type, doctor_name: values.doctor_name, clinic_name: values.clinic_name, date: values.date, notes: values.notes, file_url });
    await fetchRecords();
  };

  const deleteRecord = async (id: string) => {
    await supabase.from("medical_records").delete().eq("id", id);
    await fetchRecords();
  };

  useEffect(() => { fetchRecords(); }, [petId]);
  return { records, loading, addRecord, deleteRecord, refetch: fetchRecords };
}
