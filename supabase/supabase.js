import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { SUPABASE_URL, SUPABASE_KEY } from "@env";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
