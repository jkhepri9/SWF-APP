import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});

export async function signInToSupabase(role) {
  const roleLabel = role === "coach" ? "Coach" : "Client";
  const displayName = role === "coach" ? "Coach Divine" : "Marcus Reed";
  const email = role === "coach" ? "coach@sunwarriorfitness.app" : "client@sunwarriorfitness.app";

  try {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (!error && data?.user?.id) {
      await supabase.auth.updateUser({
        data: {
          role,
          role_label: roleLabel,
          display_name: displayName
        }
      });

      return {
        id: data.user.id,
        name: displayName,
        email,
        role,
        clientId: role === "client" ? "client-1" : undefined,
        supabaseUserId: data.user.id
      };
    }
  } catch (error) {
    console.warn("Supabase sign-in unavailable, falling back to local session", error);
  }

  return {
    id: `${role}-local-session`,
    name: displayName,
    email,
    role,
    clientId: role === "client" ? "client-1" : undefined,
    supabaseUserId: null
  };
}
