"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Sparkles, Stars, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/date";
import { getRecordedAgoLabel } from "@/lib/entries";

type Asset = { id: string; fileUrl: string; fileType: string };

type RevealExperienceProps = {
  title: string;
  createdAt: string;
  contentText: string | null;
  mood: string | null;
  tags: string[];
  predictionText: string | null;
  realityText: string | null;
  assets: Asset[];
  reflectionForm?: React.ReactNode;
};

const screens = ["intro", "recorded", "unlock", "content"] as const;

function normalizeAssetType(fileType: string) {
  return fileType.trim().toLowerCase();
}

function isPhotoAsset(fileType: string) {
  const normalized = normalizeAssetType(fileType);
  return normalized === "photo" || normalized === "image" || normalized.startsWith("image/");
}

function isAudioAsset(fileType: string) {
  const normalized = normalizeAssetType(fileType);
  return normalized === "audio" || normalized.startsWith("audio/");
}

function isVideoAsset(fileType: string) {
  const normalized = normalizeAssetType(fileType);
  return normalized === "video" || normalized.startsWith("video/");
}

export function RevealExperience(props: RevealExperienceProps) {
  const [screen, setScreen] = useState<(typeof screens)[number]>("intro");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const stepLabel = screen === "unlock" ? "Reveal now" : "Continue";
  const panelButtonVariant = screen === "unlock" ? "default" : "secondary";

  const { photos, audioAssets, videoAssets } = useMemo(() => {
    const photos = props.assets.filter((asset) => isPhotoAsset(asset.fileType));
    const audioAssets = props.assets.filter((asset) => isAudioAsset(asset.fileType));
    const videoAssets = props.assets.filter((asset) => isVideoAsset(asset.fileType));
    return { photos, audioAssets, videoAssets };
  }, [props.assets]);

  const selectedPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  function goNext() {
    setScreen((current) => {
      if (current === "intro") return "recorded";
      if (current === "recorded") return "unlock";
      if (current === "unlock") return "content";
      return current;
    });
  }

  function closePhoto() {
    setSelectedPhotoIndex(null);
  }

  function showPreviousPhoto() {
    setSelectedPhotoIndex((current) => {
      if (current === null) return current;
      return current === 0 ? photos.length - 1 : current - 1;
    });
  }

  function showNextPhoto() {
    setSelectedPhotoIndex((current) => {
      if (current === null) return current;
      return current === photos.length - 1 ? 0 : current + 1;
    });
  }

  return (
    <>
      <div className="space-y-6 sm:space-y-7">
        {screen !== "content" ? (
          <Card className="overflow-hidden border-white/12 bg-[radial-gradient(circle_at_18%_20%,rgba(113,157,255,0.22),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(230,184,106,0.18),transparent_22%),radial-gradient(circle_at_50%_120%,rgba(117,203,255,0.18),transparent_34%),linear-gradient(180deg,rgba(17,28,52,0.98),rgba(28,44,82,0.96)_58%,rgba(38,58,106,0.94))] text-white shadow-[0_34px_92px_rgba(30,42,68,0.28)]">
            <CardContent className="relative flex min-h-[460px] flex-col items-center justify-center overflow-hidden p-8 text-center sm:p-10 lg:min-h-[520px] lg:p-14">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_28%,transparent_72%,rgba(255,255,255,0.04))]" />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-[10%] top-[18%] h-28 w-28 rounded-full border border-white/8 bg-[radial-gradient(circle,rgba(255,255,255,0.22),rgba(255,255,255,0.02)_68%,transparent_74%)] blur-sm"
                animate={{ y: [0, -8, 0], opacity: [0.4, 0.75, 0.4], scale: [1, 1.08, 1] }}
                transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute bottom-[14%] right-[12%] h-36 w-36 rounded-full border border-white/8 bg-[radial-gradient(circle,rgba(117,203,255,0.18),rgba(117,203,255,0.02)_72%,transparent_78%)] blur-sm"
                animate={{ y: [0, 10, 0], opacity: [0.25, 0.55, 0.25], scale: [1, 1.12, 1] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />

              {screen === "intro" ? (
                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-3xl section-stack">
                  <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm uppercase tracking-[0.24em] text-white/70 backdrop-blur-sm">
                    <Sparkles className="h-4 w-4 text-secondary" />
                    Vault Story
                  </div>
                  <h1 className="text-balance font-display text-5xl leading-tight lg:text-6xl">{props.title}</h1>
                  <p className="mx-auto max-w-2xl text-lg leading-8 text-white/78">
                    A preserved moment is ready to return, wrapped in the years, anticipation, and meaning that built up around it.
                  </p>
                </motion.div>
              ) : null}

              {screen === "recorded" ? (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 max-w-2xl section-stack">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/12 bg-white/8 shadow-[0_20px_50px_rgba(12,18,36,0.24)]">
                    <CalendarClock className="h-9 w-9 text-secondary" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.24em] text-white/60">Recorded</p>
                  <h2 className="font-display text-4xl lg:text-5xl">{getRecordedAgoLabel(props.createdAt)}</h2>
                  <p className="text-sm leading-7 text-white/74">Created on {formatDateTime(props.createdAt)}</p>
                </motion.div>
              ) : null}

              {screen === "unlock" ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 flex flex-col items-center">
                  <motion.div
                    aria-hidden
                    className="absolute top-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(230,184,106,0.28),rgba(117,203,255,0.06)_58%,transparent_72%)] blur-2xl"
                    animate={{ scale: [0.92, 1.08, 0.96], opacity: [0.42, 0.82, 0.5] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    initial={{ scale: 0.76, opacity: 0.5 }}
                    animate={{ scale: [0.76, 1.16, 1], opacity: [0.5, 1, 1], rotate: [0, -4, 0] }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                    className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/16 bg-[radial-gradient(circle,rgba(255,255,255,0.16),rgba(255,255,255,0.06))] shadow-[0_24px_68px_rgba(13,21,39,0.3)]"
                  >
                    <motion.div
                      aria-hidden
                      className="absolute inset-3 rounded-full border border-white/10"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <Stars className="h-14 w-14 text-secondary" />
                  </motion.div>
                  <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm uppercase tracking-[0.24em] text-white/66">
                    <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_18px_rgba(230,184,106,0.8)]" />
                    Unlocking memory
                  </div>
                  <h2 className="mt-5 max-w-[14ch] text-balance font-display text-4xl leading-tight lg:text-5xl">
                    The moment is ready to surface.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                    Open it slowly and let the past step back into the room with all its detail intact.
                  </p>
                </motion.div>
              ) : null}

              <Button onClick={goNext} variant={panelButtonVariant} className="relative z-10 mt-10 min-w-44">
                {stepLabel}
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {screen === "content" ? (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 sm:space-y-7">
            <Card className="overflow-hidden border-white/60 bg-card/90 shadow-[0_24px_64px_rgba(66,46,31,0.1)]">
              <CardContent className="space-y-7 p-8 sm:p-10">
                <div className="flex flex-wrap items-center gap-2.5">
                  {props.mood ? <Badge variant="secondary">{props.mood}</Badge> : null}
                  {props.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                {props.contentText ? (
                  <div className="rounded-[32px] border border-white/65 bg-background/76 p-6 sm:p-8">
                    <p className="mx-auto max-w-3xl whitespace-pre-wrap text-[1.02rem] leading-8 text-foreground sm:text-lg sm:leading-9">
                      {props.contentText}
                    </p>
                  </div>
                ) : null}

                {photos.length ? (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Photo memories</p>
                        <h3 className="mt-2 font-display text-2xl text-foreground">A gallery of the moment</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Click any photo to open it larger.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {photos.map((asset, index) => (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => setSelectedPhotoIndex(index)}
                          className="group overflow-hidden rounded-[28px] border border-white/60 bg-background/72 text-left shadow-[0_16px_38px_rgba(66,46,31,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(66,46,31,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          aria-label={`Open photo ${index + 1} larger`}
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-secondary/15">
                            <img
                              src={asset.fileUrl}
                              alt={`Memory photo ${index + 1}`}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                            />
                          </div>
                          <div className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground">
                            <span>Photo {index + 1}</span>
                            <span className="text-primary">View larger</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}

                {videoAssets.length ? (
                  <section className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Video memories</p>
                      <h3 className="mt-2 font-display text-2xl text-foreground">Watch the moment unfold</h3>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                      {videoAssets.map((asset, index) => (
                        <div key={asset.id} className="overflow-hidden rounded-[30px] border border-white/65 bg-background/76 p-2 shadow-[0_18px_42px_rgba(66,46,31,0.08)]">
                          <video controls className="w-full rounded-[24px]" src={asset.fileUrl} />
                          <p className="px-3 pb-2 pt-3 text-sm text-muted-foreground">Video {index + 1}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {audioAssets.length ? (
                  <section className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Audio memories</p>
                      <h3 className="mt-2 font-display text-2xl text-foreground">Listen back in their voice</h3>
                    </div>
                    <div className="grid gap-4">
                      {audioAssets.map((asset, index) => (
                        <div key={asset.id} className="rounded-[28px] border border-white/65 bg-background/76 p-5 shadow-[0_12px_32px_rgba(66,46,31,0.06)]">
                          <div className="mb-3 text-sm text-muted-foreground">Audio {index + 1}</div>
                          <audio controls className="w-full" src={asset.fileUrl} />
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </CardContent>
            </Card>
            {(props.predictionText || props.realityText || props.reflectionForm) ? (
              <Card className="border-white/60 bg-card/90">
                <CardContent className="grid gap-5 p-8 sm:p-10 lg:grid-cols-2">
                  <div className="rounded-[30px] bg-secondary/55 p-6 sm:p-7">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Past prediction</p>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground">
                      {props.predictionText || "No prediction was recorded for this entry."}
                    </p>
                  </div>
                  <div className="rounded-[30px] bg-background/82 p-6 sm:p-7">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      <Sparkles className="h-4 w-4" />Reality
                    </div>
                    {props.realityText ? (
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground">{props.realityText}</p>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <p className="text-sm leading-7 text-muted-foreground">This memory has unlocked, but no reflection has been added yet.</p>
                        {props.reflectionForm}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </motion.div>
        ) : null}
      </div>

      <AnimatePresence>
        {selectedPhoto ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(12,18,34,0.84)] p-4 backdrop-blur-md sm:p-6"
            onClick={closePhoto}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-6xl overflow-hidden rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(113,157,255,0.18),transparent_24%),linear-gradient(180deg,rgba(18,28,50,0.98),rgba(30,45,76,0.95))] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.36)] sm:p-4"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closePhoto}
                className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white transition hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Close enlarged photo"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                <div className="overflow-hidden rounded-[28px] bg-black/25">
                  <img src={selectedPhoto.fileUrl} alt={`Expanded memory photo ${selectedPhotoIndex! + 1}`} className="max-h-[78vh] w-full object-contain" />
                </div>

                <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/58">Photo memory</p>
                    <h3 className="mt-3 font-display text-3xl">Photo {selectedPhotoIndex! + 1}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/72">
                      Browse this moment in a quieter, larger view.
                    </p>
                  </div>

                  {photos.length > 1 ? (
                    <div className="space-y-3">
                      <Button type="button" variant="secondary" className="w-full" onClick={showPreviousPhoto}>
                        Previous photo
                      </Button>
                      <Button type="button" variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={showNextPhoto}>
                        Next photo
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
