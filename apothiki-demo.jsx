import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Refrigerator,
  CalendarDays,
  BookOpen,
  Camera,
  Check,
  Plus,
  X,
  Clock,
  LogOut,
  Sparkles,
  AlertTriangle,
  Minus,
  Home,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock data — stands in for the real database in the full build
// ---------------------------------------------------------------------------

// Δύο σπίτια. Κάθε παιδί, κάθε ανάθεση και κάθε ψυγείο ανήκει σε ένα σπίτι.
const HOUSES = [
  { id: "kalyvia", name: "Καλύβια" },
  { id: "limenaria", name: "Λιμενάρια" },
];

const EMPLOYEES = [
  { id: 1, name: "Μαρία Κ.", pin: "1111", initials: "ΜΚ", role: "Φροντίστρια" },
  { id: 2, name: "Γιώργος Π.", pin: "2222", initials: "ΓΠ", role: "Φροντιστής" },
  { id: 3, name: "Ελένη Ν.", pin: "3333", initials: "ΕΝ", role: "Υπεύθυνη" },
];

const DAYS = [
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
  "Κυριακή",
];

const CHILDREN = [
  { id: "a", name: "Παιδί Α", house: "kalyvia" },
  { id: "b", name: "Παιδί Β", house: "kalyvia" },
  { id: "c", name: "Παιδί Γ", house: "kalyvia" },
  { id: "d", name: "Παιδί Δ", house: "limenaria" },
  { id: "e", name: "Παιδί Ε", house: "limenaria" },
];

// Προκαθορισμένη λίστα δραστηριοτήτων — το «τι θα κάνει» της ανάθεσης
const ACTIVITIES = [
  { id: "food", label: "Φαγητό", emoji: "🍽️" },
  { id: "sleep", label: "Ύπνος", emoji: "😴" },
  { id: "study", label: "Μελέτη", emoji: "📚" },
  { id: "play", label: "Παιχνίδι", emoji: "🧸" },
  { id: "bath", label: "Μπάνιο", emoji: "🛁" },
  { id: "walk", label: "Βόλτα", emoji: "🚶" },
  { id: "meds", label: "Φάρμακα", emoji: "💊" },
  { id: "transport", label: "Μεταφορά", emoji: "🚌" },
  { id: "clean", label: "Καθαριότητα", emoji: "🧹" },
  { id: "other", label: "Άλλο", emoji: "📝" },
];

// Ένας φροντιστής μπορεί να έχει ΠΟΛΛΑ παιδιά στην ίδια ανάθεση → children: []
const DEFAULT_TEMPLATE = {
  Δευτέρα: [
    { emp: 1, house: "kalyvia", children: ["a", "b"], start: "09:00", end: "13:00", activity: "study", note: "Μαθηματικά + ανάγνωση" },
    { emp: 2, house: "limenaria", children: ["d", "e"], start: "09:00", end: "13:00", activity: "play", note: "" },
  ],
  Τρίτη: [
    { emp: 1, house: "kalyvia", children: ["b", "c"], start: "09:00", end: "13:00", activity: "study", note: "" },
    { emp: 3, house: "kalyvia", children: ["a"], start: "13:00", end: "17:00", activity: "transport", note: "Λογοθεραπεία 14:30" },
  ],
  Τετάρτη: [
    { emp: 2, house: "limenaria", children: ["d", "e"], start: "09:00", end: "13:00", activity: "food", note: "" },
    { emp: 1, house: "kalyvia", children: ["a", "b", "c"], start: "13:00", end: "17:00", activity: "play", note: "" },
  ],
  Πέμπτη: [
    { emp: 3, house: "kalyvia", children: ["b"], start: "09:00", end: "13:00", activity: "study", note: "" },
    { emp: 2, house: "limenaria", children: ["d", "e"], start: "13:00", end: "17:00", activity: "sleep", note: "" },
  ],
  Παρασκευή: [
    { emp: 1, house: "kalyvia", children: ["a", "c"], start: "09:00", end: "13:00", activity: "walk", note: "Πάρκο" },
    { emp: 3, house: "limenaria", children: ["d"], start: "13:00", end: "17:00", activity: "bath", note: "" },
  ],
  Σάββατο: [
    { emp: 2, house: "kalyvia", children: ["a", "b", "c"], start: "10:00", end: "14:00", activity: "play", note: "" },
  ],
  Κυριακή: [],
};

// Λίστες αγορών ανά σπίτι — τις ετοιμάζουν οι φροντιστές, ψώνια κάθε Παρασκευή
const SEED_LIST = [
  { id: 1, name: "Ντομάτες", qty: 5, unit: "kg", house: "kalyvia", by: 1, checked: false },
  { id: 2, name: "Κοτόπουλο", qty: 3, unit: "kg", house: "kalyvia", by: 1, checked: false },
  { id: 3, name: "Γάλα", qty: 12, unit: "τεμ", house: "kalyvia", by: 3, checked: false },
  { id: 4, name: "Ελαιόλαδο", qty: 2, unit: "λίτρα", house: "limenaria", by: 2, checked: false },
  { id: 5, name: "Ψωμί", qty: 8, unit: "τεμ", house: "limenaria", by: 2, checked: false },
];

const STOCK_ITEMS = ["Ντομάτες", "Κοτόπουλο", "Γάλα", "Ελαιόλαδο", "Ψωμί", "Πατάτες"];

// Απόθεμα ανά σπίτι — κάθε σπίτι έχει το δικό του ψυγείο. Κλειδί: "house:προϊόν"
const SEED_STOCK = {
  "kalyvia:Ντομάτες": 4,
  "kalyvia:Κοτόπουλο": 3,
  "kalyvia:Γάλα": 10,
  "kalyvia:Ελαιόλαδο": 2,
  "kalyvia:Ψωμί": 3,
  "kalyvia:Πατάτες": 6,
  "limenaria:Ντομάτες": 2,
  "limenaria:Κοτόπουλο": 2,
  "limenaria:Γάλα": 6,
  "limenaria:Ελαιόλαδο": 1,
  "limenaria:Ψωμί": 2,
  "limenaria:Πατάτες": 4,
};

// ---------------------------------------------------------------------------

function fmtTime(d) {
  return d.toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit" });
}
function fmtDate(d) {
  return d.toLocaleDateString("el-GR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const houseById = (id) => HOUSES.find((h) => h.id === id);
const childById = (id) => CHILDREN.find((c) => c.id === id);
const activityById = (id) => ACTIVITIES.find((a) => a.id === id);
const childrenOf = (houseId) => CHILDREN.filter((c) => c.house === houseId);
const childNames = (ids) => (ids || []).map((i) => childById(i)?.name).filter(Boolean).join(", ");

function Stamp({ initials, small }) {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center rounded-full border-2 border-dashed border-emerald-700 text-emerald-800 -rotate-3 shrink-0 ${
        small ? "w-9 h-9" : "w-12 h-12"
      }`}
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      <span className={small ? "text-[10px] font-bold" : "text-xs font-bold"}>{initials}</span>
    </div>
  );
}

function CategoryTag({ category }) {
  const styles = {
    Λίστα: "bg-amber-100 text-amber-800 border-amber-300",
    Ψυγείο: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Πρόγραμμα: "bg-stone-200 text-stone-700 border-stone-300",
  };
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${styles[category]}`}>
      {category}
    </span>
  );
}

function HousePicker({ value, onChange, includeAll }) {
  const options = includeAll ? [{ id: "all", name: "Όλα" }, ...HOUSES] : HOUSES;
  return (
    <div className="flex gap-1 bg-stone-200 rounded-xl p-1">
      {options.map((h) => (
        <button
          key={h.id}
          onClick={() => onChange(h.id)}
          className={`flex-1 text-xs font-medium py-2 rounded-lg transition ${
            value === h.id ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
          }`}
        >
          {h.name}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [tab, setTab] = useState("lists");

  // Ενεργό σπίτι για Λίστες & Ψυγείο· το Πρόγραμμα έχει δικό του φίλτρο με «Όλα»
  const [house, setHouse] = useState(HOUSES[0].id);
  const [scheduleHouse, setScheduleHouse] = useState("all");

  const [shoppingList, setShoppingList] = useState(SEED_LIST);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("kg");

  const [scanState, setScanState] = useState("idle"); // idle | scanning | done
  const [extraFound, setExtraFound] = useState(null);

  // Το πρότυπο ΔΕΝ αλλάζει ποτέ από έκτακτη αλλαγή — τα overrides ζουν χωριστά.
  // Κλειδί: "ημέρα:index". Στην πραγματική βάση το κλειδί είναι ημερομηνία.
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [overrides, setOverrides] = useState({});
  const [editModal, setEditModal] = useState(null); // {day, idx}
  const [draft, setDraft] = useState(null);
  const [scope, setScope] = useState("override"); // override | template

  const [stock, setStock] = useState(SEED_STOCK);
  const [moveDir, setMoveDir] = useState("out"); // in | out
  const [moveItem, setMoveItem] = useState(STOCK_ITEMS[0]);
  const [moveQty, setMoveQty] = useState(1);
  const [movePhoto, setMovePhoto] = useState(false);

  const [book, setBook] = useState([
    {
      id: 1,
      ts: new Date(Date.now() - 1000 * 60 * 60 * 20),
      empId: 2,
      category: "Ψυγείο",
      text: "Έξοδος @ Λιμενάρια: 1kg Κοτόπουλο",
      photo: true,
    },
    {
      id: 2,
      ts: new Date(Date.now() - 1000 * 60 * 60 * 44),
      empId: 3,
      category: "Πρόγραμμα",
      text: "Έκτακτη αλλαγή (Τρίτη): Ελένη Ν. @ Καλύβια → Παιδί Α · Μεταφορά",
      photo: false,
    },
  ]);

  const empById = (id) => EMPLOYEES.find((e) => e.id === id);

  function logEntry(category, text, photo = false) {
    setBook((b) => [
      { id: Date.now(), ts: new Date(), empId: currentUser.id, category, text, photo },
      ...b,
    ]);
  }

  function handlePinDigit(d) {
    if (pinInput.length >= 4) return;
    const next = pinInput + d;
    setPinInput(next);
    setPinError(false);
    if (next.length === 4) {
      const match = EMPLOYEES.find((e) => e.pin === next);
      if (match) {
        setTimeout(() => {
          setCurrentUser(match);
          setPinInput("");
        }, 150);
      } else {
        setTimeout(() => {
          setPinError(true);
          setPinInput("");
        }, 150);
      }
    }
  }

  // ---------------------------------------------------------------------
  // Λίστες
  // ---------------------------------------------------------------------
  function addListItem() {
    if (!newItemName.trim() || !newItemQty) return;
    setShoppingList((l) => [
      ...l,
      {
        id: Date.now(),
        name: newItemName.trim(),
        qty: Number(newItemQty),
        unit: newItemUnit,
        house,
        by: currentUser.id,
        checked: false,
      },
    ]);
    setNewItemName("");
    setNewItemQty("");
  }

  function removeListItem(id) {
    setShoppingList((l) => l.filter((i) => i.id !== id));
  }

  const houseList = shoppingList.filter((i) => i.house === house);

  function simulateFridayScan() {
    setScanState("scanning");
    setExtraFound(null);
    setTimeout(() => {
      setShoppingList((l) => l.map((i) => (i.house === house ? { ...i, checked: true } : i)));
      setExtraFound({ name: "Αυγά", qty: 30, unit: "τεμ" });
      setScanState("done");
    }, 1600);
  }

  function confirmFridayDelivery(includeExtra) {
    const items = houseList.map((i) => `${i.name} (${i.qty}${i.unit})`).join(", ");
    const extraText =
      includeExtra && extraFound
        ? ` + εκτός λίστας: ${extraFound.name} (${extraFound.qty}${extraFound.unit})`
        : "";
    setStock((s) => {
      const next = { ...s };
      houseList.forEach((i) => {
        const key = `${house}:${i.name}`;
        if (key in next) next[key] = next[key] + i.qty;
      });
      return next;
    });
    logEntry(
      "Λίστα",
      `Παράδοση Παρασκευής @ ${houseById(house).name} – ${houseList.length} προϊόντα: ${items}${extraText}`,
      true
    );
    setShoppingList((l) => l.map((i) => (i.house === house ? { ...i, checked: false } : i)));
    setScanState("idle");
    setExtraFound(null);
  }

  // ---------------------------------------------------------------------
  // Ψυγείο
  // ---------------------------------------------------------------------
  function submitMove() {
    if (!movePhoto) return;
    const key = `${house}:${moveItem}`;
    const isIn = moveDir === "in";
    setStock((s) => ({ ...s, [key]: Math.max(0, (s[key] ?? 0) + (isIn ? moveQty : -moveQty)) }));
    logEntry(
      "Ψυγείο",
      `${isIn ? "Είσοδος" : "Έξοδος"} @ ${houseById(house).name}: ${moveQty}kg ${moveItem}`,
      true
    );
    setMoveQty(1);
    setMovePhoto(false);
  }

  // ---------------------------------------------------------------------
  // Πρόγραμμα
  // ---------------------------------------------------------------------
  /** Το πρότυπο + τυχόν override — το πρότυπο μένει πάντα ανέπαφο. */
  function resolveSlot(day, idx) {
    const base = template[day][idx];
    const o = overrides[`${day}:${idx}`];
    return o ? { ...base, ...o, overridden: true } : { ...base, overridden: false };
  }

  function openEdit(day, idx) {
    const slot = resolveSlot(day, idx);
    setDraft({
      emp: slot.emp,
      house: slot.house,
      children: [...slot.children],
      start: slot.start,
      end: slot.end,
      activity: slot.activity,
      note: slot.note || "",
    });
    setScope("override");
    setEditModal({ day, idx });
  }

  function toggleDraftChild(id) {
    setDraft((d) => ({
      ...d,
      children: d.children.includes(id) ? d.children.filter((x) => x !== id) : [...d.children, id],
    }));
  }

  function setDraftHouse(hid) {
    setDraft((d) => ({
      ...d,
      house: hid,
      children: d.children.filter((c) => childById(c)?.house === hid),
    }));
  }

  function saveEdit() {
    if (!draft.children.length) return;
    const { day, idx } = editModal;
    const label =
      `${empById(draft.emp).name} @ ${houseById(draft.house).name} → ${childNames(draft.children)} ` +
      `${draft.start}–${draft.end} · ${activityById(draft.activity).label}` +
      (draft.note ? ` — ${draft.note}` : "");

    if (scope === "template") {
      setTemplate((t) => {
        const copy = { ...t, [day]: [...t[day]] };
        copy[day][idx] = { ...draft };
        return copy;
      });
      setOverrides((o) => {
        const next = { ...o };
        delete next[`${day}:${idx}`];
        return next;
      });
      logEntry("Πρόγραμμα", `Μόνιμη αλλαγή προτύπου (${day}): ${label}`);
    } else {
      setOverrides((o) => ({ ...o, [`${day}:${idx}`]: { ...draft } }));
      logEntry("Πρόγραμμα", `Έκτακτη αλλαγή (${day}, μόνο για σήμερα): ${label}`);
    }
    setEditModal(null);
    setDraft(null);
  }

  const sortedBook = useMemo(() => [...book].sort((a, b) => b.ts - a.ts), [book]);

  // ---------------------------------------------------------------------
  // Login gate
  // ---------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');`}</style>
        <div className="w-full max-w-xs text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-emerald-500 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-emerald-500" />
          </div>
          <h1 className="text-2xl text-stone-50 mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
            Το Βιβλίο
          </h1>
          <p className="text-stone-400 text-sm mb-8">Βάλε το PIN σου για να μπεις</p>

          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border-2 ${
                  i < pinInput.length ? "bg-emerald-500 border-emerald-500" : "border-stone-600"
                } ${pinError ? "border-red-500" : ""}`}
              />
            ))}
          </div>
          {pinError && (
            <p className="text-red-400 text-xs mb-4 flex items-center justify-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Λάθος PIN, δοκίμασε ξανά
            </p>
          )}

          <div className="grid grid-cols-3 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
              <button
                key={d}
                onClick={() => handlePinDigit(d)}
                className="h-14 rounded-xl bg-stone-800 text-stone-100 text-lg font-medium hover:bg-stone-700 active:bg-stone-600 transition"
              >
                {d}
              </button>
            ))}
            <div />
            <button
              onClick={() => handlePinDigit("0")}
              className="h-14 rounded-xl bg-stone-800 text-stone-100 text-lg font-medium hover:bg-stone-700 active:bg-stone-600 transition"
            >
              0
            </button>
            <button
              onClick={() => setPinInput((p) => p.slice(0, -1))}
              className="h-14 rounded-xl bg-stone-800 text-stone-400 text-sm font-medium hover:bg-stone-700 active:bg-stone-600 transition"
            >
              ⌫
            </button>
          </div>
          <p className="text-stone-600 text-xs mt-6">Demo PIN: 1111 / 2222 / 3333</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Main app
  // ---------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-stone-50 pb-24" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap'); body{font-family:'IBM Plex Mono',monospace;}`}</style>

      {/* Header */}
      <div className="bg-stone-900 text-stone-50 px-4 pt-5 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 700 }}>
            Το Βιβλίο
          </h1>
          <div className="flex items-center gap-2">
            <Stamp initials={currentUser.initials} small />
            <button onClick={() => setCurrentUser(null)} className="text-stone-400 hover:text-stone-100 transition">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-stone-400 text-xs mt-1">
          {currentUser.name} · {currentUser.role} · {fmtDate(new Date())}
        </p>
      </div>

      <div className="px-4 pt-4">
        {/* ---------------- LISTS TAB ---------------- */}
        {tab === "lists" && (
          <div className="space-y-4">
            <HousePicker value={house} onChange={setHouse} />

            <div className="flex items-center justify-between">
              <h2 className="text-stone-800 text-base" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                Λίστα Αγορών
              </h2>
              <span className="text-[11px] text-stone-500">{houseList.length} είδη</span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
              {houseList.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.checked && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm ${item.checked ? "text-stone-400 line-through" : "text-stone-800"}`}>
                        {item.name}
                      </p>
                      {item.by && (
                        <p className="text-[11px] text-stone-400">από {empById(item.by).name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-stone-500">
                      {item.qty} {item.unit}
                    </span>
                    <button onClick={() => removeListItem(item.id)} className="text-stone-300 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {houseList.length === 0 && <p className="text-center text-stone-400 text-sm py-6">Άδεια λίστα</p>}
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-3 flex gap-2">
              <input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Προϊόν"
                className="flex-1 min-w-0 text-sm px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                placeholder="Ποσ."
                type="number"
                className="w-16 text-sm px-2 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                className="text-sm px-2 py-2 rounded-lg border border-stone-200 focus:outline-none"
              >
                <option value="kg">kg</option>
                <option value="τεμ">τεμ</option>
                <option value="λίτρα">λίτρα</option>
              </select>
              <button
                onClick={addListItem}
                className="w-9 h-9 shrink-0 rounded-lg bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Friday bulk entry */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 mt-6">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-semibold text-amber-900" style={{ fontFamily: "'Fraunces', serif" }}>
                  Παράδοση Παρασκευής — {houseById(house).name}
                </h3>
              </div>
              <p className="text-xs text-amber-800 mb-4">
                Φωτογράφισε την απόδειξη — το AI ταιριάζει αυτόματα τα προϊόντα με τη λίστα του σπιτιού.
              </p>

              {scanState === "idle" && (
                <button
                  onClick={simulateFridayScan}
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white text-sm font-medium py-3 rounded-xl hover:bg-amber-700"
                >
                  <Camera className="w-4 h-4" /> Σκανάρισμα Απόδειξης
                </button>
              )}
              {scanState === "scanning" && (
                <div className="flex items-center justify-center gap-2 text-amber-800 text-sm py-3">
                  <span className="w-4 h-4 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                  Το AI διαβάζει την απόδειξη...
                </div>
              )}
              {scanState === "done" && (
                <div className="space-y-3">
                  <div className="bg-white rounded-xl border border-amber-200 p-3">
                    <p className="text-xs text-stone-500 mb-2">✓ Ταιριάχτηκαν αυτόματα με τη λίστα:</p>
                    {houseList.map((i) => (
                      <div key={i.id} className="flex justify-between text-sm text-stone-700 py-0.5">
                        <span>{i.name}</span>
                        <span className="text-stone-400">
                          {i.qty} {i.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                  {extraFound && (
                    <div className="bg-white rounded-xl border border-orange-300 p-3">
                      <p className="text-xs text-orange-700 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Βρέθηκε στην απόδειξη, δεν ήταν στη λίστα:
                      </p>
                      <div className="flex justify-between text-sm text-stone-700">
                        <span>{extraFound.name}</span>
                        <span className="text-stone-400">
                          {extraFound.qty} {extraFound.unit}
                        </span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => confirmFridayDelivery(true)}
                    className="w-full bg-emerald-700 text-white text-sm font-medium py-3 rounded-xl hover:bg-emerald-800 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Επιβεβαίωση & Καταχώρηση ({currentUser.initials})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- FRIDGE TAB ---------------- */}
        {tab === "fridge" && (
          <div className="space-y-4">
            <HousePicker value={house} onChange={setHouse} />

            <h2 className="text-stone-800 text-base" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
              Ψυγείο / Αποθήκη — {houseById(house).name}
            </h2>

            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-4">
              <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
                <button
                  onClick={() => setMoveDir("in")}
                  className={`flex-1 text-xs font-medium py-2 rounded-lg ${
                    moveDir === "in" ? "bg-emerald-700 text-white" : "text-stone-500"
                  }`}
                >
                  Είσοδος
                </button>
                <button
                  onClick={() => setMoveDir("out")}
                  className={`flex-1 text-xs font-medium py-2 rounded-lg ${
                    moveDir === "out" ? "bg-red-700 text-white" : "text-stone-500"
                  }`}
                >
                  Έξοδος
                </button>
              </div>

              <div>
                <label className="text-xs text-stone-500 mb-1 block">Προϊόν</label>
                <select
                  value={moveItem}
                  onChange={(e) => setMoveItem(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-stone-200"
                >
                  {STOCK_ITEMS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-stone-500 mb-1 block">Ποσότητα (kg)</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMoveQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-semibold text-stone-800 w-8 text-center">{moveQty}</span>
                  <button
                    onClick={() => setMoveQty((q) => q + 1)}
                    className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setMovePhoto((p) => !p)}
                className={`w-full flex items-center justify-center gap-2 text-sm font-medium py-3 rounded-xl border transition ${
                  movePhoto ? "bg-emerald-700 text-white border-emerald-700" : "bg-stone-50 text-stone-600 border-stone-200"
                }`}
              >
                <Camera className="w-4 h-4" /> {movePhoto ? "Φωτογραφία τραβήχτηκε ✓" : "Τράβηξε φωτογραφία"}
              </button>
              <button
                onClick={submitMove}
                disabled={!movePhoto}
                className="w-full bg-stone-900 text-white text-sm font-medium py-3 rounded-xl hover:bg-stone-800 disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Καταχώρηση με PIN {currentUser.initials}
              </button>
              {!movePhoto && (
                <p className="text-[11px] text-stone-400 text-center -mt-2">
                  Χωρίς φωτογραφία δεν καταχωρείται κίνηση.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                Απόθεμα
              </div>
              <div className="divide-y divide-stone-100">
                {STOCK_ITEMS.map((s) => {
                  const q = stock[`${house}:${s}`] ?? 0;
                  return (
                    <div key={s} className="flex justify-between px-4 py-2.5 text-sm">
                      <span className="text-stone-700">{s}</span>
                      <span className={`font-semibold ${q <= 1 ? "text-amber-600" : "text-stone-800"}`}>{q}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SCHEDULE TAB ---------------- */}
        {tab === "schedule" && (
          <div className="space-y-4">
            <HousePicker value={scheduleHouse} onChange={setScheduleHouse} includeAll />

            <div>
              <h2 className="text-stone-800 text-base" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                Εβδομαδιαίο Πρόγραμμα
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Ποιος · πού · ποια παιδιά · πότε · τι θα κάνει. Πάτα σε ανάθεση για αλλαγή.
              </p>
            </div>

            <div className="space-y-3">
              {DAYS.map((day) => {
                const slots = template[day]
                  .map((_, idx) => ({ idx, slot: resolveSlot(day, idx) }))
                  .filter(({ slot }) => scheduleHouse === "all" || slot.house === scheduleHouse);
                return (
                  <div key={day} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    <div className="bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-600 uppercase tracking-wide">
                      {day}
                    </div>
                    {slots.length === 0 ? (
                      <p className="text-center text-stone-300 text-xs py-4">Χωρίς αναθέσεις</p>
                    ) : (
                      <div className="divide-y divide-stone-100">
                        {slots.map(({ idx, slot }) => {
                          const activity = activityById(slot.activity);
                          return (
                            <button
                              key={idx}
                              onClick={() => openEdit(day, idx)}
                              className="w-full px-4 py-3 hover:bg-stone-50 text-left"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Stamp initials={empById(slot.emp).initials} small />
                                  <div className="min-w-0">
                                    <p className="text-sm text-stone-800 font-medium truncate">
                                      {empById(slot.emp).name}
                                    </p>
                                    <p className="text-xs text-stone-500 flex items-center gap-1">
                                      <Home className="w-3 h-3" />
                                      {houseById(slot.house).name}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <span className="flex items-center gap-1 text-xs text-stone-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    {slot.start}–{slot.end}
                                  </span>
                                  {slot.overridden && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-medium">
                                      Έκτακτο
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                <span className="text-[11px] text-stone-400">Παιδιά:</span>
                                {slot.children.map((cid) => (
                                  <span
                                    key={cid}
                                    className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200"
                                  >
                                    {childById(cid).name}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-2 pt-2 border-t border-dashed border-stone-200 flex items-start gap-2">
                                <span className="text-base leading-tight">{activity.emoji}</span>
                                <div className="min-w-0">
                                  <p className="text-sm text-stone-800 font-medium">{activity.label}</p>
                                  {slot.note && <p className="text-xs text-stone-500">{slot.note}</p>}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- BOOK TAB ---------------- */}
        {tab === "book" && (
          <div className="space-y-3">
            <h2 className="text-stone-800 text-base" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
              Το Βιβλίο — Ιστορικό
            </h2>
            <p className="text-xs text-stone-500 -mt-1">Αυτόματο, δεν διαγράφεται ούτε αλλάζει</p>
            {sortedBook.map((entry) => {
              const emp = empById(entry.empId);
              return (
                <div key={entry.id} className="bg-white rounded-2xl border border-stone-200 p-4 flex gap-3">
                  <Stamp initials={emp.initials} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <CategoryTag category={entry.category} />
                      <span className="text-[11px] text-stone-400 shrink-0">
                        {fmtDate(entry.ts)} · {fmtTime(entry.ts)}
                      </span>
                    </div>
                    <p className="text-sm text-stone-700 leading-snug">{entry.text}</p>
                    {entry.photo && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700">
                        <Camera className="w-3.5 h-3.5" /> Φωτογραφία συνημμένη
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit / override modal */}
      {editModal && draft && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end justify-center z-20 overflow-y-auto"
          onClick={() => setEditModal(null)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-stone-800 font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
                Ανάθεση — {editModal.day}
              </h3>
              <button onClick={() => setEditModal(null)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <div>
              <label className="text-xs text-stone-500 mb-1 block">Σπίτι — πού</label>
              <HousePicker value={draft.house} onChange={setDraftHouse} />
            </div>

            <div>
              <label className="text-xs text-stone-500 mb-1 block">Φροντιστής — ποιος</label>
              <select
                value={draft.emp}
                onChange={(e) => setDraft((d) => ({ ...d, emp: Number(e.target.value) }))}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-stone-200"
              >
                {EMPLOYEES.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-stone-500 mb-1 block">Παιδιά — μπορεί να έχει πολλά</label>
              <div className="flex flex-wrap gap-2">
                {childrenOf(draft.house).map((c) => {
                  const on = draft.children.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleDraftChild(c.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${
                        on ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
              {draft.children.length === 0 && (
                <p className="text-[11px] text-red-500 mt-1">Διάλεξε τουλάχιστον ένα παιδί.</p>
              )}
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-stone-500 mb-1 block">Από</label>
                <input
                  type="time"
                  value={draft.start}
                  onChange={(e) => setDraft((d) => ({ ...d, start: e.target.value }))}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-stone-200"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-stone-500 mb-1 block">Έως</label>
                <input
                  type="time"
                  value={draft.end}
                  onChange={(e) => setDraft((d) => ({ ...d, end: e.target.value }))}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-stone-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-stone-500 mb-1 block">Δραστηριότητα — τι θα κάνει</label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map((a) => {
                  const on = draft.activity === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setDraft((d) => ({ ...d, activity: a.id }))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${
                        on ? "bg-emerald-700 text-white border-emerald-700" : "bg-white text-stone-600 border-stone-200"
                      }`}
                    >
                      {a.emoji} {a.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs text-stone-500 mb-1 block">Σημείωση (προαιρετικό)</label>
              <input
                value={draft.note}
                onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
                placeholder="π.χ. αντικατάσταση λόγω ασθένειας"
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-stone-200"
              />
            </div>

            <div>
              <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
                <button
                  onClick={() => setScope("override")}
                  className={`flex-1 text-xs font-medium py-2 rounded-lg ${
                    scope === "override" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
                  }`}
                >
                  Μόνο σήμερα
                </button>
                <button
                  onClick={() => setScope("template")}
                  className={`flex-1 text-xs font-medium py-2 rounded-lg ${
                    scope === "template" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
                  }`}
                >
                  Μόνιμη αλλαγή
                </button>
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5">
                {scope === "override"
                  ? "Το μόνιμο εβδομαδιαίο πρότυπο δεν αλλάζει."
                  : `Αλλάζει το πρότυπο για κάθε ${editModal.day}.`}
              </p>
            </div>

            <button
              onClick={saveEdit}
              disabled={!draft.children.length}
              className="w-full bg-stone-900 text-white text-sm font-medium py-3 rounded-xl hover:bg-stone-800 disabled:opacity-40"
            >
              Αποθήκευση με σφραγίδα {currentUser.initials}
            </button>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-stone-200 grid grid-cols-4 z-10">
        {[
          { id: "lists", label: "Λίστες", icon: ShoppingCart },
          { id: "fridge", label: "Ψυγείο", icon: Refrigerator },
          { id: "schedule", label: "Πρόγραμμα", icon: CalendarDays },
          { id: "book", label: "Βιβλίο", icon: BookOpen },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
              tab === t.id ? "text-emerald-700" : "text-stone-400"
            }`}
          >
            <t.icon className="w-5 h-5" />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
