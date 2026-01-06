"use client";

import { useState } from "react";
import { addReport } from "../service/services_report";
import { Customer } from "../models";
import { useToast } from "@/components/ToastContect";

interface AddReportModalProps {
  show: boolean;
  onClose: () => void;
  update: () => void;
  user: Customer;
}

export default function AddReportModal({ show, onClose, update, user }: AddReportModalProps) {
  const [form, setForm] = useState<{
    customer_key: string;
    report_type: string;
    broken_type: string;
    complain_des: string;
    broken_des: string;
    image: File | null;
  }>({
    customer_key: user?._id,
    report_type: "FK",
    broken_type: "SP",
    complain_des: "",
    broken_des: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
      
  const { showToast } = useToast();


  const handleReportTypeChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      report_type: value,
      broken_type: value === "K" ? "" : "SP",
      complain_des: "",
      broken_des: "",
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file)); // buat preview
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("report_type", form.report_type);
      formData.append("customer_key", user._id);
      formData.append("broken_type", form.broken_type);
      formData.append("complain_des", form.complain_des);
      formData.append("broken_des", form.broken_des);
      

      if (form.image) {
        formData.append("image", form.image);
      }

      await addReport(formData);

         showToast("success", " Report berhasil dikirim!");

      // reset form
      setForm({
        customer_key: "",
        report_type: "FK",
        broken_type: "SP",
        complain_des: "",
        broken_des: "",
        image: null,
      });
      setPreviewUrl(null);

      onClose();
      update();
    } catch (err) {
      console.error("❌ Error saat submit report:", err);
      showToast("error", `Terjadi kesalahan saat menyimpan report", ${err}`);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Modal utama */}
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Tambah Report</h2>

          {/* Tipe Report */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tipe Report
          </label>
          <select
            value={form.report_type}
            onChange={(e) => handleReportTypeChange(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4 text-gray-700 text-sm"
          >
            <option value="FK">Fasilitas Kamar</option>
            <option value="FU">Fasilitas Umum</option>
            <option value="K">Komplain</option>
          </select>

          {/* Jika komplain */}
          {form.report_type === "K" ? (
            <>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Penjelasan Komplain
              </label>
              <textarea
                value={form.complain_des}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, complain_des: e.target.value }))
                }
                className="w-full border rounded-lg p-2 mb-4 text-gray-700 placeholder-gray-500"
                placeholder="Tuliskan keluhan atau komplain Anda..."
              />
            </>
          ) : (
            <>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Tipe Kerusakan
              </label>
              <select
                value={form.broken_type}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, broken_type: e.target.value }))
                }
                className="w-full border rounded-lg p-2 mb-4 text-gray-700 text-sm"
              >
                <option value="SP">Sedikit Rusak</option>
                <option value="R">Rusak</option>
                <option value="SR">Sangat Rusak</option>
              </select>

              <label className="block mb-2 text-sm font-medium text-gray-700">
                Penjelasan Kerusakan
              </label>
              <textarea
                value={form.broken_des}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, broken_des: e.target.value }))
                }
                className="w-full border rounded-lg p-2 mb-4 text-gray-700 placeholder-gray-500"
                placeholder="Deskripsi kerusakan..."
              />
            </>
          )}

          {/* Upload Gambar */}
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Upload Gambar
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-lg p-2 mb-2 text-gray-700"
          />

          {/* Preview Thumbnail */}
          {previewUrl && (
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border "
                onClick={() => setShowImageModal(true)}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Preview Gambar */}
      {showImageModal && previewUrl && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <img
            src={previewUrl}
            alt="Full Preview"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
}
