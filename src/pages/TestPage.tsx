import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Import ALL Hooks
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "../hooks/useAuthQueries";
import { useGetProfileQuery } from "../hooks/useProfileQueries";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "../hooks/useCategoryQueries";
import {
  useGetAllServicesQuery,
  useCreateServiceMutation,
  useDeleteServiceMutation,
} from "../hooks/useServiceQueries";
import {
  useGetAllStaffQuery,
  useCreateStaffMutation,
  useDeleteStaffMutation,
} from "../hooks/useStaffQueries";

import type { AxiosError } from "axios";
import type { LaravelErrorResponse, AnyAuthResponse } from "../other/types";
import api from "../api";
import { useAuth } from "../contexts/auth/useAuth";

import {
  useCustomerGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useCancelAppointmentMutation,
  useStaffUpdateStateMutation,
  useAdminGetAppointmentsQuery,
  useAdminUpdateStateMutation,
  useAdminDeleteAppointmentMutation,
  useGetAvailabilityMutation,
  useStaffGetAppointmentsQuery,
} from "../hooks/useAppointmentQueries";

const BASE_URL =
  (api.defaults.baseURL as string) || "http://localhost:8000/api";

interface TestLog {
  id: number;
  title: string;
  timestamp: string;
  url: string;
  method: string;
  body: string | null;
  response: string | null;
  error: string | null;
}

export const TestPage: React.FC = () => {
  const { token, role, handleLoginSuccess } = useAuth();
  const queryClient = useQueryClient();
  const [logs, setLogs] = useState<TestLog[]>([]);

  // --- MUTATIONS ---
  const loginMut = useLoginMutation();
  const logoutMut = useLogoutMutation();
  const registerMut = useRegisterMutation();

  const createCatMut = useCreateCategoryMutation();
  const deleteCatMut = useDeleteCategoryMutation();

  const createSvcMut = useCreateServiceMutation();
  const deleteSvcMut = useDeleteServiceMutation();

  const createStaffMut = useCreateStaffMutation();
  const deleteStaffMut = useDeleteStaffMutation();

  const createAppoMut = useCreateAppointmentMutation();
  const cancelAppoMut = useCancelAppointmentMutation();
  const staffUpdateMut = useStaffUpdateStateMutation();
  const adminUpdateMut = useAdminUpdateStateMutation();
  const adminDeleteAppoMut = useAdminDeleteAppointmentMutation();
  const availabilityMut = useGetAvailabilityMutation();

  // --- QUERIES ---
  const profileQuery = useGetProfileQuery(role);
  const categoriesQuery = useGetAllCategoriesQuery();
  const servicesQuery = useGetAllServicesQuery();
  const staffQuery = useGetAllStaffQuery();
  const customerAppoQuery = useCustomerGetAppointmentsQuery();
  const staffAppoQuery = useStaffGetAppointmentsQuery();
  const adminAppoQuery = useAdminGetAppointmentsQuery();

  // --- LOGGING HELPER ---
  const addLog = (
    title: string,
    url: string,
    method: string,
    body: unknown,
    response: unknown,
    error: unknown,
  ) => {
    const logObj: TestLog = {
      id: Date.now(),
      title,
      timestamp: new Date().toLocaleTimeString(),
      url,
      method,
      body: body ? JSON.stringify(body, null, 2) : null,
      response: response ? JSON.stringify(response, null, 2) : null,
      error: error ? JSON.stringify(error, null, 2) : null,
    };
    setLogs((prev) => [logObj, ...prev]);
  };

  // --- AUTH HANDLERS ---
  const testLogin = async (r: "customer" | "admin" | "staff") => {
    const emails: Record<string, string> = {
      customer: "ahmad3@example.com",
      admin: "admin@test.com",
      staff: "ahmad32@example.com",
    };
    const body = { email: emails[r], password: "admin123", role: r as const };
    try {
      const res = await loginMut.mutateAsync(body);
      handleLoginSuccess!(res as AnyAuthResponse);
      addLog(`Login (${r})`, `${BASE_URL}/${r}/login`, "POST", body, res, null);
      queryClient.invalidateQueries();
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        `Login (${r})`,
        `${BASE_URL}/${r}/login`,
        "POST",
        body,
        null,
        error.response?.data,
      );
    }
  };

  const testRegister = async () => {
    const body = {
      name: "Test",
      surname: "User",
      email: `test_${Date.now()}@example.com`,
      phone_number: "5555555555",
      password: "Aa1234",
    };
    try {
      const res = await registerMut.mutateAsync(body);
      handleLoginSuccess!(res as AnyAuthResponse);
      addLog(
        "Register",
        `${BASE_URL}/customer/register`,
        "POST",
        body,
        res,
        null,
      );
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Register",
        `${BASE_URL}/customer/register`,
        "POST",
        body,
        null,
        error.response?.data,
      );
    }
  };

  const testLogout = async () => {
    if (!role) return;
    try {
      const res = await logoutMut.mutateAsync(role);
      addLog("Logout", `${BASE_URL}/${role}/logout`, "POST", null, res, null);
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Logout",
        `${BASE_URL}/${role}/logout`,
        "POST",
        null,
        null,
        error.response?.data,
      );
    }
  };

  const testProfile = async () => {
    await profileQuery.refetch();
    addLog(
      "Get Profile",
      `${BASE_URL}/${role}/profile`,
      "GET",
      null,
      profileQuery.data,
      profileQuery.error,
    );
  };

  // --- CATEGORY HANDLERS ---
  const testGetCategories = async () => {
    await categoriesQuery.refetch();
    addLog(
      "Get Categories",
      `${BASE_URL}/categories`,
      "GET",
      null,
      categoriesQuery.data,
      categoriesQuery.error,
    );
  };

  const testCreateCategory = async () => {
    const body = { name: `Cat_${Date.now()}` };
    try {
      const res = await createCatMut.mutateAsync(body);
      addLog(
        "Create Category",
        `${BASE_URL}/categories`,
        "POST",
        body,
        res,
        null,
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Create Category",
        `${BASE_URL}/categories`,
        "POST",
        body,
        null,
        error.response?.data,
      );
    }
  };

  const testDeleteCategory = async () => {
    const id = prompt("Silinecek Kategori ID'sini girin:");
    if (!id) return;
    try {
      const res = await deleteCatMut.mutateAsync(id);
      addLog(
        "Delete Category",
        `${BASE_URL}/categories/${id}`,
        "DELETE",
        null,
        res,
        null,
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Delete Category",
        `${BASE_URL}/categories/${id}`,
        "DELETE",
        null,
        null,
        error.response?.data,
      );
    }
  };

  // --- SERVICE HANDLERS ---
  const testGetServices = async () => {
    await servicesQuery.refetch();
    addLog(
      "Get Services",
      `${BASE_URL}/services`,
      "GET",
      null,
      servicesQuery.data,
      servicesQuery.error,
    );
  };

  const testCreateService = async () => {
    const body = { catagory_id: "1", name: `Svc_${Date.now()}`, duration: 30 };
    try {
      const res = await createSvcMut.mutateAsync(body);
      addLog("Create Service", `${BASE_URL}/services`, "POST", body, res, null);
      queryClient.invalidateQueries({ queryKey: ["services"] });
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Create Service",
        `${BASE_URL}/services`,
        "POST",
        body,
        null,
        error.response?.data,
      );
    }
  };

  const testDeleteService = async () => {
    const id = prompt("Silinecek Hizmet ID'sini girin:");
    if (!id) return;
    try {
      const res = await deleteSvcMut.mutateAsync(id);
      addLog(
        "Delete Service",
        `${BASE_URL}/services/${id}`,
        "DELETE",
        null,
        res,
        null,
      );
      queryClient.invalidateQueries({ queryKey: ["services"] });
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Delete Service",
        `${BASE_URL}/services/${id}`,
        "DELETE",
        null,
        null,
        error.response?.data,
      );
    }
  };

  // --- STAFF MANAGEMENT HANDLERS ---
  const testGetStaff = async () => {
    await staffQuery.refetch();
    addLog(
      "Get Staff",
      `${BASE_URL}/staff-members`,
      "GET",
      null,
      staffQuery.data,
      staffQuery.error,
    );
  };

  const testCreateStaff = async () => {
    const body = {
      name: "New",
      surname: "Staff",
      email: `staff_${Date.now()}@test.com`,
      phone_number: "5555555555",
      password: "Aa1234",
      job_title: "Tester",
      job_email: `job_${Date.now()}@test.com`,
    };
    try {
      const res = await createStaffMut.mutateAsync(body);
      addLog(
        "Create Staff",
        `${BASE_URL}/staff-members`,
        "POST",
        body,
        res,
        null,
      );
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Create Staff",
        `${BASE_URL}/staff-members`,
        "POST",
        body,
        null,
        error.response?.data,
      );
    }
  };

  const testDeleteStaff = async () => {
    const id = prompt("Silinecek Personel ID'sini girin:");
    if (!id) return;
    try {
      const res = await deleteStaffMut.mutateAsync(id);
      addLog(
        "Delete Staff",
        `${BASE_URL}/staff-members/${id}`,
        "DELETE",
        null,
        res,
        null,
      );
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Delete Staff",
        `${BASE_URL}/staff-members/${id}`,
        "DELETE",
        null,
        null,
        error.response?.data,
      );
    }
  };

  // --- APPOINTMENT HANDLERS ---
  const testAvailability = async () => {
    const body = { staff_id: "1", service_id: "2", date: "2026-07-25" };
    try {
      const res = await availabilityMut.mutateAsync(body);
      addLog(
        "Check Availability",
        `${BASE_URL}/availability`,
        "POST",
        body,
        res,
        null,
      );
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Check Availability",
        `${BASE_URL}/availability`,
        "POST",
        body,
        null,
        error.response?.data,
      );
    }
  };

  const testCreateAppointment = async () => {
    const body = {
      staff_id: "1",
      service_id: "2",
      start_date: "2026-07-25T10:00:00.000000Z",
    };
    try {
      const res = await createAppoMut.mutateAsync(body);
      addLog(
        "Create Appointment",
        `${BASE_URL}/appointments`,
        "POST",
        body,
        res,
        null,
      );
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Create Appointment",
        `${BASE_URL}/appointments`,
        "POST",
        body,
        null,
        error.response?.data,
      );
    }
  };

  const testCancelAppointment = async () => {
    const id = prompt("İptal edilecek Randevu ID'sini girin:");
    if (!id) return;
    try {
      const res = await cancelAppoMut.mutateAsync(id);
      addLog(
        "Cancel Appointment",
        `${BASE_URL}/appointments/${id}/cancel`,
        "PATCH",
        null,
        res,
        null,
      );
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Cancel Appointment",
        `${BASE_URL}/appointments/${id}/cancel`,
        "PATCH",
        null,
        null,
        error.response?.data,
      );
    }
  };

  const testGetCustomerAppos = async () => {
    await customerAppoQuery.refetch();
    addLog(
      "Customer Appos",
      `${BASE_URL}/my-appointments`,
      "GET",
      null,
      customerAppoQuery.data,
      customerAppoQuery.error,
    );
  };

  const testGetStaffAppos = async () => {
    await staffAppoQuery.refetch();
    addLog(
      "Staff Appos",
      `${BASE_URL}/staff/appointments`,
      "GET",
      null,
      staffAppoQuery.data,
      staffAppoQuery.error,
    );
  };

  const testStaffUpdateStatus = async () => {
    const id = prompt("Durumu güncellenecek Randevu ID'sini girin:");
    const stateId = prompt("Yeni State ID'yi girin (örn: 2 for confirmed):");
    if (!id || !stateId) return;
    try {
      const res = await staffUpdateMut.mutateAsync({
        id,
        data: { state_id: Number(stateId) },
      });
      addLog(
        "Staff Update Status",
        `${BASE_URL}/staff/appointments/${id}/status`,
        "PATCH",
        { state_id: stateId },
        res,
        null,
      );
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Staff Update Status",
        `${BASE_URL}/staff/appointments/${id}/status`,
        "PATCH",
        null,
        null,
        error.response?.data,
      );
    }
  };

  const testGetAdminAppos = async () => {
    await adminAppoQuery.refetch();
    addLog(
      "Admin Appos",
      `${BASE_URL}/appointments`,
      "GET",
      null,
      adminAppoQuery.data,
      adminAppoQuery.error,
    );
  };

  const testAdminUpdateStatus = async () => {
    const id = prompt("Durumu güncellenecek Randevu ID'sini girin:");
    const stateId = prompt("Yeni State ID'yi girin:");
    if (!id || !stateId) return;
    try {
      const res = await adminUpdateMut.mutateAsync({
        id,
        data: { state_id: Number(stateId) },
      });
      addLog(
        "Admin Update Status",
        `${BASE_URL}/appointments/${id}`,
        "PUT",
        { state_id: stateId },
        res,
        null,
      );
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Admin Update Status",
        `${BASE_URL}/appointments/${id}`,
        "PUT",
        null,
        null,
        error.response?.data,
      );
    }
  };

  const testAdminDeleteAppo = async () => {
    const id = prompt("Silinecek Randevu ID'sini girin:");
    if (!id) return;
    try {
      const res = await adminDeleteAppoMut.mutateAsync(id);
      addLog(
        "Admin Delete Appo",
        `${BASE_URL}/appointments/${id}`,
        "DELETE",
        null,
        res,
        null,
      );
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (err) {
      const error = err as AxiosError<LaravelErrorResponse>;
      addLog(
        "Admin Delete Appo",
        `${BASE_URL}/appointments/${id}`,
        "DELETE",
        null,
        null,
        error.response?.data,
      );
    }
  };

  // --- UI STYLES ---
  const btn =
    "px-3 py-1.5 m-1 text-white rounded text-xs font-semibold shadow transition-all disabled:opacity-50";
  const card = "mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm";
  const logSuccess = "border-l-4 border-green-500 bg-green-50";
  const logError = "border-l-4 border-red-500 bg-red-50";

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-sm text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          🧪 API Test Dashboard
        </h1>
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 font-mono text-xs">
          <strong>Auth:</strong> Token:{" "}
          {token ? `${token.substring(0, 20)}...` : "NULL"} | Role:{" "}
          <span className="uppercase font-bold">{role || "NULL"}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* AUTH */}
          <div className={card}>
            <h2 className="font-bold mb-3 text-base border-b pb-2 text-gray-700">
              🔐 Auth
            </h2>
            <div className="flex flex-wrap">
              <button
                className={`${btn} bg-purple-600 hover:bg-purple-700`}
                onClick={() => testLogin("customer")}
              >
                Login Cust.
              </button>
              <button
                className={`${btn} bg-purple-600 hover:bg-purple-700`}
                onClick={() => testLogin("staff")}
              >
                Login Staff
              </button>
              <button
                className={`${btn} bg-purple-600 hover:bg-purple-700`}
                onClick={() => testLogin("admin")}
              >
                Login Admin
              </button>
              <button
                className={`${btn} bg-gray-600 hover:bg-gray-700`}
                onClick={testRegister}
              >
                Register
              </button>
              <button
                className={`${btn} bg-red-600 hover:bg-red-700`}
                onClick={testLogout}
              >
                Logout
              </button>
              <button
                className={`${btn} bg-blue-600 hover:bg-blue-700`}
                onClick={testProfile}
              >
                Get Profile
              </button>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className={card}>
            <h2 className="font-bold mb-3 text-base border-b pb-2 text-gray-700">
              📁 Categories
            </h2>
            <div className="flex flex-wrap">
              <button
                className={`${btn} bg-blue-600 hover:bg-blue-700`}
                onClick={testGetCategories}
              >
                Get All
              </button>
              <button
                className={`${btn} bg-green-600 hover:bg-green-700`}
                onClick={testCreateCategory}
              >
                Create
              </button>
              <button
                className={`${btn} bg-red-600 hover:bg-red-700`}
                onClick={testDeleteCategory}
              >
                Delete
              </button>
            </div>
          </div>

          {/* SERVICES */}
          <div className={card}>
            <h2 className="font-bold mb-3 text-base border-b pb-2 text-gray-700">
              ⚙️ Services
            </h2>
            <div className="flex flex-wrap">
              <button
                className={`${btn} bg-blue-600 hover:bg-blue-700`}
                onClick={testGetServices}
              >
                Get All
              </button>
              <button
                className={`${btn} bg-green-600 hover:bg-green-700`}
                onClick={testCreateService}
              >
                Create
              </button>
              <button
                className={`${btn} bg-red-600 hover:bg-red-700`}
                onClick={testDeleteService}
              >
                Delete
              </button>
            </div>
          </div>

          {/* STAFF MANAGEMENT */}
          <div className={card}>
            <h2 className="font-bold mb-3 text-base border-b pb-2 text-gray-700">
              👨‍💼 Staff Mgmt
            </h2>
            <div className="flex flex-wrap">
              <button
                className={`${btn} bg-blue-600 hover:bg-blue-700`}
                onClick={testGetStaff}
              >
                Get All
              </button>
              <button
                className={`${btn} bg-green-600 hover:bg-green-700`}
                onClick={testCreateStaff}
              >
                Create
              </button>
              <button
                className={`${btn} bg-red-600 hover:bg-red-700`}
                onClick={testDeleteStaff}
              >
                Delete
              </button>
            </div>
          </div>

          {/* APPOINTMENTS - FULL WIDTH */}
          <div className={`${card} md:col-span-2 xl:col-span-4`}>
            <h2 className="font-bold mb-3 text-base border-b pb-2 text-gray-700">
              📅 Appointments
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              <button
                className={`${btn} bg-gray-600 hover:bg-gray-700`}
                onClick={testAvailability}
              >
                Availability
              </button>
              <button
                className={`${btn} bg-green-700 hover:bg-green-800`}
                onClick={testCreateAppointment}
              >
                Create (Cust)
              </button>
              <button
                className={`${btn} bg-yellow-600 hover:bg-yellow-700`}
                onClick={testCancelAppointment}
              >
                Cancel (Cust)
              </button>
              <button
                className={`${btn} bg-blue-600 hover:bg-blue-700`}
                onClick={testGetCustomerAppos}
              >
                List (Cust)
              </button>

              <button
                className={`${btn} bg-indigo-600 hover:bg-indigo-700`}
                onClick={testGetStaffAppos}
              >
                List (Staff)
              </button>
              <button
                className={`${btn} bg-indigo-800 hover:bg-indigo-900`}
                onClick={testStaffUpdateStatus}
              >
                Update State (Staff)
              </button>

              <button
                className={`${btn} bg-black hover:bg-gray-900`}
                onClick={testGetAdminAppos}
              >
                List (Admin)
              </button>
              <button
                className={`${btn} bg-gray-800 hover:bg-black`}
                onClick={testAdminUpdateStatus}
              >
                Update State (Admin)
              </button>
              <button
                className={`${btn} bg-red-800 hover:bg-red-900`}
                onClick={testAdminDeleteAppo}
              >
                Delete (Admin)
              </button>
            </div>
          </div>
        </div>

        {/* LOGS SECTION */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              📋 Request / Response Logs
            </h2>
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 shadow-sm"
              onClick={() => setLogs([])}
            >
              Clear Logs
            </button>
          </div>

          <div className="space-y-3">
            {logs.length === 0 && (
              <p className="text-gray-500 italic text-center py-10">
                Henüz bir istek atılmadı. Butonlara tıklayın.
              </p>
            )}

            {logs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-lg shadow-sm ${log.error ? logError : logSuccess}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-900">{log.title}</span>
                  <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded">
                    {log.timestamp}
                  </span>
                </div>
                <p className="text-xs font-mono mb-2 text-blue-800 font-semibold">
                  {log.method} {log.url}
                </p>
                <p className="text-xs text-gray-600 mb-2">
                  Token:{" "}
                  {token ? `Bearer ${token.substring(0, 15)}...` : "NULL"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {log.body && (
                    <div>
                      <p className="text-xs font-bold text-orange-600 mb-1">
                        Sent Body:
                      </p>
                      <pre className="bg-white p-2 rounded border text-xs overflow-x-auto max-h-40">
                        {log.body}
                      </pre>
                    </div>
                  )}
                  {log.response && (
                    <div>
                      <p className="text-xs font-bold text-green-700 mb-1">
                        Response:
                      </p>
                      <pre className="bg-white p-2 rounded border text-xs overflow-x-auto max-h-40">
                        {log.response}
                      </pre>
                    </div>
                  )}
                  {log.error && (
                    <div className="md:col-span-2">
                      <p className="text-xs font-bold text-red-700 mb-1">
                        Error:
                      </p>
                      <pre className="bg-white p-2 rounded border text-xs overflow-x-auto max-h-40 text-red-600">
                        {log.error}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
