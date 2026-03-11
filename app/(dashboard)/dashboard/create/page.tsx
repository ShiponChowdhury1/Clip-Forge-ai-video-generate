"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CreateVideoHeader,
  StepProgress,
  StepNavigation,
  GeneratingProgress,
} from "@/app/components/dashboard/create";
import Step1TitleKeywordsScript from "@/app/components/dashboard/create/steps/Step1TitleKeywordsScript";
import Step2FormatStyleMedia from "@/app/components/dashboard/create/steps/Step2FormatStyleMedia";
import Step3BackgroundMusic from "@/app/components/dashboard/create/steps/Step3BackgroundMusic";
import Step4VoiceNarration from "@/app/components/dashboard/create/steps/Step4VoiceNarration";
import Step5SubtitleSettings from "@/app/components/dashboard/create/steps/Step5SubtitleSettings";
import Step6ReviewGenerate from "@/app/components/dashboard/create/steps/Step6ReviewGenerate";
import { useCreateVideoMutation } from "@/lib/redux/features/videos/videosApi";
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
  const [generationSteps, setGenerationSteps] = useState([
    { label: "Generating Prompts", completed: false, active: true },
    { label: "Creating Image", completed: false, active: false },
    { label: "Creating narration", completed: false, active: false },
    { label: "Building Video", completed: false, active: false },
  ]);

  const [createVideo] = useCreateVideoMutation();
  const token = useSelector((state: { auth: { token: string | null } }) => state.auth.token);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      const videoId = createResponse?.id || createResponse?.video_id;

      console.log("[Polling] Create response:", JSON.stringify(createResponse));
      console.log("[Polling] Extracted - jobId:", jobId, "videoId:", videoId);

      if (videoId) setGeneratedVideoId(videoId);
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
                vid = data?.video_id ?? data?.id ?? null;
              } else {
                console.warn("[Poll] job-status HTTP", resp.status);
              }
            } catch (e) {
              console.warn("[Poll] job-status error:", e);
            }
          }

          // Strategy 2: video get endpoint (needs auth)
          const checkVid = vid || videoId;
          if (!status && checkVid && token) {
            try {
              const resp = await fetch(`${apiBase}/videos/get/${checkVid}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (resp.ok) {
                const data = await resp.json();
                console.log("[Poll] video-get:", JSON.stringify(data));
                status = String(data?.status || "");
                vid = data?.id ?? null;
              }
            } catch (e) {
              console.warn("[Poll] video-get error:", e);
            }
          }

          if (vid) setGeneratedVideoId(vid);

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

      // Map subtitle_id back to SubtitleStyle
      if (d.subtitle_id) {
        const found = subtitleStyles.find((s) => s.id === d.subtitle_id);
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
    const requestBody = {
      title: videoTitle,
      script,
      format: videoFormat,
      style: videoStyle,
      voice: selectedVoice,
      category: videoStyle,
      media_option:
        sceneMedia === "all-images" ? "all_images"
        : sceneMedia === "first-scene-video" ? "first_scene"
        : sceneMedia === "last-scene-video" ? "last_scene"
        : "first_and_last_scene",
      subtitle_id: subtitleStyles.find((s) => s.value === subtitleStyle)?.id ?? 1,
      keywords,
      negative_keywords: negativeKeywords,
      music_id: backgroundMusic === "no-music" ? 0 : Number(backgroundMusic),
    };

    console.log("[Create Video] Request body:", requestBody);

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const response = await createVideo(requestBody).unwrap();
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
      alert(err.data?.detail || "Failed to create video");
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
            if (generationComplete && generatedVideoId) {
              router.push(`/dashboard/videos/${generatedVideoId}`);
            } else if (generationComplete) {
              router.push("/dashboard/videos");
            }
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
            script={script}
            setScript={setScript}
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
      <CreateVideoHeader credits={450} />

      {/* Rest of content - constrained width */}
      <div className="w-full max-w-[1108px] mx-auto">
        {/* Step Progress */}
        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Current Step Content */}
        {renderStep()}

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
