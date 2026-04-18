import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";

export interface RadioTrack {
  id: string;
  title: string;
  videoId: string;
}

export const RADIO_TRACKS: RadioTrack[] = [
  { id: "casa", title: "Casa", videoId: "NDK9V2D8Gzo" },
  { id: "familia-virtual", title: "Familia Virtual", videoId: "n87h53-blzg" },
  { id: "fuego-virtual", title: "Fuego Virtual", videoId: "XlwQzsROF3A" },
  { id: "modo-hardcore", title: "Modo Hardcore", videoId: "ZOqm_5AlXl4" },
  { id: "antiaereo", title: "Al Antiaéreo le rezo", videoId: "KtL30Cxi6RI" },
  { id: "entras-historia", title: "Entras a la historia", videoId: "qS64u9ysur8" },
  { id: "fuego-zona", title: "Fuego en la zona", videoId: "iBp5JZoEQJc" },
  { id: "siempre-pie", title: "Siempre en pie", videoId: "Jquk7bVGrCY" },
  { id: "rumba-accion", title: "Rumba y acción", videoId: "MmWbWILZMqI" },
  { id: "campo-gitano", title: "Mi campo Gitano", videoId: "8280pvw72C0" },
];

const BG_VOLUME = 8;   // Volumen muy bajo de fondo
const USER_VOLUME = 70; // Volumen cuando el user lo controla

interface RadioContextValue {
  tracks: RadioTrack[];
  currentTrack: RadioTrack | null;
  isUserControlled: boolean;
  isPlaying: boolean;
  isReady: boolean;
  playTrack: (track: RadioTrack) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  releaseToBackground: () => void;
}

const RadioContext = createContext<RadioContextValue | null>(null);

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

let ytApiPromise: Promise<void> | null = null;
const loadYouTubeAPI = () => {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise<void>((resolve) => {
    if (typeof window === "undefined") return;
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
  });
  return ytApiPromise;
};

const pickRandomTrack = (exclude?: string): RadioTrack => {
  const pool = exclude ? RADIO_TRACKS.filter((t) => t.id !== exclude) : RADIO_TRACKS;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const RadioProvider = ({ children }: { children: ReactNode }) => {
  const playerRef = useRef<any>(null);
  const containerId = "warborn-radio-yt-player";
  const [currentTrack, setCurrentTrack] = useState<RadioTrack | null>(null);
  const [isUserControlled, setIsUserControlled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const userControlledRef = useRef(false);
  const startedRef = useRef(false);

  // Inicializar YT player
  useEffect(() => {
    let cancelled = false;
    loadYouTubeAPI().then(() => {
      if (cancelled) return;
      const initial = pickRandomTrack();
      setCurrentTrack(initial);
      playerRef.current = new window.YT.Player(containerId, {
        height: "0",
        width: "0",
        videoId: initial.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (e: any) => {
            setIsReady(true);
            e.target.setVolume(BG_VOLUME);
            try {
              e.target.playVideo();
            } catch {}
          },
          onStateChange: (e: any) => {
            const YT = window.YT;
            if (e.data === YT.PlayerState.ENDED) {
              const next = pickRandomTrack(currentTrackIdRef.current);
              currentTrackIdRef.current = next.id;
              setCurrentTrack(next);
              try {
                e.target.loadVideoById(next.videoId);
                e.target.setVolume(userControlledRef.current ? USER_VOLUME : BG_VOLUME);
              } catch {}
            }
            if (e.data === YT.PlayerState.PLAYING) setIsPlaying(true);
            if (e.data === YT.PlayerState.PAUSED) setIsPlaying(false);
          },
        },
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track id ref (para usar dentro del callback de YT que no re-renderiza)
  const currentTrackIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    currentTrackIdRef.current = currentTrack?.id;
  }, [currentTrack]);

  // Intentar arrancar reproducción tras la primera interacción del usuario
  // (los navegadores bloquean autoplay con sonido)
  useEffect(() => {
    const tryStart = () => {
      if (startedRef.current) return;
      const p = playerRef.current;
      if (p && typeof p.playVideo === "function") {
        try {
          p.setVolume(BG_VOLUME);
          p.unMute?.();
          p.playVideo();
          startedRef.current = true;
        } catch {}
      }
    };
    const events = ["click", "keydown", "touchstart", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, tryStart, { once: false, passive: true }));
    return () => events.forEach((ev) => window.removeEventListener(ev, tryStart));
  }, []);

  const playTrack = useCallback((track: RadioTrack) => {
    const p = playerRef.current;
    if (!p) return;
    userControlledRef.current = true;
    setIsUserControlled(true);
    setCurrentTrack(track);
    currentTrackIdRef.current = track.id;
    try {
      p.loadVideoById(track.videoId);
      p.setVolume(USER_VOLUME);
      p.unMute?.();
      p.playVideo();
      startedRef.current = true;
    } catch {}
  }, []);

  const togglePlayPause = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      const state = p.getPlayerState?.();
      if (state === window.YT?.PlayerState?.PLAYING) {
        p.pauseVideo();
      } else {
        p.playVideo();
      }
    } catch {}
  }, []);

  const nextTrack = useCallback(() => {
    const next = pickRandomTrack(currentTrackIdRef.current);
    playTrack(next);
  }, [playTrack]);

  const releaseToBackground = useCallback(() => {
    const p = playerRef.current;
    userControlledRef.current = false;
    setIsUserControlled(false);
    if (p) {
      try {
        p.setVolume(BG_VOLUME);
      } catch {}
    }
  }, []);

  return (
    <RadioContext.Provider
      value={{
        tracks: RADIO_TRACKS,
        currentTrack,
        isUserControlled,
        isPlaying,
        isReady,
        playTrack,
        togglePlayPause,
        nextTrack,
        releaseToBackground,
      }}
    >
      {/* Contenedor oculto del iframe de YouTube */}
      <div
        style={{
          position: "fixed",
          left: -9999,
          top: -9999,
          width: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <div id={containerId} />
      </div>
      {children}
    </RadioContext.Provider>
  );
};

export const useRadio = () => {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio must be used within RadioProvider");
  return ctx;
};
