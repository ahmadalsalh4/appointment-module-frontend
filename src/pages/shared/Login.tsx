import { useState, useEffect } from "react";
import Error from "../components/Error";
import { Link, useNavigate } from "react-router";
import type { LoginShape } from "../../other/types";
import { useLoginMutation } from "../../hooks/useAuthQueries";
import { useAuth } from "../../contexts/auth/useAuth";

export default function Login() {
  const [form, setForm] = useState<LoginShape>({
    email: "",
    password: "",
    role: "customer",
  });

  const { mutate: login, isPending, isError, error, data } = useLoginMutation();

  const { saveRole, saveToken } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    login(form);
  }

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-back">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-surface">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-main">
            Hoş Geldiniz
          </h1>
          <p className="mt-2 text-sm text-main/70">
            Devam etmek için giriş yapın
          </p>
          <div className="mt-4 h-1 w-16 mx-auto rounded-full bg-deep"></div>
        </div>
        {isError && (
          <div className="mb-6">
            <Error
              message={error.response?.data.message || "Giriş başarısız oldu."}
            />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium mb-2 text-main"
            >
              Giriş Türü
            </label>

            <select
              id="role"
              value={form.role || "customer"}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as LoginShape["role"] })
              }
              className="w-full px-4 py-3 rounded-lg border border-main/20 bg-back text-main outline-none transition-all focus:border-deep focus:ring-2 focus:ring-deep/20"
            >
              <option value="customer">Müşteri</option>
              <option value="staff">Personel</option>
              <option value="admin">Admin</option>
            </select>
          </div>

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
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-main/20 bg-back text-main outline-none transition-all focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="ornek@sirket.com"
              required
            />
          </div>

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
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-main/20 bg-back text-main outline-none transition-all focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-deep hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-deep/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <div
          className={`${form.role === "customer" ? "visible" : "invisible"} mt-6 text-center text-sm text-main/70 p-3 rounded-lg`}
        >
          Hesabınız yok mu?
          <Link
            to="/register"
            className="font-semibold text-waiting hover:underline"
          >
            Kayıt Olun
          </Link>
        </div>
        <p className="mt-8 text-center text-xs text-completed/80">
          © 2026 Ahmad Alsaleh. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
