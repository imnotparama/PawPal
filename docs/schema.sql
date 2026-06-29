-- Create pets table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age_years INT NOT NULL,
  weight_kg DECIMAL,
  photo_url TEXT,
  health_status TEXT DEFAULT 'Healthy',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create vaccinations table
CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create medical_records table
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  record_type TEXT NOT NULL,
  doctor_name TEXT,
  clinic_name TEXT,
  date DATE NOT NULL,
  notes TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "own pets" ON pets 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "own vaccinations" ON vaccinations 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "own records" ON medical_records 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "own messages" ON chat_messages 
  FOR ALL USING (auth.uid() = user_id);

-- Create unified health_timeline view
CREATE OR REPLACE VIEW health_timeline AS
  SELECT 
    id,
    user_id,
    pet_id,
    vaccine_name AS title,
    'Vaccination' AS record_type,
    NULL AS doctor_name,
    NULL AS clinic_name,
    date,
    notes,
    NULL AS file_url,
    created_at
  FROM vaccinations
  UNION ALL
  SELECT 
    id,
    user_id,
    pet_id,
    title,
    record_type,
    doctor_name,
    clinic_name,
    date,
    notes,
    file_url,
    created_at
  FROM medical_records;
