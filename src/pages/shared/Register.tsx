import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Error from "../components/Error";
import { useRegisterMutation } from "../../hooks/useAuthQueries";
import { useAuth } from "../../contexts/auth/useAuth";
import { useToast } from "../../hooks/useToast";
import { ROLE_HOME } from "../../utils/roleHome";
import type { RegisterShape } from "../../other/types";
import type { LaravelErrorResponse } from "../../other/types";
import type { AxiosError } from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterShape>({
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });
  const { handleLoginSuccess, token, role } = useAuth();
  const toast = useToast();

  const {
    mutate: register,
    data,
    isPending,
    isError,
    error,
  } = useRegisterMutation();

  // Redirect already-authenticated users away from the registration form.
  useEffect(() => {
    if (token && role) {
      navigate(ROLE_HOME[role], { replace: true });
    }
  }, [token, role, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Client-side password match check (the backend enforces it via
    // `confirmed` but a clearer early message helps the user).
    if (form.password !== form.password_confirmation) {
      toast.error("Şifre ve şifre tekrarı eşleşmiyor.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Şifre en az 8 karakter olmalı.");
      return;
    }
    register(form);
  };

  // Extract per-field validation errors from the Laravel response.
  const fieldErrors =
    (error as AxiosError<LaravelErrorResponse> | null)?.response?.data?.errors ?? {};

  useEffect(() => {
    if (data) {
      handleLoginSuccess({ token: data.token, role: data.role, user: data.customer, other_roles: [] });
      navigate(ROLE_HOME[data.role] ?? "/", { replace: true });
    }
  }, [data, handleLoginSuccess, navigate]);

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 py-12 sm:py-16 bg-back">
      <div className="card-auth">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-main text-balance">
            Hesap Oluştur
          </h1>
          <p className="mt-2 text-sm text-main/70">
            Hemen kayıt olun ve randevunuzu alın
          </p>
          <div className="mt-4 h-1 w-16 mx-auto rounded-full bg-deep"></div>
        </div>

        {/* Show Backend Validation Errors (e.g. Email already exists) */}
        {isError && <Error message={error?.response?.data?.message} />}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name */}
          <div>
            <label htmlFor="name" className="label">Ad</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="Adınız"
              required
            />
            {fieldErrors.name && (
              <p className="text-xs text-canceld mt-1">{fieldErrors.name[0]}</p>
            )}
          </div>

          {/* Surname */}
          <div>
            <label htmlFor="surname" className="label">Soyad</label>
            <input
              id="surname"
              type="text"
              value={form.surname}
              onChange={handleChange}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="Soyadınız"
              required
            />
            {fieldErrors.surname && (
              <p className="text-xs text-canceld mt-1">{fieldErrors.surname[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="label">E-posta Adresi</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="ornek@sirket.com"
              required
            />
            {fieldErrors.email && (
              <p className="text-xs text-canceld mt-1">{fieldErrors.email[0]}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone_number" className="label">Telefon Numarası</label>
            <input
              id="phone_number"
              type="tel"
              value={form.phone_number}
              onChange={handleChange}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="0555 555 55 55"
              pattern="^0?5[0-9]{9}$"
              title="Geçerli bir Türkiye cep numarası girin (örn: 05555555555)"
              required
            />
            {fieldErrors.phone_number && (
              <p className="text-xs text-canceld mt-1">{fieldErrors.phone_number[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="label">Şifre</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="En az 8 karakter"
              minLength={8}
              required
            />
            {fieldErrors.password && (
              <p className="text-xs text-canceld mt-1">{fieldErrors.password[0]}</p>
            )}
          </div>

          {/* Password Confirmation */}
          <div>
            <label htmlFor="password_confirmation" className="label">Şifre Tekrar</label>
            <input
              id="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="btn-auth mt-2"
          >
            {isPending ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-main/70">
          Zaten hesabınız var mı?{" "}
          <Link to="/login" className="font-semibold text-waiting hover:underline">
            Giriş Yapın
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-completed/80">
          © 2026 Ahmad Alsaleh. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
