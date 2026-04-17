import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  updatedAt: string | null;
};

export type LiveServers = { normal: LiveServer; hardcore: LiveServer };

export const useLiveServers = () =>
  useQuery({
    queryKey: ["live-servers"],
    queryFn: async (): Promise<LiveServers> => {
      const { data, error } = await supabase.functions.invoke("server-status");
      if (error) throw error;
      return data as LiveServers;
    },
    refetchInterval: 30000,
    staleTime: 20000,
  });
