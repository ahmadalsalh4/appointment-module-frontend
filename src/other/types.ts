// ==========================================
// BASE / SHARED INTERFACES
// ==========================================

/** Base timestamps returned by Laravel/Backend */
export interface ApiTimestamps {
  created_at: string;
  updated_at: string;
}

/** The core person details shared across ALL user types */
export interface Person extends ApiTimestamps {
  id: number;
  name: string;
  surname: string;
  phone_number: string;
}

// ==========================================
// ENTITY INTERFACES (Standalone Profile Data)
// ==========================================

/** Used for Get Customer Profile */
export interface CustomerProfile extends ApiTimestamps {
  id: number;
  person_id: number;
  email: string;
  person: Person;
}

/** Used for Get Admin Profile */
export interface AdminProfile extends ApiTimestamps {
  id: number;
  person_id: number;
  email: string;
  person: Person;
}

/** A lighter version of Admin used inside the Staff entity */
export interface ManagingAdminLight extends ApiTimestamps {
  id: number;
  person_id: number;
  email: string;
}

/** Used for Get Staff Profile */
export interface StaffProfile extends ApiTimestamps {
  id: number;
  person_id: number;
  job_title: string;
  email: string;
  admin_id: number;
  person: Person;
  managing_admin: ManagingAdminLight;
}

// ==========================================
// AUTH REQUEST BODIES
// ==========================================

export interface CustomerRegisterBody {
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
  role: UserRole;
}

// ==========================================
// AUTH RESPONSE INTERFACES
// ==========================================

/** Helper type to make role strictly typed */
export type UserRole = "customer" | "admin" | "staff";

/** Base Auth Response structure */
interface BaseAuthResponse {
  token: string;
  role: UserRole;
}

/** Customer Register & Login Response */
export interface CustomerAuthResponse extends BaseAuthResponse {
  customer: CustomerProfile;
}

/** Admin Login Response */
export interface AdminAuthResponse extends BaseAuthResponse {
  admin: AdminProfile;
}

/** Staff Login Response */
export interface StaffAuthResponse extends BaseAuthResponse {
  staff: StaffProfile;
}

// ==========================================
// MISC RESPONSES
// ==========================================

export interface LogoutResponse {
  message: string;
}

// ==========================================
// CATEGORY TYPES
// ==========================================

/** Base Category shape (Get All, Get by ID base, Put response) */
export interface Category extends ApiTimestamps {
  id: number;
  name: string;
}

/** Get Category By ID (Includes related services) */
export interface CategoryWithServices extends Category {
  services: Service[];
}

/** Post / Put Category Request Body */
export interface CategoryRequestBody {
  name: string;
}

/** Delete Category Response */
export interface DeleteCategoryResponse {
  message: string;
}

// ==========================================
// SERVICE TYPES
// ==========================================

/** Base Service shape */
export interface Service extends ApiTimestamps {
  id: number;
  catagory_id: number | string; // Backend sends string on POST, number on GET
  name: string;
  duration: number;
}

/** Get Services / Get Service By ID / Post Service Response (Includes parent category) */
export interface ServiceWithCategory extends Service {
  category: Category;
}

/** Post / Put Service Request Body */
export interface ServiceRequestBody {
  catagory_id: string | number;
  name: string;
  duration: number;
}

/** Delete Service Response */
export interface DeleteServiceResponse {
  message: string;
}

// ==========================================
// STAFF MANAGEMENT TYPES
// ==========================================

/** Base Staff entity (Used for Get All and Post responses) */
export interface StaffEntity extends ApiTimestamps {
  id: number;
  person_id: number;
  job_title: string;
  email: string;
  admin_id: number;
  person: Person;
}

/** Get Staff By ID (Includes the managing admin) */
export interface StaffEntityDetailed extends StaffEntity {
  managing_admin: ManagingAdminLight;
}

/** Post Staff Request Body */
export interface CreateStaffRequestBody {
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  password: string;
  job_title: string;
  job_email: string;
}

/** Put Staff Request Body (Partial update) */
export interface UpdateStaffRequestBody {
  job_title?: string;
  email?: string;
}

/** Put Staff Response (Note: Does not include 'person' object) */
export interface UpdateStaffResponse extends ApiTimestamps {
  id: number;
  person_id: number;
  job_title: string;
  email: string;
  admin_id: number;
}

/** Delete Staff Response */
export interface DeleteStaffResponse {
  message: string;
}

// ==========================================
// APPOINTMENT STATUS
// ==========================================

/** Base Status Object */
export interface AppointmentStatus extends ApiTimestamps {
  id: number;
  name: "pending" | "confirmed" | "completed" | "cancelled";
}

// ==========================================
// APPOINTMENT INTERFACES (DRY Strategy)
// ==========================================

/**
 * Base Appointment shape.
 * We use Partial<> for staff and customer because:
 * - Customer endpoints DON'T return the 'customer' object
 * - Staff endpoints DON'T return the 'staff' object
 * - Admin endpoints return BOTH
 */
export interface Appointment {
  id: number;
  staff_id: number | string;
  customer_id: number;
  service_id: number;
  state_id: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;

  service: Service;
  status: AppointmentStatus;

  // Optional based on who is requesting
  staff?: StaffEntity;
  customer?: CustomerProfile;
}

// ==========================================
// APPOINTMENT REQUEST BODIES
// ==========================================

export interface CreateAppointmentBody {
  staff_id: string | number;
  service_id: string | number;
  start_date: string; // ISO datetime string
}

export interface UpdateAppointmentStateBody {
  state_id: number;
}

export interface GetAvailabilityBody {
  staff_id: string | number;
  service_id: string | number;
  date: string; // "YYYY-MM-DD" format
}

// ==========================================
// APPOINTMENT SPECIFIC RESPONSES
// ==========================================

/** Response for Customer Cancel */
export interface CancelAppointmentResponse {
  message: string;
  appointment: Appointment;
}

/** Response for Admin Delete */
export interface DeleteAppointmentResponse {
  message: string;
}

/** Response for Availability Check */
export interface AvailabilityResponse {
  available_slots: string[]; // Array of "HH:mm" strings
}

export interface AuthContextValue {
  token: string | null;
  role: UserRole | null;
  saveToken: (token: string | null) => void;
  saveRole: (role: UserRole | null) => void;
}

export interface LaravelErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
