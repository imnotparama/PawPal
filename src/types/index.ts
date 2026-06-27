export interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: "Dog" | "Cat";
  breed: string;
  age_years: number;
  weight_kg?: number;
  photo_url?: string;
  created_at: string;
}

export interface Vaccination {
  id: string;
  user_id: string;
  pet_id: string;
  vaccine_name: string;
  date: string;
  notes?: string;
  status: "Upcoming" | "Completed" | "Overdue";
  created_at: string;
  pets?: Pet;
}

export interface MedicalRecord {
  id: string;
  user_id: string;
  pet_id: string;
  title: string;
  record_type: "Checkup" | "Surgery" | "Treatment" | "Consultation" | "Wellness";
  doctor_name?: string;
  clinic_name?: string;
  date: string;
  notes?: string;
  file_url?: string;
  created_at: string;
  pets?: Pet;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  pet_id?: string | null;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  event_type: string;
  title: string;
  date: string;
  notes?: string;
  pet?: string;
  created_at: string;
}
