"use client";

import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";

async function fetchUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export function useUser() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: fetchUser,
    enabled: isSupabaseConfigured(),
  });
}
