"use client";

import Link from "next/link";

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
    <main className="page">
      <header className="top shell-top">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="shell-title">{title}</h1>
          {lead && <p className="muted shell-lead">{lead}</p>}
        </div>
        {actions && <div className="shell-actions">{actions}</div>}
      </header>
      {children}
    </main>
  );
}

export function Grid({ cols = 1, children }: { cols?: 1 | 2; children: React.ReactNode }) {
  return <div className={cols === 2 ? "grid-even-2" : "grid-even"}>{children}</div>;
}

export function ActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="btn-sec !min-h-10 text-sm">
      {children}
    </Link>
  );
}
