interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  statusDot?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  action,
  statusDot,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            {title}
          </h1>
          {statusDot && (
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          )}
        </div>
        {subtitle && (
          <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
