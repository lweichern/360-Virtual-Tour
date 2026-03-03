"use client";

import { Suspense, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ROOMS } from "@/components/3d/ShowcaseScene";
import GlowEffect from "@/components/ui/GlowEffect";

type ViewMode = "overview" | "transitioning" | "room";

const ShowcaseScene = dynamic(
  () => import("@/components/3d/ShowcaseScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground-muted text-sm">
            Loading 3D experience...
          </p>
        </div>
      </div>
    ),
  }
);

export default function ShowcaseViewer() {
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const activeRoom = activeRoomId
    ? ROOMS.find((r) => r.id === activeRoomId) ?? null
    : null;

  const handleRoomClick = useCallback(
    (roomId: string) => {
      if (transitioning) return;
      setTransitioning(true);
      setActiveRoomId(roomId);
      setViewMode("transitioning");
    },
    [transitioning]
  );

  const handleTransitionComplete = useCallback(() => {
    setTransitioning(false);
    if (activeRoomId) {
      setViewMode("room");
    } else {
      setViewMode("overview");
    }
  }, [activeRoomId]);

  const handleBackToOverview = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);
    setActiveRoomId(null);
    setViewMode("transitioning");
  }, [transitioning]);

  const handleRoomNav = useCallback(
    (roomId: string) => {
      if (transitioning || roomId === activeRoomId) return;
      setTransitioning(true);
      setActiveRoomId(roomId);
      setViewMode("transitioning");
    },
    [transitioning, activeRoomId]
  );

  return (
    <section className="relative pb-24 px-6 overflow-hidden">
      <GlowEffect color="teal" size="md" className="-top-10 -right-20" />
      <GlowEffect color="purple" size="sm" className="bottom-10 -left-10" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* 3D Viewer container */}
        <div className="glass-card p-2 md:p-3">
          <div className="relative w-full h-[500px] md:h-[650px] rounded-lg overflow-hidden bg-background-card">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <ShowcaseScene
                viewMode={viewMode}
                activeRoomId={activeRoomId}
                onRoomClick={handleRoomClick}
                onTransitionComplete={handleTransitionComplete}
                onViewModeChange={setViewMode}
              />
            </Suspense>

            {/* ── UI Overlay ── */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top bar: room name + back button */}
              <AnimatePresence>
                {viewMode === "room" && activeRoom && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto"
                  >
                    <div className="glass-card px-4 py-2.5 flex items-center gap-3">
                      <div>
                        <h3 className="text-white font-semibold text-sm">
                          {activeRoom.name}
                        </h3>
                        <p className="text-foreground-muted text-xs">
                          {activeRoom.dimensions}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleBackToOverview}
                      className="glass-card px-4 py-2.5 text-sm text-white font-medium hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Overview
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Instruction text */}
              <AnimatePresence mode="wait">
                {viewMode === "overview" && (
                  <motion.p
                    key="overview-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 glass-card px-4 py-2 text-foreground-muted text-xs"
                  >
                    Click a room to explore
                  </motion.p>
                )}
                {viewMode === "room" && (
                  <motion.p
                    key="room-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 glass-card px-4 py-2 text-foreground-muted text-xs"
                  >
                    Use the buttons below to navigate between rooms
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Bottom bar: room selector */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-auto">
                <div className="glass-card px-2 py-2 flex items-center gap-1.5">
                  {ROOMS.map((room) => (
                    <button
                      key={room.id}
                      onClick={() =>
                        viewMode === "overview"
                          ? handleRoomClick(room.id)
                          : handleRoomNav(room.id)
                      }
                      disabled={transitioning}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        activeRoomId === room.id
                          ? "bg-primary text-white"
                          : "text-foreground-muted hover:text-white hover:bg-white/10"
                      } disabled:opacity-50`}
                    >
                      {room.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transition progress bar */}
              <AnimatePresence>
                {transitioning && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
