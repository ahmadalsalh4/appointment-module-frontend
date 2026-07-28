import { Link } from "react-router";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true" className="text-main/40">/</span>}
            {isLast || !item.to ? (
              <span className="breadcrumb-current" aria-current={isLast ? "page" : undefined}>{item.label}</span>
            ) : (
              <Link to={item.to} className="breadcrumb-link">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
