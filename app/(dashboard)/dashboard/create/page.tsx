"use client";

import { useState, useRef, useCallback, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  CreateVideoHeader,
  StepProgress,
  StepNavigation,
  GeneratingProgress,
} from "@/app/components/dashboard/create";
import Step1TitleKeywordsScript from "@/app/components/dashboard/create/steps/Step1TitleKeywordsScript";
const Step2FormatStyleMedia = lazy(() => import("@/app/components/dashboard/create/steps/Step2FormatStyleMedia"));
const Step3BackgroundMusic = lazy(() => import("@/app/components/dashboard/create/steps/Step3BackgroundMusic"));
const Step4VoiceNarration = lazy(() => import("@/app/components/dashboard/create/steps/Step4VoiceNarration"));
const Step5SubtitleSettings = lazy(() => import("@/app/components/dashboard/create/steps/Step5SubtitleSettings"));
const Step6ReviewGenerate = lazy(() => import("@/app/components/dashboard/create/steps/Step6ReviewGenerate"));
import { useCreateVideoMutation, useGetMusicQuery, useUpdateVideoMutation } from "@/lib/redux/features/videos/videosApi";
import { useGetUserCreditBalanceQuery } from "@/lib/redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { SceneMediaOption, SubtitleStyle, VideoStyleOption, VideoFormat, VoiceId } from "@/types/createVideo";
import type { MusicOption } from "@/app/components/dashboard/create/steps/Step3BackgroundMusic";
import { subtitleStyles } from "@/app/data/createVideoOptions";

const TOTAL_STEPS = 6;

// Backend message → step index mapping
function getStepIndexFromMessage(message: string): number {
  const msg = message.toLowerCase();
  if (msg.includes("prompt"))   return 0;
  if (msg.includes("image"))    return 1;
  if (msg.includes("narration") || msg.includes("voice") || msg.includes("audio")) return 2;
  if (msg.includes("build") || msg.includes("render") || msg.includes("assembl")) return 3;
  return 0;
}

export default function CreateVideoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showStep1Errors, setShowStep1Errors] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [generatedVideoId, setGeneratedVideoId] = useState<number | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [editSourceVideoId, setEditSourceVideoId] = useState<number | null>(null);
  const [generationSteps, setGenerationSteps] = useState([
    { label: "Generating Prompts", completed: false, active: true },
    { label: "Creating Image",     completed: false, active: false },
    { label: "Creating narration", completed: false, active: false },
    { label: "Building Video",     completed: false, active: false },
  ]);

  const [createVideo] = useCreateVideoMutation();
  const [updateVideo] = useUpdateVideoMutation();
  const token = useSelector((state: { auth: { token: string | null } }) => state.auth.token);
  const { data: musicList = [] } = useGetMusicQuery({ skip: 0, limit: 100 }, { skip: !token });
  const authUser = useSelector((state: { auth: { user: { id: number; credits: number } | null } }) => state.auth.user);
  const userId = authUser?.id ?? null;
  const { data: creditBalance } = useGetUserCreditBalanceQuery(userId ?? skipToken, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000,
    skipPollingIfUnfocused: true,
  });
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const displayCredits = typeof creditBalance === "number" ? creditBalance : (authUser?.credits ?? 0);

  const normalizeVideoId = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && /^\d+$/.test(value.trim())) return Number(value);
    return null;
  };

  const resolveLatestCompletedVideoId = useCallback(async (targetTitle?: string) => {
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!authToken) return null;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";
    try {
      const resp = await fetch(`${apiBase}/v1/videos/get-all?skip=0&limit=20`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!resp.ok) return null;
      const data = (await resp.json()) as Array<{ id: number; title?: string; status?: string; created_at?: string }>;
      const completed = data
        .filter((v) => String(v.status || "").toLowerCase() === "completed")
        .sort((a, b) =>
          new Date(String(b.created_at || "1970-01-01")).getTime() -
          new Date(String(a.created_at || "1970-01-01")).getTime()
        );
      const normalizedTarget = String(targetTitle || "").trim().toLowerCase();
      const matched = normalizedTarget
        ? completed.find((v) => String(v.title || "").trim().toLowerCase() === normalizedTarget)
        : undefined;
      return matched?.id ?? completed[0]?.id ?? null;
    } catch {
      return null;
    }
  }, [token]);

  const handleViewGeneratedVideo = useCallback(async (targetTitle?: string) => {
    if (!generationComplete) return;
    if (generatedVideoId) { router.push(`/dashboard/videos/${generatedVideoId}`); return; }
    const resolvedId = await resolveLatestCompletedVideoId(targetTitle);
    if (resolvedId) { router.push(`/dashboard/videos/${resolvedId}`); return; }
    router.push("/dashboard/videos");
  }, [generationComplete, generatedVideoId, resolveLatestCompletedVideoId, router]);

  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  const startPolling = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (createResponse: any) => {
      // ── job_id extraction ──
      // createVideo response returns: { id: "uuid", status, progress, message, ... }
      // The "id" field IS the job_id for polling
      const jobId =
        createResponse?.job_id ||
        createResponse?.jobId ||
        createResponse?._unique_id ||
        createResponse?.id;          // ← backend returns id = job uuid

      const videoId = normalizeVideoId(createResponse?.video_id ?? createResponse?.numeric_id ?? null);

      console.log("[Polling] jobId:", jobId, "videoId:", videoId);

      if (videoId !== null) setGeneratedVideoId(videoId);
      setGenerationProgress(createResponse?.progress ?? 5);

      const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api") + "/v1";
      let busy = false;

      pollingRef.current = setInterval(async () => {
        if (busy) return;
        busy = true;

        try {
          // ── Poll job-status ──
          if (jobId) {
            const resp = await fetch(`${apiBase}/videos/job-status/${jobId}`);
            if (resp.ok) {
              const data = await resp.json();
              console.log("[Poll] job-status:", data.status, data.progress, data.message);

              const status   = String(data?.status || "").toLowerCase().trim();
              const progress = typeof data?.progress === "number" ? data.progress : null;
              const message  = String(data?.message || "");
              const vid      = normalizeVideoId(data?.video_id ?? data?.result?.id ?? null);

              if (vid !== null) setGeneratedVideoId(vid);

              // ── completed ──
              if (status === "completed" || status === "done" || data?.completed_at) {
                if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
                // Step 1: 95% দেখাও — smooth feel
                setGenerationProgress(95);
                setGenerationSteps((prev) => prev.map((s) => ({ ...s, completed: true, active: false })));
                // Step 2: 1.5s পরে 100% — user বুঝবে শেষ হচ্ছে
                setTimeout(() => {
                  setGenerationProgress(100);
                  setGenerationComplete(true);
                }, 1500);
                return;
              }

              // ── failed ──
              if (status === "failed" || status === "error") {
                const errMsg = data?.error || "Video generation failed. Please try again.";
                setGenerationError(errMsg);
                toast.error(errMsg);
                if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
                return;
              }

              // ── in-progress: use REAL backend progress ──
              if (progress !== null) {
                setGenerationProgress(progress); // ✅ real value — no fake counter
              }

              // ── update steps from backend message ──
              if (message) {
                const stepIdx = getStepIndexFromMessage(message);
                setGenerationSteps((prev) =>
                  prev.map((step, i) => ({
                    ...step,
                    completed: i < stepIdx,
                    active:    i === stepIdx,
                  }))
                );
              }
              return; // done for this tick
            }
          }

          // ── Fallback: poll by video numeric id (needs auth) ──
          const checkVid = videoId;
          if (checkVid && token) {
            const resp = await fetch(`${apiBase}/videos/get/${checkVid}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (resp.ok) {
              const data = await resp.json();
              const status = String(data?.status || "").toLowerCase();
              if (status === "completed") {
                setGenerationProgress(100);
                setGenerationComplete(true);
                setGenerationSteps((prev) => prev.map((s) => ({ ...s, completed: true, active: false })));
                if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
              } else if (status === "failed") {
                const errMsg = "Video generation failed. Please try again.";
                setGenerationError(errMsg);
                toast.error(errMsg);
                if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
              }
            }
          }
        } catch (err) {
          console.error("[Poll] Unexpected:", err);
        } finally {
          busy = false;
        }
      }, 5000); // poll every 5 seconds
    },
    [token]
  );

  // ── Form state ──
  const [videoTitle,       setVideoTitle]       = useState("");
  const [keywords,         setKeywords]         = useState("");
  const [negativeKeywords, setNegativeKeywords] = useState("");
  const [sceneMedia,       setSceneMedia]       = useState<SceneMediaOption>("all-images");
  const [videoStyle,       setVideoStyle]       = useState<VideoStyleOption>("3d-cartoon");
  const [selectedVoice,    setSelectedVoice]    = useState<VoiceId>("hope");
  const [script,           setScript]           = useState("");
  const [backgroundMusic,  setBackgroundMusic]  = useState<MusicOption>("no-music");
  const [videoFormat,      setVideoFormat]      = useState<VideoFormat>("9:16");
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [subtitleStyle,    setSubtitleStyle]    = useState<SubtitleStyle>("none");

  // Pre-fill from Edit & Regenerate
  useEffect(() => {
    const raw = sessionStorage.getItem("editVideoData");
    if (!raw) return;
    sessionStorage.removeItem("editVideoData");
    try {
      const d = JSON.parse(raw);
      if (typeof d.source_video_id === "number") setEditSourceVideoId(d.source_video_id);
      if (d.title)            setVideoTitle(d.title);
      if (d.script)           setScript(d.script);
      if (d.keywords)         setKeywords(d.keywords);
      if (d.negative_keywords) setNegativeKeywords(d.negative_keywords);
      if (d.format)           setVideoFormat(d.format as VideoFormat);
      if (d.style)            setVideoStyle(d.style as VideoStyleOption);
      if (d.voice)            setSelectedVoice(d.voice as VoiceId);
      const mediaMap: Record<string, SceneMediaOption> = {
        all_images: "all-images", first_scene: "first-scene-video",
        last_scene: "last-scene-video", first_and_last_scene: "first-last-scene-video",
      };
      if (d.media_option && mediaMap[d.media_option]) setSceneMedia(mediaMap[d.media_option]);
      const incomingSubtitleId = typeof d.subtitle_id === "number" ? d.subtitle_id : null;
      if (!incomingSubtitleId) {
        setSubtitleStyle("none"); setSubtitlesEnabled(false);
      } else {
        const found = subtitleStyles.find((s) => s.id === incomingSubtitleId);
        if (found) { setSubtitleStyle(found.value); setSubtitlesEnabled(found.value !== "none"); }
      }
      if (d.music_id && d.music_id > 0) setBackgroundMusic(String(d.music_id));
    } catch { }
  }, []);

  const handleBack = () => {
    if (isGenerating) { setCurrentStep(1); resetGenerating(); return; }
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      const isTitleEmpty = !videoTitle.trim();
      const isScriptEmpty = !script.trim();

      if (isTitleEmpty || isScriptEmpty) {
        setShowStep1Errors(true);
        if (isTitleEmpty && isScriptEmpty) {
          toast.error("Video Title and Script are required.");
        } else if (isTitleEmpty) {
          toast.error("Video Title is required.");
        } else {
          toast.error("Video Script is required.");
        }
        return;
      }
    }
    if (currentStep < TOTAL_STEPS) setCurrentStep((prev) => prev + 1);
  };

  const selectedMusicLabel =
    backgroundMusic === "no-music"
      ? "No Music"
      : musicList.find((item) => item.id === Number(backgroundMusic))?.name || "Unknown Music";

  const handleGenerate = async () => {
    if (!videoTitle.trim() || !script.trim()) {
      toast.error("Please add Video Title and Script before generating.");
      return;
    }

    const mediaOption =
      sceneMedia === "all-images"           ? "all_images"
      : sceneMedia === "first-scene-video"  ? "first_scene"
      : sceneMedia === "last-scene-video"   ? "last_scene"
      : "first_and_last_scene";

    const selectedSubtitle = subtitleStyles.find((s) => s.value === subtitleStyle);
    const subtitleId = subtitlesEnabled && subtitleStyle !== "none" ? (selectedSubtitle?.id ?? null) : null;
    const parsedMusicId = backgroundMusic === "no-music" ? null : Number(backgroundMusic);
    const validMusicIds = new Set(musicList.map((item) => item.id));
    const musicId = parsedMusicId !== null && Number.isFinite(parsedMusicId) && validMusicIds.has(parsedMusicId) ? parsedMusicId : null;

    const body = { title: videoTitle, script, format: videoFormat, style: videoStyle, voice: selectedVoice, category: videoStyle, media_option: mediaOption, subtitle_id: subtitleId, keywords, negative_keywords: negativeKeywords, music_id: musicId };

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const response = editSourceVideoId
        ? await updateVideo({ id: editSourceVideoId, body }).unwrap()
        : await createVideo(body).unwrap();
      console.log("[Create Video] Response:", response);
      startPolling(response);
    } catch (error: unknown) {
      const err = error as { status?: number; data?: { detail?: string } };
      setIsGenerating(false);
      if (err.status === 401) { toast.error("Session expired. Please login again."); return; }
      const detail = err.data?.detail || "";
      if (typeof detail === "string" && /capacity|processing/i.test(detail)) {
        toast.info("A video is already processing. Please wait and try again.");
        return;
      }
      toast.error(detail || (editSourceVideoId ? "Failed to regenerate video" : "Failed to create video"));
    }
  };

  const resetGenerating = () => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    setIsGenerating(false);
    setCurrentStep(1);
    setGenerationProgress(0);
    setGenerationComplete(false);
    setGenerationError(null);
    setShowStep1Errors(false);
    setGenerationSteps([
      { label: "Generating Prompts", completed: false, active: true },
      { label: "Creating Image",     completed: false, active: false },
      { label: "Creating narration", completed: false, active: false },
      { label: "Building Video",     completed: false, active: false },
    ]);
  };

  if (isGenerating) {
    return (
      <div className="w-full mx-auto" style={{ minHeight: "844px" }}>
        <GeneratingProgress
          progress={generationProgress}
          steps={generationSteps}
          error={generationError}
          onBack={resetGenerating}
          onNext={() => { void handleViewGeneratedVideo(videoTitle); }}
        />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1TitleKeywordsScript videoTitle={videoTitle} setVideoTitle={setVideoTitle} keywords={keywords} setKeywords={setKeywords} negativeKeywords={negativeKeywords} setNegativeKeywords={setNegativeKeywords} script={script} setScript={setScript} showErrors={showStep1Errors} />;
      case 2: return <Step2FormatStyleMedia videoFormat={videoFormat} setVideoFormat={setVideoFormat} videoStyle={videoStyle} setVideoStyle={setVideoStyle} sceneMedia={sceneMedia} setSceneMedia={setSceneMedia} />;
      case 3: return <Step3BackgroundMusic backgroundMusic={backgroundMusic} setBackgroundMusic={setBackgroundMusic} />;
      case 4: return <Step4VoiceNarration selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} />;
      case 5: return <Step5SubtitleSettings subtitlesEnabled={subtitlesEnabled} setSubtitlesEnabled={setSubtitlesEnabled} subtitleStyle={subtitleStyle} setSubtitleStyle={setSubtitleStyle} />;
      case 6: return <Step6ReviewGenerate script={script} selectedVoice={selectedVoice} sceneMedia={sceneMedia} backgroundMusic={backgroundMusic} selectedMusicLabel={selectedMusicLabel} subtitleStyle={subtitleStyle} subtitlesEnabled={subtitlesEnabled} currentCredits={displayCredits} onBack={handleBack} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      default: return null;
    }
  };

  return (
    <div className="w-full" style={{ minHeight: "844px" }}>
      <CreateVideoHeader credits={displayCredits} />
      <div className="w-full max-w-277 mx-auto">
        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-300 dark:border-[#1A3155] border-t-[#3B82F6] rounded-full animate-spin" />
          </div>
        }>
          {renderStep()}
        </Suspense>
        {currentStep < TOTAL_STEPS && (
          <StepNavigation currentStep={currentStep} totalSteps={TOTAL_STEPS} onBack={handleBack} onContinue={handleContinue} />
        )}
      </div>
    </div>
  );
}