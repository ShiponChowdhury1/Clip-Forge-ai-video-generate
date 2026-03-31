"use client";

import { useMemo, useState } from "react";
import { MessageCircleQuestion, Plus, Send, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  useCreateAdminFaqMutation,
  useDeleteAdminFaqMutation,
  useGetAdminFaqQuery,
  useUpdateAdminFaqMutation,
} from "@/lib/redux/features/admin/adminApi";

export function FAQQuestions() {
  const token = useAppSelector((state) => state.auth.token);
  const { data: faqItems = [], isLoading } = useGetAdminFaqQuery({ skip: 0, limit: 50 }, { skip: !token });
  const [createFaq, { isLoading: isSaving }] = useCreateAdminFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateAdminFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteAdminFaqMutation();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  const sortedFaq = useMemo(
    () => [...faqItems].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
    [faqItems]
  );

  const handleCreate = async () => {
    const q = question.trim();
    const a = answer.trim();

    if (!q || !a) {
      toast.error("Please provide both question and answer.");
      return;
    }

    try {
      await createFaq({ Question: q, Answer: a }).unwrap();
      setQuestion("");
      setAnswer("");
      setIsAddModalOpen(false);
      toast.success("FAQ added successfully!");
    } catch {
      toast.error("Failed to add FAQ. Please try again.");
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startEdit = (id: number, currentQuestion: string, currentAnswer: string) => {
    setEditingId(id);
    setEditQuestion(currentQuestion);
    setEditAnswer(currentAnswer);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const handleUpdate = async (id: number) => {
    const q = editQuestion.trim();
    const a = editAnswer.trim();

    if (!q || !a) {
      toast.error("Question and answer cannot be empty.");
      return;
    }

    try {
      await updateFaq({ id, Question: q, Answer: a }).unwrap();
      toast.success("FAQ updated successfully!");
      cancelEdit();
    } catch {
      toast.error("Failed to update FAQ. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFaq(id).unwrap();
      toast.success("FAQ deleted successfully!");
      if (editingId === id) cancelEdit();
    } catch {
      toast.error("Failed to delete FAQ. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <MessageCircleQuestion className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="text-gray-900 dark:text-white text-xl sm:text-2xl font-bold">FAQ Questions</h2>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-gray-300 dark:border-[#1A3155] border-t-[#3B82F6] rounded-full animate-spin" />
          </div>
        ) : sortedFaq.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No FAQ found yet.</p>
        ) : (
          <div className="space-y-4">
            {sortedFaq.map((faq) => (
              <div key={faq.id} className="rounded-xl border border-gray-200 dark:border-[#1A3155] bg-gray-50 dark:bg-[#0A0F18] p-4 sm:p-5">
                {editingId === faq.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-[#1A3155] bg-white dark:bg-[#0D1117] text-gray-900 dark:text-white text-sm outline-none focus:border-[#3B82F6]"
                    />
                    <textarea
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#1A3155] bg-white dark:bg-[#0D1117] text-gray-900 dark:text-white text-sm outline-none focus:border-[#3B82F6] resize-y"
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base mb-2">
                      Q: {faq.Question}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      A: {faq.Answer}
                    </p>
                  </>
                )}

                <div className="flex items-center justify-between mt-3 gap-3">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Updated: {formatDate(faq.updated_at)}
                  </p>

                  {editingId === faq.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdate(faq.id)}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-60 text-white text-xs font-medium"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 dark:border-[#1A3155] text-gray-700 dark:text-gray-300 text-xs font-medium hover:border-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(faq.id, faq.Question, faq.Answer)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 dark:border-[#1A3155] text-gray-600 dark:text-gray-300 hover:text-[#3B82F6] hover:border-[#3B82F6] transition-colors"
                        title="Edit FAQ"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 dark:border-[#1A3155] text-gray-600 dark:text-gray-300 hover:text-red-500 hover:border-red-500 disabled:opacity-60 transition-colors"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold">Add FAQ</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 dark:border-[#1A3155] text-gray-600 dark:text-gray-300 hover:text-red-500 hover:border-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type a frequently asked question"
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 dark:border-[#1A3155] bg-white dark:bg-[#0A0F18] text-gray-900 dark:text-white text-sm outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Answer</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write the answer here"
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#1A3155] bg-white dark:bg-[#0A0F18] text-gray-900 dark:text-white text-sm outline-none focus:border-[#3B82F6] transition-colors resize-y"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreate}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                  {isSaving ? "Saving..." : "Add FAQ"}
                </button>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="inline-flex items-center gap-2 border border-gray-300 dark:border-[#1A3155] text-gray-700 dark:text-gray-300 text-sm font-medium px-5 py-2.5 rounded-lg hover:border-red-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}