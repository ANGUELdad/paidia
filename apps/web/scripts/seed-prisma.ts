/**
 * Seed Prisma SQLite from platform JSON seed (migrate_ops_to_prisma.py output).
 * Usage: npx tsx scripts/seed-prisma.ts /tmp/armonia-prisma-seed.json
 */
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const path = process.argv[2];
  if (!path) throw new Error("Provide seed JSON path");
  const data = JSON.parse(readFileSync(path, "utf8"));

  for (const p of data.profiles || []) {
    await prisma.profile.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        name: p.name,
        mode: p.mode,
        role: p.role,
        admin: !!p.admin,
        color: p.color,
        pinHash: p.pinHash,
      },
      update: { name: p.name, role: p.role, admin: !!p.admin, color: p.color, pinHash: p.pinHash },
    });
  }
  for (const h of data.houses || []) {
    await prisma.house.upsert({
      where: { id: h.id },
      create: { id: h.id, name: h.name, short: h.short || h.name.slice(0, 3) },
      update: { name: h.name, short: h.short || h.name.slice(0, 3) },
    });
  }
  for (const p of data.products || []) {
    await prisma.product.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        nameDe: p.nameDe,
        nameEl: p.nameEl || "",
        unit: p.unit,
        category: p.category,
      },
      update: { nameDe: p.nameDe, nameEl: p.nameEl || "", unit: p.unit, category: p.category },
    });
  }
  for (const r of data.notificationRules || []) {
    await prisma.notificationRule.upsert({
      where: { id: r.id },
      create: {
        id: r.id,
        kind: r.kind || r.id,
        enabled: r.enabled !== false,
        channels: JSON.stringify(r.channels || ["local", "push"]),
      },
      update: { enabled: r.enabled !== false },
    });
  }
  await prisma.buildInfo.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      version: 1,
      label: "v1-platform",
      changedDe: "Neue Plattform",
      changedEl: "Νέα πλατφόρμα",
    },
    update: { version: 1, label: "v1-platform" },
  });
  console.log("Seeded profiles", (data.profiles || []).length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
