import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../auth/useAuth";
import type { Role } from "../../other/types";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "customer", label: "Müşteri" },
  { value: "staff", label: "Personel" },
  { value: "admin", label: "Admin" },
];

const HOME_PATH: Record<Role, string> = {
  customer: "/services",
  staff: "/staff/appointments",
  admin: "/admin/staff",
};

interface LoginPayload {
  email: string;
  password: string;
  role: Role;
}

export default function Login2() {
  const [role, setRole] = useState<Role>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: ({ email, password, role }: LoginPayload) =>
      login(email, password, role),
    onSuccess: (result) => {
      if (!result.success) {
        setFormError(result.message ?? "Giriş başarısız");
        return;
      }
      navigate(HOME_PATH[role], { replace: true });
    },
    onError: () => {
      setFormError("Sunucuya ulaşılamadı");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Lütfen e-posta ve şifre alanlarını doldurunuz.");
      return;
    }

    loginMutation.mutate({ email, password, role });
  };

  const displayError = formError;

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

        {displayError && (
          <div className="mb-6 p-3 rounded-lg text-sm text-center text-canceld bg-canceld/10">
            {displayError}
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
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-4 py-3 rounded-lg border border-main/20 bg-back text-main outline-none transition-all focus:border-deep focus:ring-2 focus:ring-deep/20"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-main/20 bg-back text-main outline-none transition-all focus:border-deep focus:ring-2 focus:ring-deep/20"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-deep hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-deep/50 focus:ring-offset-2 disabled:opacity-50"
          >
            {loginMutation.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        {role === "customer" && (
          <div className="mt-6 text-center text-sm text-main/70">
            Hesabınız yok mu?{" "}
            <a
              href="/register"
              className="font-semibold text-waiting hover:underline"
            >
              Kayıt Olun
            </a>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-completed/80">
          © 2026 Ahmad Alsaleh. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
