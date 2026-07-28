import { Calendar, Users, Briefcase, Tag } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  action?: React.ReactNode;
  variant?: "calendar" | "users" | "briefcase" | "tag";
}

function VariantIcon({ variant }: { variant: NonNullable<EmptyStateProps["variant"]> }) {
  const Icon =
    variant === "users" ? Users : variant === "briefcase" ? Briefcase : variant === "tag" ? Tag : Calendar;
  return <Icon className="empty-state-icon" strokeWidth={1.5} />;
}

export default function EmptyState({ icon, message, action, variant = "calendar" }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon ?? <VariantIcon variant={variant} />}
      <p className="text-main/60 text-lg mt-4">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
