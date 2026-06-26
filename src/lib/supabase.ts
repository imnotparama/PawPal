import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mebjkayywnjcttzmpexm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lYmprYXl5d25qY3R0em1wZXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NTk4NDUsImV4cCI6MjA5ODAzNTg0NX0.OfgBCZLD6BS49M5WjTrE7Jh01dqKAid1S82H8RtzA08";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
