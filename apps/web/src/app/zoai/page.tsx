"use client";

import { Suspense } from "react";
import ZoAiInner from "./ZoAiInner";

export default function ZoAiPage() {
  return (
    <Suspense fallback={<main className="page">Laden…</main>}>
      <ZoAiInner />
    </Suspense>
  );
}
