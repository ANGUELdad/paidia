"use client";

import { t } from "@/lib/i18n";

export function EmptyState({
  title,
  hint,
  action,
}: {
  title?: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state" data-testid="empty-state">
      <strong>{title || t("emptyDefault")}</strong>
      <p className="muted m-0 mt-1">{hint || t("emptyHint")}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export function LoadingBlock({ label }: { label?: string }) {
  return (
    <div className="loading-block" data-testid="loading-block" aria-busy="true">
      <div className="skeleton-bar w-40" />
      <div className="skeleton-bar w-64" />
      <div className="skeleton-card" />
      <p className="muted text-sm mt-2">{label || t("loading")}</p>
    </div>
  );
}
