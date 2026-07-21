import { useState } from "react";
import { Link } from "react-router";

interface RegisterShape {
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
}

export default function Register() {
  const [form, setForm] = useState<RegisterShape>({
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !form.name ||
      !form.surname ||
      !form.email ||
      !form.phone_number ||
      !form.password ||
      !form.password_confirmation
    ) {
      setError("Lütfen tüm alanları doldurunuz.");
      return;
    }

    if (form.password !== form.password_confirmation) {
      setError("Şifreler birbiriyle eşleşmiyor.");
      return;
    }

    if (form.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    console.log("Müşteri Kayıt Olunuyor:", form);
    alert("Kayıt başarılı! (Bu sadece bir demo)");
  };

  // Helper function to handle input changes cleanly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

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

        {error && (
          <div className="mb-6 border-l-4 border-canceld py-2 pl-3">
            <p className="text-sm font-medium text-canceld">{error}</p>
          </div>
        )}

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

          {/* Phone Number - FIXED: Proper id, type, and state */}
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

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-deep hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-deep/50 focus:ring-offset-2 mt-2"
          >
            Kayıt Ol
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
