"use client";

export function PageShell({
  eyebrow,
  title,
  lead,
  children,
  actions,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <main className="page" data-theme="signal">
      <header className="top shell-top">
        <div className="min-w-0 page-heading">
          <p className="eyebrow">Armonia · {eyebrow}</p>
          <h1 className="shell-title">{title}</h1>
          {lead && <p className="muted shell-lead">{lead}</p>}
        </div>
        {actions && <div className="shell-actions">{actions}</div>}
      </header>
      <div className="page-fill">{children}</div>
    </main>
  );
}
