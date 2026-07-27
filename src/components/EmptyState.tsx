import { Calendar } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  action?: React.ReactNode;
}

function CalendarIcon() {
  return <Calendar className="empty-state-icon" strokeWidth={1.5} />;
}

export default function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon ?? <CalendarIcon />}
      <p className="text-main/60 text-lg mt-4">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
