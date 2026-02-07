"use client";

import { useState } from "react";
import {
  CreateVideoHeader,
  StepProgress,
  StepNavigation,
  GeneratingProgress,
} from "@/app/components/dashboard/create";
import Step1VideoDetails from "@/app/components/dashboard/create/steps/Step1VideoDetails";
import Step2VideoStyle from "@/app/components/dashboard/create/steps/Step2VideoStyle";
import Step3VoiceScript from "@/app/components/dashboard/create/steps/Step3VoiceScript";
import Step4MusicFormat from "@/app/components/dashboard/create/steps/Step4MusicFormat";
import Step5Subtitles from "@/app/components/dashboard/create/steps/Step5Subtitles";
import Step6Review from "@/app/components/dashboard/create/steps/Step6Review";

import type { SceneMediaOption } from "@/app/components/dashboard/create/steps/Step1VideoDetails";
import type { VideoStyleOption } from "@/app/components/dashboard/create/steps/Step2VideoStyle";
import type { VoiceId } from "@/app/components/dashboard/create/steps/Step3VoiceScript";
import type { MusicOption, VideoFormat } from "@/app/components/dashboard/create/steps/Step4MusicFormat";
import type { SubtitleStyle } from "@/app/components/dashboard/create/steps/Step5Subtitles";

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

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);

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
      <div>
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
          <Step1VideoDetails
            videoTitle={videoTitle}
            setVideoTitle={setVideoTitle}
            keywords={keywords}
            setKeywords={setKeywords}
            negativeKeywords={negativeKeywords}
            setNegativeKeywords={setNegativeKeywords}
            sceneMedia={sceneMedia}
            setSceneMedia={setSceneMedia}
          />
        );
      case 2:
        return (
          <Step4MusicFormat
            backgroundMusic={backgroundMusic}
            setBackgroundMusic={setBackgroundMusic}
            videoFormat={videoFormat}
            setVideoFormat={setVideoFormat}
          />
        );
      case 3:
        return (
          <Step2VideoStyle
            videoStyle={videoStyle}
            setVideoStyle={setVideoStyle}
            sceneMedia={sceneMedia}
            setSceneMedia={setSceneMedia}
          />
        );
      case 4:
        return (
          <Step3VoiceScript
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
            script={script}
            setScript={setScript}
          />
        );
      case 5:
        return (
          <Step5Subtitles
            subtitlesEnabled={subtitlesEnabled}
            setSubtitlesEnabled={setSubtitlesEnabled}
            subtitleStyle={subtitleStyle}
            setSubtitleStyle={setSubtitleStyle}
          />
        );
      case 6:
        return (
          <Step6Review
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
    <div>
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
