import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LiveMod = { modId: string; name: string; version: string };

export type LiveServer = {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  status: string;
  online: boolean;
  ip: string;
  port: number | null;
  address: string;
  map: string;
  version: string;
  modded: boolean;
  rank: number | null;
  country: string | null;
  battleEye: boolean;
  password: boolean;
  platforms: string[];
  mods: LiveMod[];
  modCount: number;
  updatedAt: string | null;
};

export type LiveServers = { normal: LiveServer; hardcore: LiveServer; fetchedAt: string };

export const REFETCH_MS = 60_000;

export const useLiveServers = () =>
  useQuery({
    queryKey: ["live-servers"],
    queryFn: async (): Promise<LiveServers> => {
      const { data, error } = await supabase.functions.invoke("server-status");
      if (error) throw error;
      return data as LiveServers;
    },
    refetchInterval: REFETCH_MS,
    refetchIntervalInBackground: true,
    staleTime: 45_000,
  });
