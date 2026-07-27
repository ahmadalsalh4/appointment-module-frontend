import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Error from "../components/Error";
import { useRegisterMutation } from "../../hooks/useAuthQueries";
import { useAuth } from "../../contexts/auth/useAuth";
import type { RegisterShape } from "../../other/types";


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
  const { handleLoginSuccess } = useAuth();

  const {
    mutate: register,
    data,
    isPending,
    isError,
    error,
  } = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register(form);
  };
  useEffect(() => {
    if (data) {
      handleLoginSuccess({ token: data.token, role: data.role, user: data.customer, other_roles: [] });

      if (data.role === "customer") {
        navigate("/");
      }
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="label"
            >
              Ad
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="Adınız"
              required
            />
          </div>

          {/* Surname */}
          <div>
            <label
              htmlFor="surname"
              className="label"
            >
              Soyad
            </label>
            <input
              id="surname"
              type="text"
              value={form.surname}
              onChange={handleChange}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="Soyadınız"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="label"
            >
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="ornek@sirket.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone_number"
              className="label"
            >
              Telefon Numarası
            </label>
            <input
              id="phone_number"
              type="tel"
              value={form.phone_number}
              onChange={handleChange}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="0512 345 67 89"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="label"
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Password Confirmation */}
          <div>
            <label
              htmlFor="password_confirmation"
              className="label"
            >
              Şifre Tekrar
            </label>
            <input
              id="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="••••••••"
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
          <Link
            to="/login"
            className="font-semibold text-waiting hover:underline"
          >
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
