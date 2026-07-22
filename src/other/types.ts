export type Role = "staff" | "admin" | "customer";

export type LoginShape = {
  email: string;
  password: string;
  role: Role;
};
export type LoginResponse = {
  token: string;
  role: Role;
  customer: {
    person: {
      name: string;
      surname: string;
    };
  };
};
export type LogoutResponse = { message: string };

export interface RegisterShape {
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
}

export interface LaravelErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
export interface ProfileShape {
  id: number;
  person_id: number;
  email: string;
  created_at: string;
  updated_at: string;
  person: {
    id: number;
    name: string;
    surname: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
  };
}
export interface StaffAppointment {
  id: number;
  date: string;
  time: string;
  customer_name: string;
  service_name: string;
  status_id: number;
  status_name?: string;
  notes?: string;
}

export interface StaffAppointmentsFilters {
  date?: string;
  customer_name?: string;
  status_id?: number | string;
}

export interface StaffAppointmentDetail extends StaffAppointment {
  customer_phone?: string;
  customer_email?: string;
  created_at: string;
}

export interface StaffAppointment {
  id: number;
  staff_id: number;
  customer_id: number;
  service_id: number;
  state_id: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  customer: {
    id: number;
    person_id: number;
    email: string;
    person: {
      id: number;
      name: string;
      surname: string;
      phone_number: string;
    };
  };
  service: {
    id: number;
    catagory_id: number;
    name: string;
    duration: number;
  };
  status: {
    id: number;
    name: "pending" | "confirmed" | "completed" | "cancelled";
  };
}

export interface StaffAppointmentsFilters {
  date?: string;
  customer_name?: string;
  status_id?: string;
}

export interface Service {
  id: number;
  catagory_id: number;
  name: string;
  duration: number;
  description?: string;
}

export interface CustomerAppointment {
  id: number;
  staff_id: number;
  service_id: number;
  state_id: number;
  start_date: string;
  end_date: string;
  staff: {
    id: number;
    person: {
      name: string;
      surname: string;
    };
  };
  service: {
    name: string;
    duration: number;
  };
  status: {
    id: number;
    name: "pending" | "confirmed" | "completed" | "cancelled";
  };
}

export interface CreateAppointmentShape {
  service_id: number;
  date: string;
  start_time: string;
}
