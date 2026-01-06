// utils/brokenType.ts
export const getBrokenType = (status: string) => {
  switch (status) {
    case "SP":
      return {
        label: "Sedikit Perbaikan",
        className: "bg-green-100 text-green-700",
      };
    case "R":
      return {
        label: "Rusak",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "SR":
      return {
        label: "Sangat Rusak",
        className: "bg-red-100 text-red-700",
      };
    default:
      return {
        label: status, // fallback ke kode aslinya
        className: "bg-gray-100 text-gray-700",
      };
  }
};

export const TypeReport = (status: string) => {
  switch (status) {
    case "FK":
      return {
        label: "Fasilitas Kamar",
        className: "bg-green-100 text-green-700",
      };
    case "FU":
      return {
        label: "Fasilitas Umum",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "K":
      return {
        label: "Komplain",
        className: "bg-red-100 text-red-700",
      };
    default:
      return {
        label: status, // fallback ke kode aslinya
        className: "bg-gray-100 text-gray-700",
      };
  }
};

export const Progress = (status: string) => {

  switch (status) {
    case "A":
      return {
        label: "Antrian",
        className: "bg-gray-100 text-gray-700",
      };
    case "P":
      return {
        label: "Di Proses",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "S":
      return {
        label: "Selesai",
        className: "bg-green-100 text-green-700",
      };
    case "T":
      return {
        label: "Di Tolak",
        className: "bg-red-100 text-red-700",
      };
    default:
      return {
        label: status, // fallback ke kode aslinya
        className: "bg-gray-100 text-gray-700",
      };
  }
};