"use client";

import { useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Link,
  Quote,
  Code,
  ImageIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Palette,
  Highlighter,
} from "lucide-react";

const TEXT_COLORS = [
  "#ffffff", "#e2e8f0", "#94a3b8", "#64748b", "#ef4444", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1",
  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#fb923c",
  "#facc15", "#4ade80",
];

const HIGHLIGHT_COLORS = [
  "transparent", "#fef08a", "#bbf7d0", "#bae6fd", "#c4b5fd", "#fbcfe8",
  "#fed7aa", "#fecaca", "#d9f99d", "#99f6e4", "#e0e7ff", "#fde68a",
  "#a5f3fc", "#c7d2fe", "#fca5a5", "#86efac", "#7dd3fc", "#d8b4fe",
  "#f9a8d4", "#fdba74",
];

function ToolButton({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${
        active ? "bg-cyan-500/20 text-cyan-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1A2332]"
      }`}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="w-px h-6 bg-gray-300 dark:bg-[#1A3155] mx-1" />;
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const highlightPickerRef = useRef<HTMLInputElement>(null);
  const lastAppliedValueRef = useRef("");

  // Sync external value into contentEditable without resetting cursor on each keystroke.
  useEffect(() => {
    if (!editorRef.current) return;
    if (value !== lastAppliedValueRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      lastAppliedValueRef.current = value;
    }
  }, [value]);

  const exec = useCallback((command: string, commandValue?: string) => {
    document.execCommand(command, false, commandValue);
    editorRef.current?.focus();
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastAppliedValueRef.current = html;
      onChange(html);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastAppliedValueRef.current = html;
      onChange(html);
    }
  }, [onChange]);

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      exec("createLink", url);
    }
  }, [exec]);

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      exec("insertImage", url);
    }
  }, [exec]);

  return (
    <div className="border border-gray-300 dark:border-[#1A3155] rounded-xl overflow-hidden bg-gray-50 dark:bg-[#0A0F18]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-100 dark:bg-[#0D1117] border-b border-gray-300 dark:border-[#1A3155]">
        {/* Headings */}
        <ToolButton onClick={() => exec("formatBlock", "<h1>")} title="Heading 1">
          <Heading1 className="w-4 h-4" />
        </ToolButton>
        <ToolButton onClick={() => exec("formatBlock", "<h2>")} title="Heading 2">
          <Heading2 className="w-4 h-4" />
        </ToolButton>

        <Separator />

        {/* Text formatting */}
        <ToolButton onClick={() => exec("bold")} title="Bold">
          <Bold className="w-4 h-4" />
        </ToolButton>
        <ToolButton onClick={() => exec("italic")} title="Italic">
          <Italic className="w-4 h-4" />
        </ToolButton>
        <ToolButton onClick={() => exec("underline")} title="Underline">
          <Underline className="w-4 h-4" />
        </ToolButton>
        <ToolButton onClick={() => exec("strikeThrough")} title="Strikethrough">
          <Strikethrough className="w-4 h-4" />
        </ToolButton>

        <Separator />

        {/* Insert */}
        <ToolButton onClick={insertLink} title="Insert Link">
          <Link className="w-4 h-4" />
        </ToolButton>
        <ToolButton onClick={() => exec("formatBlock", "<blockquote>")} title="Quote">
          <Quote className="w-4 h-4" />
        </ToolButton>
        <ToolButton onClick={() => exec("formatBlock", "<pre>")} title="Code Block">
          <Code className="w-4 h-4" />
        </ToolButton>
        <ToolButton onClick={insertImage} title="Insert Image">
          <ImageIcon className="w-4 h-4" />
        </ToolButton>

        <Separator />

        {/* Lists */}
        <ToolButton onClick={() => exec("insertUnorderedList")} title="Bullet List">
          <List className="w-4 h-4" />
        </ToolButton>
        <ToolButton onClick={() => exec("insertOrderedList")} title="Numbered List">
          <ListOrdered className="w-4 h-4" />
        </ToolButton>

        <Separator />

        {/* Alignment */}
        <ToolButton onClick={() => exec("justifyLeft")} title="Align Left">
          <AlignLeft className="w-4 h-4" />
        </ToolButton>
        <ToolButton onClick={() => exec("justifyCenter")} title="Align Center">
          <AlignCenter className="w-4 h-4" />
        </ToolButton>
        <ToolButton onClick={() => exec("justifyRight")} title="Align Right">
          <AlignRight className="w-4 h-4" />
        </ToolButton>

        <Separator />

        {/* Text Color */}
        <div className="relative group">
          <ToolButton onClick={() => colorPickerRef.current?.click()} title="Text Color">
            <Palette className="w-4 h-4" />
          </ToolButton>
          <div className="absolute left-0 top-full mt-1 z-30 hidden group-hover:block bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg p-2 shadow-xl">
            <div className="grid grid-cols-5 gap-1 w-32.5">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => exec("foreColor", color)}
                  className="w-5 h-5 rounded border border-gray-300 dark:border-[#1A3155] hover:scale-125 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Highlight Color */}
        <div className="relative group">
          <ToolButton onClick={() => highlightPickerRef.current?.click()} title="Highlight Color">
            <Highlighter className="w-4 h-4" />
          </ToolButton>
          <div className="absolute left-0 top-full mt-1 z-30 hidden group-hover:block bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-lg p-2 shadow-xl">
            <div className="grid grid-cols-5 gap-1 w-32.5">
              {HIGHLIGHT_COLORS.map((color, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => exec("hiliteColor", color)}
                  className="w-5 h-5 rounded border border-gray-300 dark:border-[#1A3155] hover:scale-125 transition-transform"
                  style={{ backgroundColor: color === "transparent" ? "#1A2332" : color }}
                  title={color === "transparent" ? "None" : color}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Undo / Redo */}
        <ToolButton onClick={() => exec("undo")} title="Undo">
          <Undo className="w-4 h-4" />
        </ToolButton>
        <ToolButton onClick={() => exec("redo")} title="Redo">
          <Redo className="w-4 h-4" />
        </ToolButton>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-75 max-h-150 overflow-y-auto px-6 py-5 text-gray-700 dark:text-gray-300 text-sm leading-relaxed focus:outline-none
          [&_h1]:text-gray-900 dark:[&_h1]:text-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-4
          [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-3
          [&_a]:text-cyan-400 [&_a]:underline [&_a]:hover:text-cyan-300
          [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500/50 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:text-gray-500 dark:[&_blockquote]:text-gray-400 [&_blockquote]:italic
          [&_pre]:bg-gray-100 dark:[&_pre]:bg-[#0D1117] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-3 [&_pre]:text-emerald-400 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto
          [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3
          [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-1 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-1 [&_ol]:my-2
          [&_li]:text-gray-700 dark:[&_li]:text-gray-300
          [&_p]:my-1.5"
      />
    </div>
  );
}
