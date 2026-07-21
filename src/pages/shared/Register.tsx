import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "../../hooks/auth";
import Error from "../../components/Error";
import type { RegisterShape } from "../../api/auth";
import { useAuth } from "../../contexts/auth/useAuth";

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
  const { saveRole, saveToken } = useAuth();

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

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    register(form, {
      onSuccess: (data) => {
        console.log("Registration Success:", data);
        navigate("/login");
      },
    });
  };
  useEffect(() => {
    if (data) {
      saveRole(data.role);
      saveToken(data.token);

      if (data.role === "customer") {
        navigate("/");
      } else if (data.role === "staff") {
        navigate("/staff");
      } else if (data.role === "admin") {
        navigate("/admin");
      }
    }
  }, [data, saveRole, saveToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-back">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-surface">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-main">
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
              className="block text-sm font-medium mb-2 text-main"
            >
              Ad
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-main/20 bg-back text-main outline-none transition-all focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="Adınız"
              required
            />
          </div>

          {/* Surname */}
          <div>
            <label
              htmlFor="surname"
              className="block text-sm font-medium mb-2 text-main"
            >
              Soyad
            </label>
            <input
              id="surname"
              type="text"
              value={form.surname}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-main/20 bg-back text-main outline-none transition-all focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="Soyadınız"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-main"
            >
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-main/20 bg-back text-main outline-none transition-all focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="ornek@sirket.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium mb-2 text-main"
            >
              Telefon Numarası
            </label>
            <input
              id="phone_number"
              type="tel"
              value={form.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-main/20 bg-back text-main outline-none transition-all focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="0512 345 67 89"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-main"
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-main/20 bg-back text-main outline-none transition-all focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Password Confirmation */}
          <div>
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium mb-2 text-main"
            >
              Şifre Tekrar
            </label>
            <input
              id="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-main/20 bg-back text-main outline-none transition-all focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-deep hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-deep/50 focus:ring-offset-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
