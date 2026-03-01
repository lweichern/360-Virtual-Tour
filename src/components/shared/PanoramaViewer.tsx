"use client";

import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from "react";

export interface Hotspot {
  id: string;
  pitch: number;
  yaw: number;
  title: string;
  description: string;
  type: "info" | "scene";
  targetSceneId?: string;
}

export interface Scene {
  id: string;
  name: string;
  imageUrl: string;
  hotspots: Hotspot[];
}

export interface PanoramaViewerHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  toggleAutoRotate: () => void;
  toggleFullscreen: () => void;
  getHfov: () => number;
  setHfov: (hfov: number) => void;
  isAutoRotating: () => boolean;
  lookAt: (pitch: number, yaw: number) => void;
}

interface PanoramaViewerProps {
  scenes: Scene[];
  activeSceneId: string;
  autoRotate?: boolean;
  hfov?: number;
  onLoad?: () => void;
  onSceneClick?: (pitch: number, yaw: number) => void;
  onSceneChange?: (sceneId: string) => void;
  className?: string;
}

declare global {
  interface Window {
    pannellum: {
      viewer: (
        container: string | HTMLElement,
        config: Record<string, unknown>
      ) => PannellumViewer;
    };
  }
}

interface PannellumViewer {
  getHfov: () => number;
  setHfov: (hfov: number) => void;
  getPitch: () => number;
  getYaw: () => number;
  setPitch: (pitch: number) => void;
  setYaw: (yaw: number) => void;
  startAutoRotate: (speed?: number) => void;
  stopAutoRotate: () => void;
  isLoaded: () => boolean;
  toggleFullscreen: () => void;
  destroy: () => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  getScene: () => string;
  loadScene: (sceneId: string) => void;
  mouseEventToCoords: (event: MouseEvent) => [number, number];
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement | null;
    if (existing) {
      // Script tag exists — but it may still be loading.
      // If pannellum is already on window, resolve immediately.
      if (window.pannellum) {
        resolve();
        return;
      }
      // Otherwise wait for it to finish loading.
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadCSS(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// Keep strong references so the browser never evicts them from cache
const preloadedImages: HTMLImageElement[] = [];

function preloadImages(urls: string[]): void {
  for (const url of urls) {
    if (preloadedImages.some((img) => img.src === url)) continue;
    const img = new Image();
    img.src = url;
    preloadedImages.push(img);
  }
}

const PanoramaViewer = forwardRef<PanoramaViewerHandle, PanoramaViewerProps>(
  (
    {
      scenes,
      activeSceneId,
      autoRotate = false,
      hfov = 100,
      onLoad,
      onSceneClick,
      onSceneChange,
      className,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<PannellumViewer | null>(null);
    const [loading, setLoading] = useState(true);
    const [autoRotating, setAutoRotating] = useState(autoRotate);
    const onSceneClickRef = useRef(onSceneClick);
    onSceneClickRef.current = onSceneClick;
    const onSceneChangeRef = useRef(onSceneChange);
    onSceneChangeRef.current = onSceneChange;

    // Preload all scene images so transitions are instant
    useEffect(() => {
      if (scenes.length > 0) {
        preloadImages(scenes.map((s) => s.imageUrl));
      }
    }, [scenes]);

    const buildConfig = useCallback(() => {
      if (scenes.length === 0) return null;

      // Build Pannellum tour config with multiple scenes
      const scenesConfig: Record<string, Record<string, unknown>> = {};

      for (const scene of scenes) {
        const hotSpots = scene.hotspots.map((hs) => {
          if (hs.type === "scene" && hs.targetSceneId) {
            const targetScene = scenes.find(
              (s) => s.id === hs.targetSceneId
            );
            return {
              id: hs.id,
              pitch: hs.pitch,
              yaw: hs.yaw,
              type: "scene",
              text: targetScene?.name || hs.title,
              sceneId: hs.targetSceneId,
            };
          }
          return {
            id: hs.id,
            pitch: hs.pitch,
            yaw: hs.yaw,
            type: "info",
            text: hs.description
              ? `${hs.title} — ${hs.description}`
              : hs.title,
          };
        });

        scenesConfig[scene.id] = {
          type: "equirectangular",
          panorama: scene.imageUrl,
          autoLoad: true,
          preload: true,
          hotSpots,
        };
      }

      return {
        default: {
          firstScene: activeSceneId,
          autoLoad: true,
          autoRotate: autoRotate ? -2 : 0,
          hfov,
          showControls: false,
          mouseZoom: true,
          keyboardZoom: true,
          draggable: true,
          disableKeyboardCtrl: false,
          showFullscreenCtrl: false,
          showZoomCtrl: false,
          compass: false,
          sceneFadeDuration: 1000,
        },
        scenes: scenesConfig,
      };
    }, [scenes, activeSceneId, autoRotate, hfov]);

    const initViewer = useCallback(async () => {
      if (!containerRef.current || scenes.length === 0) return;

      loadCSS(
        "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
      );

      if (!window.pannellum) return;

      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }

      setLoading(true);

      const config = buildConfig();
      if (!config) return;

      viewerRef.current = window.pannellum.viewer(containerRef.current, config);

      viewerRef.current.on("load", () => {
        setLoading(false);
        onLoad?.();
      });

      viewerRef.current.on("scenechange", (sceneId: unknown) => {
        onSceneChangeRef.current?.(sceneId as string);
      });

      // Listen for clicks on the scene for hotspot placement
      viewerRef.current.on("mouseup", (event: unknown) => {
        if (!onSceneClickRef.current || !viewerRef.current) return;
        try {
          const coords = viewerRef.current.mouseEventToCoords(
            event as MouseEvent
          );
          onSceneClickRef.current(coords[0], coords[1]);
        } catch {
          // mouseEventToCoords can fail if click is on a hotspot element
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buildConfig, onLoad]);

    // Rebuild viewer only when scenes data actually changes
    const configKey = JSON.stringify(
      scenes.map((s) => ({ id: s.id, url: s.imageUrl, hs: s.hotspots }))
    );

    useEffect(() => {
      initViewer();

      return () => {
        if (viewerRef.current) {
          viewerRef.current.destroy();
          viewerRef.current = null;
        }
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [configKey]);

    // Switch scenes without destroying/recreating the viewer
    useEffect(() => {
      if (!viewerRef.current) return;
      try {
        const currentScene = viewerRef.current.getScene();
        if (currentScene !== activeSceneId) {
          viewerRef.current.loadScene(activeSceneId);
        }
      } catch {
        // Viewer may not be ready yet — initViewer will handle it
      }
    }, [activeSceneId]);

    useImperativeHandle(ref, () => ({
      zoomIn: () => {
        if (!viewerRef.current) return;
        const current = viewerRef.current.getHfov();
        viewerRef.current.setHfov(Math.max(30, current - 10));
      },
      zoomOut: () => {
        if (!viewerRef.current) return;
        const current = viewerRef.current.getHfov();
        viewerRef.current.setHfov(Math.min(120, current + 10));
      },
      resetView: () => {
        if (!viewerRef.current) return;
        viewerRef.current.setPitch(0);
        viewerRef.current.setYaw(0);
        viewerRef.current.setHfov(100);
      },
      toggleAutoRotate: () => {
        if (!viewerRef.current) return;
        if (autoRotating) {
          viewerRef.current.stopAutoRotate();
          setAutoRotating(false);
        } else {
          viewerRef.current.startAutoRotate(-2);
          setAutoRotating(true);
        }
      },
      toggleFullscreen: () => {
        if (!viewerRef.current) return;
        viewerRef.current.toggleFullscreen();
      },
      getHfov: () => viewerRef.current?.getHfov() ?? hfov,
      setHfov: (val: number) => viewerRef.current?.setHfov(val),
      isAutoRotating: () => autoRotating,
      lookAt: (p: number, y: number) => {
        if (!viewerRef.current) return;
        viewerRef.current.setPitch(p);
        viewerRef.current.setYaw(y);
      },
    }));

    return (
      <div className={`relative w-full ${className ?? ""}`}>
        <div
          ref={containerRef}
          className="w-full h-full rounded-lg overflow-hidden"
          style={{ minHeight: "400px" }}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background-card rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-foreground-muted text-sm">
                Loading panorama...
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PanoramaViewer.displayName = "PanoramaViewer";

export default PanoramaViewer;
