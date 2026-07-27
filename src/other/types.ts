// ==========================================
// BASE / SHARED INTERFACES
// ==========================================

/** Base timestamps returned by Laravel/Backend */
export interface ApiTimestamps {
  created_at: string;
  updated_at: string;
}

/** Generic { message: string } response used by delete/logout/etc endpoints */
export interface MessageResponse {
  message: string;
}

/** The core person details shared across ALL user types */
export interface Person extends ApiTimestamps {
  id: number;
  name: string;
  surname: string;
  phone_number: string;
}

// ==========================================
// ROLE / AUTH SHARED TYPES
// ==========================================

/** Canonical role type. `Role` is kept as an alias for backward compatibility with existing hooks. */
export type UserRole = "customer" | "admin" | "staff";
export type Role = UserRole;

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
  catagory_id?: string | number | null;
  category?: Category | null;
}

/** A utility type that extracts the actual user data regardless of role */
export type AnyUser = CustomerProfile | AdminProfile | StaffProfile;

// ==========================================
// AUTH REQUEST BODIES
// ==========================================

export interface CustomerRegisterBody {
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation?: string;
}

export interface LoginBody {
  email: string;
  password: string;
  role?: UserRole; // optional — unified login doesn't need it
}

/** Aliases kept so existing hooks (useAuth.ts) don't need renaming */
export type LoginShape = LoginBody;
export type RegisterShape = CustomerRegisterBody;

// ==========================================
// AUTH RESPONSE INTERFACES
// ==========================================

/** Base Auth Response structure */
interface BaseAuthResponse {
  token: string;
  role: UserRole;
}

/** Customer Register & Login Response */
export interface CustomerAuthResponse extends BaseAuthResponse {
  role: "customer";
  customer: CustomerProfile;
}

/** Admin Login Response */
export interface AdminAuthResponse extends BaseAuthResponse {
  role: "admin";
  admin: AdminProfile;
}

/** Staff Login Response */
export interface StaffAuthResponse extends BaseAuthResponse {
  role: "staff";
  staff: StaffProfile;
}

/** A union of all possible login/register responses (discriminated by `role`) */
export type AnyAuthResponse =
  | CustomerAuthResponse
  | AdminAuthResponse
  | StaffAuthResponse;

/**
 * Generic alias used by hooks that don't care which specific role responded
 * (e.g. useLoginMutation, useRegisterMutation). If a hook targets a single
 * known role, prefer the specific *AuthResponse type instead.
 */
export type LoginResponse = AnyAuthResponse;

// ==========================================
// UNIFIED LOGIN (Phase 2)
// ==========================================

export interface UnifiedLoginBody {
  email: string;
  password: string;
}

export interface UnifiedLoginResponse {
  user: AnyUser;
  token: string;
  role: UserRole;
  other_roles: UserRole[];
}

// ==========================================
// ROLE SWITCHING (Phase 2)
// ==========================================

export interface MyRolesResponse {
  current_role: UserRole;
  other_roles: UserRole[];
}

export interface SwitchRoleBody {
  role: UserRole;
  password: string;
}

export interface SwitchRoleResponse {
  user: AnyUser;
  token: string;
  role: UserRole;
}

/** A union of all possible profile shapes, discriminated by `role` */
export type AnyProfileResponse =
  | { role: "customer"; data: CustomerProfile }
  | { role: "admin"; data: AdminProfile }
  | { role: "staff"; data: StaffProfile };

// ==========================================
// MISC RESPONSES
// ==========================================

export type LogoutResponse = MessageResponse;

export interface LaravelErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface AuthContextValue {
  user: AnyUser | null;
  token: string | null;
  role: UserRole | null;
  otherRoles: UserRole[];
  handleLoginSuccess: (data: UnifiedLoginResponse) => void;
  handleSwitchRole: (data: UnifiedLoginResponse) => void;
  handleLogout: () => void;
  saveToken: (token: string | null) => void;
  saveRole: (role: UserRole | null) => void;
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

export type DeleteCategoryResponse = MessageResponse;

// ==========================================
// SERVICE TYPES
// ==========================================

/**
 * Base Service shape.
 * NOTE: `catagory_id` is a backend typo (should be `category_id`) kept as-is
 * to match the actual API response. Do not "fix" the spelling here without
 * confirming the backend field name has also changed.
 */
export interface Service extends ApiTimestamps {
  id: number;
  catagory_id: number;
  name: string;
  duration: number;
}

/** Get Services / Get Service By ID / Post Service Response (Includes parent category) */
export interface ServiceWithCategory extends Service {
  category: Category;
}

/**
 * Post / Put Service Request Body.
 * `catagory_id` is allowed as string|number here because it may come
 * straight from a <select> or form input before being sent to the API.
 */
export interface ServiceRequestBody {
  catagory_id: string | number;
  name: string;
  duration: number;
}

export type DeleteServiceResponse = MessageResponse;

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
  catagory_id?: string | number | null;
  category?: Category | null;
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
  catagory_id?: string | number;
}

/** Put Staff Request Body (Partial update) */
export interface UpdateStaffRequestBody {
  job_title?: string;
  email?: string;
  catagory_id?: string | number | null;
}

/** Put Staff Response (Note: Does not include 'person' object) */
export interface UpdateStaffResponse extends ApiTimestamps {
  id: number;
  person_id: number;
  job_title: string;
  email: string;
  admin_id: number;
  catagory_id?: string | number;
}

export type DeleteStaffResponse = MessageResponse;

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
 * `staff` and `customer` are optional because:
 * - Customer endpoints DON'T return the 'customer' object
 * - Staff endpoints DON'T return the 'staff' object
 * - Admin endpoints return BOTH
 */
export interface Appointment extends ApiTimestamps {
  id: number;
  staff_id: number;
  customer_id: number;
  service_id: number;
  state_id: number;
  start_date: string;
  end_date: string;

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
  state_id?: number;
  staff_id?: number;
  service_id?: number;
  start_date?: string;
}

export interface CustomerUpdateAppointmentBody {
  staff_id?: number;
  service_id?: number;
  start_date?: string;
}

export interface GetAvailabilityBody {
  staff_id: string | number;
  service_id: string | number;
  date: string; // "YYYY-MM-DD" format
}

// ==========================================
// APPOINTMENT SPECIFIC RESPONSES
// ==========================================

/** Response for Customer Cancel — now returns Appointment directly */
export type CancelAppointmentResponse = Appointment;

export type DeleteAppointmentResponse = MessageResponse;

/** Response for Availability Check */
export interface AvailabilityResponse {
  available_slots: string[]; // Array of "HH:mm" strings
}

// ==========================================
// PAGINATION
// ==========================================

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}
