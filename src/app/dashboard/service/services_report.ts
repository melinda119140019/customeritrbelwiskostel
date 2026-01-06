import http from "@/utils/http"; // axios instance kamu
import { Report } from "../models";

export async function addReport(data: FormData) {
  const res = await http.post("/report", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
}


export async function getReportCustomer(customer_id: string): Promise<Report[]> {
  const res = await http.get(`/report/${customer_id}`);
  return res.data.data; // sesuaikan sama struktur response backend
}

export async function updateBookingStatus(code: string, status: string) {
  const res = await http.patch(`/management-customer/status/${code}`, { status });
  return res.data.data; // balikin data updated
}
