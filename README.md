# Wochenplan & Lager — demo (Στάδιο 1)

Mobile-first PWA, δίγλωσσο (DE/EL). Ένα αρχείο, χωρίς build, δεδομένα σε `localStorage`.
Σκοπός: πλήρης ιχνηλασιμότητα — **ποιος, πού, πότε, με ποια παιδιά, τι έκανε**, με φωτογραφική απόδειξη.

## Τρέξιμο

```bash
cd ~/paidia
python3 server.py
```

Το `server.py` φορτώνει αυτόματα το τοπικό `.env`. Αντέγραψε το `.env.example` σε `.env`,
βάλε το `GROQ_API_KEY` και άφησε τα προεπιλεγμένα μοντέλα ή άλλαξέ τα αν χρειάζεται.
Το `.env` αγνοείται από το Git και δεν πρέπει να γίνει commit.

Άνοιξε `http://localhost:5173`. Στο κινητό: ίδιο δίκτυο, `http://<IP-του-Mac>:5173`,
και «Προσθήκη στην αρχική οθόνη» για εγκατάσταση σαν app.

> Η κάμερα απαιτεί `https` ή `localhost`. Για δοκιμή σε κινητό μέσω IP χρειάζεται tunnel
> (`cloudflared`, `ngrok`) ή deploy.

Χωρίς `GROQ_API_KEY`, η επικόλληση κειμένου συνεχίζει με τον τοπικό parser και εμφανίζει
σαφή προειδοποίηση. Η φωτογραφία δεν παράγει ψεύτικο αποτέλεσμα: ζητά να ρυθμιστεί το AI.
Το `GROQ_OCR_MODEL` είναι προεπιλεγμένα `qwen/qwen3.6-27b` και το `GROQ_CHAT_MODEL`
`llama-3.3-70b-versatile`. Το κλειδί διαβάζεται μόνο από το `server.py` και δεν
αποστέλλεται ποτέ στον browser.

Το στρογγυλό κουμπί **?** ανοίγει τον βοηθό χρήσης. Στέλνει μόνο το κείμενο της ερώτησης
και γενικό context της τρέχουσας οθόνης, όχι ονόματα παιδιών, PIN ή λειτουργικές εγγραφές.

## AI εισαγωγή λίστας (§58–§59)

Το **🪄 Εισαγωγή λίστας** δέχεται επικολλημένο κείμενο ή screenshot. Το screenshot
μπαίνει με επιλογή αρχείου, drag-and-drop ή απευθείας επικόλληση με `⌘V` / `Ctrl+V`.
Η κάμερα παραμένει διαθέσιμη ως πρόσθετη επιλογή. Το AI
επιστρέφει δομημένα προϊόντα με ποσότητα, μονάδα, brand, package size, κατηγορία,
σημειώσεις και confidence. Πριν αποθηκευτούν, εμφανίζονται current stock, fuzzy duplicate
warnings και επεξεργάσιμα πεδία. Καμία λίστα δεν αποθηκεύεται χωρίς ανθρώπινο έλεγχο και PIN.

Κάθε επιβεβαιωμένη εισαγωγή αρχειοθετεί στο `aiImports` το αρχικό input, extracted text,
AI draft, διορθωμένο τελικό αποτέλεσμα, uploader, timestamp, model και response ID.

Στο άνοιγμα της εισαγωγής εμφανίζεται live health status. Το κείμενο χρησιμοποιεί το
γρήγορο chat model και έχει τοπικό fallback· εικόνες/χειρόγραφα χρησιμοποιούν το vision
OCR model. Τα σύντομα rate limits επαναδοκιμάζονται αυτόματα και σε αποτυχία παραμένει
διαθέσιμο κουμπί retry χωρίς να χάνεται η εικόνα.

> Μην ανοίγεις το `index.html` με `file://`: τα AI endpoints υπάρχουν μόνο όταν τρέχει
> το `python3 server.py` και η εφαρμογή ανοίγει από `http://localhost:5173`.

## Events & ανακοινώσεις

Η τέταρτη προβολή **Events** στο Πρόγραμμα επιτρέπει στο προσωπικό δημιουργία,
επεξεργασία, draft/δημοσίευση και διαγραφή event. Από κάθε κελί προγράμματος μπορείς
να πατήσεις το εμφανές μωβ κουμπί **📣 Event** στην κορυφή της εγγραφής· το event συνδέεται με την εγγραφή και
εμφανίζεται με ειδικό σήμα στο ημερήσιο/εβδομαδιαίο πρόγραμμα και στο Events tab των
επιλεγμένων παιδιών. Στο παιδικό portal εμφανίζεται άμεσα badge και notification banner
με τον αριθμό των επερχόμενων δημοσιευμένων events.

## WhatsApp Cloud API

Το `server.py` έχει server-side WhatsApp Cloud API integration για event templates,
test message και signed webhook. Τα access tokens και τα τηλέφωνα δεν περνούν ποτέ
στον browser ή στο Git.

1. Στο Meta App Dashboard σύνδεσε WhatsApp Business Account και κράτησε Phone Number ID
   και Business Account ID.
2. Δημιούργησε system-user permanent token με `business_management`,
   `whatsapp_business_messaging` και `whatsapp_business_management`.
3. Συμπλήρωσε στο μη tracked `.env`: `WHATSAPP_ACCESS_TOKEN`,
   `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, ένα δικό σου τυχαίο
   `WHATSAPP_VERIFY_TOKEN`, και το Meta App Secret ως `WHATSAPP_APP_SECRET`.
4. Δημιούργησε και έγκρινε template `paidia_event_notification` με τέσσερις body
   παραμέτρους: event title, date, time, location. Ρύθμισε τη σωστή γλώσσα στο
   `WHATSAPP_TEMPLATE_LANGUAGE`.
5. Το `WHATSAPP_RECIPIENTS_JSON` αντιστοιχίζει child ID σε εγκεκριμένο τηλέφωνο
   κηδεμόνα/test σε E.164 μορφή, π.χ. `{"k1":"491234567890"}`. Δέχεται και λίστα
   αριθμών ανά παιδί. Μην βάζεις αριθμούς ανηλίκων χωρίς τεκμηριωμένη συναίνεση.
6. Άφησε `WHATSAPP_SEND_ENABLED=false` μέχρι να ολοκληρωθεί το test και μετά άλλαξέ το
   σε `true` και επανεκκίνησε τον server.

Webhook URL: `https://<public-host>/api/whatsapp/webhook`. Στο Meta Configuration βάλε
το ίδιο verify token και subscribe στο `messages`. Το App Secret ενεργοποιεί έλεγχο
`X-Hub-Signature-256`. Το endpoint αναγνωρίζει delivery/read callbacks χωρίς να
αποθηκεύει locally το περιεχόμενο μηνυμάτων.

Έλεγχος ρύθμισης: `GET /api/whatsapp/health`. Για το πρώτο Meta `hello_world` test,
συμπλήρωσε `WHATSAPP_TEST_RECIPIENT`, ενεργοποίησε προσωρινά την αποστολή και κάλεσε:

```bash
curl -X POST http://localhost:5173/api/whatsapp/test \
  -H 'Content-Type: application/json' -d '{}'
```

Τα schedule-linked και standalone published events καλούν αυτόματα το event endpoint.
Υπάρχει deduplication 10 λεπτών ανά event/παραλήπτη. Για public Synology deployment
χρειάζονται HTTPS reverse proxy και κανονικό backend authentication πριν εκτεθεί η
λειτουργία αποστολής στο Internet.

## Home dashboard

Η **Αρχική / Home** είναι η προεπιλεγμένη οθόνη προσωπικού και συγκεντρώνει live:

- τις σημερινές εργασίες του συνδεδεμένου χρήστη,
- ξεχασμένες/εκπρόθεσμες εργασίες των τελευταίων 7 ημερών,
- ολοκλήρωση και επαναφορά εργασίας ανά χρήστη,
- όλα τα events με κατάσταση δημοσίευσης, παιδιά και συνοδούς,
- εγγραφές των επόμενων 3 ημερών που δεν έχουν ακόμη υπεύθυνο.

Οι PIN δεν υπάρχουν πλέον στον client ή στο README· μόνο salted PBKDF2 hashes υπάρχουν
στο μη tracked `.env`.

## Γλώσσα

Διακόπτης **DE/EL** στο header και στο login panel· η επιλογή θυμάται.
Το λεξιλόγιο δραστηριοτήτων βγήκε από το ίδιο το έντυπο (Kochkurs, Beach Event,
Schnitzeljagd, Traumfänger, Seilspringen, Domino XXL κ.λπ.).

## Δικαιώματα

| | Ημερήσια αλλαγή (override) | Μόνιμη αλλαγή προτύπου |
|---|---|---|
| **Zoi** (Leitung), **Angelos**, **Dimitris** | ✅ | ✅ |
| Dora, Karin, Claudio, Löhri, Amalia | ✅ | ❌ |

Ο έλεγχος γίνεται από το authenticated server session. Αν μη-admin επιχειρήσει μόνιμη
αλλαγή, απορρίπτεται και το πρότυπο μένει ανέπαφο.

## Δομή προγράμματος — αντιγράφει το έντυπο

Τρία σταθερά μπλοκ, όπως το `WOCHENPLAN`:

| Μπλοκ | Ώρες | Οργάνωση |
|---|---|---|
| `Vormittagsprogramm` | 10:00–14:00 | πλέγμα **ημέρα × σπίτι** |
| `Nachmittagsbetreuung` | 15:00–19:00 | πλέγμα **άτομο × ημέρα** |
| `Abendprogramm` | 19:00–22:00 | πλέγμα **ημέρα × σπίτι** |

Δύο προβολές:
- **Tag** — μία μέρα, τα τρία μπλοκ από κάτω· για το καθημερινό video call.
- **Woche** — τα τρία πλέγματα με οριζόντια κύλιση, ίδια όψη με το χαρτί· για τη
  σύσκεψη Δευτέρας 13:30.

**Κάθε κελί είναι clickable.** Ανοίγει η φόρμα με προσυμπληρωμένο σπίτι/άτομο/ημέρα.
Διαλέγεις δραστηριότητα από preset chips ή πατάς **＋ Neue Aktivität** και προσθέτεις
δική σου — μένει μόνιμα στη λίστα για όλους.

Παιδιά: Simon, Kai, Vincent Klein, Julian Groß, Julian, Lea, Valeria.
**Ομάδες** (Jungs / Mädchen / Alle Kinder) επιλέγουν πολλά παιδιά με ένα πάτημα.

Τα τέσσερα πλαίσια κειμένου του εντύπου αποθηκεύονται ανά εβδομάδα:
`Hinweise für Nachmittag`, `Geplante Wochenprojekte`, `Benötigte Materialien / Einkäufe`,
`Besondere Hinweise`. Το πλαίσιο υλικών έχει κουμπί **→ In die Einkaufsliste** που
σπάει τις γραμμές σε είδη και τα περνά στη λίστα αγορών.

## Λίστες Παρασκευής

Κάθε λίστα συνδέεται με συγκεκριμένο σπίτι και πραγματική ημερομηνία Παρασκευής
(`fridayDate`). Ο επιλογέας Παρασκευής επιτρέπει μετάβαση σε προηγούμενες/επόμενες
ημερομηνίες και δείχνει πλήρη κατάσταση: προγραμματισμένη, σε εξέλιξη ή ολοκληρωμένη,
μαζί με ανοιχτά και αγορασμένα είδη. Η εισαγωγή παραμένει πάντα διαθέσιμη, ακόμη και
όταν υπάρχει ήδη λίστα. Κείμενο και screenshot εμφανίζονται στην ίδια ροή και πριν την
αποθήκευση επιλέγεται έξυπνη συγχώνευση, προσθήκη νέων γραμμών ή αντικατάσταση των
ανοιχτών ειδών της επιλεγμένης Παρασκευής.

## Προβολή αποθέματος

Η αρχική προβολή του ψυγείου δείχνει μόνο τα μηδενικά είδη, ώστε η καθημερινή χρήση
να μην είναι ένας κατάλογος δεκάδων γραμμών. Υπάρχουν φίλτρα για όσα χρειάζονται
προσοχή και για όλα τα προϊόντα, ζωντανή αναζήτηση σε ελληνικά/γερμανικά και
πτυσσόμενες κατηγορίες. Η προβολή «και τα δύο σπίτια» χρησιμοποιεί τα ίδια συμπαγή
cards και εμφανίζει τις ποσότητες Kalyvia/Limenaria δίπλα-δίπλα.

## Δομή δεδομένων

| Πίνακας | Πεδία |
|---|---|
| `houses` | `id, name, short` — Kalyvia (Villa), Limenaria |
| `employees` | `id, name, role{de,el}, color, admin` — χωρίς PIN/email στον browser |
| `children` | `id, name` |
| `groups` | `id, de, el, childIds[]` |
| `activities` / `customActivities` | `id, emoji, de, el` |
| `template` | `id, block, day(0=Δευ…6=Κυρ), houseIds[], employeeIds[], childIds[], activityId, time, note` — τα παλιά `houseId/employeeId` παραμένουν για συμβατότητα |
| `overrides` | `id, date, templateId, …ίδια πεδία, cancelled` |
| `taskCompletions` | `id, date, entryId, employeeId, completedAt, completedBy` — ανεξάρτητο tick ανά ανατεθειμένο άτομο |
| `weeks` | κλειδί = Δευτέρα ISO → τα 4 πλαίσια + `createdBy, createdAt` |
| `stock` | κλειδί `"houseId:productId"` → ποσότητα |
| `shoppingList` | `id, name, qty, unit, houseId, by, done` |
| `log` | `id, ts, type, employeeId, text, ip, deviceId, sessionId, ua, photo?, houseId?` — **append-only** |

`employeeId: null` σημαίνει **«wer?»** — ανοιχτή θέση, όπως στο χαρτί.

Στο `localStorage` αποθηκεύονται μόνο τα μεταβαλλόμενα δεδομένα (`template, overrides,
weeks, events, taskCompletions, aiImports, listEntries, stock, log, customActivities, customReasons`).
Το authenticated session είναι 12ωρο HttpOnly/SameSite cookie του server, όχι localStorage.
Τα δεδομένα αναφοράς έρχονται πάντα από το `SEED`, ώστε μια
ενημέρωση της εφαρμογής να μη μπλοκάρεται από παλιό αποθηκευμένο αντίγραφο.

## Δύο ξεχωριστές είσοδοι (§31.3)

Πρώτη οθόνη: **Personal** ή **Kinder**. Μετά grid προφίλ και PIN 4–6 ψηφίων.
Το PIN στέλνεται μόνο στο same-origin `/api/auth/login` και ελέγχεται server-side με
salted PBKDF2-SHA256 hash. Μετά την επιτυχημένη είσοδο δημιουργείται 12ωρο HttpOnly cookie.

Κάθε profile έχει κουμπί **PIN vergessen oder ändern?**. Ο χρήστης γράφει το email του και
λαμβάνει one-time link 30 λεπτών. Το link δεν αποκαλύπτεται στο API, δεν γίνεται email
enumeration, χρησιμοποιείται μία φορά, αλλάζει το hash μέσα στο `.env` και ακυρώνει όλα
τα ενεργά sessions του profile. Από **Profil → Profildaten** κάθε χρήστης αποθηκεύει τη
δική του recovery email, ενώ οι admins μπορούν να επιλέξουν και να ενημερώσουν οποιοδήποτε
profile. Το **Test-E-Mail senden** επιβεβαιώνει πραγματική παράδοση. Το κουμπί
**Anderes Profil öffnen** επιστρέφει πάντα στην επιλογή profile.

Η προτιμώμενη παράδοση είναι Resend μέσω `RESEND_API_KEY` και `RESEND_FROM`, μαζί με
σωστό `PAIDIA_PUBLIC_URL`. Τα API keys μένουν μόνο στο ignored `.env`. Αν το Resend δεν
είναι ρυθμισμένο, ο server χρησιμοποιεί προαιρετικά SMTP (`SMTP_HOST/PORT/USER/PASSWORD/FROM`),
π.χ. Synology MailPlus. Σε HTTPS production βάλε `PAIDIA_COOKIE_SECURE=true`.

Ο admin δεν χρειάζεται να επεξεργάζεται το μεγάλο JSON χειροκίνητα:

```bash
python3 auth_admin.py status
python3 auth_admin.py set-email e4 angelos@example.com
python3 auth_admin.py set-pin e4
```

Το `set-pin` ζητά κρυφά το PIN δύο φορές και γράφει μόνο salted hash. Μετά από admin
αλλαγή email/PIN χρειάζεται restart του `server.py`.

### Passkeys: Face ID, Touch ID, fingerprint, Windows Hello

Μετά από πρώτη είσοδο με PIN, άνοιξε **Profil → Anmeldung & Sicherheit** και πάτησε
**Face ID / Touch ID einrichten**. Το λειτουργικό σύστημα επιλέγει τον διαθέσιμο τρόπο:
Face ID/Touch ID σε Apple, fingerprint ή screen lock σε Android και Windows Hello σε
Windows. Η εφαρμογή δεν λαμβάνει ούτε αποθηκεύει βιομετρικά δεδομένα· αποθηκεύει μόνο
το δημόσιο WebAuthn credential στο ignored αρχείο `.paidia-passkeys.json`. Το PIN και
το email reset παραμένουν ως recovery fallback. Από την ίδια οθόνη μπορούν να ανακληθούν
όλα τα passkeys του profile.

Εγκατάσταση και τοπική εκκίνηση:

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python server.py
```

Το `http://localhost:5173` επιτρέπεται για development. Σε Synology/LAN τα passkeys
απαιτούν **σταθερό HTTPS hostname** — όχι απλό `http://192.168…`. Παράδειγμα πίσω από
Synology reverse proxy:

```env
PAIDIA_PUBLIC_URL=https://paidia.example.com
PAIDIA_WEBAUTHN_ORIGIN=https://paidia.example.com
PAIDIA_WEBAUTHN_RP_ID=paidia.example.com
PAIDIA_COOKIE_SECURE=true
```

Αν αλλάξει hostname/RP ID, τα παλιά passkeys δεν ισχύουν και πρέπει να εγγραφούν ξανά.

## Υποχρεωτική ξενάγηση πρώτης σύνδεσης

Κάθε profile ολοκληρώνει μία role-specific ξενάγηση στην πρώτη επιτυχημένη σύνδεση.
Το sheet δεν έχει ×, δεν κλείνει με backdrop ή Escape και η εφαρμογή παραμένει πίσω από
κλειδωμένο overlay μέχρι να προβληθούν όλα τα βήματα. Staff, admins και παιδιά βλέπουν
διαφορετικό περιεχόμενο σύμφωνα με τις δυνατότητές τους.

Η ολοκλήρωση δεν βασίζεται σε `localStorage`: αποθηκεύεται server-side ανά profile στο
ignored αρχείο `.paidia-onboarding.json` (`PAIDIA_ONBOARDING_STATE_PATH`). Ο server
δέχεται ολοκλήρωση μόνο από authenticated session και για την τρέχουσα tutorial version.
Αύξηση του `ONBOARDING_VERSION` εμφανίζει ξανά τη νέα υποχρεωτική ξενάγηση σε όλους.

### Προστασία προσωπικών profiles

Η είσοδος περιορίζει αποτυχημένες προσπάθειες ανά IP+profile (5), συνολικά ανά IP (20)
και ανά profile (12) σε παράθυρο 10 λεπτών. Το lockout κρατά 15 λεπτά. Στην τρίτη
αποτυχημένη προσπάθεια και στο lockout στέλνεται rate-limited email **μόνο στους admins**
που ορίζονται στο `PAIDIA_ADMIN_PROFILE_IDS` (ή στο admin fallback
`PAIDIA_SECURITY_ALERT_EMAIL`). Επιτυχής είσοδος staff
από νέο IP επίσης ειδοποιεί, αφού πρώτα δημιουργηθεί το αρχικό γνωστό IP. Αν έχουν οριστεί
`PAIDIA_TRUSTED_NETWORKS`, είσοδος έξω από αυτά ειδοποιεί ακόμα και την πρώτη φορά.

Τα γνωστά IP αποθηκεύονται μόνο ως keyed fingerprints στο ignored αρχείο
`.paidia-security-state.json`. Τα συμβάντα ασφαλείας γράφονται με permissions `0600` στο
`.paidia-security-events.jsonl`. Σε Synology reverse proxy βάλε `PAIDIA_TRUST_PROXY=true`
ώστε να χρησιμοποιείται το validated `X-Forwarded-For` και όρισε το τοπικό CIDR, π.χ.
`PAIDIA_TRUSTED_NETWORKS=192.168.1.0/24`. Forwarded headers γίνονται δεκτά μόνο από
loopback proxy ή CIDR που δηλώνεται στο `PAIDIA_TRUSTED_PROXY_NETWORKS`. Τα email alerts
χρησιμοποιούν το ίδιο Resend transport (ή SMTP fallback) με το PIN reset. Οι τιμές και
τα όρια τεκμηριώνονται στο `.env.example`.

Στο UI οι λειτουργικές προειδοποιήσεις και το Κέντρο Διαχείρισης εμφανίζονται μόνο στους
Zoi, Angelos και Dimitris. Το κέντρο δείχνει ανά εργαζόμενο σημερινές/επόμενες αναθέσεις,
τρέχουσα βάρδια, ολοκληρώσεις και πρόσφατη δραστηριότητα. Από εκεί οι admins ανοίγουν και
αλλάζουν εβδομαδιαίο πλάνο, βάρδιες ανά ημέρα, events και append-only καταγραφές.

**Child Portal (§31.4):** το παιδί βλέπει μόνο τον δικό του χρόνο — «Was mache ich heute»,
η εβδομάδα του, τα events της εβδομάδας. Δεν βλέπει αποθήκη, λίστες, βιβλίο, βάρδιες
ούτε τις **σημειώσεις βάρδιας** (εκεί γράφονται πράγματα όπως «Sammy krank»,
«Nageltermin»). Βλέπει τον φροντιστή του και τα παιδιά της ομάδας του, γιατί είναι
λειτουργικά αναγκαίο — αν το θέλεις κρυφό, αλλάζει με μία γραμμή.

Τα αρχικά hashes όλων των profiles έχουν μεταφερθεί στο τοπικό `.env`. Τα πραγματικά
emails παραμένουν κενά μέχρι να συμπληρωθούν από τον διαχειριστή.

## Βάρδιες (§6)

Τρίτη προβολή στο Plan: **Dienst**. Μεταγραφή του `Dienstplan ab 13.07.2026`.
Οι **24ωρες** εμφανίζονται ως ενιαίο μπλοκ («11:00 → DI 11:00»), δεν σπάνε σε δύο μέρες.
Δεξιά στήλη: σύνολο ωρών εβδομάδας ανά άτομο (π.χ. Dora 74 h).
Κάτω από τον πίνακα, ο **κανόνας των 10 λεπτών** όπως τον γράφει το έντυπο.

## Ψυγείο, αποθήκη και supermarket

Η αποθήκη ανοίγει πλέον σε **attention-first** προβολή: κενά και χαμηλά αποθέματα ανά
κατηγορία, health percentage, αναζήτηση και ξεχωριστό scope ανά σπίτι. Κάθε προϊόν
ανοίγει σε detail sheet με ποσότητα ανά σπίτι, τελευταία αγορά, είσοδο/έξοδο και άμεση
προσθήκη στη σωστή λίστα Παρασκευής.

Η λίστα supermarket έχει τρία εμφανή στάδια (σχεδιασμός → αγορά → ολοκλήρωση), compact
κατηγορίες και αναζήτηση. Στον Einkaufsmodus τα **αγοράστηκε** και **δεν ήταν διαθέσιμο**
είναι ξεχωριστές ενέργειες με undo. Η ολοκλήρωση παραμένει κλειδωμένη ώσπου να υπάρχει
ρητή απόφαση για κάθε προϊόν· καμία ανέγγιχτη γραμμή δεν μετατρέπεται αυτόματα σε έλλειψη.

## Validation engine (§9, §35)

Τρέχει σε κάθε ημέρα και εμφανίζεται ως κάρτα στο Plan:

| Κανόνας | Σοβαρότητα |
|---|---|
| Ίδιος φροντιστής ταυτόχρονα σε δύο σπίτια | ⛔ error |
| Ίδιο παιδί σε δύο ομάδες την ίδια ώρα | ⛔ error |
| Ανάθεση ενώ ο υπάλληλος έχει **ρεπό** βάσει βαρδιών | ⚠️ warning |
| Ανάθεση **εκτός ωραρίου** βάρδιας (λαμβάνει υπόψη 24ωρες από την προηγουμένη) | ⚠️ warning |
| Σπίτι με παιδιά αλλά χωρίς φροντιστή | ⚠️ warning |
| Πάνω από 4 παιδιά σε έναν φροντιστή | ⚠️ warning |
| Διπλοεγγραφή (ίδιος + ίδια δραστηριότητα + ίδια παιδιά) | ⚠️ warning |

Οι προειδοποιήσεις **δεν μπλοκάρουν** — η προδιαγραφή το ζητά ρητά, γιατί οι πραγματικές
ανάγκες διαφέρουν.

## Ιχνηλασιμότητα

Κάθε εγγραφή κουβαλάει υπάλληλο, ώρα, **IP**, **deviceId** και user-agent.
Στο Βιβλίο υπάρχει κάρτα **«Wer hat was gemacht»** — σύνοψη ανά άτομο (πόσες κινήσεις,
τι είδους, πότε η τελευταία), Σήμερα / Τελευταίες 7 ημέρες, **ορατή σε όλους**.
Πατώντας άτομο φιλτράρεις το ιστορικό του.

> **Προσοχή:** η IP ζητιέται από τον client (`api.ipify.org`) και είναι *ενδεικτική* —
> πλαστογραφείται. Στην παραγωγή σφραγίζεται **server-side** (Supabase edge function /
> `x-forwarded-for`). Το ίδιο και η ώρα: server timestamp, όχι ρολόι κινητού.

## Εκκρεμεί

- **Το ημερήσιο χαρτί** του video call δεν το έχω δει ακόμα — πιθανώς θέλει δικό του
  flow «Tagesplan» με κλείδωμα ημέρας μετά τη σύσκεψη.
- Στο έντυπο εμφανίζονται **Lilly, Sammy, Jule** που δεν είναι στη λίστα παιδιών —
  προς το παρόν έμειναν ως σημείωση κειμένου στις σχετικές εγγραφές.
- Τα μέλη των ομάδων `Jungs` / `Mädchen` τα υπέθεσα από τα ονόματα — θέλουν επιβεβαίωση.
- Δεν ξέρω ποια παιδιά μένουν σε ποιο σπίτι· τα παιδιά δεν είναι δεμένα με σπίτι.

## Αρχεία

- `index.html` — η ζωντανή εφαρμογή. Εδώ δοκιμάζουμε.
- `apothiki-demo.jsx` — το αρχικό React demo, στο παλιότερο μοντέλο (πριν το έντυπο).
  Χρήσιμο για παρουσίαση· δεν έχει τα τρία μπλοκ, τις ομάδες, τα δικαιώματα ή το IP capture.

## Επόμενα στάδια

1. ✅ Πρόγραμμα κατά το έντυπο + IN/OUT με PIN + δικαιώματα
2. Supabase: auth/PIN, πίνακες, storage φωτογραφιών, RLS ανά σπίτι, server-side IP & timestamp
3. Μεταφορά AI archives και φωτογραφιών από localStorage σε durable media/database storage
4. Απογραφή + discrepancy report (θεωρητικό vs πραγματικό απόθεμα)
