"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  useDeleteCreditPackageMutation,
  useCreateCreditPackageMutation,
  useGetCreditPackagesQuery,
  useUpdateCreditPackageMutation,
} from "@/lib/redux/features/admin/adminApi";

export function CreditSettings() {
  const { data: packages = [], isLoading, refetch } = useGetCreditPackagesQuery();
  const [createCreditPackage, { isLoading: isCreating }] = useCreateCreditPackageMutation();
  const [updateCreditPackage, { isLoading: isUpdating }] = useUpdateCreditPackageMutation();
  const [deleteCreditPackage] = useDeleteCreditPackageMutation();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [price, setPrice] = useState("");
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setCredits("");
    setPrice("");
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (id: number, packageName: string, packageCredits: number, packagePrice: number) => {
    setEditingId(id);
    setName(packageName);
    setCredits(String(packageCredits));
    setPrice(String(packagePrice));
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormError("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setFormError("Package name is required.");
      return;
    }

    const parsedCredits = Number(credits);
    const parsedPrice = Number(price);

    if (!Number.isFinite(parsedCredits) || parsedCredits <= 0) {
      setFormError("Credits must be a positive number.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setFormError("Price must be a positive number.");
      return;
    }

    setFormError("");

    try {
      if (editingId !== null) {
        await updateCreditPackage({
          id: editingId,
          body: {
            name: name.trim(),
            credits: parsedCredits,
            price: parsedPrice,
          },
        }).unwrap();
        toast.success("Credit package updated successfully.");
      } else {
        await createCreditPackage({
          name: name.trim(),
          credits: parsedCredits,
          price: parsedPrice,
        }).unwrap();
        toast.success("New credit package added successfully.");
      }
      refetch();
      closeModal();
    } catch (error: unknown) {
      const message =
        (error as { data?: { detail?: string } })?.data?.detail ||
        (editingId !== null ? "Failed to update credit package." : "Failed to add credit package.");
      setFormError(message);
      toast.error(message);
    }
  };

  const handleDelete = async (id: number) => {
    const existing = packages.find((pkg) => pkg.id === id);
    try {
      await deleteCreditPackage(id).unwrap();
      toast.success(`"${existing?.name || "Package"}" deleted successfully.`);
      setDeletingId(null);
      refetch();
    } catch (error: unknown) {
      const message =
        (error as { data?: { detail?: string } })?.data?.detail ||
        "Failed to delete credit package.";
      toast.error(message);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#1A3155]">
              <h3 className="text-gray-900 dark:text-white text-lg font-bold">
                {editingId !== null ? "Edit Credit Package" : "Add New Credit"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {formError && (
                <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                  {formError}
                </p>
              )}

              <div>
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                  Package Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Creator Pack"
                  className="w-full bg-gray-100 dark:bg-[#0A0F18] border border-gray-300 dark:border-[#1A3155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                    Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    placeholder="500"
                    className="w-full bg-gray-100 dark:bg-[#0A0F18] border border-gray-300 dark:border-[#1A3155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="39.99"
                    className="w-full bg-gray-100 dark:bg-[#0A0F18] border border-gray-300 dark:border-[#1A3155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-[#1A3155]">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-[#0A0F18] border border-gray-300 dark:border-[#1A3155] text-sm text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isCreating || isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium disabled:opacity-60"
              >
                {isCreating || isUpdating
                  ? editingId !== null
                    ? "Saving..."
                    : "Adding..."
                  : editingId !== null
                    ? "Save Changes"
                    : "Add New Credit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-gray-900 dark:text-white text-xl font-bold">Credit Packages</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Manage packages used in Buy Credits across dashboard.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Credit
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-14">
            <div className="w-8 h-8 border-4 border-gray-300 dark:border-[#1A3155] border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : packages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-10">No credit packages found.</p>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="space-y-0">
                <div className="bg-gray-50 dark:bg-[#0A0F18] border border-gray-200 dark:border-[#1A3155] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{pkg.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      Added on {formatDate(pkg.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-5">
                    <p className="text-cyan-500 text-sm font-semibold">{pkg.credits.toLocaleString()} credits</p>
                    <p className="text-gray-900 dark:text-white text-sm font-semibold">${pkg.price}</p>
                    <button
                      onClick={() => openEditModal(pkg.id, pkg.name, pkg.credits, pkg.price)}
                      className="text-gray-400 hover:text-cyan-400 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A2332]"
                      title="Edit credit package"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(deletingId === pkg.id ? null : pkg.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
                      title="Delete credit package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {deletingId === pkg.id && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl mt-1 px-4 py-3 flex items-center justify-between gap-3">
                    <p className="text-red-400 text-sm">
                      Delete <span className="font-semibold">&quot;{pkg.name}&quot;</span>? This action cannot be undone.
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#0A0F18] border border-gray-300 dark:border-[#1A3155] text-xs text-gray-700 dark:text-gray-300 hover:border-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-xs text-white font-medium transition-colors"
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
