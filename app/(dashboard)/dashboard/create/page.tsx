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

import type { SceneMediaOption, VideoStyleOption, VideoFormat } from "@/app/components/dashboard/create/steps/Step2FormatStyleMedia";
import type { MusicOption } from "@/app/components/dashboard/create/steps/Step3BackgroundMusic";
import type { VoiceId } from "@/app/components/dashboard/create/steps/Step4VoiceNarration";
import type { SubtitleStyle } from "@/app/components/dashboard/create/steps/Step5SubtitleSettings";
import { subtitleStyles } from "@/app/components/dashboard/create/steps/Step5SubtitleSettings";

const TOTAL_STEPS = 6;

export default function CreateVideoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [generatedVideoId, setGeneratedVideoId] = useState<number | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [editSourceVideoId, setEditSourceVideoId] = useState<number | null>(null);
  const [generationSteps, setGenerationSteps] = useState([
    { label: "Generating Prompts", completed: false, active: true },
    { label: "Creating Image", completed: false, active: false },
    { label: "Creating narration", completed: false, active: false },
    { label: "Building Video", completed: false, active: false },
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
    if (typeof value === "string" && /^\d+$/.test(value.trim())) {
      return Number(value);
    }
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

      const data = (await resp.json()) as Array<{
        id: number;
        title?: string;
        status?: string;
        created_at?: string;
      }>;

      const completed = data
        .filter((video) => String(video.status || "").toLowerCase() === "completed")
        .sort(
          (a, b) =>
            new Date(String(b.created_at || "1970-01-01T00:00:00Z")).getTime() -
            new Date(String(a.created_at || "1970-01-01T00:00:00Z")).getTime()
        );

      const normalizedTargetTitle = String(targetTitle || "").trim().toLowerCase();
      const titleMatched = normalizedTargetTitle
        ? completed.find(
            (video) => String(video.title || "").trim().toLowerCase() === normalizedTargetTitle
          )
        : undefined;

      return titleMatched?.id ?? completed[0]?.id ?? null;
    } catch {
      return null;
    }
  }, [token]);

  const handleViewGeneratedVideo = useCallback(async (targetTitle?: string) => {
    if (!generationComplete) return;

    if (generatedVideoId) {
      router.push(`/dashboard/videos/${generatedVideoId}`);
      return;
    }

    const resolvedId = await resolveLatestCompletedVideoId(targetTitle);
    if (resolvedId) {
      router.push(`/dashboard/videos/${resolvedId}`);
      return;
    }

    router.push("/dashboard/videos");
  }, [generationComplete, generatedVideoId, resolveLatestCompletedVideoId, router]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const startPolling = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (createResponse: any) => {
      const jobId = createResponse?.job_id || createResponse?.jobId;
      const videoId = normalizeVideoId(createResponse?.id ?? createResponse?.video_id);

      console.log("[Polling] Create response:", JSON.stringify(createResponse));
      console.log("[Polling] Extracted - jobId:", jobId, "videoId:", videoId);

      if (videoId !== null) setGeneratedVideoId(videoId);
      setGenerationProgress(5);

      const apiBase =
        (process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api") +
        "/v1";
      let tick = 0;
      let busy = false;

      pollingRef.current = setInterval(async () => {
        if (busy) return;
        busy = true;
        tick++;

        try {
          let status = "";
          let vid: number | null = null;

          // Strategy 1: job-status endpoint (no auth required)
          if (jobId) {
            try {
              const resp = await fetch(
                `${apiBase}/videos/job-status/${jobId}`
              );
              if (resp.ok) {
                const data = await resp.json();
                console.log("[Poll] job-status:", JSON.stringify(data));
                status = String(data?.status || data?.state || "");
                vid = normalizeVideoId(data?.video_id ?? data?.id);
              } else {
                console.warn("[Poll] job-status HTTP", resp.status);
              }
            } catch (e) {
              console.warn("[Poll] job-status error:", e);
            }
          }

          // Strategy 2: video get endpoint (needs auth)
          const checkVid = vid ?? videoId;
          if (!status && checkVid && token) {
            try {
              const resp = await fetch(`${apiBase}/videos/get/${checkVid}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (resp.ok) {
                const data = await resp.json();
                console.log("[Poll] video-get:", JSON.stringify(data));
                status = String(data?.status || "");
                vid = normalizeVideoId(data?.id);
              }
            } catch (e) {
              console.warn("[Poll] video-get error:", e);
            }
          }

          if (vid !== null) setGeneratedVideoId(vid);

          const s = status.toLowerCase().replace(/[\s-]+/g, "_").trim();

          if (s === "completed" || s === "done") {
            setGenerationProgress(100);
            setGenerationComplete(true);
            setGenerationSteps((prev) =>
              prev.map((step) => ({
                ...step,
                completed: true,
                active: false,
              }))
            );
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
            return;
          }

          if (s === "failed" || s === "error") {
            setGenerationError(
              "Video generation failed. Please try again."
            );
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
            return;
          }

          // In-progress: smooth time-based progress (5% → 90% over ~45 polls)
          const progress = Math.min(5 + tick * 2, 90);
          setGenerationProgress(progress);

          // Animate steps based on progress
          const stepIdx = Math.min(Math.floor(progress / 25), 3);
          setGenerationSteps((prev) =>
            prev.map((step, i) => ({
              ...step,
              completed: i < stepIdx,
              active: i === stepIdx,
            }))
          );
        } catch (err) {
          console.error("[Poll] Unexpected:", err);
        } finally {
          busy = false;
        }
      }, 3000);
    },
    [token]
  );

  // Step 1 - Video Details
  const [videoTitle, setVideoTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [negativeKeywords, setNegativeKeywords] = useState("");
  const [sceneMedia, setSceneMedia] = useState<SceneMediaOption>("all-images");

  // Step 2 - Video Style
  const [videoStyle, setVideoStyle] = useState<VideoStyleOption>("3d-cartoon");

  // Step 3 - Voice & Script
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>("hope");
  const [script, setScript] = useState("");

  // Step 4 - Music & Format
  const [backgroundMusic, setBackgroundMusic] = useState<MusicOption>("no-music");
  const [videoFormat, setVideoFormat] = useState<VideoFormat>("9:16");

  // Step 5 - Subtitles
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>("none");

  // Pre-fill from Edit & Regenerate
  useEffect(() => {
    const raw = sessionStorage.getItem("editVideoData");
    if (!raw) return;
    sessionStorage.removeItem("editVideoData");
    try {
      const d = JSON.parse(raw);
      if (typeof d.source_video_id === "number" && Number.isFinite(d.source_video_id)) {
        setEditSourceVideoId(d.source_video_id);
      }
      if (d.title) setVideoTitle(d.title);
      if (d.script) setScript(d.script);
      if (d.keywords) setKeywords(d.keywords);
      if (d.negative_keywords) setNegativeKeywords(d.negative_keywords);
      if (d.format) setVideoFormat(d.format as VideoFormat);
      if (d.style) setVideoStyle(d.style as VideoStyleOption);
      if (d.voice) setSelectedVoice(d.voice as VoiceId);

      // Map media_option back to frontend value
      const mediaMap: Record<string, SceneMediaOption> = {
        all_images: "all-images",
        first_scene: "first-scene-video",
        last_scene: "last-scene-video",
        first_and_last_scene: "first-last-scene-video",
      };
      if (d.media_option && mediaMap[d.media_option]) setSceneMedia(mediaMap[d.media_option]);

      // Map backend subtitle_id to UI selection. Null/0 means subtitles disabled.
      const incomingSubtitleId =
        typeof d.subtitle_id === "number" ? d.subtitle_id : null;
      if (incomingSubtitleId === null || incomingSubtitleId === 0) {
        setSubtitleStyle("none");
        setSubtitlesEnabled(false);
      } else {
        const found = subtitleStyles.find((s) => s.id === incomingSubtitleId);
        if (found) {
          setSubtitleStyle(found.value);
          setSubtitlesEnabled(found.value !== "none");
        }
      }

      // Map music_id
      if (d.music_id && d.music_id > 0) {
        setBackgroundMusic(String(d.music_id));
      }
    } catch {}
  }, []);

  const handleBack = () => {
    if (isGenerating) {
      setIsGenerating(false);
      return;
    }
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleContinue = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleGenerate = async () => {
    const mediaOption =
      sceneMedia === "all-images" ? "all_images"
      : sceneMedia === "first-scene-video" ? "first_scene"
      : sceneMedia === "last-scene-video" ? "last_scene"
      : "first_and_last_scene";

    const selectedSubtitle = subtitleStyles.find((s) => s.value === subtitleStyle);
    const subtitleId = subtitlesEnabled && subtitleStyle !== "none"
      ? (selectedSubtitle?.id ?? null)
      : null;
    const parsedMusicId = backgroundMusic === "no-music" ? 0 : Number(backgroundMusic);
    const validMusicIds = new Set(musicList.map((item) => item.id));
    const musicId = Number.isFinite(parsedMusicId) && validMusicIds.has(parsedMusicId)
      ? parsedMusicId
      : 0;

    const createRequestBody = {
      title: videoTitle,
      script,
      format: videoFormat,
      style: videoStyle,
      voice: selectedVoice,
      category: videoStyle,
      media_option: mediaOption,
      subtitle_id: subtitleId,
      keywords,
      negative_keywords: negativeKeywords,
      music_id: musicId,
    };

    const updateRequestBody = {
      title: videoTitle,
      script,
      format: videoFormat,
      style: videoStyle,
      voice: selectedVoice,
      media_option: mediaOption,
      subtitle_id: subtitleId,
      keywords,
      negative_keywords: negativeKeywords,
      music_id: musicId,
    };

    console.log("[Create Video] Request body:", editSourceVideoId ? updateRequestBody : createRequestBody);

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const response = editSourceVideoId
        ? await updateVideo({ id: editSourceVideoId, body: updateRequestBody }).unwrap()
        : await createVideo(createRequestBody).unwrap();
      console.log("[Create Video] API success:", JSON.stringify(response));

      // Start polling with full response (handles job_id, id, video_id)
      startPolling(response);
    } catch (error: unknown) {
      const err = error as { status?: number; data?: { detail?: string } };
      console.error("[Create Video] API failed:", { status: err.status, detail: err.data?.detail, full: err });
      setIsGenerating(false);
      if (err.status === 401) {
        alert("Session expired. Please login again.");
        return;
      }
      alert(err.data?.detail || (editSourceVideoId ? "Failed to regenerate video" : "Failed to create video"));
      return;
    }
  };

  // Show generating progress screen
  if (isGenerating) {
    return (
      <div className="w-full mx-auto" style={{ minHeight: "844px" }}>
        <GeneratingProgress
          progress={generationProgress}
          steps={generationSteps}
          error={generationError}
          onBack={() => {
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
            setIsGenerating(false);
            setGenerationProgress(0);
            setGenerationComplete(false);
            setGenerationError(null);
            setGenerationSteps([
              { label: "Generating Prompts", completed: false, active: true },
              { label: "Creating Image", completed: false, active: false },
              { label: "Creating narration", completed: false, active: false },
              { label: "Building Video", completed: false, active: false },
            ]);
          }}
          onNext={() => {
            void handleViewGeneratedVideo(videoTitle);
          }}
        />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1TitleKeywordsScript
            videoTitle={videoTitle}
            setVideoTitle={setVideoTitle}
            keywords={keywords}
            setKeywords={setKeywords}
            negativeKeywords={negativeKeywords}
            setNegativeKeywords={setNegativeKeywords}
            script={script}
            setScript={setScript}
          />
        );
      case 2:
        return (
          <Step2FormatStyleMedia
            videoFormat={videoFormat}
            setVideoFormat={setVideoFormat}
            videoStyle={videoStyle}
            setVideoStyle={setVideoStyle}
            sceneMedia={sceneMedia}
            setSceneMedia={setSceneMedia}
          />
        );
      case 3:
        return (
          <Step3BackgroundMusic
            backgroundMusic={backgroundMusic}
            setBackgroundMusic={setBackgroundMusic}
          />
        );
      case 4:
        return (
          <Step4VoiceNarration
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
          />
        );
      case 5:
        return (
          <Step5SubtitleSettings
            subtitlesEnabled={subtitlesEnabled}
            setSubtitlesEnabled={setSubtitlesEnabled}
            subtitleStyle={subtitleStyle}
            setSubtitleStyle={setSubtitleStyle}
          />
        );
      case 6:
        return (
          <Step6ReviewGenerate
            script={script}
            selectedVoice={selectedVoice}
            sceneMedia={sceneMedia}
            backgroundMusic={backgroundMusic}
            subtitleStyle={subtitleStyle}
            subtitlesEnabled={subtitlesEnabled}
            currentCredits={displayCredits}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full" style={{ minHeight: "844px" }}>
      {/* Header - full width */}
      <CreateVideoHeader credits={displayCredits} />

      {/* Rest of content - constrained width */}
      <div className="w-full max-w-[1108px] mx-auto">
        {/* Step Progress */}
        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Current Step Content */}
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-300 dark:border-[#1A3155] border-t-[#3B82F6] rounded-full animate-spin" />
          </div>
        }>
          {renderStep()}
        </Suspense>

        {/* Navigation - hidden on Step 6 since it has its own Generate button */}
        {currentStep < TOTAL_STEPS && (
          <StepNavigation
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onBack={handleBack}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}
