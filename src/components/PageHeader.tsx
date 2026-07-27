interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  if (action) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">{title}</h1>
          {subtitle && <p className="text-main/60 text-sm mt-1">{subtitle}</p>}
        </div>
        <div>{action}</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-header">{title}</h1>
      {subtitle && <p className="text-main/60 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
