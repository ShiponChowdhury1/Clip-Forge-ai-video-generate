"use client";

import { Sparkles, Plus, Trash2, GripVertical } from "lucide-react";

interface Scene {
  id: number;
  text: string;
}

interface Step4ScriptEditorProps {
  scenes: Scene[];
  setScenes: (scenes: Scene[]) => void;
}

export default function Step4ScriptEditor({
  scenes,
  setScenes,
}: Step4ScriptEditorProps) {
  const addScene = () => {
    const newId = scenes.length > 0 ? Math.max(...scenes.map((s) => s.id)) + 1 : 1;
    setScenes([...scenes, { id: newId, text: "" }]);
  };

  const removeScene = (id: number) => {
    if (scenes.length > 1) {
      setScenes(scenes.filter((s) => s.id !== id));
    }
  };

  const updateScene = (id: number, text: string) => {
    setScenes(scenes.map((s) => (s.id === id ? { ...s, text } : s)));
  };

  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-base font-semibold">Script & Scenes</h3>
          <p className="text-gray-500 text-xs mt-1">
            Write your script for each scene or let AI generate it
          </p>
        </div>
        <button className="flex items-center gap-2 text-[#3B82F6] hover:text-[#60A5FA] text-sm font-medium transition-colors">
          <Sparkles className="w-4 h-4" />
          AI Generate
        </button>
      </div>

      {/* Scenes */}
      <div className="space-y-3">
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            className="group border border-[#1A3155] bg-[#0B0E12] rounded-xl p-4 hover:border-[#2A4A7A] transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Drag handle */}
              <div className="mt-1 text-gray-600 cursor-grab">
                <GripVertical className="w-4 h-4" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#3B82F6] text-xs font-semibold">
                    Scene {index + 1}
                  </span>
                  {scenes.length > 1 && (
                    <button
                      onClick={() => removeScene(scene.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <textarea
                  value={scene.text}
                  onChange={(e) => updateScene(scene.id, e.target.value)}
                  placeholder={`Describe what happens in scene ${index + 1}...`}
                  rows={3}
                  className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Scene */}
      <button
        onClick={addScene}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#1A3155] text-gray-500 hover:text-[#3B82F6] hover:border-[#3B82F6] transition-colors text-sm"
      >
        <Plus className="w-4 h-4" />
        Add Scene
      </button>

      {/* Scene count */}
      <p className="text-gray-500 text-xs text-center">
        {scenes.length} scene{scenes.length !== 1 ? "s" : ""} total
      </p>
    </div>
  );
}
