/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { AddBooking } from "../services/booking_service"; //
import { BookingApi, Room } from "../models"; //
import { useToast } from "@/components/ToastContect"; //

interface BookingModalProps {
  show: boolean;
  onClose: () => void;
  room?: Room;
}

export default function BookingModal({ show, onClose, room }: BookingModalProps) {
  const [form, setForm] = useState({
    username: "",
    phone: "",
    email: "",
    booking_date: "",
  });
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast(); //

  // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD untuk atribut 'min'
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- VALIDASI TANGGAL (LOGIKA BISNIS) ---
    const selectedDate = new Date(form.booking_date);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); // Reset waktu ke 00:00:00 agar perbandingan akurat

    if (selectedDate < todayDate) {
      showToast("error", "Tanggal booking tidak boleh di masa lalu");
      return;
    }

    setLoading(true);

    try {
      const payload: BookingApi = {
        username: form.username,
        phone: Number(form.phone), // Mengonversi string angka ke tipe number
        email: form.email,
        booking_date: new Date(form.booking_date),
        room_key: room ? room._id : "", //
      };

      await AddBooking(payload); //

      showToast("success", "Berhasil tambah booking kamar");
      setForm({ username: "", phone: "", email: "", booking_date: "" });
      onClose(); // Menutup modal hanya jika berhasil
    } catch (err: any) {
      console.error("Gagal kirim booking", err);
      showToast("error", err.response?.data?.message || err.message); //
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null; //

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white text-gray-500 rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Booking Kamar {room?.code} {/* */}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          
          {/* VALIDASI WHATSAPP: Hanya menerima angka */}
          <input
            type="tel"
            placeholder="No WhatsApp (Angka saja)"
            value={form.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // Regex untuk menghapus non-angka
              setForm({ ...form, phone: value });
            }}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="email"
            placeholder="Alamat Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          {/* VALIDASI TANGGAL: Atribut min mencegah pilihan tanggal lampau di kalender */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 ml-1">Tanggal Booking</label>
            <input
              type="date"
              value={form.booking_date}
              min={today} 
              onChange={(e) => setForm({ ...form, booking_date: e.target.value })}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Mengirim..." : "Kirim Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
