"use client";

import Link from "next/link";

export function PageShell({
  eyebrow,
  title,
  lead,
  children,
  actions,
  back,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  /** Optional back-link href shown before the eyebrow */
  back?: string;
}) {
  return (
    <main className="page">
      <header className="shell-header">
        {back && (
          <Link href={back} className="shell-back" aria-label="Zurück">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M11 14L6 9l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Armonia · {eyebrow}</p>
          <h1 className="shell-title">{title}</h1>
          {lead && <p className="shell-lead">{lead}</p>}
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
