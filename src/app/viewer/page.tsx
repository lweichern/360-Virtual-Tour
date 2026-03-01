"use client";

import { useState, useRef, useCallback, useEffect, type DragEvent } from "react";
import {
  Upload,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  RefreshCw,
  Image as ImageIcon,
  X,
  MousePointerClick,
  MapPin,
  Plus,
  Trash2,
  Eye,
  Info,
  ArrowRightLeft,
  Layers,
  Navigation,
  Share2,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/shared/ScrollReveal";
import GlowEffect from "@/components/ui/GlowEffect";
import PanoramaViewer, {
  type PanoramaViewerHandle,
  type Hotspot,
  type Scene,
} from "@/components/shared/PanoramaViewer";
import { cn } from "@/lib/utils";

const sampleTour: Scene[] = [
  {
    id: "sample-1",
    name: "Library Hall",
    imageUrl: "https://pannellum.org/images/alma.jpg",
    hotspots: [],
  },
  {
    id: "sample-2",
    name: "Spring House",
    imageUrl: "https://pannellum.org/images/bma-0.jpg",
    hotspots: [],
  },
  {
    id: "sample-3",
    name: "Gallery",
    imageUrl: "https://pannellum.org/images/bma-1.jpg",
    hotspots: [],
  },
];

type AddMode = null | "info" | "scene";

export default function ViewerPage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [activeSceneId, setActiveSceneId] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const viewerRef = useRef<PanoramaViewerHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addSceneInputRef = useRef<HTMLInputElement>(null);

  // Hotspot placement state
  const [addMode, setAddMode] = useState<AddMode>(null);
  const [pendingPoint, setPendingPoint] = useState<{
    pitch: number;
    yaw: number;
  } | null>(null);
  const [hotspotTitle, setHotspotTitle] = useState("");
  const [hotspotDescription, setHotspotDescription] = useState("");
  const [targetSceneId, setTargetSceneId] = useState("");

  // Share state
  const [showCopied, setShowCopied] = useState(false);

  // Load tour from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#tour=")) return;
    try {
      const encoded = hash.slice(6); // remove "#tour="
      const json = atob(encoded);
      const parsed = JSON.parse(json) as Scene[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setScenes(parsed);
        setActiveSceneId(parsed[0].id);
      }
    } catch {
      // Invalid hash data — ignore
    }
  }, []);

  const handleShare = async () => {
    const hasBlobUrls = scenes.some((s) => s.imageUrl.startsWith("blob:"));
    if (hasBlobUrls) {
      alert(
        "Tours with locally uploaded images cannot be shared via link.\n\nTo share, use publicly hosted image URLs instead."
      );
      return;
    }

    const json = JSON.stringify(scenes);
    const encoded = btoa(json);
    const url = `${window.location.origin}${window.location.pathname}#tour=${encoded}`;

    await navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const activeScene = scenes.find((s) => s.id === activeSceneId);
  const hasStarted = scenes.length > 0;

  // --- File handling ---
  const addScene = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      const name = file.name.replace(/\.[^.]+$/, "");
      const id = `scene-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newScene: Scene = { id, name, imageUrl: url, hotspots: [] };

      setScenes((prev) => [...prev, newScene]);
      if (!activeSceneId) setActiveSceneId(id);
    },
    [activeSceneId]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      files.forEach((f) => addScene(f));
    },
    [addScene]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const loadSampleTour = () => {
    setScenes(sampleTour);
    setActiveSceneId(sampleTour[0].id);
  };

  const clearAll = () => {
    scenes.forEach((s) => {
      if (s.imageUrl.startsWith("blob:")) URL.revokeObjectURL(s.imageUrl);
    });
    setScenes([]);
    setActiveSceneId("");
    setAutoRotate(false);
    setAddMode(null);
    setPendingPoint(null);
  };

  const deleteScene = (id: string) => {
    setScenes((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      // Remove any scene-link hotspots pointing to deleted scene
      return updated.map((s) => ({
        ...s,
        hotspots: s.hotspots.filter(
          (hs) => hs.type !== "scene" || hs.targetSceneId !== id
        ),
      }));
    });
    if (activeSceneId === id) {
      setActiveSceneId(scenes.find((s) => s.id !== id)?.id || "");
    }
  };

  const toggleAutoRotate = () => {
    viewerRef.current?.toggleAutoRotate();
    setAutoRotate(!autoRotate);
  };

  // --- Hotspot placement ---
  const handleSceneClick = useCallback(
    (pitch: number, yaw: number) => {
      if (!addMode) return;
      setPendingPoint({ pitch, yaw });
      setHotspotTitle("");
      setHotspotDescription("");
      setTargetSceneId("");
    },
    [addMode]
  );

  const confirmHotspot = () => {
    if (!pendingPoint || !activeSceneId) return;
    if (addMode === "info" && !hotspotTitle.trim()) return;
    if (addMode === "scene" && !targetSceneId) return;

    const targetScene = scenes.find((s) => s.id === targetSceneId);

    const newHotspot: Hotspot = {
      id: `hs-${Date.now()}`,
      pitch: pendingPoint.pitch,
      yaw: pendingPoint.yaw,
      title:
        addMode === "scene"
          ? targetScene?.name || "Go to scene"
          : hotspotTitle.trim(),
      description: addMode === "scene" ? "" : hotspotDescription.trim(),
      type: addMode === "scene" ? "scene" : "info",
      targetSceneId: addMode === "scene" ? targetSceneId : undefined,
    };

    setScenes((prev) =>
      prev.map((s) =>
        s.id === activeSceneId
          ? { ...s, hotspots: [...s.hotspots, newHotspot] }
          : s
      )
    );
    setPendingPoint(null);
    setHotspotTitle("");
    setHotspotDescription("");
    setTargetSceneId("");
  };

  const cancelHotspot = () => {
    setPendingPoint(null);
    setHotspotTitle("");
    setHotspotDescription("");
    setTargetSceneId("");
  };

  const deleteHotspot = (hotspotId: string) => {
    setScenes((prev) =>
      prev.map((s) =>
        s.id === activeSceneId
          ? { ...s, hotspots: s.hotspots.filter((hs) => hs.id !== hotspotId) }
          : s
      )
    );
  };

  const lookAtHotspot = (hotspot: Hotspot) => {
    viewerRef.current?.lookAt(hotspot.pitch, hotspot.yaw);
  };

  const handleSceneChange = useCallback((sceneId: string) => {
    setActiveSceneId(sceneId);
  }, []);

  const currentHotspots = activeScene?.hotspots || [];
  const infoHotspots = currentHotspots.filter((hs) => hs.type === "info");
  const sceneHotspots = currentHotspots.filter((hs) => hs.type === "scene");
  const otherScenes = scenes.filter((s) => s.id !== activeSceneId);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-12 px-6 overflow-hidden">
        <GlowEffect color="blue" size="lg" className="top-20 -left-20" />
        <GlowEffect color="purple" size="md" className="top-40 -right-20" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-foreground-muted mb-6">
              Interactive Demo
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              360 <span className="gradient-text">Viewer</span>
            </h1>
            <p className="mt-6 text-lg text-foreground-muted max-w-2xl mx-auto">
              Upload 360 images, add info points and scene links to build a
              multi-scene virtual tour.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Viewer Section */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {!hasStarted ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "glass-card p-16 text-center cursor-pointer transition-all duration-300",
                    isDragging
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : "hover:border-white/20"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach((f) => addScene(f));
                      e.target.value = "";
                    }}
                  />
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Upload size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Upload 360 Images
                  </h3>
                  <p className="text-foreground-muted mb-2">
                    Drag and drop one or more equirectangular images, or click to
                    browse
                  </p>
                  <p className="text-foreground-muted/60 text-sm">
                    Upload multiple images to create a multi-scene tour
                  </p>
                </div>

                {/* Sample Tour */}
                <div className="mt-12 text-center">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Or try a sample tour
                  </h3>
                  <button
                    onClick={loadSampleTour}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
                  >
                    <MousePointerClick size={18} />
                    Load 3-Scene Sample Tour
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="viewer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Layers size={18} className="text-accent-purple" />
                    <span className="text-white font-medium">
                      {scenes.length} scene{scenes.length !== 1 ? "s" : ""}
                    </span>
                    {activeScene && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                        {activeScene.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-foreground-muted hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
                      >
                        {showCopied ? (
                          <Check size={14} className="text-accent-teal" />
                        ) : (
                          <Share2 size={14} />
                        )}
                        {showCopied ? "Link Copied!" : "Share"}
                      </button>
                    </div>
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-foreground-muted hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
                    >
                      <X size={14} />
                      Close Tour
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
                  {/* Left: Viewer + Controls */}
                  <div>
                    {/* Add mode banners */}
                    <AnimatePresence>
                      {addMode && !pendingPoint && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-3"
                        >
                          <div
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm",
                              addMode === "info"
                                ? "bg-accent-teal/10 border border-accent-teal/30 text-accent-teal"
                                : "bg-accent-blue/10 border border-accent-blue/30 text-accent-blue"
                            )}
                          >
                            {addMode === "info" ? (
                              <MapPin size={16} className="shrink-0" />
                            ) : (
                              <Navigation size={16} className="shrink-0" />
                            )}
                            <span>
                              {addMode === "info"
                                ? "Click on the panorama to place an info point"
                                : "Click on the ground to place a scene link"}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Panorama Viewer */}
                    <div
                      className={cn(
                        "glass-card p-2 md:p-3 transition-all",
                        addMode === "info" && "ring-2 ring-accent-teal/40",
                        addMode === "scene" && "ring-2 ring-accent-blue/40"
                      )}
                    >
                      {activeSceneId && (
                        <PanoramaViewer
                          ref={viewerRef}
                          scenes={scenes}
                          activeSceneId={activeSceneId}
                          autoRotate={autoRotate}
                          onSceneClick={handleSceneClick}
                          onSceneChange={handleSceneChange}
                          className="aspect-video"
                        />
                      )}
                    </div>

                    {/* Scene Thumbnails Strip */}
                    {scenes.length > 1 && (
                      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                        {scenes.map((scene) => (
                          <button
                            key={scene.id}
                            onClick={() => setActiveSceneId(scene.id)}
                            className={cn(
                              "shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                              scene.id === activeSceneId
                                ? "border-primary"
                                : "border-transparent opacity-60 hover:opacity-100"
                            )}
                          >
                            <div className="w-28 h-16 relative">
                              <img
                                src={scene.imageUrl}
                                alt={scene.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-end p-1.5">
                                <span className="text-white text-[10px] font-medium truncate w-full">
                                  {scene.name}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Controls */}
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                      <ControlButton
                        icon={<ZoomIn size={18} />}
                        label="Zoom In"
                        onClick={() => viewerRef.current?.zoomIn()}
                      />
                      <ControlButton
                        icon={<ZoomOut size={18} />}
                        label="Zoom Out"
                        onClick={() => viewerRef.current?.zoomOut()}
                      />
                      <ControlButton
                        icon={<RotateCcw size={18} />}
                        label="Auto Rotate"
                        active={autoRotate}
                        onClick={toggleAutoRotate}
                      />
                      <ControlButton
                        icon={<RefreshCw size={18} />}
                        label="Reset"
                        onClick={() => viewerRef.current?.resetView()}
                      />
                      <ControlButton
                        icon={<Maximize size={18} />}
                        label="Fullscreen"
                        onClick={() => viewerRef.current?.toggleFullscreen()}
                      />

                      <div className="w-px h-8 bg-white/10 hidden sm:block" />

                      <ControlButton
                        icon={<Plus size={18} />}
                        label="Info Point"
                        active={addMode === "info"}
                        activeColor="teal"
                        onClick={() => {
                          setAddMode(addMode === "info" ? null : "info");
                          setPendingPoint(null);
                        }}
                      />
                      {otherScenes.length > 0 && (
                        <ControlButton
                          icon={<ArrowRightLeft size={18} />}
                          label="Scene Link"
                          active={addMode === "scene"}
                          activeColor="blue"
                          onClick={() => {
                            setAddMode(addMode === "scene" ? null : "scene");
                            setPendingPoint(null);
                          }}
                        />
                      )}
                    </div>

                    <p className="mt-4 text-center text-foreground-muted text-sm">
                      Drag to look around &bull; Scroll to zoom &bull;
                      Click scene arrows to navigate
                    </p>
                  </div>

                  {/* Right Panel */}
                  <div className="space-y-4">
                    {/* Pending hotspot form */}
                    <AnimatePresence>
                      {pendingPoint && addMode && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="glass-card p-5"
                        >
                          <div className="flex items-center gap-2 mb-4">
                            {addMode === "info" ? (
                              <MapPin
                                size={16}
                                className="text-accent-teal"
                              />
                            ) : (
                              <Navigation
                                size={16}
                                className="text-accent-blue"
                              />
                            )}
                            <h3 className="text-white font-semibold text-sm">
                              {addMode === "info"
                                ? "New Info Point"
                                : "New Scene Link"}
                            </h3>
                            <span className="text-foreground-muted/50 text-xs ml-auto">
                              {pendingPoint.pitch.toFixed(1)}°,{" "}
                              {pendingPoint.yaw.toFixed(1)}°
                            </span>
                          </div>

                          <div className="space-y-3">
                            {addMode === "info" ? (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                                    Title *
                                  </label>
                                  <input
                                    type="text"
                                    value={hotspotTitle}
                                    onChange={(e) =>
                                      setHotspotTitle(e.target.value)
                                    }
                                    placeholder="e.g. Kitchen Area"
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-foreground-muted/50 focus:outline-none focus:border-accent-teal transition-colors"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" &&
                                        hotspotTitle.trim()
                                      )
                                        confirmHotspot();
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                                    Description
                                  </label>
                                  <textarea
                                    value={hotspotDescription}
                                    onChange={(e) =>
                                      setHotspotDescription(e.target.value)
                                    }
                                    placeholder="Describe this point..."
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-foreground-muted/50 focus:outline-none focus:border-accent-teal transition-colors resize-none"
                                  />
                                </div>
                              </>
                            ) : (
                              <div>
                                <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                                  Link to scene *
                                </label>
                                <select
                                  value={targetSceneId}
                                  onChange={(e) =>
                                    setTargetSceneId(e.target.value)
                                  }
                                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-accent-blue transition-colors"
                                >
                                  <option value="" className="bg-background">
                                    Select a scene...
                                  </option>
                                  {otherScenes.map((s) => (
                                    <option
                                      key={s.id}
                                      value={s.id}
                                      className="bg-background"
                                    >
                                      {s.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={confirmHotspot}
                                disabled={
                                  addMode === "info"
                                    ? !hotspotTitle.trim()
                                    : !targetSceneId
                                }
                                className={cn(
                                  "flex-1 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                                  addMode === "info"
                                    ? "bg-accent-teal hover:bg-accent-teal/80"
                                    : "bg-accent-blue hover:bg-accent-blue/80"
                                )}
                              >
                                {addMode === "info"
                                  ? "Add Point"
                                  : "Add Link"}
                              </button>
                              <button
                                onClick={cancelHotspot}
                                className="px-4 py-2 rounded-lg border border-white/10 text-foreground-muted text-sm hover:text-white hover:bg-white/5 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Scenes Panel */}
                    <div className="glass-card p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Layers size={16} className="text-accent-purple" />
                          <h3 className="text-white font-semibold text-sm">
                            Scenes
                          </h3>
                        </div>
                        <button
                          onClick={() => addSceneInputRef.current?.click()}
                          className="text-xs text-primary hover:text-primary-hover transition-colors font-medium"
                        >
                          + Add Scene
                        </button>
                        <input
                          ref={addSceneInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach((f) => addScene(f));
                            e.target.value = "";
                          }}
                        />
                      </div>

                      <div className="space-y-1.5">
                        {scenes.map((scene) => (
                          <div
                            key={scene.id}
                            className={cn(
                              "group flex items-center gap-3 p-2.5 rounded-xl transition-colors cursor-pointer",
                              scene.id === activeSceneId
                                ? "bg-primary/15"
                                : "hover:bg-white/5"
                            )}
                            onClick={() => setActiveSceneId(scene.id)}
                          >
                            <div className="w-12 h-8 rounded-lg overflow-hidden shrink-0">
                              <img
                                src={scene.imageUrl}
                                alt={scene.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={cn(
                                  "text-sm font-medium truncate",
                                  scene.id === activeSceneId
                                    ? "text-white"
                                    : "text-foreground-muted"
                                )}
                              >
                                {scene.name}
                              </p>
                              <p className="text-foreground-muted/50 text-[10px]">
                                {scene.hotspots.length} hotspot
                                {scene.hotspots.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                            {scenes.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteScene(scene.id);
                                }}
                                className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-foreground-muted hover:text-red-400 transition-all"
                                title="Delete scene"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hotspots for current scene */}
                    <div className="glass-card p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Info size={16} className="text-accent-teal" />
                          <h3 className="text-white font-semibold text-sm">
                            Info Points
                          </h3>
                        </div>
                        <span className="text-foreground-muted text-xs">
                          {infoHotspots.length} total
                        </span>
                      </div>

                      {infoHotspots.length === 0 ? (
                        <p className="text-foreground-muted/60 text-xs text-center py-4">
                          No info points on this scene
                        </p>
                      ) : (
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {infoHotspots.map((hs) => (
                            <HotspotListItem
                              key={hs.id}
                              hotspot={hs}
                              icon={
                                <MapPin
                                  size={12}
                                  className="text-accent-teal"
                                />
                              }
                              iconBg="bg-accent-teal/20"
                              onLookAt={() => lookAtHotspot(hs)}
                              onDelete={() => deleteHotspot(hs.id)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Scene Links for current scene */}
                    <div className="glass-card p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Navigation
                            size={16}
                            className="text-accent-blue"
                          />
                          <h3 className="text-white font-semibold text-sm">
                            Scene Links
                          </h3>
                        </div>
                        <span className="text-foreground-muted text-xs">
                          {sceneHotspots.length} total
                        </span>
                      </div>

                      {sceneHotspots.length === 0 ? (
                        <p className="text-foreground-muted/60 text-xs text-center py-4">
                          {otherScenes.length === 0
                            ? "Add more scenes to create links"
                            : "No scene links on this scene"}
                        </p>
                      ) : (
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {sceneHotspots.map((hs) => {
                            const target = scenes.find(
                              (s) => s.id === hs.targetSceneId
                            );
                            return (
                              <HotspotListItem
                                key={hs.id}
                                hotspot={hs}
                                subtitle={
                                  target ? `→ ${target.name}` : undefined
                                }
                                icon={
                                  <ArrowRightLeft
                                    size={12}
                                    className="text-accent-blue"
                                  />
                                }
                                iconBg="bg-accent-blue/20"
                                onLookAt={() => lookAtHotspot(hs)}
                                onDelete={() => deleteHotspot(hs.id)}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-24 px-6 bg-background-secondary">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Tips for Best Results
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Use Equirectangular Images",
                  desc: "360 images should be in equirectangular format (2:1 aspect ratio) for proper spherical projection.",
                },
                {
                  title: "Multi-Scene Tours",
                  desc: "Upload multiple 360 images and link them with scene points to create a walkthrough tour.",
                },
                {
                  title: "Info Points",
                  desc: "Add info points (ℹ icon) to annotate rooms, features, or points of interest with descriptions.",
                },
                {
                  title: "Scene Links",
                  desc: "Place scene links (arrow on ground) to let viewers navigate between different rooms or locations.",
                },
              ].map((tip) => (
                <div key={tip.title} className="glass-card p-6">
                  <h4 className="font-semibold text-white mb-2">
                    {tip.title}
                  </h4>
                  <p className="text-foreground-muted text-sm leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

// --- Shared sub-components ---

function HotspotListItem({
  hotspot,
  subtitle,
  icon,
  iconBg,
  onLookAt,
  onDelete,
}: {
  hotspot: Hotspot;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  onLookAt: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
      <div
        className={cn(
          "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
          iconBg
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-medium truncate">
          {hotspot.title}
        </p>
        {subtitle && (
          <p className="text-foreground-muted/60 text-[10px]">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={onLookAt}
          className="p-1 rounded-md hover:bg-white/10 text-foreground-muted hover:text-white transition-colors"
          title="Look at"
        >
          <Eye size={12} />
        </button>
        <button
          onClick={onDelete}
          className="p-1 rounded-md hover:bg-red-500/20 text-foreground-muted hover:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

function ControlButton({
  icon,
  label,
  onClick,
  active,
  activeColor = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  activeColor?: "primary" | "teal" | "blue";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
        active
          ? activeColor === "teal"
            ? "bg-accent-teal text-white"
            : activeColor === "blue"
              ? "bg-accent-blue text-white"
              : "bg-primary text-white"
          : "glass-card text-foreground-muted hover:text-white hover:border-white/20"
      )}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
