import { useState, useEffect } from "react";
import Error from "../components/Error";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "../../hooks/useAuthQueries";
import { useAuth } from "../../contexts/auth/useAuth";
import { ROLE_HOME } from "../../utils/roleHome";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { mutate: login, isPending, isError, error, data } = useLoginMutation();
  const { handleLoginSuccess, token, role } = useAuth();
  const navigate = useNavigate();

  // If the user is already logged in, send them to their home —
  // before this fix a logged-in user could re-submit the login form
  // and accidentally replace their session.
  useEffect(() => {
    if (token && role) {
      navigate(ROLE_HOME[role], { replace: true });
    }
  }, [token, role, navigate]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    login(form);
  }

  useEffect(() => {
    if (data) {
      handleLoginSuccess(data);
      navigate(ROLE_HOME[data.role] ?? "/login", { replace: true });
    }
  }, [data, handleLoginSuccess, navigate]);

  return (
    <div className="flex items-center justify-center p-4 py-12 sm:py-16 bg-back">
      <div className="card-auth">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-main text-balance">
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
              message={error.response?.data?.message || "Giriş başarısız oldu."}
            />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="label">
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="ornek@sirket.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-auth"
          >
            {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-main/70 p-3 rounded-lg">
          Hesabınız yok mu?
          <Link to="/register" className="font-semibold text-waiting hover:underline">
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
