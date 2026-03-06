"use client";

import { useState } from "react";
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

import type { SceneMediaOption, VideoStyleOption, VideoFormat } from "@/app/components/dashboard/create/steps/Step2FormatStyleMedia";
import type { MusicOption } from "@/app/components/dashboard/create/steps/Step3BackgroundMusic";
import type { VoiceId } from "@/app/components/dashboard/create/steps/Step4VoiceNarration";
import type { SubtitleStyle } from "@/app/components/dashboard/create/steps/Step5SubtitleSettings";

const TOTAL_STEPS = 6;

export default function CreateVideoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationSteps, setGenerationSteps] = useState([
    { label: "Generating Prompts", completed: false, active: true },
    { label: "Creating Image", completed: false, active: false },
    { label: "Creating narration", completed: false, active: false },
    { label: "Building Video", completed: false, active: false },
  ]);

  const [createVideo] = useCreateVideoMutation();

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
      subtitle_id: subtitlesEnabled && subtitleStyle !== "none"
        ? ["classic-white", "modern-box", "minimal-light", "yellow-highlight", "gradient"].indexOf(subtitleStyle) + 1
        : 0,
      keywords,
      negative_keywords: negativeKeywords,
      music_id: backgroundMusic === "no-music" ? 0 : Number(backgroundMusic),
    };

    console.log("[Create Video] Request body:", requestBody);

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const response = await createVideo(requestBody).unwrap();
      console.log("[Create Video] API success:", response);
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

    // Simulate generation progress
    const stepLabels = [
      "Generating Prompts",
      "Creating Image",
      "Creating narration",
      "Building Video",
    ];

    let currentGenStep = 0;
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        const next = Math.min(prev + 2, 100);
        const stepThreshold = ((currentGenStep + 1) / stepLabels.length) * 100;

        if (next >= stepThreshold && currentGenStep < stepLabels.length) {
          setGenerationSteps((prevSteps) =>
            prevSteps.map((s, i) => ({
              ...s,
              completed: i <= currentGenStep,
              active: i === currentGenStep + 1,
            }))
          );
          currentGenStep++;
        }

        if (next >= 100) {
          clearInterval(interval);
        }
        return next;
      });
    }, 200);
  };

  // Show generating progress screen
  if (isGenerating) {
    return (
      <div className="w-full max-w-[1108px] mx-auto" style={{ minHeight: "844px" }}>
        <GeneratingProgress
          progress={generationProgress}
          steps={generationSteps}
          onBack={handleBack}
          onNext={() => {
            // Navigate to video page after completion
            setIsGenerating(false);
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
    <div className="w-full max-w-[1108px] mx-auto" style={{ minHeight: "844px" }}>
      {/* Header */}
      <CreateVideoHeader credits={450} />

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
  );
}
