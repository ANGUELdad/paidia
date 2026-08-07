import { z } from "zod";

export const ProfileMode = z.enum(["staff", "child"]);

export const LoginSchema = z.object({
  profileId: z.string().min(1),
  mode: ProfileMode,
  pin: z.string().min(4).max(6),
});

export const ZoAiActionTypes = [
  "stock_adjust",
  "stock_set",
  "shop_add",
  "shop_remove",
  "schedule_add",
  "broadcast_email",
  "event_announce",
  "open_tab",
  "want_bought",
] as const;

export const NotifyKinds = [
  "shift_start",
  "presence_late",
  "low_stock",
  "friday_list",
  "journal_due",
  "event_publish",
  "meeting_notes_due",
  "broadcast",
  "child_event",
] as const;

export const DEFAULT_WIDGETS = ["shift", "tasks", "stock", "journal", "meeting", "events"] as const;

export const BUILD = {
  version: 1,
  label: "v1-platform",
  changed: {
    de: "Neue Plattform · Widgets · Zo-Ai · Automationen · Kids Rewards",
    el: "Νέα πλατφόρμα · Widgets · Zo-Ai · Automations · Kids rewards",
  },
} as const;

export type ProfileModeT = z.infer<typeof ProfileMode>;
export type LoginBody = z.infer<typeof LoginSchema>;
