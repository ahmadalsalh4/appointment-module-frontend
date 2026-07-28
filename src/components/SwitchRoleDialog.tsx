import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import Modal from "./Modal";
import { useMyRolesQuery } from "../hooks/useMyRolesQuery";
import { useAuth } from "../contexts/auth/useAuth";
import authApi from "../api/auth";
import type { UserRole } from "../other/types";

interface SwitchRoleDialogProps {
  open: boolean;
  onClose: () => void;
  targetRole: UserRole;
}

const ROLE_LABEL: Record<UserRole, string> = {
  customer: "Müşteri",
  staff: "Personel",
  admin: "Yönetici",
};

const ROLE_PATH: Record<UserRole, string> = {
  customer: "/",
  staff: "/staff",
  admin: "/admin",
};

export default function SwitchRoleDialog({ open, onClose, targetRole }: SwitchRoleDialogProps) {
  const { handleSwitchRole } = useAuth();
  const { refetch: refetchMyRoles } = useMyRolesQuery();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await authApi.switchRole({ role: targetRole, password });
      handleSwitchRole(result);
      await refetchMyRoles();
      navigate(ROLE_PATH[targetRole], { replace: true });
    } catch (err) {
      const e2 = err as { response?: { data?: { message?: string } } };
      setError(e2?.response?.data?.message || "Rol değiştirme başarısız oldu. Şifrenizi kontrol edin.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setPassword("");
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Rol Değiştir"
      description={`Devam etmek için ${ROLE_LABEL[targetRole]} rolüne geçiş yapacaksınız. Güvenlik için şifrenizi girin.`}
      size="sm"
      closeOnBackdrop={!submitting}
      closeOnEscape={!submitting}
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="btn-secondary"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            form="switch-role-form"
            disabled={submitting || !password}
            className="btn-primary"
          >
            {submitting ? <span className="spinner-sm" /> : "Onayla ve Geç"}
          </button>
        </>
      }
    >
      <form id="switch-role-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="switch-role-password" className="label">
            Şifre
          </label>
          <input
            id="switch-role-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            autoFocus
          />
        </div>
        {error && (
          <div role="alert" className="text-sm text-canceld bg-canceld/10 border border-canceld/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </form>
    </Modal>
  );
}
