import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

 const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    // Placeholder client: all requests will fail gracefully.
    // Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable.
    supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export { isSupabaseConfigured, supabase };
