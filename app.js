
/* ════════════════════════════════════════════════════════════════
   Δίγλωσσο λεξικό — DE (όπως το χαρτί) / EL
   ════════════════════════════════════════════════════════════════ */
/** Keep in sync with build.json — shown on login. */
const APP_BUILD = {
  version: 107,
  label: 'v107',
  changed: {
    de: 'Buttons: Kontrast + 44px Hits; Desktop-Sidebar 220px',
    el: 'Κουμπιά: αντίθεση + 44px hits· desktop sidebar 220px',
  },
};
const T = {
  de: {
    appTitle:'Armonia Thassos', navHome:'Home', navSchedule:'Plan', navStock:'Lager', navShop:'Liste', navBook:'Buch', navGallery:'Momente', navTalk:'Talk', navKids:'Kinder',
    titleHome:'Home', titleSchedule:'Wochenplan', titleStock:'Lager', titleShop:'Listen & Einkauf', titleBook:'Buch', titleGallery:'Momente', titleTalk:'Team-Gespräch', titleKids:'Kinder & Schule', kidsHeroHint:'Profile, Fächer, Anwesenheit und Hausaufgaben', kidsEmpty:'Keine Kinder hinterlegt', schoolSubjects:'Fächer', schoolAttendance:'Anwesenheit', schoolHomework:'Hausaufgaben', schoolTimetable:'Stundenplan', thisWeek:'Diese Woche', gradeSaved:'Note gespeichert', attSaved:'Anwesenheit gespeichert', hwSaved:'Hausaufgabe gespeichert', ttSaved:'Stunde gespeichert', subSaved:'Fach gespeichert', subAdd:'Fach hinzufügen', subArchive:'Archivieren', subActivate:'Aktivieren', subEmpty:'Noch keine Fächer', att_present:'Da', att_absent:'Fehlt', att_excused:'Entschuldigt', hwEmpty:'Keine Hausaufgaben', hwAdd:'Hausaufgabe', hwTitlePh:'z.B. Mathe S.12', hwAllKids:'Alle Kinder', ttEmpty:'Keine Stunden', ttAdd:'Stunde hinzufügen', homeShiftRing:'Schicht', homeWeekSpark:'7 Tage erledigt', planDayLoad:'Tageslast', zoSavedLager:'Im Lager gespeichert', zoSavedListe:'In der Liste gespeichert', zoSavedPlan:'Im Plan gespeichert', zoSavedSchool:'Schule gespeichert', zoSavedNote:'Notiz gespeichert',
    logout:'Profil', noUser:'Nicht angemeldet',
    navChat:'Zo-Ai', topChat:'Zo-Ai', topHelp:'Zo-Ai', topTalk:'Team sprechen', topTutorial:'Tutorial',
    topAdd:'＋ Eintrag', topIn:'＋ Ein', topOut:'− Aus', topBoard:'Bewegung', topFood:'＋ Ware',
    topShop:'Liste', topScan:'Scan', topHistory:'Verlauf', topShift:'Schicht', topFix:'Korrektur',
    topDay:'Tag', topWeek:'Woche', topEvents:'Events', topBoth:'Beide Häuser',
    headerHome:'Armonia · Home',     headerScheduleDay:'Plan · Tag', headerScheduleWeek:'Plan · Woche',
    headerScheduleCalendar:'Plan · Kalender',
    headerScheduleEvents:'Plan · Events', headerStock:'Lager', headerStockAll:'Lager · beide Häuser',
    headerShop:'Einkauf', headerBook:'Buch & Schicht', headerGallery:'Große Momente', headerTalk:'Team-Gespräch', headerKids:'Kinder & Schule',
    galleryTitle:'Große Momente', galleryHint:'Fotos von schönen Momenten — für Kinder und Team',
    galleryEmpty:'Noch keine Momente. Sei der Erste!', galleryShare:'Moment teilen',
    galleryDriveOn:'Fotos speichern in Google Drive', galleryDriveOff:'Fotos speichern auf dem Server',
    galleryNewPost:'Neu', galleryTapLike:'Doppeltippen zum Liken',
    galleryCaption:'Was ist passiert?', galleryCaptionPh:'z.B. Strandtag, Geburtstag, Fußball-Sieg…',
    galleryPick:'Foto wählen', galleryCamera:'Kamera', galleryPost:'Teilen',
    galleryPosted:'Moment geteilt!', galleryDelete:'Löschen', galleryLike:'Like',
    galleryLoading:'Momente laden…', galleryFail:'Galerie nicht erreichbar',
    galleryNeedPhoto:'Bitte ein Foto hinzufügen', galleryTooBig:'Foto zu groß — nochmal versuchen',
    galleryJustNow:'gerade eben', galleryMinutes:n=>`vor ${n} Min.`, galleryHours:n=>`vor ${n} Std.`, galleryDays:n=>`vor ${n} T.`,
    galleryByKid:'Kind', galleryByStaff:'Team', galleryChildTab:'Momente',
    galleryComment:'Kommentar', galleryCommentPh:'Schreib etwas Nettes…', galleryCommentSend:'Senden',
    galleryComments:n=>n===1?'1 Kommentar':`${n} Kommentare`,
    galleryCaptionAi:'KI-Bildtext', galleryCaptionAiLoading:'KI schreibt…', galleryCaptionAiFail:'KI-Bildtext fehlgeschlagen',
    galleryReactStar:'Stern', galleryReactClap:'Klatschen',
    gallerySafeHint:'Sichere Momente — KI prüft Texte auf Unfreundliches',
    galleryBlocked:'Das geht hier nicht — bitte freundlich bleiben',
    galleryFlagged:'Zur Prüfung markiert', galleryReport:'Melden', galleryReportOk:'Gemeldet — Team prüft',
    gallerySafetyFail:'Sicherheitscheck fehlgeschlagen — später erneut',
    shiftDiary:'Schichtbuch', shiftDiaryHint:'Dieses Buch muss geführt werden. Jede Schicht schreibt ihre Seite — nur mit deinem Profil.',
    shiftDiaryPh:'Was geschah in der Schicht? Übergabe, Lager, Kinder, Besonderes…',
    shiftDiarySave:'Ins Buch schreiben', shiftDiarySaved:'Seite im Buch gespeichert',
    shiftDiaryEmpty:'Noch keine Seiten in diesem Zeitraum.', shiftDiaryTeam:'Frühere Seiten',
    shiftDiaryMine:'Heutige Seite', typeSHIFT:'Schicht',
    journalMustWrite:'Heutige Seite offen — muss geschrieben werden',
    journalPageDone:'Heutige Seite ist geschrieben',
    journalContinue:'Weiter schreiben (wird angehängt)',
    journalRewrite:'Seite neu fassen',
    journalRewriteSave:'Seite ersetzen',
    journalPages:n=>n===1?'1 Seite':`${n} Seiten`,
    journalDutyHome:'Schichtbuch: heutige Seite noch leer',
    journalDutyCta:'Jetzt schreiben',
    journalInkHint:'Neue Zeilen werden unten an die heutige Seite gehängt — wie Tinte im Buch.',
    journalEmptyPage:'Leere Seite. Schreib, was in der Schicht passiert ist.',
    journalSigned:'gezeichnet',
    journalBrowse:'Seiten lesen',
    typeSTOCKCHECK:'Lagercheck',
    shiftStockCheck:'Schicht-Lagercheck',
    shiftStockCheckHint:'Wer die Schicht beginnt, prüft das Lager in Kalyvia. Tippe ✓ oder „Alles ja“.',
    shiftStockCheckStart:'Lagercheck starten',
    shiftStockCheckDone:'Lagercheck erledigt',
    shiftStockCheckAllYes:'Alles ja',
    shiftStockCheckSave:'Check speichern',
    shiftStockCheckNeedAll:'Bitte alle Positionen mit ✓ oder „Alles ja“ bestätigen.',
    shiftStockCheckSaved:(n,name)=>`Lagercheck · ${n} Positionen · ${name}`,
    shiftStockCheckToday:(name,when)=>`Heute geprüft von ${name} · ${when}`,
    shiftStockCheckPending:'Noch kein Lagercheck heute',
    shiftStockCheckQty:'Ist-Menge',
    shiftStockCheckOk:'OK',
    shiftStockCheckFixed:'Korrigiert',
    shiftStockCheckProgress:(a,b)=>`${a}/${b} geprüft`,
    viewDay:'Tag', viewWeek:'Woche', filterView:'Ansicht', filterHouse:'Haus',
    tableFullscreen:'Vollbild', tableExitFullscreen:'Schließen',
    allHouses:'Kombiniert',
    morning:'Vormittagsprogramm', afternoon:'Nachmittagsbetreuung', evening:'Abendprogramm',
    add:'+ Eintrag', edit:'Eintrag', newEntry:'Neuer Eintrag',
    house:'Haus — wo', person:'Person — wer', children:'Kinder — mit wem',
    activity:'Aktivität — was', note:'Notiz', time:'Uhrzeit (optional)',
    timePh:'z.B. ab 16:00', notePh:'z.B. Kochkurs Julian',
    unassigned:'wer?', open:'offen', noPerson:'— noch niemand —',
    scopeToday:'Nur heute', scopeTemplate:'Dauerhaft',
    scopeTodayHint:'Der feste Wochenplan bleibt unverändert.',
    scopeTemplateHint:day=>`Ändert die Vorlage für jeden ${day}.`,
    saveWithPin:'Speichern', cancelToday:'Eintrag für heute streichen',
    removeFromTable:'Aus dem Plan entfernen', removedFromPlan:'Aus dem Plan entfernt',
    cancelled:'gestrichen', override:'Änderung',
    adminActions:'Aktionen', adminShiftToday:'Dienst heute', adminOpenDay:'Tagesplan',
    adminOpenWeek:'Wochenplan', adminOpenStock:'Lager', adminOpenShop:'Einkauf',
    adminContact:'Kontakt / E-Mail', adminAssignToday:'Heute zuweisen',
    adminShiftsWeek:'Dienste der Woche', adminMarkDone:'Erledigt', adminRemoveAssign:'Aufgabe streichen',
    noEntries:'Keine Einträge',
    weekNotes:'Hinweise der Woche', besprechung:'Besprechung: Mo 13:30',
    hintAfternoon:'Hinweise / Besonderheiten für Nachmittag',
    projects:'Geplante Wochenprojekte / Aktivitäten',
    materials:'Benötigte Materialien / Einkäufe',
    remarks:'Besondere Hinweise / Änderungen',
    toShoppingList:'→ In die Einkaufsliste',
    createdBy:'Erstellt von', saveNotes:'Hinweise speichern',
    stockIn:'➕ Eingang', stockOut:'➖ Ausgang',
    stockTitle:'Bestand', lastMoves:'Letzte Bewegungen',
    inventoryDashboard:'Lagerübersicht', inventoryHint:'Zuerst sehen, was fehlt – den vollständigen Bestand nur bei Bedarf öffnen.',
    inventoryHealth:'Bestandssicherheit', inventoryHealthyPct:n=>`${n}% der Produkte sind ausreichend vorhanden`,
    tapProduct:'Produkt bearbeiten', productDetail:'Produkt bearbeiten', addToShopping:'Zur Einkaufsliste hinzufügen',
    wantBought:'Das soll gekauft werden', wantBoughtDone:'Bereits angefragt',
    wantBoughtToast:'Für Freitagseinkauf vorgemerkt',
    startListTitle:'Neue Einkaufsliste starten',
    startListHint:'Wähle Freitag und Haus oben. Tippe das erste Produkt ein — oder importiere Text/Screenshot.',
    startListAdd:'Erstes Produkt hinzufügen',
    startListFromStock:'Personal: im Lager „Das soll gekauft werden“ tippen.',
    pickOneHouse:'Bitte zuerst ein Haus wählen.',
    productEditHint:'Name, Einheit, Kategorie und Bestand ändern',
    productNameDe:'Name (DE)', productNameEl:'Name (EL)',
    productAliases:'Aliases (Komma)', productAliasesHint:'z. B. milch, γάλα',
    productStockQty:'Bestand je Haus',
    productSave:'Änderungen speichern', productSaved:'Produkt gespeichert',
    productDelete:'Produkt löschen', productDeleted:'Produkt gelöscht',
    productDeleteConfirm:'Dieses Produkt wirklich löschen?',
    productNameRequired:'Bitte einen Namen eingeben',
    productQuickActions:'Schnellaktionen',
    addedToShopping:'Zur Einkaufsliste hinzugefügt', alreadyPlanned:'Bereits auf der Einkaufsliste',
    stockSearch:'Produkt suchen…', stockAttention:'Achtung', stockAll:'Alle', stockEmpty:'Leer',
    stockTilesOn:'Kacheln', stockTilesOff:'Liste',
    stockHealthy:'Gut versorgt', stockLow:'Wenig', stockOutState:'Leer', productTypes:'Produkte',
    noStockResults:'Keine passenden Produkte gefunden.', openShopping:'Zur Einkaufsliste', missingFromShop:n=>`${n} Fehlmenge${n===1?'':'n'} aus dem Einkauf`,
    inTitle:'Eingang Lager', outTitle:'Ausgang Lager',
    product:'Produkt', qty:'Menge',
    photoLabel:'Foto — optional, nur Live-Aufnahme',
    takePhoto:'📷 Foto aufnehmen', photoTaken:'Foto wurde jetzt in der App aufgenommen.',
    noCam:'Kamera nicht verfügbar', needPhoto:'Foto optional — Buchung geht auch ohne',
    photoOptional:'Foto optional',
    skipPhoto:'Ohne Foto buchen',
    stockHoldHint:'Gedrückt halten für Optionen · Ziehen zu Ein/Aus unten',
    stockHoldIn:'＋ Eingang',
    stockHoldOut:'− Ausgang',
    stockHoldShop:'Das soll gekauft werden',
    stockHoldDetail:'Bearbeiten',
    stockHoldClear:'Aus Auswahl entfernen',
    stockAddFood:'＋ Lebensmittel',
    stockAddCat:'＋ Kategorie',
    stockAddFoodTitle:'Neues Lebensmittel',
    stockAddCatTitle:'Neue Kategorie',
    stockFoodName:'Name',
    stockFoodUnit:'Einheit',
    stockFoodCat:'Kategorie',
    stockCatName:'Kategoriename',
    stockAdded:n=>`${n} hinzugefügt`,
    stockCatAdded:n=>`Kategorie „${n}“ angelegt`,
    stockDragDock:'Ziehe Produkte hierher — bleibt immer sichtbar',
    stockEmptyCat:'Noch leer — tippe „＋ Lebensmittel“',
    bookWith:'Buchen', needQty:'Menge eingeben',
    shopTitle:'Einkaufsliste', addProduct:'+ Produkt', emptyList:'Liste ist leer',
    byWhom:'von', scanReceipt:'🧾 Beleg scannen (Freitag)',
    scanTitle:'Beleg scannen', shootReceipt:'📷 Beleg fotografieren',
    reading:'Beleg wird gelesen…', found:n=>`${n} Produkte gefunden.`,
    result:'Ergebnis', notOnList:'nicht auf der Liste',
    bookBatch:'Charge buchen', batchDone:'Charge gebucht',
    newProduct:'Neues Produkt', name:'Name', unit:'Einheit', addBtn:'Hinzufügen',
    allStaff:'Alle Mitarbeiter', all:'Alle',
    history:'Verlauf', appendOnly:'append-only', noLog:'Noch keine Einträge',
    stamp:'Stempel', correction:'✍️ Korrektureintrag',
    correctionTitle:'Korrektureintrag',
    correctionHint:'Nichts wird gelöscht — es kommt ein neuer Eintrag dazu, der die Korrektur erklärt.',
    correctionPh:'z.B. Ausgang 2kg Hähnchen war 1kg',
    correctionWhat:'Was korrigierst du', saved:'Gespeichert',
    logNoDelete:'Einträge werden nie gelöscht oder geändert. Jede Korrektur ist ein neuer Eintrag.',
    typeIN:'Eingang', typeOUT:'Ausgang', typeSHOP:'Einkauf', typeSCHEDULE:'Plan',
    typeCORRECTION:'Korrektur', typeLOGIN:'Anmeldung', typeNOTES:'Hinweise', typeEVENT:'Event',
    entryStaff:'Personal', entryChild:'Kinder',
    entryStaffSub:'Plan, Lager, Einkauf, Protokoll', entryChildSub:'Was mache ich diese Woche',
    whoAreYou:'Wer bist du?',
    myWeek:'Meine Woche', myToday:'Was mache ich heute', weekEvents:'Events der Woche',
    withWhom:'mit', nothingToday:'Heute ist nichts eingetragen',
    childBye:'Abmelden', announcements:'Ankündigungen',
    gateTitle:'Armonia Thassos', gateBrandLine:'Gemeinsam durch den Tag', gatePick:'Wähle dein Profil', gatePin:'Gib deine PIN ein',
    gateBack:'← Anderes Profil', wrongPin:'Falsche PIN',
    forgotPin:'PIN vergessen oder ändern?', resetPinTitle:'PIN per E-Mail ändern', emailLabel:'Deine E-Mail-Adresse',
    sendResetLink:'Änderungslink senden', resetLinkSent:'Wenn die E-Mail zu diesem Profil gehört, wurde ein Link gesendet.',
    newPin:'Neue PIN (4–6 Ziffern)', confirmPin:'Neue PIN bestätigen', changePin:'PIN ändern',
    pinChanged:'PIN geändert. Bitte melde dich neu an.', invalidReset:'Der Link ist ungültig oder abgelaufen.',
    authUnavailable:'Anmeldung ist gerade nicht erreichbar.', tooManyPins:'Zu viele Versuche.',
    lockedFor:n=>`Anmeldung gesperrt. Versuche es in ${n} Minute${n===1?'':'n'} erneut.`,
    attemptsRemaining:n=>`Falsche PIN. Noch ${n} Versuch${n===1?'':'e'}.`,
    useBiometrics:'Mit Geräte-Sperre anmelden', passkey:'Passkey', passkeySetup:'Face ID / Touch ID einrichten',
    passkeyHint:'iPhone: Face ID · Android: Fingerabdruck · Mac: Touch ID · Windows: Hello. Biometrie bleibt auf dem Gerät — nur ein öffentlicher Schlüssel wird gespeichert.',
    passkeyAdded:'Face ID / Touch ID wurde eingerichtet.', passkeyRemoved:'Biometrie-Anmeldung entfernt.', removePasskeys:'Biometrie entfernen',
    passkeyNone:'Noch nicht eingerichtet. Mit PIN anmelden, dann unten „einrichten“ tippen.',
    passkeySetupNeeded:'Zuerst mit PIN anmelden, dann unter Profil Face ID / Touch ID einrichten.',
    passkeyConfig:'Passkey-Server ist nicht konfiguriert (Origin/RP ID). Prüfe PAIDIA_WEBAUTHN_ORIGIN auf Vercel.',
    emailNotFound:'E-Mail-Profil wurde nicht gefunden. Speichere zuerst Kontaktdaten oder prüfe, ob du angemeldet bist.',
    profileCustomize:'Profil anpassen', profileNickname:'Anzeigename', profileColor:'Farbe', profileEmoji:'Emoji',
    profileSaved:'Profil gespeichert', passkeyCount:n=>n===1?'1 Gerät eingerichtet':`${n} Geräte eingerichtet`,
    passkeyUnavailable:'Dieses Gerät unterstützt keine Biometrie-Anmeldung (braucht HTTPS und Face ID / Fingerabdruck / Windows Hello).',
    passkeyCancelled:'Abgebrochen — nichts wurde geändert.',
    profilePinTitle:'PIN ändern', profilePinHint:'Neue PIN gilt auf allen Geräten. 4–6 Ziffern.',
    profilePinCurrent:'Aktuelle PIN', profilePinNew:'Neue PIN', profilePinConfirm:'Neue PIN bestätigen',
    profilePinSave:'PIN speichern', profilePinChanged:'PIN geändert',
    profilePinWrong:'Aktuelle PIN ist falsch', profilePinSame:'Neue PIN muss anders sein',
    profilePinInvalid:'PIN muss 4–6 Ziffern haben und übereinstimmen',
    profileSectionLook:'Aussehen', profileSectionContact:'Kontakt', profileSectionPin:'PIN',
    profileSectionBio:'Face ID / Touch ID',
    bioSetupHint:'Richte Face ID / Fingerabdruck ein — schneller als PIN und bleibt auf dem Gerät.',
    bioSetupNow:'Jetzt einrichten',
    bioSetupLater:'Später',
    notifHintChild:'Events und Momente als Mitteilung — wie eine echte App. Nur Nettes, kein Team-Lager.',
    notifEnableChild:'Mitteilungen für Events an',
    childInstallTitle:'App aufs Handy',
    childInstallHint:'So bleibt Armonia wie eine App auf dem Home-Bildschirm.',
    childInstallIos:'iPhone: Teilen → „Zum Home-Bildschirm“ → Hinzufügen',
    childInstallAndroid:'Android: Menü ⋮ → „App installieren“ oder „Zum Startbildschirm“',
    childHowTo:'So geht’s',
    childHowToHint:'Heute · Events · Woche · Momente · Spiele · Zo-Ai',
    childHowToToday:'Heute: dein Tag und was ansteht',
    childHowToEvents:'Events: Feiern und Ausflüge',
    childHowToWeek:'Woche: Überblick',
    childHowToGallery:'Momente: schöne Fotos',
    childHowToGames:'Spiele: lernen und Spaß',
    childHowToZoai:'Zo-Ai: Fragen stellen (ändert nichts allein)',
    childNotifEvent:title=>`Event · ${title}`,
    adminBroadcastPreview:'So sieht die Mail aus',
    adminBroadcastLang:'Sprache der Mail',
    adminNotifyPanel:'Mitteilung / E-Mail',
    adminNotifyPanelHint:'E-Mail an Profile mit Adresse. Kinder-Audience = nur Kinder-Mails.',
    adminBroadcastAlsoBanner:'Auch als Banner in der App zeigen (online)',
    adminBroadcastBannerDismiss:'Verstanden',
    webauthnOriginWarn:'Passkey-Origin prüfen (PAIDIA_WEBAUTHN_ORIGIN) — sonst scheitert Face ID auf dem iPhone.',
    profileStorageOk:'Datenbank aktiv — Plan, Lager, Listen und Profil überleben Deployments.',
    profileStorageWarn:'Kein Postgres — Daten können nach einem Deploy verloren gehen. In Vercel → Environment Variables DATABASE_URL setzen.',
    durableStorageBadge:'Server-Speicher',
    securityAccess:'Anmeldung & Sicherheit', signOut:'Abmelden', pinFallback:'Oder PIN verwenden', thisDevice:'Dieses Gerät',
    profileDetails:'Profildaten', manageProfiles:'Profile verwalten', recoveryEmail:'E-Mail für PIN-Wiederherstellung',
    recoveryEmailHint:'An diese Adresse gehen einmalige PIN-Links und wichtige Sicherheitsmeldungen.',
    saveEmail:'E-Mail speichern', emailSaved:'E-Mail wurde gespeichert.', emailInvalid:'Gib eine gültige E-Mail-Adresse ein.',
    phoneLabel:'Telefon', phoneHint:'Mobilnummer für kurze Absprachen im Team.',
    phoneInvalid:'Gib eine gültige Telefonnummer ein (mind. 8 Ziffern).',
    phoneSaved:'Telefonnummer wurde gespeichert.',
    contactTitle:'Kontaktdaten', contactKicker:'Erster Login',
    contactIntro:'Bitte hinterlege E-Mail und Telefon — einmalig, damit PIN-Reset und Team-Kontakt funktionieren.',
    contactSave:'Speichern & weiter', contactRequired:'E-Mail und Telefon sind erforderlich.',
    saveContact:'Kontaktdaten speichern', contactSaved:'Kontaktdaten gespeichert.',
    emailProvider:'E-Mail-Versand', emailReady:'bereit', emailNotReady:'E-Mail ist noch nicht konfiguriert',
    emailReadyHint:'PIN-Links, Tests, Events und Team-Nachrichten können zugestellt werden.',
    emailOfflineHint:'Auf dem Server fehlen SMTP oder Resend. Ohne Versand kein PIN-Link.',
    sendTestEmail:'Test-E-Mail senden', testEmailSent:'Test-E-Mail wurde gesendet — prüfe Posteingang & Spam.', testEmailFailed:'Die Test-E-Mail konnte nicht gesendet werden.',
    testEmailAuthFailed:'Anmeldung beim Mailversand abgelehnt. Prüfe SMTP-Passwort oder Resend-API-Key und starte neu.',
    testEmailSenderFailed:'Absender ungültig. SMTP_FROM / RESEND_FROM muss eine echte Adresse sein.',
    testEmailRecipientRestricted:'Empfänger abgelehnt (z. B. Resend-Testmodus nur an die Konto-Adresse).',
    testEmailRateLimited:'Zu viele E-Mails. Warte kurz und versuche es erneut.', testEmailNetwork:'Mailserver nicht erreichbar. Auf Vercel Resend nutzen; lokal SMTP prüfen.',
    emailSaveFirst:'Zuerst E-Mail speichern, dann Test senden.',
    emailPreviewTitle:'So sieht die Mail aus',
    emailPreviewBody:'PIN-Reset und Sicherheitsmeldungen kommen im Armonia-Design.',
    contactCardTitle:'Kontakt & Wiederherstellung',
    switchProfile:'Anderes Profil öffnen', profilesBack:'Profile',
    adminsManageEmails:'Als Admin kannst du die E-Mail jedes Profils verwalten.',
    resetUnavailable:'E-Mail-Reset ist gerade nicht verfügbar. Bitte Admin fragen.',
    resetNeedProfileEmail:'Nutze die E-Mail, die für dieses Profil gespeichert ist. Fehlt sie, speichere sie zuerst nach dem Login unter Profil.',
    resetBackPin:'← Zurück zur PIN',
    gateTrace:'Jede Buchung wird mit Name, Zeit, Gerät und IP erfasst.',
    device:'Gerät', welcome:n=>'Willkommen, '+n,
    tutorialRequired:'Login-Tutorial · erforderlich', tutorialStep:(n,total)=>`Schritt ${n} von ${total}`,
    tutorialNext:'Weiter', tutorialBack:'Zurück', tutorialFinish:'Einführung abschließen',
    tutorialSaving:'Fortschritt wird sicher gespeichert…', tutorialDone:'Einführung abgeschlossen. Willkommen!',
    tutorialSaveError:'Die Einführung konnte nicht gespeichert werden. Prüfe die Verbindung und versuche es erneut.',
    tutorialTip:'Du musst alle Schritte ansehen. Diese Einführung kann nicht übersprungen oder geschlossen werden.',
    tutorialOpen:'App-Tutorial öffnen', tutorialReplay:'Funktions-Tutorial', tutorialClose:'Tutorial beenden',
    tutorialReplayTip:'Du kannst dieses Tutorial jederzeit über Hilfe (?) oder Profil erneut öffnen.',
    helpCenter:'Hilfe & Zo-Ai', helpCenterHint:'Tutorial, Team-Gespräch und Zo-Ai. Zo-Ai kann mit Bestätigung Lager, Liste und Plan ändern.',
    startTutorial:'Geführtes App-Tutorial', startTutorialHint:'Alle Funktionen passend zu deinem Profil – jederzeit wiederholbar über ?.',
    askAiHelp:'Zo-Ai fragen', askAiHelpHint:'Lager, Liste, Plan — in einfacher Sprache',
    staffTalk:'Team sprechen', staffTalkHint:'Chat mit Mikrofon, Besprechungsthemen und gemeinsamer Videoanruf.',
    staffTalkTitle:'Team-Gespräch', staffTalkIntro:'Schreibt oder sprecht per Mikrofon. Themen merken wir für die Besprechung. Video geht über einen gemeinsamen Jitsi-Raum.',
    staffTalkEmpty:'Noch keine Nachrichten. Schreibt die erste.',
    staffTalkPlaceholder:'Nachricht an das Team…',
    staffTalkSend:'Senden',
    staffTalkTopics:'Darüber sprechen',
    staffTalkTopicsHint:'Themen für heute / die Besprechung. Abhaken, wenn besprochen.',
    staffTalkTopicPh:'z.B. Handover Limenaria, Einkauf Freitag…',
    staffTalkAddTopic:'Thema merken',
    staffTalkClearDone:'Erledigte ausblenden',
    staffTalkSuggest:'Vorschläge aus heute',
    staffTalkVideo:'Video / Audio anrufen',
    staffTalkVideoHint:'Öffnet den gemeinsamen Jitsi-Raum (Kamera & Mikrofon). Alle im Team nutzen denselben Link.',
    staffTalkVideoOpen:'Raum öffnen',
    staffTalkNeedStaff:'Nur für Personal verfügbar.',
    staffTalkLoadError:'Team-Gespräch konnte nicht geladen werden.',
    staffTalkOpen:'Team-Gespräch öffnen',
    staffTalkOpenTopics:n=>`${n} offene Besprechungsthemen`,
    pickChild:'Mindestens ein Kind wählen', pickActivity:'Aktivität wählen',
    loginEntry:'Anmeldung in der App',
    notesSaved:'Hinweise gespeichert', materialsMoved:n=>`${n} Positionen in die Einkaufsliste übernommen`,
    weekOf:'Zeitraum',
    stOpen:'Offen', stPending:'Wartet auf Bestätigung', stBought:'Gekauft', stMissing:'Fehlt',
    secOpen:'Auf der Liste', secPending:'Freitag-Charge — wartet auf Bestätigung',
    secBought:'Gekauft & eingeräumt', secMissing:'Fehlmengen — nicht gekauft',
    startFriday:'🧾 Freitag-Einkauf starten', inSupermarket:'Im Supermarkt abhaken:',
    tapDoes:'Antippen bucht als:', dragToZone:'Zum Umschalten auf + oder − tippen',
    switchDir:'Richtung wechseln',
    stockBoard:'Bestandsbewegung', dropHere:'Antippen oder in ein Feld ziehen',
    itemsPicked:'ausgewählt', pickSomething:'Tippe Produkte an oder zieh sie in das Feld oben',
    bookN:n=>`${n} ${n===1?'Position':'Positionen'} buchen`,
    stockDraftSave:'Änderungen speichern',
    stockDraftClear:'Verwerfen',
    stockDraftNeedReason:'Für Ausgang einen Grund wählen.',
    stockDraftSummary:(n,ins,outs)=>`${n} · +${ins} / −${outs}`,
    stockDraftPending:'Noch nicht gespeichert',
    homeMore:'Mehr heute',
    homeSignals:'Kurzüberblick',
    stockHeroHint:'Bestände prüfen und Bewegung buchen',
    shopHeroHint:'Freitagsliste planen, mitnehmen, im Laden abhaken',
    adminAutomations:'Automationen',
    adminAutomationsHint:'Lokale Mitteilungen steuern (App offen). E-Mail weiter über Broadcast.',
    autoShiftStart:'Schicht-Start Mitteilung',
    autoLowStock:'Niedriger Lagerbestand',
    autoPresenceLate:'Verspätung erinnern',
    autoBroadcastBanner:'Broadcast als Banner zeigen',
    autoFridayShop:'Freitag-Einkauf erinnern',
    autoSaved:'Automationen gespeichert',
    reason:'Grund', newReason:'Neuer Grund', reasonNamePh:'z. B. Spende, Reparatur oder Teamküche',
    saveReason:'Grund hinzufügen', reasonRequired:'Schreibe zuerst einen Namen für den Grund.',
    reasonExists:'Dieser Grund existiert bereits und wurde ausgewählt.', reasonAdded:n=>`„${n}“ wurde gespeichert und ausgewählt.`, reasonRemoved:'Eigener Grund entfernt.',
    storeMode:'Im Supermarkt', other:'Sonstiges',
    storeFocus:'Einkaufsmodus', storeFocusHint:'Entscheide jede Position eindeutig. Nichts wird automatisch als fehlend markiert.',
    storeSearch:'Suchen…', storeRemaining:'Noch offen', storeComplete:'Fertig',
    markBought:'Gekauft', markMissing:'Fehlt', markUnavailable:'Nicht da', markExpensive:'Zu teuer',
    undoDecision:'Zurücksetzen',
    missReasonUnavailable:'Nicht verfügbar', missReasonExpensive:'Zu teuer',
    decideAll:'Entscheide zuerst alle Positionen.', shoppingProgress:'Einkaufsfortschritt',
    storeShowDone:'Erledigte zeigen', storeHideDone:'Erledigte ausblenden',
    storeLeft:n=>`${n} offen`, storeTapHint:'✓ gekauft · ∅ nicht da · € zu teuer',
    listPlanned:'Liste geplant', listShopping:'Im Einkauf', listFinished:'Abgeschlossen',
    tapToTick:'Tippen: gekauft → nicht da → zu teuer → offen',
    gotIt:'✓ gekauft', notThere:'✕ nicht da',
    confirmBatch:'Charge bestätigen', batchHint:'Alle Positionen werden gemeinsam gebucht.',
    carryOver:'↩︎ Zurück auf die Liste', nothingPending:'Keine offene Charge',
    whereIsWhat:'Was ist wo', inFridge:'Im Lager', lastPurchase:'Letzter Einkauf',
    bothHouses:'Alle Häuser', shortage:'Fehlmenge',
    boughtNotOnList:'gekauft, war nicht auf der Liste',
    batchBooked:n=>`${n} Positionen gebucht`, nothingToStart:'Die Liste ist leer',
    shoppingHistory:'Einkaufsverlauf', shoppingHistoryHint:'Jeder abgeschlossene Einkauf – mit gekauft und nicht gekauft.',
    noShoppingHistory:'Noch kein abgeschlossener Einkauf', noShoppingHistoryHint:'Nach der Bestätigung im Supermarkt erscheint der Einkauf automatisch hier.',
    boughtItems:'Gekauft', notBoughtItems:'Nicht gekauft', completedBy:'Abgeschlossen von', completedOn:'Abgeschlossen',
    cartQuickAdd:'Produkt schnell hinzufügen…', addToCart:'Hinzufügen', cartReady:n=>`${n} ${n===1?'Produkt':'Produkte'} – Einkauf starten`,
    removeListTitle:'Von der Liste nehmen',
    removeListHint:'Warum wird diese Position entfernt?',
    removeListConfirm:'Entfernen',
    removeListNeedReason:'Bitte einen Grund wählen.',
    removeListReasonPh:'z. B. Kind bringt mit, Spende…',
    listItemRemoved:'Position aus der Liste entfernt.',
    bookedToHouse:n=>`Gekauft und in ${n} eingebucht`, backToCart:'Zurück zum Warenkorb', externalHome:'Anderes Zuhause', customProducts:'Weitere Produkte',
    chooseShoppingHouse:'1. Haus auswählen', shoppingHouseHint:'Auch Julian groß, Valeria und Lea — nur für Einkauf/Bestand, nicht im Wochenplan.',
    fullBlock:'Ganzer Block', fromTime:'ab', timeFrom:'Von', timeTo:'Bis',
    importTitle:'Liste einlesen', fromText:'Text', fromPhoto:'Foto', fromScreenshot:'Screenshot',
    listJourneyTitle:'Freitagseinkauf', listJourneyHint:'Eine vollständige Liste pro Haus und echtem Freitagsdatum.',
    addToFriday:'Liste hinzufügen', chooseFriday:'Freitag wählen', previousFriday:'Vorheriger Freitag', nextFriday:'Nächster Freitag',
    fridayLabel:'Freitag', listItems:'Positionen', completedItems:'Erledigt', openItems:'Offen',
    importStep:'Neue Liste erfassen', importStepHint:'Text und Screenshot sind immer verfügbar – auch wenn schon Einträge vorhanden sind.',
    sourceTextTitle:'Text einfügen', sourceTextHint:'Eine Zeile pro Produkt oder eine komplette Nachricht einfügen.',
    sourceImageTitle:'Screenshot / Foto', sourceImageHint:'Hochladen, einfügen oder direkt fotografieren.',
    imagePreview:'Kleine Vorschau', changeImage:'Anderes Bild', removeImage:'Entfernen', imagePreviewHint:'Das Original wird nur für OCR verwendet und bleibt hier kompakt.',
    analyzeText:'Text analysieren', uploadImage:'Bild auswählen', existingFriday:'Bereits auf diesem Freitag',
    saveBehavior:'Wie soll gespeichert werden?', mergeSmart:'Intelligent zusammenführen', mergeSmartHint:'Gleiche Produkte werden addiert.',
    appendSeparate:'Als neue Zeilen', appendSeparateHint:'Vorhandene Einträge bleiben unverändert.',
    replaceFriday:'Freitag ersetzen', replaceFridayHint:'Offene Einträge dieses Freitags werden ersetzt.',
    importDestination:'Ziel', importSource:'Quelle', importReview:'Vorschau & Korrektur',
    importedToFriday:d=>`Liste für Freitag, ${d}, gespeichert`, noFridayItems:'Für diesen Freitag gibt es noch keine Liste.',
    noFridayItemsHint:'Tippe oben ein Produkt ein, oder importiere Text/Screenshot. Später jederzeit ergänzen.',
    fridayActive:'Einkauf läuft', fridayPlanned:'Geplant', fridayCompleted:'Abgeschlossen',
    shopPlan:'Planen', shopTake:'Mitnehmen', shopTakeHint:'Kompakt nach Gang — was mitnehmen',
    shopTakeEmptyHint:'Unter Planen Produkte hinzufügen oder Auto aus Lager nutzen.',
    shopAutoFill:'Auto aus Lager', shopAutoFilled:n=>`${n} Produkte ergänzt`,
    selectMode:'Auswählen', selectDone:'Fertig', selectedCount:n=>`${n} gewählt`,
    bulkRemove:'Entfernen', bulkQtyMinus:'Qty −', bulkQtyPlus:'Qty ＋', bulkToList:'→ Liste',
    bulkOut:'OUT', bulkClearEmpty:'Leeren', bulkFound:'Gefunden', bulkMissing:'Fehlt', bulkUndo:'Rückgängig',
    bulkRemoved:n=>`${n} entfernt`, bulkListed:n=>`${n} → Liste`, bulkDecided:n=>`${n} markiert`,
    homeSignalList:'Liste', homeSignalStock:'Lager', homeCompactTitle:'Heute · kompakt',
    stockQuickList:'Alles Wenige → Liste', stockQuickListShort:'Wenige',
    stockAddedLow:n=>`${n} auf Einkaufsliste`,
    viewCalendar:'Kalender', calPrev:'‹', calNext:'›',
    exportCalendar:'Kalender exportieren (.ics)', upcomingEvents:'Kommende Events',
    pasteList:'Liste einfügen oder tippen',
    pastePh:'Nutella 2, Milch light 2, Wasser groß 4, Nektarinen 10–12',
    readIt:'🪄 Einlesen', shootList:'📷 Liste fotografieren',
    checkBeforeSave:'Prüfen und korrigieren', importN:n=>`${n} Positionen übernehmen`,
    alreadyOnList:'steht schon auf der Liste', qtyGuessed:'Menge geschätzt',
    nothingToImport:'Nichts erkannt',
    importList:'🪄 Liste einlesen',
    aiReading:'AI liest und strukturiert die Liste…', aiUnavailable:'AI ist nicht erreichbar. Text wurde lokal analysiert.',
    aiNeedsServer:'AI-Fotoerkennung ist nicht konfiguriert. Starte die App mit server.py und GROQ_API_KEY.',
    chooseImage:'Bild / Screenshot wählen', useCamera:'Kamera verwenden', extractedText:'Erkannter Text',
    confHigh:'Hohe Sicherheit', confMedium:'Prüfen', confLow:'Unklar', stockNow:'Bestand',
    aiDraft:'AI-Entwurf — bitte prüfen', imageReady:'Bild bereit', itemName:'Produktname',
    vTitle:'Prüfung', vNone:'Keine Konflikte gefunden',
    vHint:'Warnungen blockieren nicht — die Leitung kann bewusst abweichen.',
    vTwoHouses:'gleichzeitig in zwei Häusern', vChildTwice:'in zwei Gruppen gleichzeitig',
    vOff:'hat frei laut Dienstplan', vOutside:'außerhalb der Dienstzeit',
    vDuplicate:'Doppelter Eintrag', vKids:n=>`${n} Kinder bei einer Person`,
    viewShift:'Dienst', shiftPlan:'Dienstplan', off:'Frei', h24:'24 h', handover:'Übergabe',
    tenMinRule:'10-Minuten-Regel: mindestens 10 Minuten vor Dienstbeginn vor Ort. Bleibt die Übergabe unvollständig, bleibt die vorherige Schicht im Dienst.',
    newActivity:'Neue Aktivität', activityName:'Name der Aktivität',
    adminOnly:'Die feste Vorlage dürfen nur Zoi, Angelos und Dimitris ändern.',
    whoDidWhat:'Wer hat was gemacht', today:'Heute', last7:'Letzte 7 Tage', last30:'30 Tage', bookAll:'Alles',
    bookHeroTitle:'Was passiert ist', bookHeroHint:'Filtern und eine klare Ansicht wählen — nicht alles auf einmal.',
    bookJournalHero:'Schichtbuch', bookJournalHint:'Ein Buch, das geführt werden muss. Heute eine Seite schreiben.',
    bookPaneLog:'Verlauf', bookPanePeople:'Personen', bookPaneShift:'Schichtbuch',
    bookSearchPh:'Suche in Text, Name, Typ…', bookClearFilters:'Filter zurücksetzen',
    bookViewTimeline:'Zeitlinie', bookViewByDay:'Nach Tag', bookViewCompact:'Kompakt',
    bookShowTech:'IP & Gerät zeigen', bookHideTech:'Technik ausblenden',
    bookResults:n=>n===1?'1 Eintrag':`${n} Einträge`, bookNoMatch:'Nichts für diese Filter',
    bookRangeLabel:'Zeitraum', bookTypeLabel:'Art', bookWhoLabel:'Person', bookViewLabel:'Darstellung',
    actions:n=>n===1?'Buchung':'Buchungen', noActionsToday:'Heute noch nichts gebucht',
    visibleToAll:'Für alle sichtbar',
    close:'Schließen', menuFilters:'Filter', menuDone:'Fertig',
    childToday:'Heute', childEvents:'Events', childWeek:'Woche', childGames:'Spiele', childRewards:'Belohnungen',
    kidNavStart:'Start', kidNavPlan:'Plan', kidNavLearn:'Lernen', kidNavStars:'Sterne', kidNavGames:'Spiele',
    kidHello:n=>`Hallo, ${n}`, kidLevelCard:n=>`Stufe ${n}`, kidXpOf:(a,b)=>`${a} / ${b} Sterne`,
    kidXpRemain:n=>`Noch ${n} bis zur nächsten Stufe`, kidTodayLessons:'Heute',
    kidLessonsDone:(d,t)=>`${d} von ${t} fertig`, kidNextUp:'Als Nächstes',
    kidNextMeta:(m,xp)=>`${m} Min. · +${xp} Sterne`, kidCourseLearn:'Lernen', kidCourseTasks:'Aufgaben',
    kidCourseStars:'Sterne', kidCourseGames:'Spiele',
    kidLearnOpen:n=>n===1?'1 Quiz offen':`${n} Quiz offen`,
    kidTasksDue:n=>n===1?'1 heute fällig':`${n} heute fällig`,
    kidStarsCollected:n=>`${n} gesammelt`, kidGamesPlay:'Spielen',
    storageOffline:'Nicht dauerhaft gespeichert — Datenbank offline. Bitte Admin informieren.',
    kidNavRate:'Bewertung', kidRateTitle:'Bewertungen', kidRateKicker:'Wie lief die Woche?',
    kidRateLead:'Tippe die Sterne. Das sehen nur du und deine Betreuerin.',
    kidRateSchool:'Schule', kidRateHome:'Zuhause', kidRateFriends:'Freunde', kidRateMood:'Wie ich mich fühle',
    kidRateWeeks:'Letzte 4 Wochen', kidRateSaved:'Bewertung gespeichert',
    kidRateEmpty:'Diese Woche noch nicht bewertet.',
    kidBonusTitle:'Bonus', kidBonusKicker:'Extra verdient',
    kidBonusEarned:n=>`+${n} Bonus-Sterne`, kidBonusHow:'Wie du Bonus bekommst',
    kidBonusStreak:n=>`${n} Tage in Folge ohne verpasste Aufgabe.`,
    kidBonusAllWeek:'Ganze Woche alle Aufgaben', kidBonusRead:'5 Tage in Folge gelesen',
    kidBonusHelp:'Jemandem geholfen', kidBonusTidy:'Zimmer 7 Tage ordentlich',
    kidNotesTitle:'Notizen', kidNotesKicker:'Nur für dich',
    kidNotesAsk:'Wie war dein Tag?', kidNotesPlaceholder:'Schreib auf, was du nicht vergessen willst…',
    kidNotesSave:'Notiz speichern', kidNotesSaved:'Notiz gespeichert',
    kidMoodGood:'Gut', kidMoodOk:'Geht so', kidMoodHard:'Schwer',
    kidNotesEmpty:'Noch keine Notizen. Schreib die erste.',
    kidPlanTitle:'Stundenplan', kidAufgabenTitle:'Aufgaben', kidSterneTitle:'Sterne',
    kidLearnHubTitle:'Lernen', kidLearnHubHint:'Karten, Quiz und Rechnen — sammle Sterne.',
    kidStreak:'7-Tage-Streak', kidWeekDeltaLabel:'diese Woche', kidBadges:'Abzeichen',
    kidBadgeLocked:'Gesperrt', kidRedeem:'Einlösen', kidSubjectDaily:'Alltag',
    kidDueToday:'Heute fällig', kidOverdue:'Überfällig',
    rewardsTitle:'Aufgaben & Belohnungen', rewardsHero:'Dein Fortschritt',
    choresDue:'Heutige Aufgaben', choresDone:'Erledigte Aufgaben', choresAll:'Alle Aufgaben',
    choreSubmitProof:'Aufgabe einreichen', chorePhotoHint:'Foto machen oder beschreiben, was du getan hast',
    choreProofLabel:'Beweis eingeben…', choreProofPh:'z. B. «Ich habe das Zimmer aufgeräumt und das Bett gemacht»',
    choreAiChecking:'AI prüft deine Aufgabe…', choreAiApproved:'Super! Aufgabe bestätigt ✓',
    choreAiRejected:'Nicht ganz — probier es nochmal!', choreAiError:'Konnte nicht prüfen. Warte auf Betreuer.',
    choreSubmit:'Einreichen', choreDone:'Erledigt ✓', chorePending:'In Prüfung…',
    choreXpEarned:n=>`+${n} ⭐ verdient!`, choreAlreadyDone:'Heute schon erledigt',
    xpLevel:n=>`Level ${n}`, xpNextLevel:'bis nächstes Level', xpTotal:n=>`${n} XP gesamt`,
    leaderboard:'Rangliste', leaderboardMe:'(du)',
    levelNames:['Starter','Entdecker','Held','Champion','Legende'],
    adminRewards:'Aufgaben-Zentrale', adminPendingReview:'Warten auf Prüfung',
    adminApprove:'Genehmigen', adminReject:'Ablehnen', adminNoReviews:'Keine offenen Einreichungen',
    adminAddChore:'Aufgabe hinzufügen', adminChoreTitle:'Aufgaben-Titel', adminChoreXp:'XP-Punkte',
    adminChoreSaved:'Aufgabe gespeichert', adminChosenKids:'Für wen?',
    gamesTitle:'Spiele', gamesHint:'Längere Runden · ~3–5 Min · Lernen, Wissen, Rechnen & Klassiker',
    gamesPlayTime:'~3–5 Min',
    gameMemory:'Memory', gameMemoryHint:'Finde die Paare · so wenig Züge wie möglich',
    gameTac:'XO', gameTacHint:'Hol 3 in einer Reihe gegen den PC',
    gameCatch:'Fische fangen', gameCatchHint:'60 Sek · Kombo & Power-ups!',
    gameReact:'Reaktion', gameReactHint:'Tippe wenn es GRÜN wird',
    gameRps:'Schere Stein Papier', gameRpsHint:'Spiele gegen den Computer',
    gameDice:'Würfel', gameDiceHint:'Würfle · wer ist dran?',
    gameSimon:'Simon', gameSimonHint:'Merk dir die Farben · tippe die Reihe',
    gameColors:'Farbtreffer', gameColorsHint:'Tippe die richtige Farbe · Tempo!',
    gameLearn:'Griechisch lernen', gameLearnHint:'20 Karten · Themen · KI · wie Duolingo',
    gameQuiz:'Wissen', gameQuizHint:'14 Fragen · Natur, Griechenland, Spa',
    gameMath:'Rechnen', gameMathHint:'Stufen · Leben · Tempo!',
    gameIsland:'Insel-Pfad', gameIslandHint:'3D-Pfad · Thassos & Natur · ~4 Min',
    gameEduHub:'Lern-Spiele', gameEduHubHint:'Kostenlose Bildungs-Spiele (PhET) · sicher',
    gameIslandHintPlay:'Beantworte und steige den 3D-Pfad hinauf',
    gameIslandStep:'Station', gameIslandDone:'Insel erkundet!',
    eduOpen:'Öffnen', eduClose:'Schließen', eduSandbox:'Sicherer Modus · nur Lern-Seiten',
    eduArith:'Rechnen (PhET)', eduFrac:'Brüche (PhET)', eduColor:'Farben sehen (PhET)',
    eduExternalFail:'Spiel konnte nicht geladen werden',
    gameShareMoment:'In Momente teilen', gameShareMomentHint:'Feier deinen Sieg in der Galerie',
    gameLearnTopicAll:'Alles', gameLearnTopicGreet:'Hallo', gameLearnTopicFood:'Essen',
    gameLearnTopicBeach:'Strand', gameLearnTopicNature:'Natur', gameLearnTopicThassos:'Thassos',
    gameLearnWeak:'Schwache üben',
    gameLearnHintLabel:'Tipp', gameMathLives:'Leben', gameMathLevel:'Level',
    gameBack:'Alle Spiele', gamePlay:'Spielen', gameAgain:'Nochmal',
    gameMoves:'Züge', gamePairs:'Paare', gameScore:'Punkte', gameTime:'Zeit',
    gameBest:'Best', gameCombo:'Kombo', gameStreak:'Serie', gameLevel:'Stufe',
    gameWin:'Geschafft!', gameLose:'Schade — nochmal?', gameDraw:'Unentschieden',
    gameYourTurn:'Du bist dran', gameCpuTurn:'Computer denkt…', gameYou:'Du', gameCpu:'PC',
    gameCatchOver:'Zeit vorbei!', gameCatchHintPlay:'Tippe die Fische bevor sie wegschwimmen',
    gameMemoryHintPlay:'Zwei gleiche Karten finden',
    gameTacHintPlay:'Du = ❌ · Computer = ⭕',
    gameStars:(n)=>n===3?'★★★':n===2?'★★☆':'★☆☆',
    gameReactWait:'Warten…', gameReactGo:'JETZT!', gameReactEarly:'Zu früh!', gameReactMs:ms=>`${ms} ms`,
    gameReactHintPlay:'Warte auf Grün, dann tippe so schnell du kannst',
    gameRpsRock:'Stein', gameRpsPaper:'Papier', gameRpsScissors:'Schere',
    gameRpsHintPlay:'Wähle Stein, Papier oder Schere',
    gameDiceRoll:'Würfeln', gameDiceHintPlay:'Tippe Würfeln — für Spiele oder wer dran ist',
    gameDiceYou:'Du würfelst', gameDiceResult:'Ergebnis',
    gameSimonWatch:'Schau zu…', gameSimonGo:'Du bist dran!', gameSimonFail:'Ups — daneben',
    gameSimonHintPlay:'Die leuchtende Reihe merken und nachtippen',
    gameColorsTap:'Tippe:', gameColorsHintPlay:'Welche Farbe steht da? Tippe schnell',
    gameColorRed:'Rot', gameColorGreen:'Grün', gameColorBlue:'Blau', gameColorYellow:'Gelb',
    gameFishCatch:'Fisch tippen',
    gameLearnHintPlay:'Wähle die richtige Übersetzung',
    gameLearnDeToEl:'DE → EL', gameLearnElToDe:'EL → DE',
    gameLearnAi:'KI zufällig', gameLearnAiLoading:'KI lädt…', gameLearnAiFail:'KI nicht erreichbar — lokale Karten',
    gameLearnCorrect:'Richtig!', gameLearnWrong:'Nicht ganz —', gameLearnHearts:'Leben',
    gameLearnRound:'Runde', gameLearnDone:'Lektion geschafft!', gameLearnXp:'XP',
    gameXpEarned:n=>`+${n} ⭐ Bonus!`, gameStreak:n=>`${n} Tage Serie`,
    gameQuizHintPlay:'Tippe die richtige Antwort', gameQuizTopic:'Thema',
    gameMathHintPlay:'Rechne schnell und tippe die richtige Zahl',
    gameMathPlus:'Plus', gameMathMinus:'Minus', gameMathTimes:'Mal',
    eventOfWeek:'Event der Woche', eventToday:'Heute', eventTomorrow:'Morgen', upcomingEvents:'Demnächst',
    bring:'Mitbringen', accompaniedBy:'Begleitung', noEvents:'Keine kommenden Events', published:'Veröffentlicht',
    helpChat:'Zo-Ai', helpWelcome:'Hallo! Ich bin Zo-Ai. Frag mich zur App — oder sag z. B. „füge 2 Milch zu Kalyvia hinzu“. Änderungen brauche ich danach deine Bestätigung.',
    helpWelcomeChild:'Hallo! Ich bin Zo-Ai. Ich helfe dir bei deinem Tag, Events und Spielen. Frag z. B. „Was habe ich heute?“ oder „Wie spiele ich Memory?“',
    helpWelcomeStaff:'Hallo! Ich bin Zo-Ai, dein Assistent. Ich helfe bei Plan, Events, Lager und Liste. Sag z. B. „2 Milch nach Kalyvia“ oder „Fußball morgen Nachmittag für Maria“. Danach bestätigen.',
    helpWelcomeAdmin:'Hallo! Ich bin Zo-Ai. Du hast Admin-Rechte. Ich helfe bei Betrieb, Admin-Zentrale, Dauerplan und Lager. Sag z. B. „2 Milch nach Kalyvia“ oder „trage Schwimmen dauerhaft Dienstag Vormittag ein“.',
    helpRoleChild:'Kind', helpRoleStaff:'Betreuung', helpRoleAdmin:'Admin',
    helpQuickChild:'Schnell fragen', helpQuickAdmin:'Schnell: Lager / Admin',
    helpChildHint:'Du siehst nur deine Termine und Spiele. Essens- oder Planänderungen macht die Betreuung.',
    helpAdminHint:'Als Admin kannst du Dauerplan und Dienste vorschlagen lassen. Jede Änderung braucht Bestätigung und PIN.',
    helpMutateHint:'Sag Zo-Ai z. B.: „Milch +2 Kalyvia“, „Reis auf die Liste“ oder „trag morgen Nachmittag Fußball für Angelos ein“. Dann prüfen und speichern.',
    zoAiReady:'Zo-Ai ist bereit — frag jederzeit um Hilfe.',
    zoAiReadyChild:'Zo-Ai ist da — frag z. B. was du heute machst.',
    zoAiBannerTitle:'Zo-Ai · dein Assistent',
    zoAiBannerTitleChild:'Zo-Ai · Hilfe für dich',
    zoAiBannerHint:'Frag in einfacher Sprache. Zo-Ai kann Lager, Liste und den Plan vorschlagen — du bestätigst.',
    zoAiBannerHintChild:'Frag Zo-Ai zu deinem Tag, Events oder Spielen. Zo-Ai ändert nichts ohne Erwachsene.',
    zoAiBannerOpen:'Zo-Ai öffnen',
    zoAiBannerDismiss:'Später',
    helpVoice:'Spracheingabe', helpVoiceListening:'Höre zu… tippe erneut zum Stoppen',
    helpVoiceUnsupported:'Spracheingabe wird auf diesem Gerät nicht unterstützt.',
    helpVoiceError:'Spracheingabe fehlgeschlagen. Tippe die Frage stattdessen.',
    helpVoiceReady:'Sprache erkannt — prüfe und sende.',
    helpVoiceDenied:'Mikrofon-Zugriff verweigert. Erlaube das Mikrofon in den Einstellungen.',
    helpVoiceSecure:'Spracheingabe braucht HTTPS oder localhost.',
    helpVoiceStart:'Mikrofon wird vorbereitet…',
    helpQuickFood:'Schnell: Lager / Liste',
    helpConfirmInline:'Jetzt speichern',
    helpDiscardInline:'Verwerfen',
    helpProposeTitle:'Zo-Ai Vorschläge', helpProposeHint:'Noch nicht gespeichert. Prüfe die Liste und bestätige.',
    helpProposeConfirm:'Änderungen speichern', helpProposeCancel:'Verwerfen',
    helpProposeDone:n=>`${n} ${n===1?'Änderung':'Änderungen'} gespeichert`,
    helpProposeDenied:'Nur angemeldete Betreuer können Änderungen speichern.',
    helpProposeEmpty:'Keine gültigen Änderungen erkannt.',
    helpProposeNeedPin:'Für Plan-Änderungen bitte PIN bestätigen.',
    helpActionStock:(dir,qty,unit,name,house)=>`${dir==='IN'?'+':'−'} ${qty} ${unit} ${name} @ ${house}`,
    helpActionStockSet:(qty,unit,name,house)=>`= ${qty} ${unit} ${name} @ ${house}`,
    helpActionWantBought:(name,house)=>`🛒 ${name} → Liste @ ${house}`,
    helpActionShiftNote:text=>`📝 Schicht: ${String(text||'').slice(0,80)}`,
    helpActionOpenTab:tab=>`↗ ${tab}`,
    helpActionShopAdd:(qty,unit,name,house)=>`🛒 + ${qty} ${unit} ${name} → Liste ${house}`,
    notifEnable:'Mitteilungen aktivieren',
    notifEnabled:'Mitteilungen an',
    notifDenied:'Mitteilungen blockiert — in den Geräteeinstellungen erlauben',
    notifHint:'Wie eine echte App: Lager leer, Schicht-Check, Anwesenheit, Events.',
    notifLowStock:n=>`${n} Produkte brauchen Aufmerksamkeit`,
    notifShiftCheck:'Schicht-Lagercheck offen (Kalyvia)',
    notifShiftStart:t=>`Schicht beginnt · ${t}`,
    notifShiftLate:t=>`Schicht gestartet — bitte Anwesenheit melden · ${t}`,
    notifTest:'Test-Mitteilung von Armonia',
    notifQuietStart:'Ruhezeit von', notifQuietEnd:'Ruhezeit bis', notifLeadMinutes:'Vorlauf (Minuten)',
    notifUpcomingEvent:t=>`Event gleich · ${t}`, notifUpcomingTask:t=>`Aufgabe gleich · ${t}`,
    notifFridayShop:n=>`Freitagseinkauf · ${n} offen`,
    calTitle:'Mein Kalender',
    calHint:'Ein Klick — Dienste und Events in Apple, Google, Outlook oder jeden anderen Kalender.',
    calDownloadAll:'Alles als .ics (Apple & alle Apps)',
    calDownloadShifts:'Nur Dienste (.ics)',
    calDownloadEvents:'Nur Events (.ics)',
    calGoogleNext:'Nächste in Google Kalender',
    calOutlookNext:'Nächste in Outlook',
    calNextNone:'Keine kommenden Dienste in den nächsten Wochen.',
    calSaved:'Kalenderdatei bereit — Datei öffnen und hinzufügen',
    calWeeks:'Nächste 8 Wochen',
    calAddAny:'In jeden Kalender',
    calAddAnyHint:'Apple Kalender, Samsung, Fantastical, Thunderbird: .ics-Datei öffnen → „Alle hinzufügen“.',
    calAddWeb:'Schnell online',
    calUpcoming:'Kommende Termine',
    calAddThis:'Diesen Termin',
    calOneIcs:'.ics',
    calGoogle:'Google',
    calOutlook:'Outlook',
    calApple:'Apple / .ics',
    calReminder:'Erinnerung 30 Min. vor Schicht (in der Datei)',
    calOpenPerson:(name)=>`Kalender · ${name}`,
    calCount:n=>n===1?'1 Termin':`${n} Termine`,
    presencePanelTitle:'Schichtstart',
    presencePanelReady:'Melde dich, wenn du da bist.',
    presencePanelLateTitle:'Du bist später',
    presencePanelLateAsk:'Warum? Kurz tippen — dann „Ich bin da“.',
    presenceConfirmLate:'Verspätung melden & ich bin da',
    presenceNotifActionThere:'Ich bin da',
    presenceNotifActionLate:'Warum zu spät?',
    presenceNotifBodyReady:'Tippe die Mitteilung → „Ich bin da“.',
    presenceNotifBodyLate:'Schicht läuft schon — sag kurz warum und melde dich.',
    presenceTitle:'Schicht-Anwesenheit',
    presenceImThere:'Ich bin da',
    presenceLateWhy:'Warum zu spät?',
    presenceLateHint:'Dein Dienst hat schon begonnen. Kurz sagen, warum du später bist.',
    presenceReasonNeeded:'Bitte einen Grund angeben.',
    presenceSaved:'Anwesenheit gespeichert',
    presenceLateSaved:'Verspätung gemeldet',
    presenceBannerReady:(from,to)=>`Schicht ${from}–${to} · Bitte melden`,
    presenceBannerLate:(from,mins)=>`Schicht ab ${from} · ${mins} Min. später`,
    presenceBannerDone:(status,at)=>status==='late'?`Verspätet gemeldet · ${at}`:`Da · ${at}`,
    presenceOpen:'Melden',
    presenceDone:'Gemeldet',
    presenceReasonTraffic:'Verkehr',
    presenceReasonHealth:'Gesundheit',
    presenceReasonHandover:'Übergabe / Absprache',
    presenceReasonOther:'Sonstiges',
    presenceCustomReason:'Eigener Grund',
    presenceOnTime:'Pünktlich',
    presenceLate:'Zu spät',
    presenceNoShift:'Gerade keine offene Schicht-Meldung.',
    homeShiftStart:'Schicht beginnt',
    homeShiftStartLate:'Schicht hat begonnen — du bist später',
    homeShiftStartOn:'Schicht läuft',
    homeShiftStartHint:'Beim Start: Anwesenheit, Lagercheck, dann Seite im Schichtbuch.',
    homeShiftStepPresence:'Ich bin da',
    homeShiftStepStock:'Lagercheck Kalyvia',
    homeShiftStepJournal:'Schichtbuch schreiben',
    homeShiftStartDone:'Schichtstart erledigt',
    homeShiftOpen:'Jetzt melden',
    homeShiftStockGo:'Check starten',
    homeShiftJournalGo:'Seite öffnen',
    homeShiftDoneMark:'Erledigt',
    homeRailNotifs:'Benachrichtigungen',
    homeRailKids:'Kinder heute',
    homeRailEnd:'Schichtende',
    homeRailEndHint:'Übergabe · Buch schließen · Abmelden',
    homeShiftEndCta:'Schicht beenden',
    homeMomentsToday:'Momente heute',
    homeMomentsEmpty:'Noch keine Fotos heute',
    notifCenterTitle:'Mitteilungen',
    notifCenterEmpty:'Alles ruhig — keine offenen Hinweise.',
    notifCenterAll:'Alle gelesen',
    notifToneShift:'Schicht',
    notifToneStock:'Lager',
    notifTonePlan:'Plan',
    notifToneShop:'Liste',
    notifToneKids:'Kinder',
    notifToneZo:'Zo-Ai',
    shiftEndTitle:'Übergabe schließen',
    shiftEndHint:'Buchnotiz · offene Tasks · Abmelden',
    shiftEndBook:'Schichtbuch schreiben',
    shiftEndBookHint:'Pflicht · 2–4 Sätze',
    shiftEndTasks:'Offene Aufgaben prüfen',
    shiftEndTasksHint:(n)=>n?`${n} offen`:'Keine offen',
    shiftEndHandover:'Nächste Schicht informieren',
    shiftEndHandoverHint:'optional',
    shiftEndLogout:'Abmelden',
    shiftEndLogoutHint:'PIN / Passkey',
    shiftEndConfirm:'Schicht beenden',
    bellLabel:'Mitteilungen',
    helpActionShopRemove:(name,house)=>`🛒 entfernen: ${name} @ ${house}`,
    helpActionScheduleAdd:(when,block,what,who)=>`📅 + ${when} · ${block}: ${what}${who?' · '+who:''}`,
    helpActionScheduleUpdate:(when,what)=>`📅 ändern ${when}: ${what}`,
    helpActionScheduleCancel:(when,what)=>`📅 streichen ${when}: ${what}`,
    helpActionScheduleTemplate:(day,block,what)=>`📅 Dauerhaft ${day} · ${block}: ${what}`,
    helpPlaceholder:'Frag Zo-Ai…', helpSend:'Senden',
    helpThinking:'Zo-Ai prüft das…', helpUnavailable:'Zo-Ai ist gerade nicht erreichbar.',
    helpAuthExpired:'Sitzung abgelaufen. Bitte erneut anmelden und Zo-Ai nochmal fragen.',
    helpConfigBanner:'Zo-Ai ist nicht eingerichtet. In Vercel → Environment Variables GROQ_API_KEY setzen und neu deployen.',
    askAiHelp:'Zo-Ai fragen', askAiHelpHint:'Lager, Liste, Plan — in einfacher Sprache',
    viewEvents:'Events', eventsPanel:'Events & Ankündigungen', newEvent:'Neues Event', editEvent:'Event bearbeiten',
    eventTitle:'Titel', eventDescription:'Beschreibung', eventLocation:'Ort', eventBring:'Mitbringen',
    eventEmoji:'Symbol', announceEvent:'Als Event ankündigen', announceHint:'Wird sofort im Events-Tab der ausgewählten Kinder veröffentlicht.',
    publishEvent:'Für Kinder veröffentlichen', eventPublished:'Event veröffentlicht', eventDraft:'Entwurf',
    eventSaved:'Event gespeichert', eventDeleted:'Event gelöscht', deleteEvent:'Event löschen',
    eventRequired:'Titel, Datum, gültige Uhrzeit und mindestens ein Kind sind erforderlich.',
    invalidTime:'Die Endzeit muss nach der Startzeit liegen.', noStaffEvents:'Noch keine Events für diesen Zeitraum.',
    homeHello:'Guten Tag', homeOverview:'Dein Überblick für heute', myTasks:'Meine Aufgaben',
    overdueTasks:'Vergessen / überfällig', unassignedTasks:'Noch ohne Person', allEvents:'Alle Events',
    dueToday:'Heute zu tun', overdue:'Überfällig', eventsSoon:'Events', noTasks:'Keine offenen Aufgaben.',
    noTasksHint:'Tippe auf Planen, um den Tag zu öffnen.',
    noOverdue:'Nichts vergessen – alles im grünen Bereich.',
    noOverdueHint:'Offene Aufgaben von den letzten 7 Tagen erscheinen hier.',
    noUnassigned:'Alle Aufgaben sind zugeteilt.',
    noUnassignedHint:'Frei gebliebene Einträge der nächsten Tage erscheinen hier.',
    noEventsHint:'Veröffentlichte Events erscheinen hier und im Plan.',
    homePrimaryCta:'Tag planen',
    homeOpenPlan:'Zum Plan',
    homeOpenEvents:'Zu Events',
    planLaneEmpty:'Noch nichts · Tippen zum Hinzufügen',
    stockBoardShort:'Bewegung',
    stockAddFoodShort:'Produkt',
    noStockHint:'Filter zurücksetzen oder neues Produkt anlegen.',
    stockClearSearch:'Suche löschen',
    storeNoMatch:'Kein Treffer in der Einkaufsliste',
    storeNoMatchHint:'Suche löschen oder erledigte Positionen einblenden.',
    storeClearSearch:'Suche löschen',
    storeProgressHint:(done,total)=>`${done} von ${total} entschieden`,
    matrixEmpty:'Leer · tippen',
    galleryEmptyHint:'Teile den ersten Moment mit Foto und kurzem Text.',
    galleryComposeCta:'Moment teilen',
    markDone:'Als erledigt markieren', markOpen:'Wieder öffnen', taskDone:'Aufgabe erledigt', taskReopened:'Aufgabe wieder geöffnet',
    next3Days:'Nächste 3 Tage',
    eventButton:'Event', eventButtonOn:'Event wird veröffentlicht', childNotifications:'Neue Event-Mitteilungen',
    openEvents:'Events öffnen', kidsNotified:n=>`${n} Kinder erhalten die Mitteilung in der App.`,
    eventCollection:n=>`${n} ${n===1?'Event':'Events'} geplant`,
    adminCenter:'Admin-Zentrale', adminOverview:'Team, Aufgaben und Änderungen auf einen Blick',
    adminWarnings:'Nur Admins sehen betriebliche Warnungen', adminAllClear:'Keine aktuellen Planwarnungen',
    adminEditPlan:'Wochenplan bearbeiten', adminEditShifts:'Dienste bearbeiten', adminManageEvents:'Events verwalten',
    adminOpenAudit:'Protokoll öffnen', adminEmailEveryone:'E-Mail an alle',
    adminBroadcastTitle:'Team-Nachricht senden',
    adminBroadcastHint:'Schickt eine markierte Armonia-E-Mail an alle Profile mit hinterlegter Adresse.',
    adminBroadcastAudience:'Empfänger',
    adminBroadcastAll:'Alle mit E-Mail',
    adminBroadcastStaff:'Nur Team',
    adminBroadcastChildren:'Nur Kinder',
    adminBroadcastSubject:'Betreff',
    adminBroadcastHeadline:'Überschrift in der E-Mail',
    adminBroadcastMessage:'Nachricht',
    adminBroadcastSend:'E-Mail senden',
    adminBroadcastRecipients:n=>`${n} Empfänger mit E-Mail`,
    adminBroadcastNone:'Keine Profile mit E-Mail gefunden.',
    adminBroadcastNeedFields:'Betreff und Nachricht sind nötig.',
    adminBroadcastConfirm:n=>`E-Mail an ${n} Personen senden?`,
    adminBroadcastSent:(s,f)=>f?`Gesendet: ${s} · fehlgeschlagen: ${f}`:`E-Mail an ${s} Personen gesendet.`,
    adminBroadcastFailed:'E-Mail konnte nicht gesendet werden.',
    adminBroadcastRate:s=>`Bitte ${s}s warten, bevor du erneut sendest.`,
    adminBroadcastOffline:'E-Mail-Versand ist nicht eingerichtet (SMTP/Resend).',
    adminToday:'Heute', adminNext7:'Nächste 7 Tage', adminDone:'Erledigt',
    adminLastAction:'Letzte Aktivität', adminNoActivity:'Noch keine Aktivität', adminDetails:'Teamdetails',
    adminFullControl:'Admins können Planung, Dienste, Events, Notizen, Bestand und Protokollkorrekturen ändern.',
    editShiftDay:'Dienste bearbeiten', addShift:'Dienst hinzufügen', shiftType:'Typ', deleteShift:'Dienst entfernen',
    shiftSaved:'Dienste gespeichert', adminRequired:'Diese Funktion ist nur für Admins verfügbar.',
    whatsappSent:n=>`WhatsApp-Mitteilung an ${n} Kontakt${n===1?'':'e'} gesendet.`,
    whatsappSkipped:'In-App veröffentlicht; für WhatsApp sind noch keine Empfänger eingerichtet.',
    whatsappFailed:'Das Event ist in der App veröffentlicht, aber WhatsApp konnte nicht gesendet werden.',
    changesSaved:'Änderungen gespeichert', retry:'Bitte erneut versuchen.',
    errNetwork:'Keine Verbindung zum AI-Dienst. Prüfe Internet und Server und versuche es erneut.',
    errTimeout:'Die AI-Antwort hat zu lange gedauert. Bitte versuche es erneut.',
    errRate:'Die AI ist gerade ausgelastet. Warte kurz und versuche es erneut.',
    errConfig:'AI ist nicht eingerichtet. Lokal: GROQ_API_KEY in .env. Live: denselben Key in Vercel → Environment Variables setzen und neu deployen.',
    errImage:'Das Bild konnte nicht gelesen werden. Verwende JPG, PNG oder WebP mit gut sichtbarem Text.',
    errServer:'Zo-Ai konnte die Anfrage nicht verarbeiten. Bitte versuche es erneut.',
    errFile:'Diese Datei konnte nicht geöffnet werden. Wähle ein anderes Bild.',
    errStorage:'Speichern fehlgeschlagen. Der Gerätespeicher ist möglicherweise voll.',
    aiReady:'AI-OCR ist bereit. Füge Text ein oder lade einen Screenshot hoch.',
    cameraDenied:'Kamerazugriff wurde abgelehnt. Erlaube die Kamera in den Browser-Einstellungen.',
    cameraBusy:'Die Kamera wird bereits von einer anderen App verwendet.',
    cameraSecure:'Die Kamera funktioniert nur über HTTPS oder localhost.',
    unexpectedError:'Etwas ist schiefgelaufen. Deine Eingabe bleibt erhalten; versuche es erneut.',
    kidsCount:n=>`${n} ${n===1?'Kind':'Kinder'}`,
    chooseMany:'Mehrfachauswahl möglich', selectHouse:'Wähle mindestens ein Haus.',
    screenshotDrop:'Screenshot hier ablegen oder auswählen', screenshotPaste:'Oder Screenshot kopieren und hier ⌘V / Strg+V drücken',
    screenshotReady:'Screenshot bereit – OCR startet…', screenshotMissing:'Die Zwischenablage enthält keinen Screenshot.',
    pasteScreenshot:'Screenshot einfügen', pickScreenshot:'Screenshot / Foto wählen',
  },
  el: {
    appTitle:'Armonia Thassos', navHome:'Αρχική', navSchedule:'Πρόγραμμα', navStock:'Αποθήκη', navShop:'Λίστα', navBook:'Βιβλίο', navGallery:'Στιγμές', navTalk:'Talk', navKids:'Παιδιά',
    titleHome:'Αρχική', titleSchedule:'Εβδομαδιαίο πρόγραμμα', titleStock:'Αποθήκη', titleShop:'Λίστες & Ψώνια', titleBook:'Βιβλίο', titleGallery:'Στιγμές', titleTalk:'Συνομιλία ομάδας', titleKids:'Παιδιά & Σχολείο', kidsHeroHint:'Προφίλ, μαθήματα, παρουσία και εργασίες', kidsEmpty:'Δεν υπάρχουν παιδιά', schoolSubjects:'Μαθήματα', schoolAttendance:'Παρουσία', schoolHomework:'Εργασίες', schoolTimetable:'Ωρολόγιο', thisWeek:'Αυτή την εβδομάδα', gradeSaved:'Ο βαθμός αποθηκεύτηκε', attSaved:'Η παρουσία αποθηκεύτηκε', hwSaved:'Η εργασία αποθηκεύτηκε', ttSaved:'Η ώρα αποθηκεύτηκε', subSaved:'Το μάθημα αποθηκεύτηκε', subAdd:'Προσθήκη μαθήματος', subArchive:'Αρχειοθέτηση', subActivate:'Ενεργοποίηση', subEmpty:'Δεν υπάρχουν μαθήματα', att_present:'Παρόν', att_absent:'Απών', att_excused:'Δικαιολογημένο', hwEmpty:'Καμία εργασία', hwAdd:'Εργασία', hwTitlePh:'π.χ. Μαθηματικά σ.12', hwAllKids:'Όλα τα παιδιά', ttEmpty:'Καμία ώρα', ttAdd:'Προσθήκη ώρας', homeShiftRing:'Βάρδια', homeWeekSpark:'7 ημέρες ολοκληρωμένα', planDayLoad:'Φόρτος ημέρας', zoSavedLager:'Αποθηκεύτηκε στο ψυγείο', zoSavedListe:'Αποθηκεύτηκε στη λίστα', zoSavedPlan:'Αποθηκεύτηκε στο πρόγραμμα', zoSavedSchool:'Αποθηκεύτηκε στο σχολείο', zoSavedNote:'Η σημείωση αποθηκεύτηκε',
    logout:'Προφίλ', noUser:'Καμία σύνδεση',
    navChat:'Zo-Ai', topChat:'Zo-Ai', topHelp:'Zo-Ai', topTalk:'Ομάδα — συνομιλία', topTutorial:'Tutorial',
    topAdd:'＋ Εγγραφή', topIn:'＋ Εισ', topOut:'− Έξ', topBoard:'Κίνηση', topFood:'＋ Είδος',
    topShop:'Λίστα', topScan:'Σάρωση', topHistory:'Ιστορικό', topShift:'Βάρδια', topFix:'Διόρθωση',
    topDay:'Ημέρα', topWeek:'Εβδομάδα', topEvents:'Events', topBoth:'Και τα δύο',
    headerHome:'Armonia · Αρχική',     headerScheduleDay:'Πρόγραμμα · Ημέρα', headerScheduleWeek:'Πρόγραμμα · Εβδομάδα',
    headerScheduleCalendar:'Πρόγραμμα · Ημερολόγιο',
    headerScheduleEvents:'Πρόγραμμα · Events', headerStock:'Αποθήκη', headerStockAll:'Αποθήκη · όλα',
    headerShop:'Ψώνια', headerBook:'Βιβλίο & βάρδια', headerGallery:'Μεγάλες στιγμές', headerTalk:'Συνομιλία ομάδας', headerKids:'Παιδιά & Σχολείο',
    galleryTitle:'Μεγάλες στιγμές', galleryHint:'Φωτογραφίες ωραίων στιγμών — για παιδιά και ομάδα',
    galleryEmpty:'Καμία στιγμή ακόμα. Γίνε ο πρώτος!', galleryShare:'Μοιράσου στιγμή',
    galleryDriveOn:'Οι φωτογραφίες αποθηκεύονται στο Google Drive', galleryDriveOff:'Οι φωτογραφίες αποθηκεύονται στον διακομιστή',
    galleryNewPost:'Νέα', galleryTapLike:'Διπλό πάτημα για like',
    galleryCaption:'Τι έγινε;', galleryCaptionPh:'π.χ. παραλία, γενέθλια, νίκη στο ποδόσφαιρο…',
    galleryPick:'Επιλογή φωτό', galleryCamera:'Κάμερα', galleryPost:'Δημοσίευση',
    galleryPosted:'Η στιγμή δημοσιεύτηκε!', galleryDelete:'Διαγραφή', galleryLike:'Like',
    galleryLoading:'Φόρτωση στιγμών…', galleryFail:'Η συλλογή δεν είναι διαθέσιμη',
    galleryNeedPhoto:'Πρόσθεσε μια φωτογραφία', galleryTooBig:'Η φωτό είναι μεγάλη — δοκίμασε ξανά',
    galleryJustNow:'μόλις τώρα', galleryMinutes:n=>`πριν ${n} λεπ.`, galleryHours:n=>`πριν ${n} ώρ.`, galleryDays:n=>`πριν ${n} ημ.`,
    galleryByKid:'Παιδί', galleryByStaff:'Ομάδα', galleryChildTab:'Στιγμές',
    galleryComment:'Σχόλιο', galleryCommentPh:'Γράψε κάτι ωραίο…', galleryCommentSend:'Αποστολή',
    galleryComments:n=>n===1?'1 σχόλιο':`${n} σχόλια`,
    galleryCaptionAi:'AI λεζάντα', galleryCaptionAiLoading:'Το AI γράφει…', galleryCaptionAiFail:'Αποτυχία λεζάντας',
    galleryReactStar:'Αστέρι', galleryReactClap:'Χειροκρότημα',
    gallerySafeHint:'Ασφαλείς στιγμές — το AI ελέγχει για μη φιλικό περιεχόμενο',
    galleryBlocked:'Αυτό δεν επιτρέπεται — μείνε φιλικός/ή',
    galleryFlagged:'Σημειώθηκε για έλεγχο', galleryReport:'Αναφορά', galleryReportOk:'Αναφέρθηκε — η ομάδα ελέγχει',
    gallerySafetyFail:'Έλεγχος ασφαλείας απέτυχε — δοκίμασε αργότερα',
    shiftDiary:'Βιβλίο βάρδιας', shiftDiaryHint:'Αυτό το βιβλίο πρέπει να τηρείται. Κάθε βάρδια γράφει τη σελίδα της — μόνο με το προφίλ σου.',
    shiftDiaryPh:'Τι έγινε στη βάρδια; Παράδοση, αποθήκη, παιδιά, κάτι ιδιαίτερο…',
    shiftDiarySave:'Γράψε στο βιβλίο', shiftDiarySaved:'Η σελίδα αποθηκεύτηκε στο βιβλίο',
    shiftDiaryEmpty:'Καμία σελίδα σε αυτή την περίοδο.', shiftDiaryTeam:'Προηγούμενες σελίδες',
    shiftDiaryMine:'Σημερινή σελίδα', typeSHIFT:'Βάρδια',
    journalMustWrite:'Η σημερινή σελίδα είναι ανοιχτή — πρέπει να γραφτεί',
    journalPageDone:'Η σημερινή σελίδα έχει γραφτεί',
    journalContinue:'Συνέχισε να γράφεις (προστίθεται)',
    journalRewrite:'Ξαναγράψε τη σελίδα',
    journalRewriteSave:'Αντικατάσταση σελίδας',
    journalPages:n=>n===1?'1 σελίδα':`${n} σελίδες`,
    journalDutyHome:'Βιβλίο βάρδιας: η σημερινή σελίδα είναι κενή',
    journalDutyCta:'Γράψε τώρα',
    journalInkHint:'Οι νέες γραμμές μπαίνουν κάτω στη σημερινή σελίδα — σαν μελάνι στο βιβλίο.',
    journalEmptyPage:'Κενή σελίδα. Γράψε τι έγινε στη βάρδια.',
    journalSigned:'υπογραφή',
    journalBrowse:'Διάβασε σελίδες',
    typeSTOCKCHECK:'Έλεγχος αποθέματος',
    shiftStockCheck:'Έλεγχος αποθέματος βάρδιας',
    shiftStockCheckHint:'Όποιος ξεκινά τη βάρδια ελέγχει το απόθεμα στο Kalyvia. Πάτα ✓ ή «Όλα ναι».',
    shiftStockCheckStart:'Έναρξη ελέγχου',
    shiftStockCheckDone:'Ο έλεγχος ολοκληρώθηκε',
    shiftStockCheckAllYes:'Όλα ναι',
    shiftStockCheckSave:'Αποθήκευση ελέγχου',
    shiftStockCheckNeedAll:'Επιβεβαίωσε όλα με ✓ ή «Όλα ναι».',
    shiftStockCheckSaved:(n,name)=>`Έλεγχος · ${n} είδη · ${name}`,
    shiftStockCheckToday:(name,when)=>`Σήμερα έλεγξε ο/η ${name} · ${when}`,
    shiftStockCheckPending:'Δεν έγινε ακόμα έλεγχος σήμερα',
    shiftStockCheckQty:'Ποσότητα',
    shiftStockCheckOk:'OK',
    shiftStockCheckFixed:'Διορθώθηκε',
    shiftStockCheckProgress:(a,b)=>`${a}/${b} ελέγχθηκαν`,
    viewDay:'Ημέρα', viewWeek:'Εβδομάδα', filterView:'Προβολή', filterHouse:'Σπίτι',
    tableFullscreen:'Πλήρης οθόνη', tableExitFullscreen:'Κλείσιμο',
    allHouses:'Συνδυαστικά',
    morning:'Πρωινό πρόγραμμα', afternoon:'Απογευματινή φροντίδα', evening:'Βραδινό πρόγραμμα',
    add:'+ Εγγραφή', edit:'Εγγραφή', newEntry:'Νέα εγγραφή',
    house:'Σπίτι — πού', person:'Άτομο — ποιος', children:'Παιδιά — με ποια',
    activity:'Δραστηριότητα — τι', note:'Σημείωση', time:'Ώρα (προαιρετικό)',
    timePh:'π.χ. από 16:00', notePh:'π.χ. μάθημα μαγειρικής με Julian',
    unassigned:'ποιος;', open:'ανοιχτό', noPerson:'— κανείς ακόμα —',
    scopeToday:'Μόνο σήμερα', scopeTemplate:'Μόνιμα',
    scopeTodayHint:'Το μόνιμο εβδομαδιαίο πρότυπο δεν αλλάζει.',
    scopeTemplateHint:day=>`Αλλάζει το πρότυπο για κάθε ${day}.`,
    saveWithPin:'Αποθήκευση', cancelToday:'Ακύρωση εγγραφής για σήμερα',
    removeFromTable:'Αφαίρεση από το πρόγραμμα', removedFromPlan:'Αφαιρέθηκε από το πρόγραμμα',
    cancelled:'ακυρώθηκε', override:'έκτακτο',
    adminActions:'Ενέργειες', adminShiftToday:'Βάρδια σήμερα', adminOpenDay:'Ημερήσιο',
    adminOpenWeek:'Εβδομαδιαίο', adminOpenStock:'Αποθήκη', adminOpenShop:'Ψώνια',
    adminContact:'Επικοινωνία / Email', adminAssignToday:'Ανάθεση σήμερα',
    adminShiftsWeek:'Βάρδιες εβδομάδας', adminMarkDone:'Ολοκληρώθηκε', adminRemoveAssign:'Ακύρωση εργασίας',
    noEntries:'Καμία εγγραφή',
    weekNotes:'Σημειώσεις εβδομάδας', besprechung:'Σύσκεψη: Δευτέρα 13:30',
    hintAfternoon:'Σημειώσεις / ιδιαιτερότητες για το απόγευμα',
    projects:'Προγραμματισμένα projects εβδομάδας',
    materials:'Υλικά που χρειάζονται / ψώνια',
    remarks:'Ειδικές σημειώσεις / αλλαγές',
    toShoppingList:'→ Στη λίστα αγορών',
    createdBy:'Συμπληρώθηκε από', saveNotes:'Αποθήκευση σημειώσεων',
    stockIn:'➕ Είσοδος', stockOut:'➖ Έξοδος',
    stockTitle:'Απόθεμα', lastMoves:'Τελευταίες κινήσεις',
    inventoryDashboard:'Εικόνα αποθέματος', inventoryHint:'Δες πρώτα τι χρειάζεται προσοχή – άνοιξε ολόκληρο τον κατάλογο μόνο όταν τον χρειάζεσαι.',
    inventoryHealth:'Ασφάλεια αποθέματος', inventoryHealthyPct:n=>`${n}% των προϊόντων έχουν επαρκές απόθεμα`,
    tapProduct:'Επεξεργασία προϊόντος', productDetail:'Επεξεργασία προϊόντος', addToShopping:'Προσθήκη στη λίστα αγορών',
    wantBought:'Θέλω να αγοραστεί', wantBoughtDone:'Ήδη ζητήθηκε',
    wantBoughtToast:'Προστέθηκε στα ψώνια Παρασκευής',
    startListTitle:'Ξεκίνα νέα λίστα αγορών',
    startListHint:'Διάλεξε Παρασκευή και σπίτι πάνω. Γράψε το πρώτο προϊόν — ή εισήγαγε κείμενο/screenshot.',
    startListAdd:'Προσθήκη πρώτου προϊόντος',
    startListFromStock:'Προσωπικό: στο απόθεμα πάτα «Θέλω να αγοραστεί».',
    pickOneHouse:'Διάλεξε πρώτα ένα σπίτι.',
    productEditHint:'Άλλαξε όνομα, μονάδα, κατηγορία και απόθεμα',
    productNameDe:'Όνομα (DE)', productNameEl:'Όνομα (EL)',
    productAliases:'Ψευδώνυμα (κόμμα)', productAliasesHint:'π.χ. milch, γάλα',
    productStockQty:'Απόθεμα ανά σπίτι',
    productSave:'Αποθήκευση αλλαγών', productSaved:'Το προϊόν αποθηκεύτηκε',
    productDelete:'Διαγραφή προϊόντος', productDeleted:'Το προϊόν διαγράφηκε',
    productDeleteConfirm:'Να διαγραφεί αυτό το προϊόν;',
    productNameRequired:'Γράψε ένα όνομα',
    productQuickActions:'Γρήγορες ενέργειες',
    addedToShopping:'Προστέθηκε στη λίστα αγορών', alreadyPlanned:'Υπάρχει ήδη στη λίστα αγορών',
    stockSearch:'Αναζήτηση προϊόντος…', stockAttention:'Προσοχή', stockAll:'Όλα', stockEmpty:'Άδεια',
    stockTilesOn:'Πλακίδια', stockTilesOff:'Λίστα',
    stockHealthy:'Επαρκές', stockLow:'Λίγο', stockOutState:'Άδειο', productTypes:'Προϊόντα',
    noStockResults:'Δεν βρέθηκαν προϊόντα.', openShopping:'Στη λίστα αγορών', missingFromShop:n=>`${n} ${n===1?'έλλειψη':'ελλείψεις'} από τα ψώνια`,
    inTitle:'Είσοδος αποθήκης', outTitle:'Έξοδος αποθήκης',
    product:'Προϊόν', qty:'Ποσότητα',
    photoLabel:'Φωτογραφία — προαιρετική, μόνο ζωντανή λήψη',
    takePhoto:'📷 Λήψη φωτογραφίας', photoTaken:'Η φωτογραφία τραβήχτηκε τώρα, μέσα στην εφαρμογή.',
    noCam:'Η κάμερα δεν είναι διαθέσιμη', needPhoto:'Η φωτογραφία είναι προαιρετική',
    photoOptional:'Φωτογραφία προαιρετική',
    skipPhoto:'Καταγραφή χωρίς φωτογραφία',
    stockHoldHint:'Κράτα πατημένο για επιλογές · Σύρε σε Είσοδο/Έξοδο κάτω',
    stockHoldIn:'＋ Είσοδος',
    stockHoldOut:'− Έξοδος',
    stockHoldShop:'Θέλω να αγοραστεί',
    stockHoldDetail:'Επεξεργασία',
    stockHoldClear:'Αφαίρεση από επιλογή',
    stockAddFood:'＋ Τρόφιμο',
    stockAddCat:'＋ Κατηγορία',
    stockAddFoodTitle:'Νέο τρόφιμο',
    stockAddCatTitle:'Νέα κατηγορία',
    stockFoodName:'Όνομα',
    stockFoodUnit:'Μονάδα',
    stockFoodCat:'Κατηγορία',
    stockCatName:'Όνομα κατηγορίας',
    stockAdded:n=>`Προστέθηκε: ${n}`,
    stockCatAdded:n=>`Κατηγορία «${n}» δημιουργήθηκε`,
    stockDragDock:'Σύρε προϊόντα εδώ — μένει πάντα ορατό',
    stockEmptyCat:'Ακόμα άδεια — πάτα «＋ Τρόφιμο»',
    bookWith:'Καταχώρηση', needQty:'Βάλε ποσότητα',
    shopTitle:'Λίστα αγορών', addProduct:'+ Προϊόν', emptyList:'Η λίστα είναι άδεια',
    byWhom:'από', scanReceipt:'🧾 Σάρωση απόδειξης (Παρασκευή)',
    scanTitle:'Σάρωση απόδειξης', shootReceipt:'📷 Φωτογράφισε την απόδειξη',
    reading:'Ανάγνωση απόδειξης…', found:n=>`Βρέθηκαν ${n} προϊόντα.`,
    result:'Αποτέλεσμα', notOnList:'εκτός λίστας',
    bookBatch:'Καταχώρηση παρτίδας', batchDone:'Η παρτίδα καταχωρήθηκε',
    newProduct:'Νέο προϊόν', name:'Όνομα', unit:'Μονάδα', addBtn:'Προσθήκη',
    allStaff:'Όλο το προσωπικό', all:'Όλα',
    history:'Ιστορικό', appendOnly:'append-only', noLog:'Καμία εγγραφή ακόμη',
    stamp:'Σφραγίδα', correction:'✍️ Διορθωτική εγγραφή',
    correctionTitle:'Διορθωτική εγγραφή',
    correctionHint:'Δεν σβήνει τίποτα — προστίθεται νέα εγγραφή που εξηγεί τη διόρθωση.',
    correctionPh:'π.χ. η έξοδος 2kg κοτόπουλο ήταν 1kg',
    correctionWhat:'Τι διορθώνεις', saved:'Αποθηκεύτηκε',
    logNoDelete:'Οι εγγραφές δεν διαγράφονται και δεν τροποποιούνται. Κάθε διόρθωση είναι νέα εγγραφή.',
    typeIN:'Είσοδος', typeOUT:'Έξοδος', typeSHOP:'Ψώνια', typeSCHEDULE:'Πρόγραμμα',
    typeCORRECTION:'Διόρθωση', typeLOGIN:'Σύνδεση', typeNOTES:'Σημειώσεις', typeEVENT:'Event',
    entryStaff:'Προσωπικό', entryChild:'Παιδιά',
    entryStaffSub:'Πρόγραμμα, αποθήκη, ψώνια, καταγραφές', entryChildSub:'Τι κάνω αυτή την εβδομάδα',
    whoAreYou:'Ποιος είσαι;',
    myWeek:'Η εβδομάδα μου', myToday:'Τι κάνω σήμερα', weekEvents:'Events της εβδομάδας',
    withWhom:'με', nothingToday:'Σήμερα δεν έχει καταχωρηθεί κάτι',
    childBye:'Αποσύνδεση', announcements:'Ανακοινώσεις',
    gateTitle:'Armonia Thassos', gateBrandLine:'Μαζί, κάθε μέρα', gatePick:'Διάλεξε το προφίλ σου', gatePin:'Βάλε το PIN σου',
    gateBack:'← Άλλο προφίλ', wrongPin:'Λάθος PIN',
    forgotPin:'Ξέχασες ή θέλεις να αλλάξεις PIN;', resetPinTitle:'Αλλαγή PIN μέσω email', emailLabel:'Η διεύθυνση email σου',
    sendResetLink:'Αποστολή συνδέσμου αλλαγής', resetLinkSent:'Αν το email ανήκει σε αυτό το προφίλ, στάλθηκε σύνδεσμος.',
    newPin:'Νέο PIN (4–6 ψηφία)', confirmPin:'Επιβεβαίωση νέου PIN', changePin:'Αλλαγή PIN',
    pinChanged:'Το PIN άλλαξε. Συνδέσου ξανά.', invalidReset:'Ο σύνδεσμος δεν ισχύει ή έληξε.',
    authUnavailable:'Η σύνδεση δεν είναι διαθέσιμη αυτή τη στιγμή.', tooManyPins:'Πολλές προσπάθειες.',
    lockedFor:n=>`Η σύνδεση κλειδώθηκε. Δοκίμασε ξανά σε ${n} λεπτά.`,
    attemptsRemaining:n=>`Λάθος PIN. Απομένουν ${n} προσπάθειες.`,
    useBiometrics:'Σύνδεση με κλείδωμα συσκευής', passkey:'Passkey', passkeySetup:'Ρύθμιση Face ID / Touch ID',
    passkeyHint:'iPhone: Face ID · Android: δακτυλικό · Mac: Touch ID · Windows: Hello. Τα βιομετρικά μένουν στη συσκευή — αποθηκεύεται μόνο δημόσιο κλειδί.',
    passkeyAdded:'Το Face ID / Touch ID ρυθμίστηκε.', passkeyRemoved:'Η βιομετρική είσοδος αφαιρέθηκε.', removePasskeys:'Αφαίρεση βιομετρικών',
    passkeyNone:'Δεν έχει ρυθμιστεί ακόμη. Μπες με PIN και πάτα παρακάτω «ρύθμιση».',
    passkeySetupNeeded:'Πρώτα σύνδεση με PIN, μετά Face ID / Touch ID από το Προφίλ.',
    passkeyConfig:'Το Passkey server δεν είναι ρυθμισμένο (Origin/RP ID). Έλεγξε PAIDIA_WEBAUTHN_ORIGIN στο Vercel.',
    emailNotFound:'Το email προφίλ δεν βρέθηκε. Αποθήκευσε πρώτα στοιχεία επικοινωνίας ή έλεγξε αν είσαι συνδεδεμένος.',
    profileCustomize:'Προσαρμογή προφίλ', profileNickname:'Εμφανιζόμενο όνομα', profileColor:'Χρώμα', profileEmoji:'Emoji',
    profileSaved:'Το προφίλ αποθηκεύτηκε', passkeyCount:n=>n===1?'1 συσκευή ρυθμισμένη':`${n} συσκευές ρυθμισμένες`,
    passkeyUnavailable:'Αυτή η συσκευή δεν υποστηρίζει βιομετρική είσοδο (χρειάζεται HTTPS και Face ID / δακτυλικό / Windows Hello).',
    passkeyCancelled:'Ακυρώθηκε — δεν άλλαξε τίποτα.',
    profilePinTitle:'Αλλαγή PIN', profilePinHint:'Το νέο PIN ισχύει σε όλες τις συσκευές. 4–6 ψηφία.',
    profilePinCurrent:'Τρέχον PIN', profilePinNew:'Νέο PIN', profilePinConfirm:'Επιβεβαίωση νέου PIN',
    profilePinSave:'Αποθήκευση PIN', profilePinChanged:'Το PIN άλλαξε',
    profilePinWrong:'Το τρέχον PIN είναι λάθος', profilePinSame:'Το νέο PIN πρέπει να διαφέρει',
    profilePinInvalid:'Το PIN πρέπει να έχει 4–6 ψηφία και να ταιριάζει',
    profileSectionLook:'Εμφάνιση', profileSectionContact:'Επικοινωνία', profileSectionPin:'PIN',
    profileSectionBio:'Face ID / Touch ID',
    bioSetupHint:'Ρύθμισε Face ID / δακτυλικό — πιο γρήγορα από PIN και μένει στη συσκευή.',
    bioSetupNow:'Ρύθμιση τώρα',
    bioSetupLater:'Αργότερα',
    notifHintChild:'Events και στιγμές ως ειδοποίηση — σαν κανονική εφαρμογή. Μόνο ωραία πράγματα.',
    notifEnableChild:'Ειδοποιήσεις για events',
    childInstallTitle:'Εφαρμογή στο κινητό',
    childInstallHint:'Έτσι μένει το Armonia σαν app στην αρχική οθόνη.',
    childInstallIos:'iPhone: Κοινή χρήση → «Στην οθόνη Αφετηρίας» → Προσθήκη',
    childInstallAndroid:'Android: Μενού ⋮ → «Εγκατάσταση εφαρμογής» ή «Στην αρχική οθόνη»',
    childHowTo:'Πώς δουλεύει',
    childHowToHint:'Σήμερα · Events · Εβδομάδα · Στιγμές · Παιχνίδια · Zo-Ai',
    childHowToToday:'Σήμερα: η μέρα σου',
    childHowToEvents:'Events: γιορτές και εκδρομές',
    childHowToWeek:'Εβδομάδα: επισκόπηση',
    childHowToGallery:'Στιγμές: ωραίες φωτογραφίες',
    childHowToGames:'Παιχνίδια: μάθηση και διασκέδαση',
    childHowToZoai:'Zo-Ai: κάνε ερωτήσεις (δεν αλλάζει τίποτα μόνο του)',
    childNotifEvent:title=>`Event · ${title}`,
    adminBroadcastPreview:'Έτσι φαίνεται το email',
    adminBroadcastLang:'Γλώσσα email',
    adminNotifyPanel:'Ειδοποίηση / Email',
    adminNotifyPanelHint:'Email σε προφίλ με διεύθυνση. Audience παιδιά = μόνο παιδικά emails.',
    adminBroadcastAlsoBanner:'Και ως banner στην εφαρμογή (online)',
    adminBroadcastBannerDismiss:'Το κατάλαβα',
    webauthnOriginWarn:'Έλεγξε Passkey origin (PAIDIA_WEBAUTHN_ORIGIN) — αλλιώς αποτυγχάνει το Face ID στο iPhone.',
    profileStorageOk:'Η βάση είναι ενεργή — πρόγραμμα, αποθήκη, λίστες και προφίλ επιβιώνουν τα deploys.',
    profileStorageWarn:'Χωρίς Postgres — τα δεδομένα μπορεί να χαθούν μετά από deploy. Στο Vercel βάλε DATABASE_URL.',
    durableStorageBadge:'Αποθήκευση server',
    securityAccess:'Σύνδεση & ασφάλεια', signOut:'Αποσύνδεση', pinFallback:'Ή χρησιμοποίησε PIN', thisDevice:'Αυτή η συσκευή',
    profileDetails:'Στοιχεία προφίλ', manageProfiles:'Διαχείριση προφίλ', recoveryEmail:'Email ανάκτησης PIN',
    recoveryEmailHint:'Σε αυτή τη διεύθυνση στέλνονται σύνδεσμοι PIN και σημαντικές ειδοποιήσεις ασφαλείας.',
    saveEmail:'Αποθήκευση email', emailSaved:'Το email αποθηκεύτηκε.', emailInvalid:'Βάλε έγκυρη διεύθυνση email.',
    phoneLabel:'Τηλέφωνο', phoneHint:'Κινητό για σύντομη επικοινωνία στην ομάδα.',
    phoneInvalid:'Βάλε έγκυρο τηλέφωνο (τουλάχιστον 8 ψηφία).',
    phoneSaved:'Το τηλέφωνο αποθηκεύτηκε.',
    contactTitle:'Στοιχεία επικοινωνίας', contactKicker:'Πρώτη είσοδος',
    contactIntro:'Βάλε email και τηλέφωνο — μία φορά, για επαναφορά PIN και επικοινωνία ομάδας.',
    contactSave:'Αποθήκευση & συνέχεια', contactRequired:'Το email και το τηλέφωνο είναι υποχρεωτικά.',
    saveContact:'Αποθήκευση στοιχείων', contactSaved:'Τα στοιχεία αποθηκεύτηκαν.',
    emailProvider:'Αποστολή email', emailReady:'έτοιμη', emailNotReady:'Το email δεν έχει ρυθμιστεί ακόμη',
    emailReadyHint:'Σύνδεσμοι PIN, δοκιμές, events και μηνύματα ομάδας μπορούν να σταλούν.',
    emailOfflineHint:'Στον server λείπουν SMTP ή Resend. Χωρίς αποστολή δεν υπάρχει σύνδεσμος PIN.',
    sendTestEmail:'Αποστολή δοκιμαστικού email', testEmailSent:'Το δοκιμαστικό email στάλθηκε — έλεγξε εισερχόμενα & ανεπιθύμητα.', testEmailFailed:'Το δοκιμαστικό email δεν στάλθηκε.',
    testEmailAuthFailed:'Η είσοδος στο mail απορρίφθηκε. Έλεγξε κωδικό SMTP ή Resend API key.',
    testEmailSenderFailed:'Μη έγκυρος αποστολέας. SMTP_FROM / RESEND_FROM πρέπει να είναι πραγματικό email.',
    testEmailRecipientRestricted:'Ο παραλήπτης απορρίφθηκε (π.χ. Resend test mode μόνο στο email του λογαριασμού).',
    testEmailRateLimited:'Στάλθηκαν πολλά email. Περίμενε λίγο και δοκίμασε ξανά.', testEmailNetwork:'Ο mail server δεν είναι προσβάσιμος. Στο Vercel βάλε Resend· τοπικά έλεγξε SMTP.',
    emailSaveFirst:'Αποθήκευσε πρώτα το email και μετά στείλε δοκιμή.',
    emailPreviewTitle:'Έτσι φαίνεται το email',
    emailPreviewBody:'PIN reset και ειδοποιήσεις ασφαλείας στο design της Armonia.',
    contactCardTitle:'Επικοινωνία & ανάκτηση',
    switchProfile:'Άνοιγμα άλλου προφίλ', profilesBack:'Προφίλ',
    adminsManageEmails:'Ως admin μπορείς να διαχειριστείς το email κάθε προφίλ.',
    resetUnavailable:'Η αλλαγή PIN με email δεν είναι διαθέσιμη τώρα. Ρώτα τον admin.',
    resetNeedProfileEmail:'Χρησιμοποίησε το email που είναι αποθηκευμένο σε αυτό το προφίλ. Αν λείπει, αποθήκευσέ το μετά τη σύνδεση στο Προφίλ.',
    resetBackPin:'← Πίσω στο PIN',
    gateTrace:'Κάθε κίνηση καταγράφεται με όνομα, ώρα, συσκευή και IP.',
    device:'Συσκευή', welcome:n=>'Καλώς ήρθες, '+n,
    tutorialRequired:'Tutorial σύνδεσης · υποχρεωτικό', tutorialStep:(n,total)=>`Βήμα ${n} από ${total}`,
    tutorialNext:'Επόμενο', tutorialBack:'Πίσω', tutorialFinish:'Ολοκλήρωση ξενάγησης',
    tutorialSaving:'Η πρόοδος αποθηκεύεται με ασφάλεια…', tutorialDone:'Η ξενάγηση ολοκληρώθηκε. Καλώς ήρθες!',
    tutorialSaveError:'Η ξενάγηση δεν αποθηκεύτηκε. Έλεγξε τη σύνδεση και δοκίμασε ξανά.',
    tutorialTip:'Πρέπει να δεις όλα τα βήματα. Η ξενάγηση δεν παραλείπεται και δεν κλείνει.',
    tutorialOpen:'Άνοιγμα tutorial εφαρμογής', tutorialReplay:'Tutorial λειτουργιών', tutorialClose:'Τέλος tutorial',
    tutorialReplayTip:'Μπορείς να ανοίξεις ξανά αυτό το tutorial οποιαδήποτε στιγμή από το ? ή το Προφίλ.',
    helpCenter:'Βοήθεια & Zo-Ai', helpCenterHint:'Tutorial, συνομιλία ομάδας και Zo-Ai. Η Zo-Ai μπορεί με επιβεβαίωση να αλλάξει αποθήκη, λίστα και πρόγραμμα.',
    startTutorial:'Καθοδηγούμενο tutorial εφαρμογής', startTutorialHint:'Όλες οι λειτουργίες για το προφίλ σου – επαναλαμβάνεται από το ?.',
    askAiHelp:'Ρώτα τη Zo-Ai', askAiHelpHint:'Αποθήκη, λίστα, πρόγραμμα — με απλά λόγια',
    staffTalk:'Ομάδα — συνομιλία', staffTalkHint:'Chat με μικρόφωνο, θέματα σύσκεψης και κοινό βιντεοκλήση.',
    staffTalkTitle:'Συνομιλία ομάδας', staffTalkIntro:'Γράψτε ή μιλήστε με μικρόφωνο. Τα θέματα μένουν για τη σύσκεψη. Το βίντεο είναι κοινό δωμάτιο Jitsi.',
    staffTalkEmpty:'Δεν υπάρχουν ακόμη μηνύματα. Γράψτε το πρώτο.',
    staffTalkPlaceholder:'Μήνυμα στην ομάδα…',
    staffTalkSend:'Αποστολή',
    staffTalkTopics:'Να συζητήσουμε',
    staffTalkTopicsHint:'Θέματα για σήμερα / τη σύσκεψη. Τσεκάρετε όταν τελειώσετε.',
    staffTalkTopicPh:'π.χ. handover Limenaria, ψώνια Παρασκευής…',
    staffTalkAddTopic:'Αποθήκευση θέματος',
    staffTalkClearDone:'Απόκρυψη ολοκληρωμένων',
    staffTalkSuggest:'Προτάσεις από σήμερα',
    staffTalkVideo:'Βιντεο / ήχος κλήση',
    staffTalkVideoHint:'Ανοίγει το κοινό δωμάτιο Jitsi (κάμερα & μικρόφωνο). Όλη η ομάδα χρησιμοποιεί τον ίδιο σύνδεσμο.',
    staffTalkVideoOpen:'Άνοιγμα δωματίου',
    staffTalkNeedStaff:'Μόνο για προσωπικό.',
    staffTalkLoadError:'Η συνομιλία δεν φορτώθηκε.',
    staffTalkOpen:'Άνοιγμα συνομιλίας ομάδας',
    staffTalkOpenTopics:n=>`${n} ανοιχτά θέματα σύσκεψης`,
    pickChild:'Διάλεξε τουλάχιστον ένα παιδί', pickActivity:'Διάλεξε δραστηριότητα',
    loginEntry:'Είσοδος στην εφαρμογή',
    notesSaved:'Οι σημειώσεις αποθηκεύτηκαν', materialsMoved:n=>`${n} είδη πέρασαν στη λίστα αγορών`,
    weekOf:'Περίοδος',
    stOpen:'Ανοιχτό', stPending:'Περιμένει επιβεβαίωση', stBought:'Αγοράστηκε', stMissing:'Λείπει',
    secOpen:'Στη λίστα', secPending:'Παρτίδα Παρασκευής — περιμένει επιβεβαίωση',
    secBought:'Αγοράστηκαν & μπήκαν', secMissing:'Ελλείψεις — δεν αγοράστηκαν',
    startFriday:'🧾 Έναρξη ψωνιών Παρασκευής', inSupermarket:'Στο σουπερμάρκετ, τσέκαρε:',
    tapDoes:'Το πάτημα καταχωρεί ως:', dragToZone:'Πάτα το + ή το − για αλλαγή φοράς',
    switchDir:'Αλλαγή φοράς',
    stockBoard:'Κίνηση αποθέματος', dropHere:'Πάτα ή σύρε σε μία ζώνη',
    itemsPicked:'επιλεγμένα', pickSomething:'Πάτα προϊόντα ή σύρ’ τα στο πλαίσιο πάνω',
    bookN:n=>`Καταχώρηση ${n} ${n===1?'είδους':'ειδών'}`,
    stockDraftSave:'Αποθήκευση αλλαγών',
    stockDraftClear:'Ακύρωση',
    stockDraftNeedReason:'Για έξοδο διάλεξε λόγο.',
    stockDraftSummary:(n,ins,outs)=>`${n} · +${ins} / −${outs}`,
    stockDraftPending:'Δεν αποθηκεύτηκε ακόμη',
    homeMore:'Περισσότερα σήμερα',
    homeSignals:'Σύντομη εικόνα',
    stockHeroHint:'Έλεγχος αποθέματος και κίνηση',
    shopHeroHint:'Λίστα Παρασκευής · προετοιμασία · επιβεβαίωση στο μαγαζί',
    adminAutomations:'Αυτοματισμοί',
    adminAutomationsHint:'Τοπικές ειδοποιήσεις (ενώ η app είναι ανοιχτή). Email μέσω Broadcast.',
    autoShiftStart:'Ειδοποίηση έναρξης βάρδιας',
    autoLowStock:'Χαμηλό απόθεμα',
    autoPresenceLate:'Υπενθύμιση καθυστέρησης',
    autoBroadcastBanner:'Broadcast ως banner',
    autoFridayShop:'Υπενθύμιση ψωνίων Παρασκευής',
    autoSaved:'Οι αυτοματισμοί αποθηκεύτηκαν',
    reason:'Λόγος', newReason:'Νέος λόγος', reasonNamePh:'π.χ. δωρεά, επισκευή ή κουζίνα ομάδας',
    saveReason:'Προσθήκη λόγου', reasonRequired:'Γράψε πρώτα ένα όνομα για τον λόγο.',
    reasonExists:'Αυτός ο λόγος υπάρχει ήδη και επιλέχθηκε.', reasonAdded:n=>`Το «${n}» αποθηκεύτηκε και επιλέχθηκε.`, reasonRemoved:'Ο προσαρμοσμένος λόγος αφαιρέθηκε.',
    storeMode:'Στο σουπερμάρκετ', other:'Άλλα',
    storeFocus:'Λειτουργία αγορών', storeFocusHint:'Αποφάσισε καθαρά για κάθε είδος. Τίποτα δεν σημειώνεται αυτόματα ως έλλειψη.',
    storeSearch:'Αναζήτηση…', storeRemaining:'Ακόμα ανοιχτά', storeComplete:'Ολοκληρώθηκε',
    markBought:'Αγοράστηκε', markMissing:'Λείπει', markUnavailable:'Δεν υπάρχει', markExpensive:'Ακριβό',
    undoDecision:'Επαναφορά',
    missReasonUnavailable:'Μη διαθέσιμο', missReasonExpensive:'Ακριβό',
    decideAll:'Αποφάσισε πρώτα για όλα τα είδη.', shoppingProgress:'Πρόοδος αγορών',
    storeShowDone:'Εμφάνιση ολοκληρωμένων', storeHideDone:'Απόκρυψη ολοκληρωμένων',
    storeLeft:n=>`${n} ανοιχτά`, storeTapHint:'✓ αγορά · ∅ δεν υπάρχει · € ακριβό',
    listPlanned:'Σχεδιασμένη λίστα', listShopping:'Στα ψώνια', listFinished:'Ολοκληρώθηκε',
    tapToTick:'Πάτα: αγοράστηκε → δεν υπάρχει → ακριβό → ανοιχτό',
    gotIt:'✓ αγοράστηκε', notThere:'✕ δεν υπήρχε',
    confirmBatch:'Επιβεβαίωση παρτίδας', batchHint:'Όλα τα είδη καταχωρούνται μαζί.',
    carryOver:'↩︎ Πίσω στη λίστα', nothingPending:'Καμία ανοιχτή παρτίδα',
    whereIsWhat:'Τι είναι πού', inFridge:'Στην αποθήκη', lastPurchase:'Τελευταία αγορά',
    bothHouses:'Όλα τα σπίτια', shortage:'Έλλειψη',
    boughtNotOnList:'αγοράστηκε, δεν ήταν στη λίστα',
    batchBooked:n=>`${n} είδη καταχωρήθηκαν`, nothingToStart:'Η λίστα είναι άδεια',
    shoppingHistory:'Ιστορικό αγορών', shoppingHistoryHint:'Κάθε ολοκληρωμένη αγορά – με όσα αγοράστηκαν και όσα δεν αγοράστηκαν.',
    noShoppingHistory:'Δεν υπάρχει ολοκληρωμένη αγορά ακόμη', noShoppingHistoryHint:'Μετά την επιβεβαίωση στο σουπερμάρκετ, η αγορά εμφανίζεται αυτόματα εδώ.',
    boughtItems:'Αγοράστηκαν', notBoughtItems:'Δεν αγοράστηκαν', completedBy:'Ολοκληρώθηκε από', completedOn:'Ολοκληρώθηκε',
    cartQuickAdd:'Γρήγορη προσθήκη προϊόντος…', addToCart:'Προσθήκη', cartReady:n=>`${n} ${n===1?'προϊόν':'προϊόντα'} – έναρξη αγορών`,
    removeListTitle:'Αφαίρεση από τη λίστα',
    removeListHint:'Γιατί αφαιρείται αυτό το είδος;',
    removeListConfirm:'Αφαίρεση',
    removeListNeedReason:'Διάλεξε λόγο.',
    removeListReasonPh:'π.χ. το φέρνει παιδί, δωρεά…',
    listItemRemoved:'Το είδος αφαιρέθηκε από τη λίστα.',
    bookedToHouse:n=>`Αγοράστηκαν και καταχωρήθηκαν στο ${n}`, backToCart:'Πίσω στο καλάθι', externalHome:'Άλλο σπίτι', customProducts:'Άλλα προϊόντα',
    chooseShoppingHouse:'1. Επίλεξε σπίτι', shoppingHouseHint:'Και Julian groß, Valeria, Lea — μόνο για ψώνια/απόθεμα, όχι στο πρόγραμμα.',
    fullBlock:'Όλο το μπλοκ', fromTime:'από', timeFrom:'Από', timeTo:'Έως',
    importTitle:'Εισαγωγή λίστας', fromText:'Κείμενο', fromPhoto:'Φωτογραφία', fromScreenshot:'Screenshot',
    listJourneyTitle:'Ψώνια Παρασκευής', listJourneyHint:'Μία πλήρης λίστα ανά σπίτι και πραγματική ημερομηνία Παρασκευής.',
    addToFriday:'Προσθήκη λίστας', chooseFriday:'Επιλογή Παρασκευής', previousFriday:'Προηγούμενη Παρασκευή', nextFriday:'Επόμενη Παρασκευή',
    fridayLabel:'Παρασκευή', listItems:'Είδη', completedItems:'Ολοκληρωμένα', openItems:'Ανοιχτά',
    importStep:'Καταχώρηση νέας λίστας', importStepHint:'Κείμενο και screenshot είναι πάντα διαθέσιμα – ακόμη κι αν υπάρχει ήδη λίστα.',
    sourceTextTitle:'Επικόλληση κειμένου', sourceTextHint:'Μία γραμμή ανά προϊόν ή επικόλλησε ολόκληρο μήνυμα.',
    sourceImageTitle:'Screenshot / φωτογραφία', sourceImageHint:'Ανέβασε, επικόλλησε ή φωτογράφισε απευθείας.',
    imagePreview:'Μικρή προεπισκόπηση', changeImage:'Άλλη εικόνα', removeImage:'Αφαίρεση', imagePreviewHint:'Το πρωτότυπο χρησιμοποιείται μόνο για OCR και παραμένει εδώ μικρό.',
    analyzeText:'Ανάλυση κειμένου', uploadImage:'Επιλογή εικόνας', existingFriday:'Ήδη σε αυτή την Παρασκευή',
    saveBehavior:'Πώς να αποθηκευτεί;', mergeSmart:'Έξυπνη συγχώνευση', mergeSmartHint:'Τα ίδια προϊόντα προστίθενται μαζί.',
    appendSeparate:'Ως νέες γραμμές', appendSeparateHint:'Οι υπάρχουσες εγγραφές μένουν ως έχουν.',
    replaceFriday:'Αντικατάσταση Παρασκευής', replaceFridayHint:'Αντικαθιστά τα ανοιχτά είδη αυτής της Παρασκευής.',
    importDestination:'Προορισμός', importSource:'Πηγή', importReview:'Προεπισκόπηση & διόρθωση',
    importedToFriday:d=>`Η λίστα για την Παρασκευή ${d} αποθηκεύτηκε`, noFridayItems:'Δεν υπάρχει ακόμη λίστα για αυτή την Παρασκευή.',
    noFridayItemsHint:'Γράψε πάνω ένα προϊόν, ή εισήγαγε κείμενο/screenshot. Μπορείς να συμπληρώνεις ανά πάσα στιγμή.',
    fridayActive:'Τα ψώνια τρέχουν', fridayPlanned:'Προγραμματισμένη', fridayCompleted:'Ολοκληρωμένη',
    shopPlan:'Σχεδιασμός', shopTake:'Παίρνω', shopTakeHint:'Συμπαγής λίστα ανά διάδρομο — τι παίρνω',
    shopTakeEmptyHint:'Πρόσθεσε προϊόντα στον Σχεδιασμό ή χρησιμοποίησε Αυτόματα από αποθήκη.',
    shopAutoFill:'Αυτόματα από αποθήκη', shopAutoFilled:n=>`${n} προϊόντα προστέθηκαν`,
    selectMode:'Επιλογή', selectDone:'Έτοιμο', selectedCount:n=>`${n} επιλεγμένα`,
    bulkRemove:'Διαγραφή', bulkQtyMinus:'Ποσ. −', bulkQtyPlus:'Ποσ. ＋', bulkToList:'→ Λίστα',
    bulkOut:'OUT', bulkClearEmpty:'Άδειασμα', bulkFound:'Βρέθηκε', bulkMissing:'Λείπει', bulkUndo:'Αναίρεση',
    bulkRemoved:n=>`${n} διαγράφηκαν`, bulkListed:n=>`${n} → λίστα`, bulkDecided:n=>`${n} σημειώθηκαν`,
    homeSignalList:'Λίστα', homeSignalStock:'Αποθήκη', homeCompactTitle:'Σήμερα · συμπαγές',
    stockQuickList:'Όλα τα λίγα → λίστα', stockQuickListShort:'Λίγα',
    stockAddedLow:n=>`${n} στη λίστα`,
    viewCalendar:'Ημερολόγιο', calPrev:'‹', calNext:'›',
    exportCalendar:'Εξαγωγή ημερολογίου (.ics)', upcomingEvents:'Επόμενα events',
    pasteList:'Επικόλλησε ή γράψε τη λίστα',
    pastePh:'Γάλα 2, Ψωμί 4, Ντομάτες 3 kg, Νεκταρίνια 10–12',
    readIt:'🪄 Ανάγνωση', shootList:'📷 Φωτογράφισε τη λίστα',
    checkBeforeSave:'Έλεγξε και διόρθωσε', importN:n=>`Καταχώρηση ${n} ειδών`,
    alreadyOnList:'υπάρχει ήδη στη λίστα', qtyGuessed:'η ποσότητα είναι εκτίμηση',
    nothingToImport:'Δεν αναγνωρίστηκε τίποτα',
    importList:'🪄 Εισαγωγή λίστας',
    aiReading:'Το AI διαβάζει και οργανώνει τη λίστα…', aiUnavailable:'Το AI δεν είναι διαθέσιμο. Το κείμενο αναλύθηκε τοπικά.',
    aiNeedsServer:'Η ανάγνωση φωτογραφίας με AI δεν έχει ρυθμιστεί. Εκκίνησε με server.py και GROQ_API_KEY.',
    chooseImage:'Επιλογή εικόνας / screenshot', useCamera:'Χρήση κάμερας', extractedText:'Κείμενο που αναγνωρίστηκε',
    confHigh:'Υψηλή βεβαιότητα', confMedium:'Χρειάζεται έλεγχο', confLow:'Ασαφές', stockNow:'Απόθεμα',
    aiDraft:'Πρόχειρο AI — έλεγξέ το', imageReady:'Η εικόνα είναι έτοιμη', itemName:'Όνομα προϊόντος',
    vTitle:'Έλεγχος', vNone:'Δεν βρέθηκαν συγκρούσεις',
    vHint:'Οι προειδοποιήσεις δεν μπλοκάρουν — η υπεύθυνη μπορεί να αποκλίνει συνειδητά.',
    vTwoHouses:'ταυτόχρονα σε δύο σπίτια', vChildTwice:'σε δύο ομάδες ταυτόχρονα',
    vOff:'έχει ρεπό βάσει βαρδιών', vOutside:'εκτός ωραρίου βάρδιας',
    vDuplicate:'Διπλή εγγραφή', vKids:n=>`${n} παιδιά σε έναν φροντιστή`,
    viewShift:'Βάρδιες', shiftPlan:'Πρόγραμμα βαρδιών', off:'Ρεπό', h24:'24ω', handover:'Παράδοση',
    tenMinRule:'Κανόνας 10 λεπτών: άφιξη τουλάχιστον 10 λεπτά πριν την έναρξη. Αν η παράδοση δεν ολοκληρωθεί, η προηγούμενη βάρδια παραμένει σε υπηρεσία.',
    newActivity:'Νέα δραστηριότητα', activityName:'Όνομα δραστηριότητας',
    adminOnly:'Το μόνιμο πρότυπο το αλλάζουν μόνο η Zoi, ο Angelos και ο Dimitris.',
    whoDidWhat:'Ποιος έκανε τι', today:'Σήμερα', last7:'Τελευταίες 7 ημέρες', last30:'30 ημέρες', bookAll:'Όλα',
    bookHeroTitle:'Τι έγινε', bookHeroHint:'Φίλτρα και μία καθαρή προβολή — όχι όλα μαζί.',
    bookJournalHero:'Βιβλίο βάρδιας', bookJournalHint:'Ένα βιβλίο που πρέπει να γράφεται. Σήμερα μία σελίδα.',
    bookPaneLog:'Ιστορικό', bookPanePeople:'Άτομα', bookPaneShift:'Βιβλίο βάρδιας',
    bookSearchPh:'Αναζήτηση σε κείμενο, όνομα, τύπο…', bookClearFilters:'Καθαρισμός φίλτρων',
    bookViewTimeline:'Χρονολόγιο', bookViewByDay:'Ανά ημέρα', bookViewCompact:'Συμπαγές',
    bookShowTech:'Εμφάνιση IP & συσκευής', bookHideTech:'Απόκρυψη τεχνικών',
    bookResults:n=>n===1?'1 εγγραφή':`${n} εγγραφές`, bookNoMatch:'Τίποτα για αυτά τα φίλτρα',
    bookRangeLabel:'Περίοδος', bookTypeLabel:'Είδος', bookWhoLabel:'Άτομο', bookViewLabel:'Προβολή',
    actions:n=>n===1?'κίνηση':'κινήσεις', noActionsToday:'Καμία κίνηση σήμερα',
    visibleToAll:'Ορατό σε όλους',
    close:'Κλείσιμο', menuFilters:'Φίλτρα', menuDone:'Έτοιμο',
    childToday:'Σήμερα', childEvents:'Events', childWeek:'Εβδομάδα', childGames:'Παιχνίδια', childRewards:'Βραβεία',
    kidNavStart:'Αρχή', kidNavPlan:'Πρόγραμμα', kidNavLearn:'Μάθηση', kidNavStars:'Αστέρια', kidNavGames:'Παιχνίδια',
    storageOffline:'Δεν αποθηκεύτηκε μόνιμα — η βάση είναι εκτός. Ενημέρωσε τον διαχειριστή.',
    kidNavRate:'Αξιολόγηση', kidRateTitle:'Αξιολογήσεις', kidRateKicker:'Πώς πήγε η εβδομάδα;',
    kidRateLead:'Πάτα τα αστέρια. Το βλέπεις μόνο εσύ και η φροντίστριά σου.',
    kidRateSchool:'Σχολείο', kidRateHome:'Σπίτι', kidRateFriends:'Φίλοι', kidRateMood:'Πώς νιώθω',
    kidRateWeeks:'Τελευταίες 4 εβδομάδες', kidRateSaved:'Η αξιολόγηση αποθηκεύτηκε',
    kidRateEmpty:'Δεν έχεις αξιολογήσει ακόμα αυτή την εβδομάδα.',
    kidBonusTitle:'Μπόνους', kidBonusKicker:'Έξτρα κερδισμένα',
    kidBonusEarned:n=>`+${n} αστέρια μπόνους`, kidBonusHow:'Πώς κερδίζεις μπόνους',
    kidBonusStreak:n=>`${n} μέρες στη σειρά χωρίς χαμένη αποστολή.`,
    kidBonusAllWeek:'Όλες οι αποστολές της εβδομάδας', kidBonusRead:'5 μέρες στη σειρά διάβασμα',
    kidBonusHelp:'Βοήθησες κάποιον', kidBonusTidy:'Τακτοποιημένο δωμάτιο 7 μέρες',
    kidNotesTitle:'Σημειώσεις', kidNotesKicker:'Μόνο για σένα',
    kidNotesAsk:'Πώς ήταν η μέρα σου;', kidNotesPlaceholder:'Γράψε ό,τι δεν θες να ξεχάσεις…',
    kidNotesSave:'Αποθήκευση', kidNotesSaved:'Η σημείωση αποθηκεύτηκε',
    kidMoodGood:'Καλά', kidMoodOk:'Έτσι κι έτσι', kidMoodHard:'Δύσκολα',
    kidNotesEmpty:'Καμία σημείωση ακόμα. Γράψε την πρώτη.',
    kidHello:n=>`Γεια, ${n}`, kidLevelCard:n=>`Επίπεδο ${n}`, kidXpOf:(a,b)=>`${a} / ${b} αστέρια`,
    kidXpRemain:n=>`Ακόμα ${n} για το επόμενο επίπεδο`, kidTodayLessons:'Σήμερα',
    kidLessonsDone:(d,t)=>`${d} από ${t} έτοιμα`, kidNextUp:'Στη συνέχεια',
    kidNextMeta:(m,xp)=>`${m} λεπτά · +${xp} αστέρια`, kidCourseLearn:'Μάθηση', kidCourseTasks:'Αποστολές',
    kidCourseStars:'Αστέρια', kidCourseGames:'Παιχνίδια',
    kidLearnOpen:n=>n===1?'1 κουίζ ανοιχτό':`${n} κουίζ ανοιχτά`,
    kidTasksDue:n=>n===1?'1 σήμερα':`${n} σήμερα`,
    kidStarsCollected:n=>`${n} μαζεμένα`, kidGamesPlay:'Παίξε',
    kidPlanTitle:'Ωρολόγιο', kidAufgabenTitle:'Αποστολές', kidSterneTitle:'Αστέρια',
    kidLearnHubTitle:'Μάθηση', kidLearnHubHint:'Κάρτες, κουίζ και μαθηματικά — μάζεψε αστέρια.',
    kidStreak:'Σερί 7 ημερών', kidWeekDeltaLabel:'αυτή την εβδομάδα', kidBadges:'Εμβλήματα',
    kidBadgeLocked:'Κλειδωμένο', kidRedeem:'Εξαργύρωση', kidSubjectDaily:'Καθημερινά',
    kidDueToday:'Σήμερα', kidOverdue:'Εκπρόθεσμο',
    rewardsTitle:'Αποστολές & Βραβεία', rewardsHero:'Η πρόοδός σου',
    choresDue:'Αποστολές σήμερα', choresDone:'Ολοκληρωμένες', choresAll:'Όλες οι αποστολές',
    choreSubmitProof:'Υποβολή αποστολής', chorePhotoHint:'Τράβηξε φωτογραφία ή γράψε τι έκανες',
    choreProofLabel:'Γράψε την απόδειξη…', choreProofPh:'π.χ. «Τακτοποίησα το δωμάτιό μου και έστρωσα το κρεβάτι»',
    choreAiChecking:'Το AI ελέγχει…', choreAiApproved:'Μπράβο! Αποστολή επιβεβαιώθηκε ✓',
    choreAiRejected:'Όχι ακριβώς — δοκίμασε ξανά!', choreAiError:'Δεν ήταν δυνατός ο έλεγχος. Περίμενε τον φροντιστή.',
    choreSubmit:'Υποβολή', choreDone:'Ολοκληρώθηκε ✓', chorePending:'Σε έλεγχο…',
    choreXpEarned:n=>`+${n} ⭐ κερδίθηκαν!`, choreAlreadyDone:'Ήδη ολοκληρώθηκε σήμερα',
    xpLevel:n=>`Επίπεδο ${n}`, xpNextLevel:'για το επόμενο επίπεδο', xpTotal:n=>`${n} XP σύνολο`,
    leaderboard:'Κατάταξη', leaderboardMe:'(εσύ)',
    levelNames:['Αρχάριος','Εξερευνητής','Ήρωας','Πρωταθλητής','Θρύλος'],
    adminRewards:'Κέντρο αποστολών', adminPendingReview:'Αναμένει έλεγχο',
    adminApprove:'Έγκριση', adminReject:'Απόρριψη', adminNoReviews:'Καμία εκκρεμής υποβολή',
    adminAddChore:'Προσθήκη αποστολής', adminChoreTitle:'Τίτλος', adminChoreXp:'Πόντοι XP',
    adminChoreSaved:'Αποστολή αποθηκεύτηκε', adminChosenKids:'Για ποιον;',
    gamesTitle:'Παιχνίδια', gamesHint:'Μεγαλύτερες γύρες · ~3–5 λεπτά · Ελληνικά, γνώση, μαθηματικά',
    gamesPlayTime:'~3–5 λεπτά',
    gameMemory:'Μνήμη', gameMemoryHint:'Βρες τα ζευγάρια · όσο λιγότερες κινήσεις',
    gameTac:'XO', gameTacHint:'Κάνε 3 στη σειρά κόντρα στον PC',
    gameCatch:'Ψάρεμα', gameCatchHint:'60 δευτ · κομπο & power-ups!',
    gameReact:'Αντίδραση', gameReactHint:'Πάτα όταν γίνει ΠΡΑΣΙΝΟ',
    gameRps:'Πέτρα Ψαλίδι Χαρτί', gameRpsHint:'Παίξε κόντρα στον υπολογιστή',
    gameDice:'Ζάρι', gameDiceHint:'Ρίξε · ποιος είναι σειρά;',
    gameSimon:'Simon', gameSimonHint:'Θυμήσου τα χρώματα · πάτα τη σειρά',
    gameColors:'Χρώματα', gameColorsHint:'Πάτα το σωστό χρώμα · γρήγορα!',
    gameLearn:'Μάθε Ελληνικά', gameLearnHint:'20 κάρτες · θέματα · AI · σαν Duolingo',
    gameQuiz:'Γνώση', gameQuizHint:'14 ερωτήσεις · φύση, Ελλάδα, spa',
    gameMath:'Μαθηματικά', gameMathHint:'Επίπεδα · ζωές · γρήγορα!',
    gameIsland:'Μονοπάτι νησιού', gameIslandHint:'3D μονοπάτι · Θάσος & φύση · ~4 λεπτά',
    gameEduHub:'Παιχνίδια μάθησης', gameEduHubHint:'Δωρεάν εκπαιδευτικά (PhET) · ασφαλές',
    gameIslandHintPlay:'Απάντησε και ανέβα στο 3D μονοπάτι',
    gameIslandStep:'Σταθμός', gameIslandDone:'Εξερεύνησες το νησί!',
    eduOpen:'Άνοιγμα', eduClose:'Κλείσιμο', eduSandbox:'Ασφαλής λειτουργία · μόνο μάθηση',
    eduArith:'Αριθμητική (PhET)', eduFrac:'Κλάσματα (PhET)', eduColor:'Χρώματα (PhET)',
    eduExternalFail:'Αποτυχία φόρτωσης παιχνιδιού',
    gameShareMoment:'Μοιράσου στις Στιγμές', gameShareMomentHint:'Γιόρτασε τη νίκη στη συλλογή',
    gameLearnTopicAll:'Όλα', gameLearnTopicGreet:'Χαιρετισμοί', gameLearnTopicFood:'Φαγητό',
    gameLearnTopicBeach:'Παραλία', gameLearnTopicNature:'Φύση', gameLearnTopicThassos:'Θάσος',
    gameLearnWeak:'Επανάληψη',
    gameLearnHintLabel:'Υπόδειξη', gameMathLives:'Ζωές', gameMathLevel:'Επίπεδο',
    gameBack:'Όλα τα παιχνίδια', gamePlay:'Παίξε', gameAgain:'Ξανά',
    gameMoves:'Κινήσεις', gamePairs:'Ζευγάρια', gameScore:'Πόντοι', gameTime:'Χρόνος',
    gameBest:'Ρεκόρ', gameCombo:'Κομπο', gameStreak:'Σειρά', gameLevel:'Επίπεδο',
    gameWin:'Μπράβο!', gameLose:'Κρίμα — ξανά;', gameDraw:'Ισοπαλία',
    gameYourTurn:'Η σειρά σου', gameCpuTurn:'Σκέφτεται ο υπολογιστής…', gameYou:'Εσύ', gameCpu:'PC',
    gameCatchOver:'Τέλος χρόνου!', gameCatchHintPlay:'Πάτα τα ψάρια πριν φύγουν',
    gameMemoryHintPlay:'Βρες δύο ίδιες κάρτες',
    gameTacHintPlay:'Εσύ = ❌ · Υπολογιστής = ⭕',
    gameStars:(n)=>n===3?'★★★':n===2?'★★☆':'★☆☆',
    gameReactWait:'Περίμενε…', gameReactGo:'ΤΩΡΑ!', gameReactEarly:'Πολύ νωρίς!', gameReactMs:ms=>`${ms} ms`,
    gameReactHintPlay:'Περίμενε το πράσινο και πάτα όσο πιο γρήγορα μπορείς',
    gameRpsRock:'Πέτρα', gameRpsPaper:'Χαρτί', gameRpsScissors:'Ψαλίδι',
    gameRpsHintPlay:'Διάλεξε πέτρα, χαρτί ή ψαλίδι',
    gameDiceRoll:'Ρίξε', gameDiceHintPlay:'Πάτα Ρίξε — για παιχνίδια ή ποιος παίζει',
    gameDiceYou:'Ρίχνεις', gameDiceResult:'Αποτέλεσμα',
    gameSimonWatch:'Κοίτα…', gameSimonGo:'Η σειρά σου!', gameSimonFail:'Ωχ — λάθος',
    gameSimonHintPlay:'Θυμήσου τη φωτεινή σειρά και πάτα την',
    gameColorsTap:'Πάτα:', gameColorsHintPlay:'Ποιο χρώμα λέει; Πάτα γρήγορα',
    gameColorRed:'Κόκκινο', gameColorGreen:'Πράσινο', gameColorBlue:'Μπλε', gameColorYellow:'Κίτρινο',
    gameFishCatch:'Πάτα το ψάρι',
    gameLearnHintPlay:'Διάλεξε τη σωστή μετάφραση',
    gameLearnDeToEl:'DE → EL', gameLearnElToDe:'EL → DE',
    gameLearnAi:'AI τυχαία', gameLearnAiLoading:'Το AI φορτώνει…', gameLearnAiFail:'AI μη διαθέσιμο — τοπικές κάρτες',
    gameLearnCorrect:'Σωστά!', gameLearnWrong:'Όχι ακριβώς —', gameLearnHearts:'Ζωές',
    gameLearnRound:'Γύρος', gameLearnDone:'Μάθημα ολοκληρώθηκε!', gameLearnXp:'XP',
    gameXpEarned:n=>`+${n} ⭐ μπόνους!`, gameStreak:n=>`${n} μέρες σερί`,
    gameQuizHintPlay:'Πάτα τη σωστή απάντηση', gameQuizTopic:'Θέμα',
    gameMathHintPlay:'Υπολόγισε γρήγορα και πάτα τον σωστό αριθμό',
    gameMathPlus:'Πρόσθεση', gameMathMinus:'Αφαίρεση', gameMathTimes:'Πολλαπλασιασμός',
    eventOfWeek:'Event της εβδομάδας', eventToday:'Σήμερα', eventTomorrow:'Αύριο', upcomingEvents:'Επόμενα events',
    bring:'Να φέρεις', accompaniedBy:'Συνοδός', noEvents:'Δεν υπάρχουν επόμενα events', published:'Δημοσιευμένο',
    helpChat:'Zo-Ai', helpWelcome:'Γεια! Είμαι η Zo-Ai. Ρώτα με για την εφαρμογή — ή πες π.χ. «πρόσθεσε 2 γάλατα στο Kalyvia». Οι αλλαγές χρειάζονται επιβεβαίωση.',
    helpWelcomeChild:'Γεια! Είμαι η Zo-Ai. Σε βοηθάω με τη μέρα σου, τα events και τα παιχνίδια. Ρώτα π.χ. «Τι έχω σήμερα;» ή «Πώς παίζω Μνήμη;»',
    helpWelcomeStaff:'Γεια! Είμαι η Zo-Ai, ο βοηθός σου. Σε βοηθάω με πρόγραμμα, events, αποθήκη και λίστα. Πες π.χ. «2 γάλα στο Kalyvia» ή «βάλε αύριο απόγευμα ποδόσφαιρο για τη Μαρία». Μετά επιβεβαίωσε.',
    helpWelcomeAdmin:'Γεια! Είμαι η Zo-Ai. Έχεις δικαιώματα admin. Σε βοηθάω με λειτουργία, Κέντρο διαχείρισης, μόνιμο πρόγραμμα και απόθεμα. Πες π.χ. «2 γάλα Kalyvia» ή «βάλε μόνιμα Τρίτη πρωί κολύμπι».',
    helpRoleChild:'Παιδί', helpRoleStaff:'Φροντιστής', helpRoleAdmin:'Admin',
    helpQuickChild:'Γρήγορες ερωτήσεις', helpQuickAdmin:'Γρήγορα: ψυγείο / admin',
    helpChildHint:'Βλέπεις μόνο τα δικά σου και τα παιχνίδια. Αλλαγές φαγητού ή προγράμματος τις κάνει ο φροντιστής.',
    helpAdminHint:'Ως admin μπορείς να προτείνεις μόνιμο πρόγραμμα και βάρδιες. Κάθε αλλαγή χρειάζεται επιβεβαίωση και PIN.',
    helpMutateHint:'Πες στη Zo-Ai π.χ.: «γάλα +2 Kalyvia», «ρύζι στη λίστα» ή «βάλε αύριο απόγευμα ποδόσφαιρο για τον Άγγελο». Μετά έλεγξε και αποθήκευσε.',
    zoAiReady:'Η Zo-Ai είναι έτοιμη — ρώτα όποτε χρειάζεσαι βοήθεια.',
    zoAiReadyChild:'Η Zo-Ai είναι εδώ — ρώτα π.χ. τι έχεις σήμερα.',
    zoAiBannerTitle:'Zo-Ai · ο βοηθός σου',
    zoAiBannerTitleChild:'Zo-Ai · βοήθεια για σένα',
    zoAiBannerHint:'Μίλα απλά. Η Zo-Ai προτείνει αλλαγές σε αποθήκη, λίστα και πρόγραμμα — εσύ επιβεβαιώνεις.',
    zoAiBannerHintChild:'Ρώτα τη Zo-Ai για τη μέρα σου, events ή παιχνίδια. Δεν αλλάζει τίποτα χωρίς ενήλικα.',
    zoAiBannerOpen:'Άνοιγμα Zo-Ai',
    zoAiBannerDismiss:'Αργότερα',
    helpVoice:'Φωνητική εισαγωγή', helpVoiceListening:'Ακούω… πάτα ξανά για stop',
    helpVoiceUnsupported:'Η φωνητική εισαγωγή δεν υποστηρίζεται σε αυτή τη συσκευή.',
    helpVoiceError:'Η φωνητική εισαγωγή απέτυχε. Γράψε την ερώτηση.',
    helpVoiceReady:'Αναγνωρίστηκε ομιλία — έλεγξε και στείλε.',
    helpVoiceDenied:'Δεν δόθηκε πρόσβαση στο μικρόφωνο. Επίτρεψέ το στις ρυθμίσεις.',
    helpVoiceSecure:'Η φωνή χρειάζεται HTTPS ή localhost.',
    helpVoiceStart:'Προετοιμασία μικροφώνου…',
    helpQuickFood:'Γρήγορα: ψυγείο / λίστα',
    helpConfirmInline:'Αποθήκευση τώρα',
    helpDiscardInline:'Απόρριψη',
    helpProposeTitle:'Προτάσεις Zo-Ai', helpProposeHint:'Δεν αποθηκεύτηκαν ακόμη. Έλεγξε τη λίστα και επιβεβαίωσε.',
    helpProposeConfirm:'Αποθήκευση αλλαγών', helpProposeCancel:'Απόρριψη',
    helpProposeDone:n=>`${n} ${n===1?'αλλαγή':'αλλαγές'} αποθηκεύτηκαν`,
    helpProposeDenied:'Μόνο συνδεδεμένοι φροντιστές μπορούν να αποθηκεύσουν αλλαγές.',
    helpProposeEmpty:'Δεν αναγνωρίστηκαν έγκυρες αλλαγές.',
    helpProposeNeedPin:'Για αλλαγές προγράμματος χρειάζεται PIN.',
    helpActionStock:(dir,qty,unit,name,house)=>`${dir==='IN'?'+':'−'} ${qty} ${unit} ${name} @ ${house}`,
    helpActionStockSet:(qty,unit,name,house)=>`= ${qty} ${unit} ${name} @ ${house}`,
    helpActionWantBought:(name,house)=>`🛒 ${name} → Λίστα @ ${house}`,
    helpActionShiftNote:text=>`📝 Βάρδια: ${String(text||'').slice(0,80)}`,
    helpActionOpenTab:tab=>`↗ ${tab}`,
    helpActionShopAdd:(qty,unit,name,house)=>`🛒 + ${qty} ${unit} ${name} → λίστα ${house}`,
    notifEnable:'Ενεργοποίηση ειδοποιήσεων',
    notifEnabled:'Ειδοποιήσεις ενεργές',
    notifDenied:'Ειδοποιήσεις μπλοκαρισμένες — επίτρεψέ τις στις ρυθμίσεις',
    notifHint:'Σαν πραγματική εφαρμογή: άδειο απόθεμα, έλεγχος βάρδιας, παρουσία, events.',
    notifLowStock:n=>`${n} προϊόντα χρειάζονται προσοχή`,
    notifShiftCheck:'Έλεγχος αποθέματος βάρδιας ανοιχτός (Kalyvia)',
    notifShiftStart:t=>`Η βάρδια ξεκινά · ${t}`,
    notifShiftLate:t=>`Η βάρδια ξεκίνησε — δήλωσε παρουσία · ${t}`,
    notifTest:'Δοκιμαστική ειδοποίηση Armonia',
    notifQuietStart:'Ώρα ησυχίας από', notifQuietEnd:'Ώρα ησυχίας έως', notifLeadMinutes:'Προειδοποίηση (λεπτά)',
    notifUpcomingEvent:t=>`Event σύντομα · ${t}`, notifUpcomingTask:t=>`Εργασία σύντομα · ${t}`,
    notifFridayShop:n=>`Ψώνια Παρασκευής · ${n} ανοιχτά`,
    autoFridayShop:'Υπενθύμιση ψωνίων Παρασκευής',
    calTitle:'Το ημερολόγιό μου',
    calHint:'Με ένα πάτημα — βάρδιες και events σε Apple, Google, Outlook ή οποιοδήποτε ημερολόγιο.',
    calDownloadAll:'Όλα ως .ics (Apple & όλες οι εφαρμογές)',
    calDownloadShifts:'Μόνο βάρδιες (.ics)',
    calDownloadEvents:'Μόνο events (.ics)',
    calGoogleNext:'Επόμενη στο Google Calendar',
    calOutlookNext:'Επόμενη στο Outlook',
    calNextNone:'Δεν υπάρχουν επόμενες βάρδιες στις επόμενες εβδομάδες.',
    calSaved:'Το αρχείο ημερολογίου είναι έτοιμο — άνοιξέ το και πρόσθεσε',
    calWeeks:'Επόμενες 8 εβδομάδες',
    calAddAny:'Σε οποιοδήποτε ημερολόγιο',
    calAddAnyHint:'Apple Calendar, Samsung, Fantastical, Thunderbird: άνοιξε το .ics → «Προσθήκη όλων».',
    calAddWeb:'Γρήγορα online',
    calUpcoming:'Επόμενα',
    calAddThis:'Αυτό το συμβάν',
    calOneIcs:'.ics',
    calGoogle:'Google',
    calOutlook:'Outlook',
    calApple:'Apple / .ics',
    calReminder:'Υπενθύμιση 30 λεπτά πριν τη βάρδια (στο αρχείο)',
    calOpenPerson:(name)=>`Ημερολόγιο · ${name}`,
    calCount:n=>n===1?'1 συμβάν':`${n} συμβάντα`,
    presencePanelTitle:'Έναρξη βάρδιας',
    presencePanelReady:'Δήλωσε όταν είσαι εδώ.',
    presencePanelLateTitle:'Αργείς',
    presencePanelLateAsk:'Γιατί; Διάλεξε σύντομα — μετά «Είμαι εδώ».',
    presenceConfirmLate:'Δήλωσε καθυστέρηση & είμαι εδώ',
    presenceNotifActionThere:'Είμαι εδώ',
    presenceNotifActionLate:'Γιατί αργώ;',
    presenceNotifBodyReady:'Πάτα την ειδοποίηση → «Είμαι εδώ».',
    presenceNotifBodyLate:'Η βάρδια τρέχει ήδη — πες γιατί και δήλωσε παρουσία.',
    presenceTitle:'Παρουσία βάρδιας',
    presenceImThere:'Είμαι εδώ',
    presenceLateWhy:'Γιατί αργείς;',
    presenceLateHint:'Η βάρδια έχει ήδη ξεκινήσει. Πες σύντομα γιατί αργείς.',
    presenceReasonNeeded:'Χρειάζεται ένας λόγος.',
    presenceSaved:'Η παρουσία αποθηκεύτηκε',
    presenceLateSaved:'Η καθυστέρηση δηλώθηκε',
    presenceBannerReady:(from,to)=>`Βάρδια ${from}–${to} · Δήλωσε παρουσία`,
    presenceBannerLate:(from,mins)=>`Βάρδια από ${from} · ${mins} λεπτά αργότερα`,
    presenceBannerDone:(status,at)=>status==='late'?`Δηλώθηκε καθυστέρηση · ${at}`:`Εδώ · ${at}`,
    presenceOpen:'Δήλωση',
    presenceDone:'Δηλώθηκε',
    presenceReasonTraffic:'Κυκλοφορία',
    presenceReasonHealth:'Υγεία',
    presenceReasonHandover:'Παράδοση / συνεννόηση',
    presenceReasonOther:'Άλλο',
    presenceCustomReason:'Δικός σου λόγος',
    presenceOnTime:'Έγκαιρα',
    presenceLate:'Αργά',
    presenceNoShift:'Δεν υπάρχει ανοιχτή δήλωση βάρδιας τώρα.',
    homeShiftStart:'Η βάρδια ξεκινά',
    homeShiftStartLate:'Η βάρδια ξεκίνησε — αργείς',
    homeShiftStartOn:'Η βάρδια τρέχει',
    homeShiftStartHint:'Στην έναρξη: παρουσία, έλεγχος αποθέματος, μετά σελίδα στο βιβλίο.',
    homeShiftStepPresence:'Είμαι εδώ',
    homeShiftStepStock:'Έλεγχος αποθέματος Kalyvia',
    homeShiftStepJournal:'Γράψε στο βιβλίο βάρδιας',
    homeShiftStartDone:'Η έναρξη ολοκληρώθηκε',
    homeShiftOpen:'Δήλωσε τώρα',
    homeShiftStockGo:'Έναρξη ελέγχου',
    homeShiftJournalGo:'Άνοιξε σελίδα',
    homeShiftDoneMark:'Ολοκληρώθηκε',
    homeRailNotifs:'Ειδοποιήσεις',
    homeRailKids:'Παιδιά σήμερα',
    homeRailEnd:'Τέλος βάρδιας',
    homeRailEndHint:'Παράδοση · Κλείσιμο βιβλίου · Αποσύνδεση',
    homeShiftEndCta:'Τέλος βάρδιας',
    homeMomentsToday:'Στιγμές σήμερα',
    homeMomentsEmpty:'Δεν υπάρχουν φωτογραφίες σήμερα',
    notifCenterTitle:'Ειδοποιήσεις',
    notifCenterEmpty:'Ησυχία — κανένας ανοιχτός δείκτης.',
    notifCenterAll:'Όλα διαβασμένα',
    notifToneShift:'Βάρδια',
    notifToneStock:'Αποθήκη',
    notifTonePlan:'Πρόγραμμα',
    notifToneShop:'Λίστα',
    notifToneKids:'Παιδιά',
    notifToneZo:'Zo-Ai',
    shiftEndTitle:'Κλείσιμο παράδοσης',
    shiftEndHint:'Σημείωση βιβλίου · ανοιχτές εργασίες · αποσύνδεση',
    shiftEndBook:'Γράψε στο βιβλίο βάρδιας',
    shiftEndBookHint:'Υποχρεωτικό · 2–4 προτάσεις',
    shiftEndTasks:'Έλεγχος ανοιχτών εργασιών',
    shiftEndTasksHint:(n)=>n?`${n} ανοιχτά`:'Κανένα ανοιχτό',
    shiftEndHandover:'Ενημέρωση επόμενης βάρδιας',
    shiftEndHandoverHint:'προαιρετικό',
    shiftEndLogout:'Αποσύνδεση',
    shiftEndLogoutHint:'PIN / Passkey',
    shiftEndConfirm:'Τέλος βάρδιας',
    bellLabel:'Ειδοποιήσεις',
    helpActionShopRemove:(name,house)=>`🛒 αφαίρεση: ${name} @ ${house}`,
    helpActionScheduleAdd:(when,block,what,who)=>`📅 + ${when} · ${block}: ${what}${who?' · '+who:''}`,
    helpActionScheduleUpdate:(when,what)=>`📅 αλλαγή ${when}: ${what}`,
    helpActionScheduleCancel:(when,what)=>`📅 διαγραφή ${when}: ${what}`,
    helpActionScheduleTemplate:(day,block,what)=>`📅 Μόνιμα ${day} · ${block}: ${what}`,
    helpPlaceholder:'Ρώτα τη Zo-Ai…', helpSend:'Αποστολή',
    helpThinking:'Η Zo-Ai το ελέγχει…', helpUnavailable:'Η Zo-Ai δεν είναι διαθέσιμη αυτή τη στιγμή.',
    helpAuthExpired:'Η συνεδρία έληξε. Ξανασυνδέσου και ρώτα τη Zo-Ai ξανά.',
    helpConfigBanner:'Η Zo-Ai δεν είναι ρυθμισμένη. Στο Vercel → Environment Variables βάλε GROQ_API_KEY και κάνε νέο deploy.',
    askAiHelp:'Ρώτα τη Zo-Ai', askAiHelpHint:'Αποθήκη, λίστα, πρόγραμμα — με απλά λόγια',
    viewEvents:'Events', eventsPanel:'Events & ανακοινώσεις', newEvent:'Νέο event', editEvent:'Επεξεργασία event',
    eventTitle:'Τίτλος', eventDescription:'Περιγραφή', eventLocation:'Τοποθεσία', eventBring:'Τι να φέρουν',
    eventEmoji:'Σύμβολο', announceEvent:'Ανακοίνωση ως event', announceHint:'Δημοσιεύεται αμέσως στο Events tab των επιλεγμένων παιδιών.',
    publishEvent:'Δημοσίευση στα παιδιά', eventPublished:'Το event δημοσιεύτηκε', eventDraft:'Πρόχειρο',
    eventSaved:'Το event αποθηκεύτηκε', eventDeleted:'Το event διαγράφηκε', deleteEvent:'Διαγραφή event',
    eventRequired:'Χρειάζονται τίτλος, ημερομηνία, σωστή ώρα και τουλάχιστον ένα παιδί.',
    invalidTime:'Η ώρα λήξης πρέπει να είναι μετά την ώρα έναρξης.', noStaffEvents:'Δεν υπάρχουν events για αυτή την περίοδο.',
    homeHello:'Καλημέρα', homeOverview:'Η εικόνα της ημέρας σου', myTasks:'Οι εργασίες μου',
    overdueTasks:'Ξεχασμένα / εκπρόθεσμα', unassignedTasks:'Χωρίς υπεύθυνο', allEvents:'Όλα τα events',
    dueToday:'Για σήμερα', overdue:'Εκπρόθεσμα', eventsSoon:'Events', noTasks:'Δεν υπάρχουν ανοιχτές εργασίες.',
    noTasksHint:'Πάτα «Πρόγραμμα» για να ανοίξεις τη μέρα.',
    noOverdue:'Δεν ξέχασες τίποτα – όλα καλά.',
    noOverdueHint:'Εδώ φαίνονται ανοιχτές εργασίες των τελευταίων 7 ημερών.',
    noUnassigned:'Όλες οι εργασίες έχουν υπεύθυνο.',
    noUnassignedHint:'Εδώ φαίνονται αδιάθετες εργασίες των επόμενων ημερών.',
    noEventsHint:'Τα δημοσιευμένα events εμφανίζονται εδώ και στο πρόγραμμα.',
    homePrimaryCta:'Πρόγραμμα ημέρας',
    homeOpenPlan:'Στο πρόγραμμα',
    homeOpenEvents:'Στα events',
    planLaneEmpty:'Τίποτα ακόμη · Πάτα για προσθήκη',
    stockBoardShort:'Κίνηση',
    stockAddFoodShort:'Προϊόν',
    noStockHint:'Καθάρισε την αναζήτηση ή πρόσθεσε προϊόν.',
    stockClearSearch:'Καθαρισμός αναζήτησης',
    storeNoMatch:'Κανένα αποτέλεσμα στη λίστα',
    storeNoMatchHint:'Καθάρισε την αναζήτηση ή εμφάνισε ολοκληρωμένα.',
    storeClearSearch:'Καθαρισμός αναζήτησης',
    storeProgressHint:(done,total)=>`${done} από ${total} αποφασίστηκαν`,
    matrixEmpty:'Κενό · πάτα',
    galleryEmptyHint:'Μοιράσου την πρώτη στιγμή με φωτογραφία και σύντομο κείμενο.',
    galleryComposeCta:'Μοιράσου στιγμή',
    markDone:'Σήμανση ως ολοκληρωμένο', markOpen:'Άνοιγμα ξανά', taskDone:'Η εργασία ολοκληρώθηκε', taskReopened:'Η εργασία άνοιξε ξανά',
    next3Days:'Επόμενες 3 ημέρες',
    eventButton:'Event', eventButtonOn:'Το event θα δημοσιευτεί', childNotifications:'Νέες ανακοινώσεις event',
    openEvents:'Άνοιγμα events', kidsNotified:n=>`${n} παιδιά λαμβάνουν την ανακοίνωση στην εφαρμογή.`,
    eventCollection:n=>`${n} ${n===1?'event':'events'} προγραμματισμένα`,
    adminCenter:'Κέντρο διαχείρισης', adminOverview:'Ομάδα, εργασίες και αλλαγές με μία ματιά',
    adminWarnings:'Μόνο οι admins βλέπουν λειτουργικές προειδοποιήσεις', adminAllClear:'Δεν υπάρχουν προειδοποιήσεις προγράμματος',
    adminEditPlan:'Επεξεργασία εβδομάδας', adminEditShifts:'Επεξεργασία βαρδιών', adminManageEvents:'Διαχείριση events',
    adminOpenAudit:'Άνοιγμα καταγραφών', adminEmailEveryone:'Email σε όλους',
    adminBroadcastTitle:'Αποστολή μηνύματος ομάδας',
    adminBroadcastHint:'Στέλνει επώνυμο Armonia email σε όλα τα προφίλ με αποθηκευμένη διεύθυνση.',
    adminBroadcastAudience:'Παραλήπτες',
    adminBroadcastAll:'Όλοι με email',
    adminBroadcastStaff:'Μόνο ομάδα',
    adminBroadcastChildren:'Μόνο παιδιά',
    adminBroadcastSubject:'Θέμα',
    adminBroadcastHeadline:'Τίτλος στο email',
    adminBroadcastMessage:'Μήνυμα',
    adminBroadcastSend:'Αποστολή email',
    adminBroadcastRecipients:n=>`${n} παραλήπτες με email`,
    adminBroadcastNone:'Δεν βρέθηκαν προφίλ με email.',
    adminBroadcastNeedFields:'Χρειάζονται θέμα και μήνυμα.',
    adminBroadcastConfirm:n=>`Αποστολή email σε ${n} άτομα;`,
    adminBroadcastSent:(s,f)=>f?`Στάλθηκαν: ${s} · απέτυχαν: ${f}`:`Το email στάλθηκε σε ${s} άτομα.`,
    adminBroadcastFailed:'Το email δεν στάλθηκε.',
    adminBroadcastRate:s=>`Περίμενε ${s}δ πριν ξαναστείλεις.`,
    adminBroadcastOffline:'Η αποστολή email δεν έχει ρυθμιστεί (SMTP/Resend).',
    adminToday:'Σήμερα', adminNext7:'Επόμενες 7 ημέρες', adminDone:'Ολοκληρωμένα',
    adminLastAction:'Τελευταία δραστηριότητα', adminNoActivity:'Καμία δραστηριότητα ακόμη', adminDetails:'Στοιχεία ομάδας',
    adminFullControl:'Οι admins μπορούν να αλλάζουν πρόγραμμα, βάρδιες, events, σημειώσεις, απόθεμα και διορθώσεις καταγραφών.',
    editShiftDay:'Επεξεργασία βαρδιών', addShift:'Προσθήκη βάρδιας', shiftType:'Τύπος', deleteShift:'Αφαίρεση βάρδιας',
    shiftSaved:'Οι βάρδιες αποθηκεύτηκαν', adminRequired:'Αυτή η λειτουργία είναι διαθέσιμη μόνο στους admins.',
    whatsappSent:n=>`Η ανακοίνωση WhatsApp στάλθηκε σε ${n} ${n===1?'επαφή':'επαφές'}.`,
    whatsappSkipped:'Δημοσιεύτηκε στην εφαρμογή· δεν έχουν ακόμη ρυθμιστεί παραλήπτες WhatsApp.',
    whatsappFailed:'Το event δημοσιεύτηκε στην εφαρμογή, αλλά η αποστολή WhatsApp απέτυχε.',
    changesSaved:'Οι αλλαγές αποθηκεύτηκαν', retry:'Δοκίμασε ξανά.',
    errNetwork:'Δεν υπάρχει σύνδεση με το AI. Έλεγξε internet και server και δοκίμασε ξανά.',
    errTimeout:'Το AI άργησε να απαντήσει. Δοκίμασε ξανά.',
    errRate:'Το AI έχει προσωρινά μεγάλο φόρτο. Περίμενε λίγο και δοκίμασε ξανά.',
    errConfig:'Το AI δεν έχει ρυθμιστεί. Τοπικά: GROQ_API_KEY στο .env. Live: βάλε το ίδιο κλειδί στο Vercel → Environment Variables και κάνε νέο deploy.',
    errImage:'Η εικόνα δεν διαβάστηκε. Χρησιμοποίησε JPG, PNG ή WebP με καθαρό κείμενο.',
    errServer:'Η Zo-Ai δεν μπόρεσε να επεξεργαστεί το αίτημα. Δοκίμασε ξανά.',
    errFile:'Το αρχείο δεν άνοιξε. Διάλεξε άλλη εικόνα.',
    errStorage:'Η αποθήκευση απέτυχε. Ο χώρος της συσκευής μπορεί να είναι γεμάτος.',
    aiReady:'Το AI OCR είναι έτοιμο. Βάλε κείμενο ή ανέβασε screenshot.',
    cameraDenied:'Η πρόσβαση στην κάμερα απορρίφθηκε. Επίτρεψέ την από τις ρυθμίσεις του browser.',
    cameraBusy:'Η κάμερα χρησιμοποιείται ήδη από άλλη εφαρμογή.',
    cameraSecure:'Η κάμερα λειτουργεί μόνο με HTTPS ή localhost.',
    unexpectedError:'Κάτι πήγε στραβά. Τα στοιχεία σου παραμένουν· δοκίμασε ξανά.',
    kidsCount:n=>`${n} ${n===1?'παιδί':'παιδιά'}`,
    chooseMany:'Μπορείς να επιλέξεις πολλά', selectHouse:'Διάλεξε τουλάχιστον ένα σπίτι.',
    screenshotDrop:'Άφησε ή επίλεξε screenshot εδώ', screenshotPaste:'Ή αντέγραψε screenshot και πάτησε εδώ ⌘V / Ctrl+V',
    screenshotReady:'Το screenshot είναι έτοιμο – ξεκινά το OCR…', screenshotMissing:'Το πρόχειρο δεν περιέχει screenshot.',
    pasteScreenshot:'Επικόλληση screenshot', pickScreenshot:'Επιλογή screenshot / φωτο',
  },
};

const DAY_NAMES = {
  de: ['MO','DI','MI','DO','FR','SA','SO'],
  el: ['ΔΕΥ','ΤΡΙ','ΤΕΤ','ΠΕΜ','ΠΑΡ','ΣΑΒ','ΚΥΡ'],
};
const DAY_LONG = {
  de: ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'],
  el: ['Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο','Κυριακή'],
};

const t = k => {
  const v = T[state.lang][k];
  return v === undefined ? k : v;
};

/* ════════════════════════════════════════════════════════════════
   Δεδομένα αναφοράς και καθαρή τοπική λειτουργική κατάσταση.
   ════════════════════════════════════════════════════════════════ */

/** Τα τρία σταθερά μπλοκ του εντύπου. `by` = πώς οργανώνεται το πλέγμα. */
const BLOCKS = [
  {id:'morning',   from:'10:00', to:'14:00', by:'house'},
  {id:'afternoon', from:'15:00', to:'19:00', by:'person'},
  {id:'evening',   from:'19:00', to:'22:00', by:'house'},
];
const blockDef = id => BLOCKS.find(b=>b.id===id);

const SEED = {
  houses: [
    {id:'h1', name:'Kalyvia (Villa)', short:'Kalyvia'},
    {id:'h2', name:'Limenaria',       short:'Limenaria'},
    /* Μόνο για ψώνια/απόθεμα — δεν εμφανίζονται στο πρόγραμμα. */
    {id:'h3', name:'Julian groß',     short:'Julian groß', planning:false},
    {id:'h4', name:'Valeria',         short:'Valeria', planning:false},
    {id:'h5', name:'Lea',             short:'Lea', planning:false},
  ],
  /* admin: πλήρης έλεγχος — μόνο αυτοί αλλάζουν το μόνιμο εβδομαδιαίο πρότυπο.
     Zoi (υπεύθυνη) και οι γιοι της Angelos & Dimitris. */
  employees: [
    {id:'e1', name:'Dora',    role:{de:'Betreuerin', el:'Φροντίστρια'}, color:'#a7f3d0'},
    {id:'e2', name:'Karin',   role:{de:'Betreuerin', el:'Φροντίστρια'}, color:'#bfdbfe'},
    {id:'e3', name:'Dimitris',role:{de:'Betreuer',   el:'Φροντιστής'},  color:'#fde68a', admin:true},
    {id:'e4', name:'Angelos', role:{de:'Betreuer',   el:'Φροντιστής'},  color:'#fbcfe8', admin:true},
    {id:'e5', name:'Claudio', role:{de:'Betreuer',   el:'Φροντιστής'},  color:'#c7d2fe'},
    {id:'e6', name:'Löhri',   role:{de:'Betreuer',   el:'Φροντιστής'},  color:'#fed7aa'},
    {id:'e7', name:'Amalia',  role:{de:'Betreuerin', el:'Φροντίστρια'}, color:'#d9f99d'},
    {id:'e8', name:'Zoi',     role:{de:'Leitung',    el:'Υπεύθυνη'},    color:'#f5d0fe', admin:true},
  ],
  /* Παιδιά κατά §5.1. Κάθε παιδί έχει δικό του PIN, ανεξάρτητο από του προσωπικού (§31.3).
     Οι δίδυμες Samantha και Lilly είναι δύο ξεχωριστά records + saved group «Zwillinge». */
  /* Τα PIN και τα recovery emails μένουν μόνο στο server-side .env, ποτέ στον browser. */
  children: [
    {id:'k1',  name:'Simon',        color:'#bfdbfe'},
    {id:'k2',  name:'Kai',          color:'#a7f3d0'},
    {id:'k3',  name:'Vincent',      color:'#fde68a'},
    {id:'k4',  name:'Julian klein', color:'#fbcfe8'},
    {id:'k5',  name:'Julian groß',  color:'#c7d2fe', homeHouseId:'h3'},
    {id:'k6',  name:'Lea',          color:'#fed7aa', homeHouseId:'h5'},
    {id:'k7',  name:'Valeria',      color:'#d9f99d', homeHouseId:'h4'},
    {id:'k8',  name:'Jule',         color:'#f5d0fe'},
    {id:'k9',  name:'Samantha',     color:'#99f6e4'},
    {id:'k10', name:'Lilly',        color:'#99f6e4'},
    {id:'k11', name:'Zoitsa',       color:'#fecaca'},
    {id:'k12', name:'Leonie',       color:'#e9d5ff', temporary:true},
  ],
  /* Saved groups — μόνο όσες προκύπτουν από τα έγγραφα (§5.3, Nachmittagsbetreuung). */
  groups: [
    {id:'g1', de:'Zwillinge: Samantha + Lilly', el:'Δίδυμα: Samantha + Lilly', childIds:['k9','k10']},
    {id:'g2', de:'Kai + Simon + Vincent', el:'Kai + Simon + Vincent', childIds:['k2','k1','k3']},
    {id:'g3', de:'Jule + Julian klein',   el:'Jule + Julian klein',   childIds:['k8','k4']},
    {id:'g4', de:'Alle Kinder',      el:'Όλα τα παιδιά',
     childIds:['k1','k2','k3','k4','k5','k6','k7','k8','k9','k10','k11','k12']},
  ],
  /* Δραστηριότητες που προσθέτει το προσωπικό μέσα από την εφαρμογή */
  customActivities: [],

  events: [],
  taskCompletions: [],

  /* Reward & chore system — chores: staff-assignable tasks; choreSubmissions: kid proof queue */
  chores: [
    {id:'ch1', emoji:'🛏️', de:'Bett machen',         el:'Στρώσιμο κρεβατιού',   xp:10, kidIds:null, daily:true},
    {id:'ch2', emoji:'🧹', de:'Zimmer aufräumen',     el:'Τακτοποίηση δωματίου', xp:15, kidIds:null, daily:true},
    {id:'ch3', emoji:'🍽️', de:'Tisch abräumen',       el:'Μαζέψιμο τραπεζιού',  xp:10, kidIds:null, daily:true},
    {id:'ch4', emoji:'🦷', de:'Zähne putzen',         el:'Βούρτσισμα δοντιών',   xp:5,  kidIds:null, daily:true},
    {id:'ch5', emoji:'👟', de:'Schuhe wegräumen',     el:'Τακτοποίηση παπουτσιών',xp:5, kidIds:null, daily:true},
    {id:'ch6', emoji:'🌱', de:'Blumen gießen',        el:'Πότισμα λουλουδιών',   xp:10, kidIds:null, daily:false},
    {id:'ch7', emoji:'🐕', de:'Tiere füttern',        el:'Ταΐσμα ζώων',          xp:15, kidIds:null, daily:true},
    {id:'ch8', emoji:'📚', de:'Bücher aufräumen',     el:'Τακτοποίηση βιβλίων',  xp:10, kidIds:null, daily:false},
    {id:'ch9', emoji:'🛁', de:'Baden / Duschen',      el:'Μπάνιο / Ντους',       xp:5,  kidIds:null, daily:true},
  ],
  choreSubmissions: [],

  /* Λόγοι κίνησης αποθέματος (§10.4). Presets + «άλλο» + προσθήκη νέου. */
  reasons: [
    {id:'r1',  de:'Frühstück',        el:'Πρωινό'},
    {id:'r2',  de:'Mittagessen',      el:'Μεσημεριανό'},
    {id:'r3',  de:'Abendessen',       el:'Βραδινό'},
    {id:'r4',  de:'Snack',            el:'Σνακ'},
    {id:'r5',  de:'Kochen',           el:'Μαγείρεμα'},
    {id:'r6',  de:'Aktivität',        el:'Δραστηριότητα'},
    {id:'r7',  de:'BBQ',              el:'BBQ'},
    {id:'r8',  de:'Strand',           el:'Παραλία'},
    {id:'r9',  de:'Ausflug',          el:'Εκδρομή'},
    {id:'r10', de:'Ins andere Haus',  el:'Στο άλλο σπίτι'},
    {id:'r11', de:'Abgelaufen',       el:'Έληξε'},
    {id:'r12', de:'Verdorben',        el:'Χάλασε'},
    {id:'r13', de:'An Kind gegeben',  el:'Δόθηκε σε παιδί'},
    {id:'r14', de:'Reinigung',        el:'Καθαρισμός'},
  ],
  customReasons: [],
  /* Λόγοι αφαίρεσης από λίστα αγορών — presets + custom. */
  listRemoveReasons: [
    {id:'lr1', de:'Nicht mehr nötig', el:'Δεν χρειάζεται πια'},
    {id:'lr2', de:'Schon im Haus', el:'Υπάρχει ήδη'},
    {id:'lr3', de:'Falsches Produkt', el:'Λάθος προϊόν'},
    {id:'lr4', de:'Doppelt eingetragen', el:'Διπλή καταχώρηση'},
    {id:'lr5', de:'Anderswo besorgt', el:'Αγοράστηκε αλλού'},
    {id:'lr6', de:'Zu teuer', el:'Πολύ ακριβό'},
  ],
  customListRemoveReasons: [],
  // Το λεξιλόγιο δραστηριοτήτων βγήκε από το ίδιο το έντυπο
  activities: [
    {id:'a01', emoji:'👩‍🍳', de:'Kochkurs',       el:'Μάθημα μαγειρικής'},
    {id:'a02', emoji:'🍪', de:'Backen',           el:'Ζύμωμα / ψήσιμο'},
    {id:'a03', emoji:'🏖️', de:'Beach Event',      el:'Beach Event'},
    {id:'a04', emoji:'🐚', de:'Strand',           el:'Παραλία'},
    {id:'a05', emoji:'🏐', de:'Volleyball',       el:'Βόλεϊ'},
    {id:'a06', emoji:'🧸', de:'Spielen',          el:'Παιχνίδι'},
    {id:'a07', emoji:'🤲', de:'Fingerspiel',      el:'Παιχνίδι με τα δάχτυλα'},
    {id:'a08', emoji:'🎬', de:'Film',             el:'Ταινία'},
    {id:'a09', emoji:'✂️', de:'Basteln',          el:'Χειροτεχνία'},
    {id:'a10', emoji:'🖼️', de:'Vision Board',     el:'Vision Board'},
    {id:'a11', emoji:'🗺️', de:'Schnitzeljagd',    el:'Κυνήγι θησαυρού'},
    {id:'a12', emoji:'🤸', de:'Seilspringen',     el:'Σχοινάκι'},
    {id:'a13', emoji:'🌅', de:'Sonnenuntergang',  el:'Ηλιοβασίλεμα'},
    {id:'a14', emoji:'🁢', de:'Domino XXL',       el:'Domino XXL'},
    {id:'a15', emoji:'🍽️', de:'Essen',            el:'Φαγητό'},
    {id:'a16', emoji:'😴', de:'Schlafen',         el:'Ύπνος'},
    {id:'a17', emoji:'📚', de:'Lernen',           el:'Μελέτη'},
    {id:'a18', emoji:'🛁', de:'Baden',            el:'Μπάνιο'},
    {id:'a19', emoji:'🚶', de:'Spaziergang',      el:'Βόλτα'},
    {id:'a20', emoji:'💊', de:'Medikamente',      el:'Φάρμακα'},
    {id:'a21', emoji:'🚌', de:'Transport',        el:'Μεταφορά'},
    {id:'a22', emoji:'📝', de:'Sonstiges',        el:'Άλλο'},
  ],
  /* Κατηγορίες — με τη σειρά που περπατάς το σουπερμάρκετ */
  categories: [
    {id:'fridge',    de:'Kühlregal',     el:'Ψυγείο'},
    {id:'produce',   de:'Obst & Gemüse', el:'Φρούτα & λαχανικά'},
    {id:'dry',       de:'Trockenware',   el:'Ξηρά τρόφιμα'},
    {id:'drinks',    de:'Getränke',      el:'Ποτά'},
    {id:'household', de:'Haushalt',      el:'Οικιακά'},
    {id:'custom',    de:'Weitere Produkte',el:'Άλλα προϊόντα'},
  ],
  /* Κατάλογος φτιαγμένος από τις πραγματικές λίστες της προηγούμενης εβδομάδας.
     `alias`: εναλλακτικές γραφές & ορθογραφικά που όντως εμφανίστηκαν. */
  products: [
    // Ψυγείο
    {id:'p1',  cat:'fridge', de:'Milch',            el:'Γάλα',            en:'milk',        unit:'L'},
    {id:'p2',  cat:'fridge', de:'Butter',           el:'Βούτυρο',         en:'butter',      unit:'Stk'},
    {id:'p3',  cat:'fridge', de:'Margarine',        el:'Μαργαρίνη',       unit:'Stk'},
    {id:'p4',  cat:'fridge', de:'Käse',             el:'Τυρί',            en:'cheese',      unit:'g'},
    {id:'p5',  cat:'fridge', de:'Streukäse',        el:'Τριμμένο τυρί',   unit:'Stk', alias:['steukäse','streukase']},
    {id:'p6',  cat:'fridge', de:'Frischkäse',       el:'Τυρί κρέμα',      unit:'Stk'},
    {id:'p7',  cat:'fridge', de:'Feta',             el:'Φέτα',            unit:'g'},
    {id:'p8',  cat:'fridge', de:'Joghurt',          el:'Γιαούρτι',        en:'yogurt',      unit:'Stk', alias:['jogurt']},
    {id:'p9',  cat:'fridge', de:'Eier',             el:'Αυγά',            en:'eggs',        unit:'Stk'},
    {id:'p10', cat:'fridge', de:'Schinken',         el:'Ζαμπόν',          en:'ham',         unit:'g'},
    {id:'p11', cat:'fridge', de:'Salami',           el:'Σαλάμι',          en:'salami',      unit:'g'},
    // Φρούτα & λαχανικά
    {id:'p20', cat:'produce', de:'Tomaten',         el:'Ντομάτες',        en:'tomato',      unit:'Stk'},
    {id:'p21', cat:'produce', de:'Gurken',          el:'Αγγούρια',        en:'cucumber',    unit:'Stk'},
    {id:'p22', cat:'produce', de:'Zwiebeln',        el:'Κρεμμύδια',       en:'onions',      unit:'Stk'},
    {id:'p23', cat:'produce', de:'Frühlingszwiebeln',el:'Φρέσκα κρεμμυδάκια', unit:'Stk'},
    {id:'p24', cat:'produce', de:'Knoblauch',       el:'Σκόρδο',          unit:'Stk', alias:['knobi']},
    {id:'p25', cat:'produce', de:'Paprika',         el:'Πιπεριές',        unit:'Stk'},
    {id:'p26', cat:'produce', de:'Zucchini',        el:'Κολοκυθάκια',     unit:'Stk'},
    {id:'p27', cat:'produce', de:'Möhren',          el:'Καρότα',          en:'carrots',     unit:'Stk', alias:['karotten','mohren']},
    {id:'p28', cat:'produce', de:'Spinat',          el:'Σπανάκι',         unit:'Stk'},
    {id:'p29', cat:'produce', de:'Petersilie',      el:'Μαϊντανός',       unit:'Stk'},
    {id:'p30', cat:'produce', de:'Nektarinen',      el:'Νεκταρίνια',      en:'nectarines',  unit:'Stk'},
    {id:'p31', cat:'produce', de:'Äpfel',           el:'Μήλα',            en:'apples',      unit:'Stk', alias:['apfel']},
    {id:'p32', cat:'produce', de:'Bananen',         el:'Μπανάνες',        en:'bananas',     unit:'Stk'},
    {id:'p33', cat:'produce', de:'Zitronen',        el:'Λεμόνια',         en:'lemons',      unit:'Stk'},
    {id:'p34', cat:'produce', de:'Wassermelone',    el:'Καρπούζι',        en:'watermelon',  unit:'Stk'},
    // Ξηρά
    {id:'p40', cat:'dry', de:'Toastbrot',           el:'Ψωμί τοστ',       unit:'Stk'},
    {id:'p41', cat:'dry', de:'Deutsches Brot',      el:'Γερμανικό ψωμί',  en:'german dark bread', unit:'Stk'},
    {id:'p42', cat:'dry', de:'Cornflakes',          el:'Κορν φλέικς',     unit:'Stk'},
    {id:'p43', cat:'dry', de:'Granola',             el:'Granola',         unit:'Stk', alias:['cranola']},
    {id:'p44', cat:'dry', de:'Haferflocken',        el:'Βρώμη',           en:'oat flakes',  unit:'Stk', alias:['rolled oats']},
    {id:'p45', cat:'dry', de:'Kirschmarmelade',     el:'Μαρμελάδα κεράσι',unit:'Stk'},
    {id:'p46', cat:'dry', de:'Reis',                el:'Ρύζι',            en:'rice',        unit:'kg'},
    {id:'p47', cat:'dry', de:'Makkaroni',           el:'Μακαρόνια',       unit:'Stk'},
    {id:'p48', cat:'dry', de:'Spirelli',            el:'Βίδες',           unit:'Stk'},
    {id:'p49', cat:'dry', de:'Spaghetti',           el:'Σπαγγέτι',        unit:'Stk', alias:['spagetti']},
    {id:'p50', cat:'dry', de:'Lasagneplatten',      el:'Φύλλα λαζάνια',   unit:'Stk', alias:['lassagneplatten']},
    {id:'p51', cat:'dry', de:'Mais',                el:'Καλαμπόκι',       unit:'Stk'},
    {id:'p52', cat:'dry', de:'Salz',                el:'Αλάτι',           unit:'Stk'},
    {id:'p53', cat:'dry', de:'Pfeffer gemahlen',    el:'Πιπέρι τριμμένο', en:'black pepper',unit:'Stk'},
    {id:'p54', cat:'dry', de:'Öl',                  el:'Λάδι',            en:'oil',         unit:'L'},
    {id:'p55', cat:'dry', de:'Essig weiß',          el:'Ξύδι λευκό',      unit:'Stk'},
    {id:'p56', cat:'dry', de:'Essig rot',           el:'Ξύδι κόκκινο',    unit:'Stk'},
    {id:'p57', cat:'dry', de:'Tomatensoße',         el:'Σάλτσα ντομάτας', en:'tomato sauce',unit:'Stk'},
    {id:'p58', cat:'dry', de:'Ketchup',             el:'Κέτσαπ',          unit:'Stk', alias:['kesap']},
    {id:'p59', cat:'dry', de:'Blätterteig',         el:'Φύλλο σφολιάτας', unit:'Stk'},
    {id:'p60', cat:'dry', de:'Backpapier',          el:'Λαδόκολλα',       en:'baking paper',unit:'Stk'},
    {id:'p61', cat:'dry', de:'Alufolie',            el:'Αλουμινόχαρτο',   unit:'Stk', alias:['alufelgen']},
    {id:'p62', cat:'dry', de:'Wraps',               el:'Wraps',           unit:'Stk'},
    {id:'p63', cat:'dry', de:'Vanillearoma',        el:'Άρωμα βανίλιας',  unit:'Stk'},
    {id:'p64', cat:'dry', de:'Süßsauer im Glas',    el:'Γλυκόξινο σε βάζο',unit:'Stk'},
    // Ποτά
    {id:'p70', cat:'drinks', de:'Wasser',           el:'Νερό',            en:'water',       unit:'Stk'},
    {id:'p71', cat:'drinks', de:'Sprudelwasser',    el:'Ανθρακούχο νερό', en:'sparkling water', unit:'Stk'},
    // Οικιακά
    {id:'p80', cat:'household', de:'Klopapier',     el:'Χαρτί υγείας',    unit:'Stk'},
    {id:'p81', cat:'household', de:'Küchenrolle',   el:'Χαρτί κουζίνας',  en:'kitchen paper towels', unit:'Stk'},
    {id:'p82', cat:'household', de:'Feuchttücher',  el:'Υγρά μαντηλάκια', en:'wet wipes',   unit:'Stk'},
    {id:'p83', cat:'household', de:'Müllsäcke',     el:'Σακούλες σκουπιδιών', unit:'Stk', alias:['müllsacke','mullsacke']},
    {id:'p84', cat:'household', de:'Schwämme',      el:'Σφουγγάρια',      unit:'Stk', alias:['schwäme','schwamme']},
    {id:'p85', cat:'household', de:'Spüli',         el:'Υγρό πιάτων',     unit:'Stk'},
    {id:'p86', cat:'household', de:'Bodenputzmittel',el:'Καθαριστικό δαπέδου', unit:'Stk'},
    {id:'p87', cat:'household', de:'Waschmaschinensalz', el:'Αλάτι πλυντηρίου', unit:'Stk'},
    {id:'p88', cat:'household', de:'Besen',         el:'Σκούπα',          unit:'Stk'},
  ],
  customProducts: [],
  customCategories: [],
  profilePrefs: {},

  /* Το εβδομαδιαίο πρότυπο, μεταγραμμένο από τη φωτογραφία (20.7.–26.7.2026).
     day: 0=Δευ … 6=Κυρ · employeeId null = «wer?» */
  template: [
    // ── Vormittagsprogramm (ανά σπίτι) ──
    {id:'t1', block:'morning', day:1, houseId:'h1', employeeId:'e6', childIds:['k5'], activityId:'a01', note:'', time:''},
    {id:'t2', block:'morning', day:4, houseId:'h1', employeeId:null, childIds:[],     activityId:'a14', note:'Domino Villa', time:''},
    {id:'t3', block:'morning', day:4, houseId:'h2', employeeId:null, childIds:[],     activityId:'a14', note:'Domino XXL', time:''},
    {id:'t4', block:'morning', day:5, houseId:'h1', employeeId:'e6', childIds:[], activityId:'a01', note:'Lilly', time:''},

    // ── Nachmittagsbetreuung (ανά άτομο) ──
    {id:'t10', block:'afternoon', day:0, houseId:null, employeeId:'e1', childIds:[], activityId:'a07', note:'Lilly', time:''},
    {id:'t11', block:'afternoon', day:1, houseId:null, employeeId:'e1', childIds:[],     activityId:'a05', note:'Strand Volleyball', time:''},
    {id:'t12', block:'afternoon', day:2, houseId:null, employeeId:'e1', childIds:[],     activityId:'a02', note:'Plätzchen backen', time:''},
    {id:'t13', block:'afternoon', day:3, houseId:null, employeeId:'e1', childIds:[],     activityId:'a03', note:'', time:''},
    {id:'t14', block:'afternoon', day:4, houseId:null, employeeId:'e1', childIds:[],     activityId:'a08', note:'Film / Spielen', time:''},
    {id:'t20', block:'afternoon', day:0, houseId:'h1', employeeId:'e2', childIds:[],     activityId:'a06', note:'Villa', time:''},
    {id:'t21', block:'afternoon', day:2, houseId:null, employeeId:'e2', childIds:['k3'], activityId:'a06', note:'Terrasse Kicker', time:''},
    {id:'t22', block:'afternoon', day:4, houseId:null, employeeId:'e2', childIds:[],     activityId:'a06', note:'', from:'16:00', to:'19:00'},
    {id:'t30', block:'afternoon', day:3, houseId:null, employeeId:'e4', childIds:[],     activityId:'a03', note:'', time:''},
    {id:'t40', block:'afternoon', day:0, houseId:null, employeeId:'e5', childIds:[],     activityId:'a09', note:'Schläger / Sommerkurs', time:''},
    {id:'t41', block:'afternoon', day:2, houseId:null, employeeId:'e5', childIds:[],     activityId:'a04', note:'Blätter & Muscheln', time:''},
    {id:'t42', block:'afternoon', day:3, houseId:null, employeeId:'e5', childIds:[],     activityId:'a03', note:'', time:''},
    {id:'t43', block:'afternoon', day:4, houseId:null, employeeId:'e5', childIds:[],     activityId:'a10', note:'', time:''},
    {id:'t44', block:'afternoon', day:5, houseId:null, employeeId:'e5', childIds:[],     activityId:'a11', note:'', time:''},
    {id:'t45', block:'afternoon', day:6, houseId:null, employeeId:'e5', childIds:[],     activityId:'a09', note:'Traumfänger', time:''},
    {id:'t50', block:'afternoon', day:1, houseId:null, employeeId:'e6', childIds:[],     activityId:'a12', note:'', time:''},
    {id:'t51', block:'afternoon', day:2, houseId:null, employeeId:'e6', childIds:[],     activityId:'a13', note:'', time:''},
    {id:'t52', block:'afternoon', day:3, houseId:null, employeeId:'e6', childIds:['k6'], activityId:'a02', note:'', time:''},

    // ── Abendprogramm (ανά σπίτι) ──
    {id:'t60', block:'evening', day:6, houseId:'h2', employeeId:'e6', childIds:['k1','k2','k3','k4','k5'], activityId:'a12', note:'Jungs', time:''},
  ],
  overrides: [],

  /* Βάρδιες — μεταγραφή του «Dienstplan ab 13.07.2026» (docs/dienstplan.txt).
     type: NORMAL | H24 (λήγει την επόμενη μέρα) | HANDOVER | OFF */
  shifts: [
    // Dora
    {id:'d1', employeeId:'e1', day:0, from:'11:00', to:'11:00', type:'H24'},
    {id:'d2', employeeId:'e1', day:1, from:'11:00', to:'19:00', type:'NORMAL'},
    {id:'d3', employeeId:'e1', day:2, from:'10:00', to:'14:30', type:'NORMAL'},
    {id:'d4', employeeId:'e1', day:2, from:'14:30', to:'19:00', type:'NORMAL'},
    {id:'d5', employeeId:'e1', day:3, from:'10:00', to:'14:30', type:'NORMAL'},
    {id:'d6', employeeId:'e1', day:3, from:'14:30', to:'19:00', type:'NORMAL'},
    {id:'d7', employeeId:'e1', day:4, from:'11:00', to:'11:00', type:'H24'},
    {id:'d8', employeeId:'e1', day:5, type:'OFF'},
    {id:'d9', employeeId:'e1', day:6, type:'OFF'},
    // Karin
    {id:'k1s', employeeId:'e2', day:0, from:'15:00', to:'19:00', type:'NORMAL'},
    {id:'k2s', employeeId:'e2', day:1, type:'OFF'},
    {id:'k3s', employeeId:'e2', day:2, from:'15:00', to:'19:00', type:'NORMAL'},
    {id:'k4s', employeeId:'e2', day:3, type:'OFF'},
    {id:'k5s', employeeId:'e2', day:4, from:'15:00', to:'19:00', type:'NORMAL'},
    {id:'k6s', employeeId:'e2', day:5, from:'15:00', to:'19:00', type:'NORMAL'},
    {id:'k7s', employeeId:'e2', day:6, from:'15:00', to:'19:00', type:'NORMAL'},
    // Dimi
    ...[0,1,2,4].flatMap(d=>[
      {id:'m'+d+'a', employeeId:'e3', day:d, from:'10:00', to:'14:00', type:'NORMAL'},
      {id:'m'+d+'b', employeeId:'e3', day:d, from:'15:30', to:'17:30', type:'NORMAL'},
    ]),
    {id:'m3a', employeeId:'e3', day:3, from:'10:00', to:'14:00', type:'NORMAL'},
    {id:'m3b', employeeId:'e3', day:3, from:'19:00', to:'22:00', type:'NORMAL'},
    {id:'m5',  employeeId:'e3', day:5, type:'OFF'},
    {id:'m6',  employeeId:'e3', day:6, type:'OFF'},
    // Angelo
    ...[0,2,3,4].flatMap(d=>[
      {id:'g'+d+'a', employeeId:'e4', day:d, from:'10:00', to:'14:00', type:'NORMAL'},
      {id:'g'+d+'b', employeeId:'e4', day:d, from:'15:00', to:'19:00', type:'NORMAL'},
    ]),
    {id:'g1x', employeeId:'e4', day:1, from:'15:00', to:'22:00', type:'NORMAL'},
    {id:'g5',  employeeId:'e4', day:5, type:'OFF'},
    {id:'g6',  employeeId:'e4', day:6, type:'OFF'},
    // Claudio
    {id:'c0', employeeId:'e5', day:0, from:'17:30', to:'22:00', type:'NORMAL'},
    {id:'c1', employeeId:'e5', day:1, type:'OFF'},
    {id:'c2', employeeId:'e5', day:2, from:'11:00', to:'11:00', type:'H24'},
    {id:'c3', employeeId:'e5', day:3, from:'15:00', to:'19:00', type:'NORMAL'},
    {id:'c4', employeeId:'e5', day:4, from:'17:30', to:'22:00', type:'NORMAL'},
    {id:'c5a',employeeId:'e5', day:5, from:'11:00', to:'14:00', type:'NORMAL'},
    {id:'c5b',employeeId:'e5', day:5, from:'15:00', to:'22:00', type:'NORMAL'},
    {id:'c6', employeeId:'e5', day:6, from:'11:00', to:'11:00', type:'H24'},
    // Löhri
    {id:'l0', employeeId:'e6', day:0, type:'OFF'},
    {id:'l1', employeeId:'e6', day:1, from:'11:00', to:'11:00', type:'H24'},
    {id:'l2', employeeId:'e6', day:2, from:'19:00', to:'22:00', type:'NORMAL'},
    {id:'l3', employeeId:'e6', day:3, from:'11:00', to:'11:00', type:'H24'},
    {id:'l4', employeeId:'e6', day:4, from:'11:00', to:'12:30', type:'HANDOVER', note:'Übergabe bis ca. 12:00–12:30'},
    {id:'l5', employeeId:'e6', day:5, from:'11:00', to:'11:00', type:'H24'},
    {id:'l6', employeeId:'e6', day:6, from:'18:00', to:'22:00', type:'NORMAL'},
    // Amalia
    ...[0,1,2,3,4,5].map(d=>({id:'a'+d, employeeId:'e7', day:d, from:'10:00', to:'18:00', type:'NORMAL'})),
    {id:'a6', employeeId:'e7', day:6, type:'OFF'},
  ],

  /* Τα πλαίσια κειμένου του εντύπου, ανά εβδομάδα (κλειδί = Δευτέρα σε ISO) */
  weeks: {},
  aiImports: [],

  /* Μία βάση για λίστα + ψυγείο. Κύκλος ζωής κάθε είδους:
     open → pending (μπήκε στην παρτίδα Παρασκευής, περιμένει επιβεβαίωση)
          → bought (αγοράστηκε, μπήκε στο απόθεμα του σπιτιού)
          → missing (δεν υπήρχε στο σουπερμάρκετ — μένει στη λίστα ως έλλειψη) */
  listEntries: [],
  shoppingTrips: [],
  stock: {},
  log: [],
  shiftNotes: {},
  stockChecks: [],
  shiftCheckins: [],
  xpLog: [],
  gameStats: {},
  kidRatings: [],
  kidNotes: [],
  subjects: [],
  subjectGrades: [],
  attendance: [],
  homework: [],
  schoolTimetable: [],
};

/* v5: καθαρή λειτουργική κατάσταση· παλιά v3/v4 demo data μένουν ως backup στο browser. */
const KEY = 'paidia.v5';
/** Αποθηκεύονται μόνο όσα αλλάζουν εν χρήσει· τα δεδομένα αναφοράς έρχονται από το SEED. */
const MUTABLE = ['template', 'overrides', 'weeks', 'events', 'taskCompletions', 'aiImports', 'listEntries', 'shoppingTrips', 'stock', 'log',
                 'customProducts', 'customCategories', 'productOverrides',
                 'customActivities', 'customReasons', 'customListRemoveReasons', 'profilePrefs', 'shiftNotes', 'stockChecks', 'shiftCheckins',
                 'chores', 'choreSubmissions', 'xpLog', 'gameStats', 'kidRatings', 'kidNotes', 'subjects', 'subjectGrades', 'attendance', 'homework', 'schoolTimetable'];

let DB = load();
function load(){
  const db = structuredClone(SEED);
  try{
    const raw = localStorage.getItem(KEY);
    if(raw){
      const saved = JSON.parse(raw);
      MUTABLE.forEach(k => { if(saved[k] !== undefined) db[k] = saved[k]; });
    }
  }catch(e){ console.warn('load failed', e); }
  // Παλιά αποθηκευμένα μπορεί να λείπουν πίνακες· κράτα ασφαλή defaults.
  ['overrides','events','taskCompletions','aiImports','listEntries','shoppingTrips','customProducts','customCategories','customActivities','customReasons','customListRemoveReasons','log','stockChecks','shiftCheckins','kidRatings','kidNotes','subjects','subjectGrades','attendance','homework','schoolTimetable']
    .forEach(k => { if(!Array.isArray(db[k])) db[k] = []; });
  if(!db.stock || typeof db.stock !== 'object') db.stock = {};
  if(!db.productOverrides || typeof db.productOverrides !== 'object') db.productOverrides = {};
  if(!db.profilePrefs || typeof db.profilePrefs !== 'object') db.profilePrefs = {};
  if(!db.weeks || typeof db.weeks !== 'object') db.weeks = {};
  if(!db.shiftNotes || typeof db.shiftNotes !== 'object') db.shiftNotes = {};
  // Σπίτια χωρίς planning flag από παλιότερα saves δεν μπαίνουν στο πρόγραμμα.
  db.houses = SEED.houses.map(h => ({...h}));
  if(!Array.isArray(db.subjects) || !db.subjects.length){
    db.subjects = [
      {id:'sub-math', de:'Mathe', el:'Μαθηματικά', active:true},
      {id:'sub-de', de:'Deutsch', el:'Γερμανικά', active:true},
      {id:'sub-el', de:'Griechisch', el:'Ελληνικά', active:true},
      {id:'sub-en', de:'Englisch', el:'Αγγλικά', active:true},
      {id:'sub-sport', de:'Sport', el:'Αθλητισμός', active:true},
    ];
  }
  return db;
}

/** Shared across all staff devices — full operational state (survives when Postgres is configured). */
const SHARED_KEYS = [
  'listEntries','shoppingTrips','stock','customProducts','customCategories','customReasons','customListRemoveReasons',
  'productOverrides','profilePrefs','template','overrides','weeks','events','taskCompletions',
  'aiImports','log','customActivities','shiftNotes','stockChecks','shiftCheckins',
  'xpLog','gameStats',
  'kidRatings','kidNotes','subjects','subjectGrades','attendance','homework','schoolTimetable',
];
const SHARED_DICT_KEYS = new Set(['stock','profilePrefs','productOverrides','weeks','shiftNotes']);
let sharedRevision = Number(localStorage.getItem('paidia.sharedRev') || 0) || 0;
let sharedPushTimer = null;
let sharedPollTimer = null;
let sharedBusy = false;

function sharedBucketHasData(bucket, key){
  const v = bucket?.[key];
  if(SHARED_DICT_KEYS.has(key)) return !!(v && typeof v==='object' && Object.keys(v).length);
  return Array.isArray(v) && v.length > 0;
}

function saveLocal(){
  try{
    const out = {};
    MUTABLE.forEach(k => { out[k] = DB[k]; });
    localStorage.setItem(KEY, JSON.stringify(out));
    return true;
  }catch(error){
    console.error('save failed', error);
    toast(t('errStorage'), 'error', 5200);
    return false;
  }
}

function applySharedPayload(data){
  if(!data || typeof data !== 'object') return false;
  let changed = false;
  SHARED_KEYS.forEach(k=>{
    if(data[k] === undefined) return;
    DB[k] = SHARED_DICT_KEYS.has(k)
      ? (data[k] && typeof data[k] === 'object' ? data[k] : {})
      : (Array.isArray(data[k]) ? data[k] : []);
    changed = true;
  });
  if(typeof data.revision === 'number'){
    sharedRevision = data.revision;
    localStorage.setItem('paidia.sharedRev', String(sharedRevision));
  }
  if(changed) saveLocal();
  return changed;
}

async function pullShared({force=false}={}){
  if(!(state.user||state.child)) return false;
  if(sharedBusy && !force) return false;
  sharedBusy = true;
  try{
    const response = await fetch(`/api/ops?since=${force?0:sharedRevision}`, {credentials:'same-origin'});
    if(response.status === 401 || response.status === 403) return false;
    const data = await response.json().catch(()=>null);
    if(!response.ok || !data) return false;
    if(!data.changed && !force){
      if(typeof data.revision === 'number') sharedRevision = data.revision;
      return false;
    }
    const serverRev = Number(data.revision)||0;
    const serverEmpty = serverRev === 0 && !SHARED_KEYS.some(k=>sharedBucketHasData(data, k));
    const localHas = SHARED_KEYS.some(k=>sharedBucketHasData(DB, k));
    // First device seeds the server — never wipe local with an empty cloud.
    if(serverEmpty && localHas){
      sharedRevision = 0;
      localStorage.setItem('paidia.sharedRev', '0');
      return false;
    }
    const changed = applySharedPayload(data);
    return changed;
  }catch(error){
    console.warn('shared pull failed', error);
    return false;
  }finally{ sharedBusy = false; }
}

/**
 * Merge our local value for one shared key on top of the server's, per record.
 *
 * Dict keys merge by key; arrays merge by `id`. Same id on both sides: ours
 * wins, since we are the one retrying. Records only the other device has are
 * preserved — that is the entire point of this function.
 *
 * If either side is an array whose records lack ids we cannot merge safely,
 * so that key alone keeps the old behaviour (ours) rather than guessing.
 */
function mergeShared(key, theirs, mine){
  if(mine === undefined) return theirs;
  if(theirs === undefined) return mine;

  if(SHARED_DICT_KEYS.has(key)){
    const a = (theirs && typeof theirs === 'object' && !Array.isArray(theirs)) ? theirs : {};
    const b = (mine   && typeof mine   === 'object' && !Array.isArray(mine))   ? mine   : {};
    return {...a, ...b};
  }

  const A = Array.isArray(theirs) ? theirs : [];
  const B = Array.isArray(mine)   ? mine   : [];
  const hasIds = A.every(r => r && r.id !== undefined) &&
                 B.every(r => r && r.id !== undefined);
  if(!hasIds) return B;

  const byId = new Map();
  A.forEach(r => byId.set(r.id, r));
  B.forEach(r => byId.set(r.id, r));
  return [...byId.values()];
}

async function pushShared(retry=false){
  if(state.mode !== 'staff' || !state.user) return false;
  if(sharedBusy) return false;
  sharedBusy = true;
  try{
    const payload = {revision: sharedRevision};
    SHARED_KEYS.forEach(k => { payload[k] = DB[k]; });
    const response = await fetch('/api/ops', {
      method:'POST', credentials:'same-origin',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),
    });
    const data = await response.json().catch(()=>null);
    if(response.status === 409 && data){
      // Another device wrote first. Adopt its state, then merge our own work
      // back in PER RECORD. The previous version restored our entire payload
      // over the server's, so the retry silently destroyed everything the
      // other device had written — stock, list, handover notes, clock-ins.
      // See tests/sync-conflict.test.mjs.
      const mine = {};
      SHARED_KEYS.forEach(k => { mine[k] = DB[k]; });
      applySharedPayload(data);            // DB + sharedRevision now match server
      SHARED_KEYS.forEach(k => { DB[k] = mergeShared(k, DB[k], mine[k]); });
      saveLocal();
      sharedBusy = false;
      if(!retry) return pushShared(true);
      return false;
    }
    if(!response.ok){
      console.warn('shared push failed', data);
      return false;
    }
    if(data){
      if(typeof data.revision === 'number'){
        sharedRevision = data.revision;
        localStorage.setItem('paidia.sharedRev', String(sharedRevision));
      }
    }
    return true;
  }catch(error){
    console.warn('shared push failed', error);
    return false;
  }finally{ sharedBusy = false; }
}

function schedulePushShared(){
  clearTimeout(sharedPushTimer);
  sharedPushTimer = setTimeout(()=>{ pushShared(); }, 280);
}

/* A child device has no write path to the shared ops blob — put_ops is staff
   only, by design. This pushes just the child's own ratings and notes to
   /api/kid-ops, which stamps ownership from the session server-side. Debounced,
   because ratings fire on every star tap. */
/* The server now tells us whether a write actually reached durable storage.
   A /tmp-only write is not a save, and staff were being shown success for it. */
let durableStorageOk = true;
function noteDurability(data){
  if(!data || typeof data.durable !== 'boolean') return;
  const was = durableStorageOk;
  durableStorageOk = data.durable;
  if(was && !durableStorageOk) toast(t('storageOffline'), 6000);
  document.body.classList.toggle('storage-offline', !durableStorageOk);
  const shell = document.getElementById('app');
  if(shell) shell.setAttribute('data-storage-warning', t('storageOffline'));
}

let kidPushTimer = null;
function scheduleKidPush(){
  if(state.mode !== 'child' || !state.child) return;
  clearTimeout(kidPushTimer);
  kidPushTimer = setTimeout(pushKidOps, 900);
}
async function pushKidOps(){
  if(state.mode !== 'child' || !state.child) return false;
  const kidId = state.child.id;
  const body = {
    kidRatings: (DB.kidRatings||[]).filter(r=>r && r.kidId===kidId),
    kidNotes:   (DB.kidNotes||[]).filter(n=>n && n.kidId===kidId),
  };
  try{
    const res = await fetch('/api/kid-ops', {
      method:'POST', credentials:'same-origin',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body),
    });
    if(!res.ok) return false;
    const data = await res.json().catch(()=>null);
    noteDurability(data);
    if(data && typeof data.revision === 'number') sharedRevision = data.revision;
    return true;
  }catch(_){
    return false;   // offline: the local copy still holds, next save retries
  }
}

function save(){
  const ok = saveLocal();
  if(ok){
    if(state.mode === 'child') scheduleKidPush();
    else schedulePushShared();
  }
  return ok;
}

function startSharedSync(){
  stopSharedSync();
  if(!(state.user||state.child)) return;
  pullShared({force:true}).then(changed=>{
    if(changed && !document.body.classList.contains('auth-pending')) render();
    // Staff seeds empty server from this device once.
    if(state.mode==='staff' && state.user && sharedRevision === 0) pushShared();
  });
  if(state.mode==='staff' && state.user){
    talkApi().then(data=>{
      if(data) talkCache={messages:data.messages||[], topics:data.topics||[], videoUrl:data.videoUrl||'', updatedAt:data.updatedAt||0};
    }).catch(()=>{});
  }
  refreshGallery({silent:true}).then(()=>{
    if(state.tab==='gallery' || (state.mode==='child' && state.childView==='gallery')) render();
  });
  sharedPollTimer = setInterval(async()=>{
    if(document.body.classList.contains('auth-pending')) return;
    if(document.hidden) return;
    const changed = await pullShared();
    if(changed && !sheetEl.classList.contains('on')) render();
    if(state.tab==='gallery' || (state.mode==='child' && state.childView==='gallery')){
      const before = state.galleryUpdatedAt;
      await refreshGallery({silent:true});
      if(state.galleryUpdatedAt !== before && !sheetEl.classList.contains('on')) render();
    }
  }, 2500);
}

function stopSharedSync(){
  clearInterval(sharedPollTimer);
  sharedPollTimer = null;
  clearTimeout(sharedPushTimer);
  sharedPushTimer = null;
}

window.addEventListener('visibilitychange', ()=>{
  if(!document.hidden && (state.user||state.child)){
    pullShared().then(changed=>{ if(changed && !sheetEl.classList.contains('on')) render(); });
  }
});

/* Βοηθητικά */
const uid = () => Math.random().toString(36).slice(2,10);
const emp = id => DB.employees.find(e=>e.id===id);
const kid = id => DB.children.find(c=>c.id===id);
const profilePref = id => (DB.profilePrefs && DB.profilePrefs[id]) || {};
const profileName = person => {
  if(!person) return '';
  const nick = profilePref(person.id).nickname;
  return (nick && String(nick).trim()) || person.name;
};
const safeColor = (value) => /^#[0-9a-fA-F]{3,8}$/.test(String(value || '')) ? String(value) : '#94a3b8';
const profileColor = person => safeColor(profilePref(person?.id).color || person?.color || '#94a3b8');
const profileEmoji = person => {
  const raw = profilePref(person?.id).emoji || '';
  // Keep short emoji/text only — never raw HTML into innerHTML sinks.
  return String(raw).replace(/[<>&"'`]/g, '').slice(0, 8);
};
const profileLabel = person => {
  const emoji = profileEmoji(person);
  const name = profileName(person);
  return emoji ? `${emoji} ${name}` : name;
};
/** Προκαθορισμένες + όσες πρόσθεσε το προσωπικό μέσα από την εφαρμογή. */
const ACTS = () => [...DB.activities, ...DB.customActivities];
const act = id => ACTS().find(a=>a.id===id);
const PRODUCTS = () => [...DB.products.map(applyProductOverride), ...(DB.customProducts||[]).map(applyProductOverride)];
const CATS = () => [...DB.categories, ...(DB.customCategories||[])];
const prod = id => PRODUCTS().find(p=>p.id===id);

function applyProductOverride(p){
  if(!p) return p;
  const o = DB.productOverrides?.[p.id];
  if(!o || typeof o !== 'object') return p;
  return {
    ...p,
    de: o.de != null ? o.de : p.de,
    el: o.el != null ? o.el : p.el,
    en: o.en != null ? o.en : p.en,
    unit: o.unit || p.unit,
    cat: o.cat || p.cat,
    alias: Array.isArray(o.alias) ? o.alias : (p.alias || []),
  };
}

function persistProductFields(pid, fields){
  const custom = (DB.customProducts||[]).find(p=>p.id===pid);
  if(custom){
    if(fields.de != null) custom.de = fields.de;
    if(fields.el != null) custom.el = fields.el;
    if(fields.en != null) custom.en = fields.en;
    if(fields.unit != null) custom.unit = fields.unit;
    if(fields.cat != null) custom.cat = fields.cat;
    if(fields.alias != null) custom.alias = fields.alias;
    return;
  }
  DB.productOverrides ||= {};
  const prev = DB.productOverrides[pid] || {};
  DB.productOverrides[pid] = {
    ...prev,
    ...fields,
    alias: fields.alias != null ? fields.alias : prev.alias,
  };
}
const house = id => DB.houses.find(h=>h.id===id);
const planningHouses = () => DB.houses.filter(h=>h.planning!==false);
const shoppingHouses = () => DB.houses;
const L = o => o ? (o[state.lang] ?? o.de ?? o.el ?? '') : '';
const childResidence = child => child?.residenceType==='external' ? t('externalHome') : child?.homeHouseId ? house(child.homeHouseId)?.short||'' : '';
const childChoiceLabel = child => `${child?.name||''}${childResidence(child)?` · 🏡 ${childResidence(child)}`:''}`;
const actLabel = id => { const a = act(id); return a ? L(a) : '—'; };
const empName = id => { const e = emp(id); return e ? profileName(e) : t('unassigned'); };
const entryEmployeeIds = e => [...new Set((e?.employeeIds?.length ? e.employeeIds : e?.employeeId ? [e.employeeId] : []).filter(Boolean))];
const entryHouseIds = e => [...new Set((e?.houseIds?.length ? e.houseIds : e?.houseId ? [e.houseId] : []).filter(Boolean))];
const employeeNames = e => entryEmployeeIds(e).map(id=>emp(id)?.name).filter(Boolean).join(', ') || t('unassigned');
const houseNames = e => entryHouseIds(e).map(id=>house(id)?.short).filter(Boolean).join(', ');
const initials = n => n.split(/[\s.]+/).filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase();
const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const dowIdx = d => (d.getDay()+6)%7;
const shiftDate = (dateStr,days) => { const d=new Date(dateStr+'T12:00:00'); d.setDate(d.getDate()+days); return iso(d); };
const fridayFor = (dateStr=iso(new Date())) => {
  const d=new Date(dateStr+'T12:00:00'), delta=(5-d.getDay()+7)%7; d.setDate(d.getDate()+delta); return iso(d);
};
const fridayText = dateStr => new Intl.DateTimeFormat(state.lang==='el'?'el-GR':'de-DE',
  {weekday:'long',day:'2-digit',month:'long',year:'numeric'}).format(new Date(dateStr+'T12:00:00'));
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fmtDT = ts => new Date(ts).toLocaleString(state.lang==='de'?'de-DE':'el-GR',
  {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
const kidNames = ids => (ids||[]).map(i=>kid(i)?.name).filter(Boolean).join(', ');

let toastT;
function toast(msg, type='info', duration){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast on ${type}`;
  el.setAttribute('role', type==='error' ? 'alert' : 'status');
  clearTimeout(toastT);
  toastT = setTimeout(()=>el.classList.remove('on'), duration || (type==='error'?4800:3000));
}

function setStatus(el, message='', type='info'){
  if(!el) return;
  el.textContent = message;
  el.className = message ? `status-box ${type}` : 'muted';
  el.setAttribute('role', type==='error' ? 'alert' : 'status');
  el.setAttribute('aria-live', 'polite');
}

/* UI feedback — haptic + light visual pulse (no SFX). */
function feedback(kind){
  try{
    if(navigator.vibrate){
      if(kind==='error') navigator.vibrate([18,40,18]);
      else if(kind==='save'||kind==='success') navigator.vibrate(14);
      else navigator.vibrate(8);
    }
  }catch{}
  document.body.classList.add('fx-tap');
  clearTimeout(feedback._t);
  feedback._t=setTimeout(()=>document.body.classList.remove('fx-tap'),120);
}

/* Inline UI icon. Replaces emoji used as chrome — see the u-* symbols in
   index.html. Content emoji (food categories, chore glyphs) stay as data. */
function ui(id, cls){
  return `<svg class="ui-ico${cls?' '+cls:''}" aria-hidden="true"><use href="#${id}"/></svg>`;
}

function emptyState(icon, title, hint='', ctaHtml=''){
  return `<div class="empty-state" role="status">
    <div class="empty-ico" aria-hidden="true">${icon}</div>
    <p class="empty-title">${esc(title)}</p>
    ${hint?`<p class="empty-hint">${esc(hint)}</p>`:''}
    ${ctaHtml||''}
  </div>`;
}

function entrySec(icon, label, hint=''){
  return `<div class="entry-sec"><span class="sec-ico" aria-hidden="true">${icon}</span><span>${esc(label)}</span>${hint?`<span class="sec-hint">${esc(hint)}</span>`:''}</div>`;
}
function houseOptionHtml(h, checked){
  return `<label class="check-option"><input type="checkbox" value="${h.id}" ${checked?'checked':''}>
    <span class="opt-ico" aria-hidden="true">🏠</span>
    <span class="opt-label"><span>${esc(h.name)}</span></span></label>`;
}
function personOptionHtml(p, checked){
  return `<label class="check-option"><input type="checkbox" value="${p.id}" ${checked?'checked':''}>
    <span class="opt-ava" style="background:${esc(p.color)}" aria-hidden="true">${esc(initials(p.name))}</span>
    <span class="opt-label"><span>${esc(p.name)}</span>${p.role?`<small>${esc(L(p.role))}</small>`:''}</span></label>`;
}
function kidChipHtml(c, on){
  return `<button class="chip kid-chip ${on?'on':''}" data-c="${c.id}" type="button">
    <span class="chip-ava" style="background:${esc(c.color)}" aria-hidden="true">${esc(initials(c.name))}</span>
    <span class="chip-mark" aria-hidden="true">${on?'☑':'☐'}</span>
    <span>${esc(childChoiceLabel(c))}</span></button>`;
}
function groupChipHtml(g, on){
  return `<button class="chip ${on?'on':''}" data-g="${g.id}" type="button">👥 ${esc(L(g))}</button>`;
}

function friendlyAiError(error){
  const status=Number(error?.status||0), code=String(error?.code||'').toLowerCase();
  const detail=String(error?.detail||error?.message||'').toLowerCase();
  if(status===401 || code==='auth_required') return t('helpAuthExpired');
  if(status===503 || code==='configuration' || detail.includes('not configured') || detail.includes('configuration') || detail.includes('groq_api_key')) return t('errConfig');
  if(status===429 || code==='rate_limit' || detail.includes('rate limit')) return t('errRate');
  if(status===408 || status===504 || code==='aborterror' || code==='timeout' || detail.includes('timed out') || detail.includes('timeout')) return t('errTimeout');
  if(status===413 || detail.includes('too large') || detail.includes('image')) return t('errImage');
  if(!navigator.onLine || status===0 || detail.includes('failed to fetch') || detail.includes('network')) return t('errNetwork');
  if(status===502 || code==='provider') return t('helpUnavailable');
  return t('errServer');
}

async function sendEventWhatsapp(event){
  let whatsappOk=false;
  try{
    const response=await fetch('/api/whatsapp/event',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({eventId:event.id,title:L(event),date:event.date,from:event.from,to:event.to,
        location:event.location||'',childIds:event.childIds||[]}),
    });
    const result=await response.json().catch(()=>({}));
    if(response.ok && result.sent){ whatsappOk=true; toast(T[state.lang].whatsappSent(result.sent),'success'); }
    else if(response.status!==422 && response.status!==503 && !response.ok)
      throw new Error(result.error||String(response.status));
  }catch(error){
    console.error('WhatsApp event notification failed',error);
  }
  try{
    const response=await fetch('/api/notify/event-email',{
      method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
      body:JSON.stringify({eventId:event.id,title:L(event),date:event.date,from:event.from,to:event.to,
        location:event.location||'',childIds:event.childIds||[],note:event.note||L(event.description||{})||''}),
    });
    const result=await response.json().catch(()=>({}));
    if(response.ok && result.sent){
      toast(state.lang==='el'?`Email σε ${result.sent} άτομα`:`E-Mail an ${result.sent} Personen`,'success');
    }else if(!whatsappOk && (response.status===503||result.code==='email_not_configured')){
      toast(t('whatsappSkipped'));
    }else if(!whatsappOk && !response.ok){
      toast(t('whatsappFailed'),'error',5200);
    }
  }catch(error){
    console.error('Event email notification failed',error);
    if(!whatsappOk) toast(t('whatsappFailed'),'error',5200);
  }
}

/* ── Ταυτότητα συσκευής & δικτύου ── */
const session = {
  deviceId: (() => {
    let d = localStorage.getItem('paidia.device');
    if(!d){ d = 'dev-' + uid(); localStorage.setItem('paidia.device', d); }
    return d;
  })(),
  ip: null,
  ua: navigator.userAgent.slice(0, 120),
  sessionId: null,
};

/**
 * Δημόσια IP, best-effort. Ό,τι στέλνει ο client μπορεί να πλαστογραφηθεί —
 * στην παραγωγή η IP σφραγίζεται server-side (`x-forwarded-for`).
 */
async function resolveIp(){
  try{
    const ctl = new AbortController();
    const timer = setTimeout(()=>ctl.abort(), 2500);
    const r = await fetch('https://api.ipify.org?format=json', {signal: ctl.signal});
    clearTimeout(timer);
    session.ip = (await r.json()).ip;
  }catch(e){ session.ip = 'offline'; }
}

/* ── Το Βιβλίο: append-only ── */
/**
 * Client-side audit cap.
 *
 * `DB.log` lives INSIDE the shared `ops` blob, so every entry makes the whole
 * payload bigger and every save rewrites all of it. The server caps `log` at
 * 2500 (OPS_LIST_CAPS), but the client grew without bound and shipped the
 * full array on every push. mergeShared() now unions log entries on conflict
 * instead of dropping them, so it grows faster than before.
 *
 * NOTE: a stopgap, not retention. Trimming here loses history, which is the
 * opposite of what an audit trail is for. The real fix is writing entries to
 * the `security_events` table (own rows, real DELETE-by-age).
 * See docs/vault/Protokoll.md.
 */
const LOG_KEEP = 500;

function logEntry(type, text, extra = {}){
  DB.log.push({
    id: uid(), ts: Date.now(), type,
    employeeId: state.user ? state.user.id : null,
    text,
    ip: session.ip || '—',
    deviceId: session.deviceId,
    sessionId: session.sessionId,
    ua: session.ua,
    ...extra,
  });
  if(DB.log.length > LOG_KEEP) DB.log = DB.log.slice(-LOG_KEEP);
  save();
}

/* ════════════════════════════════════════════════════════════════
   Κατάσταση UI
   ════════════════════════════════════════════════════════════════ */
const state = {
  lang: localStorage.getItem('paidia.lang') || 'de',
  tab: 'home',
  staffKidId: null,
  kidsPane: 'directory',
  scheduleView: 'day',
  childView: 'today',
  gameId: null,
  game: null,
  gameCoach: null,
  galleryPosts: [],
  galleryUpdatedAt: 0,
  galleryLoading: false,
  galleryDrive: false,
  mode: 'staff',
  user: null,
  child: null,
  house: 'h1',
  shopFriday: fridayFor(),
  shopPanel: 'plan',
  calendarMonth: null,
  stockFilter: 'all',
  stockQuery: '',
  stockOpenCategories: null,
  stockTiles: localStorage.getItem('paidia.stockTiles')==='1',
  stockDraft: {},
  stockDraftReason: null,
  shopQuery: '',
  storeShowDone: false,
  selectMode: null, // null | 'shop' | 'stock' | 'store'
  selectedIds: [],
  houseFilter: '',
  date: iso(new Date()),
  bookRange: 'today', // today | week | month | all
  bookFilter: {employeeId:'', type:'', q:''},
  bookPane: 'shift', // shift | log | people
  bookView: 'timeline', // timeline | byDay | compact
  bookJournalMode: 'ink', // ink | rewrite
  bookShowTech: false,
  chatOpen: false,
  chatMode: 'ai', // ai | talk | help
  helpMessages: [],          // active user's transcript (session-only)
  helpByUser: {},            // per-profile chat history while the tab stays open
  pendingHelpActions: [],
  helpChatUserKey: null,
  onboardingComplete: false,
  onboardingVersion: 2,
  profileEmail: '',
  profilePhone: '',
  contactComplete: false,
};
const isAdminUser = () => !!(state.mode==='staff' && state.user?.admin);
const helpChatRole = () => state.mode==='child' ? 'child' : (isAdminUser() ? 'admin' : (state.user ? 'staff' : 'anonymous'));
const helpChatStorageKey = () => {
  const id = currentProfileId();
  return id ? `${state.mode}:${id}` : null;
};
function persistHelpTranscript(){
  const key = state.helpChatUserKey;
  if(!key) return;
  state.helpByUser[key] = state.helpMessages.slice(-12);
}
function loadHelpTranscriptForCurrentUser(){
  const key = helpChatStorageKey();
  if(state.helpChatUserKey && state.helpChatUserKey !== key) persistHelpTranscript();
  state.helpChatUserKey = key;
  state.helpMessages = key ? (state.helpByUser[key] || []).slice() : [];
  state.pendingHelpActions = [];
}
function helpWelcomeMessage(){
  const role = helpChatRole();
  const who = state.user || state.child;
  const greet = who?.name
    ? (state.lang==='el' ? `Γεια ${who.name}!` : `Hallo ${who.name}!`)
    : (state.lang==='el' ? 'Γεια!' : 'Hallo!');
  if(role==='child') return `${greet} ${t('helpWelcomeChild').replace(/^Hallo!|^Γεια!/, '').trim()}\n\n${t('helpChildHint')}`;
  if(role==='admin') return `${greet} ${t('helpWelcomeAdmin').replace(/^Hallo!|^Γεια!/, '').trim()}\n\n${t('helpAdminHint')}`;
  if(role==='staff') return `${greet} ${t('helpWelcomeStaff').replace(/^Hallo!|^Γεια!/, '').trim()}\n\n${t('helpMutateHint')}`;
  return t('helpWelcome');
}
function helpRoleLabel(){
  const role = helpChatRole();
  return role==='child' ? t('helpRoleChild') : role==='admin' ? t('helpRoleAdmin') : t('helpRoleStaff');
}
const currentProfileId = () => state.mode==='child' ? state.child?.id : state.user?.id;

function onboardingStorageKey(profileId=currentProfileId(), mode=state.mode, version=state.onboardingVersion){
  return `paidia-onboarding:${profileId||'_'}:${mode}:${Number(version)||0}`;
}
function readOnboardingLocal(profileId=currentProfileId(), mode=state.mode, version=state.onboardingVersion){
  try{ return localStorage.getItem(onboardingStorageKey(profileId, mode, version))==='1'; }
  catch{ return false; }
}
/** True if this profile already finished any known tutorial version (avoids re-trap loops). */
function readOnboardingDone(profileId=currentProfileId(), mode=state.mode, version=state.onboardingVersion){
  const ver=Number(version)||0;
  if(readOnboardingLocal(profileId, mode, ver)) return true;
  for(let v=1; v<=Math.max(ver, 2); v++){
    if(v!==ver && readOnboardingLocal(profileId, mode, v)) return true;
  }
  // Legacy key without version (older builds).
  try{ return localStorage.getItem(`paidia-onboarding:${profileId||'_'}:${mode}`)==='1'; }
  catch{ return false; }
}
function writeOnboardingLocal(profileId=currentProfileId(), mode=state.mode, version=state.onboardingVersion){
  try{ localStorage.setItem(onboardingStorageKey(profileId, mode, version), '1'); }catch{}
}
function contactStorageKey(profileId=currentProfileId(), mode=state.mode){
  return `paidia-contact:${profileId||'_'}:${mode}`;
}
function readContactLocal(profileId=currentProfileId(), mode=state.mode){
  try{
    const raw=localStorage.getItem(contactStorageKey(profileId, mode));
    if(!raw) return false;
    const data=JSON.parse(raw);
    return !!(data?.email && data?.phone);
  }catch{ return false; }
}
function writeContactLocal(email, phone, profileId=currentProfileId(), mode=state.mode){
  try{
    localStorage.setItem(contactStorageKey(profileId, mode), JSON.stringify({
      email:String(email||'').trim().toLowerCase(),
      phone:String(phone||'').replace(/[\s\-().]/g,''),
      at:Date.now(),
    }));
  }catch{}
}
function validPhoneClient(value){
  return /^\+?\d{8,16}$/.test(String(value||'').replace(/[\s\-().]/g,''));
}
async function syncOnboardingComplete(version=state.onboardingVersion){
  const response=await fetch('/api/auth/onboarding/complete',{
    method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
    body:JSON.stringify({version}),
  });
  const data=await response.json().catch(()=>({}));
  if(response.status===409 && data.version){
    state.onboardingVersion=Number(data.version)||state.onboardingVersion;
    const err=new Error(data.error||'version'); err.code='onboarding_version'; err.version=data.version; throw err;
  }
  if(!response.ok || data.completed!==true){
    const err=new Error(data.error||`HTTP ${response.status}`); err.code=data.code||'save_failed'; throw err;
  }
  state.onboardingComplete=true;
  state.onboardingVersion=Number(data.version)||version;
  writeOnboardingLocal(currentProfileId(), state.mode, state.onboardingVersion);
  return data;
}

function applyAuthenticatedProfile(data,{logLogin=false}={}){
  const mode=data.mode==='child'?'child':'staff';
  const who=mode==='child'?kid(data.profileId):emp(data.profileId);
  if(!who) return false;
  const authenticatedWho=mode==='staff'?{...who,admin:data.admin===true}:who;
  state.mode=mode;
  state.child=mode==='child'?authenticatedWho:null;
  state.user=mode==='staff'?authenticatedWho:null;
  try{
    localStorage.setItem('paidia.lastMode', mode);
    localStorage.setItem('paidia.lastProfileId', data.profileId);
  }catch{}
  state.onboardingVersion=Number(data.onboardingVersion)||1;
  const serverDone=data.onboardingComplete===true;
  const localDone=readOnboardingDone(data.profileId, mode, state.onboardingVersion);
  state.onboardingComplete=serverDone || localDone;
  if(localDone && !serverDone){
    writeOnboardingLocal(data.profileId, mode, state.onboardingVersion);
  }
  state.profileEmail=String(data.email||'').trim();
  state.profilePhone=String(data.phone||'').trim();
  state.contactComplete=data.contactComplete===true
    || !!(state.profileEmail && state.profilePhone)
    || readContactLocal(data.profileId, mode);
  session.sessionId=data.sessionId||session.sessionId;
  if(logLogin && mode==='staff') logEntry('LOGIN',t('loginEntry'));
  if(!serverDone && localDone){
    syncOnboardingComplete(state.onboardingVersion).catch(()=>{ /* keep local completion; retry next login */ });
  }
  loadHelpTranscriptForCurrentUser();
  return true;
}

async function authenticateProfile(mode,who,pin){
  let remember=true;
  try{ remember = localStorage.getItem('paidia.rememberMe')!=='0'; }catch{}
  const response=await fetch('/api/auth/login',{
    method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
    body:JSON.stringify({mode,profileId:who.id,pin,remember}),
  });
  const data=await response.json();
  if(!response.ok){
    const error=new Error(data.error||String(response.status));
    error.status=response.status;error.code=data.code;error.retryAfter=data.retryAfter;
    error.attemptsRemaining=data.attemptsRemaining;throw error;
  }
  if(!applyAuthenticatedProfile(data,{logLogin:true})) throw new Error('Unknown profile');
  return data;
}

const passkeyCapable=()=>window.isSecureContext&&!!window.PublicKeyCredential&&!!navigator.credentials;
const biometricName=()=>{
  const ua=navigator.userAgent;
  if(/iPhone|iPad|iPod/i.test(ua)) return 'Face ID';
  if(/Macintosh|Mac OS/i.test(ua)) return 'Touch ID';
  if(/Android/i.test(ua)) return state.lang==='el'?'Δακτυλικό αποτύπωμα':'Fingerabdruck';
  if(/Windows/i.test(ua)) return 'Windows Hello';
  return t('passkey');
};
const biometricHint=()=>state.lang==='el'
  ? 'Γρήγορη είσοδος σε αυτό τη συσκευή'
  : 'Schnelle Anmeldung auf diesem Gerät';

const b64ToBytes=value=>{
  const base64=String(value).replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(String(value).length/4)*4,'=');
  return Uint8Array.from(atob(base64),c=>c.charCodeAt(0));
};
const bytesToB64=value=>{
  if(value===null||value===undefined)return null;
  const bytes=new Uint8Array(value);let binary='';bytes.forEach(b=>binary+=String.fromCharCode(b));
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
};
function decodePublicKeyOptions(options){
  const out=structuredClone(options);out.challenge=b64ToBytes(out.challenge);
  if(out.user?.id)out.user.id=b64ToBytes(out.user.id);
  for(const key of ['allowCredentials','excludeCredentials']) if(out[key]) out[key]=out[key].map(c=>({...c,id:b64ToBytes(c.id)}));
  return out;
}
function publicKeyCredentialJSON(credential){
  const response=credential.response;
  const value={id:credential.id,rawId:bytesToB64(credential.rawId),type:credential.type,
    authenticatorAttachment:credential.authenticatorAttachment||null,clientExtensionResults:credential.getClientExtensionResults?.()||{},
    response:{clientDataJSON:bytesToB64(response.clientDataJSON)}};
  if(response.attestationObject)value.response.attestationObject=bytesToB64(response.attestationObject);
  if(response.authenticatorData)value.response.authenticatorData=bytesToB64(response.authenticatorData);
  if(response.signature)value.response.signature=bytesToB64(response.signature);
  if('userHandle' in response)value.response.userHandle=bytesToB64(response.userHandle);
  if(response.getTransports)value.response.transports=response.getTransports();
  return value;
}
async function passkeyApi(path,body){
  const response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(body)});
  const data=await response.json().catch(()=>({error:'Invalid server response'}));
  if(!response.ok){const error=new Error(data.error||'Passkey request failed');error.status=response.status;error.code=data.code;throw error;}
  return data;
}
async function loginWithPasskey(mode,who){
  if(!passkeyCapable()){const error=new Error(t('passkeyUnavailable'));error.code='unsupported';throw error;}
  let remember=true;
  try{ remember = localStorage.getItem('paidia.rememberMe')!=='0'; }catch{}
  const options=await passkeyApi('/api/auth/passkey/login/options',{mode,profileId:who.id});
  const publicKey=decodePublicKeyOptions(options.publicKey);
  const credential=await navigator.credentials.get({publicKey});
  const data=await passkeyApi('/api/auth/passkey/login/verify',{ceremonyId:options.ceremonyId,credential:publicKeyCredentialJSON(credential),remember});
  if(!applyAuthenticatedProfile(data,{logLogin:true}))throw new Error('Unknown profile');
  return data;
}
async function registerPasskey(){
  if(!passkeyCapable())throw new Error(t('passkeyUnavailable'));
  const who=state.user||state.child;if(!who)throw new Error(t('authUnavailable'));
  const options=await passkeyApi('/api/auth/passkey/register/options',{displayName:who.name,label:biometricName()});
  const credential=await navigator.credentials.create({publicKey:decodePublicKeyOptions(options.publicKey)});
  return passkeyApi('/api/auth/passkey/register/verify',{ceremonyId:options.ceremonyId,credential:publicKeyCredentialJSON(credential)});
}

function revealApp(){
  document.body.classList.remove('auth-pending');
  document.getElementById('app').hidden=false;
  document.body.style.overflow='';
}

async function restoreServerSession(){
  try{
    let data = window.__paidiaBootSession || null;
    if(data && data.authenticated){
      try{ delete window.__paidiaBootSession; }catch{}
    }else{
      data = null;
      const response=await fetch('/api/auth/session',{credentials:'same-origin'});
      data=await response.json();
      if(!response.ok) data=null;
    }
    if(data && data.authenticated && applyAuthenticatedProfile(data)){
      closeGate();revealApp();render();
      startSharedSync();
      await ensureOnboarding();await ensureContactDetails();return true;
    }
  }catch(error){ console.error('session restore failed',error); }
  // Keep "Laden…" until we know restore failed — then show the gate.
  if(!gateEl.classList.contains('on')) openGate();
  else if(!gateBody.querySelector('[data-mode]') && !gateBody.querySelector('.gate-pin')) renderEntrance();
  return false;
}

async function logoutServerSession(){
  try{await fetch('/api/auth/logout',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:'{}'});}catch(error){}
  stopSharedSync();
  persistHelpTranscript();
  state.user=null;state.child=null;state.mode='staff';session.sessionId=null;
  state.helpMessages=[]; state.helpChatUserKey=null; state.pendingHelpActions=[];
  document.body.classList.add('auth-pending');
  document.getElementById('app').hidden=true;
  openGate();
}

function setLang(l){
  state.lang = l;
  localStorage.setItem('paidia.lang', l);
  document.documentElement.lang = l;
  if(!document.body.classList.contains('auth-pending')) render();
  if(gateEl.classList.contains('on')){
    // Keep the user on the login shell; refresh copy via entrance.
    if(state.user||state.child) render(); else renderEntrance();
  }
}

/* ════════════════════════════════════════════════════════════════
   Bottom sheet + PIN
   ════════════════════════════════════════════════════════════════ */
const sheetEl = document.getElementById('sheet');
const sheetBg = document.getElementById('sheetBg');
let sheetLocked = false;
let stockBoardUiAbort = null;

function openSheet(html, {dismissable = true} = {}){
  exitMatrixFullscreen();
  if(state.chatOpen) closeChatPanel();
  document.querySelectorAll('.stock-hold-menu,.drag-ghost').forEach(el=>el.remove());
  sheetLocked = !dismissable;
  document.getElementById('app').inert = sheetLocked;
  document.body.classList.add('sheet-open');
  sheetEl.setAttribute('role','dialog');
  sheetEl.setAttribute('aria-modal','true');
  sheetEl.innerHTML = (dismissable
    ? `<button class="sheet-close" type="button" aria-label="${esc(t('close'))}" title="${esc(t('close'))}">×</button><div class="grabber"></div>`
    : '') + html;
  sheetEl.classList.add('on'); sheetBg.classList.add('on');
  const x = sheetEl.querySelector('.sheet-close');
  if(x) x.onclick = closeSheet;
}
function closeSheet(){
  sheetLocked = false;
  stockBoardUiAbort?.abort();
  stockBoardUiAbort = null;
  document.getElementById('app').inert = false;
  document.body.classList.remove('sheet-open');
  sheetEl.removeAttribute('role');sheetEl.removeAttribute('aria-modal');
  sheetEl.classList.remove('on'); sheetBg.classList.remove('on');
  sheetEl.onpaste=null; sheetEl.ondragover=null; sheetEl.ondrop=null;
  stopCamera();
  document.querySelectorAll('.stock-hold-menu,.drag-ghost').forEach(el=>el.remove());
  sheetEl.replaceChildren();
  scheduleMeasureChrome();
}

function onboardingSteps(){
  const de=state.lang==='de';
  const step=(icon,deTitle,elTitle,dePath,elPath,deActions,elActions,deResult,elResult)=>({
    icon, iconUi:({ '🏠':'u-check','📅':'u-calendar','✍️':'u-note','🎊':'u-megaphone','🧊':'u-leaf','🛒':'u-cart','🧠':'u-sparkle','🛍️':'u-cart','🧾':'u-receipt','📖':'u-book','🔐':'u-person','❓':'u-chat','🛡️':'u-alert','👤':'u-person','✨':'u-sparkle','🎉':'u-party','🎮':'u-party' }[icon]||'u-book'),
    title:de?deTitle:elTitle,path:de?dePath:elPath,
    body:de?'Führe diese Schritte aus:':'Ακολούθησε αυτά τα βήματα:',
    features:de?deActions:elActions,result:de?deResult:elResult,
  });
  if(state.mode==='child') return [
    step('🏠','Heute öffnen','Άνοιγμα σημερινής ημέρας','Oben → ☀️ Heute','Επάνω → ☀️ Σήμερα',['Tippe auf „Heute“.','Tippe oben auf den gewünschten Wochentag.','Lies bei jeder Karte Aktivität, Uhrzeit, Haus, Betreuer und die anderen Kinder.'],['Πάτησε «Σήμερα».','Πάτησε επάνω την ημέρα της εβδομάδας που θέλεις.','Διάβασε σε κάθε κάρτα δραστηριότητα, ώρα, σπίτι, φροντιστή και τα άλλα παιδιά.'],'Du siehst nur Termine, denen dein eigenes Profil zugeteilt ist.','Βλέπεις μόνο όσα έχουν ανατεθεί στο δικό σου προφίλ.'),
    step('📅','Die ganze Woche ansehen','Προβολή όλης της εβδομάδας','Oben → 📅 Woche','Επάνω → 📅 Εβδομάδα',['Tippe auf „Woche“.','Scrolle nach unten durch Montag bis Sonntag.','Tippe danach wieder auf „Heute“, um zur Tagesansicht zurückzugehen.'],['Πάτησε «Εβδομάδα».','Κάνε κύλιση από Δευτέρα έως Κυριακή.','Πάτησε ξανά «Σήμερα» για επιστροφή στην ημερήσια προβολή.'],'Tage ohne Eintrag bleiben leer; es werden keine Daten anderer Kinder gezeigt.','Οι ημέρες χωρίς εγγραφή μένουν κενές και δεν εμφανίζονται στοιχεία άλλων παιδιών.'),
    step('🎉','Ein Event vollständig lesen','Πλήρης ανάγνωση event','Oben → 🎉 Events','Επάνω → 🎉 Events',['Tippe auf „Events“; die Zahl am Tab zeigt neue/kommende Events.','Öffne die große Event-Karte.','Prüfe Datum, Uhrzeit, Ort, Begleitung und „Mitbringen“.'],['Πάτησε «Events»· ο αριθμός δείχνει νέα/επόμενα events.','Άνοιξε τη μεγάλη κάρτα του event.','Έλεγξε ημερομηνία, ώρα, μέρος, συνοδό και «Τι να φέρεις».'],'Wenn etwas unklar ist, frage einen Betreuer; ändere keine Angaben selbst.','Αν κάτι δεν είναι σαφές, ρώτησε έναν φροντιστή· μην αλλάξεις στοιχεία.'),
    step('🎮','Ein Spiel starten','Έναρξη παιχνιδιού','Oben → 🎮 Spiele','Επάνω → 🎮 Παιχνίδια',['Tippe auf „Spiele“.','Wähle z. B. Memory, Fische, Simon oder Farben.','Spiele eine Runde und tippe „Nochmal“, wenn du magst.'],['Πάτησε «Παιχνίδια».','Διάλεξε π.χ. Μνήμη, Ψάρεμα, Simon ή Χρώματα.','Παίξε μια γύρα και πάτησε «Ξανά» αν θες.'],'Die Spiele bleiben auf dem Gerät und speichern keine Daten auf dem Server.','Τα παιχνίδια μένουν στη συσκευή και δεν αποθηκεύουν δεδομένα στον server.'),
    step('✨','Zo-Ai fragen','Ρώτα τη Zo-Ai','✨ Zo-Ai oben oder FAB unten rechts','✨ Zo-Ai επάνω ή FAB κάτω δεξιά',['Tippe oben auf „Zo-Ai“ oder den FAB unten rechts.','Stelle eine Frage zu deinem Tag, Events oder Spielen.','Zo-Ai ändert nichts ohne Erwachsene.'],['Πάτησε επάνω «Zo-Ai» ή το FAB κάτω δεξιά.','Ρώτα για τη μέρα σου, events ή παιχνίδια.','Η Zo-Ai δεν αλλάζει τίποτα χωρίς ενήλικα.'],'Zo-Ai hilft dir zu verstehen — Speichern machen nur Betreuer.','Η Zo-Ai σε βοηθάει να καταλάβεις — αποθήκευση κάνουν μόνο οι φροντιστές.'),
    step('🔐','Profil sicher verlassen','Ασφαλής έξοδος από το προφίλ','Oben rechts → Profil / Abmelden','Επάνω δεξιά → Προφίλ / Αποσύνδεση',['Tippe oben rechts auf dein Profil.','Nutze nur dein eigenes Profil und teile deine PIN nicht.','Tippe „Abmelden“, wenn du das Gerät nicht mehr benutzt.'],['Πάτησε επάνω δεξιά το προφίλ σου.','Χρησιμοποίησε μόνο το δικό σου προφίλ και μη δίνεις το PIN.','Πάτησε «Αποσύνδεση» όταν τελειώσεις.'],'Nach dem Abmelden erscheint wieder die Profilauswahl.','Μετά την αποσύνδεση εμφανίζεται ξανά η επιλογή προφίλ.'),
  ];
  const steps=[
    step('🏠','Home-Aufgabe erledigen','Ολοκλήρωση εργασίας από την Αρχική','Unteres Menü → 🏠 Home','Κάτω μενού → 🏠 Αρχική',['Öffne „Home“.','Lies oben „Heute zu tun“, „Überfällig“ und „Events“.','Öffne deine Aufgabe und tippe „Als erledigt markieren“; bei einem Fehler tippst du „Wieder öffnen“.'],['Άνοιξε «Αρχική».','Διάβασε επάνω «Σήμερα», «Εκπρόθεσμα» και «Events».','Άνοιξε τη δική σου εργασία και πάτησε «Σήμανση ως ολοκληρωμένο»· σε λάθος πάτησε «Άνοιγμα ξανά».'],'Die Aufgabe wechselt sofort zwischen offen und erledigt und wird pro Person gespeichert.','Η εργασία αλλάζει αμέσως μεταξύ ανοιχτής και ολοκληρωμένης και αποθηκεύεται ανά άτομο.'),
    step('📅','Plan richtig filtern','Σωστό φιλτράρισμα προγράμματος','Unteres Menü → 📅 Plan → Ansicht / Haus','Κάτω μενού → 📅 Πρόγραμμα → Προβολή / Σπίτι',['Tippe „Tag“ für das tägliche Meeting oder „Woche“ für alle sieben Tage.','Wähle „Kalyvia“, „Limenaria“ oder „Kombiniert“. Die drei Einkaufshäuser erscheinen bewusst nicht im Plan.','Nutze „Dienste“ für Schichten und „Events“ für besondere Termine.'],['Πάτησε «Ημέρα» για το καθημερινό meeting ή «Εβδομάδα» για επτά ημέρες.','Διάλεξε «Kalyvia», «Limenaria» ή «Συνδυαστικά». Τα τρία σπίτια αγορών δεν εμφανίζονται σκόπιμα στο πρόγραμμα.','Χρησιμοποίησε «Βάρδιες» για ωράρια και «Events» για ειδικά γεγονότα.'],'Der Filter ändert nur die Ansicht; er löscht oder verschiebt keine Einträge.','Το φίλτρο αλλάζει μόνο την προβολή· δεν διαγράφει ούτε μετακινεί εγγραφές.'),
    step('✍️','Einen Planeintrag speichern','Αποθήκευση εγγραφής προγράμματος','Plan → gewünschte Zelle / „+ Eintrag“','Πρόγραμμα → επιθυμητό κελί / «+ Εγγραφή»',['Tippe die Zelle des richtigen Tages und Zeitblocks.','Setze Häkchen bei einem oder mehreren Häusern und Personen.','Wähle Kinder einzeln oder über eine Gruppe, danach Aktivität und Uhrzeit.','Wähle „Nur heute“ oder – als Admin – „Dauerhaft“ und tippe „Speichern“.'],['Πάτησε το κελί της σωστής ημέρας και ζώνης ώρας.','Τσέκαρε ένα ή περισσότερα σπίτια και άτομα.','Διάλεξε παιδιά μεμονωμένα ή μέσω ομάδας και μετά δραστηριότητα και ώρα.','Διάλεξε «Μόνο σήμερα» ή – ως admin – «Μόνιμα» και πάτησε «Αποθήκευση».'],'Nach dem Speichern erscheint die Karte in genau diesem Tag und Block.','Μετά την αποθήκευση η κάρτα εμφανίζεται στη σωστή ημέρα και ζώνη.'),
    step('🎊','Planeintrag als Event veröffentlichen','Δημοσίευση εγγραφής ως event','Plan → Zelle öffnen → 📣 Event','Πρόγραμμα → άνοιγμα κελιού → 📣 Event',['Aktiviere oben „Event“.','Trage Eventtitel, Ort und „Mitbringen“ ein und kontrolliere Start/Ende.','Prüfe die ausgewählten Kinder; nur diese Profile erhalten die Ankündigung.','Tippe „Speichern“.'],['Ενεργοποίησε επάνω το «Event».','Συμπλήρωσε τίτλο, μέρος και «Τι να φέρουν» και έλεγξε ώρα αρχής/τέλους.','Έλεγξε τα επιλεγμένα παιδιά· μόνο αυτά θα λάβουν την ανακοίνωση.','Πάτησε «Αποθήκευση».'],'Das Event erscheint im Events-Tab der ausgewählten Kinder; WhatsApp wird nur bei vorhandener Konfiguration versucht.','Το event εμφανίζεται στο tab Events των επιλεγμένων παιδιών· WhatsApp επιχειρείται μόνο αν είναι ρυθμισμένο.'),
    step('🧊','Bestand ein- oder ausbuchen','Καταχώρηση εισόδου ή εξόδου αποθέματος','Unteres Menü → 🧊 Lager','Κάτω μενού → 🧊 Ψυγείο',['Wähle zuerst das richtige Haus; wische die Hausleiste seitlich, falls es nicht sichtbar ist.','Suche ein Produkt oder filtere „Braucht Aufmerksamkeit“, „Nur leer“ oder „Alle“.','Öffne das Produkt und tippe „Eingang“ oder „Ausgang“.','Bei Ausgang: Wähle einen Grund oder tippe „+ Neuer Grund“, schreibe ihn ins Feld und speichere ihn.','Setze die Menge; Foto ist optional. Bestätige die Buchung.'],['Διάλεξε πρώτα το σωστό σπίτι· σύρε τη σειρά σπιτιών στο πλάι αν δεν φαίνεται.','Αναζήτησε προϊόν ή βάλε φίλτρο «Χρειάζεται προσοχή», «Μόνο άδεια» ή «Όλα».','Άνοιξε το προϊόν και πάτησε «Είσοδος» ή «Έξοδος».','Στην έξοδο: διάλεξε λόγο ή πάτησε «+ Νέος λόγος», γράψ’ τον στο πεδίο και αποθήκευσέ τον.','Βάλε ποσότητα· η φωτογραφία είναι προαιρετική. Επιβεβαίωσε.'],'Die Menge ändert sich nur im zuvor gewählten Haus und die Bewegung steht im Protokoll.','Η ποσότητα αλλάζει μόνο στο επιλεγμένο σπίτι και η κίνηση γράφεται στις καταγραφές.'),
    step('🛒','Warenkorb für den richtigen Freitag bauen','Δημιουργία καλαθιού για τη σωστή Παρασκευή','Unteres Menü → 🛒 Liste','Κάτω μενού → 🛒 Λίστα',['Wähle oben das Haus.','Stelle mit den Pfeilen oder dem Datumsfeld den tatsächlichen Freitag ein.','Tippe einen Namen in „Produkt schnell hinzufügen“ oder nutze „Liste hinzufügen“.','Ändere Mengen mit +/−; entferne eine falsche Zeile mit ×.'],['Διάλεξε επάνω το σπίτι.','Με τα βέλη ή το πεδίο ημερομηνίας διάλεξε την πραγματική Παρασκευή.','Γράψε όνομα στη «Γρήγορη προσθήκη» ή χρησιμοποίησε «Προσθήκη λίστας».','Άλλαξε ποσότητες με +/− και αφαίρεσε λάθος γραμμή με ×.'],'Haus und Freitag stehen immer über der Liste; prüfe beides vor dem Einkauf.','Σπίτι και Παρασκευή φαίνονται πάντα πάνω από τη λίστα· έλεγξέ τα πριν τα ψώνια.'),
    step('🧠','Text oder Screenshot mit OCR einlesen','Εισαγωγή κειμένου ή screenshot με OCR','Liste → „Liste hinzufügen“','Λίστα → «Προσθήκη λίστας»',['Wähle „Text“ und füge die komplette Liste ein – oder „Screenshot/Foto“ und lade das Bild hoch bzw. füge es ein.','Tippe „Analysieren/Einlesen“ und warte auf den Entwurf.','Korrigiere Produktname, Menge und Einheit in jeder unsicheren Zeile.','Wähle „Intelligent zusammenführen“, „Neue Zeilen“ oder „Freitag ersetzen“ und speichere.'],['Διάλεξε «Κείμενο» και επικόλλησε όλη τη λίστα – ή «Screenshot/φωτογραφία» και ανέβασε/επικόλλησε εικόνα.','Πάτησε «Ανάλυση/Ανάγνωση» και περίμενε το πρόχειρο.','Διόρθωσε όνομα, ποσότητα και μονάδα σε κάθε αβέβαιη γραμμή.','Διάλεξε «Έξυπνη συγχώνευση», «Νέες γραμμές» ή «Αντικατάσταση Παρασκευής» και αποθήκευσε.'],'OCR speichert nie automatisch: Erst deine Bestätigung schreibt die Zeilen in den Warenkorb.','Το OCR δεν αποθηκεύει αυτόματα· μόνο η δική σου επιβεβαίωση γράφει τις γραμμές στο καλάθι.'),
    step('🛍️','Im Supermarkt eindeutig abhaken','Σαφής επιλογή στο σουπερμάρκετ','Liste → „Einkauf starten“','Λίστα → «Έναρξη αγορών»',['Tippe „Einkauf starten“.','Tippe bei jedem Produkt entweder „Gekauft“ oder „Nicht verfügbar“.','Bei einem Fehler tippe „Zurücksetzen“; mit „Zurück zum Warenkorb“ kannst du die Liste weiter bearbeiten.','Wenn nichts mehr offen ist, tippe „Charge bestätigen“.'],['Πάτησε «Έναρξη αγορών».','Για κάθε προϊόν πάτησε «Αγοράστηκε» ή «Δεν ήταν διαθέσιμο».','Σε λάθος πάτησε «Επαναφορά»· με «Πίσω στο καλάθι» μπορείς να διορθώσεις τη λίστα.','Όταν δεν μένει τίποτα ανοιχτό, πάτησε «Επιβεβαίωση παρτίδας».'],'Gekauftes erhöht automatisch den Bestand des gewählten Hauses; fehlende Produkte bleiben als Fehlmenge sichtbar.','Τα αγορασμένα αυξάνουν αυτόματα το απόθεμα του επιλεγμένου σπιτιού· όσα λείπουν μένουν ως έλλειψη.'),
    step('🧾','Einen alten Einkauf prüfen','Έλεγχος παλιότερης αγοράς','Liste → 🧾 Einkaufsverlauf','Λίστα → 🧾 Ιστορικό αγορών',['Tippe „Einkaufsverlauf“.','Wähle das Haus; wische die Hausleiste seitlich für weitere Häuser.','Öffne den gewünschten Freitag.','Vergleiche links „Gekauft“ und rechts „Nicht gekauft“ sowie Person und Abschlusszeit.'],['Πάτησε «Ιστορικό αγορών».','Διάλεξε σπίτι· σύρε τη σειρά στο πλάι για τα υπόλοιπα σπίτια.','Άνοιξε την Παρασκευή που θέλεις.','Σύγκρινε «Αγοράστηκαν» και «Δεν αγοράστηκαν», μαζί με άτομο και ώρα ολοκλήρωσης.'],'Der Verlauf ist ein Snapshot; ein späteres Carry-over verändert den alten Einkauf nicht.','Το ιστορικό είναι snapshot· μεταφορά σε επόμενη λίστα δεν αλλάζει την παλιά αγορά.'),
    step('📖','Protokoll suchen und korrigieren','Αναζήτηση και διόρθωση καταγραφών','Unteres Menü → 📖 Protokoll','Κάτω μενού → 📖 Καταγραφές',['Wähle Zeitraum: Heute, 7 Tage oder benutzerdefiniert.','Filtere bei Bedarf nach Person und Aktionstyp.','Öffne „Korrektur“, beschreibe den Fehler und speichere die neue Korrektur.','Lösche keine alte Buchung: Sie bleibt als Nachweis erhalten.'],['Διάλεξε περίοδο: Σήμερα, 7 ημέρες ή προσαρμοσμένη.','Φίλτραρε αν χρειάζεται ανά άτομο και τύπο ενέργειας.','Άνοιξε «Διόρθωση», περιέγραψε το λάθος και αποθήκευσε νέα διόρθωση.','Μη διαγράψεις την παλιά κίνηση· παραμένει ως αποδεικτικό.'],'Die Korrektur erscheint als neue append-only Zeile mit Benutzer, Zeit, Gerät und IP.','Η διόρθωση εμφανίζεται ως νέα append-only γραμμή με χρήστη, ώρα, συσκευή και IP.'),
    step('🔐','E-Mail, Telefon, Passkey und Abmeldung','Email, τηλέφωνο, passkey και αποσύνδεση','Oben rechts → Profil','Επάνω δεξιά → Προφίλ',['Öffne „Profil“.','Trage E-Mail und Telefon ein und tippe „Kontaktdaten speichern“; nutze danach „Test-E-Mail senden“.','Tippe „Passkey einrichten“ für Face ID, Touch ID, Fingerabdruck oder Windows Hello, wenn verfügbar.','Nutze „Anderes Profil“ oder „Abmelden“, wenn du fertig bist.'],['Άνοιξε «Προφίλ».','Βάλε email και τηλέφωνο και πάτησε «Αποθήκευση στοιχείων»· μετά «Αποστολή δοκιμαστικού email».','Πάτησε «Ρύθμιση passkey» για Face ID, Touch ID, δακτυλικό αποτύπωμα ή Windows Hello, αν υποστηρίζεται.','Χρησιμοποίησε «Άλλο προφίλ» ή «Αποσύνδεση» όταν τελειώσεις.'],'Beim ersten Login fragt die App nach E-Mail und Telefon. Versand läuft über SMTP (z. B. Gmail App-Passwort).','Στην πρώτη είσοδο η εφαρμογή ζητά email και τηλέφωνο. Η αποστολή γίνεται με SMTP (π.χ. Gmail App Password).'),
    step('❓','Gezielt Hilfe bekommen','Λήψη συγκεκριμένης βοήθειας','Blaues ? unten rechts','Μπλε ? κάτω δεξιά',['Tippe auf das blaue „?“.','Starte unter „Geführtes App-Tutorial“ diese Anleitung neu.','Oder öffne „AI-Hilfe“, beschreibe Ziel und aktuelle Fehlermeldung und tippe „Senden“.'],['Πάτησε το μπλε «?».','Από το «Καθοδηγούμενο tutorial» ξεκίνα ξανά αυτές τις οδηγίες.','Ή άνοιξε «Βοήθεια AI», γράψε στόχο και τρέχον μήνυμα λάθους και πάτησε «Αποστολή».'],'Die AI erklärt den nächsten Schritt, führt aber keine kritische Buchung ohne Bestätigung aus.','Η AI εξηγεί το επόμενο βήμα αλλά δεν κάνει κρίσιμη καταχώρηση χωρίς επιβεβαίωση.'),
    step('👤','Kinderprofil öffnen','Άνοιγμα προφίλ παιδιού','Unteres Menü → Kinder','Κάτω μενού → Παιδιά',['Öffne „Kinder“.','Tippe ein Kind an.','Sieh XP, Fächer-Sterne, Anwesenheit und Notizen.'],['Άνοιξε «Παιδιά».','Πάτησε ένα παιδί.','Δες XP, αστέρια μαθημάτων, παρουσία και σημειώσεις.'],'Änderungen speichern sich für alle Geräte.','Οι αλλαγές αποθηκεύονται για όλες τις συσκευές.'),
    step('✨','Zo-Ai mit Bestätigung','Zo-Ai με επιβεβαίωση','FAB Zo unten rechts','FAB Zo κάτω δεξιά',['Stelle eine Frage oder bitte um eine Änderung (Lager/Liste/Note).','Prüfe den Vorschlag.','Tippe „Bestätigen“ — bei Plan zusätzlich PIN.'],['Κάνε ερώτηση ή ζήτα αλλαγή (ψυγείο/λίστα/βαθμός).','Έλεγξε την πρόταση.','Πάτησε «Επιβεβαίωση» — στο πρόγραμμα και PIN.'],'Ohne Bestätigung schreibt Zo-Ai nichts in die Datenbank.','Χωρίς επιβεβαίωση η Zo-Ai δεν γράφει στη βάση.'),
  ];
  if(isAdminUser()) steps.push(step('🛡️','Admin-Zentrale benutzen','Χρήση Κέντρου Διαχείρισης','Home → 👑 Admin-Zentrale','Αρχική → 👑 Κέντρο Διαχείρισης',['Öffne Home und lies Teamkarten, Warnungen und letzte Aktivitäten.','Tippe „Wochenplan bearbeiten“, „Dienste bearbeiten“, „Events verwalten“ oder „Protokoll öffnen“.','Öffne eine Teamkarte, um heutige und kommende Aufgaben dieser Person zu prüfen.','Ändere Profil-E-Mails über Profil; dauerhafte Planänderungen speicherst du mit „Dauerhaft“.'],['Άνοιξε την Αρχική και διάβασε κάρτες ομάδας, προειδοποιήσεις και τελευταίες ενέργειες.','Πάτησε «Επεξεργασία εβδομάδας», «Βαρδιών», «Events» ή «Άνοιγμα καταγραφών».','Άνοιξε κάρτα μέλους για σημερινές και επόμενες εργασίες.','Άλλαξε email προφίλ από το Προφίλ· μόνιμες αλλαγές προγράμματος με «Μόνιμα».'],'Nur Admins sehen diese Kontrollen; jede Änderung bleibt im Protokoll nachvollziehbar.','Μόνο οι admins βλέπουν αυτά τα εργαλεία και κάθε αλλαγή καταγράφεται.'));
  return steps;
}

function openTutorial({required=false}={}){
  const steps=onboardingSteps();let current=0,saving=false;
  return new Promise(resolve=>{
    let settled=false;
    const finish=()=>{ if(settled) return; settled=true; resolve(); };
    openSheet('<div class="tutorial-shell" id="tutorialRoot"></div>',{dismissable:!required});
    const paint=()=>{
      const root=sheetEl.querySelector('#tutorialRoot');if(!root)return;
      const step=steps[current];
      root.innerHTML=`<div class="tutorial-top"><span class="tutorial-lock">${required?'🔒 '+t('tutorialRequired'):'📘 '+t('tutorialReplay')}</span><span class="tutorial-count">${T[state.lang].tutorialStep(current+1,steps.length)}</span></div>
        <div class="tutorial-progress" style="--steps:${steps.length}" aria-hidden="true">${steps.map((_,i)=>`<i class="${i<=current?'on':''}"></i>`).join('')}</div>
        <section class="tutorial-card"><div class="tutorial-icon">${step.iconUi?ui(step.iconUi):esc(step.icon)}</div><div class="tutorial-kicker">Armonia Thassos</div>
          <h2>${esc(step.title)}</h2>${step.path?`<div class="tutorial-path"><span>📍</span><span>${esc(step.path)}</span></div>`:''}<p style="margin-top:11px">${esc(step.body)}</p>${step.features?.length?`<ol class="tutorial-features">${step.features.map(feature=>`<li>${esc(feature)}</li>`).join('')}</ol>`:''}
          ${step.result?`<div class="tutorial-result"><b>${state.lang==='de'?'Ergebnis:':'Αποτέλεσμα:'}</b> ${esc(step.result)}</div>`:''}
          <div class="tutorial-tip"><span>ℹ️</span><span>${t(required?'tutorialTip':'tutorialReplayTip')}</span></div></section>
        <div class="tutorial-actions"><button class="tutorial-back" id="tutorialBack" ${current===0?'disabled':''}>${t('tutorialBack')}</button>
          <button class="btn" id="tutorialNext">${current===steps.length-1?t(required?'tutorialFinish':'tutorialClose'):t('tutorialNext')+' →'}</button></div>
        <div class="tutorial-status" id="tutorialStatus" role="status" aria-live="polite"></div>`;
      root.querySelector('#tutorialBack').onclick=()=>{if(!saving&&current>0){current--;paint();}};
      root.querySelector('#tutorialNext').onclick=async()=>{
        if(saving)return;
        if(current<steps.length-1){current++;feedback('select');paint();return;}
        if(!required){closeSheet();finish();return;}
        saving=true;const button=root.querySelector('#tutorialNext'),status=root.querySelector('#tutorialStatus');
        button.disabled=true;status.textContent=t('tutorialSaving');status.className='tutorial-status busy';
        // Persist locally first so a flaky server never re-opens the mandatory tour.
        writeOnboardingLocal();
        state.onboardingComplete=true;
        let lastError=null;
        for(let attempt=0;attempt<3;attempt++){
          try{
            await syncOnboardingComplete(state.onboardingVersion);
            closeSheet();toast(t('tutorialDone'),'success',4200);finish();return;
          }catch(error){
            lastError=error;
            if(error.code==='onboarding_version'){
              // Force current version key so we still unlock the user.
              writeOnboardingLocal();
              status.className='tutorial-status';status.textContent=t('tutorialSaveError');
              saving=false;button.disabled=false;
              closeSheet();finish();return;
            }
            await new Promise(r=>setTimeout(r,350*(attempt+1)));
          }
        }
        saving=false;button.disabled=false;
        closeSheet();
        toast(t('tutorialDone'),'success',4200);
        console.warn('onboarding sync failed; kept local completion', lastError);
        finish();
      };
    };
    paint();
  });
}

function openMandatoryTutorial(){return openTutorial({required:true});}
function openAppTutorial(){return openTutorial({required:false});}

async function ensureOnboarding({afterLogin=false}={}){
  if(state.onboardingComplete) return;
  if(readOnboardingDone()){
    state.onboardingComplete=true;
    writeOnboardingLocal();
    syncOnboardingComplete(state.onboardingVersion).catch(()=>{});
    return;
  }
  await openMandatoryTutorial();
}

async function ensureContactDetails(){
  if(state.mode!=='staff' || !state.user) return;
  if(state.contactComplete || (state.profileEmail && state.profilePhone) || readContactLocal()){
    state.contactComplete=true;
    return;
  }
  feedback('open');
  await new Promise(resolve=>{
    openSheet(`
      <div class="security-hero" style="margin-bottom:14px"><div class="row" style="gap:12px">
        <div class="security-icon">📇</div>
        <div><div class="import-kicker">${esc(t('contactKicker'))}</div>
          <h2 style="margin:3px 0">${esc(t('contactTitle'))}</h2>
          <div class="muted" style="font-size:12.5px;line-height:1.45">${esc(t('contactIntro'))}</div>
        </div></div></div>
      <label class="f"><span>✉️ ${esc(t('recoveryEmail'))}</span>
        <input type="email" id="contactEmail" value="${esc(state.profileEmail||'')}" autocomplete="email" placeholder="name@example.com" required></label>
      <label class="f"><span>📱 ${esc(t('phoneLabel'))}</span>
        <input type="tel" id="contactPhone" value="${esc(state.profilePhone||'')}" autocomplete="tel" inputmode="tel" placeholder="+30 … / +49 …" required></label>
      <p class="muted" style="font-size:11.5px;line-height:1.5;margin-top:-4px">${esc(t('phoneHint'))}</p>
      <div id="contactStatus" class="status-box" style="display:none" role="status"></div>
      <button class="btn" id="contactSave">✓ ${esc(t('contactSave'))}</button>
    `, {dismissable:false});
    const status=sheetEl.querySelector('#contactStatus');
    const emailEl=sheetEl.querySelector('#contactEmail');
    const phoneEl=sheetEl.querySelector('#contactPhone');
    sheetEl.querySelector('#contactSave').onclick=async event=>{
      const email=emailEl.value.trim();
      const phone=phoneEl.value.trim().replace(/[\s\-().]/g,'');
      const button=event.currentTarget;
      status.style.display='block';
      if(!email || !emailEl.validity.valid){ feedback('error'); setStatus(status,t('emailInvalid'),'error'); return; }
      if(!validPhoneClient(phone)){ feedback('error'); setStatus(status,t('phoneInvalid'),'error'); return; }
      button.disabled=true;
      try{
        const saved=await passkeyApi('/api/auth/profile/email',{
          profileId:state.user.id, email, phone,
        });
        state.profileEmail=saved.email||email;
        state.profilePhone=saved.phone||phone;
        state.contactComplete=true;
        writeContactLocal(state.profileEmail, state.profilePhone);
        feedback('save');
        toast(t('contactSaved'),'success');
        closeSheet();
        resolve();
      }catch(error){
        // Server may be ephemeral on Vercel — still unlock with local backup.
        if(error.code==='storage' || error.status===507){
          writeContactLocal(email, phone);
          state.profileEmail=email; state.profilePhone=phone; state.contactComplete=true;
          feedback('save'); toast(t('contactSaved'),'success'); closeSheet(); resolve();
          return;
        }
        feedback('error');
        setStatus(status, error.code==='invalid_email'?t('emailInvalid')
          :error.code==='invalid_phone'?t('phoneInvalid')
          :error.message||t('authUnavailable'),'error');
        button.disabled=false;
      }
    };
  });
}

function helpInventoryContext(){
  const canMutate=state.mode==='staff' && !!state.user;
  if(!canMutate) return {canMutate:false};
  const houses=DB.houses.map(h=>({id:h.id,name:h.short||L(h)||h.id, full:h.name}));
  const active=state.house;
  const products=PRODUCTS().map(p=>{
    const stock={};
    DB.houses.forEach(h=>{stock[h.id]=DB.stock[stockKey(h.id,p.id)]??0;});
    return {
      id:p.id, name:L(p), unit:p.unit, aliases:[p.de,p.el,p.en,...(p.alias||[])].filter(Boolean),
      stock, activeStock:stock[active]??0,
    };
  });
  const low=products.filter(p=>DB.houses.some(h=>(p.stock[h.id]??0)<=lowThreshold(prod(p.id)||{unit:p.unit})))
    .slice(0,50)
    .map(p=>({id:p.id,name:p.name,unit:p.unit,stock:p.stock}));
  const openShop=DB.listEntries.filter(e=>['open','pending'].includes(e.status)).slice(0,40).map(e=>({
    name:e.name,qty:e.qty,unit:e.unit,houseId:e.houseId,status:e.status,
  }));
  const focusProducts=products
    .slice()
    .sort((a,b)=>((b.activeStock>0)-(a.activeStock>0)) || a.name.localeCompare(b.name))
    .slice(0,120)
    .map(p=>`${p.name} [${p.id}] unit=${p.unit} ${active}=${p.activeStock}`);
  return {
    canMutate:true,
    admin:isAdminUser(),
    houses,
    productNames:focusProducts,
    lowStock:low,
    openShopping:openShop,
    activeHouse:active,
    shopFriday:state.shopFriday||fridayFor(),
    children:(DB.children||[]).map(k=>({id:k.id,name:k.name})),
    subjects:activeSubjects().map(s=>({id:s.id,de:s.de,el:s.el})),
    examples: state.lang==='el'
      ? ['πρόσθεσε 2 γάλα στο Kalyvia','βγάλε 1 βούτυρο','βάλε ρύζι στη λίστα']
      : ['2 Milch nach Kalyvia','1 Butter raus','Reis auf die Liste'],
  };
}

function helpUiContext(){
  const role = helpChatRole();
  const who = state.user || state.child;
  const base = {
    role,
    profileName: who?.name || '',
    profileId: who?.id || '',
    mode: state.mode,
    lang: state.lang,
    tab: state.mode==='child' ? state.childView : state.tab,
    scheduleView: state.scheduleView,
    houseFilter: state.houseFilter,
    canMutate: role==='staff' || role==='admin',
    admin: role==='admin',
    permissions: {
      role,
      canMutateStock: role==='staff' || role==='admin',
      canMutateShopping: role==='staff' || role==='admin',
      canEditPermanentSchedule: role==='admin',
      canEditShifts: role==='admin',
      canUseAdminCenter: role==='admin',
      canPlayGames: role==='child',
    },
  };
  if(role==='child' && state.child){
    const today = state.date || iso(new Date());
    base.childView = state.childView;
    base.myTodayCount = childEntriesFor(today, state.child.id).length;
    base.myEventsCount = childEventsFor(state.child.id).length;
    base.availableGames = CHILD_GAMES.map(g=>({id:g.id, title:t(g.titleKey), best:readGameBest(g.id)||0, featured:!!g.featured}));
    base.currentGame = state.gameId || null;
    base.gameCoach = state.gameCoach || null;
    base.learnTopic = (typeof readLearnTopic==='function' ? readLearnTopic() : null);
    base.learnWeakCount = (typeof readLearnWeak==='function' ? readLearnWeak().length : 0);
    const unfinished = base.learnTopic && base.learnTopic!=='all' ? base.learnTopic : null;
    const bests = Object.fromEntries(CHILD_GAMES.map(g=>[g.id, readGameBest(g.id)||0]));
    const suggest = [];
    if(unfinished) suggest.push({game:'learn', reason:'unfinished_topic', topic:unfinished});
    if((bests.learn||0)<80) suggest.push({game:'learn', reason:'practice'});
    if((bests.math||0)<60) suggest.push({game:'math', reason:'level_up'});
    if((bests.catch||0)<30) suggest.push({game:'catch', reason:'fun'});
    if(!suggest.length) suggest.push({game:'quiz', reason:'variety'});
    base.playSuggestions = suggest.slice(0,3);
  }
  if(role==='staff' || role==='admin'){
    base.inventory = helpInventoryContext();
    base.activeDate = state.date || iso(new Date());
    base.blocks = BLOCKS.map(b=>({id:b.id, from:b.from, to:b.to, by:b.by}));
    base.activities = (DB.activities||[]).slice(0,80).map(a=>({id:a.id, name:L(a)}));
    base.employees = (DB.employees||[]).map(e=>({id:e.id, name:e.name}));
    base.houses = (DB.houses||[]).map(h=>({id:h.id, name:h.short||h.name}));
    base.todaySchedule = entriesFor(base.activeDate).filter(e=>!e.cancelled).slice(0,40).map(e=>({
      id:e.id, block:e.block, activity:actLabel(e.activityId), activityId:e.activityId,
      time:entryTime(e), houses:entryHouseIds(e), people:entryEmployeeIds(e), source:e.source,
    }));
    base.examples = state.lang==='el'
      ? ['πρόσθεσε 2 γάλα στο Kalyvia','βάλε ρύζι στη λίστα','βάλε αύριο απόγευμα ποδόσφαιρο για τη Μαρία']
      : ['2 Milch nach Kalyvia','Reis auf die Liste','trag morgen Nachmittag Fußball für Maria ein'];
  }
  return base;
}

function bindVoiceInput({input, mic, statusEl, onTranscript}={}){
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  let recognition=null, listening=false, starting=false, mediaStream=null;
  const setStatus=(text, show=true)=>{
    if(!statusEl) return;
    statusEl.hidden=!show;
    statusEl.textContent=text||'';
  };
  const setListening=on=>{
    listening=on;
    if(mic) mic.classList.toggle('on', on);
    if(on) setStatus(t('helpVoiceListening'), true);
  };
  const releaseMic=()=>{
    if(mediaStream){
      try{ mediaStream.getTracks().forEach(track=>track.stop()); }catch{}
      mediaStream=null;
    }
  };
  const stop=()=>{
    starting=false;
    if(recognition){
      try{ recognition.onresult=null; recognition.onerror=null; recognition.onend=null; recognition.stop(); }catch{}
      recognition=null;
    }
    releaseMic();
    setListening(false);
  };
  const applyTranscript=transcript=>{
    const text=String(transcript||'').trim();
    if(!text) return;
    if(input){
      input.value=(input.value?`${input.value.trim()} `:'')+text;
      try{ input.focus({preventScroll:true}); }catch{ input.focus(); }
      input.dispatchEvent(new Event('input',{bubbles:true}));
    }
    setStatus(t('helpVoiceReady'), true);
    feedback('select');
    onTranscript?.(text);
  };
  const ensureMicPermission=async()=>{
    // Intentionally unused on iOS — getUserMedia before start() breaks Safari speech.
  };
  if(mic){
    if(!SpeechRecognition || (!window.isSecureContext && location.hostname!=='localhost' && location.hostname!=='127.0.0.1')){
      mic.disabled = !SpeechRecognition;
      mic.title = t(!SpeechRecognition ? 'helpVoiceUnsupported' : 'helpVoiceSecure');
    }
    mic.onclick=()=>{
    if(starting) return;
    if(!SpeechRecognition){ toast(t('helpVoiceUnsupported'),'error'); return; }
    if(!window.isSecureContext && location.hostname!=='localhost' && location.hostname!=='127.0.0.1'){
      toast(t('helpVoiceSecure'),'error',5200); return;
    }
    if(listening){ stop(); return; }
    starting=true;
    setStatus(t('helpVoiceStart'), true);
    try{
      // Must start inside the user gesture — do not await getUserMedia first.
      recognition=new SpeechRecognition();
      recognition.lang=state.lang==='el'?'el-GR':'de-DE';
      recognition.interimResults=true;
      recognition.continuous=false;
      recognition.maxAlternatives=1;
      let gotFinal=false;
      recognition.onstart=()=>{
        starting=false;
        setListening(true);
        feedback('tap');
      };
      recognition.onend=()=>{
        starting=false;
        setListening(false);
        recognition=null;
      };
      recognition.onerror=event=>{
        starting=false;
        setListening(false);
        const code=event?.error||'';
        if(code==='aborted' || code==='no-speech') return;
        if(code==='not-allowed' || code==='service-not-allowed'){
          toast(t('helpVoiceDenied'),'error',5200); setStatus(t('helpVoiceDenied'), true); return;
        }
        if(code==='network'){ toast(t('errNetwork'),'error'); return; }
        toast(t('helpVoiceError'),'error');
      };
      recognition.onresult=event=>{
        let interim='', final='';
        for(let i=event.resultIndex;i<event.results.length;i++){
          const piece=event.results[i][0]?.transcript||'';
          if(event.results[i].isFinal) final+=piece;
          else interim+=piece;
        }
        if(interim && !final){ setStatus(`${interim.trim()}…`, true); return; }
        const transcript=(final||interim).trim();
        if(!transcript) return;
        const last=event.results[event.results.length-1];
        if(last && !last.isFinal && !final) return;
        if(gotFinal) return;
        gotFinal=true;
        applyTranscript(transcript);
        try{ recognition.stop(); }catch{}
      };
      recognition.start();
      setTimeout(()=>{ if(starting){ starting=false; } }, 2500);
    }catch(error){
      starting=false;
      setListening(false);
      if(error?.code==='insecure' || error?.name==='SecurityError'){
        toast(t('helpVoiceSecure'),'error',5200); setStatus(t('helpVoiceSecure'), true);
      }else if(error?.name==='NotAllowedError' || error?.name==='PermissionDeniedError'){
        toast(t('helpVoiceDenied'),'error',5200); setStatus(t('helpVoiceDenied'), true);
      }else{
        toast(t('helpVoiceError'),'error');
      }
    }
  };
  }
  return {stop, isListening:()=>listening};
}

function matchActivity(query){
  const n = norm(query||'');
  if(!n) return null;
  const list = DB.activities||[];
  for(const a of list){
    if([a.de,a.el,a.en,a.id].filter(Boolean).some(k=>norm(k)===n)) return a;
  }
  let best=null, bestDiff=Infinity;
  for(const a of list){
    for(const k of [a.de,a.el,a.en].filter(Boolean)){
      const kn=norm(k);
      if(kn.includes(n) || n.includes(kn)){
        const diff=Math.abs(kn.length-n.length);
        if(diff<bestDiff){ best=a; bestDiff=diff; }
      }else{
        const d=lev(n, kn);
        if(d<=2 && d<bestDiff){ best=a; bestDiff=d; }
      }
    }
  }
  return best;
}

function matchEmployee(query){
  const n=norm(query||'');
  if(!n) return null;
  return (DB.employees||[]).find(e=>norm(e.name)===n || norm(e.name).includes(n))||null;
}

function helpActionsNeedPin(actions){
  return (actions||[]).some(a=>String(a.type||'').startsWith('schedule'));
}

function findScheduleEntryForAction(action){
  const date=String(action.date||'').trim();
  if(!date) return null;
  let list=entriesFor(date).filter(e=>!e.cancelled);
  if(action.entryId){
    const hit=list.find(e=>e.id===action.entryId);
    if(hit) return hit;
  }
  if(action.block) list=list.filter(e=>e.block===action.block);
  const actMatched=action.activityId ? act(action.activityId) : matchActivity(action.activityQuery||'');
  if(actMatched) list=list.filter(e=>e.activityId===actMatched.id);
  else if(action.activityQuery){
    const q=norm(action.activityQuery);
    list=list.filter(e=>norm(actLabel(e.activityId)).includes(q) || norm(e.note||'').includes(q));
  }
  if(action.employeeId) list=list.filter(e=>entryEmployeeIds(e).includes(action.employeeId));
  if(action.houseId) list=list.filter(e=>entryHouseIds(e).includes(action.houseId));
  return list[0]||null;
}

function resolveActivityId(action){
  if(action.activityId && act(action.activityId)) return action.activityId;
  return matchActivity(action.activityQuery||'')?.id || null;
}

function describeHelpAction(action){
  const query=action.productQuery||action.name||'';
  const product=matchProduct(query);
  const name=product?L(product):(action.name||query||'?');
  const unit=action.unit||product?.unit||'Stk';
  const hid=action.houseId||shopHouse();
  const houseName=house(hid)?.short||hid;
  if(action.type==='stock_adjust') return T[state.lang].helpActionStock(action.dir||'IN', action.qty||1, unit, name, houseName);
  if(action.type==='stock_set') return T[state.lang].helpActionStockSet(action.qty??0, unit, name, houseName);
  if(action.type==='want_bought') return T[state.lang].helpActionWantBought(name, houseName);
  if(action.type==='shop_add') return T[state.lang].helpActionShopAdd(action.qty||1, unit, name, houseName);
  if(action.type==='shop_remove') return T[state.lang].helpActionShopRemove(name, houseName);
  if(action.type==='shift_note') return T[state.lang].helpActionShiftNote(action.text||'');
  if(action.type==='open_tab') return T[state.lang].helpActionOpenTab(action.tab||'');
  if(action.type==='subject_grade_set'){
    const k=matchKid(action.kidQuery||action.kidId); const s=matchSubject(action.subjectQuery||action.subjectId);
    return state.lang==='el'
      ? `★ ${k?.name||'?'} · ${subjectLabel(s)} · ${action.score||'?'} αστέρια`
      : `★ ${k?.name||'?'} · ${subjectLabel(s)} · ${action.score||'?'} Sterne`;
  }
  if(action.type==='kid_note_add'){
    const k=matchKid(action.kidQuery||action.kidId);
    return state.lang==='el' ? `📝 Σημείωση · ${k?.name||'?'}` : `📝 Notiz · ${k?.name||'?'}`;
  }
  if(action.type==='open_kid'){
    const k=matchKid(action.kidQuery||action.kidId);
    return state.lang==='el' ? `↗ Προφίλ ${k?.name||'?'}` : `↗ Profil ${k?.name||'?'}`;
  }
  if(action.type==='attendance_set'){
    const k=matchKid(action.kidQuery||action.kidId);
    return state.lang==='el' ? `✓ Παρουσία ${k?.name||'?'}` : `✓ Anwesenheit ${k?.name||'?'}`;
  }
  if(action.type==='homework_add'){
    return state.lang==='el' ? `📚 Εργασία: ${String(action.title||'').slice(0,40)}` : `📚 Hausaufgabe: ${String(action.title||'').slice(0,40)}`;
  }
  if(action.type==='broadcast_email'){
    return state.lang==='el'
      ? `✉️ Email σε ${action.audience||'all'}: ${String(action.subject||'').slice(0,60)}`
      : `✉️ E-Mail an ${action.audience||'all'}: ${String(action.subject||'').slice(0,60)}`;
  }
  if(action.type==='event_announce'){
    return state.lang==='el' ? '📣 Άνοιγμα εργαλείων Event' : '📣 Event-Tools öffnen';
  }
  if(action.type==='schedule_add' || action.type==='schedule_template_add'){
    const actId=resolveActivityId(action);
    const what=actId?actLabel(actId):(action.activityQuery||'?');
    const block=t(action.block||'afternoon');
    const who=[
      action.employeeId?emp(action.employeeId)?.name:'',
      action.houseId?house(action.houseId)?.short:'',
    ].filter(Boolean).join(' · ');
    if(action.type==='schedule_template_add'){
      const dayName=DAY_LONG[state.lang][Number(action.day)||0]||String(action.day);
      return T[state.lang].helpActionScheduleTemplate(dayName, block, what);
    }
    return T[state.lang].helpActionScheduleAdd(action.date||'', block, what, who);
  }
  if(action.type==='schedule_update' || action.type==='schedule_template_update'){
    const hit=action.type==='schedule_template_update'
      ? (DB.template||[]).find(x=>x.id===action.entryId)
      : findScheduleEntryForAction(action);
    const what=hit?actLabel(hit.activityId):(action.activityQuery||action.entryId||'?');
    return T[state.lang].helpActionScheduleUpdate(action.date||t('scopeTemplate'), what);
  }
  if(action.type==='schedule_cancel'){
    const hit=findScheduleEntryForAction(action);
    const what=hit?actLabel(hit.activityId):(action.activityQuery||'?');
    return T[state.lang].helpActionScheduleCancel(action.date||'', what);
  }
  return name;
}

function applyHelpActions(actions){
  if(state.mode!=='staff' || !state.user){ toast(t('helpProposeDenied'),'error'); return 0; }
  let applied=0;
  actions.forEach(action=>{
    const kind=action.type;
    if(kind==='stock_adjust' || kind==='stock_set' || kind==='want_bought' || kind==='shop_add' || kind==='shop_remove'){
      const query=action.productQuery||action.name||'';
      const product=matchProduct(query);
      const hid=action.houseId && house(action.houseId) ? action.houseId : shopHouse();
      if(kind==='stock_adjust' || kind==='stock_set'){
        const qty=Number(action.qty); if(!(qty>=0) || (kind==='stock_adjust' && qty<=0)) return;
        const p=product||{id:null,unit:action.unit||'Stk',de:query,el:query};
        if(!product){
          DB.customProducts ||= [];
          const created={id:'cp-'+uid(),cat:'custom',de:query,el:query,unit:action.unit||'Stk',alias:[]};
          DB.customProducts.push(created);
          Object.assign(p, created);
        }
        const key=stockKey(hid,p.id);
        const prev=DB.stock[key]??0;
        if(kind==='stock_set'){
          const next=Math.max(0, Math.round(qty*100)/100);
          DB.stock[key]=next;
          const delta=Math.round((next-prev)*100)/100;
          if(delta!==0){
            logEntry(delta>0?'IN':'OUT',
              `Zo-Ai · ${describeHelpAction(action)}`,
              {houseId:hid, reason:action.reason||'Zo-Ai', items:[{pid:p.id, qty:Math.abs(delta)}]});
          }
          applied++;
          return;
        }
        const delta=action.dir==='OUT'?-qty:qty;
        DB.stock[key]=Math.max(0, Math.round(((DB.stock[key]??0)+delta)*100)/100);
        logEntry(action.dir==='OUT'?'OUT':'IN',
          `Zo-Ai · ${describeHelpAction(action)}`,
          {houseId:hid, reason:action.reason||'Zo-Ai', items:[{pid:p.id, qty}]});
        applied++;
        return;
      }
      if(kind==='want_bought'){
        const pid=product?.id;
        if(!pid){ return; }
        if(requestWantBought(pid, hid)) applied++;
        return;
      }
      if(kind==='shop_add'){
        const qty=Number(action.qty)||1;
        const nm=product?L(product):(action.name||query);
        const unit=action.unit||product?.unit||'Stk';
        const friday=state.shopFriday||fridayFor();
        const existing=fridayEntries(hid,friday).find(e=>e.status==='open'&&((product&&e.productId===product.id)||norm(e.name)===norm(nm)));
        if(existing) existing.qty=Math.round((Number(existing.qty)+qty)*100)/100;
        else DB.listEntries.push({id:uid(),productId:product?.id||null,name:nm,qty,unit,houseId:hid,fridayDate:friday,by:state.user.id,status:'open'});
        logEntry('SHOP',`Zo-Ai · ${describeHelpAction(action)}`,{houseId:hid});
        applied++;
        return;
      }
      if(kind==='shop_remove'){
        const before=DB.listEntries.length;
        DB.listEntries=DB.listEntries.filter(e=>{
          if(e.houseId!==hid || !['open','pending'].includes(e.status)) return true;
          if(product && e.productId===product.id) return false;
          return norm(e.name)!==norm(query);
        });
        if(DB.listEntries.length!==before){
          logEntry('SHOP',`Zo-Ai · ${describeHelpAction(action)}`,{houseId:hid});
          applied++;
        }
      }
      return;
    }

    if(kind==='shift_note'){
      const text=String(action.text||'').trim();
      if(!text || !state.user) return;
      const dateStr=iso(new Date());
      const key=typeof shiftNoteKey==='function'?shiftNoteKey(state.user.id, dateStr):`${state.user.id}:${dateStr}`;
      DB.shiftNotes ||= {};
      const prev=DB.shiftNotes[key];
      const merged=prev?.text ? `${prev.text}\n${text}` : text;
      DB.shiftNotes[key]={id:key, employeeId:state.user.id, date:dateStr, text:merged.slice(-4000), ts:Date.now()};
      logEntry('SHIFT',`Zo-Ai · ${describeHelpAction(action)}`,{date:dateStr});
      applied++;
      return;
    }

    if(kind==='open_tab'){
      const tab=String(action.tab||'').trim();
      if(!['home','gallery','schedule','stock','shop','book','talk','kids'].includes(tab)) return;
      state.tab=tab;
      if(tab==='schedule' && action.open==='events') state.scheduleView='events';
      applied++;
      return;
    }

    if(kind==='broadcast_email'){
      if(!isAdminUser()) return;
      state._broadcastDraft={
        audience:action.audience||'all',
        subject:action.subject||'',
        title:action.title||action.subject||'',
        message:action.message||'',
      };
      queueMicrotask(()=>sheetBroadcastEmail());
      applied++;
      return;
    }

    if(kind==='event_announce'){
      if(!isAdminUser()) return;
      state.tab='schedule';
      state.scheduleView='events';
      applied++;
      return;
    }

    if(kind==='schedule_add'){
      const activityId=resolveActivityId(action);
      if(!activityId || !action.date || !action.block) return;
      const def=blockDef(action.block); if(!def) return;
      const employeeId=action.employeeId && emp(action.employeeId) ? action.employeeId
        : (action.employeeQuery ? matchEmployee(action.employeeQuery)?.id : null);
      const houseId=action.houseId && house(action.houseId) ? action.houseId : null;
      const from=action.from||'', to=action.to||'';
      DB.overrides.push({
        id:uid(), date:action.date, templateId:null, block:action.block,
        houseId, houseIds:houseId?[houseId]:[],
        employeeId:employeeId||null, employeeIds:employeeId?[employeeId]:[],
        childIds:Array.isArray(action.childIds)?action.childIds:[],
        activityId, from, to, note:action.note||'',
      });
      logEntry('SCHEDULE',`Zo-Ai · ${describeHelpAction(action)}`);
      applied++;
      return;
    }

    if(kind==='schedule_update'){
      const hit=findScheduleEntryForAction(action);
      if(!hit) return;
      const patch={};
      const activityId=resolveActivityId(action);
      if(activityId) patch.activityId=activityId;
      if(action.block && blockDef(action.block)) patch.block=action.block;
      if(action.from!=null) patch.from=action.from;
      if(action.to!=null) patch.to=action.to;
      if(action.note!=null) patch.note=action.note;
      if(action.houseId && house(action.houseId)){
        patch.houseId=action.houseId; patch.houseIds=[action.houseId];
      }
      if(action.employeeId && emp(action.employeeId)){
        patch.employeeId=action.employeeId; patch.employeeIds=[action.employeeId];
      }
      if(hit.source==='template'){
        const ex=DB.overrides.find(o=>o.date===action.date && o.templateId===hit.id);
        if(ex) Object.assign(ex, patch, {cancelled:false});
        else DB.overrides.push({id:uid(), date:action.date, templateId:hit.id, ...patch});
      }else{
        const ex=DB.overrides.find(o=>o.id===hit.id);
        if(ex) Object.assign(ex, patch);
      }
      logEntry('SCHEDULE',`Zo-Ai · ${describeHelpAction(action)}`);
      applied++;
      return;
    }

    if(kind==='schedule_cancel'){
      const hit=findScheduleEntryForAction(action);
      if(!hit) return;
      applyCancelScheduleEntry(hit, action.date);
      logEntry('AI',`Zo-Ai · ${describeHelpAction(action)}`);
      applied++;
      return;
    }

    if(kind==='schedule_template_add'){
      if(!isAdminUser()) return;
      const activityId=resolveActivityId(action);
      const day=Number(action.day);
      if(!activityId || !action.block || !(day>=0 && day<=6)) return;
      const employeeId=action.employeeId && emp(action.employeeId) ? action.employeeId : null;
      const houseId=action.houseId && house(action.houseId) ? action.houseId : null;
      DB.template.push({
        id:'t'+uid(), day, block:action.block,
        houseId, employeeId,
        childIds:Array.isArray(action.childIds)?action.childIds:[],
        activityId, note:action.note||'', time:'',
        from:action.from||'', to:action.to||'',
      });
      logEntry('SCHEDULE',`Zo-Ai · ${describeHelpAction(action)}`);
      applied++;
      return;
    }


    if(kind==='subject_grade_set'){
      const k=matchKid(action.kidQuery||action.kidId);
      const s=matchSubject(action.subjectQuery||action.subjectId);
      if(!k||!s) return;
      if(setSubjectGrade(k.id, s.id, action.score, action.note)){
        logEntry('SCHOOL',`Zo-Ai · ${describeHelpAction(action)}`);
        applied++;
      }
      return;
    }
    if(kind==='kid_note_add'){
      const k=matchKid(action.kidQuery||action.kidId);
      const text=String(action.text||'').trim();
      if(!k||!text) return;
      ensureSchoolDb();
      DB.kidNotes.push({id:uid(), kidId:k.id, text:text.slice(0,2000), ts:Date.now(), by:state.user?.id});
      logEntry('SCHOOL',`Zo-Ai · ${describeHelpAction(action)}`);
      applied++;
      return;
    }
    if(kind==='open_kid'){
      const k=matchKid(action.kidQuery||action.kidId);
      if(!k) return;
      state.tab='kids'; state.staffKidId=k.id; applied++;
      return;
    }
    if(kind==='attendance_set'){
      const k=matchKid(action.kidQuery||action.kidId);
      const dateStr=action.date||iso(new Date());
      if(!k) return;
      if(setAttendance(k.id, dateStr, action.status||'present')){
        logEntry('SCHOOL',`Zo-Ai · ${describeHelpAction(action)}`);
        applied++;
      }
      return;
    }
    if(kind==='homework_add'){
      const title=String(action.title||'').trim();
      if(!title) return;
      const s=matchSubject(action.subjectQuery||action.subjectId);
      const k=action.kidQuery||action.kidId ? matchKid(action.kidQuery||action.kidId) : null;
      ensureSchoolDb();
      DB.homework.push({
        id:uid(), title:title.slice(0,120), subjectId:s?.id||'',
        kidId:k?.id||null, due:action.due||iso(new Date()), done:false, ts:Date.now(),
      });
      logEntry('SCHOOL',`Zo-Ai · ${describeHelpAction(action)}`);
      applied++;
      return;
    }

    if(kind==='schedule_template_update'){
      if(!isAdminUser()) return;
      const row=(DB.template||[]).find(x=>x.id===action.entryId);
      if(!row) return;
      const activityId=resolveActivityId(action);
      if(activityId) row.activityId=activityId;
      if(action.block && blockDef(action.block)) row.block=action.block;
      if(action.day!=null && action.day>=0 && action.day<=6) row.day=Number(action.day);
      if(action.from!=null) row.from=action.from;
      if(action.to!=null) row.to=action.to;
      if(action.note!=null) row.note=action.note;
      if(action.houseId && house(action.houseId)) row.houseId=action.houseId;
      if(action.employeeId && emp(action.employeeId)) row.employeeId=action.employeeId;
      logEntry('SCHEDULE',`Zo-Ai · ${describeHelpAction(action)}`);
      applied++;
    }
  });
  if(applied) save();
  return applied;
}

function openZoAiPinConfirm(title, onOk){
  const who=state.user;
  if(!who){ toast(t('helpProposeDenied'),'error'); return; }
  let buf='';
  let busy=false;
  openSheet(`<div class="import-kicker">Zo-Ai</div>
    <h3 style="margin:4px 0 8px">${esc(title)}</h3>
    <p class="muted" style="margin:0 0 12px">${esc(t('helpProposeNeedPin'))}</p>
    <div class="pindots" id="zoPinDots">${'<i></i>'.repeat(6)}</div>
    <div class="pinpad" id="zoPinPad">
      ${[1,2,3,4,5,6,7,8,9,'clr',0,'del'].map(k=>
        `<button type="button" data-k="${k}">${k==='clr'?'C':k==='del'?'⌫':k}</button>`).join('')}
    </div>
    <div class="status-box error" id="zoPinErr" style="display:none"></div>
    <div class="row" style="gap:8px;margin-top:10px">
      <button class="btn sec" type="button" id="zoPinCancel">${t('helpProposeCancel')}</button>
      <button class="btn" type="button" id="zoPinOk">${t('helpProposeConfirm')}</button>
    </div>`);
  const dots=()=>sheetEl.querySelectorAll('#zoPinDots i').forEach((el,i)=>el.classList.toggle('f', i<buf.length));
  const err=sheetEl.querySelector('#zoPinErr');
  const trySubmit=async()=>{
    if(busy || buf.length<4){ err.style.display='block'; err.textContent=t('wrongPin'); return; }
    busy=true;
    err.style.display='none';
    try{
      await authenticateProfile('staff', who, buf);
      closeSheet();
      onOk(state.user||who);
    }catch{
      err.style.display='block';
      err.textContent=t('wrongPin');
      buf='';
      dots();
      busy=false;
    }
  };
  sheetEl.querySelector('#zoPinCancel').onclick=()=>closeSheet();
  sheetEl.querySelector('#zoPinOk').onclick=()=>trySubmit();
  sheetEl.querySelectorAll('#zoPinPad [data-k]').forEach(btn=>{
    btn.onclick=()=>{
      if(busy) return;
      const k=btn.dataset.k;
      if(k==='del') buf=buf.slice(0,-1);
      else if(k==='clr') buf='';
      else if(/^\d$/.test(k) && buf.length<6) buf+=k;
      dots();
      if(buf.length===6) trySubmit();
    };
  });
  dots();
}

function sheetHelpProposals(actions, {inline=false, onDone=null}={}){
  if(!actions?.length){ toast(t('helpProposeEmpty')); return; }
  if(state.mode!=='staff' || !state.user){ toast(t('helpProposeDenied'),'error'); return; }
  state.pendingHelpActions=[...actions];
  const needPin=helpActionsNeedPin(actions);
  const confirm=()=>{
    const run=who=>{
      state.user=who;
      const n=applyHelpActions(state.pendingHelpActions);
      state.pendingHelpActions=[];
      if(n){
        state.helpMessages.push({role:'assistant', content:T[state.lang].helpProposeDone(n)});
        state.helpMessages=state.helpMessages.slice(-12);
        render();
        const kinds=new Set((actions||[]).map(a=>a.type));
        let msg=T[state.lang].helpProposeDone(n);
        if(kinds.has('stock_adjust')||kinds.has('stock_set')) msg=t('zoSavedLager');
        else if(kinds.has('shop_add')||kinds.has('shop_remove')||kinds.has('want_bought')) msg=t('zoSavedListe');
        else if(String([...kinds].join()).includes('schedule')) msg=t('zoSavedPlan');
        else if(kinds.has('subject_grade_set')||kinds.has('attendance_set')||kinds.has('homework_add')) msg=t('zoSavedSchool');
        else if(kinds.has('kid_note_add')) msg=t('zoSavedNote');
        toast(msg,'success',4200);
      }else toast(t('helpProposeEmpty'));
      onDone?.(n);
    };
    if(needPin) askPin(t('helpProposeConfirm'), run, {requirePin:true});
    else askPin(t('helpProposeConfirm'), run);
  };
  const discard=()=>{
    state.pendingHelpActions=[];
    onDone?.(0);
  };
  if(inline){
    const box=document.querySelector('#chatBody #helpProposeBox')
      || document.querySelector('#helpProposeBox')
      || sheetEl.querySelector('#helpProposeBox');
    if(!box){
      // Never auto-apply — fall back to sheet confirm UI.
      inline=false;
    }else{
      box.hidden=false;
      box.innerHTML=`<div class="help-propose-inline"><div class="strong">${esc(t('helpProposeTitle'))}</div>
        <div class="muted" style="font-size:11.5px;margin:4px 0 8px">${esc(t('helpProposeHint'))}${needPin?' · '+esc(t('helpProposeNeedPin')):''}</div>
        <div class="help-propose-list">${actions.map((action,i)=>`<div class="help-propose-row"><b>${i+1}.</b><span>${esc(describeHelpAction(action))}</span></div>`).join('')}</div>
        <div class="row" style="gap:8px;margin-top:10px">
          <button class="btn sec" id="helpProposeCancel" type="button">${t('helpDiscardInline')}</button>
          <button class="btn" id="helpProposeConfirm" type="button">✓ ${t('helpConfirmInline')}</button>
        </div></div>`;
      box.querySelector('#helpProposeCancel').onclick=()=>{ box.hidden=true; discard(); };
      box.querySelector('#helpProposeConfirm').onclick=()=>{ box.hidden=true; confirm(); };
      try{ box.scrollIntoView({behavior:'smooth', block:'nearest'}); }catch{}
      return;
    }
  }
  openSheet(`<div class="help-center-hero"><div class="import-kicker">Zo-Ai</div><h2>${t('helpProposeTitle')}</h2><p>${t('helpProposeHint')}${needPin?' · '+t('helpProposeNeedPin'):''}</p></div>
    <div class="help-propose-list">${actions.map((action,i)=>`<div class="help-propose-row"><b>${i+1}.</b><span>${esc(describeHelpAction(action))}</span></div>`).join('')}</div>
    <div class="row" style="gap:8px;margin-top:14px"><button class="btn sec" id="helpProposeCancel" type="button">${t('helpProposeCancel')}</button>
      <button class="btn" id="helpProposeConfirm" type="button">${t('helpProposeConfirm')}</button></div>`);
  sheetEl.querySelector('#helpProposeCancel').onclick=()=>{ discard(); closeSheet(); };
  sheetEl.querySelector('#helpProposeConfirm').onclick=()=>{ confirm(); closeSheet(); };
}

function sheetHelp(){
  loadHelpTranscriptForCurrentUser();
  if(!state.helpMessages.length){
    state.helpMessages.push({role:'assistant', content:helpWelcomeMessage()});
    persistHelpTranscript();
  }
  let voice=null;
  const role = helpChatRole();
  const canMutate = role==='staff' || role==='admin';
  const paint = () => {
    const log = sheetEl.querySelector('#helpLog');
    if(!log) return;
    log.innerHTML = state.helpMessages.map(m =>
      `<div class="chat-msg ${m.role==='user'?'user':'assistant'}">${esc(m.content)}</div>`).join('');
    log.scrollTop = log.scrollHeight;
    persistHelpTranscript();
  };
  const quickPrompts = role==='child'
    ? (state.lang==='el'
        ? ['Τι έχω σήμερα;','Πού είναι το επόμενο event;','Πώς παίζω Μνήμη;']
        : ['Was habe ich heute?','Wann ist mein nächstes Event?','Wie spiele ich Memory?'])
    : role==='admin'
      ? (state.lang==='el'
          ? ['πρόσθεσε 2 γάλα στο Kalyvia','πώς αλλάζω το μόνιμο πρόγραμμα;','άνοιξε το κέντρο διαχείρισης']
          : ['2 Milch nach Kalyvia','Wie ändere ich den Dauerplan?','Wo ist die Admin-Zentrale?'])
      : (state.lang==='el'
          ? ['πρόσθεσε 2 γάλα στο Kalyvia','βγάλε 1 βούτυρο Limenaria','βάλε ρύζι στη λίστα']
          : ['2 Milch nach Kalyvia','1 Butter raus Limenaria','Reis auf die Liste']);
  const quickLabel = role==='child' ? t('helpQuickChild') : role==='admin' ? t('helpQuickAdmin') : t('helpQuickFood');
  const quick=`<div class="chips help-quick" id="helpQuick" style="margin:0 0 10px">
      <span class="muted" style="width:100%;font-size:11px">${esc(quickLabel)}</span>
      ${quickPrompts.map(q=>`<button class="chip" type="button" data-q="${esc(q)}">${esc(q)}</button>`).join('')}
    </div>`;
  openSheet(`<div class="row between" style="align-items:flex-start;gap:10px;margin-bottom:8px">
      <h3 style="margin:0">${ui('u-sparkle')} ${t('helpChat')}</h3>
      <span class="help-role-pill ${esc(role)}">${esc(helpRoleLabel())}</span>
    </div>
    <div class="status error" id="helpConfigStatus" hidden style="margin:0 0 10px"></div>
    ${quick}
    <div class="chat-log" id="helpLog" aria-live="polite"></div>
    <div id="helpProposeBox" class="help-propose-box" hidden></div>
    <div class="chat-compose">
      <textarea id="helpInput" rows="1" placeholder="${esc(t('helpPlaceholder'))}"></textarea>
      <button class="chat-mic" id="helpMic" type="button" aria-label="${esc(t('helpVoice'))}" title="${esc(t('helpVoice'))}">🎤</button>
      <button class="btn" id="helpSend" type="button">${t('helpSend')}</button>
    </div>
    <div class="chat-voice-status" id="helpVoiceStatus" hidden></div>`);
  paint();
  fetch('/api/health',{credentials:'same-origin'}).then(r=>r.json()).then(health=>{
    const banner=sheetEl.querySelector('#helpConfigStatus');
    if(!banner || health?.aiConfigured!==false) return;
    banner.hidden=false;
    banner.textContent=t('helpConfigBanner');
  }).catch(()=>{});
  if(canMutate && state.pendingHelpActions?.length){
    sheetHelpProposals(state.pendingHelpActions,{inline:true,onDone:()=>paint()});
  }
  const input = sheetEl.querySelector('#helpInput');
  const send = sheetEl.querySelector('#helpSend');
  const submit = async () => {
    const content = input.value.trim();
    if(!content || send.disabled) return;
    voice?.stop();
    state.helpMessages.push({role:'user', content});
    state.helpMessages = state.helpMessages.slice(-12);
    persistHelpTranscript();
    input.value = ''; send.disabled = true;
    const mic=sheetEl.querySelector('#helpMic'); if(mic) mic.disabled=true;
    paint();
    const thinking = document.createElement('div');
    thinking.className = 'chat-msg assistant'; thinking.id = 'helpThinking';
    thinking.textContent = t('helpThinking');
    sheetEl.querySelector('#helpLog').appendChild(thinking);
    try{
      const response = await fetch('/api/chat', {
        method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin',
        body:JSON.stringify({
          messages:state.helpMessages.filter(m=>m.role==='user'||m.role==='assistant'),
          context:helpUiContext(),
        }),
      });
      const data = await response.json().catch(()=>({}));
      if(!response.ok){
        const error=new Error(data.detail || data.setup || data.error || String(response.status));
        error.status=response.status;
        error.code=data.code;
        error.detail=data.detail||data.setup||data.error;
        throw error;
      }
      state.helpMessages.push({role:'assistant', content:data.message || t('helpUnavailable')});
      state.helpMessages = state.helpMessages.slice(-12);
      persistHelpTranscript();
      paint();
      if(canMutate && Array.isArray(data.actions) && data.actions.length){
        sheetHelpProposals(data.actions,{inline:true,onDone:()=>paint()});
      }
    }catch(error){
      state.helpMessages.push({role:'assistant', content:friendlyAiError(error)});
      persistHelpTranscript();
      paint();
    }finally{
      send.disabled = false;
      if(mic) mic.disabled=false;
      input.focus();
    }
  };
  send.onclick = submit;
  sheetEl.querySelectorAll('#helpQuick [data-q]').forEach(b=>{
    b.onclick=()=>{ input.value=b.dataset.q; feedback('select'); submit(); };
  });
  input.onkeydown = e => {
    if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); submit(); }
  };
  voice=bindVoiceInput({
    input,
    mic:sheetEl.querySelector('#helpMic'),
    statusEl:sheetEl.querySelector('#helpVoiceStatus'),
  });
}

function sheetHelpCenter(){
  openSheet(`<div class="help-center-hero"><div class="import-kicker">Armonia Thassos</div><h2>${t('helpCenter')}</h2><p>${t('helpCenterHint')}</p></div>
    <div class="help-center-grid">
      <button class="help-center-card" id="helpTutorial" type="button"><span class="icon">📘</span><b>${t('startTutorial')}</b><span>${t('startTutorialHint')}</span></button>
    </div>
    <p class="muted" style="margin:14px 0 0;font-size:12.5px">${ui('u-sparkle')} ${esc(t('helpChat'))} · ${esc(t('navChat'))}</p>`);
  sheetEl.querySelector('#helpTutorial').onclick=openAppTutorial;
}

async function talkApi(action=null, extra={}){
  if(action){
    const response=await fetch('/api/talk',{
      method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
      body:JSON.stringify({action, byName:state.user?.name||'', ...extra}),
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok){ const err=new Error(data.error||String(response.status)); err.code=data.code; throw err; }
    return data;
  }
  const response=await fetch('/api/talk',{credentials:'same-origin'});
  const data=await response.json().catch(()=>({}));
  if(!response.ok){ const err=new Error(data.error||String(response.status)); err.code=data.code; throw err; }
  return data;
}

function galleryRelative(at){
  const ms = Date.now() - (Number(at)||0);
  if(ms < 60_000) return t('galleryJustNow');
  if(ms < 3_600_000) return t('galleryMinutes')(Math.max(1, Math.floor(ms/60_000)));
  if(ms < 86_400_000) return t('galleryHours')(Math.max(1, Math.floor(ms/3_600_000)));
  return t('galleryDays')(Math.max(1, Math.floor(ms/86_400_000)));
}

function compressGalleryPhoto(dataUrl, maxEdge=720, quality=0.58){
  return new Promise((resolve, reject)=>{
    const img = new Image();
    img.onerror = reject;
    img.onload = ()=>{
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const cv = document.createElement('canvas');
      cv.width = Math.max(1, Math.round(img.width * scale));
      cv.height = Math.max(1, Math.round(img.height * scale));
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      let q = quality;
      let out = cv.toDataURL('image/jpeg', q);
      while(out.length > 135_000 && q > 0.35){
        q -= 0.07;
        out = cv.toDataURL('image/jpeg', q);
      }
      if(out.length > 140_000){
        const scale2 = 560 / Math.max(cv.width, cv.height);
        if(scale2 < 1){
          const cv2 = document.createElement('canvas');
          cv2.width = Math.max(1, Math.round(cv.width * scale2));
          cv2.height = Math.max(1, Math.round(cv.height * scale2));
          cv2.getContext('2d').drawImage(cv, 0, 0, cv2.width, cv2.height);
          out = cv2.toDataURL('image/jpeg', 0.45);
        }
      }
      resolve(out);
    };
    img.src = dataUrl;
  });
}

async function galleryFileData(file){
  const raw = await new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = ()=> resolve(reader.result);
    reader.readAsDataURL(file);
  });
  return compressGalleryPhoto(String(raw));
}

async function galleryApi(action=null, extra={}){
  const who = state.user || state.child;
  if(action){
    const response = await fetch('/api/gallery', {
      method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin',
      body: JSON.stringify({
        action,
        byName: profileName(who) || who?.name || '',
        byColor: profileColor(who),
        ...extra,
      }),
    });
    const data = await response.json().catch(()=>({}));
    if(!response.ok){
      const err = new Error(data.error || String(response.status));
      err.code = data.code;
      throw err;
    }
    return data;
  }
  const response = await fetch('/api/gallery', {credentials:'same-origin'});
  const data = await response.json().catch(()=>({}));
  if(!response.ok){
    const err = new Error(data.error || String(response.status));
    err.code = data.code;
    throw err;
  }
  return data;
}

function applyGallerySnapshot(data){
  if(!data || !Array.isArray(data.posts)) return;
  state.galleryPosts = data.posts;
  state.galleryUpdatedAt = Number(data.updatedAt) || 0;
  state.galleryDrive = !!data.drive;
}

async function refreshGallery({silent=false}={}){
  if(!(state.user || state.child)) return;
  if(!silent) state.galleryLoading = true;
  try{
    const data = await galleryApi();
    applyGallerySnapshot(data);
  }catch{
    if(!silent) toast(t('galleryFail'), 'error');
  }finally{
    state.galleryLoading = false;
  }
}

function canDeleteGalleryPost(post){
  const me = currentProfileId();
  if(!me || !post) return false;
  if(post.by === me) return true;
  return state.mode === 'staff' && !!state.user;
}

function galleryPhotoSrc(photo){
  if(!photo) return '';
  if(String(photo).startsWith('/api/gallery/media/')) return photo;
  return photo;
}

function galleryPostCard(post, idx=0){
  const me = currentProfileId();
  const liked = (post.likes||[]).includes(me);
  const starred = (post.stars||[]).includes(me);
  const clapped = (post.claps||[]).includes(me);
  const likes = (post.likes||[]).length;
  const stars = (post.stars||[]).length;
  const claps = (post.claps||[]).length;
  const comments = post.comments||[];
  const role = post.byMode === 'child' ? t('galleryByKid') : t('galleryByStaff');
  const del = canDeleteGalleryPost(post);
  const canDelComment = (c)=> c.by===me || (state.mode==='staff' && !!state.user);
  const flagged = !!post.flagged;
  const showFlag = flagged && state.mode==='staff';
  const photoSrc = galleryPhotoSrc(post.photo);
  return `<article class="gal-post gal-enter ${flagged?'is-flagged':''}" style="--gal-i:${idx}" data-gal-id="${esc(post.id)}">
    <header class="gal-head">
      <span class="gal-ava" style="background:${esc(post.byColor||'#94a3b8')}">${esc((post.byName||'?').slice(0,2).toUpperCase())}</span>
      <div class="grow">
        <b>${esc(post.byName||'—')}</b>
        <div class="muted gal-meta">${esc(role)} · ${esc(galleryRelative(post.at))}${showFlag?` · ⚑ ${esc(t('galleryFlagged'))}`:''}</div>
      </div>
      ${post.by!==me?`<button class="chip ghost gal-report" type="button" data-gal-report="${esc(post.id)}" title="${esc(t('galleryReport'))}">⚑</button>`:''}
      ${del?`<button class="chip ghost gal-del" type="button" data-gal-del="${esc(post.id)}" aria-label="${esc(t('galleryDelete'))}">🗑</button>`:''}
    </header>
    <button class="gal-photo" type="button" data-gal-light="${esc(post.id)}" aria-label="photo">
      <img src="${esc(photoSrc)}" alt="" loading="lazy" decoding="async" referrerpolicy="same-origin">
    </button>
    ${post.caption?`<p class="gal-caption">${esc(post.caption)}</p>`:''}
    <footer class="gal-foot">
      <button class="gal-like ${liked?'on':''}" type="button" data-gal-like="${esc(post.id)}">
        ${liked?'❤️':'🤍'} ${likes?likes:''}
      </button>
      <button class="gal-like ${starred?'on star':''}" type="button" data-gal-star="${esc(post.id)}" title="${esc(t('galleryReactStar'))}">
        ${starred?'⭐':'☆'} ${stars?stars:''}
      </button>
      <button class="gal-like ${clapped?'on clap':''}" type="button" data-gal-clap="${esc(post.id)}" title="${esc(t('galleryReactClap'))}">
        👏 ${claps?claps:''}
      </button>
    </footer>
    <div class="gal-comments">
      ${comments.length?`<div class="muted gal-comments-count">${esc(t('galleryComments')(comments.length))}</div>`:''}
      ${comments.slice(-5).map(c=>`<div class="gal-comment" data-c-id="${esc(c.id)}">
        <b>${esc(c.byName||'—')}</b> ${esc(c.text)}
        ${canDelComment(c)?`<button class="gal-c-del" type="button" data-gal-cdel="${esc(post.id)}" data-cid="${esc(c.id)}" aria-label="${esc(t('galleryDelete'))}">×</button>`:''}
      </div>`).join('')}
      <form class="gal-comment-form" data-gal-comment="${esc(post.id)}">
        <input type="text" maxlength="80" placeholder="${esc(t('galleryCommentPh'))}" aria-label="${esc(t('galleryComment'))}">
        <button class="chip" type="submit">${esc(t('galleryCommentSend'))}</button>
      </form>
    </div>
  </article>`;
}

function viewGallery(){
  const posts = state.galleryPosts || [];
  const hasFeed = posts.length > 0;
  return `<div class="gal-shell">
    <div class="gal-hero ${hasFeed?'compact':''}">
      <div class="brand-kicker">Armonia Thassos</div>
      <h2>${t('galleryTitle')}</h2>
      ${hasFeed?'':`<p>${t('galleryHint')}</p><p class="gal-safe-line">${esc(t('gallerySafeHint'))}</p>`}
      <p class="gal-drive-line">${esc(state.galleryDrive?t('galleryDriveOn'):t('galleryDriveOff'))}</p>
    </div>
    <div class="gal-compose-bar">
      <button class="gal-fab" type="button" id="galShare" aria-label="${esc(t('galleryShare'))}">
        <span>${ui('u-camera')}</span><b>${esc(t('galleryNewPost'))}</b>
      </button>
      <button class="gal-refresh" type="button" id="galRefresh" aria-label="refresh">↻</button>
    </div>
    ${state.galleryLoading && !posts.length?`<div class="empty">${esc(t('galleryLoading'))}</div>`:''}
    <div class="gal-feed" id="galFeed">
      ${posts.length ? posts.map((p,i)=>galleryPostCard(p,i)).join('') : emptyState(ui('u-camera'), t('galleryEmpty'), t('galleryEmptyHint'), `<button class="btn" type="button" id="galEmptyShare">${esc(t('galleryComposeCta'))}</button>`)}
    </div>
    <div class="gal-lightbox" id="galLightbox" hidden>
      <button type="button" class="gal-lightbox-close" id="galLightClose" aria-label="${esc(t('close'))}">×</button>
      <img id="galLightImg" alt="">
    </div>
  </div>`;
}

function childGalleryView(){
  return viewGallery();
}

function bindGallery(root){
  if(!root) return;
  const openCompose=()=>{ feedback('select'); sheetGalleryCompose(); };
  root.querySelector('#galShare')?.addEventListener('click', openCompose);
  root.querySelector('#galEmptyShare')?.addEventListener('click', openCompose);
  root.querySelector('#galRefresh')?.addEventListener('click', async ()=>{
    feedback('select');
    await refreshGallery();
    render();
  });
  const openLight = (src)=>{
    const box = root.querySelector('#galLightbox');
    const img = root.querySelector('#galLightImg');
    if(!box||!img||!src) return;
    img.removeAttribute('crossorigin');
    img.src = src;
    box.hidden = false;
    box.classList.add('open');
    document.body.classList.add('gal-lightbox-open');
  };
  const closeLight = ()=>{
    const box = root.querySelector('#galLightbox');
    if(!box) return;
    box.hidden = true;
    box.classList.remove('open');
    document.body.classList.remove('gal-lightbox-open');
    const img = root.querySelector('#galLightImg');
    if(img){ img.removeAttribute('src'); img.removeAttribute('crossorigin'); }
  };
  root.querySelector('#galLightClose')?.addEventListener('click', closeLight);
  root.querySelector('#galLightbox')?.addEventListener('click', (ev)=>{
    if(ev.target.id==='galLightbox') closeLight();
  });
  root.querySelectorAll('[data-gal-light]').forEach(btn=>{
    let lastTap=0;
    const likeId=btn.dataset.galLight;
    btn.onclick = (ev)=>{
      const now=Date.now();
      if(now-lastTap<320){
        ev.preventDefault();
        lastTap=0;
        btn.classList.add('liked-burst');
        setTimeout(()=>btn.classList.remove('liked-burst'),420);
        (async()=>{
          try{
            const data=await galleryApi('like',{id:likeId});
            applyGallerySnapshot(data);
            feedback('save');
            render();
          }catch{ toast(t('galleryFail'),'error'); }
        })();
        return;
      }
      lastTap=now;
      setTimeout(()=>{
        if(Date.now()-lastTap>=300){
          const img=btn.querySelector('img');
          if(img?.src) openLight(img.currentSrc||img.src);
        }
      },300);
    };
  });
  root.querySelectorAll('[data-gal-like]').forEach(btn=>{
    btn.onclick = async ()=>{
      try{
        const data = await galleryApi('like', {id: btn.dataset.galLike});
        applyGallerySnapshot(data);
        feedback('save');
        render();
      }catch{ toast(t('galleryFail'), 'error'); }
    };
  });
  root.querySelectorAll('[data-gal-star]').forEach(btn=>{
    btn.onclick = async ()=>{
      try{
        const data = await galleryApi('react_star', {id: btn.dataset.galStar});
        applyGallerySnapshot(data);
        feedback('save');
        render();
      }catch{ toast(t('galleryFail'), 'error'); }
    };
  });
  root.querySelectorAll('[data-gal-clap]').forEach(btn=>{
    btn.onclick = async ()=>{
      try{
        const data = await galleryApi('react_clap', {id: btn.dataset.galClap});
        applyGallerySnapshot(data);
        feedback('save');
        render();
      }catch{ toast(t('galleryFail'), 'error'); }
    };
  });
  root.querySelectorAll('[data-gal-del]').forEach(btn=>{
    btn.onclick = async ()=>{
      if(!confirm(t('galleryDelete')+'?')) return;
      try{
        const data = await galleryApi('delete', {id: btn.dataset.galDel});
        applyGallerySnapshot(data);
        feedback('save');
        render();
      }catch{ toast(t('galleryFail'), 'error'); }
    };
  });
  root.querySelectorAll('[data-gal-report]').forEach(btn=>{
    btn.onclick = async ()=>{
      try{
        const data = await galleryApi('report', {id: btn.dataset.galReport, reason:'user_report'});
        applyGallerySnapshot(data);
        feedback('save');
        toast(t('galleryReportOk'), 'success');
        render();
      }catch{ toast(t('galleryFail'), 'error'); }
    };
  });
  root.querySelectorAll('[data-gal-cdel]').forEach(btn=>{
    btn.onclick = async ()=>{
      try{
        const data = await galleryApi('delete_comment', {id: btn.dataset.galCdel, commentId: btn.dataset.cid});
        applyGallerySnapshot(data);
        feedback('save');
        render();
      }catch{ toast(t('galleryFail'), 'error'); }
    };
  });
  root.querySelectorAll('form[data-gal-comment]').forEach(form=>{
    form.onsubmit = async (ev)=>{
      ev.preventDefault();
      const input = form.querySelector('input');
      const text = (input?.value||'').trim();
      if(!text) return;
      if(text.length>=4 && new Set(text.toLowerCase()).size<=1){
        toast(t('galleryBlocked'), 'error'); return;
      }
      try{
        const data = await galleryApi('comment', {id: form.dataset.galComment, text});
        applyGallerySnapshot(data);
        feedback('save');
        render();
      }catch(err){
        toast(err.code==='unsafe'?t('galleryBlocked'):t('galleryFail'), 'error');
      }
    };
  });
}

function sheetGalleryCompose(opts={}){
  let photo = opts.photo || null;
  const presetCaption = opts.caption || '';
  const topicHint = opts.topic || '';
  const gameHint = opts.game || '';
  openSheet(`<div class="gal-compose">
      <div class="import-kicker">Armonia</div>
      <h2>${t('galleryShare')}</h2>
      <p class="muted">${opts.game ? t('gameShareMomentHint') : t('galleryHint')}</p>
      <div class="gal-preview ${photo?'':'empty'}" id="galPreview">${photo?`<img src="${esc(photo)}" alt="">`:`<span>${ui('u-camera')}</span>`}</div>
      <div class="row" style="gap:8px;flex-wrap:wrap;margin:10px 0">
        <button class="btn sec sm" type="button" id="galPick">${t('galleryPick')}</button>
        <button class="btn sec sm" type="button" id="galCam">${t('galleryCamera')}</button>
        <button class="btn sec sm" type="button" id="galCaptionAi">${ui('u-sparkle')} ${t('galleryCaptionAi')}</button>
      </div>
      <input type="file" accept="image/*" id="galFile" hidden>
      <div id="galCamBox" hidden>
        <video id="galVideo" playsinline autoplay muted style="width:100%;border-radius:14px;background:#0f172a"></video>
        <button class="btn sm" type="button" id="galSnap" style="margin-top:8px">${t('galleryCamera')}</button>
      </div>
      <label class="f"><span>${t('galleryCaption')}</span>
        <textarea id="galCaption" rows="3" maxlength="280" placeholder="${esc(t('galleryCaptionPh'))}">${esc(presetCaption)}</textarea>
      </label>
      <div class="status-box muted" id="galStatus"></div>
      <button class="btn" type="button" id="galSubmit">${t('galleryPost')}</button>
    </div>`);

  const preview = sheetEl.querySelector('#galPreview');
  const status = sheetEl.querySelector('#galStatus');
  const setPhoto = (dataUrl)=>{
    photo = dataUrl;
    preview.classList.remove('empty');
    preview.innerHTML = `<img src="${esc(dataUrl)}" alt="">`;
    setStatus(status, '', 'info');
  };

  sheetEl.querySelector('#galPick').onclick = ()=> sheetEl.querySelector('#galFile').click();
  sheetEl.querySelector('#galFile').onchange = async (ev)=>{
    const file = ev.target.files?.[0];
    if(!file) return;
    try{
      setStatus(status, '…', 'info');
      const data = await galleryFileData(file);
      setPhoto(data);
    }catch{
      setStatus(status, t('galleryFail'), 'error');
    }
  };

  sheetEl.querySelector('#galCam').onclick = async ()=>{
    const box = sheetEl.querySelector('#galCamBox');
    box.hidden = false;
    const ok = await startCamera(sheetEl.querySelector('#galVideo'), status);
    if(!ok) box.hidden = true;
  };
  sheetEl.querySelector('#galSnap').onclick = async ()=>{
    const raw = snap(sheetEl.querySelector('#galVideo'));
    if(!raw){ setStatus(status, t('galleryNeedPhoto'), 'error'); return; }
    try{
      const data = await compressGalleryPhoto(raw);
      setPhoto(data);
      stopCamera();
      sheetEl.querySelector('#galCamBox').hidden = true;
    }catch{
      setStatus(status, t('galleryFail'), 'error');
    }
  };

  sheetEl.querySelector('#galCaptionAi').onclick = async ()=>{
    const btn = sheetEl.querySelector('#galCaptionAi');
    const ta = sheetEl.querySelector('#galCaption');
    btn.disabled = true;
    const prev = btn.textContent;
    btn.textContent = t('galleryCaptionAiLoading');
    try{
      const response = await fetch('/api/gallery/caption', {
        method:'POST', credentials:'same-origin',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          topic: topicHint || ta.value.trim() || '',
          game: gameHint || '',
          lang: state.lang || 'de',
          hint: ta.value.trim() || topicHint || '',
        }),
      });
      const data = await response.json().catch(()=>({}));
      if(!response.ok || !data.caption) throw new Error(data.error||'caption');
      ta.value = String(data.caption).slice(0,280);
      setStatus(status, '', 'info');
      feedback('save');
    }catch{
      setStatus(status, t('galleryCaptionAiFail'), 'error');
    }finally{
      btn.disabled = false;
      btn.textContent = prev;
    }
  };

  sheetEl.querySelector('#galSubmit').onclick = async ()=>{
    if(!photo){ setStatus(status, t('galleryNeedPhoto'), 'error'); return; }
    const caption = sheetEl.querySelector('#galCaption').value.trim();
    const btn = sheetEl.querySelector('#galSubmit');
    btn.disabled = true;
    try{
      const data = await galleryApi('create', {photo, caption});
      applyGallerySnapshot(data);
      stopCamera();
      closeSheet();
      toast(t('galleryPosted'), 'success');
      feedback('save');
      if(state.mode==='child') state.childView = 'gallery';
      else state.tab = 'gallery';
      render();
    }catch(err){
      setStatus(status, err.code==='photo_too_large'?t('galleryTooBig'):err.code==='unsafe'?t('galleryBlocked'):t('galleryFail'), 'error');
      btn.disabled = false;
    }
  };
}


function talkSuggestTopics(){
  const today=iso(new Date());
  const suggestions=[];
  const push=(text, source)=>{
    const clean=String(text||'').trim();
    if(!clean) return;
    if(suggestions.some(s=>s.text.toLowerCase()===clean.toLowerCase())) return;
    suggestions.push({text:clean.slice(0,400), source});
  };
  if(state.user){
    dashboardAssignments(today, state.user.id)
      .filter(e=>!completionFor(today,e.id,state.user.id))
      .slice(0,6)
      .forEach(e=>push(`${actLabel(e.activityId)} · ${entryTime(e)}`, 'task'));
  }
  DB.events.filter(e=>e.status==='published' && e.date>=today)
    .slice(0,5)
    .forEach(e=>push(`${L(e)} (${e.date} ${e.from})`, 'event'));
  const wk=DB.weeks[weekKey(today)]||{};
  [wk.remarks, wk.projects, wk.hintAfternoon, wk.materials].filter(Boolean).forEach(text=>{
    String(text).split(/\n+/).map(s=>s.trim()).filter(Boolean).slice(0,3).forEach(line=>push(line,'week'));
  });
  push(t('besprechung'), 'meeting');
  return suggestions.slice(0,10);
}

let talkCache = {messages:[], topics:[], videoUrl:'', updatedAt:0};

function viewTalk(){
  if(state.mode!=='staff' || !state.user){
    return `<div class="talk-page">${emptyState(ui('u-chat'), t('staffTalkNeedStaff'))}</div>`;
  }
  return `<div class="talk-page">
    <header class="talk-hero">
      <div class="brand-kicker">Armonia Thassos</div>
      <h2>${esc(t('staffTalkTitle'))}</h2>
      <p>${esc(t('staffTalkIntro'))}</p>
    </header>
    <section class="talk-topics glass-1" aria-label="${esc(t('staffTalkTopics'))}">
      <div class="block-h"><span class="t">${esc(t('staffTalkTopics'))}</span></div>
      <p class="muted talk-topics-hint">${esc(t('staffTalkTopicsHint'))}</p>
      <div id="talkTopicsList" class="talk-topics-list"></div>
      <div class="talk-topic-add">
        <input id="talkTopicInput" maxlength="400" autocomplete="off" placeholder="${esc(t('staffTalkTopicPh'))}">
        <button class="btn sm" type="button" id="talkTopicAdd">${esc(t('staffTalkAddTopic'))}</button>
      </div>
      <div class="talk-topic-actions">
        <button class="btn ghost sm" type="button" id="talkTopicSuggest">${esc(t('staffTalkSuggest'))}</button>
        <button class="btn ghost sm" type="button" id="talkTopicClear">${esc(t('staffTalkClearDone'))}</button>
      </div>
    </section>
    <section class="talk-chat-shell glass-1" aria-label="${esc(t('staffTalkTitle'))}">
      <div id="talkPageMount" class="talk-root-fast"></div>
    </section>
  </div>`;
}

function sheetStaffTalk(){
  openStaffTalk();
}

sheetBg.onclick = () => { if(!sheetLocked) closeSheet(); };
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && sheetEl.classList.contains('on') && !sheetLocked) closeSheet();
});

/** Επαναχρησιμοποιεί το authenticated staff session. PIN ζητείται μόνο χωρίς ενεργή σύνδεση,
 *  ή όταν requirePin=true (Zo-Ai schedule / admin mutations). */
function askPin(title, onOk, {requirePin=false}={}){
  if(state.mode==='staff' && state.user && requirePin){
    openZoAiPinConfirm(title, onOk);
    return;
  }
  if(state.mode==='staff' && state.user){
    onOk(state.user);
    return;
  }
  closeSheet();
  openGate();
  toast(`${esc(title)} · ${t('noUser')}`,'error');
}

/* ── Φωτογραφία: μόνο ζωντανή λήψη, ποτέ από gallery ── */
let camStream = null;
function stopCamera(){
  if(camStream){ camStream.getTracks().forEach(tr=>tr.stop()); camStream = null; }
}
async function startCamera(videoEl, statusEl){
  try{
    camStream = await navigator.mediaDevices.getUserMedia({
      video:{facingMode:{ideal:'environment'}}, audio:false
    });
    videoEl.srcObject = camStream;
    await videoEl.play();
    return true;
  }catch(e){
    const message = !window.isSecureContext ? t('cameraSecure')
      : ['NotAllowedError','SecurityError'].includes(e.name) ? t('cameraDenied')
      : ['NotReadableError','AbortError'].includes(e.name) ? t('cameraBusy') : t('noCam');
    setStatus(statusEl, message, 'error');
    return false;
  }
}
function snap(videoEl){
  if(!videoEl.videoWidth || !videoEl.videoHeight) return null;
  const w = 640, h = Math.round(videoEl.videoHeight / videoEl.videoWidth * w) || 480;
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  cv.getContext('2d').drawImage(videoEl, 0, 0, w, h);
  return cv.toDataURL('image/jpeg', .55);
}

/* ════════════════════════════════════════════════════════════════
   Πρόγραμμα — αντιγράφει τη δομή του εντύπου
   ════════════════════════════════════════════════════════════════ */

/**
 * Εγγραφές μιας ημερομηνίας = πρότυπο της ημέρας + overrides.
 * Το override ισχύει μόνο για τη συγκεκριμένη date — το πρότυπο μένει ανέπαφο.
 */
function entriesFor(dateStr){
  const day = dowIdx(new Date(dateStr + 'T12:00:00'));
  const ovr = DB.overrides.filter(o => o.date === dateStr);

  const base = DB.template.filter(x => x.day === day).map(x => {
    const o = ovr.find(v => v.templateId === x.id);
    if(!o) return {...x, source:'template', overridden:false, cancelled:false};
    return {...x, ...o, id:x.id, source:'template', overridden:true, cancelled:!!o.cancelled};
  });
  const extras = ovr.filter(o => !o.templateId)
    .map(o => ({...o, source:'extra', overridden:true, cancelled:!!o.cancelled}));

  return [...base, ...extras];
}

/** Ώρα εγγραφής: οι δικές της ώρες αν διαφέρουν, αλλιώς όλο το μπλοκ. */
function entryTime(e){
  const b = blockDef(e?.block) || {from:'', to:''};
  if(e?.from && e?.to) return `${e.from}–${e.to}`;
  if(e?.time) return String(e.time);
  if(b.from && b.to) return `${b.from}–${b.to}`;
  return '';
}

/* ── Βάρδιες ─────────────────────────────────────────────────── */
const mins = hhmm => { const [h,m] = hhmm.split(':').map(Number); return h*60 + m; };

/** Απόλυτο διάστημα βάρδιας σε λεπτά από Δευτέρα 00:00. Η 24ωρη λήγει +1440. */
function shiftSpan(s){
  const start = s.day*1440 + mins(s.from);
  const end = s.type === 'H24' ? start + 1440
            : s.day*1440 + mins(s.to) + (mins(s.to) <= mins(s.from) ? 1440 : 0);
  return {start, end};
}
const shiftsOf = (empId, day) => DB.shifts.filter(s => s.employeeId===empId && s.day===day);
const isOff = (empId, day) => shiftsOf(empId, day).some(s => s.type==='OFF');

/** Καλύπτει η βάρδια του υπαλλήλου το διάστημα; Λαμβάνει υπόψη 24ωρη από την προηγουμένη. */
function onDuty(empId, day, fromHHMM, toHHMM){
  const target = {start: day*1440 + mins(fromHHMM), end: day*1440 + mins(toHHMM)};
  const prev = (day + 6) % 7;
  const cands = [
    ...shiftsOf(empId, day),
    ...shiftsOf(empId, prev).map(s => prev > day ? {...s, day: s.day - 7} : s),
  ].filter(s => s.type !== 'OFF' && s.from);
  return cands.some(s => {
    const sp = shiftSpan(s);
    return sp.start < target.end && sp.end > target.start;
  });
}

/* ── Calendar (.ics) + shift presence ─────────────────────────── */
const SHIFT_PRESENCE_GRACE_MS = 5 * 60 * 1000;
const SHIFT_PRESENCE_PRE_MS = 30 * 60 * 1000;
const CAL_LOCATION = 'Armonia Thassos, Thassos';

function localDateTime(dateStr, hhmm){
  const [h,m] = String(hhmm||'00:00').split(':').map(Number);
  const d = new Date(`${dateStr}T12:00:00`);
  d.setHours(h||0, m||0, 0, 0);
  return d;
}

function shiftBounds(shift, dateStr){
  const start = localDateTime(dateStr, shift.from || '00:00');
  let end;
  if(shift.type === 'H24') end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  else {
    end = localDateTime(dateStr, shift.to || shift.from || '00:00');
    if(end <= start) end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  }
  return {start, end};
}

function shiftLabel(shift){
  if(shift.type === 'H24') return `${shift.from} · 24h`;
  if(shift.type === 'HANDOVER') return `${shift.from}–${shift.to} · ${t('handover')||'Übergabe'}`;
  return `${shift.from}–${shift.to}`;
}

function personShiftOccurrences(employeeId, weeks=8){
  const today = iso(new Date());
  const startMon = weekKey(today);
  const out = [];
  for(let w=0; w<weeks; w++){
    for(let day=0; day<7; day++){
      const dateStr = shiftDate(startMon, w*7 + day);
      shiftsOf(employeeId, day).filter(s => s.type !== 'OFF' && s.from).forEach(s=>{
        const {start, end} = shiftBounds(s, dateStr);
        if(end < new Date()) return;
        out.push({
          kind:'shift',
          id:s.id,
          dateStr,
          start,
          end,
          title:`Armonia · ${empName(employeeId)} · ${shiftLabel(s)}`,
          description:[shift.type, s.note].filter(Boolean).join(' · '),
          location:CAL_LOCATION,
        });
      });
    }
  }
  return out.sort((a,b)=>a.start - b.start);
}

function personEventOccurrences(profileId, mode='staff'){
  const today = iso(new Date());
  return (DB.events||[])
    .filter(e => e.status === 'published' && e.date >= today)
    .filter(e => {
      if(mode === 'child') return (e.childIds||[]).includes(profileId);
      return (e.employeeIds||[]).includes(profileId);
    })
    .map(e=>{
      const start = localDateTime(e.date, e.from || '10:00');
      let end = localDateTime(e.date, e.to || e.from || '11:00');
      if(end <= start) end = new Date(start.getTime() + 60 * 60 * 1000);
      return {
        kind:'event',
        id:e.id,
        dateStr:e.date,
        start,
        end,
        title:`${e.emoji||'🎉'} ${L(e)}`,
        description:[typeof e.description==='object'?L(e.description):String(e.description||''), e.note, e.bring].filter(Boolean).join('\n'),
        location:e.location || CAL_LOCATION,
      };
    })
    .sort((a,b)=>a.start - b.start);
}

function icsEscape(text){
  return String(text||'')
    .replace(/\\/g,'\\\\')
    .replace(/\n/g,'\\n')
    .replace(/,/g,'\\,')
    .replace(/;/g,'\\;');
}

function icsStamp(d){
  const p = n => String(n).padStart(2,'0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth()+1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`;
}

function icsLocal(d){
  const p = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function buildIcs(events, calName='Armonia Thassos', {alarmMinutes=30}={}){
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Armonia Thassos//PAIDIA//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${icsEscape(calName)}`,
  ];
  const now = new Date();
  events.forEach(ev=>{
    lines.push(
      'BEGIN:VEVENT',
      `UID:${icsEscape(`${ev.kind}-${ev.id}-${ev.dateStr}@armonia-thassos`)}`,
      `DTSTAMP:${icsStamp(now)}`,
      `DTSTART:${icsLocal(ev.start)}`,
      `DTEND:${icsLocal(ev.end)}`,
      `SUMMARY:${icsEscape(ev.title)}`,
      `DESCRIPTION:${icsEscape(ev.description||'')}`,
      `LOCATION:${icsEscape(ev.location||CAL_LOCATION)}`,
      'STATUS:CONFIRMED',
    );
    if(alarmMinutes>0 && ev.kind==='shift'){
      lines.push(
        'BEGIN:VALARM',
        `TRIGGER:-PT${Math.max(1, alarmMinutes)}M`,
        'ACTION:DISPLAY',
        `DESCRIPTION:${icsEscape(ev.title)}`,
        'END:VALARM',
      );
    }
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function downloadTextFile(filename, text, mime='text/calendar;charset=utf-8'){
  const blob = new Blob([text], {type:mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 2500);
}

function googleCalUrl(ev){
  const params = new URLSearchParams({
    action:'TEMPLATE',
    text:ev.title,
    dates:`${icsLocal(ev.start)}/${icsLocal(ev.end)}`,
    details:ev.description||'',
    location:ev.location||CAL_LOCATION,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function outlookCalUrl(ev){
  const params = new URLSearchParams({
    path:'/calendar/action/compose',
    rru:'addevent',
    subject:ev.title,
    startdt:ev.start.toISOString(),
    enddt:ev.end.toISOString(),
    body:ev.description||'',
    location:ev.location||CAL_LOCATION,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
}

function sheetCalendar(profileId, mode='staff'){
  const person = mode==='child' ? kid(profileId) : emp(profileId);
  if(!person) return;
  const shifts = mode==='staff' ? personShiftOccurrences(profileId, 8) : [];
  const events = personEventOccurrences(profileId, mode);
  const all = [...shifts, ...events].sort((a,b)=>a.start-b.start);
  const next = all[0] || null;
  const upcoming = all.slice(0, 8);
  const name = profileName(person);
  const slug = String(name||profileId).replace(/\s+/g,'-').toLowerCase();
  const savePack = (items, file)=>{
    if(!items.length){ toast(t('calNextNone'),'error'); return; }
    downloadTextFile(file, buildIcs(items, `Armonia · ${name}`));
    feedback('save');
    toast(t('calSaved'),'success');
  };

  openSheet(`<div class="cal-sheet">
    <div class="admin-detail-hero"><div class="pa avatar" style="background:${esc(profileColor(person))}">${ui('u-calendar')}</div>
      <div class="grow"><div class="muted">ARMONIA THASSOS</div>
        <h3 style="margin:1px 0">${esc(T[state.lang].calOpenPerson(name))}</h3>
        <div class="muted">${esc(t('calWeeks'))} · ${esc(T[state.lang].calCount(all.length))}</div></div></div>
    <p class="muted cal-sheet-hint">${esc(t('calHint'))}</p>

    <section class="cal-block">
      <h4>${esc(t('calAddAny'))}</h4>
      <p class="muted">${esc(t('calAddAnyHint'))}</p>
      <p class="cal-reminder">${esc(t('calReminder'))}</p>
      <div class="cal-actions">
        <button class="btn" type="button" id="calDlAll">${esc(t('calApple'))} · ${esc(t('calDownloadAll'))}</button>
        ${mode==='staff'?`<button class="btn sec" type="button" id="calDlShifts">${esc(t('calDownloadShifts'))}</button>`:''}
        <button class="btn sec" type="button" id="calDlEvents">${esc(t('calDownloadEvents'))}</button>
      </div>
    </section>

    ${next?`<section class="cal-block">
      <h4>${esc(t('calAddWeb'))}</h4>
      <div class="cal-next-card">
        <b>${esc(next.title)}</b>
        <span>${esc(fmtDT(next.start.getTime()))}</span>
      </div>
      <div class="cal-actions row">
        <a class="btn sec" href="${esc(googleCalUrl(next))}" target="_blank" rel="noopener">${esc(t('calGoogle'))}</a>
        <a class="btn sec" href="${esc(outlookCalUrl(next))}" target="_blank" rel="noopener">${esc(t('calOutlook'))}</a>
        <button class="btn sec" type="button" id="calDlNext">${esc(t('calOneIcs'))}</button>
      </div>
    </section>`:`<div class="status-box" style="margin-top:8px">${esc(t('calNextNone'))}</div>`}

    ${upcoming.length?`<section class="cal-block">
      <h4>${esc(t('calUpcoming'))}</h4>
      <div class="cal-upcoming">${upcoming.map((ev,i)=>`
        <article class="cal-up-row">
          <div class="grow">
            <b>${esc(ev.title)}</b>
            <span class="muted">${esc(fmtDT(ev.start.getTime()))}</span>
          </div>
          <div class="cal-up-acts">
            <a class="btn sm sec" href="${esc(googleCalUrl(ev))}" target="_blank" rel="noopener">${esc(t('calGoogle'))}</a>
            <a class="btn sm sec" href="${esc(outlookCalUrl(ev))}" target="_blank" rel="noopener">${esc(t('calOutlook'))}</a>
            <button class="btn sm sec" type="button" data-cal-one="${i}">${esc(t('calOneIcs'))}</button>
          </div>
        </article>`).join('')}
      </div>
    </section>`:''}
  </div>`);

  sheetEl.querySelector('#calDlAll')?.addEventListener('click',()=>savePack(all, `armonia-${slug}.ics`));
  sheetEl.querySelector('#calDlShifts')?.addEventListener('click',()=>savePack(shifts, `armonia-${slug}-shifts.ics`));
  sheetEl.querySelector('#calDlEvents')?.addEventListener('click',()=>savePack(events, `armonia-${slug}-events.ics`));
  sheetEl.querySelector('#calDlNext')?.addEventListener('click',()=>{ if(next) savePack([next], `armonia-${slug}-next.ics`); });
  sheetEl.querySelectorAll('[data-cal-one]').forEach(btn=>{
    btn.onclick=()=>{
      const ev = upcoming[Number(btn.dataset.calOne)];
      if(ev) savePack([ev], `armonia-${slug}-${ev.kind}-${ev.dateStr}.ics`);
    };
  });
}

function shiftCheckinFor(employeeId, dateStr, shiftId){
  return (DB.shiftCheckins||[]).find(c =>
    c.employeeId===employeeId && c.date===dateStr && c.shiftId===shiftId);
}

function activeShiftPresence(employeeId){
  if(!employeeId) return null;
  const now = new Date();
  const today = iso(now);
  const yesterday = shiftDate(today, -1);
  const yDay = dowIdx(new Date(yesterday+'T12:00:00'));
  const candidates = [
    ...shiftsOf(employeeId, dowIdx(now)).filter(s=>s.type!=='OFF' && s.from).map(s=>({s, dateStr:today})),
    ...shiftsOf(employeeId, yDay).filter(s=>s.type==='H24' && s.from).map(s=>({s, dateStr:yesterday})),
  ];
  for(const {s, dateStr} of candidates){
    const checkin = shiftCheckinFor(employeeId, dateStr, s.id);
    const {start, end} = shiftBounds(s, dateStr);
    if(checkin){
      if(now >= new Date(start.getTime()-SHIFT_PRESENCE_PRE_MS) && now <= end){
        return {shift:s, dateStr, start, end, late:checkin.status==='late', minutesLate:0, checkin};
      }
      continue;
    }
    if(now < new Date(start.getTime()-SHIFT_PRESENCE_PRE_MS)) continue;
    if(now > end) continue;
    const late = now.getTime() > start.getTime() + SHIFT_PRESENCE_GRACE_MS;
    const minutesLate = late ? Math.max(1, Math.round((now - start) / 60000)) : 0;
    return {shift:s, dateStr, start, end, late, minutesLate, checkin:null};
  }
  return null;
}

function shiftPresenceBannerHtml(){
  if(state.mode!=='staff' || !state.user) return '';
  const active = activeShiftPresence(state.user.id);
  if(!active) return '';
  const {shift, late, minutesLate, checkin, start} = active;
  const toLabel = shift.type==='H24' ? '+24h' : (shift.to||'');
  if(checkin){
    return `<div class="shift-check-banner presence done">
      <div><b>${ui('u-check')} ${esc(t('presenceDone'))}</b>
        <span>${esc(T[state.lang].presenceBannerDone(checkin.status, fmtDT(checkin.at)))}</span></div>
      <button class="btn sec sm" type="button" id="shiftPresenceOpen">${esc(t('presenceOpen'))}</button>
    </div>`;
  }
  if(late){
    return `<div class="shift-check-banner presence late">
      <div><b>⏰ ${esc(t('presenceTitle'))}</b>
        <span>${esc(T[state.lang].presenceBannerLate(shift.from, minutesLate))}</span></div>
      <button class="btn sm" type="button" id="shiftPresenceOpen">${esc(t('presenceImThere'))}</button>
    </div>`;
  }
  return `<div class="shift-check-banner presence pending">
    <div><b>👋 ${esc(t('presenceTitle'))}</b>
      <span>${esc(T[state.lang].presenceBannerReady(shift.from, toLabel))}</span></div>
    <button class="btn sm" type="button" id="shiftPresenceOpen">${esc(t('presenceImThere'))}</button>
  </div>`;
}

/** Home: shift-start checklist (presence → stock → journal). Glass-1 card with semantic edge. */
function homeShiftStartCardHtml(){
  if(state.mode!=='staff' || !state.user) return '';
  const active = activeShiftPresence(state.user.id);
  const stockPending = typeof shiftStockCheckPending==='function' && shiftStockCheckPending();
  const today = iso(new Date());
  const journalDue = !(shiftNoteFor(state.user.id, today)?.text||'').trim();
  if(!active && !stockPending) return '';

  const presenceDone = !!(active?.checkin);
  const stockDone = !stockPending;
  const journalDone = !journalDue;
  const allDone = (!active || presenceDone) && stockDone && (!active || journalDone);
  const toLabel = active ? (active.shift.type==='H24' ? '+24h' : (active.shift.to||'')) : '';
  const timeLine = active
    ? `${active.shift.from}${toLabel?`–${toLabel}`:''}`
    : '';
  const title = !active
    ? t('shiftStockCheck')
    : presenceDone
      ? t('homeShiftStartOn')
      : (active.late ? t('homeShiftStartLate') : t('homeShiftStart'));
  const subtitle = active
    ? (active.late && !presenceDone
        ? T[state.lang].presenceBannerLate(active.shift.from, active.minutesLate)
        : T[state.lang].presenceBannerReady(active.shift.from, toLabel))
    : t('shiftStockCheckPending');
  const tone = !presenceDone && active?.late ? 'late' : (allDone ? 'done' : 'go');

  const step = (ok, label, cta, id, primary) => `
    <div class="home-shift-step ${ok?'ok':''}">
      <span class="home-shift-mark" aria-hidden="true">${ok?ui('u-check','sm'):'○'}</span>
      <span class="home-shift-step-label">${esc(label)}</span>
      ${ok
        ? `<span class="home-shift-step-done">${esc(t('homeShiftDoneMark'))}</span>`
        : `<button type="button" class="home-shift-step-cta ${primary?'primary':''}" id="${id}">${esc(cta)}</button>`}
    </div>`;

  return `<section class="home-shift-start ${tone}" aria-label="${esc(t('homeShiftStart'))}">
    <header class="home-shift-start-head">
      <div>
        <div class="home-shift-kicker">${esc(t('homeShiftStart'))}${timeLine?` · ${esc(timeLine)}`:''}</div>
        <h2>${esc(title)}</h2>
        <p>${esc(allDone?t('homeShiftStartDone'):subtitle)}</p>
      </div>
      ${!presenceDone && active ? `<button type="button" class="home-shift-primary" id="homeShiftPresence">${esc(t('homeShiftOpen'))}</button>` : ''}
    </header>
    <p class="home-shift-hint">${esc(t('homeShiftStartHint'))}</p>
    <div class="home-shift-steps">
      ${active ? step(presenceDone, t('homeShiftStepPresence'), t('presenceImThere'), 'homeShiftPresenceStep', true) : ''}
      ${step(stockDone, t('homeShiftStepStock'), t('homeShiftStockGo'), 'homeShiftStock', !active || presenceDone)}
      ${active || journalDue ? step(journalDone, t('homeShiftStepJournal'), t('homeShiftJournalGo'), 'homeShiftJournal', presenceDone && stockDone) : ''}
    </div>
  </section>`;
}

function saveShiftPresence({shift, dateStr, late, reason}){
  const who = state.user;
  if(!who) return false;
  DB.shiftCheckins = DB.shiftCheckins || [];
  DB.shiftCheckins = DB.shiftCheckins.filter(c =>
    !(c.employeeId===who.id && c.date===dateStr && c.shiftId===shift.id));
  DB.shiftCheckins.push({
    id:'sc'+uid(),
    employeeId:who.id,
    date:dateStr,
    shiftId:shift.id,
    from:shift.from,
    to:shift.to||'',
    type:shift.type,
    status:late?'late':'present',
    reason:late ? String(reason||'').trim().slice(0,240) : '',
    at:Date.now(),
    byName:who.name||who.id,
  });
  if(DB.shiftCheckins.length > 800) DB.shiftCheckins = DB.shiftCheckins.slice(-800);
  logEntry('SHIFT', late
    ? `${t('presenceLate')}: ${who.name} · ${dateStr} ${shift.from} · ${reason}`
    : `${t('presenceOnTime')}: ${who.name} · ${dateStr} ${shift.from}`);
  return save();
}

function sheetShiftPresence(){
  if(state.mode!=='staff' || !state.user){ toast(t('presenceNoShift'),'error'); return; }
  const active = activeShiftPresence(state.user.id);
  if(!active){ toast(t('presenceNoShift'),'error'); return; }
  const {shift, dateStr, late, minutesLate, checkin, start} = active;
  if(checkin){
    openSheet(`<div class="presence-panel done">
      <div class="presence-kicker">${esc(t('presencePanelTitle'))}</div>
      <h2>${esc(checkin.status==='late'?t('presenceLate'):t('presenceOnTime'))}</h2>
      <div class="status-box success">${esc(T[state.lang].presenceBannerDone(checkin.status, fmtDT(checkin.at)))}
        ${checkin.reason?`<div style="margin-top:6px">${esc(checkin.reason)}</div>`:''}</div>
      <p class="muted">${esc(shiftLabel(shift))} · ${esc(dateStr)}</p>
      <button class="btn sec" type="button" id="presenceClose">${t('close')}</button>
    </div>`);
    sheetEl.querySelector('#presenceClose').onclick=()=>closeSheet();
    return;
  }
  const reasons = [
    ['traffic', t('presenceReasonTraffic')],
    ['health', t('presenceReasonHealth')],
    ['handover', t('presenceReasonHandover')],
    ['other', t('presenceReasonOther')],
  ];
  openSheet(`<div class="presence-panel ${late?'late':'ready'}">
    <div class="presence-kicker">${esc(t('presencePanelTitle'))} · ${esc(eventDayLabel(dateStr))}</div>
    <h2>${esc(late?t('presencePanelLateTitle'):t('presenceImThere'))}</h2>
    <p class="presence-meta">${esc(shiftLabel(shift))} · ${esc(fmtDT(start.getTime()))}</p>
    ${late
      ? `<div class="presence-late-box">
          <b>${esc(t('presenceLateWhy'))}</b>
          <p>${esc(t('presencePanelLateAsk'))} (${minutesLate} Min.)</p>
          <div class="chips presence-reasons" id="presenceReasons">
            ${reasons.map(([id,label])=>`<button class="chip" type="button" data-presence-reason="${id}">${esc(label)}</button>`).join('')}
          </div>
          <label class="f"><span>${t('presenceCustomReason')}</span>
            <input type="text" id="presenceReason" maxlength="240" placeholder="…" enterkeyhint="done"></label>
        </div>`
      : `<p class="presence-ready-copy">${esc(t('presencePanelReady'))}</p>`}
    <button class="btn presence-cta" type="button" id="presenceConfirm">${esc(late?t('presenceConfirmLate'):t('presenceImThere'))}</button>
  </div>`);
  let picked = '';
  sheetEl.querySelectorAll('[data-presence-reason]').forEach(btn=>{
    btn.onclick=()=>{
      picked = btn.dataset.presenceReason;
      sheetEl.querySelectorAll('[data-presence-reason]').forEach(b=>b.classList.toggle('on', b===btn));
      const input = sheetEl.querySelector('#presenceReason');
      if(input && picked !== 'other' && !input.value.trim()){
        input.value = reasons.find(([id])=>id===picked)?.[1] || '';
      }
    };
  });
  sheetEl.querySelector('#presenceConfirm').onclick=()=>{
    let reason = '';
    if(late){
      reason = String(sheetEl.querySelector('#presenceReason')?.value || '').trim();
      if(!reason && picked && picked !== 'other'){
        reason = reasons.find(([id])=>id===picked)?.[1] || '';
      }
      if(!reason){ toast(t('presenceReasonNeeded'),'error'); return; }
    }
    if(!saveShiftPresence({shift, dateStr, late, reason})) return;
    feedback('save');
    toast(late?t('presenceLateSaved'):t('presenceSaved'),'success');
    closeSheet();
    render();
  };
  if(late) queueMicrotask(()=>sheetEl.querySelector('#presenceReason')?.focus());
}

function consumePresenceDeepLink(){
  try{
    const u = new URL(location.href);
    const want = u.searchParams.get('presence')==='1' || u.searchParams.get('open')==='presence';
    if(!want) return false;
    u.searchParams.delete('presence');
    u.searchParams.delete('open');
    if(u.searchParams.get('tab')==='home') u.searchParams.delete('tab');
    history.replaceState({}, '', u.pathname + (u.search||'') + u.hash);
    return true;
  }catch{ return false; }
}

const ROUTE_TABS = ['home','gallery','schedule','stock','shop','book','talk'];
const ROUTE_SCHEDULE_VIEWS = ['day','week','calendar','shift','events'];
const ROUTE_SHOP_PANELS = ['plan','take','store'];

function routeFromHash(){
  const raw = (location.hash || '').replace(/^#/, '').trim();
  if(!raw) return null;
  const parts = raw.split('/').filter(Boolean);
  const tab = parts[0];
  if(!ROUTE_TABS.includes(tab)) return null;
  const route = {tab};
  if(tab === 'schedule' && parts[1] && ROUTE_SCHEDULE_VIEWS.includes(parts[1])) route.scheduleView = parts[1];
  if(tab === 'shop' && parts[1] && ROUTE_SHOP_PANELS.includes(parts[1])) route.shopPanel = parts[1];
  return route;
}

function applyRouteFromHash(){
  const route = routeFromHash();
  if(!route) return false;
  state.tab = route.tab;
  if(route.scheduleView) state.scheduleView = route.scheduleView;
  if(route.shopPanel){
    state.shopPanel = route.shopPanel === 'store' ? 'plan' : route.shopPanel;
  }
  if(state.tab === 'schedule' && state.scheduleView === 'calendar' && !state.calendarMonth){
    state.calendarMonth = iso(new Date()).slice(0, 7) + '-01';
  }
  return true;
}

function hashForState(){
  if(state.tab === 'home') return '#home';
  if(state.tab === 'gallery') return '#gallery';
  if(state.tab === 'book') return '#book';
  if(state.tab === 'talk') return '#talk';
  if(state.tab === 'stock') return '#stock';
  if(state.tab === 'schedule'){
    const sv = state.scheduleView || 'day';
    return ROUTE_SCHEDULE_VIEWS.includes(sv) ? `#schedule/${sv}` : '#schedule/day';
  }
  if(state.tab === 'shop'){
    try{
      const pending = fridayEntries(shopHouse()).some(e=>e.status==='pending');
      if(pending) return '#shop/store';
    }catch{}
    const panel = state.shopPanel === 'take' ? 'take' : 'plan';
    return `#shop/${panel}`;
  }
  return '';
}

function clearSelection(){
  state.selectMode = null;
  state.selectedIds = [];
}
function isSelected(id){
  return state.selectedIds.includes(id);
}
function toggleSelected(id){
  if(isSelected(id)) state.selectedIds = state.selectedIds.filter(x=>x!==id);
  else state.selectedIds = [...state.selectedIds, id];
}
function enterSelectMode(mode){
  state.selectMode = mode;
  state.selectedIds = [];
}
function exitSelectMode(){
  clearSelection();
}
function bulkBarHtml(actions){
  const n = state.selectedIds.length;
  if(!n) return '';
  return `<div class="bulk-bar" role="toolbar" aria-label="${esc(T[state.lang].selectedCount(n))}">
    <span class="bulk-bar-count">${esc(T[state.lang].selectedCount(n))}</span>
    <div class="bulk-bar-actions">${actions.map(a=>`<button type="button" class="bulk-act ${a.danger?'danger':''}" data-bulk="${a.id}">${esc(a.label)}</button>`).join('')}</div>
  </div>`;
}

function syncLocationHash(){
  if(document.body.classList.contains('auth-pending')) return;
  try{
    const next = hashForState();
    if(location.hash !== next) history.replaceState({}, '', location.pathname + location.search + next);
  }catch{}
}
function openPresenceFromSignal(){
  if(state.mode!=='staff' || !state.user) return;
  state.tab='home';
  render();
  queueMicrotask(()=>sheetShiftPresence());
}
function maybePromptShiftPresence(){
  if(state.mode!=='staff' || !state.user || state.tab!=='home') return;
  if(typeof sheetEl!=='undefined' && sheetEl?.classList?.contains('on')) return;
  const active = activeShiftPresence(state.user.id);
  if(!active || active.checkin) return;
  const key = `auto-presence:${active.dateStr}:${active.shift.id}`;
  try{ if(sessionStorage.getItem(key)==='1') return; }catch{}
  const now = Date.now();
  // Prompt from 5 minutes before start, or whenever already late.
  if(!active.late && now < active.start.getTime() - 5*60*1000) return;
  try{ sessionStorage.setItem(key,'1'); }catch{}
  setTimeout(()=>{
    if(state.tab!=='home') return;
    const still = activeShiftPresence(state.user.id);
    if(!still || still.checkin) return;
    sheetShiftPresence();
  }, 500);
}

/* ── Validation engine (§9, §35) — warnings, όχι απαγορεύσεις ── */
const MAX_KIDS_PER_CAREGIVER = 4;

function validateDay(dateStr){
  const day = dowIdx(new Date(dateStr + 'T12:00:00'));
  const entries = entriesFor(dateStr).filter(e => !e.cancelled);
  const out = [];
  const add = (sev, code, msg) => out.push({sev, code, msg});

  BLOCKS.forEach(b => {
    const list = entries.filter(e => e.block === b.id);

    // Ίδιος φροντιστής σε δύο διαφορετικά σπίτια την ίδια ώρα
    const byEmp = {};
    list.forEach(e => entryEmployeeIds(e).forEach(eid=>(byEmp[eid] ||= []).push(e)));
    Object.entries(byEmp).forEach(([eid, es]) => {
      const houses = [...new Set(es.flatMap(entryHouseIds))];
      if(houses.length > 1)
        add('error','twohouses', `${empName(eid)}: ${t('vTwoHouses')} — ${houses.map(h=>house(h).short).join(' + ')} · ${t(b.id)}`);
      const kids = es.flatMap(e=>e.childIds||[]);
      if(kids.length > MAX_KIDS_PER_CAREGIVER)
        add('warn','load', `${empName(eid)}: ${T[state.lang].vKids(kids.length)} · ${t(b.id)}`);
    });

    // Ίδιο παιδί σε δύο ομάδες την ίδια ώρα
    const seen = {};
    list.forEach(e => (e.childIds||[]).forEach(c => (seen[c] ||= []).push(e)));
    Object.entries(seen).forEach(([cid, es]) => {
      if(es.length > 1)
        add('error','childdup', `${kid(cid).name}: ${t('vChildTwice')} (${es.length}×) · ${t(b.id)}`);
    });

    // Σπίτι με παιδιά αλλά χωρίς φροντιστή
    planningHouses().forEach(h => {
      const hl = list.filter(e => entryHouseIds(e).includes(h.id));
      if(hl.length && hl.every(e => !entryEmployeeIds(e).length) && hl.some(e => (e.childIds||[]).length))
        add('warn','nostaff', `${house(h.id).short}: ${t(b.id)} — ${t('unassigned')}`);
    });

    // Ανάθεση ενώ ο υπάλληλος είναι σε ρεπό ή εκτός βάρδιας
    Object.keys(byEmp).forEach(eid => {
      if(isOff(eid, day)) add('warn','off', `${empName(eid)}: ${t('vOff')} · ${t(b.id)}`);
      else if(!onDuty(eid, day, b.from, b.to))
        add('warn','outside', `${empName(eid)}: ${t('vOutside')} · ${t(b.id)} ${b.from}–${b.to}`);
    });

    // Διπλοεγγραφή
    const sig = {};
    list.forEach(e => {
      const k = [entryEmployeeIds(e).sort().join(','), e.activityId, (e.childIds||[]).slice().sort().join(',')].join('|');
      (sig[k] ||= []).push(e);
    });
    Object.values(sig).forEach(es => {
      if(es.length > 1)
        add('warn','dup', `${t('vDuplicate')}: ${employeeNames(es[0])} · ${actLabel(es[0].activityId)}`);
    });
  });

  return out;
}

function validationCard(dateStr){
  if(!isAdminUser()) return '';
  const issues = validateDay(dateStr);
  if(!issues.length) return `<div class="card"><div class="row" style="gap:8px">
    <span style="font-size:17px">${ui('u-check')}</span><div class="muted">${t('vNone')}</div></div></div>`;
  const errs = issues.filter(i=>i.sev==='error');
  return `<div class="card" style="border-color:${errs.length?'#fca5a5':'#fcd34d'}">
    <h2>${t('vTitle')} · ${issues.length}</h2>
    ${issues.map(i=>`<div class="row" style="gap:8px;align-items:flex-start;padding:5px 0">
      <span style="flex:0 0 auto">${i.sev==='error'?'⛔':'⚠️'}</span>
      <div class="grow" style="font-size:13px">${esc(i.msg)}</div></div>`).join('')}
    <div class="muted" style="margin-top:8px">${t('vHint')}</div>
  </div>`;
}

function weekDates(anchorStr){
  const a = new Date(anchorStr + 'T12:00:00');
  const mon = new Date(a); mon.setDate(a.getDate() - dowIdx(a));
  return Array.from({length:7}, (_,i)=>{ const d = new Date(mon); d.setDate(mon.getDate()+i); return iso(d); });
}
const weekKey = anchorStr => weekDates(anchorStr)[0];

function eventForEntry(e, dateStr){
  return DB.events.find(x=>x.scheduleEntryId===e.id && x.scheduleDate===dateStr && x.status==='published');
}

/** Ακύρωση / αφαίρεση εγγραφής από τον πίνακα (πρότυπο → override cancelled · έκτακτο → διαγραφή). */
function applyCancelScheduleEntry(e, dateStr){
  if(e.source==='template'){
    const ex = DB.overrides.find(o=>o.date===dateStr && o.templateId===e.id);
    if(ex) ex.cancelled = true;
    else DB.overrides.push({id:uid(), date:dateStr, templateId:e.id, cancelled:true});
  }else{
    DB.overrides = DB.overrides.filter(o=>o.id!==e.id);
  }
  const linked=DB.events.find(x=>x.scheduleEntryId===e.id && x.scheduleDate===dateStr);
  if(linked) linked.status='draft';
  logEntry('SCHEDULE', `${dateStr} · ${t('cancelled')}: ${actLabel(e.activityId)}${
    entryEmployeeIds(e).length?' · '+employeeNames(e):''}`);
}

function cancelScheduleEntry(e, dateStr, {onDone}={}){
  if(!e || e.cancelled) return;
  askPin(t('cancelToday'), who => {
    state.user = who;
    applyCancelScheduleEntry(e, dateStr);
    if(!save()) return;
    onDone?.();
    feedback('warn');
    toast(t('removedFromPlan'),'success');
  });
}

function entryLine(e, dateStr=state.date){
  const a = act(e.activityId);
  const announced = eventForEntry(e,dateStr);
  const people=entryEmployeeIds(e);
  const person = people.length ? esc(employeeNames(e)) : `<span class="pill open">${t('unassigned')}</span>`;
  const kids = (e.childIds||[]).map(id=>`<span class="pill kid">${esc(kid(id)?.name||'')}</span>`).join('');
  const who = emp(people[0]);
  const accent = who?.color || '#0e7490';
  return `<div class="plan-entry entry-wrap ${e.cancelled?'is-cancelled':''}" style="--entry-accent:${accent}">
    <button class="plan-entry-main entry ${e.cancelled?'cancelled':''}" data-open="${e.id}" data-entry-date="${esc(dateStr)}" type="button">
      <div class="top">
        ${who ? `<div class="avatar" style="background:${safeColor(who.color)}">${initials(who.name)}</div>`
              : `<span class="emoji">${a?a.emoji:'📝'}</span>`}
        <div class="grow">
          <div class="act">${who ? esc(a?a.emoji+' ':'') : ''}${esc(actLabel(e.activityId))}
            ${announced ? `<span class="event-flag">${ui('u-megaphone')} ${t('published')}</span>` : ''}</div>
          <div class="meta">${who ? esc(employeeNames(e)) : person} · ${esc(entryTime(e))}${
            entryHouseIds(e).length ? ' · 🏠 ' + esc(houseNames(e)) : ''}</div>
          ${e.note ? `<div class="meta">${esc(e.note)}</div>` : ''}
        </div>
        <div class="plan-entry-flags">
          ${e.cancelled ? `<span class="pill gray">${t('cancelled')}</span>`
            : e.overridden ? `<span class="pill ovr">${t('override')}</span>` : ''}
        </div>
      </div>
      ${kids ? `<div class="kids">${kids}</div>` : ''}
    </button>
    ${!e.cancelled?`<button type="button" class="mini-x entry-x plan-entry-x" data-remove-entry="${esc(e.id)}" data-entry-date="${esc(dateStr)}" aria-label="${esc(t('removeFromTable'))}" title="${esc(t('removeFromTable'))}">×</button>`:''}
  </div>`;
}

function viewScheduleDay(){
  const today = iso(new Date());
  const week = weekDates(state.date);
  const all = entriesFor(state.date)
    .filter(e => !state.houseFilter || !entryHouseIds(e).length || entryHouseIds(e).includes(state.houseFilter));

  const days = week.map(ds=>{
    const d = new Date(ds+'T12:00:00');
    const di = dowIdx(d);
    return `<button type="button" class="plan-day-chip day ${ds===state.date?'on':''} ${ds===today?'today':''}" data-date="${ds}" aria-pressed="${ds===state.date?'true':'false'}" aria-label="${esc(DAY_LONG[state.lang][di])} ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}">
      <span class="d">${DAY_NAMES[state.lang][di]}</span>
      <span class="n">${d.getDate()}<i>.${d.getMonth()+1}.${String(d.getFullYear()).slice(2)}</i></span></button>`;
  }).join('');

  const blocks = BLOCKS.map((b, bi)=>{
    const list = all.filter(e => e.block === b.id);
    let body;
    if(b.by === 'house'){
      body = planningHouses()
        .filter(h => !state.houseFilter || h.id === state.houseFilter)
        .map(h=>{
          const rows = list.filter(e => entryHouseIds(e).includes(h.id));
          return `<div class="plan-lane">
            <div class="plan-lane-h house-h">${esc(h.name)}</div>
            ${rows.length ? rows.map(e=>entryLine(e,state.date)).join('')
              : `<button class="plan-lane-empty empty-state-btn" type="button" data-add="${b.id}" data-house="${h.id}"><span class="empty-ico" aria-hidden="true">＋</span><span class="empty-title">${esc(t('planLaneEmpty'))}</span></button>`}
          </div>`;
        }).join('');
    }else{
      const assigned = list.length
        ? DB.employees.map(p=>{
            const rows = list.filter(e => entryEmployeeIds(e).includes(p.id));
            return rows.length ? rows.map(e=>entryLine(e,state.date)).join('') : '';
          }).join('') + list.filter(e=>!entryEmployeeIds(e).length).map(e=>entryLine(e,state.date)).join('')
        : '';
      body = `<div class="plan-lane">${assigned ||
        `<button class="plan-lane-empty empty-state-btn" type="button" data-add="${b.id}"><span class="empty-ico" aria-hidden="true">＋</span><span class="empty-title">${esc(t('planLaneEmpty'))}</span></button>`}</div>`;
    }
    return `<section class="plan-block block block-${b.id}" style="--block-i:${bi}">
      <div class="plan-block-h block-h">
        <span class="t">${t(b.id)}</span>
        <span class="hrs plan-time-chip">${b.from}–${b.to}</span>
      </div>
      ${body}
      ${list.length?`<div class="plan-block-add"><button class="btn ghost sm" type="button" data-add="${b.id}">${t('add')}</button></div>`:''}
    </section>`;
  }).join('');

  const d = new Date(state.date+'T12:00:00');
  const longDate = `${DAY_LONG[state.lang][dowIdx(d)]} ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
  const calDates = [];
  for(let i=6;i>=0;i--){
    const cd = new Date(); cd.setDate(cd.getDate()-i);
    const key = iso(cd);
    if(entriesFor(key).length) calDates.push(key);
  }
  return `
    <header class="plan-hero">
      <div class="plan-hero-copy">
        <div class="brand-kicker">Armonia</div>
        <h2 class="plan-hero-date">${esc(longDate)}</h2>
        <p class="plan-hero-meet">${esc(t('besprechung'))}</p>
        ${miniCalendarHtml(calDates, today)}
        <div class="home-widgets" style="margin-top:10px">${ringHtml(planDayLoadPct(state.date), t('planDayLoad'), 'sea')}</div>
      </div>
      <button class="plan-hero-cta page-act primary" type="button" data-page-act="addEntry">${esc(t('topAdd'))}</button>
    </header>
    <div class="plan-days days" role="tablist" aria-label="${esc(t('viewDay'))}">${days}</div>
    ${blocks}
    ${validationCard(state.date)}
    ${weekNotesCard()}`;
}

/** Ημερομηνία ημέρας για πίνακες / chips: όνομα + πλήρης ημερομηνία. */
function dayStamp(ds, i=dowIdx(new Date(ds+'T12:00:00'))){
  const d = new Date(ds+'T12:00:00');
  const name = DAY_NAMES[state.lang][i];
  const date = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
  const short = `${d.getDate()}.${d.getMonth()+1}.`;
  const full = date;
  const long = DAY_LONG[state.lang][i];
  return {
    name, date, short, full, long, i, ds,
    text: `${name} ${date}`,
    headHtml: `<span class="mh-day">${esc(name)}</span><span class="mh-date">${esc(date)}</span>`,
    labelHtml: `<span class="mh-day">${esc(name)}</span><span class="mh-date">${esc(date)}</span>`,
  };
}

/** Κοινό responsive table system για πρόγραμμα, βάρδιες και μελλοντικά datasets. */
function matrixView(headers, rows, {label = '', interactive = false, title = ''} = {}){
  const desktopMin=140 + headers.length*158;
  const mobileMin=100 + headers.length*132;
  const headCell = h => {
    if(h && typeof h === 'object'){
      return `<div class="matrix-cell matrix-head" role="columnheader">${h.html || h.headHtml || `<span class="mh-day">${esc(h.text||h.label||'')}</span>`}</div>`;
    }
    return `<div class="matrix-cell matrix-head" role="columnheader">${esc(h)}</div>`;
  };
  const head = `<div class="matrix-row" role="row">
    <div class="matrix-cell matrix-head matrix-label" role="columnheader">${esc(label)}</div>
    ${headers.map(headCell).join('')}
  </div>`;
  const table = `<div class="matrix" role="table" style="--cols:${headers.length};--matrix-min:${desktopMin}px;--matrix-min-mobile:${mobileMin}px" tabindex="0">
    ${head}${rows.map(r=>`<div class="matrix-row" role="row">
      <div class="matrix-cell matrix-label" role="rowheader">${r.labelHtml || r.label}</div>
      ${r.cells.map(c=>`<div class="matrix-cell ${c.action?'matrix-action':''}" role="cell"
        ${c.action ? `tabindex="0" data-cell="${esc(c.action)}" aria-label="${esc(c.aria||t('add'))}"` : ''}>
        ${c.html || `<span class="matrix-empty">${esc(t('matrixEmpty'))}</span>`}${c.action ? '<span class="matrix-add" aria-hidden="true">＋</span>' : ''}
      </div>`).join('')}
    </div>`).join('')}
  </div>`;
  return `<div class="matrix-shell">
    <div class="matrix-toolbar">
      <div class="matrix-toolbar-title">${esc(title || label || t('viewWeek'))}</div>
      <button class="matrix-fs-btn" type="button" data-matrix-fs aria-label="${esc(t('tableFullscreen'))}" title="${esc(t('tableFullscreen'))}">⛶ ${t('tableFullscreen')}</button>
      <button class="matrix-fs-close" type="button" data-matrix-fs-close hidden aria-label="${esc(t('tableExitFullscreen'))}">✕ ${t('tableExitFullscreen')}</button>
    </div>
    ${table}
  </div>`;
}

function exitMatrixFullscreen(){
  document.querySelectorAll('.matrix-shell.is-fullscreen').forEach(shell=>{
    shell.classList.remove('is-fullscreen');
    const open=shell.querySelector('[data-matrix-fs]');
    const close=shell.querySelector('[data-matrix-fs-close]');
    if(open) open.hidden=false;
    if(close) close.hidden=true;
  });
  document.body.classList.remove('matrix-fullscreen');
  scheduleMeasureChrome();
}

function enterMatrixFullscreen(shell){
  if(!shell) return;
  exitMatrixFullscreen();
  shell.classList.add('is-fullscreen');
  document.body.classList.add('matrix-fullscreen');
  const open=shell.querySelector('[data-matrix-fs]');
  const close=shell.querySelector('[data-matrix-fs-close]');
  if(open) open.hidden=true;
  if(close) close.hidden=false;
  scheduleMeasureChrome();
  const matrix=shell.querySelector('.matrix');
  if(matrix) try{ matrix.focus({preventScroll:true}); }catch{ matrix.focus(); }
}

/** Πρόγραμμα βαρδιών — προσωπικό × ημέρα, με τις 24ωρες ως ενιαίο μπλοκ (§6.2). */
function viewShifts(){
  const week = weekDates(state.date);
  const stamps = week.map((ds,i)=>dayStamp(ds,i));
  const cell = (empId, day) => {
    const list = shiftsOf(empId, day);
    if(!list.length) return '<span class="muted">—</span>';
    return list.map(s=>{
      if(s.type==='OFF') return `<div class="cellitem"><span class="pill gray">${t('off')}</span></div>`;
      if(s.type==='H24') return `<div class="cellitem"><b>${s.from} → ${stamps[(day+1)%7].name} ${s.to}</b>
        <br><span class="pill ovr">${t('h24')}</span></div>`;
      if(s.type==='HANDOVER') return `<div class="cellitem"><b>${s.from}–${s.to}</b>
        <br><span class="pill gray">${t('handover')}</span></div>`;
      return `<div class="cellitem"><b>${s.from}–${s.to}</b></div>`;
    }).join('');
  };
  const headers = stamps.map(s=>({html:s.headHtml, text:s.text}));
  const rows = DB.employees.map(p=>({
    label:esc(p.name),
    cells:stamps.map((s,d)=>({
      html:cell(p.id,d),
      action:isAdminUser()?`shift:${p.id}:${d}`:'',
      aria:`${p.name} · ${s.long} ${s.full} · ${t('editShiftDay')}`,
    })),
  }));
  return `
    ${matrixView(headers, rows, {label:state.lang==='de'?'Person':'Άτομο', title:t('viewShift')})}
    <div class="muted" style="margin-bottom:12px">${t('tenMinRule')}</div>
    ${validationCard(state.date)}`;
}

function sheetShiftDay(employeeId, day){
  if(!isAdminUser()){toast(t('adminRequired'),'error');return;}
  const person=emp(employeeId); if(!person) return;
  const stamp=dayStamp(weekDates(state.date)[day], day);
  const existing=shiftsOf(employeeId,day).map(s=>({...s}));
  const rowHtml=s=>`<div class="shift-edit-row" data-shift-id="${esc(s.id||'')}">
    <label class="f"><span>${t('shiftType')}</span><select class="seType">
      ${['NORMAL','H24','HANDOVER','OFF'].map(type=>`<option value="${type}" ${s.type===type?'selected':''}>${type==='NORMAL'?'Normal':type==='H24'?t('h24'):type==='HANDOVER'?t('handover'):t('off')}</option>`).join('')}
    </select></label>
    <label class="f"><span>${t('timeFrom')}</span><input class="seFrom" type="time" value="${esc(s.from||'11:00')}"></label>
    <label class="f"><span>${t('timeTo')}</span><input class="seTo" type="time" value="${esc(s.to||s.from||'19:00')}"></label>
    <button class="mini-x seDelete" type="button" aria-label="${esc(t('deleteShift'))}">×</button>
  </div>`;
  openSheet(`<div class="admin-detail-hero">
      <div class="pa avatar" style="background:${safeColor(person.color)}">${initials(person.name)}</div>
      <div><div class="muted">${t('editShiftDay')}</div><h3 style="margin:1px 0">${esc(person.name)}</h3>
        <div class="muted">${esc(stamp.long)} · ${esc(stamp.full)}</div></div>
    </div>
    <div class="shift-editor-list" id="shiftEditorList">${existing.map(rowHtml).join('')}</div>
    <button class="btn sec" id="addShiftRow" type="button">＋ ${t('addShift')}</button>
    <div id="shiftEditStatus"></div>
    <button class="btn" id="saveShiftDay" type="button" style="margin-top:9px">${t('saveWithPin')}</button>`);

  const list=sheetEl.querySelector('#shiftEditorList');
  const wireRows=()=>list.querySelectorAll('.shift-edit-row').forEach(row=>{
    const sync=()=>{
      const off=row.querySelector('.seType').value==='OFF';
      row.querySelector('.seFrom').disabled=off;row.querySelector('.seTo').disabled=off;
    };
    row.querySelector('.seType').onchange=sync;sync();
    row.querySelector('.seDelete').onclick=()=>row.remove();
  });
  wireRows();
  sheetEl.querySelector('#addShiftRow').onclick=()=>{
    list.insertAdjacentHTML('beforeend',rowHtml({id:'',type:'NORMAL',from:'11:00',to:'19:00'}));wireRows();
  };
  sheetEl.querySelector('#saveShiftDay').onclick=()=>{
    const status=sheetEl.querySelector('#shiftEditStatus'), values=[];
    for(const row of list.querySelectorAll('.shift-edit-row')){
      const type=row.querySelector('.seType').value,from=row.querySelector('.seFrom').value,to=row.querySelector('.seTo').value;
      if(type!=='OFF'&&(!from||!to)){setStatus(status,t('invalidTime'),'error');return;}
      values.push({id:row.dataset.shiftId||'sh'+uid(),employeeId,day,type,
        ...(type==='OFF'?{}:{from,to:type==='H24'?from:to})});
    }
    askPin(t('saveWithPin'),who=>{
      if(!who.admin){setStatus(status,t('adminRequired'),'error');return;}
      DB.shifts=DB.shifts.filter(s=>!(s.employeeId===employeeId&&s.day===day)).concat(values);
      logEntry('SCHEDULE',`${t('editShiftDay')}: ${person.name} · ${stamp.long} ${stamp.full}`);
      if(!save()) return;closeSheet();render();toast(t('shiftSaved'),'success');
    });
  };
}

/** showWho=false στο πλέγμα ανά άτομο — το όνομα είναι ήδη η γραμμή. */
function cellItems(list, showWho = true, dateStr=state.date){
  return list.map(e=>{
    const who = entryEmployeeIds(e).length ? esc(employeeNames(e)) : t('unassigned');
    const kids = kidNames(e.childIds);
    const when = entryTime(e);
    const sub = [showWho ? who : '', e.note].filter(Boolean).join(' · ');
    return `<div class="cellitem" data-open-entry="${esc(e.id)}" data-entry-date="${esc(dateStr)}" role="button" tabindex="0">
      <button type="button" class="cellitem-x" data-remove-entry="${esc(e.id)}" data-entry-date="${esc(dateStr)}" aria-label="${esc(t('removeFromTable'))}" title="${esc(t('removeFromTable'))}">×</button>
      <div class="cellitem-body"><b>${esc(actLabel(e.activityId))}</b>${eventForEntry(e,dateStr)?` <span class="event-flag">${ui('u-megaphone')}</span>`:''}${
      kids ? ` <span class="c">${esc(kids)}</span>` : ''}${
      when ? `<div class="cellitem-time">${esc(when)}</div>` : ''}${
      sub ? `<div class="cellitem-sub">${esc(sub)}</div>` : ''}</div></div>`;
  }).join('');
}

function viewScheduleWeek(){
  const week = weekDates(state.date);
  const today = iso(new Date());
  const stamps = week.map((ds,i)=>dayStamp(ds,i));
  const byDate = {};
  week.forEach(ds => { byDate[ds] = entriesFor(ds).filter(e=>!e.cancelled &&
    (!state.houseFilter || !entryHouseIds(e).length || entryHouseIds(e).includes(state.houseFilter))); });
  const visibleHouses=planningHouses().filter(h=>!state.houseFilter || h.id===state.houseFilter);

  const houseTable = (blockId) => matrixView(visibleHouses.map(h=>h.name), stamps.map(s=>({
    label:esc(s.text),
    labelHtml:s.labelHtml,
    cells:visibleHouses.map(h=>{
      const list = byDate[s.ds].filter(e=>e.block===blockId && entryHouseIds(e).includes(h.id));
      return {html:cellItems(list,true,s.ds), action:`${s.ds}|${blockId}|${h.id}|`,
        aria:`${s.long} ${s.full} · ${h.name} · ${t(blockId)}`};
    }),
  })), {label:state.lang==='de'?'Tag':'Ημέρα', interactive:true, title:t(blockId)});

  const dayHeaders = stamps.map(s=>({html:s.headHtml, text:s.text}));
  const personTable = matrixView(dayHeaders, DB.employees.map(p=>({
    label:esc(p.name),
    cells:stamps.map(s=>{
      const list = byDate[s.ds].filter(e=>e.block==='afternoon' && entryEmployeeIds(e).includes(p.id));
      return {html:cellItems(list,false,s.ds), action:`${s.ds}|afternoon||${p.id}`,
        aria:`${p.name} · ${s.long} ${s.full} · ${t('afternoon')}`};
    }),
  })), {label:state.lang==='de'?'Person':'Άτομο', interactive:true, title:t('afternoon')});

  const stackBlock = (ds, blockId) => {
    const list = byDate[ds].filter(e=>e.block===blockId);
    const b = blockDef(blockId);
    let body;
    if(b.by==='house'){
      body = visibleHouses.map(h=>{
        const rows = list.filter(e=>entryHouseIds(e).includes(h.id));
        return `<div class="week-stack-lane">
          <div class="week-stack-lane-h">${esc(h.short||h.name)}</div>
          ${rows.length ? rows.map(e=>entryLine(e,ds)).join('')
            : `<button class="plan-lane-empty empty-state-btn" type="button" data-add="${blockId}" data-house="${h.id}" data-add-date="${ds}"><span class="empty-ico" aria-hidden="true">＋</span><span class="empty-title">${esc(t('planLaneEmpty'))}</span></button>`}
        </div>`;
      }).join('');
    }else{
      body = list.length
        ? list.map(e=>entryLine(e,ds)).join('')
        : `<button class="plan-lane-empty empty-state-btn" type="button" data-add="${blockId}" data-add-date="${ds}"><span class="empty-ico" aria-hidden="true">＋</span><span class="empty-title">${esc(t('planLaneEmpty'))}</span></button>`;
    }
    return `<div class="week-stack-block block-${blockId}">
      <div class="week-stack-block-h"><span>${t(blockId)}</span><span class="plan-time-chip">${b.from}–${b.to}</span></div>
      ${body}
    </div>`;
  };

  const dayStack = `<div class="week-day-stack" aria-label="${esc(t('viewWeek'))}">
    ${stamps.map(s=>{
      const count = byDate[s.ds].length;
      return `<section class="week-day-card ${s.ds===today?'is-today':''} ${s.ds===state.date?'is-selected':''}">
        <button type="button" class="week-day-card-h" data-jump-day="${s.ds}" aria-label="${esc(s.long)} ${esc(s.full)}">
          <span class="wd-main">
            <span class="wd-name">${esc(s.long)}</span>
            <span class="wd-date">${esc(s.full)}</span>
          </span>
          <span class="wd-meta">${count?`${count}`:''}<span class="wd-go" aria-hidden="true">›</span></span>
        </button>
        <div class="week-day-card-body">
          ${stackBlock(s.ds,'morning')}
          ${stackBlock(s.ds,'afternoon')}
          ${stackBlock(s.ds,'evening')}
        </div>
      </section>`;
    }).join('')}
  </div>`;

  const first = new Date(week[0]+'T12:00:00'), last = new Date(week[6]+'T12:00:00');
  return `
    <header class="plan-hero plan-hero-week">
      <div class="plan-hero-copy">
        <div class="brand-kicker">Armonia</div>
        <h2 class="plan-hero-date">${t('weekOf')}: ${first.getDate()}.${first.getMonth()+1}. – ${last.getDate()}.${last.getMonth()+1}.${last.getFullYear()}</h2>
        <p class="plan-hero-meet">${esc(t('besprechung'))}</p>
      </div>
      <div class="plan-hero-actions">
        <button class="btn sm sec" type="button" data-shift="-7" aria-label="${esc(t('previousFriday')||'‹')}">‹</button>
        <button class="btn sm sec" type="button" data-shift="7" aria-label="›">›</button>
        <button class="plan-hero-cta page-act primary" type="button" data-page-act="addEntry">${esc(t('topAdd'))}</button>
      </div>
    </header>
    ${dayStack}
    <div class="week-matrix-desktop">
      <div class="plan-block-h block-h block-morning"><span class="t">${t('morning')}</span><span class="hrs plan-time-chip">10:00–14:00</span></div>
      ${houseTable('morning')}
      <div class="plan-block-h block-h block-afternoon"><span class="t">${t('afternoon')}</span><span class="hrs plan-time-chip">15:00–19:00</span></div>
      ${personTable}
      <div class="plan-block-h block-h block-evening"><span class="t">${t('evening')}</span><span class="hrs plan-time-chip">19:00–22:00</span></div>
      ${houseTable('evening')}
    </div>
    ${weekNotesCard()}`;
}

/** Τα τέσσερα πλαίσια κειμένου του εντύπου + Erstellt von. */
function weekNotesCard(){
  const wk = DB.weeks[weekKey(state.date)] || {};
  const f = (id, label, val, rows=2) => `
    <label class="f"><span>${label}</span>
      <textarea id="${id}" rows="${rows}">${esc(val||'')}</textarea></label>`;
  return `<div class="card">
    <h2>${t('weekNotes')}</h2>
    ${f('wnAfternoon', t('hintAfternoon'), wk.hintAfternoon)}
    ${f('wnProjects',  t('projects'),      wk.projects)}
    ${f('wnMaterials', t('materials'),     wk.materials)}
    ${f('wnRemarks',   t('remarks'),       wk.remarks)}
    <div class="row" style="gap:8px">
      <button class="btn sec" id="wnToList">${t('toShoppingList')}</button>
      <button class="btn" id="wnSave">${t('saveNotes')}</button>
    </div>
    ${wk.createdBy ? `<div class="muted" style="margin-top:9px">${t('createdBy')}: ${esc(emp(wk.createdBy)?.name||'—')} · ${fmtDT(wk.createdAt)}</div>` : ''}
  </div>`;
}

function calendarMarkersForMonth(y, m){
  const markers = new Map();
  const pad = n=>String(n).padStart(2,'0');
  const daysInMonth = new Date(y, m+1, 0).getDate();
  for(let d=1; d<=daysInMonth; d++){
    const ds = y+'-'+pad(m+1)+'-'+pad(d);
    const entries = entriesFor(ds).filter(e=>!e.cancelled);
    const events = DB.events.filter(e=>e.status==='published' && e.date===ds);
    if(entries.length || events.length){
      markers.set(ds, {tasks:entries.length, events:events.length});
    }
  }
  return markers;
}

function calendarMonthGrid(year, month, markers){
  const first = new Date(year, month, 1);
  const startDow = (first.getDay()+6)%7;
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const pad = n=>String(n).padStart(2,'0');
  const cells = [];
  for(let i=0;i<startDow;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++){
    const ds = year+'-'+pad(month+1)+'-'+pad(d);
    cells.push({d, ds, mark: markers.get(ds)});
  }
  return cells;
}

function exportScheduleCalendarIcs(){
  const items = [];
  DB.events.filter(e=>e.status==='published').forEach(e=>{
    const [hh,mm] = String(e.from||'10:00').split(':').map(Number);
    const start = new Date(e.date+'T'+String(hh||10).padStart(2,'0')+':'+String(mm||0).padStart(2,'0')+':00');
    const end = new Date(start.getTime()+7200000);
    items.push({
      id:e.id, kind:'event', dateStr:e.date, title:(e.emoji||'📣')+' '+(e.title||e.name||'Event'),
      description:[e.description,e.bring? t('bring')+': '+e.bring:''].filter(Boolean).join('\n'),
      location:e.location||'', start, end,
    });
  });
  for(let i=0;i<21;i++){
    const d = new Date(); d.setDate(d.getDate()+i);
    const ds = iso(d);
    entriesFor(ds).filter(e=>!e.cancelled).forEach(e=>{
      const [hh,mm] = String(entryTime(e)||'09:00').split(':').map(Number);
      const start = new Date(ds+'T'+String(hh||9).padStart(2,'0')+':'+String(mm||0).padStart(2,'0')+':00');
      items.push({
        id:e.id, kind:'task', dateStr:ds, title: actLabel(e.activityId),
        description: [employeeNames(e), houseNames(e), e.note].filter(Boolean).join(' · '),
        start, end: new Date(start.getTime()+3600000),
      });
    });
  }
  if(!items.length){ toast(t('noEvents'),'info'); return; }
  downloadTextFile('armonia-thassos.ics', buildIcs(items));
  toast(t('exportCalendar'),'success');
}

function viewScheduleCalendar(){
  const now = new Date();
  const cm = state.calendarMonth ? new Date(state.calendarMonth+'T12:00:00') : now;
  const y = cm.getFullYear(), m = cm.getMonth();
  const markers = calendarMarkersForMonth(y, m);
  const cells = calendarMonthGrid(y, m, markers);
  const monthName = cm.toLocaleDateString(state.lang==='el'?'el-GR':'de-DE', {month:'long', year:'numeric'});
  const today = iso(now);
  const upcoming = [...DB.events].filter(e=>e.status==='published' && e.date>=today)
    .sort((a,b)=>(a.date+a.from).localeCompare(b.date+b.from)).slice(0,6);
  const notifAvail = typeof Notification !== 'undefined';
  const notifGranted = notifAvail && Notification.permission === 'granted';
  const notifRow = !notifAvail ? '' : notifGranted
    ? `<span class="cal-notif-pill" aria-live="polite">🔔 ${esc(t('notifEnabled'))}</span>`
    : `<button class="btn sm sec" type="button" id="enableNotifs">🔔 ${esc(t('notifEnable'))}</button>`;
  const taskLegend = state.lang === 'el' ? 'Εργασίες' : 'Aufgaben';
  const eventLegend = state.lang === 'el' ? 'Events' : 'Events';

  return `<section class="cal-shell">
    <div class="cal-head">
      <button class="btn sm sec cal-nav" type="button" data-cal-shift="-1" aria-label="${esc(t('calPrev'))}">${t('calPrev')}</button>
      <div class="cal-month">
        <span class="cal-month-kicker">${esc(t('viewCalendar'))}</span>
        <b class="cal-month-title">${esc(monthName)}</b>
      </div>
      <button class="btn sm sec cal-nav" type="button" data-cal-shift="1" aria-label="${esc(t('calNext'))}">${t('calNext')}</button>
    </div>
    <div class="cal-legend" aria-hidden="true">
      <span><i class="tk"></i>${esc(taskLegend)}</span>
      <span><i class="ev"></i>${esc(eventLegend)}</span>
    </div>
    <div class="cal-weekdays">${DAY_NAMES[state.lang].map(dn=>`<span>${esc(dn.slice(0,2))}</span>`).join('')}</div>
    <div class="cal-grid" role="grid" aria-label="${esc(monthName)}">${cells.map(c=>{
      if(!c) return `<div class="cal-cell empty" role="presentation"></div>`;
      const on = c.ds===state.date, isToday = c.ds===today;
      const dots = c.mark ? `<span class="cal-dots">${c.mark.events?'<i class="ev"></i>':''}${c.mark.tasks?'<i class="tk"></i>':''}</span>` : '';
      return `<button type="button" class="cal-cell ${on?'on':''} ${isToday?'today':''}" data-cal-date="${c.ds}"
        role="gridcell" aria-pressed="${on?'true':'false'}" aria-label="${esc(c.d + (isToday ? ' · ' + t('today') : ''))}">
        <span class="cal-n">${c.d}</span>${dots}</button>`;
    }).join('')}</div>
    <div class="cal-actions">
      <button class="btn sec sm" type="button" id="exportIcs">${ui('u-calendar')} ${esc(t('exportCalendar'))}</button>
      ${notifRow}
    </div>
    <div class="cal-upcoming">
      <div class="block-h plan-block-h"><span class="t">${ui('u-megaphone')} ${esc(t('upcomingEvents'))}</span></div>
      ${upcoming.length ? upcoming.map(homeEventCard).join('') : `<div class="empty">${esc(t('noEvents'))}</div>`}
    </div>
  </section>`;
}

function viewSchedule(){
  const sv = state.scheduleView;
  const showHouse = ['day','week'].includes(sv);
  const viewBtn = (id, icon, label, shortLabel) =>
    `<button type="button" class="${sv===id?'on':''}" data-v="${id}" title="${esc(label)}" aria-label="${esc(label)}" aria-pressed="${sv===id?'true':'false'}">
      <span class="planner-seg-ico" aria-hidden="true">${ui(icon,'sm')}</span>
      <span class="planner-seg-lbl"><span class="lbl-full">${esc(label)}</span><span class="lbl-short">${esc(shortLabel||label)}</span></span>
    </button>`;
  const eventsShort = state.lang==='el' ? 'Evt' : 'Evt';
  const calShort = state.lang==='el' ? 'Ημ' : 'Kal';
  const viewLabel = sv==='day'?t('viewDay'):sv==='week'?t('viewWeek'):sv==='calendar'?t('viewCalendar'):sv==='shift'?t('viewShift'):t('viewEvents');
  const houseLabel = !showHouse ? '' :
    (state.houseFilter ? (planningHouses().find(h=>h.id===state.houseFilter)?.short||'') : t('all'));
  const summaryMeta = [viewLabel, houseLabel].filter(Boolean).join(' · ');
  const chromePanel = `
        <div class="seg planner-seg" id="schView" role="tablist" aria-label="${esc(t('filterView'))}">
          ${viewBtn('day','u-calendar',t('viewDay'))}
          ${viewBtn('week','u-tasks',t('viewWeek'))}
          ${viewBtn('calendar','u-calendar',t('viewCalendar'),calShort)}
          ${viewBtn('shift','u-clock',t('viewShift'))}
          ${viewBtn('events','u-megaphone',t('viewEvents'),eventsShort)}
        </div>
        ${showHouse?`<div class="seg planner-seg planner-seg-house house-selector" id="hFilter" role="tablist" aria-label="${esc(t('filterHouse'))}">
          <button type="button" class="${state.houseFilter===''?'on':''}" data-h="" title="${esc(t('all'))}" aria-label="${esc(t('all'))}">${esc(t('all'))}</button>
          ${planningHouses().map(h=>`<button type="button" class="${state.houseFilter===h.id?'on':''}" data-h="${h.id}" title="${esc(h.name)}" aria-label="${esc(h.name)}">${esc(h.short)}</button>`).join('')}
        </div>`:''}`;
  return `
    <div class="planner ${sv==='day'?'plan-day':sv==='week'?'plan-week':sv==='calendar'?'plan-calendar':sv==='shift'?'plan-shift':'plan-events'}">
      <div class="adaptive-chrome planner-chrome-wrap">
        <button type="button" class="adaptive-chrome-summary" data-adaptive-toggle aria-expanded="false">
          <span class="adaptive-summary-label">${esc(t('menuFilters'))}</span>
          <span class="adaptive-summary-meta">${esc(summaryMeta)}</span>
          <span class="adaptive-chevron" aria-hidden="true">▾</span>
        </button>
        <button type="button" class="adaptive-backdrop" data-adaptive-toggle aria-label="${esc(t('close'))}" tabindex="-1"></button>
        <div class="adaptive-chrome-panel planner-chrome">
          <div class="adaptive-chrome-panel-head">
            <b>${esc(t('menuFilters'))}</b>
            <button type="button" class="adaptive-chrome-done" data-adaptive-toggle>${esc(t('menuDone'))}</button>
          </div>
          ${chromePanel}
        </div>
      </div>
      ${sv==='day' ? viewScheduleDay()
        : sv==='week' ? viewScheduleWeek()
        : sv==='calendar' ? viewScheduleCalendar()
        : sv==='shift' ? viewShifts() : staffEventsView()}
    </div>`;
}

/* ── Φόρμα εγγραφής ── */
function sheetEntry(e, dateStr, presets = {}){
  const isNew = !e;
  const blockId = e ? e.block : (presets.block || 'afternoon');
  const def = blockDef(blockId);
  const presetHouseIds = presets.houseIds || (presets.houseId ? [presets.houseId] :
    def.by==='house' ? [state.houseFilter || planningHouses()[0].id] : []);
  const presetEmployeeIds = presets.employeeIds || (presets.employeeId ? [presets.employeeId] : []);
  e = e || {
    block: blockId, houseIds:presetHouseIds, houseId:presetHouseIds[0]||null,
    employeeIds:presetEmployeeIds, employeeId:presetEmployeeIds[0]||null,
    childIds: [], activityId: DB.activities[0].id, note:'', time:'', source:'extra',
  };
  const linkedEvent = DB.events.find(x=>x.scheduleEntryId===e.id && x.scheduleDate===dateStr);
  let pickedAct = e.activityId;
  let pickedHouses = entryHouseIds(e);
  let pickedPeople = entryEmployeeIds(e);
  let pickedKids = [...(e.childIds || [])];
  let scope = 'override';

  const dayIdx = dowIdx(new Date(dateStr+'T12:00:00'));
  feedback('open');

  openSheet(`
    <div class="entry-sheet-head">
      <h3>${isNew ? t('newEntry') : t('edit')}</h3>
      <div class="entry-sheet-meta">
        <span class="block-pill">🕐 ${esc(t(blockId))} · ${def.from}–${def.to}</span>
      </div>
      <button class="event-toggle ${linkedEvent?.status==='published'?'on':''}" id="fEventToggle" type="button"
        aria-pressed="${linkedEvent?.status==='published'?'true':'false'}">
        <span><span class="ev-ico" aria-hidden="true">${ui('u-megaphone')}</span>
          <b id="fEventToggleLabel">${linkedEvent?.status==='published'?t('eventButtonOn'):t('eventButton')}</b>
          <span class="ev-sub">${t('announceHint')}</span>
        </span>
        <span aria-hidden="true">${linkedEvent?.status==='published'?'✓':'○'}</span>
      </button>
      <input type="checkbox" id="fAnnounce" hidden ${linkedEvent?.status==='published'?'checked':''}>
    </div>

    ${entrySec('🏠', t('house'), t('chooseMany'))}
    <div class="check-grid" id="fHouses">
      ${planningHouses().map(h=>houseOptionHtml(h, pickedHouses.includes(h.id))).join('')}
    </div>

    ${entrySec('👤', t('person'), t('chooseMany'))}
    <div class="check-grid" id="fPeople">
      ${DB.employees.map(p=>personOptionHtml(p, pickedPeople.includes(p.id))).join('')}
    </div>

    ${entrySec('👶', t('children'))}
    <div class="chips" id="fGroups" style="margin:-4px 0 8px">
      ${DB.groups.map(g=>{
        const on=g.childIds.every(id=>pickedKids.includes(id));
        return groupChipHtml(g, on);
      }).join('')}
    </div>
    <div class="chips" id="fKids" style="margin:0 0 12px">
      ${DB.children.map(c=>kidChipHtml(c, pickedKids.includes(c.id))).join('')}
    </div>

    ${entrySec('🎯', t('activity'))}
    <div class="chips" id="fActs" style="margin:-4px 0 12px">
      ${ACTS().map(a=>`<button class="chip ${a.id===pickedAct?'on':''}" data-a="${a.id}" type="button">${esc(a.emoji||'')} ${esc(L(a))}</button>`).join('')}
      <button class="chip" id="fNewAct" style="border-style:dashed" type="button">＋ ${t('newActivity')}</button>
    </div>

    ${entrySec('⏱', t('time'))}
    <div class="chips" id="fTimePresets" style="margin:-4px 0 8px">
      <button class="chip" data-tp="full" type="button">🗓 ${t('fullBlock')} ${def.from}–${def.to}</button>
      ${['15:00','16:00','17:00','18:00','19:00','20:00']
        .filter(x => x >= def.from && x < def.to)
        .map(x=>`<button class="chip" data-tp="${x}" type="button">⏰ ${t('fromTime')} ${x}</button>`).join('')}
    </div>
    <div class="row" style="gap:10px">
      <label class="f grow"><span>▶️ ${t('timeFrom')}</span>
        <input type="time" id="fFrom" value="${esc(e.from || def.from)}"></label>
      <label class="f grow"><span>⏹ ${t('timeTo')}</span>
        <input type="time" id="fTo" value="${esc(e.to || def.to)}"></label>
    </div>
    <label class="f"><span>📝 ${t('note')}</span>
      <textarea id="fNote" rows="2" placeholder="${t('notePh')}">${esc(e.note||'')}</textarea></label>

    <div id="fEventFields" style="display:${linkedEvent?.status==='published'?'block':'none'}">
      <div class="card" style="border-color:rgba(42,107,82,.28);background:#eef5f0;margin-bottom:10px">
        <div class="strong">📣 ${t('announceEvent')}</div>
        <div class="muted" id="fEventAudience">${T[state.lang].kidsNotified(pickedKids.length)} ${t('announceHint')}</div>
      </div>
      <label class="f"><span>🏷 ${t('eventTitle')}</span><input id="fEventTitle" value="${esc(linkedEvent?L(linkedEvent):actLabel(e.activityId))}"></label>
      <div class="row" style="gap:10px">
        <label class="f grow"><span>📍 ${t('eventLocation')}</span><input id="fEventLocation" value="${esc(linkedEvent?.location||entryHouseIds(e).map(id=>house(id)?.name).filter(Boolean).join(', '))}"></label>
        <label class="f grow"><span>🎒 ${t('eventBring')}</span><input id="fEventBring" value="${esc(linkedEvent?L(linkedEvent.bring):'')}"></label>
      </div>
    </div>

    ${e.source==='template' ? `
      <div class="seg" id="fScope">
        <button class="on" data-s="override" type="button">${t('scopeToday')}</button>
        <button data-s="template" type="button">${t('scopeTemplate')}</button>
      </div>
      <div class="muted" id="scopeHint" style="margin:-6px 0 12px">${t('scopeTodayHint')}</div>
      <div class="muted" style="margin:-6px 0 12px">${t('adminOnly')}</div>` : ''}

    <button class="btn" id="fSave">💾 ${t('saveWithPin')}</button>
    ${!isNew && !e.cancelled ? `<button class="btn sec" id="fCancel" style="margin-top:8px">🗑 ${t('cancelToday')}</button>` : ''}
  `);

  /** Ξαναχτίζει τα chips δραστηριοτήτων — ώστε μια νέα να εμφανίζεται αμέσως. */
  function paintActs(){
    const box = sheetEl.querySelector('#fActs');
    box.innerHTML =
      ACTS().map(a=>`<button class="chip ${a.id===pickedAct?'on':''}" data-a="${a.id}" type="button">${esc(a.emoji||'')} ${esc(L(a))}</button>`).join('') +
      `<button class="chip" id="fNewAct" style="border-style:dashed" type="button">＋ ${t('newActivity')}</button>`;
    box.querySelectorAll('.chip[data-a]').forEach(b=>{
      b.onclick = () => { pickedAct = b.dataset.a; feedback('select'); paintActs(); };
    });
    box.querySelector('#fNewAct').onclick = openNewActivity;
  }
  const paintKids = () => {
    const kidsBox=sheetEl.querySelector('#fKids');
    if(kidsBox) kidsBox.innerHTML=DB.children.map(c=>kidChipHtml(c, pickedKids.includes(c.id))).join('');
    sheetEl.querySelectorAll('#fKids .chip').forEach(b=>{
      b.onclick = () => {
        const id = b.dataset.c;
        pickedKids = pickedKids.includes(id) ? pickedKids.filter(x=>x!==id) : [...pickedKids, id];
        feedback('select');
        paintKids();
      };
    });
    sheetEl.querySelectorAll('#fGroups .chip').forEach(x=>{
      const g=DB.groups.find(g=>g.id===x.dataset.g);
      x.classList.toggle('on',!!g && g.childIds.every(id=>pickedKids.includes(id)));
    });
    const audience=sheetEl.querySelector('#fEventAudience');
    if(audience) audience.textContent=`${T[state.lang].kidsNotified(pickedKids.length)} ${t('announceHint')}`;
  };

  sheetEl.querySelectorAll('#fHouses .check-option, #fPeople .check-option').forEach(label=>{
    label.addEventListener('change', ()=>feedback('select'));
  });

  // Ομάδα: βάζει/βγάζει όλα τα παιδιά της με ένα πάτημα
  sheetEl.querySelectorAll('#fGroups .chip').forEach(b=>{
    b.onclick = () => {
      const g = DB.groups.find(x=>x.id===b.dataset.g);
      const allIn = g.childIds.every(id=>pickedKids.includes(id));
      pickedKids = allIn
        ? pickedKids.filter(id=>!g.childIds.includes(id))
        : [...new Set([...pickedKids, ...g.childIds])];
      feedback('toggle');
      paintKids();
    };
  });

  /** Νέα δραστηριότητα χωρίς να βγεις από τη φόρμα — μένει για πάντα στη λίστα. */
  function openNewActivity(){
    if(sheetEl.querySelector('#naWrap')) return;
    feedback('tap');
    const wrap = document.createElement('div');
    wrap.id = 'naWrap';
    wrap.style.cssText = 'margin:-6px 0 12px;display:flex;gap:8px';
    wrap.innerHTML = `
      <input id="naEmoji" style="width:62px;text-align:center" placeholder="🙂" maxlength="2">
      <input id="naName" class="grow" placeholder="${t('activityName')}">
      <button class="btn sm" id="naAdd">${t('addBtn')}</button>
      <button class="mini-x" id="naClose" type="button" aria-label="${esc(t('close'))}">×</button>`;
    sheetEl.querySelector('#fActs').after(wrap);
    wrap.querySelector('#naName').focus();
    wrap.querySelector('#naAdd').onclick = () => {
      const label = wrap.querySelector('#naName').value.trim();
      if(!label){ feedback('error'); toast(t('activityName')); return; }
      const a = {id:'c'+uid(), emoji: wrap.querySelector('#naEmoji').value.trim() || '📝',
                 de:label, el:label, custom:true};
      DB.customActivities.push(a); save();
      pickedAct = a.id;
      wrap.remove();
      paintActs();
      feedback('success');
      toast(t('saved'));
    };
    wrap.querySelector('#naClose').onclick = () => wrap.remove();
  }
  paintActs();
  paintKids();

  const paintEventToggle = () => {
    const input=sheetEl.querySelector('#fAnnounce'), button=sheetEl.querySelector('#fEventToggle');
    sheetEl.querySelector('#fEventFields').style.display=input.checked?'block':'none';
    button.classList.toggle('on',input.checked);
    button.setAttribute('aria-pressed',String(input.checked));
    const label=sheetEl.querySelector('#fEventToggleLabel');
    if(label) label.textContent=input.checked?t('eventButtonOn'):t('eventButton');
    const mark=button.querySelector(':scope > span:last-child');
    if(mark) mark.textContent=input.checked?'✓':'○';
    if(input.checked && !sheetEl.querySelector('#fEventTitle').value.trim())
      sheetEl.querySelector('#fEventTitle').value=actLabel(pickedAct);
  };
  sheetEl.querySelector('#fEventToggle').onclick=()=>{
    const input=sheetEl.querySelector('#fAnnounce'); input.checked=!input.checked;
    feedback('toggle');
    paintEventToggle();
  };
  paintEventToggle();

  const segEl = sheetEl.querySelector('#fScope');
  if(segEl) segEl.querySelectorAll('button').forEach(b=>{
    b.onclick = () => {
      scope = b.dataset.s;
      feedback('select');
      segEl.querySelectorAll('button').forEach(x=>x.classList.toggle('on', x.dataset.s===scope));
      sheetEl.querySelector('#scopeHint').textContent = scope==='template'
        ? T[state.lang].scopeTemplateHint(DAY_LONG[state.lang][dayIdx])
        : t('scopeTodayHint');
    };
  });

  // Πατάς preset → γεμίζουν τα δύο πεδία ώρας
  sheetEl.querySelectorAll('#fTimePresets .chip').forEach(b=>{
    b.onclick = () => {
      const v = b.dataset.tp;
      sheetEl.querySelector('#fFrom').value = v === 'full' ? def.from : v;
      sheetEl.querySelector('#fTo').value = def.to;
      feedback('select');
      sheetEl.querySelectorAll('#fTimePresets .chip').forEach(x=>x.classList.toggle('on', x===b));
    };
  });

  const readForm = () => {
    const from = sheetEl.querySelector('#fFrom').value || def.from;
    const to   = sheetEl.querySelector('#fTo').value   || def.to;
    pickedHouses=[...sheetEl.querySelectorAll('#fHouses input:checked')].map(x=>x.value);
    pickedPeople=[...sheetEl.querySelectorAll('#fPeople input:checked')].map(x=>x.value);
    return {
      block: blockId,
      houseIds:[...pickedHouses], houseId:pickedHouses[0]||null,
      employeeIds:[...pickedPeople], employeeId:pickedPeople[0]||null,
      childIds: [...pickedKids],
      activityId: pickedAct,
      // Κρατάμε ώρα μόνο όταν διαφέρει από το μπλοκ — αλλιώς ισχύει όλο το μπλοκ
      from: (from === def.from && to === def.to) ? '' : from,
      to:   (from === def.from && to === def.to) ? '' : to,
      note: sheetEl.querySelector('#fNote').value.trim(),
    };
  };

  const describe = f => `${t(blockId)}: ${employeeNames(f)}${
    entryHouseIds(f).length ? ' @ '+houseNames(f) : ''} · ${actLabel(f.activityId)}${
    f.childIds.length ? ' — ' + kidNames(f.childIds) : ''} (${entryTime({...f, block:blockId})})${
    f.note?' — '+f.note:''}`;

  const syncLinkedEvent = (entryId,f) => {
    if(!sheetEl.querySelector('#fAnnounce')?.checked){
      const prior=DB.events.find(x=>x.scheduleEntryId===entryId && x.scheduleDate===dateStr);
      if(prior?.status==='published') prior.status='draft';
      return null;
    }
    const title=sheetEl.querySelector('#fEventTitle')?.value.trim()||'';
    const idx=DB.events.findIndex(x=>x.scheduleEntryId===entryId && x.scheduleDate===dateStr);
    const prior=idx>=0?DB.events[idx]:{};
    const value={...prior,id:prior.id||'ev'+uid(),de:title,el:title,
      description:{de:f.note||'',el:f.note||''},date:dateStr,
      from:f.from||def.from,to:f.to||def.to,location:sheetEl.querySelector('#fEventLocation')?.value.trim()||'',
      employeeIds:[...f.employeeIds],employeeId:f.employeeId,childIds:[...f.childIds],
      bring:{de:sheetEl.querySelector('#fEventBring')?.value.trim()||'',el:sheetEl.querySelector('#fEventBring')?.value.trim()||''},
      emoji:act(f.activityId)?.emoji||'🎉',color:prior.color||'#2f5a63',status:'published',
      scheduleEntryId:entryId,scheduleDate:dateStr};
    if(idx>=0) DB.events[idx]=value; else DB.events.push(value);
    logEntry('EVENT',`${t('eventPublished')}: ${title}`);
    return value;
  };

  sheetEl.querySelector('#fSave').onclick = () => {
    const f = readForm();
    const announce=!!sheetEl.querySelector('#fAnnounce')?.checked;
    if(blockDef(blockId).by === 'house' && !f.houseIds.length){ feedback('error'); toast(t('selectHouse'),'error'); return; }
    if(announce &&
      (!sheetEl.querySelector('#fEventTitle').value.trim() || !f.childIds.length)){
      feedback('error'); toast(t('eventRequired'),'error'); return;
    }
    askPin(t('saveWithPin'), who => {
      state.user = who;
      let savedEntryId=e.id;
      // Μόνιμη αλλαγή προτύπου: μόνο Zoi, Angelos, Dimitris
      if(e.source === 'template' && scope === 'template' && !who.admin){
        feedback('warn'); toast(t('adminOnly')); return;
      }
      if(e.source === 'template' && scope === 'template'){
        const row=DB.template.find(x=>x.id===e.id);
        if(!row){ toast(t('unexpectedError'),'error'); return; }
        Object.assign(row, f);
        DB.overrides = DB.overrides.filter(o => !(o.date===dateStr && o.templateId===e.id));
        logEntry('SCHEDULE', `${DAY_LONG[state.lang][dayIdx]} · Vorlage: ${describe(f)}`);
      }else if(e.source === 'template'){
        const ex = DB.overrides.find(o=>o.date===dateStr && o.templateId===e.id);
        if(ex) Object.assign(ex, f, {cancelled:false});
        else DB.overrides.push({id:uid(), date:dateStr, templateId:e.id, ...f});
        logEntry('SCHEDULE', `${dateStr} · ${describe(f)}`);
      }else{
        const ex = DB.overrides.find(o=>o.id===e.id);
        if(ex) Object.assign(ex, f);
        else { savedEntryId=uid(); DB.overrides.push({id:savedEntryId, date:dateStr, templateId:null, ...f}); }
        logEntry('SCHEDULE', `${dateStr} · ${describe(f)}`);
      }
      const eventToNotify=syncLinkedEvent(savedEntryId,f);
      if(!save()) return;
      closeSheet(); render(); feedback('save'); toast(announce?t('eventPublished'):t('changesSaved'),'success');
      if(eventToNotify) sendEventWhatsapp(eventToNotify);
    });
  };

  const cancelBtn = sheetEl.querySelector('#fCancel');
  if(cancelBtn) cancelBtn.onclick = () => {
    cancelScheduleEntry(e, dateStr, {onDone:()=>{ closeSheet(); render(); }});
  };
}

/* ════════════════════════════════════════════════════════════════
   Ψυγείο / Αποθήκη
   ════════════════════════════════════════════════════════════════ */
const stockKey = (hid, pid) => `${hid}:${pid}`;

/** Πότε & από ποιον μπήκε τελευταία φορά αυτό το προϊόν στο σπίτι. */
function lastPurchaseOf(hid, pid){
  const hits = DB.listEntries
    .filter(e => e.houseId===hid && e.productId===pid && e.status==='bought' && e.decidedAt);
  if(!hits.length) return null;
  return hits.reduce((a,b) => a.decidedAt > b.decidedAt ? a : b);
}

/* ── Food & category icons (SVG sprite in index.html) ──────────────────
   Replaces the emoji category/product glyphs. Sprite symbols are
   monochrome, so `fill:currentColor` themes them with the surrounding
   text — including the dark Lager surface. */
const CAT_ICON = {fridge:'cheese', produce:'carrot', dry:'wheat',
                  drinks:'bottle', household:'bottle-droplet', custom:'fork-knife'};
/* Product-level overrides, keyed by the German name. Anything not listed
   falls back to its category icon, so every row always has a glyph. */
const PROD_ICON = {
  'Milch':'milk-carton','Butter':'butter','Margarine':'butter-ghee','Käse':'cheese',
  'Streukäse':'cheese','Frischkäse':'cheese','Feta':'cheese','Joghurt':'yogurt',
  'Eier':'egg','Schinken':'meat','Salami':'meat',
  'Tomaten':'tomato','Gurken':'cucumber','Paprika':'chili','Zucchini':'eggplant',
  'Möhren':'carrot','Äpfel':'apple','Zitronen':'lemon','Wassermelone':'grape',
  'Toastbrot':'bread','Deutsches Brot':'bread','Blätterteig':'bread','Wraps':'bread',
  'Cornflakes':'wheat','Granola':'wheat','Haferflocken':'wheat',
  'Makkaroni':'wheat','Spirelli':'wheat','Spaghetti':'wheat','Lasagneplatten':'wheat',
  'Reis':'bowl-rice','Mais':'corn','Kirschmarmelade':'honey',
  'Salz':'food-seasoning','Pfeffer gemahlen':'food-seasoning','Waschmaschinensalz':'food-seasoning',
  'Öl':'bottle','Essig weiß':'bottle','Essig rot':'bottle','Ketchup':'bottle',
  'Tomatensoße':'canned-food','Süßsauer im Glas':'canned-food',
  'Vanillearoma':'bottle-droplet','Spüli':'bottle-droplet','Bodenputzmittel':'bottle-droplet',
  'Wasser':'bottle','Sprudelwasser':'glass-fill',
};
const catIconId  = cid => CAT_ICON[cid] || 'fork-knife';
const prodIconId = pr  => (pr && PROD_ICON[pr.de]) || catIconId(pr && pr.cat);
const svgIcon = (id, cls) => `<svg class="${cls}" aria-hidden="true"><use href="#f-${id}"/></svg>`;

function viewStock(){
  const hid = state.house;
  const houses=hid==='all'?DB.houses:[house(hid)];
  const friday=state.shopFriday||fridayFor();
  const productState=p=>{
    const values=houses.map(h=>DB.stock[stockKey(h.id,p.id)]??0);
    return values.some(q=>q===0)?'empty':values.some(q=>q<=lowThreshold(p))?'low':'ok';
  };
  const allProducts=PRODUCTS();
  const counts={empty:0,low:0,ok:0};allProducts.forEach(p=>counts[productState(p)]++);
  const query=norm(state.stockQuery||'');
  const visible=allProducts.filter(p=>{
    const st=productState(p), matches=!query||norm(`${p.de} ${p.el}`).includes(query);
    return matches&&(!!query||state.stockFilter==='all'||state.stockFilter===st||state.stockFilter==='attention'&&st!=='ok');
  });
  const catIcon = cid => svgIcon(catIconId(cid), 'cat-ico');
  const productCard=p=>{
    const st=productState(p);
    if(hid==='all'){
      if(state.stockTiles){
        const qtyLine=houses.map(h=>`${esc(h.short)} ${DB.stock[stockKey(h.id,p.id)]??0}`).join(' · ');
        return `<button class="stock-tile ${st}" type="button" data-stock-product="${p.id}" aria-label="${t('tapProduct')}: ${esc(L(p))}">
          <span class="stock-tile-name">${esc(L(p))}</span>
          <b class="stock-tile-qty">${houses.map(h=>DB.stock[stockKey(h.id,p.id)]??0).join('/')}</b>
          <span class="stock-tile-meta">${qtyLine}</span>
        </button>`;
      }
      const quantities=houses.map(h=>`<div class="stock-qty"><span class="stock-state">${esc(h.short)}</span>${DB.stock[stockKey(h.id,p.id)]??0}<small>${esc(p.unit)}</small></div>`).join('');
      const wantBtns=houses.map(h=>{
        const planned=isProductOnFridayList(h.id,p.id,friday);
        return `<button type="button" class="want-bought ${planned?'on':''}" data-want-shop="${p.id}" data-want-house="${h.id}" ${planned?'disabled':''}>${planned?'✓ ':''}${esc(h.short)}</button>`;
      }).join('');
      return `<div class="stock-product ${st} multi-house">
        <button class="stock-product-main" data-stock-product="${p.id}" type="button" aria-label="${t('tapProduct')}: ${esc(L(p))}"><div class="stock-product-name">${esc(L(p))}</div>
        <div class="stock-product-meta">${t(st==='empty'?'stockOutState':st==='low'?'stockLow':'stockHealthy')} · ✎</div></button>
        <div class="stock-product-side"><div class="stock-house-quantities">${quantities}</div></div>
        <div class="want-bought-row" role="group" aria-label="${esc(t('wantBought'))}">${wantBtns}</div></div>`;
    }
    const qty=DB.stock[stockKey(hid,p.id)]??0;
    const step=stepFor(p);
    const delta=state.stockDraft[p.id]||0;
    const preview=roundStock(qty+delta);
    const pending=delta?`<span class="stock-pending ${delta>0?'in':'out'}">${delta>0?'+':''}${delta}</span>`:'';
    const planned=isProductOnFridayList(hid,p.id,friday);
    const selecting=state.selectMode==='stock' && hid!=='all';
    const sel=selecting && isSelected(p.id);
    return `<div class="stock-product ${st} has-stepper ${delta?'drafting':''} ${sel?'selected':''}">
      ${selecting?`<button class="bulk-check ${sel?'on':''}" type="button" data-bulk-toggle="${p.id}" aria-pressed="${sel?'true':'false'}" aria-label="${esc(t('selectMode'))}"></button>`:''}
      <button class="stock-product-main" data-stock-product="${p.id}" type="button" aria-label="${t('tapProduct')}: ${esc(L(p))}">
        <div class="stock-product-name">${svgIcon(prodIconId(p),'prod-ico')}${esc(L(p))}${pending}</div>
        <div class="stock-product-meta">${t(st==='empty'?'stockOutState':st==='low'?'stockLow':'stockHealthy')} · ✎</div>
      </button>
      ${selecting?'':`<div class="stock-stepper" role="group" aria-label="${esc(L(p))}">
        <button class="stock-step out" type="button" data-stock-step="OUT" data-pid="${p.id}" aria-label="${t('stockOut')} −${step} ${esc(p.unit)}" ${preview<=0&&delta<=0?'disabled':''}>−</button>
        <div class="stock-qty ${delta>0?'draft-in':delta<0?'draft-out':''}">${preview}<small>${esc(p.unit)}</small></div>
        <button class="stock-step in" type="button" data-stock-step="IN" data-pid="${p.id}" aria-label="${t('stockIn')} +${step} ${esc(p.unit)}">＋</button>
      </div>
      <button type="button" class="want-bought ${planned?'on':''}" data-want-shop="${p.id}" ${planned?'disabled':''}>${planned?'✓ '+t('wantBoughtDone'):t('wantBought')}</button>`}
    </div>`;
  };
  const forceOpenCats=!!query || state.stockFilter!=='all';
  const categoryHtml=CATS().map(c=>{
    const products=visible.filter(p=>p.cat===c.id);if(!products.length)return '';
    const hasAttention=products.some(p=>{const st=productState(p);return st==='empty'||st==='low';});
    const hasDraft=hid!=='all'&&products.some(p=>state.stockDraft[p.id]);
    const shouldOpen=forceOpenCats||hasAttention||hasDraft;
    return `<details class="stock-category" data-stock-category="${c.id}" data-default-open="${shouldOpen?'1':'0'}"${shouldOpen?' open':''}><summary><span class="cat-ico-wrap">${catIcon(c.id)}</span><span>${esc(L(c))}</span>
      <span class="stock-cat-count">${products.length}</span></summary><div class="stock-product-grid ${hid==='all'&&state.stockTiles?'tiles':''}">${products.map(productCard).join('')}</div></details>`;
  }).join('');
  const missing=DB.listEntries.filter(e=>e.status==='missing'&&(hid==='all'||e.houseId===hid));
  const attention=counts.empty+counts.low;

  return `<div class="stock-shell">
    <header class="ops-hero stock-hero">
      <p class="brand-kicker">Armonia</p>
      <h2>${esc(t('headerStock'))}</h2>
      <p>${esc(t('stockHeroHint'))}</p>
      <div class="ops-hero-stats" role="group" aria-label="${esc(t('menuFilters'))}">
        ${statTileHtml(counts.empty, t('stockEmpty'), 'u-alert', counts.empty?'down':'')}
        ${statTileHtml(attention, t('stockAttention'), 'u-leaf', attention?'down':'')}
        ${(()=>{ const sp=stockQtySparkHistory(hid); return sp.length?`<div class="w-stat"><span class="w-stat-lbl">7d</span>${sparklineHtml(sp,'sea')}</div>`:''; })()}
        ${statTileHtml(counts.ok, t('stockHealthy'), 'u-check', '')}
      </div>
    </header>
    <div class="stock-command" aria-label="${esc(t('headerStock'))}">
      <div class="seg house-selector" id="sHouse" aria-label="${t('filterHouse')}">
        ${DB.houses.map(h=>`<button class="${hid===h.id?'on':''}" data-h="${h.id}">${ui('u-person','sm')} ${esc(h.short)}</button>`).join('')}
        <button class="${hid==='all'?'on':''}" data-h="all">${t('bothHouses')}</button>
      </div>
      <div class="stock-command-row">
        <label class="stock-search"><span>⌕</span><input id="stockSearch" value="${esc(state.stockQuery)}" placeholder="${t('stockSearch')}" aria-label="${t('stockSearch')}">${state.stockQuery?'<button type="button" id="stockClear" aria-label="'+t('close')+'">×</button>':''}</label>
        ${hid==='all'?`<button class="stock-tool ${state.stockTiles?'on':''}" type="button" id="stockTilesToggle" title="${esc(state.stockTiles?t('stockTilesOff'):t('stockTilesOn'))}" aria-label="${esc(state.stockTiles?t('stockTilesOff'):t('stockTilesOn'))}" aria-pressed="${state.stockTiles?'true':'false'}">${state.stockTiles?'▦':'☰'}</button>`:''}
        ${hid!=='all'?`<button class="stock-tool ${state.selectMode==='stock'?'on':''}" type="button" id="stockSelectToggle" title="${esc(state.selectMode==='stock'?t('selectDone'):t('selectMode'))}" aria-label="${esc(state.selectMode==='stock'?t('selectDone'):t('selectMode'))}" aria-pressed="${state.selectMode==='stock'?'true':'false'}">${state.selectMode==='stock'?'✓':'☑'}</button>
        <button class="stock-tool labeled" type="button" id="stockQuickList" title="${esc(t('stockQuickList'))}" aria-label="${esc(t('stockQuickList'))}"><span aria-hidden="true">⚡</span><span>${esc(t('stockQuickListShort'))}</span></button>
        <button class="stock-tool labeled" type="button" id="stockOpenBoard" title="${esc(t('stockBoard'))}" aria-label="${esc(t('stockBoard'))}"><span aria-hidden="true">▦</span><span>${esc(t('stockBoardShort'))}</span></button>
        <button class="stock-tool labeled" type="button" id="stockQuickFood" title="${esc(t('stockAddFood'))}" aria-label="${esc(t('stockAddFood'))}"><span aria-hidden="true">＋</span><span>${esc(t('stockAddFoodShort'))}</span></button>`:''}
      </div>
      <div class="stock-strip-stats" role="toolbar" aria-label="${esc(t('menuFilters'))}">
        <button type="button" class="stock-chip empty ${state.stockFilter==='empty'?'on':''}" data-stock-filter="empty"><b>${counts.empty}</b>${t('stockEmpty')}</button>
        <button type="button" class="stock-chip low ${state.stockFilter==='attention'?'on':''}" data-stock-filter="attention"><b>${attention}</b>${t('stockAttention')}</button>
        <button type="button" class="stock-chip ok ${state.stockFilter==='all'?'on':''}" data-stock-filter="all"><b>${allProducts.length}</b>${t('stockAll')}</button>
        <button type="button" class="stock-chip check" id="stockShiftCheck" title="${esc(t('shiftStockCheck'))}">☑️</button>
      </div>
    </div>
    ${shiftPresenceBannerHtml()}
    ${shiftStockCheckBannerHtml()}
    ${missing.length?`<div class="stock-notice"><span>⚠️</span><b>${T[state.lang].missingFromShop(missing.length)}</b><button class="btn sec sm" id="stockToList">${t('openShopping')}</button></div>`:''}
    <div class="stock-categories">${categoryHtml||emptyState(ui('u-search'), t('noStockResults'), t('noStockHint'), state.stockQuery?`<button class="btn sm sec" type="button" id="stockEmptyClear">${esc(t('stockClearSearch'))}</button>`:(hid!=='all'?`<button class="btn sm" type="button" id="stockEmptyAdd">${esc(t('stockAddFoodShort'))}</button>`:''))}</div>
    ${state.selectMode==='stock'&&hid!=='all'?bulkBarHtml([
      {id:'to-list', label:t('bulkToList')},
      {id:'out', label:t('bulkOut')},
      {id:'clear-empty', label:t('bulkClearEmpty'), danger:true},
    ]):''}
    ${hid!=='all'?(()=>{
      const draft=stockDraftEntries();
      if(!draft.length) return '';
      const ins=draft.filter(([,d])=>d>0).length;
      const outs=draft.filter(([,d])=>d<0).length;
      const reasons=outs?`<div class="stock-draft-reasons" id="stockDraftReasons">
        <div class="muted" style="font-size:11px;margin-bottom:6px">${t('reason')}</div>
        <div class="chips">${REASONS().map(r=>`<button class="chip ${r.id===state.stockDraftReason?'on':''}" type="button" data-draft-reason="${r.id}">${esc(L(r))}</button>`).join('')}</div>
      </div>`:'';
      return `<div class="stock-footer-actions stock-draft-dock" aria-label="${t('stockDraftPending')}">
        <div class="stock-draft-head">
          <b>${T[state.lang].stockDraftSummary(draft.length,ins,outs)}</b>
          <span class="muted">${t('stockDraftPending')}</span>
        </div>
        ${reasons}
        <div class="stock-draft-actions">
          <button class="btn sec" type="button" id="stockDraftClear">${t('stockDraftClear')}</button>
          <button class="btn" type="button" id="stockDraftSave">${ui('u-check','sm')} ${t('stockDraftSave')}</button>
        </div>
      </div>`;
    })():''}
  </div>`;
}

function sheetStockDetail(pid,hid=state.house){
  const p=prod(pid);if(!p)return;
  const houses=hid==='all'?DB.houses:[house(hid)].filter(Boolean);
  const allHouses=DB.houses;
  const icon=svgIcon(prodIconId(p),'detail-ico');
  const isPlanned=houseId=>fridayEntries(houseId).some(e=>['open','pending'].includes(e.status)&&e.productId===pid);
  const isCustom=!!p.custom || (DB.customProducts||[]).some(x=>x.id===pid);
  const aliasText=(p.alias||[]).join(', ');
  const qtyInputs=allHouses.map(h=>{
    const qty=DB.stock[stockKey(h.id,pid)]??0;
    return `<label class="f product-qty-field"><span>🏠 ${esc(h.short)}</span>
      <input type="number" inputmode="decimal" min="0" step="any" data-edit-qty="${esc(h.id)}" value="${qty}"></label>`;
  }).join('');

  openSheet(`<div class="stock-detail-head"><div class="stock-detail-icon">${icon}</div>
      <div><div class="import-kicker">${t('productDetail')}</div>
      <h2 style="margin:3px 0">${esc(L(p))}</h2>
      <div class="muted">${esc(t('productEditHint'))}</div></div></div>

    <label class="f"><span>${t('productNameDe')}</span><input id="editProdDe" value="${esc(p.de||'')}" autocomplete="off"></label>
    <label class="f"><span>${t('productNameEl')}</span><input id="editProdEl" value="${esc(p.el||'')}" autocomplete="off"></label>
    <div class="row" style="gap:8px">
      <label class="f grow"><span>${t('stockFoodUnit')}</span>
        <select id="editProdUnit">${['Stk','L','g','kg'].map(u=>`<option value="${u}" ${p.unit===u?'selected':''}>${u}</option>`).join('')}</select>
      </label>
      <label class="f grow"><span>${t('stockFoodCat')}</span>
        <select id="editProdCat">${CATS().map(c=>`<option value="${esc(c.id)}" ${p.cat===c.id?'selected':''}>${esc(L(c))}</option>`).join('')}</select>
      </label>
    </div>
    <label class="f"><span>${t('productAliases')}</span>
      <input id="editProdAlias" value="${esc(aliasText)}" placeholder="${esc(t('productAliasesHint'))}" autocomplete="off"></label>

    <div class="block-h" style="margin-top:8px"><span class="t">${t('productStockQty')}</span></div>
    <div class="product-qty-grid">${qtyInputs}</div>

    <button class="btn" type="button" id="editProdSave" style="margin-top:12px">💾 ${t('productSave')}</button>
    ${isCustom?`<button class="btn sec" type="button" id="editProdDelete" style="margin-top:8px">🗑 ${t('productDelete')}</button>`:''}

    <div class="block-h" style="margin-top:14px"><span class="t">${t('productQuickActions')}</span></div>
    ${hid!=='all'?`<div class="stock-actions"><button class="btn in" id="detailIn">${t('stockIn')}</button><button class="btn out" id="detailOut">${t('stockOut')}</button></div>`:''}
    <div class="${hid==='all'?'stock-actions':''}">${houses.map(h=>`<button class="btn sec" data-detail-shop="${h.id}" ${isPlanned(h.id)?'disabled':''}>${isPlanned(h.id)?'✓ '+t('wantBoughtDone'):`${t('wantBought')}${hid==='all'?' · '+esc(h.short):''}`}</button>`).join('')}</div>`);

  const parseQty=raw=>{
    const n=Number(String(raw||'').replace(',','.'));
    return Number.isFinite(n) && n>=0 ? roundStock(n) : null;
  };

  sheetEl.querySelector('#editProdSave').onclick=()=>{
    const de=(sheetEl.querySelector('#editProdDe')?.value||'').trim();
    const el=(sheetEl.querySelector('#editProdEl')?.value||'').trim();
    const unit=sheetEl.querySelector('#editProdUnit')?.value||'Stk';
    const cat=sheetEl.querySelector('#editProdCat')?.value||'custom';
    const alias=(sheetEl.querySelector('#editProdAlias')?.value||'')
      .split(/[,;]+/).map(s=>s.trim()).filter(Boolean);
    if(!de && !el){ toast(t('productNameRequired'),'error'); return; }
    const nameDe=de||el, nameEl=el||de;

    const qtyChanges=[];
    let badQty=false;
    sheetEl.querySelectorAll('[data-edit-qty]').forEach(input=>{
      const houseId=input.dataset.editQty;
      const next=parseQty(input.value);
      if(next==null){ badQty=true; return; }
      const prev=DB.stock[stockKey(houseId,pid)]??0;
      if(next!==prev) qtyChanges.push({houseId, prev, next});
    });
    if(badQty){ toast(t('needQty'),'error'); return; }

    const apply=()=>{
      persistProductFields(pid, {de:nameDe, el:nameEl, unit, cat, alias});
      qtyChanges.forEach(({houseId, prev, next})=>{
        DB.stock[stockKey(houseId,pid)]=next;
        const delta=roundStock(next-prev);
        if(delta!==0){
          DB.log.push({
            id:uid(), ts:Date.now(), type:delta>0?'IN':'OUT',
            employeeId:state.user?.id||null,
            text:`${L({de:nameDe,el:nameEl})} ${delta>0?'+':''}${delta} ${unit} · ${house(houseId)?.short||houseId} · ${t('productDetail')}`,
            ip:session.ip||'—', deviceId:session.deviceId, sessionId:session.sessionId, ua:session.ua,
            houseId, productId:pid, qty:Math.abs(delta), unit,
          });
        }
      });
      (DB.listEntries||[]).forEach(e=>{
        if(e.productId===pid && ['open','pending'].includes(e.status)){
          e.name=state.lang==='el'?nameEl:nameDe;
          e.unit=unit;
        }
      });
      if(!save()) return;
      feedback('save');
      closeSheet();
      render();
      toast(t('productSaved'),'success');
    };

    if(qtyChanges.length) askPin(t('productSave'), ()=>apply());
    else apply();
  };

  sheetEl.querySelector('#editProdDelete')?.addEventListener('click',()=>{
    if(!isCustom) return;
    if(!confirm(t('productDeleteConfirm'))) return;
    askPin(t('productDelete'), ()=>{
      DB.customProducts=(DB.customProducts||[]).filter(x=>x.id!==pid);
      delete DB.productOverrides?.[pid];
      Object.keys(DB.stock||{}).forEach(k=>{ if(k.endsWith(':'+pid)) delete DB.stock[k]; });
      if(!save()) return;
      feedback('save');
      closeSheet();
      render();
      toast(t('productDeleted'),'success');
    });
  });

  const add=sheetEl.querySelector('#detailIn'),remove=sheetEl.querySelector('#detailOut');
  if(add)add.onclick=()=>{closeSheet();sheetStockBoard('IN',pid);};
  if(remove)remove.onclick=()=>{closeSheet();sheetStockBoard('OUT',pid);};
  sheetEl.querySelectorAll('[data-detail-shop]').forEach(shop=>shop.onclick=()=>{
    const targetHouse=shop.dataset.detailShop;if(isPlanned(targetHouse))return;
    if(requestWantBought(pid, targetHouse)){ closeSheet(); render(); }
  });
}

/** Ό,τι ζητήθηκε αλλά δεν υπήρχε στο σουπερμάρκετ — ορατό και από το ψυγείο. */
function shortagesCard(hid){
  const miss = DB.listEntries.filter(e => e.status==='missing' && (!hid || e.houseId===hid));
  if(!miss.length) return '';
  return `<div class="card"><h2>${t('secMissing')}</h2>
    ${miss.map(e=>`<div class="kv"><div class="grow">${esc(e.name)}
      <div class="muted" style="font-size:11.5px">🏠 ${esc(house(e.houseId).short)}${
        e.decidedAt?' · '+fmtDT(e.decidedAt):''}${e.missReason?' · '+esc(missReasonLabel(e.missReason)):''}</div></div>
      <div class="row" style="flex:0 0 auto;gap:6px;align-items:center">
        ${e.missReason?missReasonPill(e.missReason):''}
        <div class="muted">${e.qty} ${esc(e.unit)}</div>
      </div></div>`).join('')}
  </div>`;
}

const REASONS = () => [...DB.reasons, ...(Array.isArray(DB.customReasons)?DB.customReasons:[])];
const LIST_REMOVE_REASONS = () => [
  ...(SEED.listRemoveReasons||[]),
  ...(Array.isArray(DB.customListRemoveReasons)?DB.customListRemoveReasons:[]),
];

/** Αφαίρεση από λίστα αγορών με λόγο (preset ή custom). */
function sheetRemoveListItem(entryId){
  const entry=DB.listEntries.find(e=>e.id===entryId);
  if(!entry || entry.status==='removed') return;
  let reasonId=null, creating=false;

  const paint=()=>{
    const host=sheetEl.querySelector('#removeListBody');
    if(!host) return;
    const draft=creating ? (sheetEl.querySelector('#removeReasonName')?.value||'') : '';
    host.innerHTML=`
      <div class="chips" id="removeReasonChips">
        ${LIST_REMOVE_REASONS().map(r=>r.custom
          ? `<span class="reason-option"><button type="button" class="chip ${r.id===reasonId?'on':''}" data-rr="${r.id}">${esc(L(r))}</button><button type="button" class="reason-remove" data-drop-rr="${r.id}" aria-label="${t('close')}: ${esc(L(r))}">×</button></span>`
          : `<button type="button" class="chip ${r.id===reasonId?'on':''}" data-rr="${r.id}">${esc(L(r))}</button>`).join('')}
        <button type="button" class="chip" id="removeNewReason" style="border-style:dashed">＋ ${t('newReason')}</button>
      </div>
      ${creating?`<div class="reason-create" style="margin-top:10px">
        <input id="removeReasonName" maxlength="60" autocomplete="off" placeholder="${esc(t('removeListReasonPh'))}" value="${esc(draft)}">
        <button class="btn sec" type="button" id="removeReasonSave">＋ ${t('saveReason')}</button>
        <button class="mini-x" type="button" id="removeReasonCancel" aria-label="${t('close')}">×</button>
      </div>`:''}
      <div class="status" id="removeListStatus" hidden></div>
      <button class="btn out" type="button" id="removeListConfirm" style="margin-top:14px">${t('removeListConfirm')}</button>`;

    host.querySelectorAll('[data-rr]').forEach(b=>b.onclick=()=>{ reasonId=b.dataset.rr; creating=false; paint(); });
    host.querySelectorAll('[data-drop-rr]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.dropRr;
      const before=[...(DB.customListRemoveReasons||[])];
      DB.customListRemoveReasons=before.filter(r=>r.id!==id);
      if(!save()){ DB.customListRemoveReasons=before; return; }
      if(reasonId===id) reasonId=null;
      toast(t('reasonRemoved'),'success');
      paint();
    });
    host.querySelector('#removeNewReason')?.addEventListener('click',()=>{
      creating=true; paint();
      sheetEl.querySelector('#removeReasonName')?.focus();
    });
    const saveCustom=()=>{
      const input=sheetEl.querySelector('#removeReasonName');
      const name=(input?.value||'').trim().replace(/\s+/g,' ');
      const status=sheetEl.querySelector('#removeListStatus');
      if(status) status.hidden=false;
      if(!name){ setStatus(status, t('reasonRequired'), 'error'); input?.focus(); return; }
      const existing=LIST_REMOVE_REASONS().find(r=>[r.de,r.el,L(r)].some(v=>norm(v)===norm(name)));
      if(existing){
        reasonId=existing.id; creating=false;
        setStatus(status, t('reasonExists'), 'info'); paint(); return;
      }
      DB.customListRemoveReasons ||= [];
      const reason={id:'lrr-'+uid(), de:name, el:name, custom:true};
      DB.customListRemoveReasons.push(reason);
      if(!save()){
        DB.customListRemoveReasons=DB.customListRemoveReasons.filter(r=>r.id!==reason.id);
        setStatus(status, t('errStorage'), 'error'); return;
      }
      reasonId=reason.id; creating=false;
      toast(T[state.lang].reasonAdded(name),'success');
      paint();
    };
    host.querySelector('#removeReasonSave')?.addEventListener('click', saveCustom);
    host.querySelector('#removeReasonCancel')?.addEventListener('click', ()=>{ creating=false; paint(); });
    host.querySelector('#removeReasonName')?.addEventListener('keydown', ev=>{
      if(ev.key==='Enter'){ ev.preventDefault(); saveCustom(); }
      if(ev.key==='Escape'){ ev.preventDefault(); creating=false; paint(); }
    });
    host.querySelector('#removeListConfirm')?.addEventListener('click', ()=>{
      const status=sheetEl.querySelector('#removeListStatus');
      if(status) status.hidden=false;
      if(!reasonId){ setStatus(status, t('removeListNeedReason'), 'error'); return; }
      const reason=LIST_REMOVE_REASONS().find(r=>r.id===reasonId);
      const label=reason?L(reason):reasonId;
      entry.status='removed';
      entry.removeReasonId=reasonId;
      entry.removeReason=label;
      entry.removedAt=Date.now();
      entry.removedBy=state.user?.id||null;
      logEntry('SHOP', `${entry.name} · ${t('removeListTitle')}: ${label}`, {
        houseId:entry.houseId, entryId:entry.id, productId:entry.productId||null,
        fridayDate:entry.fridayDate||listEntryFriday(entry), removeReasonId:reasonId, removeReason:label
      });
      feedback('save');
      closeSheet();
      render();
      toast(t('listItemRemoved'),'success');
    });
  };

  openSheet(`<div class="help-center-hero"><div class="import-kicker">${esc(house(entry.houseId)?.short||'')}</div>
    <h2>${t('removeListTitle')}</h2>
    <p>${esc(entry.name)} · ${entry.qty} ${esc(entry.unit)}</p>
    <p class="muted" style="margin-top:4px">${t('removeListHint')}</p></div>
    <div id="removeListBody"></div>`);
  paint();
}

/**
 * Πίνακας ψυγείου: πλακίδια προϊόντων που τα πατάς ή τα σέρνεις στη ζώνη.
 * Μαζεύεις όσα θέλεις και τα καταχωρείς όλα μαζί με μία φωτογραφία και ένα PIN.
 */
/* Δίχτυ ασφαλείας: ό,τι κι αν πάει στραβά στο σύρσιμο, κανένα «φάντασμα»
   δεν μένει κολλημένο στην οθόνη. Δηλώνεται μία φορά, όχι ανά πλακίδιο. */
const clearGhosts = () => document.querySelectorAll('.drag-ghost').forEach(el => el.remove());
document.addEventListener('pointerup',     () => setTimeout(clearGhosts, 60));
document.addEventListener('pointercancel', clearGhosts);
window.addEventListener('blur',            clearGhosts);

/** Λογικό βήμα ανά μονάδα: τα γραμμάρια δεν αλλάζουν ένα-ένα. */
function stepFor(p){
  return p.unit === 'g' ? 100 : p.unit === 'kg' ? 0.5 : 1;
}
/** «Λίγο» σημαίνει άλλο πράγμα στα γραμμάρια απ' ό,τι στα τεμάχια. */
function lowThreshold(p){
  return p.unit === 'g' ? 200 : p.unit === 'kg' ? 1 : 1;
}
const roundStock = n => Math.round(n * 100) / 100;

function isProductOnFridayList(houseId, pid, friday=state.shopFriday||fridayFor()){
  return fridayEntries(houseId, friday).some(e=>['open','pending'].includes(e.status)&&e.productId===pid);
}

/** Personal: «Θέλω να αγοραστεί» → ανοιχτή θέση στη λίστα Παρασκευής. */
function requestWantBought(pid, houseId=state.house){
  if(!houseId || houseId==='all'){ toast(t('pickOneHouse'),'info'); return false; }
  const p=prod(pid); if(!p) return false;
  const friday=state.shopFriday||fridayFor();
  if(isProductOnFridayList(houseId, pid, friday)){ toast(t('alreadyPlanned')); return false; }
  DB.listEntries.push({
    id:uid(), productId:pid, name:L(p),
    qty:Math.max(stepFor(p), lowThreshold(p)),
    unit:p.unit, houseId, fridayDate:friday,
    by:state.user?.id||null, status:'open'
  });
  if(!save()) return false;
  feedback('save');
  toast(t('wantBoughtToast'),'success');
  return true;
}

function stockDraftEntries(){
  return Object.entries(state.stockDraft||{}).filter(([,delta])=>delta);
}
function clearStockDraft(){
  state.stockDraft = {};
  state.stockDraftReason = null;
}
function adjustStockDraft(pid, dir){
  const hid = state.house;
  if(hid==='all'){ toast(t('selectHouse'),'info'); return; }
  const p = prod(pid); if(!p) return;
  const step = stepFor(p);
  const base = DB.stock[stockKey(hid, pid)] ?? 0;
  let delta = roundStock((state.stockDraft[pid] || 0) + (dir==='IN' ? step : -step));
  if(base + delta < -0.0001) delta = roundStock(-base);
  if(Math.abs(delta) < 0.0001) delete state.stockDraft[pid];
  else state.stockDraft[pid] = delta;
  if(!stockDraftEntries().some(([,d])=>d<0)) state.stockDraftReason = null;
  feedback('tap');
  render();
}
function commitStockDraft(){
  const hid = state.house;
  if(hid==='all'){ toast(t('selectHouse'),'info'); return; }
  const entries = stockDraftEntries();
  if(!entries.length){ toast(t('pickSomething')); return; }
  const outs = entries.filter(([,d])=>d<0);
  const reasonId = state.stockDraftReason;
  const reason = reasonId ? L(REASONS().find(r=>r.id===reasonId)) : '';
  if(outs.length && !reason){ toast(t('stockDraftNeedReason'),'error'); return; }
  askPin(T[state.lang].bookN(entries.length), who=>{
    state.user = who;
    const label = ([pid, delta]) => `${Math.abs(delta)} ${prod(pid).unit} ${L(prod(pid))}`;
    const ins = entries.filter(([,d])=>d>0);
    const outList = entries.filter(([,d])=>d<0);
    [[ 'IN', ins ], [ 'OUT', outList ]].forEach(([d, list])=>{
      if(!list.length) return;
      list.forEach(([pid, delta])=>{
        const k = stockKey(hid, pid);
        DB.stock[k] = Math.max(0, roundStock((DB.stock[k] ?? 0) + delta));
      });
      logEntry(d,
        `${d==='IN'?t('typeIN'):t('typeOUT')} @ ${house(hid).short}` +
        `${d==='OUT' && reason ? ' · ' + reason : ''}: ${list.map(label).join(', ')}`,
        {houseId:hid, reason: d==='OUT' ? reason : '',
         items: list.map(([pid, delta])=>({pid, qty: Math.abs(delta)}))});
    });
    clearStockDraft();
    if(!save()) return;
    render();
    feedback('save');
    toast(t('saved'),'success');
  });
}

const SHIFT_STOCK_HOUSE = 'h1'; // Kalyvia (Villa)

function stockCheckForDate(houseId=SHIFT_STOCK_HOUSE, dateStr=iso(new Date())){
  return (DB.stockChecks||[]).slice().reverse().find(c=>c.houseId===houseId && c.date===dateStr) || null;
}

function shiftStockCheckBannerHtml(){
  const today=iso(new Date());
  const done=stockCheckForDate(SHIFT_STOCK_HOUSE, today);
  if(done){
    const who=emp(done.by);
    return `<div class="shift-check-banner done">
      <div><b>✅ ${esc(t('shiftStockCheckDone'))}</b>
        <span>${esc(T[state.lang].shiftStockCheckToday(who?.name||done.byName||'—', fmtDT(done.at)))}</span></div>
      <button class="btn sec sm" type="button" id="shiftStockCheckOpen">${esc(t('shiftStockCheckStart'))}</button>
    </div>`;
  }
  return `<div class="shift-check-banner pending">
    <div><b>☑️ ${esc(t('shiftStockCheck'))}</b><span>${esc(t('shiftStockCheckPending'))} · ${esc(t('shiftStockCheckHint'))}</span></div>
    <button class="btn sm" type="button" id="shiftStockCheckOpen">${esc(t('shiftStockCheckStart'))}</button>
  </div>`;
}

function paintShiftStockCheckSheet(draft){
  const products=PRODUCTS();
  const done=Object.keys(draft.marks).length;
  const total=products.length;
  const rows=products.map(p=>{
    const mark=draft.marks[p.id];
    const qty=draft.qtys[p.id] ?? (DB.stock[stockKey(SHIFT_STOCK_HOUSE,p.id)]??0);
    return `<div class="shift-check-row ${mark?'is-ok':''}" data-check-pid="${p.id}">
      <div class="shift-check-main">
        <b>${esc(L(p))}</b>
        <span class="muted">${esc(p.unit)}</span>
      </div>
      <label class="shift-check-qty"><span>${esc(t('shiftStockCheckQty'))}</span>
        <input type="number" inputmode="decimal" min="0" step="any" data-check-qty="${p.id}" value="${qty}" ${mark?'disabled':''}>
      </label>
      <button class="shift-check-ok ${mark?'on':''}" type="button" data-check-ok="${p.id}">${mark?'✓':esc(t('shiftStockCheckOk'))}</button>
    </div>`;
  }).join('');
  return `<div class="shift-check-flow">
    <div class="import-kicker">${esc(house(SHIFT_STOCK_HOUSE)?.short||'Kalyvia')}</div>
    <h2 style="margin:4px 0 6px">${esc(t('shiftStockCheck'))}</h2>
    <p class="muted" style="margin:0 0 10px">${esc(t('shiftStockCheckHint'))}</p>
    <div class="shift-check-progress">${esc(T[state.lang].shiftStockCheckProgress(done,total))}</div>
    <div class="shift-check-list">${rows}</div>
    <div class="shift-check-actions">
      <button class="btn sec" type="button" id="shiftCheckAllYes">${esc(t('shiftStockCheckAllYes'))}</button>
      <button class="btn" type="button" id="shiftCheckSave" ${done<total?'disabled':''}>${esc(t('shiftStockCheckSave'))}</button>
    </div>
  </div>`;
}

function sheetShiftStockCheck(){
  const products=PRODUCTS();
  const draft={
    marks:{},
    qtys:Object.fromEntries(products.map(p=>[p.id, DB.stock[stockKey(SHIFT_STOCK_HOUSE,p.id)]??0])),
  };
  const refresh=()=>{
    openSheet(paintShiftStockCheckSheet(draft));
    wireShiftStockCheckSheet(draft, refresh);
  };
  refresh();
}

function wireShiftStockCheckSheet(draft, refresh){
  const parseQty=raw=>{
    const n=Number(String(raw||'').replace(',','.'));
    return Number.isFinite(n) && n>=0 ? roundStock(n) : null;
  };
  sheetEl.querySelectorAll('[data-check-qty]').forEach(input=>{
    input.onchange=()=>{
      const pid=input.dataset.checkQty;
      const next=parseQty(input.value);
      if(next==null){ input.value=draft.qtys[pid]; toast(t('needQty'),'error'); return; }
      draft.qtys[pid]=next;
    };
  });
  sheetEl.querySelectorAll('[data-check-ok]').forEach(btn=>{
    btn.onclick=()=>{
      const pid=btn.dataset.checkOk;
      const input=sheetEl.querySelector(`[data-check-qty="${pid}"]`);
      const next=parseQty(input?.value);
      if(next==null){ toast(t('needQty'),'error'); return; }
      draft.qtys[pid]=next;
      draft.marks[pid]='ok';
      feedback('select');
      refresh();
    };
  });
  sheetEl.querySelector('#shiftCheckAllYes')?.addEventListener('click',()=>{
    sheetEl.querySelectorAll('[data-check-qty]').forEach(input=>{
      const pid=input.dataset.checkQty;
      if(draft.marks[pid]) return;
      const next=parseQty(input.value);
      if(next==null) return;
      draft.qtys[pid]=next;
      draft.marks[pid]='ok';
    });
    PRODUCTS().forEach(p=>{
      if(!draft.marks[p.id]){
        draft.qtys[p.id]=draft.qtys[p.id]??(DB.stock[stockKey(SHIFT_STOCK_HOUSE,p.id)]??0);
        draft.marks[p.id]='ok';
      }
    });
    feedback('save');
    refresh();
  });
  sheetEl.querySelector('#shiftCheckSave')?.addEventListener('click',()=>{
    const products=PRODUCTS();
    if(products.some(p=>!draft.marks[p.id])){
      toast(t('shiftStockCheckNeedAll'),'error');
      return;
    }
    askPin(t('shiftStockCheck'), who=>{
      state.user=who;
      const today=iso(new Date());
      const now=Date.now();
      const items=[];
      const fixes=[];
      products.forEach(p=>{
        const prev=DB.stock[stockKey(SHIFT_STOCK_HOUSE,p.id)]??0;
        const next=draft.qtys[p.id]??prev;
        const status=next===prev?'ok':'fixed';
        items.push({productId:p.id,name:L(p),qty:next,prev,status,unit:p.unit});
        if(next!==prev){
          DB.stock[stockKey(SHIFT_STOCK_HOUSE,p.id)]=next;
          const delta=roundStock(next-prev);
          fixes.push({productId:p.id,name:L(p),delta,unit:p.unit});
          logEntry(delta>0?'IN':'OUT',
            `${delta>0?t('typeIN'):t('typeOUT')} @ ${house(SHIFT_STOCK_HOUSE).short} · ${t('shiftStockCheck')}: ${L(p)} ${delta>0?'+':''}${delta} ${p.unit}`,
            {houseId:SHIFT_STOCK_HOUSE, productId:p.id, qty:Math.abs(delta), unit:p.unit, stockCheck:true});
        }
      });
      DB.stockChecks=DB.stockChecks||[];
      DB.stockChecks.push({
        id:'sc-'+uid(),
        houseId:SHIFT_STOCK_HOUSE,
        date:today,
        by:who.id,
        byName:who.name,
        at:now,
        allYes:fixes.length===0,
        items,
      });
      if(DB.stockChecks.length>400) DB.stockChecks=DB.stockChecks.slice(-400);
      logEntry('STOCKCHECK',
        T[state.lang].shiftStockCheckSaved(items.length, who.name)
          +(fixes.length?` · ${fixes.map(f=>`${f.name} ${f.delta>0?'+':''}${f.delta}`).join(', ')}`:''),
        {houseId:SHIFT_STOCK_HOUSE, date:today, count:items.length, fixes:fixes.length});
      if(!save()) return;
      closeSheet();
      render();
      feedback('save');
      toast(t('shiftStockCheckDone'),'success');
    });
  });
}

function sheetStockBoard(dir,initialPid=null){
  const hid = state.house;
  let tapDir = dir;           // τι κάνει το απλό πάτημα σε πλακίδιο
  let basket = initialPid ? {[initialPid]:{qty:stepFor(prod(initialPid)),dir}} : {}; // productId → {qty, dir}
  let reasonId = null;
  let creatingReason = false;
  let photo = null, camOk = false;

  const stockOf = pid => DB.stock[stockKey(hid, pid)] ?? 0;
  const round = n => Math.round(n * 100) / 100;
  const ins  = () => Object.entries(basket).filter(([,v]) => v.dir === 'IN');
  const outs = () => Object.entries(basket).filter(([,v]) => v.dir === 'OUT');

  /** Ίδια φορά → αυξάνει. Άλλη φορά → γυρίζει το είδος, κρατώντας την ποσότητα. */
  const add = (pid, d = tapDir, mult = 1) => {
    const cur = basket[pid];
    if(cur && cur.dir !== d && mult > 0){ cur.dir = d; paint(); return; }
    const step = stepFor(prod(pid));
    const next = round((cur ? cur.qty : 0) + step * mult);
    if(next > 0) basket[pid] = {qty: next, dir: cur ? cur.dir : d};
    else delete basket[pid];
    paint();
  };
  const flip = pid => {
    if(basket[pid]) basket[pid].dir = basket[pid].dir === 'IN' ? 'OUT' : 'IN';
    paint();
  };
  const setQty = (pid, v) => {
    const n = round(parseFloat(v));
    // Άδειο ή άκυρο δεν σβήνει το είδος — κρατάμε την προηγούμενη τιμή
    if(Number.isNaN(n)){ paint(); return; }
    if(n > 0) basket[pid].qty = n; else delete basket[pid];
    paint();
  };

  /* Ο σκελετός χτίζεται ΜΙΑ φορά. Το βίντεο δεν ξαναδημιουργείται ποτέ,
     αλλιώς κάθε πάτημα θα ζητούσε ξανά την κάμερα. */
  openSheet(`
    <div class="stock-board">
      <div class="stock-board-scroll">
        <h3>${t('stockBoard')} · ${esc(house(hid).short)}</h3>
        <div class="muted" style="margin-bottom:8px">${t('stockHoldHint')}</div>
        <div class="stock-quickbar">
          <button class="btn sec" id="sbAddFood" type="button">${t('stockAddFood')}</button>
          <button class="btn sec" id="sbAddCat" type="button">${t('stockAddCat')}</button>
        </div>
        <div id="sbQuickForm" hidden style="margin-bottom:12px"></div>
        <div class="seg" id="sbDir">
          <button class="${tapDir==='IN'?'on':''}" data-d="IN">${t('stockIn')}</button>
          <button class="${tapDir==='OUT'?'on':''}" data-d="OUT">${t('stockOut')}</button>
        </div>
        <div class="muted" style="text-align:center;margin:0 0 10px" id="sbSummary"></div>
        <div id="sbTiles"></div>
        <div id="sbBasket"></div>
        <div id="sbReasonWrap" style="display:none">
          <label class="f"><span>${t('reason')}</span></label>
          <div class="chips" id="sbReasons" style="margin:-4px 0 12px"></div>
          <div id="sbReasonCreateHost"></div>
          <div id="sbReasonStatus" class="status-box" style="display:none" role="status" aria-live="polite"></div>
        </div>
        <div id="sbCam" style="display:none">
          <label class="f"><span>${t('photoLabel')}</span></label>
          <div class="muted" style="font-size:11.5px;margin:-2px 0 8px">${esc(t('photoOptional'))}</div>
          <video id="sbVid" playsinline muted></video>
          <div class="muted" id="sbStatus" style="margin:6px 0 10px"></div>
          <button class="btn sec" id="sbSnap" type="button">${t('takePhoto')}</button>
          <img class="thumb" id="sbThumb" style="display:none" alt="">
        </div>
      </div>
      <div class="stock-drops-dock" aria-label="${esc(t('stockDragDock'))}">
        <button class="btn stock-board-save" id="sbSave" type="button" disabled></button>
        <div class="muted" style="text-align:center;font-size:11px;margin-bottom:7px">${esc(t('stockDragDock'))}</div>
        <div class="drops">
          <div class="dropzone zin"  id="sbDropIN"  data-dz="IN">${t('stockIn')}</div>
          <div class="dropzone zout" id="sbDropOUT" data-dz="OUT">${t('stockOut')}</div>
        </div>
      </div>
    </div>`);

  const $ = s => sheetEl.querySelector(s);
  const reasonStatus=$('#sbReasonStatus');
  let holdMenuEl=null;
  const closeHoldMenu=()=>{ if(holdMenuEl){ holdMenuEl.remove(); holdMenuEl=null; } };

  const tilesHtml=()=>CATS().filter(c=>c.custom || PRODUCTS().some(p=>p.cat===c.id)).map(c=>{
    const items=PRODUCTS().filter(p=>p.cat===c.id);
    return `<div class="house-h">${esc(L(c))}</div>
      <div class="tiles">
        ${items.length?items.map(p=>`
          <div class="tile" data-p="${p.id}">
            <span class="badge" style="display:none"></span>
            <span class="nm">${esc(L(p))}</span>
            <span class="st" data-st="${p.id}"></span>
          </div>`).join(''):`<div class="muted" style="padding:8px 4px;font-size:12px">${esc(t('stockEmptyCat'))}</div>`}
      </div>`;
  }).join('');

  const rebuildTiles=()=>{
    const box=$('#sbTiles');
    if(!box) return;
    box.innerHTML=tilesHtml();
    box.querySelectorAll('.tile').forEach(tile=>attachDrag(tile));
    paint();
  };

  const addToShopList=pid=>{
    if(requestWantBought(pid, hid)) paint();
  };

  const showHoldMenu=(pid, x, y)=>{
    closeHoldMenu();
    const p=prod(pid); if(!p) return;
    const menu=document.createElement('div');
    menu.className='stock-hold-menu';
    menu.innerHTML=`<div class="stock-hold-kicker">${esc(L(p))} · ${stockOf(pid)} ${esc(p.unit)}</div>
      <button type="button" class="hold-in" data-act="in">${t('stockHoldIn')}</button>
      <button type="button" class="hold-out" data-act="out">${t('stockHoldOut')}</button>
      <button type="button" data-act="shop">${t('stockHoldShop')}</button>
      <button type="button" data-act="detail">${t('stockHoldDetail')}</button>
      ${basket[pid]?`<button type="button" data-act="clear">${t('stockHoldClear')}</button>`:''}`;
    document.body.appendChild(menu);
    const pad=10, rect=menu.getBoundingClientRect();
    const left=Math.min(Math.max(pad, x-rect.width/2), window.innerWidth-rect.width-pad);
    const top=Math.min(Math.max(pad, y-20), window.innerHeight-rect.height-pad);
    menu.style.left=`${left}px`; menu.style.top=`${top}px`;
    holdMenuEl=menu;
    menu.querySelectorAll('button').forEach(btn=>{
      btn.onclick=()=>{
        const act=btn.dataset.act;
        closeHoldMenu();
        feedback('select');
        if(act==='in') add(pid,'IN');
        else if(act==='out') add(pid,'OUT');
        else if(act==='shop') addToShopList(pid);
        else if(act==='detail'){ closeSheet(); setTimeout(()=>sheetStockDetail(pid,hid),180); }
        else if(act==='clear'){ delete basket[pid]; paint(); }
      };
    });
  };

  const openQuickFood=()=>{
    const host=$('#sbQuickForm');
    host.hidden=false;
    host.innerHTML=`<div class="card" style="margin:0">
      <div class="strong" style="margin-bottom:8px">${esc(t('stockAddFoodTitle'))}</div>
      <label class="f"><span>${t('stockFoodName')}</span><input id="qfName" placeholder="Milch / Γάλα" autocomplete="off"></label>
      <div class="row" style="gap:8px">
        <label class="f grow"><span>${t('stockFoodUnit')}</span>
          <select id="qfUnit"><option>Stk</option><option>L</option><option>g</option><option>kg</option></select></label>
        <label class="f grow"><span>${t('stockFoodCat')}</span>
          <select id="qfCat">${CATS().map(c=>`<option value="${esc(c.id)}">${esc(L(c))}</option>`).join('')}</select></label>
      </div>
      <div class="row" style="gap:8px;margin-top:4px">
        <button class="btn sec" type="button" id="qfCancel">${t('helpDiscardInline')}</button>
        <button class="btn" type="button" id="qfSave">${t('addBtn')}</button>
      </div></div>`;
    host.querySelector('#qfCancel').onclick=()=>{ host.hidden=true; host.replaceChildren(); };
    host.querySelector('#qfSave').onclick=()=>{
      const name=host.querySelector('#qfName').value.trim();
      const unit=host.querySelector('#qfUnit').value;
      const cat=host.querySelector('#qfCat').value||'custom';
      if(!name){ toast(t('stockFoodName'),'error'); return; }
      DB.customProducts ||= [];
      const created={id:'cp-'+uid(),cat,de:name,el:name,unit,alias:[],custom:true};
      DB.customProducts.push(created);
      if(!save()){ DB.customProducts=DB.customProducts.filter(p=>p.id!==created.id); return; }
      feedback('save'); toast(T[state.lang].stockAdded(name),'success');
      host.hidden=true; host.replaceChildren();
      rebuildTiles();
      add(created.id, tapDir);
    };
    host.querySelector('#qfName').focus();
  };

  const openQuickCat=()=>{
    const host=$('#sbQuickForm');
    host.hidden=false;
    host.innerHTML=`<div class="card" style="margin:0">
      <div class="strong" style="margin-bottom:8px">${esc(t('stockAddCatTitle'))}</div>
      <label class="f"><span>${t('stockCatName')}</span><input id="qcName" placeholder="Snacks / Σνακ" autocomplete="off"></label>
      <div class="row" style="gap:8px;margin-top:4px">
        <button class="btn sec" type="button" id="qcCancel">${t('helpDiscardInline')}</button>
        <button class="btn" type="button" id="qcSave">${t('addBtn')}</button>
      </div></div>`;
    host.querySelector('#qcCancel').onclick=()=>{ host.hidden=true; host.replaceChildren(); };
    host.querySelector('#qcSave').onclick=()=>{
      const name=host.querySelector('#qcName').value.trim();
      if(!name){ toast(t('stockCatName'),'error'); return; }
      DB.customCategories ||= [];
      const id='cc-'+uid();
      const created={id,de:name,el:name,custom:true};
      if(CATS().some(c=>norm(L(c))===norm(name))){ toast(t('reasonExists'),'info'); return; }
      DB.customCategories.push(created);
      if(!save()){ DB.customCategories=DB.customCategories.filter(c=>c.id!==id); return; }
      feedback('save'); toast(T[state.lang].stockCatAdded(name),'success');
      host.hidden=true; host.replaceChildren();
      rebuildTiles();
      openQuickFood();
      const catSel=$('#qfCat'); if(catSel) catSel.value=id;
    };
    host.querySelector('#qcName').focus();
  };

  $('#sbAddFood').onclick=()=>{ feedback('tap'); openQuickFood(); };
  $('#sbAddCat').onclick=()=>{ feedback('tap'); openQuickCat(); };

  const hideReasonCreate=()=>{
    creatingReason=false;
    reasonStatus.style.display='none';
    paint();
  };
  const addCustomReason=()=>{
    if(!Array.isArray(DB.customReasons)) DB.customReasons=[];
    const input=$('#sbReasonName');
    const name=(input?.value||'').trim().replace(/\s+/g,' ');
    reasonStatus.style.display='block';
    if(!name){setStatus(reasonStatus,t('reasonRequired'),'error');input?.focus();return;}
    const existing=REASONS().find(r=>[r.de,r.el,L(r)].some(value=>norm(value)===norm(name)));
    if(existing){
      reasonId=existing.id;creatingReason=false;setStatus(reasonStatus,t('reasonExists'),'info');paint();return;
    }
    const reason={id:'cr'+uid(),de:name,el:name,custom:true};
    DB.customReasons.push(reason);
    if(!save()){
      DB.customReasons=DB.customReasons.filter(item=>item.id!==reason.id);
      setStatus(reasonStatus,t('errStorage'),'error');return;
    }
    reasonId=reason.id;creatingReason=false;reasonStatus.style.display='none';paint();toast(T[state.lang].reasonAdded(name),'success');
  };

  /** Ενημερώνει μόνο ό,τι αλλάζει — ποτέ το βίντεο. */
  function paint(){
    const picked = Object.keys(basket);
    // Αν ο χρήστης πληκτρολογεί ποσότητα, μην του κλείσεις το πληκτρολόγιο
    const focused = document.activeElement;
    const keepFocus = focused && focused.classList?.contains('qty-field')
      ? focused.dataset.q : null;
    const keepReasonDraft = creatingReason ? ($('#sbReasonName')?.value || '') : '';

    const nIn = ins().length, nOut = outs().length;
    $('#sbDropIN').classList.toggle('filled', nIn > 0);
    $('#sbDropOUT').classList.toggle('filled', nOut > 0);
    $('#sbDropIN').innerHTML  = nIn  ? `${t('stockIn')} · <b>${nIn}</b>`  : t('stockIn');
    $('#sbDropOUT').innerHTML = nOut ? `${t('stockOut')} · <b>${nOut}</b>` : t('stockOut');
    $('#sbSummary').textContent = picked.length ? t('dragToZone') : t('dropHere');

    sheetEl.querySelectorAll('.tile').forEach(tile=>{
      const pid = tile.dataset.p, p = prod(pid), q = stockOf(pid), b = basket[pid];
      const badge = tile.querySelector('.badge');
      badge.style.display = b ? '' : 'none';
      badge.textContent = b ? (b.dir === 'IN' ? '+' : '−') + b.qty : '';
      tile.classList.toggle('picked', !!b);
      tile.classList.toggle('in',  !!b && b.dir === 'IN');
      tile.classList.toggle('out', !!b && b.dir === 'OUT');
      const st = tile.querySelector('[data-st]');
      st.textContent = `${q} ${p.unit}`;
      st.classList.toggle('zero', q === 0);
      st.classList.toggle('low', q > 0 && q <= lowThreshold(p));
      tile.classList.toggle('empty', q === 0);
    });

    const rows = pid => {
      const p = prod(pid), b = basket[pid];
      const after = round(stockOf(pid) + (b.dir === 'IN' ? b.qty : -b.qty));
      const jump = round(stepFor(p) * 5);
      return `<div class="basket-row">
        <button class="dirbtn ${b.dir==='IN'?'in':'out'}" data-f="${pid}"
          title="${t('switchDir')}">${b.dir==='IN'?'+':'−'}</button>
        <div class="grow"><span class="strong">${esc(L(p))}</span>
          <div class="muted" style="font-size:11.5px">${stockOf(pid)} → ${
            after < 0 ? `<b style="color:#dc2626">${after}</b>` : after} ${esc(p.unit)}</div></div>
        <button class="mini-x" data-basket-remove="${pid}" type="button" aria-label="${t('close')}: ${esc(L(p))}">×</button>
        <div class="quantity-controls">
          <button class="qty-jump" data-jump="-5" data-pid="${pid}" type="button" title="−${jump} ${esc(p.unit)}" aria-label="−${jump} ${esc(p.unit)}">−5×</button>
          <button class="step" data-m="${pid}" type="button" aria-label="− ${stepFor(p)} ${esc(p.unit)}">−</button>
          <label class="qty-input-wrap"><input class="qty-field" data-q="${pid}" value="${b.qty}"
            type="text" inputmode="decimal" enterkeyhint="done" aria-label="${esc(L(p))}"><span>${esc(p.unit)}</span></label>
          <button class="step" data-a="${pid}" type="button" aria-label="＋ ${stepFor(p)} ${esc(p.unit)}">+</button>
          <button class="qty-jump" data-jump="5" data-pid="${pid}" type="button" title="+${jump} ${esc(p.unit)}" aria-label="+${jump} ${esc(p.unit)}">+5×</button>
        </div>
      </div>`;
    };

    const section = (title, list, color) => list.length ? `
      <div class="card" style="border-color:${color}">
        <h2>${title} · ${esc(house(hid).short)}</h2>
        ${list.map(([pid]) => rows(pid)).join('')}
      </div>` : '';

    $('#sbBasket').innerHTML = picked.length
      ? section(t('inTitle'),  ins(),  '#6ee7b7') + section(t('outTitle'), outs(), '#fca5a5')
      : `<div class="muted" style="text-align:center;padding:10px 0">${t('pickSomething')}</div>`;

    $('#sbBasket').querySelectorAll('[data-f]').forEach(b=> b.onclick = () => flip(b.dataset.f));

    $('#sbBasket').querySelectorAll('.step[data-a]').forEach(b=>
      b.onclick = () => add(b.dataset.a, basket[b.dataset.a].dir, +1));
    $('#sbBasket').querySelectorAll('.step[data-m]').forEach(b=>
      b.onclick = () => add(b.dataset.m, basket[b.dataset.m].dir, -1));
    $('#sbBasket').querySelectorAll('[data-jump]').forEach(b=>
      b.onclick = () => add(b.dataset.pid, basket[b.dataset.pid].dir, Number(b.dataset.jump)));
    $('#sbBasket').querySelectorAll('[data-basket-remove]').forEach(b=> b.onclick = () => {
      delete basket[b.dataset.basketRemove]; paint();
    });
    $('#sbBasket').querySelectorAll('[data-q]').forEach(inp=>{
      inp.onchange = () => setQty(inp.dataset.q, inp.value.replace(',','.'));
      inp.onfocus  = () => inp.select();
    });
    if(keepFocus){
      const back = $(`[data-q="${keepFocus}"]`);
      if(back) back.focus();
    }

    // Λόγος μόνο όταν υπάρχει τουλάχιστον μία έξοδος
    $('#sbReasonWrap').style.display = outs().length ? '' : 'none';
    if(!outs().length) creatingReason=false;
    $('#sbReasons').innerHTML =
      REASONS().map(r=>r.custom
        ? `<span class="reason-option"><button class="chip ${r.id===reasonId?'on':''}" data-r="${r.id}">${esc(L(r))}</button><button class="reason-remove" data-remove-reason="${r.id}" type="button" aria-label="${t('close')}: ${esc(L(r))}">×</button></span>`
        : `<button class="chip ${r.id===reasonId?'on':''}" data-r="${r.id}">${esc(L(r))}</button>`).join('') +
      `<button class="chip" id="sbNewReason" style="border-style:dashed">＋ ${t('newReason')}</button>`;
    $('#sbReasonCreateHost').innerHTML = creatingReason
      ? `<div class="reason-create" id="sbReasonCreate">
          <input id="sbReasonName" maxlength="60" autocomplete="off" placeholder="${t('reasonNamePh')}" value="${esc(keepReasonDraft)}">
          <button class="btn sec" id="sbReasonAdd" type="button">＋ ${t('saveReason')}</button>
          <button class="mini-x" id="sbReasonCancel" type="button" aria-label="${t('close')}">×</button>
        </div>` : '';
    $('#sbReasons').querySelectorAll('.chip[data-r]').forEach(b=>{
      b.onclick = () => { reasonId = b.dataset.r; creatingReason=false; paint(); };
    });
    $('#sbReasons').querySelectorAll('[data-remove-reason]').forEach(button=>{
      button.onclick=()=>{
        if(!Array.isArray(DB.customReasons)) DB.customReasons=[];
        const before=[...DB.customReasons],id=button.dataset.removeReason;
        DB.customReasons=DB.customReasons.filter(reason=>reason.id!==id);
        if(!save()){DB.customReasons=before;return;}
        if(reasonId===id)reasonId=null;
        paint();toast(t('reasonRemoved'),'success');
      };
    });
    const newReasonBtn=$('#sbNewReason');
    if(newReasonBtn) newReasonBtn.onclick = () => {
      creatingReason=true;reasonStatus.style.display='none';paint();
      const input=$('#sbReasonName'); if(input){input.focus();input.select();}
    };
    const addBtn=$('#sbReasonAdd'),cancelBtn=$('#sbReasonCancel'),reasonInput=$('#sbReasonName');
    if(addBtn) addBtn.onclick=addCustomReason;
    if(cancelBtn) cancelBtn.onclick=hideReasonCreate;
    if(reasonInput){
      reasonInput.onkeydown=event=>{
        if(event.key==='Enter'){event.preventDefault();addCustomReason();}
        if(event.key==='Escape'){event.preventDefault();hideReasonCreate();}
      };
    }

    $('#sbCam').style.display = picked.length ? '' : 'none';
    const saveBtn = $('#sbSave');
    const needReason = nOut > 0 && !reasonId;
    saveBtn.className = 'btn stock-board-save' + (nOut && !nIn ? ' out' : nIn && !nOut ? ' in' : '');
    if(!picked.length){
      saveBtn.textContent = t('pickSomething');
    }else if(needReason){
      saveBtn.textContent = t('stockDraftNeedReason');
    }else if(photo){
      saveBtn.textContent = T[state.lang].bookN(picked.length);
    }else{
      saveBtn.textContent = `${T[state.lang].bookN(picked.length)} · ${t('skipPhoto')}`;
    }
    saveBtn.disabled = !picked.length || needReason;
    if(picked.length) ensureCamera();
  }

  /** Η κάμερα ανοίγει το πολύ μία φορά ανά φύλλο. */
  let camStarting = false;
  function ensureCamera(){
    if(camOk || camStarting) return;
    camStarting = true;
    startCamera($('#sbVid'), $('#sbStatus')).then(ok => {
      camOk = ok;
      if(!ok) $('#sbVid').style.display = 'none';
    });
  }

  $('#sbSnap').onclick = () => {
    if(!camOk){ toast(t('noCam'),'error'); return; }
    photo = snap($('#sbVid'));
    if(!photo){ toast(t('noCam'),'error'); return; }
    const thumb = $('#sbThumb');
    thumb.src = photo; thumb.style.display = 'block';
    $('#sbStatus').textContent = t('photoTaken');
    paint();
  };
  $('#sbSave').onclick = () => commit();
  sheetEl.querySelectorAll('#sbDir button').forEach(b=>{
    b.onclick = () => {
      tapDir = b.dataset.d;
      sheetEl.querySelectorAll('#sbDir button').forEach(x=>x.classList.toggle('on', x===b));
    };
  });

  /** Σύρσιμο + παρατεταμένο πάτημα — ζώνες μόνο στο κάτω dock (χωρίς πλευρικές ράγες). */
  function attachDrag(tile){
    let ghost = null, dragging = false, held = false, active = false;
    let startX = 0, startY = 0, holdTimer = null;
    const HOLD_MS = 380, MOVE_PX = 8;

    const zones = () => [...sheetEl.querySelectorAll('[data-dz]')];
    const zoneAt = ev => {
      const hit = document.elementFromPoint(ev.clientX, ev.clientY);
      const fromPoint = hit?.closest?.('[data-dz]');
      if(fromPoint) return fromPoint.dataset.dz;
      const pad = 48;
      for(const z of zones()){
        const r = z.getBoundingClientRect();
        if(ev.clientX >= r.left - pad && ev.clientX <= r.right + pad
        && ev.clientY >= r.top - pad && ev.clientY <= r.bottom + pad) return z.dataset.dz;
      }
      return null;
    };
    const clearHold = () => { if(holdTimer){ clearTimeout(holdTimer); holdTimer = null; } };
    const cleanup = () => {
      clearHold();
      if(ghost){ ghost.remove(); ghost = null; }
      dragging = false; held = false; active = false;
      zones().forEach(z => z.classList.remove('over'));
      document.querySelectorAll('.drag-ghost').forEach(el => el.remove());
    };

    tile.onpointerdown = ev => {
      if(ev.button === 1 || ev.button === 2) return;
      closeHoldMenu();
      dragging = false; held = false; active = true;
      startX = ev.clientX; startY = ev.clientY;
      try{ tile.setPointerCapture(ev.pointerId); }catch(e){}
      clearHold();
      holdTimer = setTimeout(() => {
        holdTimer = null;
        if(!active || dragging) return;
        held = true;
        feedback('select');
        showHoldMenu(tile.dataset.p, startX, startY);
      }, HOLD_MS);
    };
    tile.onpointermove = ev => {
      if(!active || held) return;
      if(!dragging && Math.hypot(ev.clientX-startX, ev.clientY-startY) < MOVE_PX) return;
      clearHold();
      if(!dragging){
        dragging = true;
        ghost = document.createElement('div');
        ghost.className = 'drag-ghost';
        ghost.textContent = L(prod(tile.dataset.p));
        document.body.appendChild(ghost);
      }
      ghost.style.left = ev.clientX + 'px';
      ghost.style.top  = ev.clientY + 'px';
      const z = zoneAt(ev);
      zones().forEach(el => el.classList.toggle('over', el.dataset.dz === z));
    };
    tile.onpointerup = ev => {
      const wasDragging = dragging, wasHeld = held, zone = wasDragging ? zoneAt(ev) : null;
      const pid = tile.dataset.p;
      cleanup();
      if(wasHeld) return;
      if(!wasDragging) add(pid, tapDir);
      else if(zone) add(pid, zone);
    };
    tile.onpointercancel = cleanup;
    tile.onlostpointercapture = () => { if(!dragging && !held) cleanup(); };
  }

  stockBoardUiAbort?.abort();
  stockBoardUiAbort = new AbortController();
  document.addEventListener('pointerdown', ev=>{
    if(!holdMenuEl) return;
    if(holdMenuEl.contains(ev.target)) return;
    closeHoldMenu();
  }, {capture:true, signal:stockBoardUiAbort.signal});

  rebuildTiles();

  function commit(){
    const picked = Object.keys(basket);
    if(!picked.length){ toast(t('pickSomething'),'error'); return; }
    const reason = reasonId ? L(REASONS().find(r=>r.id===reasonId)) : '';
    if(outs().length && !reason){
      toast(t('stockDraftNeedReason'),'error');
      const wrap = $('#sbReasonWrap');
      if(wrap){
        wrap.style.display = '';
        wrap.scrollIntoView({behavior:'smooth', block:'center'});
        wrap.classList.add('flash-need');
        setTimeout(()=>wrap.classList.remove('flash-need'), 1200);
      }
      return;
    }

    askPin(T[state.lang].bookN(picked.length), who => {
      state.user = who;
      const label = ([pid, b]) => `${b.qty} ${prod(pid).unit} ${L(prod(pid))}`;

      /* Είσοδοι και έξοδοι είναι ξεχωριστές εγγραφές στο Βιβλίο, ακόμα κι όταν
         καταχωρούνται μαζί — αλλιώς δεν φιλτράρεται σωστά το ιστορικό. */
      [['IN', ins()], ['OUT', outs()]].forEach(([d, list])=>{
        if(!list.length) return;
        list.forEach(([pid, b])=>{
          const k = stockKey(hid, pid);
          DB.stock[k] = Math.max(0, round((DB.stock[k] ?? 0) + (d === 'IN' ? b.qty : -b.qty)));
        });
        logEntry(d,
          `${d==='IN'?t('typeIN'):t('typeOUT')} @ ${house(hid).short}` +
          `${d==='OUT' && reason ? ' · ' + reason : ''}: ${list.map(label).join(', ')}`,
          {photo, houseId:hid, reason: d === 'OUT' ? reason : '',
           items: list.map(([pid, b]) => ({pid, qty: b.qty}))});
      });
      save(); closeSheet(); render(); toast(t('saved'));
    });
  }

  paint();
}

/* ════════════════════════════════════════════════════════════════
   Λίστες & Ψώνια
   ════════════════════════════════════════════════════════════════ */
const shopHouse = () => state.house === 'all' ? DB.houses[0].id : state.house;

function missReasonLabel(reason){
  if(reason==='expensive') return t('missReasonExpensive');
  if(reason==='unavailable') return t('missReasonUnavailable');
  return t('stMissing');
}

function missReasonPill(reason){
  if(!reason) return '';
  const cls = reason==='expensive' ? 'expensive' : 'unavailable';
  return `<span class="pill miss-reason ${cls}">${esc(missReasonLabel(reason))}</span>`;
}

function entryRow(e, extra = ''){
  const by = e.by ? emp(e.by) : null;
  return `<div class="kv"><div class="grow">${esc(e.name)}
      ${e.note?`<div class="muted" style="font-size:11.5px">${esc(e.note)}</div>`:''}
      ${e.missReason?`<div class="muted" style="font-size:11.5px">${esc(missReasonLabel(e.missReason))}</div>`:''}
      ${by?`<div class="muted" style="font-size:11.5px">${t('byWhom')} ${esc(by.name)}</div>`:''}</div>
    <div class="row" style="flex:0 0 auto;gap:8px">
      <span class="muted">${e.qty} ${esc(e.unit)}</span>${e.missReason?missReasonPill(e.missReason):''}${extra}</div></div>`;
}

function listEntryFriday(e){
  if(e.fridayDate) return e.fridayDate;
  if(e.decidedAt){
    const d=new Date(e.decidedAt), ds=iso(d), day=d.getDay();
    return shiftDate(ds, day>=5 ? 5-day : -(day+2));
  }
  return fridayFor();
}

function fridayEntries(hid,friday=state.shopFriday){
  return DB.listEntries.filter(e=>e.houseId===hid && listEntryFriday(e)===friday && e.status!=='removed');
}

function shoppingHistory(hid){
  const saved=(DB.shoppingTrips||[]).filter(trip=>trip.houseId===hid);
  const capturedIds=new Set(saved.flatMap(trip=>(trip.items||[]).map(item=>item.entryId).filter(Boolean)));
  const legacy=new Map();
  DB.listEntries.filter(e=>e.houseId===hid&&['bought','missing'].includes(e.status)&&!capturedIds.has(e.id)).forEach(e=>{
    const friday=listEntryFriday(e),key=`${hid}:${friday}`,trip=legacy.get(key)||{id:`legacy-${key}`,houseId:hid,fridayDate:friday,completedAt:0,completedBy:null,items:[],legacy:true};
    trip.completedAt=Math.max(trip.completedAt,Number(e.decidedAt)||0);trip.completedBy=e.decidedBy||trip.completedBy;
    trip.items.push({entryId:e.id,productId:e.productId||null,name:e.name,qty:e.qty,unit:e.unit,note:e.note||'',result:e.status,reason:e.missReason||null});legacy.set(key,trip);
  });
  return [...saved,...legacy.values()].sort((a,b)=>(b.completedAt||new Date(b.fridayDate+'T12:00:00'))-(a.completedAt||new Date(a.fridayDate+'T12:00:00')));
}

function sheetShoppingHistory(){
  const hid=shopHouse(),trips=shoppingHistory(hid);
  const itemList=(items,kind)=>{
    const rows=items.filter(item=>item.result===kind);
    return rows.length?`<ul>${rows.map(item=>`<li><span>${esc(item.name)}${item.reason?` · ${esc(missReasonLabel(item.reason))}`:''}</span><span>${item.qty} ${esc(item.unit)}</span></li>`).join('')}</ul>`:`<div class="muted" style="font-size:11px">—</div>`;
  };
  openSheet(`<div class="help-center-hero"><div class="import-kicker">${esc(house(hid).short)}</div><h2>🛒 ${t('shoppingHistory')}</h2><p>${t('shoppingHistoryHint')}</p></div>
    <div class="seg house-selector" id="historyHouse" style="margin-top:12px">${DB.houses.map(h=>`<button class="${hid===h.id?'on':''}" data-history-house="${h.id}">🏠 ${esc(h.short)}</button>`).join('')}</div>
    <div class="trip-history-list">${trips.length?trips.map((trip,index)=>{
      const bought=trip.items.filter(item=>item.result==='bought'),missing=trip.items.filter(item=>item.result==='missing'),who=emp(trip.completedBy);
      const unavail=missing.filter(item=>item.reason==='unavailable'||!item.reason).length;
      const expensive=missing.filter(item=>item.reason==='expensive').length;
      const dateDay=new Date(trip.fridayDate+'T12:00:00').getDate();
      return `<details class="trip-card" ${index===0?'open':''}><summary><div class="trip-date">${dateDay}</div><div><h3>${esc(fridayText(trip.fridayDate))}</h3><div class="trip-meta">${t('completedBy')} ${esc(who?.name||'—')}${trip.completedAt?' · '+t('completedOn')+' '+esc(fmtDT(trip.completedAt)):''}</div></div><div class="trip-counts"><span class="pill in">✓ ${bought.length}</span><span class="pill out">∅ ${unavail}</span>${expensive?`<span class="pill miss-reason expensive">€ ${expensive}</span>`:''}</div></summary>
        <div class="trip-results"><section class="trip-result bought"><h4>✓ ${t('boughtItems')}</h4>${itemList(trip.items,'bought')}</section><section class="trip-result missing"><h4>× ${t('notBoughtItems')}</h4>${itemList(trip.items,'missing')}</section></div></details>`;
    }).join(''):`<div class="trip-empty"><div class="big">🧾</div><b>${t('noShoppingHistory')}</b><div style="margin-top:5px;font-size:11.5px">${t('noShoppingHistoryHint')}</div></div>`}</div>`);
  sheetEl.querySelectorAll('[data-history-house]').forEach(button=>button.onclick=()=>{state.house=button.dataset.historyHouse;closeSheet();sheetShoppingHistory();});
}

/** Leere & niedrige Bestände → offene Freitagsliste (idempotent). */
function autoFillShoppingFromStock(hid){
  if(!hid || hid==='all'){ toast(t('selectHouse'),'info'); return 0; }
  const friday = state.shopFriday||fridayFor();
  let added = 0;
  PRODUCTS().forEach(p=>{
    const qty = DB.stock[stockKey(hid,p.id)] ?? 0;
    if(qty > lowThreshold(p)) return;
    if(isProductOnFridayList(hid, p.id, friday)) return;
    DB.listEntries.push({
      id:uid(), productId:p.id, name:L(p),
      qty: Math.max(stepFor(p), lowThreshold(p)), unit:p.unit,
      houseId:hid, fridayDate:friday, by:state.user?.id||null, status:'open',
    });
    added++;
  });
  if(added){ if(!save()) return 0; toast(t('shopAutoFilled')(added),'success'); }
  else toast(t('stockHealthy'),'info');
  return added;
}

function viewShop(){
  const hid = shopHouse();
  const friday=state.shopFriday||fridayFor();
  const fridayList=fridayEntries(hid,friday);
  const of = st => fridayList.filter(e=>e.status===st);
  const open = of('open'), pending = of('pending'), bought = of('bought'), missing = of('missing');
  const inStore = pending.length > 0;

  const fridayState=pending.length?t('fridayActive'):(open.length?t('fridayPlanned'):(bought.length||missing.length?t('fridayCompleted'):t('fridayPlanned')));
  const lowStockCount = PRODUCTS().filter(p=>{
    const q = DB.stock[stockKey(hid,p.id)]??0;
    return q <= lowThreshold(p);
  }).length;
  const catOrder = [...CATS().map(c=>c.id), 'other'];
  const shopSelecting = state.selectMode==='shop' && !inStore;
  const storeSelecting = state.selectMode==='store' && inStore;
  const hero=inStore?'':`<header class="ops-hero shop-hero">
      <p class="brand-kicker">Armonia</p>
      <h2>${esc(t('shopTitle'))}</h2>
      <p>${esc(t('shopHeroHint'))}</p>
      <div class="ops-hero-stats" role="group" aria-label="${esc(t('shopTitle'))}">
        ${statTileHtml(open.length, t('secOpen'), 'u-cart', open.length?'up':'')}
        ${statTileHtml(lowStockCount, t('stockAttention'), 'u-leaf', lowStockCount?'down':'')}
        ${statTileHtml(bought.length, t('secBought'), 'u-check', '')}
      </div>
    </header>
    <section class="shop-command" aria-label="${esc(t('shopTitle'))}">
    <div class="seg house-selector" id="shHouse" aria-label="${t('chooseShoppingHouse')}">
      ${shoppingHouses().map(h=>`<button class="${hid===h.id?'on':''}" data-h="${h.id}">${ui('u-person','sm')} ${esc(h.short)}</button>`).join('')}
    </div>
    <div class="shop-command-row">
      <div class="friday-picker compact">
        <button data-friday-shift="-7" aria-label="${t('previousFriday')}">‹</button>
        <label class="friday-date" title="${t('chooseFriday')}"><input type="date" id="shopFridayDate" value="${friday}"><b>${esc(fridayText(friday))}</b><span>${fridayState} · ${open.length}</span></label>
        <button data-friday-shift="7" aria-label="${t('nextFriday')}">›</button>
      </div>
      <div class="shop-tools" role="toolbar" aria-label="${esc(t('shopTitle'))}">
        <button class="shop-tool ${shopSelecting?'on':''}" type="button" id="shopSelectToggle" title="${esc(shopSelecting?t('selectDone'):t('selectMode'))}" aria-label="${esc(shopSelecting?t('selectDone'):t('selectMode'))}" aria-pressed="${shopSelecting?'true':'false'}">${shopSelecting?ui('u-check','sm'):'☑'}</button>
        <button class="shop-tool" type="button" data-page-act="shopScan" title="${esc(t('topScan'))}" aria-label="${esc(t('topScan'))}">${ui('u-camera')}</button>
        <button class="shop-tool" type="button" id="importList" title="${esc(t('importList'))}" aria-label="${esc(t('importList'))}">${ui('u-receipt')}</button>
        <button class="shop-tool" type="button" data-page-act="shopHistory" title="${esc(t('topHistory'))}" aria-label="${esc(t('topHistory'))}">${ui('u-book')}</button>
      </div>
    </div>
    <div class="seg shop-panel-seg" id="shopPanel">
      <button class="${state.shopPanel==='plan'?'on':''}" data-shop-panel="plan" type="button">${t('shopPlan')}</button>
      <button class="${state.shopPanel==='take'?'on':''}" data-shop-panel="take" type="button">${t('shopTake')}</button>
    </div>
    <div class="shop-quick-actions">
      <button class="btn sec sm" type="button" id="shopAutoFill">${ui('u-sparkle','sm')} ${t('shopAutoFill')}</button>
    </div>
    ${state.shopPanel==='plan'?`<div class="cart-quick"><input id="cartQuickName" placeholder="${t('cartQuickAdd')}" aria-label="${t('cartQuickAdd')}" autocomplete="off" enterkeyhint="done"><button class="btn sm" id="cartQuickAdd" aria-label="${esc(t('addToCart'))}">＋</button></div>`:''}
  </section>`;

  const takeListCard = (!inStore && state.shopPanel==='take') ? (()=>{
    const allTake = [...open, ...pending.filter(e=>!e.decision)];
    const byCatTake = {};
    allTake.forEach(e=>{
      const c = e.productId ? (prod(e.productId)?.cat||'other') : 'other';
      (byCatTake[c] ||= []).push(e);
    });
    return `<section class="card shop-take-card">
      <div class="shop-take-h"><b>${t('shopTake')}</b><span class="muted">${t('shopTakeHint')}</span></div>
      ${allTake.length ? catOrder.filter(c=>byCatTake[c]).map(c=>{
        const cat = CATS().find(x=>x.id===c);
        return `<div class="shop-take-cat"><div class="shop-take-cat-h">${cat?esc(L(cat)):t('other')}</div>
          ${byCatTake[c].map(e=>`<div class="shop-take-row"><span class="shop-take-qty">${e.qty}${esc(e.unit)}</span><span class="shop-take-name">${svgIcon(prodIconId(e.productId?prod(e.productId):matchProduct(e.name)),'prod-ico')}${esc(e.name)}</span></div>`).join('')}
        </div>`;
      }).join('') : `<div class="shop-empty compact">
        <div class="big">🧺</div>
        <h3>${t('noFridayItems')}</h3>
        <p>${t('shopTakeEmptyHint')}</p>
      </div>`}
    </section>`;
  })() : '';

  // ── Store mode: full-page compact aisle list ──
  const done = pending.filter(e => e.decision).length;
  const remaining=pending.length-done,progress=pending.length?Math.round(done/pending.length*100):0;
  const shopQuery=norm(state.shopQuery||'');
  const showDone=!!state.storeShowDone;
  const pendingVisible=pending.filter(e=>{
    if(!showDone && e.decision) return false;
    if(!shopQuery) return true;
    return norm(`${e.name} ${e.note||''}`).includes(shopQuery);
  });
  const byCat = {};
  pendingVisible.forEach(e => {
    const c = e.productId ? (prod(e.productId)?.cat || 'other') : 'other';
    (byCat[c] ||= []).push(e);
  });

  const storeRow = e => {
    const st = e.decision;
    const sel = storeSelecting && isSelected(e.id);
    return `<div class="store-choice ${st||''} ${sel?'selected':''}" data-entry-row="${e.id}">
      ${storeSelecting?`<button class="bulk-check ${sel?'on':''}" type="button" data-bulk-toggle="${e.id}" aria-pressed="${sel?'true':'false'}" aria-label="${esc(t('selectMode'))}"></button>`:''}
      <button class="store-choice-main" type="button" data-decision="${st==='bought'?'undo':'bought'}" data-entry="${e.id}" aria-label="${st==='bought'?t('undoDecision'):t('markBought')}">
        <div class="store-choice-name">${esc(e.name)}</div>
        <div class="store-choice-qty"><b>${e.qty} ${esc(e.unit)}</b>${e.note?' · '+esc(e.note):''}</div>
      </button>
      <div class="store-choice-actions">
        <button class="store-decision yes ${st==='bought'?'on':''}" data-decision="bought" data-entry="${e.id}" type="button" aria-label="${t('markBought')}" title="${esc(t('markBought'))}">✓</button>
        <button class="store-decision mid ${st==='unavailable'?'on':''}" data-decision="unavailable" data-entry="${e.id}" type="button" aria-label="${t('markUnavailable')}" title="${esc(t('markUnavailable'))}">∅</button>
        <button class="store-decision expensive ${st==='expensive'?'on':''}" data-decision="expensive" data-entry="${e.id}" type="button" aria-label="${t('markExpensive')}" title="${esc(t('markExpensive'))}">€</button>
      </div>
    </div>`;
  };

  const pendingCard = pending.length ? `
    <section class="store-page" aria-label="${esc(t('storeMode'))}">
      <div class="store-top">
        <div class="store-top-row">
          <button class="store-back" id="cancelFriday" type="button" aria-label="${t('backToCart')}">←</button>
          <div class="store-top-meta">
            <b>${done===pending.length?'✓ '+t('storeComplete'):t('storeMode')}</b>
            <span>🏠 ${esc(house(hid).short)} · ${T[state.lang].storeLeft(remaining)}</span>
          </div>
          <button class="store-done-toggle ${storeSelecting?'on':''}" id="storeSelectToggle" type="button">${storeSelecting?t('selectDone'):t('selectMode')}</button>
          <button class="store-done-toggle ${showDone?'on':''}" id="storeShowDone" type="button">${showDone?t('storeHideDone'):t('storeShowDone')}</button>
        </div>
        <div class="store-progress"><i style="width:${progress}%"></i></div>
        <div class="store-search"><input id="storeSearch" value="${esc(state.shopQuery)}" placeholder="${t('storeSearch')}" aria-label="${t('storeSearch')}" autocomplete="off" enterkeyhint="search"></div>
      </div>
      <div class="store-scroll">
        ${catOrder.filter(c=>byCat[c]).map(c=>{
          const cat = CATS().find(x=>x.id===c);
          const rows=byCat[c];
          return `<div class="store-category"><div class="store-cat-h">${cat?esc(L(cat)):t('other')}<span>${rows.length}</span></div>${rows.map(storeRow).join('')}</div>`;
        }).join('')}
        ${!pendingVisible.length?`<div class="shop-empty compact">
          <div class="big">⌕</div>
          <h3>${t('storeNoMatch')}</h3>
          <p>${t('storeNoMatchHint')}</p>
          <div class="shop-start-actions">
            <button class="btn sm" type="button" id="storeClearSearch">${t('storeClearSearch')}</button>
            ${!showDone?`<button class="btn sm sec" type="button" id="storeShowDoneEmpty">${t('storeShowDone')}</button>`:''}
          </div>
        </div>`:''}
      </div>
      ${storeSelecting?bulkBarHtml([
        {id:'found', label:t('bulkFound')},
        {id:'missing', label:t('bulkMissing'), danger:true},
        {id:'undo', label:t('bulkUndo')},
      ]):''}
      <div class="store-finish bottom-dock">
        <div class="row">
          <button class="btn sec sm" id="btnReceipt" type="button">${t('scanReceipt')}</button>
          <button class="btn" id="confirmBatch" type="button" ${remaining?'disabled':''}>${remaining?`${done}/${pending.length} · ${t('storeRemaining')}`:t('confirmBatch')}</button>
        </div>
        ${remaining?`<div class="muted" style="margin-top:6px;text-align:center;font-size:10.5px">${T[state.lang].storeProgressHint(done,pending.length)} · ${t('decideAll')}</div>`:''}
      </div>
    </section>` : '';

  const openCard = (pending.length || state.shopPanel!=='plan')?'':`<div class="card shop-list-card">
    ${open.length?`<div class="shop-items">${open.map(e=>{
      const sel = shopSelecting && isSelected(e.id);
      return `<div class="shop-item ${sel?'selected':''}">
      ${shopSelecting?`<button class="bulk-check ${sel?'on':''}" type="button" data-bulk-toggle="${e.id}" aria-pressed="${sel?'true':'false'}" aria-label="${esc(t('selectMode'))}"></button>`:''}
      <div><div class="shop-item-name">${svgIcon(prodIconId(e.productId?prod(e.productId):matchProduct(e.name)),'prod-ico')}${esc(e.name)}</div>
      <div class="shop-item-sub">${e.note?esc(e.note)+' · ':''}${esc(e.unit)}</div></div>
      ${shopSelecting?'':`<div class="cart-controls"><button class="cart-step" data-list-qty="-1" data-entry="${e.id}" aria-label="−">−</button><input class="cart-qty-input" data-list-q="${e.id}" value="${e.qty}" inputmode="decimal" aria-label="${esc(e.name)}"><button class="cart-step" data-list-qty="1" data-entry="${e.id}" aria-label="＋">＋</button><button class="mini-x" data-remove-list="${e.id}" aria-label="${t('close')}">×</button></div>`}
      </div>`;
    }).join('')}</div>`:
      `<div class="shop-empty">
        <div class="big">🧺</div>
        <h3>${t('startListTitle')}</h3>
        <p>${t('startListHint')}</p>
        <div class="shop-start-actions">
          <button class="btn" type="button" id="shopStartAdd">${t('startListAdd')}</button>
        </div>
      </div>`}
    ${shopSelecting?bulkBarHtml([
      {id:'remove', label:t('bulkRemove'), danger:true},
      {id:'qty-minus', label:t('bulkQtyMinus')},
      {id:'qty-plus', label:t('bulkQtyPlus')},
    ]):''}
    ${open.length&&!pending.length&&!shopSelecting?`<div class="cart-start"><button class="btn" id="startFriday">${T[state.lang].cartReady(open.length)}</button></div>`:''}
    </div>`;

  const missingCard = missing.length ? `<details class="card shop-history"><summary>⚠️ ${t('secMissing')}<span class="pill out">${missing.length}</span></summary><div class="shop-history-body">
      ${missing.map(e=>entryRow(e,`<button class="btn sm sec" data-carry="${e.id}">${t('carryOver')}</button>`)).join('')}</div></details>` : '';

  const boughtCard = bought.length ? `<details class="card shop-history"><summary>✓ ${t('secBought')}<span class="pill in">${bought.length}</span></summary><div class="shop-history-body">
      ${bought.slice(-8).reverse().map(e=>entryRow(e,`<span class="pill in">${t('stBought')}</span>`)).join('')}</div></details>` : '';

  return `<div class="shop-shell ${inStore?'shop-shell-store':'shop-shell-plan'}">${hero}${pendingCard}${takeListCard}${openCard}${missingCard}${boughtCard}</div>`;
}

/** Ανοίγει την παρτίδα Παρασκευής: όλα τα open μπαίνουν σε αναμονή αποδοχής. */
function startFridayBatch(){
  const hid = shopHouse();
  const open = fridayEntries(hid).filter(e=>e.status==='open');
  if(!open.length){ toast(t('nothingToStart')); return; }
  open.forEach(e => { e.status = 'pending'; delete e.decision; });
  state.shopQuery='';
  save(); render();
}

function cancelFridayBatch(){
  const pending=fridayEntries(shopHouse()).filter(e=>e.status==='pending');
  pending.forEach(e=>{e.status='open';delete e.decision;});state.shopQuery='';save();render();
}

function inventoryProductForEntry(entry){
  let product=entry.productId?prod(entry.productId):matchProduct(entry.name);
  if(product){entry.productId=product.id;return product;}
  DB.customProducts ||= [];
  product={id:'cp-'+uid(),cat:'custom',de:entry.name,el:entry.name,unit:entry.unit||'Stk',alias:[]};
  DB.customProducts.push(product);entry.productId=product.id;return product;
}

/**
 * Κλείνει την παρτίδα με ένα PIN. Ό,τι τσεκαρίστηκε ως αγορασμένο μπαίνει στο
 * απόθεμα του σπιτιού· unavailable / expensive γίνονται έλλειψη με λόγο.
 */
function confirmFridayBatch(){
  const hid = shopHouse();
  const pending = fridayEntries(hid).filter(e=>e.status==='pending');
  if(!pending.length){ toast(t('nothingPending')); return; }
  if(pending.some(e=>!e.decision)){toast(t('decideAll'),'error',3600);return;}
  askPin(t('confirmBatch'), who => {
    state.user = who;
    const got = [], miss = [], completedAt=Date.now(), friday=state.shopFriday||fridayFor();
    pending.forEach(e=>{
      e.decidedBy = who.id; e.decidedAt = completedAt;
      if(e.decision === 'bought'){
        e.status = 'bought';
        delete e.missReason;
        const inventoryProduct=inventoryProductForEntry(e),k=stockKey(hid,inventoryProduct.id);
        DB.stock[k] = (DB.stock[k] ?? 0) + e.qty;
        got.push(`${e.name} ${e.qty}${e.unit}`);
      }else if(e.decision === 'unavailable' || e.decision === 'expensive' || e.decision === 'missing'){
        // legacy `missing` treated as unavailable
        e.missReason = e.decision === 'expensive' ? 'expensive' : 'unavailable';
        e.status = 'missing';
        miss.push(`${e.name} ${e.qty}${e.unit} (${missReasonLabel(e.missReason)})`);
      }
      delete e.decision;
    });
    DB.shoppingTrips ||= [];
    const tripId='trip-'+uid();
    DB.shoppingTrips.push({id:tripId,houseId:hid,fridayDate:friday,completedAt,completedBy:who.id,
      items:pending.map(e=>({entryId:e.id,productId:e.productId||null,name:e.name,qty:e.qty,unit:e.unit,note:e.note||'',result:e.status,reason:e.missReason||null}))});
    logEntry('SHOP',
      `${t('typeSHOP')} @ ${house(hid).short} — ${t('stBought')}: ${got.join(', ') || '—'}` +
      ` | ${t('shortage')}: ${miss.join(', ') || '—'}`,
      {houseId:hid,tripId,items:pending.map(e=>({productId:e.productId,name:e.name,qty:e.qty,unit:e.unit,result:e.status,reason:e.missReason||null}))});
    save(); render(); toast(`${T[state.lang].batchBooked(pending.length)} · ${T[state.lang].bookedToHouse(house(hid).short)}`,'success',4800);
  });
}

/* ── Εισαγωγή λίστας από κείμενο ή φωτογραφία (§11.5, §58–§59) ──
   Το AI τρέχει μόνο μέσω server.py ώστε το API key να μη φτάνει ποτέ στον browser.
   Για pasted text υπάρχει ασφαλές local fallback· για εικόνα δεν επινοείται αποτέλεσμα. */

const UNITS = ['kg','g','l','ml','stk','stück','stueck','pkg','pack','packung','flasche','fl',
               'dose','glas','bottle','τεμ','κιλ','λιτ','πακ','liter','λίτρο','λίτρα','γραμμ'];

/** Κανονικοποίηση μονάδας σε Stk / kg / g / L / ml / Pkg — όπως στο παλιό καλό OCR. */
function normalizeUnit(raw, fallback='Stk'){
  const n = String(raw ?? '').trim().toLowerCase()
    .replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ß/g,'ss');
  if(!n) return fallback;
  if(/^(stk|stuck|stueck|st\.?|pcs?|pieces?|τεμ\.?|τεμαχιο|τεμαχια|τεμάχιο|τεμάχια)$/.test(n)) return 'Stk';
  if(/^(kg|kilo|kilos|kilogramm?e?|κιλ[αο]?|κιλά)$/.test(n)) return 'kg';
  if(/^(g|gr|gramm?e?|γραμμ\.?|γραμμάρια|γραμμαρια)$/.test(n)) return 'g';
  if(/^(l|lt|ltr|liter|litre|liters|litres|λίτρ[οα]?|λιτρα|λιτρο)$/.test(n)) return 'L';
  if(/^(ml|milliliter|millilitre)$/.test(n)) return 'ml';
  if(/^(pkg|pack|packung|packs|πακ\.?|πακετο|πακέτο)$/.test(n)) return 'Pkg';
  if(/^(flasche|fl|bottle|dose|glas)$/.test(n)) return 'Stk';
  return fallback;
}

/** Κανονικοποίηση για ταίριασμα: πεζά, χωρίς umlaut/τόνους, μόνο γράμματα. */
function norm(s){
  return s.toLowerCase()
    .replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ß/g,'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-zα-ω0-9]/g,'');
}

/** Απόσταση Levenshtein — ανέχεται ορθογραφικά τύπου «Steukäse», «Schwäme». */
function lev(a, b){
  if(Math.abs(a.length - b.length) > 3) return 99;
  const prev = Array.from({length: b.length + 1}, (_, i) => i);
  for(let i = 1; i <= a.length; i++){
    let last = prev[0]; prev[0] = i;
    for(let j = 1; j <= b.length; j++){
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j-1] + 1, last + (a[i-1] === b[j-1] ? 0 : 1));
      last = tmp;
    }
  }
  return prev[b.length];
}

const prodKeys = p => [p.de, p.el, p.en, ...(p.alias||[])].filter(Boolean);

/** Βρίσκει προϊόν από ελεύθερο κείμενο: ακριβές → περιέχει → ορθογραφικό λάθος. */
function matchProduct(name){
  const n = norm(name);
  if(!n) return null;

  for(const p of PRODUCTS()) if(prodKeys(p).some(k => norm(k) === n)) return p;

  // Προτιμάμε το κλειδί με το πλησιέστερο μήκος, όχι το μακρύτερο —
  // αλλιώς το «Tomate» θα ταίριαζε με «Tomatensoße».
  let best = null, bestDiff = Infinity;
  for(const p of PRODUCTS()) for(const k of prodKeys(p)){
    const nk = norm(k);
    if(nk.length < 4 || !(n.includes(nk) || nk.includes(n))) continue;
    const diff = Math.abs(nk.length - n.length);
    if(diff < bestDiff){ best = p; bestDiff = diff; }
  }
  if(best) return best;

  let cand = null, bestD = 3;
  for(const p of PRODUCTS()) for(const k of prodKeys(p)){
    const nk = norm(k);
    if(nk.length < 5) continue;
    const d = lev(n, nk);
    if(d < bestD){ bestD = d; cand = p; }
  }
  return cand;
}

/**
 * Ό,τι δεν «απορρόφησε» το όνομα του προϊόντος μένει ως σημείωση.
 * Κρίσιμο: «Schinken keine salami», «große Milch», «Müllsäcke lila».
 */
const STOPWORDS = new Set(['a','an','the','of','ein','eine','einen','und','and','für','for','το','τα','η','ο']);

function leftoverNote(raw, p){
  if(!p) return '';
  const keyWords = new Set(prodKeys(p).flatMap(k => k.split(/\s+/).map(norm)).filter(Boolean));
  return raw.split(/\s+/).filter(w => {
    const nw = norm(w);
    if(!nw || STOPWORDS.has(nw)) return false;
    if(keyWords.has(nw)) return false;
    // λέξη που είναι μέρος/παραλλαγή του ονόματος (π.χ. «Steukäse» → «Streukäse»)
    for(const kw of keyWords){
      if(kw.length >= 4 && (nw.includes(kw) || kw.includes(nw) || lev(nw, kw) <= 2)) return false;
    }
    return true;
  }).join(' ').trim();
}

/**
 * «Nutella 2, Milch light 2, Wasser groß 4, Nektarinen 10–12»
 * → [{name:'Nutella', qty:2, unit:'Stk'}, …]
 * Δέχεται ποσότητα πριν ή μετά το όνομα, εύρη (10–12 → 12) και μονάδες.
 */
const FRACTION_WORDS = {halbe:0.5, halber:0.5, halbes:0.5, half:0.5, μισό:0.5, μισή:0.5};

function parseListText(text){
  const NUM  = '\\d+(?:[.,]\\d+)?';
  const UNIT = UNITS.join('|');
  const out = [];

  for(let line of text.split(/\n+/)){
    line = line.trim();
    if(!line) continue;
    // Γραμμή τίτλου, π.χ. «Liste Lilly,Sammy…» ή «Löhri Koch-Backliste»
    if(/liste$|^liste\b|^einkaufsliste/i.test(line) && !/\d/.test(line)) continue;
    if(/^liste\s/i.test(line)) continue;

    // Χωρισμός σε είδη: «,» ή «;» — ποτέ μέσα σε «1,5» ή σε παρένθεση
    const parts = [];
    let buf = '', depth = 0;
    for(let i = 0; i < line.length; i++){
      const c = line[i];
      if(c === '(') depth++;
      if(c === ')') depth--;
      const decimal = c === ',' && /\d/.test(line[i-1] || '') && /\d/.test(line[i+1] || '');
      if((c === ',' || c === ';') && !depth && !decimal){ parts.push(buf); buf = ''; }
      else buf += c;
    }
    parts.push(buf);

    for(let raw of parts){
      let s = raw.trim()
        .replace(/^[-–—•*·]+\s*/, '')
        .replace(/^\d+[.)]\s+/, '');
      if(!s) continue;

      // Παρένθεση → σημείωση, όχι μέρος του ονόματος
      let note = '';
      s = s.replace(/\(([^)]*)\)/g, (_, inner) => { note = inner.trim(); return ' '; }).trim();
      // Αν η παρένθεση ήταν ποσότητα, π.χ. «Cheese (500 g)»
      let mNote = note.match(new RegExp(`^(${NUM})\\s*(${UNIT})$`, 'i'));

      let qty = null, unit = null, size = '', ambiguousQty = false;

      // «Halbe Wassermelone»
      const w = s.split(/\s+/)[0].toLowerCase();
      if(FRACTION_WORDS[w]){ qty = FRACTION_WORDS[w]; s = s.slice(w.length).trim(); }

      let m;
      // «3x 1,5 L Milch» / «4x 100g Käse» — πλήθος × μέγεθος
      if((m = s.match(new RegExp(`^(${NUM})\\s*[x×]\\s*(${NUM})\\s*(${UNIT})\\s+(.+)$`, 'i')))){
        qty = parseFloat(m[1].replace(',','.')); size = `${m[2]} ${m[3]}`; s = m[4];
      }
      // «500g Käse» / «1,5 kg Reis» — βάρος μπροστά. Πριν από τον σκέτο αριθμό,
      // αλλιώς το «kg» θα έμενε κολλημένο στο όνομα.
      else if((m = s.match(new RegExp(`^(${NUM})\\s*(${UNIT})\\s+(.+)$`, 'i')))){
        qty = parseFloat(m[1].replace(',','.')); unit = m[2]; s = m[3];
      }
      // «1x Eier» / «4× Wasser» / «15 Zwiebeln»
      else if((m = s.match(new RegExp(`^(${NUM})\\s*[x×]?\\s+?(.+)$`, 'i'))) && /^[\sx×]/.test(s.slice(m[1].length))){
        qty = parseFloat(m[1].replace(',','.')); s = m[2];
      }
      // «Water ×4» / «Nektarinen 10–12» / «Reis 1,5 kg»
      else if((m = s.match(new RegExp(`^(.+?)\\s*[x×]\\s*(${NUM})$`, 'i')))){
        s = m[1]; qty = parseFloat(m[2].replace(',','.'));
      }
      else if((m = s.match(new RegExp(`^(.+?)\\s+(${NUM})(?:\\s*[–—-]\\s*(${NUM}))?\\s*(${UNIT})?\\.?$`, 'i')))){
        s = m[1];
        qty = parseFloat((m[3] ?? m[2]).replace(',','.'));
        ambiguousQty = !!m[3];
        unit = m[4] || null;
      }

      if(mNote){ qty = qty ?? parseFloat(mNote[1].replace(',','.')); unit = unit || mNote[2]; note = ''; }

      // Ό,τι απομένει μετά το όνομα και δεν είναι προϊόν → σημείωση
      // π.χ. «Schinken keine salami», «Müllsäcke lila», «Jogurt klein 3er pack»
      let name = s.trim().replace(/\s{2,}/g,' ');
      if(!name) continue;

      let p = matchProduct(name);
      if(!p && name.includes(' ')){
        const words = name.split(/\s+/);
        for(let cut = words.length - 1; cut >= 1 && !p; cut--)
          p = matchProduct(words.slice(0, cut).join(' '));
      }
      // Ό,τι περισσεύει από το όνομα είναι οδηγία, όχι σκουπίδι
      const extra = leftoverNote(name, p);

      out.push({
        name: p ? L(p) : name,
        raw: name,
        qty: qty ?? 1,
        // Χωρίς δηλωμένη ποσότητα, «Käse» σημαίνει ένα τεμάχιο — όχι 1 γραμμάριο
        // «4x 100g Käse» = 4 συσκευασίες των 100 g → μονάδα τεμάχιο, μέγεθος στη σημείωση
        unit: size ? 'Stk'
            : unit ? normalizeUnit(unit)
            : (qty !== null && p) ? (p.unit || 'Stk') : 'Stk',
        size,
        note: [size && `à ${size}`, extra, note].filter(Boolean).join(' · '),
        productId: p ? p.id : null,
        cat: p ? p.cat : null,
        uncertain: qty === null || ambiguousQty,
        unknown: !p,
      });
    }
  }
  return out;
}

/** Υπάρχει ήδη το ίδιο είδος ανοιχτό σε αυτό το σπίτι; (§37.7) */
function existingOpen(name, hid){
  return DB.listEntries.find(e => e.houseId === hid && ['open','pending'].includes(e.status)
    && e.name.toLowerCase() === name.toLowerCase());
}

const confidenceClass = c => c==='high' ? 'in' : c==='low' ? 'out' : 'ovr';
const confidenceLabel = c => t(c==='high'?'confHigh':c==='low'?'confLow':'confMedium');

function categoryFromAi(value){
  const n = norm(value||'');
  if(/fridge|kuhl|ψυγ|dairy|meat/.test(n)) return 'fridge';
  if(/produce|obst|gemuse|fruit|veget|φρουτ|λαχαν/.test(n)) return 'produce';
  if(/drink|getrank|ποτ|νερ/.test(n)) return 'drinks';
  if(/clean|hygiene|house|καθα|υγιειν/.test(n)) return 'household';
  return 'dry';
}

function decorateImportRow(r, hid){
  const p = r.productId ? prod(r.productId) : matchProduct(r.canonicalName || r.name);
  if(p){ r.productId=p.id; r.name=L(p); r.cat=p.cat; }
  r.unit = normalizeUnit(r.unit, p?.unit || 'Stk');
  r.confidence = r.confidence || (r.unknown ? 'low' : r.uncertain ? 'medium' : 'high');
  r.dupe = !!existingOpen(r.name, hid);
  r.stockQty = p ? (DB.stock[stockKey(hid,p.id)] ?? 0) : null;
  r.stockUnit = p?.unit || r.unit;
  return r;
}

function unitFromPackageSize(size){
  const text = String(size||'');
  const m = text.match(/(\d+(?:[.,]\d+)?)\s*(kg|g|gr|gramm?e?|l|lt|ltr|ml|liter|litre|λίτρ[οα]?|κιλ[αο]?|γραμμ\.?)/i);
  if(!m) return null;
  return {qty: parseFloat(m[1].replace(',','.')), unit: normalizeUnit(m[2])};
}

function rowsFromAi(result, hid){
  const seen = new Map();
  return (result.items||[]).map(item=>{
    const p = matchProduct(item.canonical_name || item.name);
    let qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
    let unit = normalizeUnit(item.unit, '');
    const noteBlob = [item.brand, item.package_size, item.notes, item.name, item.canonical_name].filter(Boolean).join(' ');
    const fromPkg = unitFromPackageSize(item.package_size) || unitFromPackageSize(noteBlob);
    // Prefer explicit weight/volume from the line over a lazy Stk default.
    if(fromPkg && (fromPkg.unit==='kg'||fromPkg.unit==='g'||fromPkg.unit==='L'||fromPkg.unit==='ml')){
      if(!unit || unit==='Stk' || /stk|stuck|τεμ/i.test(String(item.unit||''))){
        if(!item.quantity || Math.abs(qty - fromPkg.qty) < 0.001 || qty === 1){
          qty = fromPkg.qty;
          unit = fromPkg.unit;
        } else {
          // Keep piece count but remember size in note; unit stays Stk only if clearly counted.
          unit = unit || 'Stk';
        }
      }
    }
    if(!unit) unit = p?.unit || 'Stk';
    unit = normalizeUnit(unit, p?.unit || 'Stk');
    // Catalogue Stk must not overwrite a measured unit from OCR.
    if(p?.unit==='Stk' && (unit==='kg'||unit==='g'||unit==='L'||unit==='ml')){
      /* keep measured unit */
    } else if(p?.unit && unit==='Stk' && (p.unit==='kg'||p.unit==='L'||p.unit==='g'||p.unit==='ml')){
      // Model said Stk but catalogue is measured — trust package/OCR if present, else catalogue.
      if(fromPkg){ qty = fromPkg.qty; unit = fromPkg.unit; }
      else unit = p.unit;
    }
    const row = decorateImportRow({
      name:p ? L(p) : (item.canonical_name || item.name),
      canonicalName:item.canonical_name || item.name,
      raw:item.name,
      qty, unit, productId:p?.id||null,
      cat:p?.cat || categoryFromAi(item.category),
      note:[item.brand, item.package_size, item.notes].filter(Boolean).join(' · '),
      confidence:item.confidence || 'low', uncertain:item.ambiguous, unknown:!p,
    },hid);
    const key = row.productId || norm(row.name+'|'+row.note);
    if(seen.has(key)) row.possibleDuplicate=true; else seen.set(key,row);
    return row;
  });
}

async function aiExtractShopping(sourceType, content, purpose='list'){
  if(location.protocol==='file:'){
    const error=new Error('file-protocol'); error.status=503; error.detail='GROQ_API_KEY server required'; throw error;
  }
  const idempotencyKey = `paidia-${sourceType}-${uid()}-${Date.now()}`;
  const ctl = new AbortController();
  const timer = setTimeout(()=>ctl.abort(), 90000);
  try{
    const response = await fetch('/api/ai-shopping', {
      method:'POST', signal:ctl.signal, credentials:'same-origin',
      headers:{'Content-Type':'application/json','Idempotency-Key':idempotencyKey},
      body:JSON.stringify({sourceType,content,locale:state.lang,purpose}),
    });
    const result = await response.json().catch(()=>({error:'invalid-response'}));
    if(!response.ok){
      const error = new Error(result.error || 'AI request failed');
      error.status=response.status; error.detail=result.detail||result.setup||result.error;
      throw error;
    }
    if(!Array.isArray(result.items)){
      const error=new Error('invalid-result'); error.status=502; throw error;
    }
    return result;
  }finally{ clearTimeout(timer); }
}

function imageFileData(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader(); reader.onerror=reject;
    reader.onload=()=>{
      const img=new Image(); img.onerror=reject; img.onload=()=>{
        const max=1600, scale=Math.min(1,max/Math.max(img.width,img.height));
        const cv=document.createElement('canvas'); cv.width=Math.round(img.width*scale); cv.height=Math.round(img.height*scale);
        cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
        resolve(cv.toDataURL('image/jpeg',.78));
      }; img.src=reader.result;
    }; reader.readAsDataURL(file);
  });
}

function sheetImportList(opts={}){
  const hid = shopHouse();
  const friday=state.shopFriday||fridayFor();
  const existing=fridayEntries(hid,friday).filter(e=>['open','pending'].includes(e.status));
  const batchIsActive=existing.some(e=>e.status==='pending');
  let rows = null, photo = null, imageSource = null, sourceText = '', extractedText = '', aiMeta = null, initialRows = null, busy=false;

  const draw = () => {
    const box = sheetEl.querySelector('#imRows');
    if(!rows){ box.innerHTML = ''; return; }
    box.innerHTML = `
      <div class="import-review"><div class="import-review-head"><div><b>${t('importReview')}</b>
        <div class="muted" style="font-size:10.5px">${t('checkBeforeSave')}</div></div><span class="pill gray">${rows.length}</span></div><div class="import-review-body">
      ${extractedText ? `<details style="padding:9px 12px"><summary class="muted">${t('extractedText')}</summary><div class="muted" style="white-space:pre-wrap;margin-top:6px">${esc(extractedText)}</div></details>` : ''}
      ${rows.map((r,i)=>`<div class="import-review-row">
        <div><input data-n="${i}" value="${esc(r.name)}" aria-label="${t('itemName')}" style="font-weight:650">
          <div style="margin-top:5px"><span class="pill ${confidenceClass(r.confidence)}">${confidenceLabel(r.confidence)}</span>
          ${r.unknown ? '<span class="pill ovr">?</span>' : ''}
          ${r.dupe ? `<span class="pill ovr">${t('alreadyOnList')}</span>` : ''}</div>
          ${r.note ? `<div class="muted" style="font-size:10.5px;margin-top:4px">${esc(r.note)}</div>` : ''}</div>
        <input type="number" data-q="${i}" value="${r.qty}" step="0.5" min="0" aria-label="${t('qty')}">
        <input data-u="${i}" value="${esc(r.unit)}" aria-label="${t('unit')}">
        <button class="mini-x" data-rm="${i}" aria-label="${t('close')}">×</button></div>`).join('')}</div></div>
      <div class="import-savebar"><button class="btn" id="imSave">${T[state.lang].importN(rows.length)} → ${esc(fridayText(friday))}</button></div>`;

    box.querySelectorAll('[data-n]').forEach(inp=>{
      inp.onchange=()=>{
        const r=rows[+inp.dataset.n]; r.name=inp.value.trim()||r.name;
        r.productId=null; r.unknown=true; decorateImportRow(r,hid); draw();
      };
    });

    box.querySelectorAll('[data-q]').forEach(inp=>{
      inp.onchange = () => rows[+inp.dataset.q].qty = parseFloat(inp.value) || 1;
    });
    box.querySelectorAll('[data-u]').forEach(inp=>{
      inp.onchange = () => rows[+inp.dataset.u].unit = inp.value.trim() || 'Stk';
    });
    box.querySelectorAll('[data-rm]').forEach(b=>{
      b.onclick = () => { rows.splice(+b.dataset.rm, 1); draw(); };
    });
    const sv = box.querySelector('#imSave');
    if(sv) sv.onclick = saveRows;
  };

  const saveRows = () => {
    if(!rows || !rows.length){ toast(t('nothingToImport')); return; }
    const behavior=sheetEl.querySelector('input[name="mergeMode"]:checked')?.value||'merge';
    askPin(t('importTitle'), who => {
      state.user = who;
      const importId=uid();
      if(behavior==='replace'){
        DB.listEntries=DB.listEntries.filter(e=>!(e.houseId===hid&&listEntryFriday(e)===friday&&['open','pending'].includes(e.status)));
      }
      rows.forEach(r => {
        const match=behavior==='merge'&&DB.listEntries.find(e=>e.houseId===hid&&listEntryFriday(e)===friday&&
          ['open','pending'].includes(e.status)&&(r.productId&&e.productId===r.productId||norm(e.name)===norm(r.name))&&norm(e.unit)===norm(r.unit));
        if(match){ match.qty=(Number(match.qty)||0)+(Number(r.qty)||0); match.note=[match.note,r.note].filter(Boolean).join(' · '); match.aiImportId=importId; return; }
        DB.listEntries.push({id:uid(),productId:r.productId,name:r.name,qty:r.qty,unit:r.unit,note:r.note||'',
          houseId:hid,fridayDate:friday,by:who.id,status:batchIsActive?'pending':'open',
          source:photo?`${imageSource||'image'}-ai`:aiMeta?'text-ai':'text-local',aiImportId:importId});
      });
      DB.aiImports.push({id:importId, ts:Date.now(), houseId:hid, uploader:who.id,
        fridayDate:friday,mergeMode:behavior,
        sourceType:photo?'image':'text', imageSource, originalText:sourceText, originalImage:photo,
        extractedText, model:aiMeta?.model||'local-parser', responseId:aiMeta?.responseId||null,
        aiRows:initialRows, finalRows:structuredClone(rows)});
      logEntry('SHOP', `${t('importTitle')} @ ${house(hid).short}: ` +
        rows.map(r=>`${r.name} ${r.qty}${r.unit}`).join(', '), {houseId: hid, photo, aiImportId:importId});
      save(); closeSheet(); render();
      toast(T[state.lang].importedToFriday(fridayText(friday)),'success',4200);
    });
  };

  openSheet(`
    <div class="import-flow"><div class="import-hero"><div class="import-kicker">${t('importStep')}</div>
      <h2>${t('importTitle')}</h2><p>${t('importStepHint')}</p>
      <div class="import-context"><div>${t('importDestination')}<b>🏠 ${esc(house(hid).short)}</b></div>
        <div>${t('fridayLabel')}<b>${esc(fridayText(friday))}</b></div><div>${t('existingFriday')}<b>${existing.length} ${t('listItems')}</b></div></div></div>
    <div class="import-source-grid">
      <section class="import-source"><h3>✍️ ${t('sourceTextTitle')}</h3><p>${t('sourceTextHint')}</p>
        <textarea id="imTxt" placeholder="${t('pastePh')}"></textarea><div class="import-action-row"><button class="btn" id="imParse">✨ ${t('analyzeText')}</button></div></section>
      <section class="import-source"><h3>🖼️ ${t('sourceImageTitle')}</h3><p>${t('sourceImageHint')}</p>
        <div class="screenshot-drop" id="imDrop" role="button" tabindex="0" aria-label="${esc(t('pickScreenshot'))}">
          <span class="big">＋</span><strong>${t('screenshotDrop')}</strong>
          <div class="muted">${t('screenshotPaste')}</div></div>
        <input class="file-input-hidden" id="imFile" type="file" accept="image/*,.heic,.heif,image/heic,image/heif">
        <div class="import-pick-row">
          <button class="btn" type="button" id="imPick">${t('pickScreenshot')}</button>
          <button class="btn sec" type="button" id="imPasteClip">${t('pasteScreenshot')}</button>
        </div>
        <div class="import-preview-card" id="imPreviewCard"><img id="imPreview" alt=""><div><b>✓ ${t('imagePreview')}</b><p>${t('imagePreviewHint')}</p>
          <div class="import-preview-actions"><button type="button" id="imChangeImage">↻ ${t('changeImage')}</button><button type="button" id="imRemoveImage">× ${t('removeImage')}</button></div></div></div>
        <div class="import-action-row"><button class="btn sec" id="imCamera">📷 ${t('useCamera')}</button></div></section></div>
    <video id="imVid" playsinline muted style="display:none"></video>
    <button class="btn" id="imSnap" style="display:none;margin-bottom:8px">${t('shootList')}</button>
    <div class="merge-choice"><label><input type="radio" name="mergeMode" value="merge" checked><b>${t('mergeSmart')}</b><small>${t('mergeSmartHint')}</small></label>
      <label><input type="radio" name="mergeMode" value="append"><b>${t('appendSeparate')}</b><small>${t('appendSeparateHint')}</small></label>
      <label><input type="radio" name="mergeMode" value="replace"><b>${t('replaceFriday')}</b><small>${t('replaceFridayHint')}</small></label></div>
    <div id="imStatus" class="status-box"></div><div id="imRows"></div></div>`);

  const dropZone = sheetEl.querySelector('#imDrop');
  const fileInput = sheetEl.querySelector('#imFile');
  let camStarted = false;

  (async()=>{
    const status=sheetEl.querySelector('#imStatus');
    if(location.protocol==='file:'){ setStatus(status,t('errConfig'),'error'); return; }
    try{
      const ctl=new AbortController(), timer=setTimeout(()=>ctl.abort(),4000);
      const response=await fetch('/api/health',{signal:ctl.signal}); clearTimeout(timer);
      const health=await response.json();
      if(!busy) setStatus(status,health.aiConfigured?t('aiReady'):t('errConfig'),health.aiConfigured?'success':'error');
    }catch(error){ if(!busy) setStatus(status,t('errNetwork'),'error'); }
  })();

  const setBusy = on => {
    busy=on;
    sheetEl.querySelectorAll('#imParse,#imSnap,#imCamera,#imPick,#imPasteClip,#imChangeImage').forEach(b=>b.disabled=on);
  };
  const analyse = async (sourceType, content) => {
    const status=sheetEl.querySelector('#imStatus');
    setBusy(true); setStatus(status,t('aiReading'),'busy'); rows=null; draw();
    try{
      const result=await aiExtractShopping(sourceType,content);
      aiMeta={model:result.model,responseId:result.responseId};
      extractedText=result.extracted_text||'';
      rows=rowsFromAi(result,hid);
      initialRows=structuredClone(rows);
      setStatus(status,T[state.lang].found(rows.length),rows.length?'success':'error');
    }catch(error){
      aiMeta=null;
      if(sourceType==='text'){
        extractedText=content;
        rows=parseListText(content).map(r=>decorateImportRow(r,hid));
        initialRows=structuredClone(rows);
        setStatus(status,t('aiUnavailable'),'error');
      }else{
        setStatus(status,friendlyAiError(error),'error');
        const retry=document.createElement('button');
        retry.type='button'; retry.className='btn sm sec'; retry.style.marginTop='8px';
        retry.textContent='↻ '+t('retry'); retry.onclick=()=>analyse(sourceType,content);
        status.appendChild(retry);
      }
    }finally{ setBusy(false); draw(); }
  };

  sheetEl.querySelector('#imParse').onclick = async () => {
    const txt = sheetEl.querySelector('#imTxt').value;
    if(!txt.trim()){ toast(t('pasteList')); return; }
    sourceText=txt; photo=null; imageSource=null;
    sheetEl.querySelector('#imPreviewCard').classList.remove('on');dropZone.style.display='grid';
    await analyse('text',txt);
    if(!rows?.length) toast(t('nothingToImport'));
  };

  const showImagePreview = src => {
    sheetEl.querySelector('#imPreview').src=src;
    sheetEl.querySelector('#imPreviewCard').classList.add('on');
    dropZone.style.display='none';
  };
  const clearImagePreview = () => {
    photo=null;imageSource=null;extractedText='';aiMeta=null;initialRows=null;rows=null;draw();
    const preview=sheetEl.querySelector('#imPreview');preview.removeAttribute('src');
    sheetEl.querySelector('#imPreviewCard').classList.remove('on');dropZone.style.display='grid';
    fileInput.value='';setStatus(sheetEl.querySelector('#imStatus'),t('aiReady'),'success');
  };
  const openFilePicker = () => { fileInput.value=''; fileInput.click(); };
  sheetEl.querySelector('#imPick').onclick = openFilePicker;
  sheetEl.querySelector('#imChangeImage').onclick = openFilePicker;
  sheetEl.querySelector('#imRemoveImage').onclick = clearImagePreview;

  const readScreenshot = async file => {
    if(!file) return;
    if(busy){ toast(t('aiReading')); return; }
    const type=(file.type||'').toLowerCase();
    const name=(file.name||'').toLowerCase();
    const looksImage=type.startsWith('image/') || /\.(png|jpe?g|webp|heic|heif|gif)$/.test(name);
    if(!looksImage || file.size>10*1024*1024){
      setStatus(sheetEl.querySelector('#imStatus'),t('errImage'),'error'); return;
    }
    try{
      imageSource='screenshot';
      photo=await imageFileData(file);
      showImagePreview(photo);
      setStatus(sheetEl.querySelector('#imStatus'),t('screenshotReady'),'busy');
      await analyse('image',photo);
    }catch(error){ setStatus(sheetEl.querySelector('#imStatus'),t('errFile'),'error'); }
  };

  const pasteFromClipboard = async () => {
    if(busy){ toast(t('aiReading')); return; }
    try{
      if(navigator.clipboard?.read){
        const items=await navigator.clipboard.read();
        for(const item of items){
          const mime=item.types.find(x=>x.startsWith('image/'));
          if(!mime) continue;
          const blob=await item.getType(mime);
          await readScreenshot(new File([blob], 'clipboard.png', {type: blob.type||mime}));
          return;
        }
      }
    }catch(error){ /* fall through to hint */ }
    toast(t('screenshotMissing'),'info');
    setStatus(sheetEl.querySelector('#imStatus'),t('screenshotPaste'),'info');
    dropZone.focus();
  };
  sheetEl.querySelector('#imPasteClip').onclick = pasteFromClipboard;

  fileInput.onchange = e => { readScreenshot(e.target.files?.[0]); };
  dropZone.onclick = openFilePicker;
  dropZone.onkeydown = e => {
    if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openFilePicker(); }
  };
  dropZone.ondragenter = dropZone.ondragover = e => { e.preventDefault(); dropZone.classList.add('drag'); };
  dropZone.ondragleave = () => dropZone.classList.remove('drag');
  dropZone.ondrop = e => {
    e.preventDefault(); dropZone.classList.remove('drag'); readScreenshot(e.dataTransfer?.files?.[0]);
  };
  sheetEl.onpaste = e => {
    const item=[...(e.clipboardData?.items||[])].find(x=>x.type.startsWith('image/'));
    if(!item) return;
    e.preventDefault(); readScreenshot(item.getAsFile());
  };

  sheetEl.querySelector('#imCamera').onclick = async () => {
    if(camStarted) return;
    camStarted=true;
    const vid=sheetEl.querySelector('#imVid'); vid.style.display='block';
    const ok=await startCamera(vid,sheetEl.querySelector('#imStatus'));
    sheetEl.querySelector('#imSnap').style.display=ok?'block':'none';
  };

  sheetEl.querySelector('#imSnap').onclick = async () => {
    const vid = sheetEl.querySelector('#imVid');
    photo = camStream ? snap(vid) : null;
    if(!photo){ toast(t('noCam')); return; }
    imageSource='camera';
    stopCamera(); vid.style.display='none';
    showImagePreview(photo);
    await analyse('image',photo);
  };

  if(opts.initialFile) readScreenshot(opts.initialFile);
  else if(opts.autoPick) setTimeout(openFilePicker, 60);
}

function sheetReceipt(){
  let photo = null, lines = null;
  openSheet(`
    <h3>${t('scanTitle')} · ${esc(house(state.house).short)}</h3>
    <video id="rVid" playsinline muted></video>
    <div class="muted" id="rStatus" style="margin:6px 0 10px"></div>
    <button class="btn sec" id="rSnap">${t('shootReceipt')}</button>
    <div id="rBody"></div>`);
  const vid = sheetEl.querySelector('#rVid');
  const status = sheetEl.querySelector('#rStatus');
  let camOk = false;
  startCamera(vid, status).then(ok => { camOk = ok; if(!ok) vid.style.display='none'; });

  sheetEl.querySelector('#rSnap').onclick = async () => {
    photo = camOk ? snap(vid) : null;
    if(!photo){ toast(t('noCam')); return; }
    stopCamera(); vid.style.display='none';
    setStatus(status,t('reading'),'busy');
    sheetEl.querySelector('#rSnap').disabled=true;
    try{
      const result=await aiExtractShopping('image',photo,'receipt');
      const hid=shopHouse();
      const pending=fridayEntries(hid).filter(e=>e.status==='pending');
      lines=rowsFromAi(result,hid).map(r=>{
        const match=pending.find(e=>(r.productId && e.productId===r.productId) || norm(e.name)===norm(r.name));
        return {name:r.name,qty:r.qty,unit:r.unit,matchId:match?.id||null,confidence:r.confidence};
      });
      setStatus(status,T[state.lang].found(lines.length),lines.length?'success':'error');
      sheetEl.querySelector('#rBody').innerHTML = `
        ${photo?`<img class="thumb" src="${photo}">`:''}
        <div class="card" style="margin-top:12px"><h2>${t('result')}</h2>
        ${lines.map(l=>`<div class="kv">
          <div class="grow">${esc(l.name)} <span class="pill ${confidenceClass(l.confidence)}">${confidenceLabel(l.confidence)}</span>
            ${l.matchId?'':`<span class="pill ovr">${t('notOnList')}</span>`}</div>
          <div class="muted">${l.qty} ${esc(l.unit)}</div></div>`).join('')}
        </div>
        <button class="btn" id="rSave">${t('bookBatch')}</button>`;
      /* Το OCR τσεκάρει μόνο· η τελική αποδοχή γίνεται με το PIN στην παρτίδα. */
      sheetEl.querySelector('#rSave').onclick = () => {
        const hid = shopHouse();
        lines.forEach(l=>{
          if(l.matchId){
            const e = DB.listEntries.find(x=>x.id===l.matchId);
            if(e) e.decision = 'bought';
          }else{
            // Βρέθηκε στην απόδειξη χωρίς να είναι στη λίστα
            const p = PRODUCTS().find(x=>x.de===l.name || x.el===l.name);
            DB.listEntries.push({
              id: uid(), productId: p ? p.id : null, name: l.name, qty: l.qty, unit: l.unit,
              houseId: hid, fridayDate:state.shopFriday||fridayFor(), by: state.user ? state.user.id : null,
              status: 'pending', decision: 'bought', notOnList: true, receiptPhoto: photo,
            });
          }
        });
        save(); closeSheet(); render(); toast(t('batchDone'));
      };
    }catch(error){
      setStatus(status,friendlyAiError(error),'error');
      sheetEl.querySelector('#rSnap').disabled=false;
    }
  };
}

/* ════════════════════════════════════════════════════════════════
   Το Βιβλίο — filters + one presentation at a time
   ════════════════════════════════════════════════════════════════ */
const LOG_TYPES = ['IN','OUT','SHOP','SCHEDULE','EVENT','NOTES','SHIFT','STOCKCHECK','CORRECTION','LOGIN'];
const typeLabel = ty => t('type'+ty);
const typeIcon = ty => ({IN:'➕',OUT:'➖',SHOP:'🛒',SCHEDULE:'📅',EVENT:'🎉',NOTES:'📝',SHIFT:'📒',STOCKCHECK:'✅',CORRECTION:'✍️',LOGIN:'🔐'}[ty]||'•');

function bookRangeFromTs(){
  const now = Date.now();
  if(state.bookRange==='today'){
    const d = new Date();
    d.setHours(0,0,0,0);
    return d.getTime();
  }
  if(state.bookRange==='week') return now - 7*24*3600*1000;
  if(state.bookRange==='month') return now - 30*24*3600*1000;
  return 0;
}
function bookRangeLabel(){
  return ({today:t('today'), week:t('last7'), month:t('last30'), all:t('bookAll')})[state.bookRange] || t('today');
}
function bookHasActiveFilters(){
  const f = state.bookFilter;
  return !!(f.employeeId || f.type || (f.q||'').trim() || state.bookRange!=='today');
}
function bookFilteredLogs(){
  const f = state.bookFilter;
  const from = bookRangeFromTs();
  const q = norm(f.q||'');
  return DB.log
    .filter(l=>{
      if(from && (l.ts||0) < from) return false;
      if(f.employeeId && l.employeeId!==f.employeeId) return false;
      if(f.type && l.type!==f.type) return false;
      if(q){
        const e = l.employeeId ? emp(l.employeeId) : null;
        const hay = norm(`${l.text||''} ${e?.name||''} ${typeLabel(l.type)} ${l.type||''}`);
        if(!hay.includes(q)) return false;
      }
      return true;
    })
    .slice()
    .sort((a,b)=>(b.ts||0)-(a.ts||0));
}
function bookClearFilters(){
  state.bookFilter = {employeeId:'', type:'', q:''};
  state.bookRange = 'today';
}

function bookLogItemHtml(l, {compact=false}={}){
  const e = l.employeeId ? emp(l.employeeId) : null;
  const pillCls = l.type==='IN'?'in':l.type==='OUT'?'out':'gray';
  if(compact){
    return `<div class="book-compact-row" title="${esc(l.text||'')}">
      <span class="pill ${pillCls}">${typeLabel(l.type)}</span>
      <span class="book-compact-text">${esc((l.text||'').slice(0,72))}${(l.text||'').length>72?'…':''}</span>
      <span class="muted book-compact-who">${esc(e?e.name:'—')}</span>
      <span class="muted book-compact-time">${fmtDT(l.ts)}</span>
    </div>`;
  }
  return `<div class="log-item book-log-item">
    <div class="row between">
      <span class="pill ${pillCls}">${typeIcon(l.type)} ${typeLabel(l.type)}</span>
      <span class="muted">${fmtDT(l.ts)}</span>
    </div>
    <div class="book-log-text">${esc(l.text)}</div>
    <div class="muted book-log-stamp">${t('stamp')}: ${esc(e?e.name:'—')}</div>
    ${state.bookShowTech?`<div class="muted book-log-tech">IP ${esc(l.ip||'—')} · ${t('device')} ${esc(l.deviceId||'—')}</div>`:''}
    ${l.photo?`<img class="thumb" src="${l.photo}" alt="">`:''}
  </div>`;
}

function bookTimelineHtml(rows){
  if(!rows.length) return `<div class="empty">${bookHasActiveFilters()?t('bookNoMatch'):t('noLog')}</div>`;
  if(state.bookView==='compact'){
    return `<div class="book-compact">${rows.map(l=>bookLogItemHtml(l,{compact:true})).join('')}</div>`;
  }
  if(state.bookView==='byDay'){
    const groups = {};
    rows.forEach(l=>{
      const day = iso(new Date(l.ts||0));
      (groups[day]=groups[day]||[]).push(l);
    });
    return Object.keys(groups).map(day=>`
      <section class="book-day-group">
        <h3 class="book-day-title">${esc(day)} <span class="muted">· ${groups[day].length}</span></h3>
        <div class="log">${groups[day].map(l=>bookLogItemHtml(l)).join('')}</div>
      </section>`).join('');
  }
  return `<div class="log">${rows.map(l=>bookLogItemHtml(l)).join('')}</div>`;
}

function whoDidWhatCard(rows){
  const per = DB.employees.map(e=>{
    const mine = rows.filter(l => l.employeeId === e.id);
    if(!mine.length) return null;
    const counts = {};
    mine.forEach(l => { counts[l.type] = (counts[l.type]||0) + 1; });
    return {e, n: mine.length, counts, last: Math.max(...mine.map(l=>l.ts||0))};
  }).filter(Boolean).sort((a,b)=> b.n - a.n);

  return `<div class="book-panel">
    <div class="row between book-panel-head">
      <h2>${t('whoDidWhat')}</h2>
      <span class="pill gray">${t('visibleToAll')} · ${esc(bookRangeLabel())}</span>
    </div>
    ${per.length ? `<div class="book-people">${per.map(p=>`
      <button type="button" class="entry book-person" data-book-who="${p.e.id}">
        <div class="top">
          <div class="avatar" style="background:${safeColor(p.e.color)}">${initials(p.e.name)}</div>
          <div class="grow">
            <div class="act">${esc(p.e.name)} <span class="muted">· ${p.n} ${T[state.lang].actions(p.n)}</span></div>
            <div class="meta">${Object.entries(p.counts)
              .sort((a,b)=>b[1]-a[1])
              .map(([ty,n])=>`${typeLabel(ty)} ${n}`).join(' · ')}</div>
          </div>
          <div class="muted" style="flex:0 0 auto">${fmtDT(p.last)}</div>
        </div>
      </button>`).join('')}</div>`
      : `<div class="empty">${bookHasActiveFilters()?t('bookNoMatch'):t('noActionsToday')}</div>`}
  </div>`;
}

function shiftNoteKey(employeeId, dateStr=iso(new Date())){
  return `${employeeId}:${dateStr}`;
}
function shiftNoteFor(employeeId, dateStr=iso(new Date())){
  return (DB.shiftNotes && DB.shiftNotes[shiftNoteKey(employeeId, dateStr)]) || null;
}
function journalTimeLabel(ts=Date.now()){
  try{
    return new Date(ts).toLocaleTimeString(state.lang==='el'?'el-GR':'de-DE',{hour:'2-digit',minute:'2-digit'});
  }catch{ return ''; }
}
function journalDateLabel(dateStr){
  try{
    const [y,m,d]=String(dateStr).split('-').map(Number);
    return new Date(y,m-1,d).toLocaleDateString(state.lang==='el'?'el-GR':'de-DE',{weekday:'long',day:'numeric',month:'long'});
  }catch{ return dateStr; }
}
function writeShiftJournalPage(employeeId, text, {mode='ink'}={}){
  const addition=String(text||'').trim();
  if(!addition) return null;
  const dateStr=iso(new Date());
  const key=shiftNoteKey(employeeId, dateStr);
  DB.shiftNotes=DB.shiftNotes||{};
  const prev=DB.shiftNotes[key];
  let next;
  if(mode==='rewrite'){
    next=addition.slice(0,8000);
  }else{
    const stamp=`— ${journalTimeLabel()} —`;
    const chunk=`${stamp}\n${addition}`;
    next=(prev?.text ? `${prev.text}\n\n${chunk}` : chunk).slice(-8000);
  }
  const entry={id:key, employeeId, date:dateStr, text:next, ts:Date.now()};
  DB.shiftNotes[key]=entry;
  logEntry('SHIFT', `${t('typeSHIFT')}: ${addition.slice(0,180)}`, {date:dateStr});
  return entry;
}
function shiftDiaryCard(){
  if(!state.user) return `<div class="empty">${t('noUser')}</div>`;
  const today=iso(new Date());
  const mine=shiftNoteFor(state.user.id, today);
  const written=!!(mine?.text||'').trim();
  const mode=state.bookJournalMode==='rewrite'?'rewrite':'ink';
  const from=bookRangeFromTs();
  const team=Object.values(DB.shiftNotes||{})
    .filter(n=>n && n.text && (!from || (n.ts||0)>=from) && !(n.employeeId===state.user.id && n.date===today))
    .sort((a,b)=>(b.ts||0)-(a.ts||0));
  const pageBody=(mine?.text||'').trim();

  return `<div class="journal-book">
    <div class="journal-duty ${written?'ok':'must'}">
      <span>${written?t('journalPageDone'):t('journalMustWrite')}</span>
      <span class="pill ${written?'in':'out'}">${written?'✓':'!'}</span>
    </div>
    ${shiftStockCheckBannerHtml()}
    <article class="journal-spread" aria-label="${esc(t('shiftDiaryMine'))}">
      <div class="journal-spine" aria-hidden="true"></div>
      <div class="journal-page">
        <header class="journal-page-head">
          <div>
            <div class="journal-kicker">${esc(t('shiftDiary'))}</div>
            <h2>${esc(journalDateLabel(today))}</h2>
          </div>
          <div class="journal-page-meta">
            <span>${esc(state.user.name)}</span>
            <span>${esc(today)}</span>
          </div>
        </header>
        <div class="journal-ruled">
          ${pageBody
            ? `<div class="journal-ink">${esc(pageBody)}</div>`
            : `<div class="journal-blank">${esc(t('journalEmptyPage'))}</div>`}
        </div>
        <footer class="journal-sign">
          <span>${t('journalSigned')}</span>
          <b>${esc(state.user.name)}</b>
          ${mine?.ts?`<span class="muted">${fmtDT(mine.ts)}</span>`:''}
        </footer>
      </div>
    </article>
    <div class="journal-write">
      <p class="journal-write-hint">${mode==='rewrite'?t('journalRewrite'):t('journalInkHint')}</p>
      <label class="f"><span>${mode==='rewrite'?t('journalRewrite'):t('journalContinue')}</span>
        <textarea id="shiftNoteText" rows="5" placeholder="${esc(t('shiftDiaryPh'))}">${mode==='rewrite'?esc(pageBody):''}</textarea>
      </label>
      <div class="journal-write-actions">
        <button class="btn" id="shiftNoteSave" type="button">${mode==='rewrite'?t('journalRewriteSave'):t('shiftDiarySave')}</button>
        ${written?`<button class="btn sec" id="shiftNoteMode" type="button" data-journal-mode="${mode==='rewrite'?'ink':'rewrite'}">${mode==='rewrite'?t('journalContinue'):t('journalRewrite')}</button>`:''}
      </div>
    </div>
    <section class="journal-archive">
      <div class="row between book-panel-head">
        <h2 style="font-size:15px">${t('journalBrowse')}</h2>
        <span class="pill gray">${T[state.lang].journalPages(team.length)} · ${esc(bookRangeLabel())}</span>
      </div>
      ${team.length ? team.map(n=>{
        const e=emp(n.employeeId);
        return `<article class="journal-past-page">
          <header>
            <div class="avatar" style="background:${e?.color||'#94a3b8'}">${esc(e?initials(e.name):'?')}</div>
            <div class="grow">
              <b>${esc(e?.name||'—')}</b>
              <span class="muted">${esc(journalDateLabel(n.date))} · ${esc(n.date)}</span>
            </div>
            <span class="muted">${fmtDT(n.ts)}</span>
          </header>
          <div class="journal-ink past">${esc(n.text)}</div>
        </article>`;
      }).join('') : `<div class="empty">${t('shiftDiaryEmpty')}</div>`}
    </section>
  </div>`;
}

function bookFiltersHtml(){
  const f = state.bookFilter;
  const rangeFrom = bookRangeFromTs();
  const rangeRows = DB.log.filter(l=>!rangeFrom || (l.ts||0)>=rangeFrom);
  const typeBase = {};
  rangeRows.forEach(l=>{ if(l.type) typeBase[l.type]=(typeBase[l.type]||0)+1; });

  return `<div class="book-filters">
    <div class="book-filter-block">
      <span class="book-filter-label">${t('bookRangeLabel')}</span>
      <div class="book-chips" role="group">
        ${[['today',t('today')],['week',t('last7')],['month',t('last30')],['all',t('bookAll')]].map(([k,lab])=>
          `<button type="button" class="book-chip ${state.bookRange===k?'on':''}" data-book-range="${k}">${esc(lab)}</button>`
        ).join('')}
      </div>
    </div>
    <div class="book-filter-block">
      <span class="book-filter-label">${t('bookTypeLabel')}</span>
      <div class="book-chips book-chips-scroll" role="group">
        <button type="button" class="book-chip ${!f.type?'on':''}" data-book-type="">${t('all')}</button>
        ${LOG_TYPES.filter(k=>(typeBase[k]||0)>0 || f.type===k).map(k=>
          `<button type="button" class="book-chip ${f.type===k?'on':''}" data-book-type="${k}">${typeLabel(k)}${typeBase[k]?` · ${typeBase[k]}`:''}</button>`
        ).join('')}
      </div>
    </div>
    <div class="book-filter-block">
      <span class="book-filter-label">${t('bookWhoLabel')}</span>
      <div class="book-chips book-chips-scroll" role="group">
        <button type="button" class="book-chip ${!f.employeeId?'on':''}" data-book-who="">${t('allStaff')}</button>
        ${DB.employees.map(e=>{
          const n = rangeRows.filter(l=>l.employeeId===e.id).length;
          if(!n && f.employeeId!==e.id) return '';
          return `<button type="button" class="book-chip book-chip-who ${f.employeeId===e.id?'on':''}" data-book-who="${e.id}">
            <span class="book-chip-av" style="background:${safeColor(e.color)}">${initials(e.name)}</span>${esc(e.name.split(' ')[0])}${n?` · ${n}`:''}
          </button>`;
        }).join('')}
      </div>
    </div>
    <div class="book-filter-block book-filter-search">
      <label class="book-search">
        <span aria-hidden="true">⌕</span>
        <input id="bookSearch" type="search" value="${esc(f.q||'')}" placeholder="${esc(t('bookSearchPh'))}" autocomplete="off" enterkeyhint="search">
        ${(f.q||'').trim()?`<button type="button" id="bookSearchClear" aria-label="${esc(t('close'))}">×</button>`:''}
      </label>
    </div>
    ${state.bookPane==='log'?`<div class="book-filter-block">
      <span class="book-filter-label">${t('bookViewLabel')}</span>
      <div class="book-chips" role="group">
        ${[['timeline',t('bookViewTimeline')],['byDay',t('bookViewByDay')],['compact',t('bookViewCompact')]].map(([k,lab])=>
          `<button type="button" class="book-chip ${state.bookView===k?'on':''}" data-book-view="${k}">${esc(lab)}</button>`
        ).join('')}
        <button type="button" class="book-chip ghost ${state.bookShowTech?'on':''}" data-book-tech="1">${state.bookShowTech?t('bookHideTech'):t('bookShowTech')}</button>
      </div>
    </div>`:''}
    ${bookHasActiveFilters()?`<button type="button" class="btn sm sec book-clear" id="bookClearFilters">${t('bookClearFilters')}</button>`:''}
  </div>`;
}

function viewBook(){
  const rows = bookFilteredLogs();
  const pane = state.bookPane || 'shift';
  const filterMeta = [
    bookRangeLabel(),
    state.bookFilter.type ? typeLabel(state.bookFilter.type) : null,
    state.bookFilter.employeeId ? (emp(state.bookFilter.employeeId)?.name||null) : null,
    (state.bookFilter.q||'').trim() ? `“${(state.bookFilter.q||'').trim().slice(0,12)}”` : null,
    pane==='log' ? T[state.lang].bookResults(rows.length) : null,
  ].filter(Boolean).join(' · ');

  const body = pane==='shift'
    ? shiftDiaryCard()
    : pane==='people'
      ? whoDidWhatCard(rows)
      : `<div class="book-panel">
          <div class="row between book-panel-head">
            <h2>${t('history')}</h2>
            <span class="pill gray">${T[state.lang].bookResults(rows.length)} · ${t('appendOnly')}</span>
          </div>
          ${bookTimelineHtml(rows)}
          <div class="book-foot">
            <button class="btn sec" id="bFix" type="button">${t('correction')}</button>
            <p class="muted">${t('logNoDelete')}</p>
          </div>
        </div>`;

  const heroTitle = pane==='shift' ? t('bookJournalHero') : t('bookHeroTitle');
  const heroHint = pane==='shift' ? t('bookJournalHint') : t('bookHeroHint');

  return `<div class="book-page">
    <header class="book-hero ${pane==='shift'?'journal':''}">
      <div class="brand-kicker">Armonia Thassos</div>
      <h2 class="tide-line">${esc(heroTitle)}</h2>
      <p>${esc(heroHint)}</p>
    </header>
    <div class="book-panes" role="tablist">
      <button type="button" role="tab" class="book-pane-btn ${pane==='shift'?'on':''}" data-book-pane="shift" aria-selected="${pane==='shift'}">${esc(t('bookPaneShift'))}</button>
      <button type="button" role="tab" class="book-pane-btn ${pane==='log'?'on':''}" data-book-pane="log" aria-selected="${pane==='log'}">${esc(t('bookPaneLog'))}</button>
      <button type="button" role="tab" class="book-pane-btn ${pane==='people'?'on':''}" data-book-pane="people" aria-selected="${pane==='people'}">${esc(t('bookPanePeople'))}</button>
    </div>
    ${pane!=='shift' ? adaptiveChrome(bookFiltersHtml(), filterMeta) : adaptiveChrome(`
      <div class="page-actions book-toolbar" role="toolbar">
        <button class="page-act ${state.bookRange==='today'?'on':''}" type="button" data-book-range="today">${esc(t('today'))}</button>
        <button class="page-act ${state.bookRange==='week'?'on':''}" type="button" data-book-range="week">${esc(t('last7'))}</button>
        <button class="page-act ${state.bookRange==='month'?'on':''}" type="button" data-book-range="month">${esc(t('last30'))}</button>
        <button class="page-act ghost" type="button" data-page-act="bookFix">${esc(t('topFix'))}</button>
      </div>`, bookRangeLabel())}
    ${body}
  </div>`;
}

function sheetCorrection(){
  openSheet(`
    <h3>${t('correctionTitle')}</h3>
    <div class="muted" style="margin-bottom:12px">${t('correctionHint')}</div>
    <label class="f"><span>${t('correctionWhat')}</span>
      <textarea id="cTxt" rows="3" placeholder="${t('correctionPh')}"></textarea></label>
    <button class="btn" id="cSave">${t('bookWith')}</button>`);
  sheetEl.querySelector('#cSave').onclick = () => {
    const txt = sheetEl.querySelector('#cTxt').value.trim();
    if(!txt){ toast(t('correctionWhat')); return; }
    askPin(t('correctionTitle'), who => {
      state.user = who;
      logEntry('CORRECTION', txt);
      closeSheet(); render(); toast(t('saved'));
    });
  };
}

/* ════════════════════════════════════════════════════════════════
   Render + events
   ════════════════════════════════════════════════════════════════ */
/* ── Child Portal (§31.4): μόνο ό,τι αφορά το ίδιο το παιδί ──
   Δεν εμφανίζονται σημειώσεις βάρδιας ή λειτουργικά δεδομένα προσωπικού. */
function childEntriesFor(dateStr, cid){
  return entriesFor(dateStr)
    .filter(e => !e.cancelled && (e.childIds||[]).includes(cid))
    .sort((a,b) => BLOCKS.findIndex(x=>x.id===a.block) - BLOCKS.findIndex(x=>x.id===b.block));
}

function childEntryCard(e, cid){
  const a = act(e.activityId), caregivers=entryEmployeeIds(e).map(emp).filter(Boolean);
  const mates = (e.childIds||[]).filter(x => x !== cid).map(x => kid(x)?.name).filter(Boolean);
  return `<div class="entry" style="cursor:default">
    <div class="top">
      <span class="emoji" style="font-size:22px">${a?a.emoji:'📝'}</span>
      <div class="grow">
        <div class="act" style="font-size:15px">${esc(actLabel(e.activityId))}</div>
        <div class="meta">${esc(entryTime(e))}${
          entryHouseIds(e).length ? ' · 🏠 ' + esc(houseNames(e)) : ''}</div>
        ${caregivers.length ? `<div class="meta">👤 ${esc(caregivers.map(x=>x.name).join(', '))}</div>` : ''}
        ${mates.length ? `<div class="meta">${t('withWhom')} ${esc(mates.join(', '))}</div>` : ''}
      </div>
    </div>
  </div>`;
}

function childEventsFor(cid){
  return DB.events
    .filter(e=>e.status==='published' && (e.childIds||[]).includes(cid))
    .sort((a,b)=>(a.date+a.from).localeCompare(b.date+b.from));
}

function eventDayLabel(dateStr){
  const locale = state.lang==='de' ? 'de-DE' : 'el-GR';
  return new Intl.DateTimeFormat(locale,{weekday:'short',day:'numeric',month:'short'})
    .format(new Date(dateStr+'T12:00:00'));
}

function childEventHero(e){
  const caregivers=entryEmployeeIds(e).map(emp).filter(Boolean);
  return `<div class="card event-hero">
    <div class="event-cover" style="background:linear-gradient(135deg,${esc(e.color||'#2f5a63')},#062a30)">
      <span class="event-emoji">${esc(e.emoji||'🎉')}</span>
      <div class="event-title"><span class="pill in" style="margin-bottom:8px">${t('eventOfWeek')}</span><br>${esc(L(e))}</div>
    </div>
    <div class="event-body">
      <div class="event-description">${esc(L(e.description))}</div>
      <div class="event-meta">
        <div>🗓️ <b>${esc(eventDayLabel(e.date))}</b><br>${esc(e.from)}–${esc(e.to)}</div>
        <div>📍 <b>${esc(e.location)}</b></div>
        <div>🎒 <b>${t('bring')}:</b><br>${esc(L(e.bring))}</div>
        <div>👤 <b>${t('accompaniedBy')}:</b><br>${esc(caregivers.map(x=>x.name).join(', ')||'—')}</div>
      </div>
    </div>
  </div>`;
}

function childEventCard(e){
  const d = new Date(e.date+'T12:00:00'), caregivers=entryEmployeeIds(e).map(emp).filter(Boolean);
  return `<div class="card event-card" style="--event-color:${esc(e.color||'#2f5a63')}">
    <div class="event-date"><span>${DAY_NAMES[state.lang][dowIdx(d)]}</span><b>${d.getDate()}</b><span>${d.getMonth()+1}</span></div>
    <div class="grow"><div class="strong">${esc(e.emoji||'🎉')} ${esc(L(e))}</div>
      <div class="muted">${esc(e.from)}–${esc(e.to)} · 📍 ${esc(e.location)}</div>
      <div class="muted">👤 ${esc(caregivers.map(x=>x.name).join(', ')||'—')} · 🎒 ${esc(L(e.bring))}</div></div>
  </div>`;
}

function childEventsView(cid){
  const events = childEventsFor(cid);
  const calBar = `<div class="page-actions" role="toolbar" style="margin-bottom:10px">
      <button class="page-act ghost" type="button" id="childCalendar">📅 ${esc(t('calTitle'))}</button>
    </div>`;
  if(!events.length) return `${calBar}${emptyState(ui('u-megaphone'), t('noEvents'))}`;
  const today = iso(new Date()), tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate()+1);
  const tomorrow = iso(tomorrowDate);
  const featured = events.find(e=>e.featured && e.date>=today) || events.find(e=>e.date>=today) || events[0];
  const sections = [
    [t('eventToday'), events.filter(e=>e.date===today && e.id!==featured.id)],
    [t('eventTomorrow'), events.filter(e=>e.date===tomorrow && e.id!==featured.id)],
    [t('upcomingEvents'), events.filter(e=>e.date>tomorrow && e.id!==featured.id)],
  ].filter(([,list])=>list.length);
  return `${calBar}${childEventHero(featured)}${sections.map(([title,list])=>`
    <div class="block-h"><span class="t">${title}</span></div>${list.map(childEventCard).join('')}`).join('')}`;
}

const CHILD_GAMES = [
  {id:'learn', emoji:'🇬🇷', icon:'u-book', titleKey:'gameLearn', hintKey:'gameLearnHint', tint:'#0d9488', featured:true, xp:10},
  {id:'quiz', emoji:'🧠', icon:'u-sparkle', titleKey:'gameQuiz', hintKey:'gameQuizHint', tint:'#2a6b52', featured:true, xp:8},
  {id:'math', emoji:'➕', icon:'u-plus', titleKey:'gameMath', hintKey:'gameMathHint', tint:'#c2410c', featured:true, xp:6},
  {id:'island', emoji:'🏝️', icon:'u-leaf', titleKey:'gameIsland', hintKey:'gameIslandHint', tint:'#0e7490', featured:true, xp:8},
  {id:'eduhub', emoji:'🎓', icon:'u-book', titleKey:'gameEduHub', hintKey:'gameEduHubHint', tint:'#0369a1', featured:true},
  {id:'memory', emoji:'🃏', titleKey:'gameMemory', hintKey:'gameMemoryHint', tint:'#0f766e', xp:5},
  {id:'tac', emoji:'❌', titleKey:'gameTac', hintKey:'gameTacHint', tint:'#c2410c', xp:4},
  {id:'catch', emoji:'🐟', titleKey:'gameCatch', hintKey:'gameCatchHint', tint:'#0369a1', xp:5},
  {id:'react', emoji:'⚡', icon:'u-clock', titleKey:'gameReact', hintKey:'gameReactHint', tint:'#2a6b52'},
  {id:'rps', emoji:'✊', titleKey:'gameRps', hintKey:'gameRpsHint', tint:'#be185d'},
  {id:'dice', emoji:'🎲', titleKey:'gameDice', hintKey:'gameDiceHint', tint:'#0f766e'},
  {id:'simon', emoji:'🎵', icon:'u-party', titleKey:'gameSimon', hintKey:'gameSimonHint', tint:'#b45309', xp:6},
  {id:'colors', emoji:'🎨', icon:'u-sparkle', titleKey:'gameColors', hintKey:'gameColorsHint', tint:'#2a6b52'},
];
const MEMORY_EMOJIS = ['🌊','☀️','🐚','🐙','🐟','⭐','🍋','⛵'];
const CATCH_FISH = [
  {emoji:'🐟', pts:1, speed:1, size:1},
  {emoji:'🐠', pts:2, speed:1.25, size:.92},
  {emoji:'🐡', pts:3, speed:.75, size:1.15},
  {emoji:'🦈', pts:5, speed:1.55, size:1.2},
];
const SIMON_PADS = [
  {id:'r', cls:'r', labelKey:'gameColorRed'},
  {id:'g', cls:'g', labelKey:'gameColorGreen'},
  {id:'b', cls:'b', labelKey:'gameColorBlue'},
  {id:'y', cls:'y', labelKey:'gameColorYellow'},
];
const COLOR_OPTS = [
  {id:'red', hex:'#e11d48', labelKey:'gameColorRed'},
  {id:'green', hex:'#16a34a', labelKey:'gameColorGreen'},
  {id:'blue', hex:'#2f5a63', labelKey:'gameColorBlue'},
  {id:'yellow', hex:'#ca8a04', labelKey:'gameColorYellow'},
];

/** Allowlisted free educational embeds (PhET HTML5 — kid-safe STEM). */
const EDU_FREE_GAMES = [
  {id:'arith', emoji:'🔢', titleKey:'eduArith', url:'https://phet.colorado.edu/sims/html/arithmetic/latest/arithmetic_all.html'},
  {id:'frac', emoji:'🍕', titleKey:'eduFrac', url:'https://phet.colorado.edu/sims/html/fraction-matcher/latest/fraction-matcher_all.html'},
  {id:'color', emoji:'🌈', titleKey:'eduColor', url:'https://phet.colorado.edu/sims/html/color-vision/latest/color-vision_all.html'},
];

const ISLAND_STEPS = [
  {emoji:'⛵', de:{q:'Auf welcher Insel sind wir?', choices:['Thassos','Kreta','Sizilien','Mallorca'], a:0}, el:{q:'Σε ποιο νησί είμαστε;', choices:['Θάσος','Κρήτη','Σικελία','Μαγιόρκα'], a:0}},
  {emoji:'🌊', de:{q:'Welche Farbe hat oft das Ägäische Meer?', choices:['Blau','Braun','Rosa','Grau'], a:0}, el:{q:'Τι χρώμα έχει συχνά το Αιγαίο;', choices:['Μπλε','Καφέ','Ροζ','Γκρι'], a:0}},
  {emoji:'🫒', de:{q:'Welches typische griechische Öl kommt von Bäumen?', choices:['Olivenöl','Motoröl','Kokosöl','Fischöl'], a:0}, el:{q:'Ποιο ελληνικό λάδι βγαίνει από δέντρα;', choices:['Ελαιόλαδο','Λάδι μηχανής','Ινδοκάρυδο','Ψαρόλαδο'], a:0}},
  {emoji:'🐝', de:{q:'Was machen Bienen, das wir auf Joghurt essen?', choices:['Honig','Salz','Käse','Brot'], a:0}, el:{q:'Τι κάνουν οι μέλισσες που τρώμε με γιαούρτι;', choices:['Μέλι','Αλάτι','Τυρί','Ψωμί'], a:0}},
  {emoji:'🏊', de:{q:'Was brauchst du vor dem Schwimmen?', choices:['Badekleidung','Ski','Ofen','Hammer'], a:0}, el:{q:'Τι χρειάζεσαι πριν κολυμπήσεις;', choices:['Μαγιό','Σκι','Φούρνο','Σφυρί'], a:0}},
  {emoji:'🇬🇷', de:{q:'Wie heißt „Danke“ auf Griechisch?', choices:['Ευχαριστώ','Γεια','Νερό','Όχι'], a:0}, el:{q:'Πώς λέμε «Danke» στα ελληνικά;', choices:['Ευχαριστώ','Hallo','Wasser','Nein'], a:0}},
  {emoji:'☀️', de:{q:'Warum Sonnencreme am Strand?', choices:['Haut schützen','Damit es regnet','Damit Schuhe glänzen','Zum Fliegen'], a:0}, el:{q:'Γιατί αντηλιακό στην παραλία;', choices:['Να προστατεύσουμε το δέρμα','Να βρέξει','Να γυαλίσουν παπούτσια','Να πετάξουμε'], a:0}},
  {emoji:'⭐', de:{q:'Was bedeutet Ruhe im Spa / Haus?', choices:['Leise & freundlich','Laut schreien','Rennen drinnen','Türen knallen'], a:0}, el:{q:'Τι σημαίνει ησυχία στο spa;', choices:['Ήσυχα & φιλικά','Να φωνάζουμε','Να τρέχουμε μέσα','Να χτυπάμε πόρτες'], a:0}},
];

const LEARN_VOCAB = [
  {de:'Hallo', el:'Γεια', emoji:'👋', topic:'greetings'},
  {de:'Guten Morgen', el:'Καλημέρα', emoji:'🌅', topic:'greetings'},
  {de:'Gute Nacht', el:'Καληνύχτα', emoji:'🌙', topic:'greetings'},
  {de:'Danke', el:'Ευχαριστώ', emoji:'🙏', topic:'greetings'},
  {de:'Bitte', el:'Παρακαλώ', emoji:'🤝', topic:'greetings'},
  {de:'Ja', el:'Ναι', emoji:'✅', topic:'basics'},
  {de:'Nein', el:'Όχι', emoji:'❌', topic:'basics'},
  {de:'Wasser', el:'Νερό', emoji:'💧', topic:'food'},
  {de:'Brot', el:'Ψωμί', emoji:'🍞', topic:'food'},
  {de:'Milch', el:'Γάλα', emoji:'🥛', topic:'food'},
  {de:'Obst', el:'Φρούτα', emoji:'🍎', topic:'food'},
  {de:'Fisch', el:'Ψάρι', emoji:'🐟', topic:'food'},
  {de:'Meer', el:'Θάλασσα', emoji:'🌊', topic:'beach'},
  {de:'Strand', el:'Παραλία', emoji:'🏖️', topic:'beach'},
  {de:'Sonne', el:'Ήλιος', emoji:'☀️', topic:'nature'},
  {de:'Baum', el:'Δέντρο', emoji:'🌳', topic:'nature'},
  {de:'Blume', el:'Λουλούδι', emoji:'🌸', topic:'nature'},
  {de:'Hund', el:'Σκύλος', emoji:'🐶', topic:'animals'},
  {de:'Katze', el:'Γάτα', emoji:'🐱', topic:'animals'},
  {de:'Vogel', el:'Πουλί', emoji:'🐦', topic:'animals'},
  {de:'Rot', el:'Κόκκινο', emoji:'🔴', topic:'colors'},
  {de:'Blau', el:'Μπλε', emoji:'🔵', topic:'colors'},
  {de:'Grün', el:'Πράσινο', emoji:'🟢', topic:'colors'},
  {de:'Gelb', el:'Κίτρινο', emoji:'🟡', topic:'colors'},
  {de:'Eins', el:'Ένα', emoji:'1️⃣', topic:'numbers'},
  {de:'Zwei', el:'Δύο', emoji:'2️⃣', topic:'numbers'},
  {de:'Drei', el:'Τρία', emoji:'3️⃣', topic:'numbers'},
  {de:'Mama', el:'Μαμά', emoji:'👩', topic:'family'},
  {de:'Papa', el:'Μπαμπάς', emoji:'👨', topic:'family'},
  {de:'Freund', el:'Φίλος', emoji:'😊', topic:'family'},
  {de:'Haus', el:'Σπίτι', emoji:'🏠', topic:'home'},
  {de:'Tür', el:'Πόρτα', emoji:'🚪', topic:'home'},
  {de:'Bett', el:'Κρεβάτι', emoji:'🛏️', topic:'home'},
  {de:'Schwimmen', el:'Κολυμπάω', emoji:'🏊', topic:'spa'},
  {de:'Spaß', el:'Διασκέδαση', emoji:'🎉', topic:'spa'},
  {de:'Ruhe', el:'Ησυχία', emoji:'🤫', topic:'spa'},
  {de:'Thassos', el:'Θάσος', emoji:'🏝️', topic:'thassos'},
  {de:'Griechenland', el:'Ελλάδα', emoji:'🇬🇷', topic:'thassos'},
  {de:'Heute', el:'Σήμερα', emoji:'📅', topic:'time'},
  {de:'Morgen', el:'Αύριο', emoji:'⏭️', topic:'time'},
  {de:'Ich habe Hunger', el:'Πεινάω', emoji:'🍽️', topic:'phrases'},
  {de:'Ich bin müde', el:'Είμαι κουρασμένος', emoji:'😴', topic:'phrases'},
  {de:'Wie geht\'s?', el:'Τι κάνεις;', emoji:'💬', topic:'phrases'},
  {de:'Gut', el:'Καλά', emoji:'👍', topic:'basics'},
  {de:'Schön', el:'Όμορφο', emoji:'✨', topic:'basics'},
  {de:'Buch', el:'Βιβλίο', emoji:'📖', topic:'school'},
  {de:'Spiel', el:'Παιχνίδι', emoji:'🎮', topic:'school'},
  {de:'Musik', el:'Μουσική', emoji:'🎵', topic:'school'},
];

const QUIZ_BANK = [
  {topic:'nature', de:{q:'Welches Tier lebt im Meer?', choices:['Hai','Hund','Katze','Kuh'], a:0}, el:{q:'Ποιο ζώο ζει στη θάλασσα;', choices:['Καρχαρίας','Σκύλος','Γάτα','Αγελάδα'], a:0}},
  {topic:'nature', de:{q:'Was brauchen Pflanzen zum Wachsen?', choices:['Sonne & Wasser','Schokolade','Fernseher','Auto'], a:0}, el:{q:'Τι χρειάζονται τα φυτά για να μεγαλώσουν;', choices:['Ήλιο & νερό','Σοκολάτα','Τηλεόραση','Αυτοκίνητο'], a:0}},
  {topic:'nature', de:{q:'Welche Farbe hat der Himmel oft an einem klaren Tag?', choices:['Blau','Grün','Braun','Rosa'], a:0}, el:{q:'Τι χρώμα έχει συχνά ο ουρανός σε καθαρή μέρα;', choices:['Μπλε','Πράσινο','Καφέ','Ροζ'], a:0}},
  {topic:'greece', de:{q:'In welchem Land liegt Thassos?', choices:['Griechenland','Frankreich','Schweden','Ägypten'], a:0}, el:{q:'Σε ποια χώρα βρίσκεται η Θάσος;', choices:['Ελλάδα','Γαλλία','Σουηδία','Αίγυπτος'], a:0}},
  {topic:'greece', de:{q:'Was ist die Hauptstadt von Griechenland?', choices:['Athen','Rom','Berlin','Madrid'], a:0}, el:{q:'Ποια είναι η πρωτεύουσα της Ελλάδας;', choices:['Αθήνα','Ρώμη','Βερολίνο','Μαδρίτη'], a:0}},
  {topic:'greece', de:{q:'Welches Meer umgibt die griechischen Inseln?', choices:['Mittelmeer','Ostsee','Nordsee','Kaspisches Meer'], a:0}, el:{q:'Ποια θάλασσα περιβάλλει τα ελληνικά νησιά;', choices:['Μεσόγειος','Βαλτική','Βόρεια θάλασσα','Κασπία'], a:0}},
  {topic:'greece', de:{q:'Was isst man oft in Griechenland zum Frühstück mit Joghurt?', choices:['Honig','Eiswürfel','Senf','Popcorn'], a:0}, el:{q:'Τι τρώμε συχνά στην Ελλάδα με γιαούρτι;', choices:['Μέλι','Παγάκια','Μουστάρδα','Ποπ κορν'], a:0}},
  {topic:'spa', de:{q:'Was sollte man vor dem Schwimmen anziehen?', choices:['Badehose / Badeanzug','Winterjacke','Skihelm','Stiefel'], a:0}, el:{q:'Τι φοράμε πριν κολυμπήσουμε;', choices:['Μαγιό','Χειμωνιάτικο μπουφάν','Κράνος σκι','Μπότες'], a:0}},
  {topic:'spa', de:{q:'Warum trinkt man Wasser bei Hitze?', choices:['Damit man nicht dehydriert','Damit die Schuhe glänzen','Damit man fliegt','Damit es regnet'], a:0}, el:{q:'Γιατί πίνουμε νερό στη ζέστη;', choices:['Για να μην αφυδατωθούμε','Για να γυαλίζουν τα παπούτσια','Για να πετάξουμε','Για να βρέξει'], a:0}},
  {topic:'spa', de:{q:'Was bedeutet Ruhe im Spa?', choices:['Leise sein und entspannen','Laut schreien','Rennen','Ball spielen drinnen'], a:0}, el:{q:'Τι σημαίνει ησυχία στο spa;', choices:['Να είμαστε ήσυχοι και να χαλαρώνουμε','Να φωνάζουμε','Να τρέχουμε','Να παίζουμε μπάλα μέσα'], a:0}},
  {topic:'general', de:{q:'Wie viele Stunden hat ein Tag?', choices:['24','10','7','100'], a:0}, el:{q:'Πόσες ώρες έχει η μέρα;', choices:['24','10','7','100'], a:0}},
  {topic:'general', de:{q:'Welche Zahl kommt nach 9?', choices:['10','8','11','90'], a:0}, el:{q:'Ποιος αριθμός έρχεται μετά το 9;', choices:['10','8','11','90'], a:0}},
  {topic:'general', de:{q:'Was benutzt man zum Lesen?', choices:['Augen','Ohren nur','Füße','Ellbogen'], a:0}, el:{q:'Τι χρησιμοποιούμε για διάβασμα;', choices:['Μάτια','Μόνο αυτιά','Πόδια','Αγκώνες'], a:0}},
  {topic:'general', de:{q:'Welches Werkzeug hilft beim Schneiden von Papier?', choices:['Schere','Hammer','Löffel','Kissen'], a:0}, el:{q:'Τι βοηθάει να κόψουμε χαρτί;', choices:['Ψαλίδι','Σφυρί','Κουτάλι','Μαξιλάρι'], a:0}},
  {topic:'nature', de:{q:'Was fällt im Herbst oft von Bäumen?', choices:['Blätter','Autos','Häuser','Wolken'], a:0}, el:{q:'Τι πέφτει συχνά από τα δέντρα το φθινόπωρο;', choices:['Φύλλα','Αυτοκίνητα','Σπίτια','Σύννεφα'], a:0}},
  {topic:'greece', de:{q:'Welches Alphabet nutzt Griechisch?', choices:['Griechisches Alphabet','Nur Emojis','Nur Zahlen','Runen'], a:0}, el:{q:'Ποιο αλφάβητο χρησιμοποιεί η ελληνική;', choices:['Ελληνικό αλφάβητο','Μόνο emoji','Μόνο αριθμούς','Ρούνες'], a:0}},
  {topic:'general', de:{q:'Was ist 2 + 2?', choices:['4','3','5','22'], a:0}, el:{q:'Πόσο κάνει 2 + 2;', choices:['4','3','5','22'], a:0}},
  {topic:'spa', de:{q:'Wo spielt man oft Ballspiele draußen?', choices:['Im Garten / Hof','Im Bett','Im Kühlschrank','Unter Wasser ohne Luft'], a:0}, el:{q:'Πού παίζουμε συχνά μπάλα έξω;', choices:['Στον κήπο / αυλή','Στο κρεβάτι','Στο ψυγείο','Κάτω από το νερό χωρίς αέρα'], a:0}},
];

function shuffleInPlace(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function gameBestKey(id){ return `paidia.game.best.${id}`; }
function gameHistKey(id){ return `paidia.game.hist.${id}`; }
function readGameBest(id){
  try{ return Number(localStorage.getItem(gameBestKey(id)))||0; }catch{ return 0; }
}
function writeGameBest(id, score){
  const prev=readGameBest(id);
  if(score>prev){
    try{ localStorage.setItem(gameBestKey(id), String(score)); }catch{}
    return score;
  }
  return prev;
}
function readGameHistory(id){
  try{
    const raw = JSON.parse(localStorage.getItem(gameHistKey(id))||'[]');
    return Array.isArray(raw) ? raw.map(Number).filter(n=>Number.isFinite(n)).slice(-8) : [];
  }catch{ return []; }
}
function pushGameHistory(id, value){
  const n = Number(value);
  if(!Number.isFinite(n)) return;
  const list = readGameHistory(id);
  list.push(n);
  try{ localStorage.setItem(gameHistKey(id), JSON.stringify(list.slice(-8))); }catch{}
}

const LEARN_SESSION = 20;
const QUIZ_SESSION = 14;
const LEARN_TOPICS = [
  {id:'all', key:'gameLearnTopicAll'},
  {id:'greetings', key:'gameLearnTopicGreet'},
  {id:'food', key:'gameLearnTopicFood'},
  {id:'beach', key:'gameLearnTopicBeach'},
  {id:'nature', key:'gameLearnTopicNature'},
  {id:'thassos', key:'gameLearnTopicBeach'},
];
const LEARN_WEAK_KEY = 'paidia.learn.weak';
const LEARN_TOPIC_KEY = 'paidia.learn.topic';

function readLearnWeak(){
  try{
    const raw = JSON.parse(localStorage.getItem(LEARN_WEAK_KEY)||'[]');
    return Array.isArray(raw) ? raw.filter(c=>c&&c.de&&c.el).slice(0,40) : [];
  }catch{ return []; }
}
function pushLearnWeak(card){
  if(!card?.de || !card?.el) return;
  const list = readLearnWeak().filter(c=>!(c.de===card.de && c.el===card.el));
  list.unshift({de:card.de, el:card.el, emoji:card.emoji||'🇬🇷', topic:card.topic||'misc'});
  try{ localStorage.setItem(LEARN_WEAK_KEY, JSON.stringify(list.slice(0,40))); }catch{}
}
function readLearnTopic(){
  try{ return localStorage.getItem(LEARN_TOPIC_KEY)||'all'; }catch{ return 'all'; }
}
function writeLearnTopic(topic){
  try{ localStorage.setItem(LEARN_TOPIC_KEY, topic||'all'); }catch{}
}

function setGameCoach(patch){
  state.gameCoach = {...(state.gameCoach||{}), ...patch, at: Date.now()};
}

function gameShareBar(stars, scoreText){
  return `<div class="game-banner win learn-win pop-in"><div><div class="game-stars">${t('gameStars')(stars)}</div>${esc(scoreText)}</div>
    <div class="game-win-actions">
      <button class="btn" type="button" id="gameAgain">${t('gameAgain')}</button>
      <button class="btn sec" type="button" id="gameShareMoment">📸 ${esc(t('gameShareMoment'))}</button>
    </div></div>`;
}

function gameMomentSticker(emoji, title, detail){
  const c = document.createElement('canvas');
  c.width = 720; c.height = 900;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0,0,720,900);
  g.addColorStop(0,'#0f766e'); g.addColorStop(.55,'#0369a1'); g.addColorStop(1,'#c2410c');
  ctx.fillStyle = g; ctx.fillRect(0,0,720,900);
  ctx.fillStyle = 'rgba(255,255,255,.12)';
  ctx.beginPath(); ctx.arc(560,140,160,0,Math.PI*2); ctx.fill();
  ctx.font = '120px serif'; ctx.textAlign = 'center';
  ctx.fillText(emoji||'⭐', 360, 340);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 42px system-ui,sans-serif';
  ctx.fillText(String(title||'Armonia').slice(0,28), 360, 460);
  ctx.font = '28px system-ui,sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.fillText(String(detail||'').slice(0,40), 360, 520);
  ctx.font = 'bold 22px system-ui,sans-serif';
  ctx.fillStyle = '#fed7aa';
  ctx.fillText('Armonia · Momente', 360, 820);
  return c.toDataURL('image/jpeg', 0.82);
}

function sheetGameShareMoment(){
  const meta = CHILD_GAMES.find(g=>g.id===state.gameId) || {emoji:'⭐', titleKey:'gamesTitle'};
  const g = state.game || {};
  const title = t(meta.titleKey);
  let detail = '';
  if(state.gameId==='learn') detail = `${g.xp||0} XP`;
  else if(state.gameId==='quiz' || state.gameId==='math' || state.gameId==='catch' || state.gameId==='island') detail = `${g.score||0} ${t('gameScore')}`;
  else if(state.gameId==='memory') detail = `${g.moves||0} ${t('gameMoves')}`;
  else if(state.gameId==='simon') detail = `${t('gameLevel')} ${g.level||0}`;
  else detail = t('gameWin');
  const photo = gameMomentSticker(meta.emoji, title, detail);
  const draft = state.lang==='el'
    ? `Νίκησα στο ${title}! ${detail}`
    : `Gewonnen bei ${title}! ${detail}`;
  sheetGalleryCompose({photo, caption:draft, topic:title, game:state.gameId});
}

function pickLearnDeck(pool, n, topic){
  let src=[...(pool||LEARN_VOCAB)];
  if(topic && topic!=='all' && topic!=='weak'){
    const filtered = src.filter(c=>c.topic===topic);
    if(filtered.length>=4) src = filtered;
  }
  shuffleInPlace(src);
  return src.slice(0, Math.min(n, src.length)).map(c=>({...c, source:c.source||'local'}));
}

function learnWrongChoices(card, mode, pool){
  const key = mode==='de2el' ? 'el' : 'de';
  const right = card[key];
  const distractors = shuffleInPlace(
    pool.filter(c=>c[key] && c[key]!==right).map(c=>c[key])
  ).slice(0, 3);
  while(distractors.length<3){
    const filler = LEARN_VOCAB.find(c=>c[key] && c[key]!==right && !distractors.includes(c[key]));
    if(!filler) break;
    distractors.push(filler[key]);
  }
  const choices = shuffleInPlace([right, ...distractors.slice(0,3)]);
  return {choices, correct: choices.indexOf(right)};
}

function learnCardHint(card, mode){
  if(!card) return '';
  if(mode==='de2el'){
    return card.hint_el || card.hint_de || (card.el ? `${card.el.slice(0,1)}…` : '');
  }
  return card.hint_de || card.hint_el || (card.de ? `${card.de.slice(0,1)}…` : '');
}

function buildLearnRound(g){
  const card = g.deck[g.i];
  if(!card){ g.finished=true; return; }
  const built = learnWrongChoices(card, g.mode, g.deck.length>4?g.deck:LEARN_VOCAB);
  g.prompt = g.mode==='de2el' ? card.de : card.el;
  g.answerLang = g.mode==='de2el' ? 'el' : 'de';
  g.choices = built.choices;
  g.correct = built.correct;
  g.feedback = null;
  g.lock = false;
  g.card = card;
  g.flipKey = (g.flipKey||0)+1;
}

function makeLearnGame(mode, deck, topic){
  const g = {
    mode: mode==='el2de'?'el2de':'de2el',
    deck: deck||pickLearnDeck(LEARN_VOCAB, LEARN_SESSION, topic||readLearnTopic()),
    topic: topic||readLearnTopic()||'all',
    i:0, xp:0, streak:0, hearts:3, finished:false, loading:false,
    prompt:'', choices:[], correct:0, feedback:null, lock:false, card:null, flipKey:0,
  };
  buildLearnRound(g);
  setGameCoach({gameId:'learn', streak:0, topic:g.topic, hearts:3});
  return g;
}

function answerLearn(choiceIdx){
  const g=state.game; if(!g || g.lock || g.finished || state.gameId!=='learn') return;
  g.lock=true;
  const ok = choiceIdx===g.correct;
  if(ok){
    g.xp += 10 + Math.min(20, g.streak*2);
    g.streak += 1;
    g.feedback = {ok:true, text:t('gameLearnCorrect')};
    setGameCoach({gameId:'learn', streak:g.streak, lastWrong:null, xp:g.xp});
    feedback('save');
  }else{
    g.hearts = Math.max(0, g.hearts-1);
    g.streak = 0;
    const right = g.choices[g.correct];
    const hint = learnCardHint(g.card, g.mode);
    pushLearnWeak(g.card);
    g.feedback = {
      ok:false,
      text:`${t('gameLearnWrong')} ${right}`,
      hint: hint ? `${t('gameLearnHintLabel')}: ${hint}` : '',
      pick:choiceIdx,
      heartBreak:true,
    };
    setGameCoach({
      gameId:'learn', streak:0, hearts:g.hearts,
      lastWrong:{prompt:g.prompt, answer:right, hint, de:g.card?.de, el:g.card?.el},
    });
    feedback('error');
  }
  render();
  g._cpu = setTimeout(()=>{
    if(!state.game || state.gameId!=='learn') return;
    const gg=state.game;
    if(gg.hearts<=0){
      gg.finished=true; gg.lock=false;
      writeGameBest('learn', gg.xp);
      render(); return;
    }
    gg.i += 1;
    if(gg.i >= gg.deck.length){
      gg.finished=true; gg.lock=false;
      writeGameBest('learn', gg.xp);
      tryGrantGameWin('learn', gg, gg.hearts>0);
      render(); return;
    }
    buildLearnRound(gg);
    render();
  }, ok?650:1300);
}

async function fetchLearnAiCards(){
  const g=state.game; if(!g || state.gameId!=='learn' || g.loading) return;
  g.loading=true; render();
  try{
    const topic = g.topic && g.topic!=='all' && g.topic!=='weak' ? g.topic : 'random';
    const response = await fetch('/api/learn', {
      method:'POST', credentials:'same-origin',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        count:12,
        topic,
        level:'easy',
        seed: Math.random().toString(36).slice(2,10),
      }),
    });
    const data = await response.json().catch(()=>({}));
    if(!response.ok || !Array.isArray(data.cards) || !data.cards.length){
      throw new Error(data.error||'learn failed');
    }
    const cards = data.cards.map(c=>({
      de:String(c.de||'').trim(),
      el:String(c.el||'').trim(),
      emoji:String(c.emoji||'🇬🇷').trim()||'🇬🇷',
      topic:String(c.topic||'ai').trim()||'ai',
      hint_de:String(c.hint_de||'').trim(),
      hint_el:String(c.hint_el||'').trim(),
      source:'ai',
    })).filter(c=>c.de && c.el);
    if(cards.length<3) throw new Error('too few');
    stopChildGameTimers();
    state.game = makeLearnGame(g.mode, cards, g.topic);
    feedback('save');
    toast(t('gameLearnAi'), 'success');
  }catch{
    if(state.game && state.gameId==='learn'){
      state.game.loading=false;
      toast(t('gameLearnAiFail'), 'error');
      render();
    }
  }
}

function makeQuizGame(deck){
  const pool = deck && deck.length
    ? deck.slice(0, QUIZ_SESSION)
    : shuffleInPlace([...QUIZ_BANK]).slice(0, QUIZ_SESSION);
  const g = {deck:pool, i:0, score:0, streak:0, finished:false, lock:false, feedback:null, choices:[], correct:0, q:null, loading:false};
  buildQuizRound(g);
  setGameCoach({gameId:'quiz', streak:0, score:0});
  return g;
}

function buildQuizRound(g){
  const item = g.deck[g.i];
  if(!item){ g.finished=true; return; }
  const loc = state.lang==='el' ? item.el : item.de;
  const order = [0,1,2,3];
  shuffleInPlace(order);
  g.q = loc.q;
  g.topic = item.topic;
  g.choices = order.map(i=>loc.choices[i]);
  g.correct = order.indexOf(loc.a);
  g.feedback = null;
  g.lock = false;
}

function answerQuiz(choiceIdx){
  const g=state.game; if(!g || g.lock || g.finished || state.gameId!=='quiz') return;
  g.lock=true;
  const ok = choiceIdx===g.correct;
  if(ok){
    g.score += 10 + Math.min(15, g.streak*2);
    g.streak += 1;
    g.feedback = {ok:true};
    setGameCoach({gameId:'quiz', streak:g.streak, score:g.score, lastWrong:null});
    feedback('save');
  }else{
    g.streak = 0;
    g.feedback = {ok:false, pick:choiceIdx};
    setGameCoach({
      gameId:'quiz', streak:0, score:g.score,
      lastWrong:{q:g.q, answer:g.choices[g.correct], topic:g.topic},
    });
    feedback('error');
  }
  render();
  g._cpu = setTimeout(()=>{
    if(!state.game || state.gameId!=='quiz') return;
    const gg=state.game;
    gg.i += 1;
    if(gg.i >= gg.deck.length){
      gg.finished=true; gg.lock=false;
      writeGameBest('quiz', gg.score);
      tryGrantGameWin('quiz', gg, gg.score>=50);
      render(); return;
    }
    buildQuizRound(gg);
    render();
  }, ok?550:950);
}

async function fetchQuizAiRound(){
  const g=state.game; if(!g || state.gameId!=='quiz' || g.loading) return;
  g.loading=true; render();
  try{
    const response = await fetch('/api/quiz', {
      method:'POST', credentials:'same-origin',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        count: QUIZ_SESSION,
        topic:'mixed',
        seed: Math.random().toString(36).slice(2,10),
      }),
    });
    const data = await response.json().catch(()=>({}));
    if(!response.ok || !Array.isArray(data.questions) || !data.questions.length){
      throw new Error(data.error||'quiz failed');
    }
    stopChildGameTimers();
    state.game = makeQuizGame(data.questions);
    feedback('save');
    toast(t('gameLearnAi'), 'success');
  }catch{
    if(state.game && state.gameId==='quiz'){
      state.game.loading=false;
      toast(t('gameLearnAiFail'), 'error');
      render();
    }
  }
}

function mathRanges(level){
  if(level>=3) return {add:28, sub:24, mul:12};
  if(level===2) return {add:20, sub:16, mul:9};
  return {add:12, sub:10, mul:6};
}

function makeMathGame(){
  const g = {
    score:0, left:75, lives:3, level:1, solved:0, streak:0,
    finished:false, lock:false, feedback:null, prompt:'', choices:[], correct:0,
    comboBurst:false, _timer:null,
  };
  nextMathRound(g);
  setGameCoach({gameId:'math', level:1, lives:3, streak:0});
  return g;
}

function nextMathRound(g){
  const r = mathRanges(g.level||1);
  const ops = g.level>=3 ? ['+','-','×'] : g.level===2 ? ['+','-','×'] : ['+','-'];
  const op = ops[Math.floor(Math.random()*ops.length)];
  let a, b, ans;
  if(op==='+'){
    a = 2+Math.floor(Math.random()*r.add);
    b = 2+Math.floor(Math.random()*r.add);
    ans = a+b;
  }else if(op==='-'){
    a = 5+Math.floor(Math.random()*r.sub);
    b = 1+Math.floor(Math.random()*Math.min(r.sub-2,a-1));
    ans = a-b;
  }else{
    a = 2+Math.floor(Math.random()*r.mul);
    b = 2+Math.floor(Math.random()*r.mul);
    ans = a*b;
  }
  const distractors = new Set();
  while(distractors.size<3){
    const delta = (Math.floor(Math.random()*7)-3) || 2;
    const wrong = Math.max(0, ans+delta+(Math.random()>0.5?1:-1)*Math.floor(Math.random()*4));
    if(wrong!==ans) distractors.add(wrong);
  }
  const choices = shuffleInPlace([ans, ...distractors]);
  g.prompt = `${a} ${op} ${b}`;
  g.choices = choices;
  g.correct = choices.indexOf(ans);
  g.feedback = null;
  g.lock = false;
  g.comboBurst = false;
}

function answerMath(choiceIdx){
  const g=state.game; if(!g || g.lock || g.finished || state.gameId!=='math') return;
  g.lock=true;
  const ok = choiceIdx===g.correct;
  if(ok){
    g.score += 5 + Math.min(20, g.streak*2) + (g.level||1)*2;
    g.streak += 1;
    g.solved = (g.solved||0)+1;
    if(g.solved%6===0 && g.level<3) g.level += 1;
    g.feedback = {ok:true};
    g.comboBurst = g.streak>=3;
    g.left = Math.min(90, g.left + (g.streak>=4?1:0));
    setGameCoach({gameId:'math', streak:g.streak, level:g.level, lives:g.lives, score:g.score, lastWrong:null});
    feedback('save');
  }else{
    g.streak = 0;
    g.lives = Math.max(0, (g.lives||1)-1);
    g.feedback = {ok:false, pick:choiceIdx};
    setGameCoach({
      gameId:'math', streak:0, level:g.level, lives:g.lives, score:g.score,
      lastWrong:{prompt:g.prompt, answer:g.choices[g.correct]},
    });
    feedback('error');
  }
  render();
  g._cpu = setTimeout(()=>{
    if(!state.game || state.gameId!=='math' || state.game.finished) return;
    if(state.game.lives<=0){
      stopChildGameTimers();
      state.game.finished=true;
      state.game.lock=false;
      writeGameBest('math', state.game.score);
      tryGrantGameWin('math', state.game, state.game.score>=60);
      render();
      return;
    }
    nextMathRound(state.game);
    render();
  }, ok?400:800);
}

function stopChildGameTimers(){
  if(state.game?._timer){ clearInterval(state.game._timer); state.game._timer=null; }
  if(state.game?._cpu){ clearTimeout(state.game._cpu); state.game._cpu=null; }
  if(state.game?._raf){ cancelAnimationFrame(state.game._raf); state.game._raf=null; }
}

function startChildGame(id){
  stopChildGameTimers();
  state.gameId = id;
  if(id==='memory'){
    const deck = MEMORY_EMOJIS.flatMap((emoji,i)=>[
      {id:`a${i}`,emoji,pair:i,open:false,done:false,justMatched:false},
      {id:`b${i}`,emoji,pair:i,open:false,done:false,justMatched:false},
    ]);
    shuffleInPlace(deck);
    state.game = {moves:0, pairs:0, open:[], lock:false, deck, streak:0, finished:false};
  }else if(id==='tac'){
    state.game = {board:Array(9).fill(''), turn:'x', status:'play', winner:null, line:null};
  }else if(id==='catch'){
    state.game = {
      score:0, left:60, combo:0, bestCombo:0, finished:false, power:null,
      fish:[], splashes:[], _timer:null, _raf:null, _last:0, _spawn:0, _powerT:0,
    };
    setGameCoach({gameId:'catch', score:0, left:60});
  }else if(id==='react'){
    state.game = {phase:'idle', ms:null, best:readGameBest('react')||null, early:false, _cpu:null, startedAt:0};
  }else if(id==='rps'){
    state.game = {you:null, cpu:null, result:null, wins:0, losses:0, draws:0};
  }else if(id==='dice'){
    state.game = {value:null, rolling:false, history:[]};
  }else if(id==='simon'){
    state.game = {seq:[], input:[], phase:'idle', level:0, lit:null, finished:false};
  }else if(id==='colors'){
    state.game = {score:0, left:30, finished:false, target:null, choices:[], _timer:null};
    nextColorRound(state.game);
  }else if(id==='learn'){
    const topic = readLearnTopic();
    let deck;
    if(topic==='weak'){
      const weak = readLearnWeak();
      deck = weak.length>=4 ? pickLearnDeck(weak, LEARN_SESSION, 'all') : pickLearnDeck(LEARN_VOCAB, LEARN_SESSION, 'all');
    }else{
      deck = pickLearnDeck(LEARN_VOCAB, LEARN_SESSION, topic);
    }
    state.game = makeLearnGame('de2el', deck, topic);
  }else if(id==='quiz'){
    state.game = makeQuizGame();
  }else if(id==='math'){
    state.game = makeMathGame();
  }else if(id==='island'){
    state.game = makeIslandGame();
  }else if(id==='eduhub'){
    state.game = {embed:null};
  }else state.game = null;
  render();
}

function leaveChildGame(){
  stopChildGameTimers();
  state.gameId = null;
  state.game = null;
  if(state.mode==='child' && !['learn','games'].includes(state.childView))
    state.childView = 'games';
  render();
}

function gameStatsKey(kidId){ return kidId||'anon'; }
function loadGameStats(kidId){
  DB.gameStats ||= {};
  return DB.gameStats[gameStatsKey(kidId)] || {streak:0, lastDay:'', wins:0, xp:0};
}
function grantXp(kidId, choreId, xp, submissionId){
  if(!kidId || !xp) return;
  const log = DB.xpLog || (DB.xpLog=[]);
  log.push({
    id:'xp'+Date.now(), kidId, choreId:choreId||null, xp, submissionId:submissionId||null, ts:Date.now(),
  });
}
function grantGameXp(kidId, amount, gameId){
  if(!kidId || !amount) return;
  const stats = loadGameStats(kidId);
  const today = iso(new Date());
  stats.wins = (stats.wins||0)+1;
  stats.xp = (stats.xp||0)+amount;
  if(stats.lastDay !== today){
    const y = new Date(); y.setDate(y.getDate()-1);
    stats.streak = stats.lastDay === iso(y) ? (stats.streak||0)+1 : 1;
    stats.lastDay = today;
  }
  DB.gameStats[gameStatsKey(kidId)] = stats;
  grantXp(kidId, null, amount, 'game-'+gameId);
  save();
  toast(t('gameXpEarned')(amount),'success');
}
function tryGrantGameWin(gameId, g, pass){
  if(!g || !state.child || g.xpGranted || state.gameId!==gameId || !pass) return;
  const amt = CHILD_GAMES.find(x=>x.id===gameId)?.xp;
  if(!amt) return;
  g.xpGranted = true;
  grantGameXp(state.child.id, amt, gameId);
}

/* ── Reward & Chore helpers ── */
const XP_LEVELS = [0, 50, 120, 250, 450, 700, 1000, 1400, 1900, 2500];
function kidXp(kidId){
  return (DB.xpLog||[]).filter(x=>x.kidId===kidId).reduce((s,x)=>s+x.xp,0);
}
function kidLevel(xp){
  let lv=0;
  for(let i=0;i<XP_LEVELS.length;i++){ if(xp>=XP_LEVELS[i]) lv=i; }
  return lv;
}
function kidLevelName(lv){
  const names = t('levelNames');
  return names[Math.min(lv, names.length-1)];
}
function choreForKid(chore, kidId){
  if(!chore.kidIds || chore.kidIds.length===0) return true;
  return chore.kidIds.includes(kidId);
}
function choreLabel(ch){ return state.lang==='el' ? ch.el : ch.de; }
function choreDoneToday(choreId, kidId){
  const today = iso(new Date());
  return (DB.choreSubmissions||[]).some(s=>s.choreId===choreId && s.kidId===kidId && s.date===today && s.status==='approved');
}
function chorePendingToday(choreId, kidId){
  const today = iso(new Date());
  return (DB.choreSubmissions||[]).some(s=>s.choreId===choreId && s.kidId===kidId && s.date===today && s.status==='pending');
}

function progressRingHtml(pct, centerLabel, size=64){
  const p = Math.max(0, Math.min(100, Number(pct)||0));
  const r = 26, c = 2*Math.PI*r, off = c*(1-p/100);
  return `<svg class="progress-ring" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-label="${esc(String(centerLabel))}">
    <circle class="pr-track" cx="32" cy="32" r="${r}"/>
    <circle class="pr-fill" cx="32" cy="32" r="${r}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"/>
    <text class="pr-label" x="32" y="37" text-anchor="middle">${esc(String(centerLabel))}</text>
  </svg>`;
}
function levelMeterHtml(pct){
  const p = Math.max(0, Math.min(100, Number(pct)||0));
  return `<div class="level-meter" aria-hidden="true"><i style="width:${p}%"></i></div>`;
}
function widgetToneClass(tone){
  const t = String(tone||'').toLowerCase();
  if(t==='sea') return 'w-tone-sea';
  if(t==='amber' || t==='sun') return 'w-tone-amber';
  if(t==='pine' || t==='brand') return 'w-tone-pine';
  return '';
}
/** Conic progress ring — labelled when it is the only carrier of the number. */
function ringHtml(pct, label = '', tone = ''){
  if(pct===null || pct===undefined || pct==='') return '';
  const p = Math.max(0, Math.min(100, Number(pct)||0));
  const centre = label!=='' && label!=null ? String(label) : `${Math.round(p)}%`;
  const toneCls = widgetToneClass(tone);
  return `<div class="w-ring ${toneCls}" role="img" aria-label="${esc(centre)}" style="--w-pct:${p}">
    <span class="w-ring-label">${esc(centre)}</span>
  </div>`;
}
/** Inline SVG polyline — no axes. Empty input → ''. */
function sparklineHtml(values, tone = ''){
  if(!Array.isArray(values) || !values.length) return '';
  const nums = values.map(Number).filter(n=>Number.isFinite(n));
  if(!nums.length) return '';
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = max-min || 1;
  const w = 64, h = 28, pad = 2;
  const pts = nums.map((n,i)=>{
    const x = pad + (i/(Math.max(1, nums.length-1))) * (w-pad*2);
    const y = h-pad - ((n-min)/span) * (h-pad*2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const toneCls = widgetToneClass(tone);
  return `<svg class="w-spark ${toneCls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none" role="img" aria-label="${esc(String(nums[nums.length-1]))}"><polyline points="${pts}" fill="none" vector-effect="non-scaling-stroke"/></svg>`;
}
function statTileHtml(value, label, icon, trend){
  if(value===null || value===undefined || value==='') return '';
  const trendCls = trend==='up'?'up':trend==='down'?'down':'';
  const ico = icon ? ui(icon, 'sm') : '';
  return `<div class="w-stat" role="group" aria-label="${esc(String(label||''))}: ${esc(String(value))}">
    ${ico?`<span class="w-stat-ico" aria-hidden="true">${ico}</span>`:''}
    <b class="w-stat-val ${trendCls}">${esc(String(value))}</b>
    ${label?`<span class="w-stat-lbl">${esc(String(label))}</span>`:''}
  </div>`;
}
/** 7-cell week strip. `dates` = ISO strings with activity; `activeIso` highlights today. */
function miniCalendarHtml(dates, activeIso){
  if(!Array.isArray(dates)) return '';
  const set = new Set(dates.filter(Boolean));
  if(!set.size && !activeIso) return '';
  const cells=[];
  for(let i=6;i>=0;i--){
    const d = new Date(); d.setDate(d.getDate()-i);
    const key = iso(d);
    const on = set.has(key);
    const active = activeIso && key===activeIso;
    cells.push(`<i class="${on?'on':''}${active?' active':''}" title="${key}" aria-hidden="true">${d.getDate()}</i>`);
  }
  return `<div class="w-minical" role="img" aria-label="${esc(String(activeIso||''))}">${cells.join('')}</div>`;
}
function segmentedProgressHtml(done, total, wrongIdx=-1){
  const n = Math.max(1, Number(total)||1);
  const d = Math.max(0, Math.min(n, Number(done)||0));
  return `<div class="seg-progress" role="img" aria-label="${d}/${n}">${Array.from({length:n},(_,i)=>
    `<i class="${i<d?'on':''} ${i===wrongIdx?'bad':''}"></i>`).join('')}</div>`;
}
function kidXpDates(kidId){
  return [...new Set((DB.xpLog||[]).filter(x=>x.kidId===kidId && (x.ts||x.at))
    .map(x=>iso(new Date(x.ts||x.at))))].sort();
}
function kidStreakDays(kidId){
  const dates = kidXpDates(kidId);
  if(!dates.length) return 0;
  let streak=0;
  let cursor = iso(new Date());
  const set = new Set(dates);
  // Allow streak to count if yesterday was last activity (miss today still OK until end of day? Figma shows consecutive days with activity)
  if(!set.has(cursor)){
    const y = new Date(); y.setDate(y.getDate()-1);
    cursor = iso(y);
  }
  while(set.has(cursor)){
    streak++;
    const d = new Date(cursor+'T12:00:00');
    d.setDate(d.getDate()-1);
    cursor = iso(d);
  }
  return streak;
}
function kidWeekXpDelta(kidId){
  const start = new Date(); start.setDate(start.getDate()-6); start.setHours(0,0,0,0);
  return (DB.xpLog||[]).filter(x=>x.kidId===kidId && (x.ts||x.at) && new Date(x.ts||x.at)>=start)
    .reduce((s,x)=>s+(x.xp||0),0);
}
function kidStreakHtml(kidId){
  const dates = new Set(kidXpDates(kidId));
  const cells=[];
  for(let i=6;i>=0;i--){
    const d = new Date(); d.setDate(d.getDate()-i);
    const key = iso(d);
    cells.push(`<i class="${dates.has(key)?'on':''}" title="${key}">${d.getDate()}</i>`);
  }
  return `<div class="kid-streak" aria-label="${esc(t('kidStreak'))}">${cells.join('')}</div>`;
}
function svgUse(id, size=22){
  return `<svg class="i" width="${size}" height="${size}" aria-hidden="true"><use href="#${esc(id)}"/></svg>`;
}
const CHORE_SVG = {
  '🛏️':'i-chore-bed', '🧹':'i-chore-broom', '🍽️':'i-chore-dish', '🦷':'i-chore-tooth',
  '👟':'i-chore-shoe', '🌱':'i-chore-plant', '🐕':'i-chore-pet', '📚':'i-chore-book', '🛁':'i-chore-bath',
};
function choreIconSvg(ch, size=22){
  return svgUse(CHORE_SVG[ch?.emoji] || 'i-chore-check', size);
}
const KID_BADGES = [
  {id:'b1', xp:10, de:'Erster Stern', el:'Πρώτο αστέρι', ico:'i-star'},
  {id:'b2', xp:50, de:'Starter', el:'Starter', ico:'i-badge-seed'},
  {id:'b3', xp:120, de:'Entdecker', el:'Εξερευνητής', ico:'i-badge-compass'},
  {id:'b4', xp:250, de:'Held', el:'Ήρωας', ico:'i-badge-shield'},
  {id:'b5', xp:450, de:'Champion', el:'Πρωταθλητής', ico:'i-badge-trophy'},
  {id:'b6', xp:700, de:'Legende', el:'Θρύλος', ico:'i-badge-crown'},
  {id:'b7', xp:100, de:'Fleißig', el:'Εργατικός', ico:'i-badge-bolt'},
  {id:'b8', xp:200, de:'Team', el:'Ομάδα', ico:'i-badge-team'},
];
function kidBadgesHtml(xp){
  return `<div class="badge-grid">${KID_BADGES.map(b=>{
    const earned = xp >= b.xp;
    const name = state.lang==='el'?b.el:b.de;
    return `<div class="badge-tile ${earned?'':'locked'}" title="${esc(name)}">
      <span class="bt-ico" aria-hidden="true">${earned?svgUse(b.ico,22):svgUse('i-lock',20)}</span>
      <span class="bt-name">${esc(earned?name:t('kidBadgeLocked'))}</span>
    </div>`;
  }).join('')}</div>`;
}
function childLessonPast(entry, dateStr){
  const b = blockDef(entry.block); if(!b) return false;
  const today = iso(new Date());
  if(dateStr < today) return true;
  if(dateStr > today) return false;
  const [hh,mm] = String(b.to||'23:59').split(':').map(Number);
  const end = new Date(); end.setHours(hh||23, mm||59, 0, 0);
  return Date.now() > end.getTime();
}
function kidDockHtml(active){
  const items = [
    {id:'today', label:t('kidNavStart'), ico:'#i-kid-start'},
    {id:'plan', label:t('kidNavPlan'), ico:'#i-kid-plan'},
    {id:'learn', label:t('kidNavLearn'), ico:'#i-kid-learn'},
    {id:'rewards', label:t('kidNavStars'), ico:'#i-kid-stars'},
    {id:'games', label:t('kidNavGames'), ico:'#i-kid-games'},
  ];
  return `<nav class="kid-dock" aria-label="Kids">${items.map(it=>`
    <button type="button" class="${active===it.id?'on':''}" data-child-view="${it.id}">
      <svg class="i nav-ico" aria-hidden="true"><use href="${it.ico}"/></svg>
      <span>${esc(it.label)}</span>
    </button>`).join('')}</nav>`;
}

function childStartView(c){
  const today = iso(new Date());
  const dateStr = state.date || today;
  const xp = kidXp(c.id), lv = kidLevel(xp), lvName = kidLevelName(lv);
  const nextXp = XP_LEVELS[Math.min(lv+1, XP_LEVELS.length-1)];
  const curXp = XP_LEVELS[lv];
  const pct = lv >= XP_LEVELS.length-1 ? 100 : Math.round(((xp-curXp)/Math.max(1,nextXp-curXp))*100);
  const lessons = childEntriesFor(dateStr, c.id);
  const done = lessons.filter(e=>childLessonPast(e, dateStr)).length;
  const next = lessons.find(e=>!childLessonPast(e, dateStr));
  const dueChores = (DB.chores||[]).filter(ch=>choreForKid(ch,c.id) && ch.daily && !choreDoneToday(ch.id,c.id)).length;
  const lessonRows = lessons.length ? lessons.map(e=>{
    const past = childLessonPast(e, dateStr);
    const a = act(e.activityId);
    return `<div class="lesson-row">
      <span class="dot ${past?'':'open'}" aria-hidden="true"></span>
      <span class="tm">${esc(entryTime(e))}</span>
      <span class="nm">${esc(actLabel(e.activityId)||(a?L(a):''))}</span>
      ${past?`<span class="tick" aria-label="ok">✓</span>`:'<span></span>'}
    </div>`;
  }).join('') : emptyState(svgUse('i-empty-sun',28), t('nothingToday'), t('kidPlanTitle'),
    `<button type="button" class="btn sm" data-child-view="plan">${esc(t('kidNavPlan'))}</button>`);
  const nextHtml = next ? (()=>{
    const b = blockDef(next.block);
    const from = (b?.from||'--:--').slice(0,5);
    return `<div class="next-up">
      <div class="nu-ring">${esc(from)}</div>
      <div>
        <div class="eyebrow">${esc(t('kidNextUp'))}</div>
        <b>${esc(actLabel(next.activityId))}</b>
        <small>${esc(t('kidNextMeta')(30, 25))}</small>
      </div>
    </div>`;
  })() : '';
  return `
    <header class="kid-header tide-reveal">
      <p class="eyebrow">Armonia</p>
      <h2>${esc(t('kidHello')(c.name))}</h2>
      <p class="kid-hello">${esc(lvName)} · ${esc(t('xpLevel')(lv))}</p>
    </header>
    <section class="level-card">
      ${progressRingHtml(pct, lv)}
      <div class="level-copy">
        <div class="level-xp">${esc(t('kidXpOf')(xp, nextXp))}</div>
        <div class="level-next">${lv>=XP_LEVELS.length-1?'MAX':esc(t('kidXpRemain')(Math.max(0,nextXp-xp)))}</div>
        <div class="level-tag">${esc(t('kidLevelCard')(lv))}</div>
        ${levelMeterHtml(pct)}
      </div>
    </section>
    <section class="kid-panel">
      <div class="kid-panel-h"><b>${esc(t('kidTodayLessons'))}</b><span>${esc(t('kidLessonsDone')(done, lessons.length||0))}</span></div>
      ${lessonRows}
    </section>
    ${nextHtml}
    <div class="course-grid">
      <button type="button" class="course-tile" data-child-view="learn"><span class="bar"></span><b>${esc(t('kidCourseLearn'))}</b><span>${esc(t('kidLearnOpen')(1))}</span><div class="meter">${levelMeterHtml(55)}</div></button>
      <button type="button" class="course-tile sea" data-child-view="aufgaben"><span class="bar"></span><b>${esc(t('kidCourseTasks'))}</b><span>${esc(t('kidTasksDue')(dueChores))}</span><div class="meter">${levelMeterHtml(dueChores?40:100)}</div></button>
      <button type="button" class="course-tile sun" data-child-view="rewards"><span class="bar"></span><b>${esc(t('kidCourseStars'))}</b><span>${esc(t('kidStarsCollected')(xp))}</span><div class="meter">${levelMeterHtml(pct)}</div></button>
      <button type="button" class="course-tile out" data-child-view="games"><span class="bar"></span><b>${esc(t('kidCourseGames'))}</b><span>${esc(t('kidGamesPlay'))}</span><div class="meter">${levelMeterHtml(25)}</div></button>
    </div>
    <div class="kid-secondary">
      <button type="button" class="chip" data-child-view="rate">${esc(t('kidNavRate'))}</button>
      <button type="button" class="chip" data-child-view="bonus">${esc(t('kidBonusTitle'))}</button>
      <button type="button" class="chip" data-child-view="notes">${esc(t('kidNotesTitle'))}</button>
      <button type="button" class="chip" data-child-view="events">${esc(t('childEvents'))}</button>
      <button type="button" class="chip" data-child-view="gallery">${esc(t('galleryChildTab'))}</button>
      <button type="button" class="chip" id="childHowToBtn">${esc(t('childHowTo'))}</button>
    </div>
    ${teamNoticeBannerHtml()}
  `;
}

function childStundenplanView(c){
  const today = iso(new Date());
  const week = weekDates(state.date);
  const days = week.map(ds=>{
    const d = new Date(ds+'T12:00:00');
    const n = childEntriesFor(ds, c.id).length;
    return `<button type="button" class="sp-day ${ds===state.date?'on':''} ${ds===today?'today':''}" data-date="${ds}">
      <span class="d">${DAY_NAMES[state.lang][dowIdx(d)]}</span>
      <span class="n">${d.getDate()}</span>
      <span class="muted" style="font-size:9px">${n||''}</span>
    </button>`;
  }).join('');
  const list = childEntriesFor(state.date, c.id);
  const now = new Date();
  const nowMin = now.getHours()*60 + now.getMinutes();
  const blocks = list.length ? list.map((e,i)=>{
    const b = blockDef(e.block);
    const [fh,fm] = String(b?.from||'00:00').split(':').map(Number);
    const [th,tm] = String(b?.to||'23:59').split(':').map(Number);
    const start = fh*60+(fm||0), end = th*60+(tm||0);
    const isNow = state.date===today && nowMin>=start && nowMin<end;
    const nowPct = isNow ? Math.round(((nowMin-start)/Math.max(1,end-start))*100) : 0;
    return `<div class="sp-block" data-sp-i="${i}">
      <div class="when">${esc((b?.from||'').slice(0,5))}</div>
      <div class="slot ${isNow?'now':''}">
        ${isNow?`<div class="sp-now-line" style="top:${nowPct}%" aria-hidden="true"></div>`:''}
        <b>${esc(actLabel(e.activityId))}</b>
        <span>${esc(entryTime(e))}</span>
      </div>
    </div>`;
  }).join('') : emptyState(svgUse('i-kid-plan',28), t('nothingToday'));
  return `
    <header class="kid-header"><p class="eyebrow">Armonia</p><h2>${esc(t('kidPlanTitle'))}</h2></header>
    <div class="stundenplan">
      <div class="sp-week">${days}</div>
      <div class="sp-rail">${blocks}</div>
    </div>`;
}

/* ── Staff school / kids (v103–v104) ─────────────────────────────────── */
const DEFAULT_SUBJECTS = [
  {id:'sub-math', de:'Mathe', el:'Μαθηματικά', active:true},
  {id:'sub-de', de:'Deutsch', el:'Γερμανικά', active:true},
  {id:'sub-el', de:'Griechisch', el:'Ελληνικά', active:true},
  {id:'sub-en', de:'Englisch', el:'Αγγλικά', active:true},
  {id:'sub-sport', de:'Sport', el:'Αθλητισμός', active:true},
];

function ensureSchoolDb(){
  if(!Array.isArray(DB.subjects) || !DB.subjects.length) DB.subjects = structuredClone(DEFAULT_SUBJECTS);
  ['subjectGrades','attendance','homework','schoolTimetable','kidRatings','kidNotes'].forEach(k=>{
    if(!Array.isArray(DB[k])) DB[k] = [];
  });
}

function activeSubjects(){
  ensureSchoolDb();
  return (DB.subjects||[]).filter(s=>s && s.active!==false);
}

function subjectById(id){ return (DB.subjects||[]).find(s=>s.id===id); }

function subjectLabel(s){
  if(!s) return '?';
  return state.lang==='el' ? (s.el||s.de||s.id) : (s.de||s.el||s.id);
}

function matchKid(query){
  const q = norm(String(query||''));
  if(!q) return null;
  return (DB.children||[]).find(k=>norm(k.name)===q || norm(k.name).includes(q) || q.includes(norm(k.name)))
    || (DB.children||[]).find(k=>k.id===query);
}

function matchSubject(query){
  const q = norm(String(query||''));
  if(!q) return null;
  return activeSubjects().find(s=>norm(s.de)===q || norm(s.el)===q || s.id===query)
    || activeSubjects().find(s=>norm(s.de).includes(q) || norm(s.el).includes(q) || q.includes(norm(s.de)));
}

function subjectGradeFor(kidId, subjectId, week){
  const wk = week || kidWeekKey();
  const hit = (DB.subjectGrades||[]).find(g=>g.kidId===kidId && g.subjectId===subjectId && g.week===wk);
  return hit ? Number(hit.score)||0 : 0;
}

function setSubjectGrade(kidId, subjectId, score, note){
  ensureSchoolDb();
  const wk = kidWeekKey();
  const sc = Math.max(1, Math.min(5, Math.round(Number(score)||0)));
  if(!(sc>=1)) return false;
  const hit = DB.subjectGrades.find(g=>g.kidId===kidId && g.subjectId===subjectId && g.week===wk);
  if(hit){ hit.score=sc; hit.ts=Date.now(); if(note!=null) hit.note=String(note).slice(0,200); }
  else DB.subjectGrades.push({id:uid(), kidId, subjectId, score:sc, note:note?String(note).slice(0,200):'', week:wk, ts:Date.now()});
  return true;
}

function attendanceFor(kidId, dateStr){
  return (DB.attendance||[]).find(a=>a.kidId===kidId && a.date===dateStr);
}

function setAttendance(kidId, dateStr, status){
  ensureSchoolDb();
  const st = ['present','absent','excused'].includes(status) ? status : 'present';
  const hit = DB.attendance.find(a=>a.kidId===kidId && a.date===dateStr);
  if(hit){ hit.status=st; hit.ts=Date.now(); }
  else DB.attendance.push({id:uid(), kidId, date:dateStr, status:st, ts:Date.now()});
  return true;
}

function starsHtml(score, {interactive=false, kidId='', subjectId=''}={}){
  const s = Math.max(0, Math.min(5, Number(score)||0));
  const cells=[];
  for(let i=1;i<=5;i++){
    const on = i<=s;
    if(interactive){
      cells.push(`<button type="button" class="school-star ${on?'on':''}" data-grade-kid="${esc(kidId)}" data-grade-sub="${esc(subjectId)}" data-grade-val="${i}" aria-label="${i}">★</button>`);
    }else{
      cells.push(`<span class="school-star ${on?'on':''}" aria-hidden="true">★</span>`);
    }
  }
  return `<span class="school-stars" role="img" aria-label="${s}/5">${cells.join('')}</span>`;
}

function homeShiftCompletionPct(user){
  if(!user) return 0;
  const today=iso(new Date());
  const assign=dashboardAssignments(today,user.id);
  if(!assign.length) return 100;
  const done=assign.filter(e=>completionFor(today,e.id,user.id)).length;
  return Math.round((done/assign.length)*100);
}

function homeTaskDoneSpark7(user){
  if(!user) return [];
  const out=[];
  for(let i=6;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const ds=iso(d);
    const assign=dashboardAssignments(ds,user.id);
    out.push(assign.filter(e=>completionFor(ds,e.id,user.id)).length);
  }
  return out;
}

function planDayLoadPct(dateStr){
  const all=entriesFor(dateStr).filter(e=>!e.cancelled);
  const cap=Math.max(6, BLOCKS.length*2);
  return Math.min(100, Math.round((all.length/cap)*100));
}

function stockQtySparkHistory(hid){
  /* Optional: derive from recent OUT/IN log counts per day — omit if empty. */
  const days=[];
  for(let i=6;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const ds=iso(d);
    const n=(DB.log||[]).filter(L=>{
      if(!L || (L.type!=='IN' && L.type!=='OUT')) return false;
      const t=L.ts?iso(new Date(L.ts)): '';
      return t===ds && (!hid || hid==='all' || L.houseId===hid);
    }).length;
    days.push(n);
  }
  return days.some(n=>n>0) ? days : [];
}

function viewKids(){
  ensureSchoolDb();
  if(state.staffKidId) return viewKidProfile(state.staffKidId);
  const pane=state.kidsPane||'directory';
  const kids=(DB.children||[]).filter(k=>!k.temporary || true);
  const dir=kids.map(k=>{
    const xp=kidXp(k.id);
    const lv=kidLevel(xp);
    const att=attendanceFor(k.id, state.date||iso(new Date()));
    const attLbl=att?t('att_'+att.status):'·';
    return `<button type="button" class="kid-dir-card pine-settle" data-open-kid="${k.id}">
      <span class="kid-dir-av" style="background:${esc(k.color||'#c7d2fe')}">${esc((k.name||'?')[0]||'?')}</span>
      <span class="grow"><b>${esc(k.name)}</b><small>Lv ${lv} · ${xp} XP · ${esc(attLbl)}</small></span>
      ${ui('u-person','sm')}
    </button>`;
  }).join('');
  const tabs=`<div class="kids-pane-tabs" role="tablist">
    <button type="button" class="chip ${pane==='directory'?'on':''}" data-kids-pane="directory">${esc(t('navKids'))}</button>
    <button type="button" class="chip ${pane==='attendance'?'on':''}" data-kids-pane="attendance">${esc(t('schoolAttendance'))}</button>
    <button type="button" class="chip ${pane==='homework'?'on':''}" data-kids-pane="homework">${esc(t('schoolHomework'))}</button>
    <button type="button" class="chip ${pane==='timetable'?'on':''}" data-kids-pane="timetable">${esc(t('schoolTimetable'))}</button>
    ${isAdminUser()?`<button type="button" class="chip ${pane==='subjects'?'on':''}" data-kids-pane="subjects">${esc(t('schoolSubjects'))}</button>`:''}
  </div>`;
  let body='';
  if(pane==='directory') body=`<div class="kid-dir-list">${dir||emptyState(ui('u-person'), t('kidsEmpty'))}</div>`;
  else if(pane==='attendance') body=viewAttendanceGrid();
  else if(pane==='homework') body=viewHomeworkStaff();
  else if(pane==='timetable') body=viewSchoolTimetable();
  else if(pane==='subjects' && isAdminUser()) body=viewSubjectsAdmin();
  else body=`<div class="kid-dir-list">${dir}</div>`;
  return `<div class="kids-shell">
    <header class="ops-hero kids-hero hero-texture">
      <p class="brand-kicker">Armonia</p>
      <h2>${esc(t('titleKids'))}</h2>
      <p>${esc(t('kidsHeroHint'))}</p>
    </header>
    ${tabs}
    ${body}
  </div>`;
}

function viewKidProfile(kidId){
  ensureSchoolDb();
  const k=kid(kidId); if(!k){ state.staffKidId=null; return viewKids(); }
  const xp=kidXp(k.id), lv=kidLevel(xp), pct=Math.min(100, Math.round((xp%100)));
  const wk=kidWeekKey();
  const subs=activeSubjects().map(s=>{
    const sc=subjectGradeFor(k.id, s.id, wk);
    return `<div class="school-sub-row">
      <span class="grow">${esc(subjectLabel(s))}</span>
      ${starsHtml(sc,{interactive:true,kidId:k.id,subjectId:s.id})}
    </div>`;
  }).join('');
  const rates=KID_RATE_AREAS.map(a=>{
    const v=kidRating(k.id,a.id,wk);
    return `<div class="school-sub-row"><span class="grow">${esc(t(a.key))}</span>${starsHtml(v)}</div>`;
  }).join('');
  const notes=(DB.kidNotes||[]).filter(n=>n.kidId===k.id).sort((a,b)=>b.ts-a.ts).slice(0,5)
    .map(n=>`<li><small>${esc(new Date(n.ts).toLocaleDateString())}</small> ${esc(n.text||'')}</li>`).join('')
    || `<li class="muted">${esc(t('kidNotesEmpty'))}</li>`;
  const recent=entriesFor(state.date||iso(new Date())).filter(e=>(e.childIds||[]).includes(k.id)).slice(0,6)
    .map(e=>`<li>${esc(actLabel(e.activityId))}</li>`).join('') || `<li class="muted">${esc(t('noTasks'))}</li>`;
  const attWeek=[];
  for(let i=0;i<7;i++){
    const d=new Date(); d.setDate(d.getDate()-((d.getDay()+6)%7)+i);
    const ds=iso(d);
    const a=attendanceFor(k.id,ds);
    attWeek.push(`<button type="button" class="att-chip ${a?a.status:''}" data-att-kid="${k.id}" data-att-date="${ds}" data-att-cycle="1">${DAY_NAMES[state.lang][(d.getDay()+6)%7]} ${a?t('att_'+a.status):'—'}</button>`);
  }
  const hw=(DB.homework||[]).filter(h=>!h.kidId || h.kidId===k.id).slice(0,8)
    .map(h=>`<label class="hw-row"><input type="checkbox" data-hw-toggle="${h.id}" ${h.done?'checked':''}/> <span>${esc(h.title||'')}</span></label>`).join('')
    || `<p class="muted">${esc(t('hwEmpty'))}</p>`;
  return `<div class="kids-shell kid-profile">
    <button type="button" class="btn ghost sm" id="kidProfileBack">← ${esc(t('navKids'))}</button>
    <header class="kid-profile-mast hero-texture">
      <span class="kid-dir-av lg" style="background:${esc(k.color||'#c7d2fe')}">${esc((k.name||'?')[0])}</span>
      <div><p class="brand-kicker">Armonia</p><h2>${esc(k.name)}</h2>
        <div class="row" style="gap:12px;align-items:center;margin-top:8px">
          ${ringHtml(pct, 'Lv '+lv, 'pine')}
          ${kidStreakHtml(k.id)}
        </div>
      </div>
    </header>
    <section class="card pine-settle"><div class="block-h"><span class="t">${esc(t('schoolSubjects'))}</span><span class="hrs">${esc(t('thisWeek'))}</span></div>${subs}</section>
    <section class="card pine-settle"><div class="block-h"><span class="t">${esc(t('kidNavRate'))}</span></div>${rates}</section>
    <section class="card pine-settle"><div class="block-h"><span class="t">${esc(t('schoolAttendance'))}</span></div><div class="att-week">${attWeek.join('')}</div></section>
    <section class="card pine-settle"><div class="block-h"><span class="t">${esc(t('schoolHomework'))}</span></div>${hw}</section>
    <section class="card pine-settle"><div class="block-h"><span class="t">${esc(t('kidNotesTitle'))}</span></div>
      <div class="row" style="gap:8px;margin-bottom:8px">
        <input id="staffKidNote" class="inp grow" placeholder="${esc(t('kidNotesPlaceholder'))}"/>
        <button type="button" class="btn sm" id="staffKidNoteSave" data-note-kid="${k.id}">${esc(t('kidNotesSave'))}</button>
      </div>
      <ul class="kid-note-list">${notes}</ul>
    </section>
    <section class="card pine-settle"><div class="block-h"><span class="t">${esc(t('headerScheduleDay'))}</span></div><ul>${recent}</ul></section>
  </div>`;
}

function viewAttendanceGrid(){
  const ds=state.date||iso(new Date());
  const rows=(DB.children||[]).map(k=>{
    const a=attendanceFor(k.id,ds);
    const st=a?.status||'';
    return `<div class="att-grid-row">
      <button type="button" class="linkish" data-open-kid="${k.id}"><b>${esc(k.name)}</b></button>
      <div class="att-btns">
        <button type="button" class="chip ${st==='present'?'on':''}" data-att-kid="${k.id}" data-att-date="${ds}" data-att-status="present">${esc(t('att_present'))}</button>
        <button type="button" class="chip ${st==='absent'?'on':''}" data-att-kid="${k.id}" data-att-date="${ds}" data-att-status="absent">${esc(t('att_absent'))}</button>
        <button type="button" class="chip ${st==='excused'?'on':''}" data-att-kid="${k.id}" data-att-date="${ds}" data-att-status="excused">${esc(t('att_excused'))}</button>
      </div>
    </div>`;
  }).join('');
  return `<div class="att-grid card"><div class="block-h"><span class="t">${esc(eventDayLabel(ds))}</span>
    <input type="date" id="attDatePick" value="${ds}"/></div>${rows}</div>`;
}

function viewHomeworkStaff(){
  ensureSchoolDb();
  const list=(DB.homework||[]).slice().sort((a,b)=>(a.due||'').localeCompare(b.due||'')).map(h=>{
    const sub=subjectById(h.subjectId);
    const kidN=h.kidId?kid(h.kidId)?.name:'';
    const meta=[subjectLabel(sub), h.due, kidN].filter(Boolean).join(' · ');
    return `<label class="hw-row card">
      <input type="checkbox" data-hw-toggle="${h.id}" ${h.done?'checked':''}/>
      <span class="grow"><b>${esc(h.title||'')}</b><small>${esc(meta)}</small></span>
    </label>`;
  }).join('') || emptyState(ui('u-book'), t('hwEmpty'));
  const subOpts=activeSubjects().map(s=>`<option value="${s.id}">${esc(subjectLabel(s))}</option>`).join('');
  const kidOpts=`<option value="">${esc(t('hwAllKids'))}</option>`+(DB.children||[]).map(k=>`<option value="${k.id}">${esc(k.name)}</option>`).join('');
  return `<div class="hw-staff">
    <form class="card pine-settle" id="hwAddForm">
      <div class="block-h"><span class="t">${esc(t('hwAdd'))}</span></div>
      <input name="title" class="inp" required placeholder="${esc(t('hwTitlePh'))}"/>
      <div class="row" style="gap:8px;margin-top:8px">
        <select name="subjectId" class="inp grow">${subOpts}</select>
        <input name="due" type="date" class="inp" value="${iso(new Date())}"/>
      </div>
      <select name="kidId" class="inp" style="margin-top:8px">${kidOpts}</select>
      <button class="btn" type="submit" style="margin-top:10px">${esc(t('hwAdd'))}</button>
    </form>
    <div class="hw-list">${list}</div>
  </div>`;
}

function viewSchoolTimetable(){
  ensureSchoolDb();
  const days=DAY_NAMES[state.lang];
  const slots=(DB.schoolTimetable||[]).slice().sort((a,b)=>(a.day-b.day)||String(a.from).localeCompare(String(b.from)));
  const byDay=[0,1,2,3,4,5,6].map(di=>{
    const rows=slots.filter(s=>Number(s.day)===di).map(s=>{
      const sub=subjectById(s.subjectId);
      return `<div class="tt-slot"><b>${esc(s.from||'')}–${esc(s.to||'')}</b> ${esc(subjectLabel(sub))}</div>`;
    }).join('') || `<p class="muted">${esc(t('ttEmpty'))}</p>`;
    return `<section class="card pine-settle tt-day"><div class="block-h"><span class="t">${esc(days[di])}</span></div>${rows}</section>`;
  }).join('');
  const subOpts=activeSubjects().map(s=>`<option value="${s.id}">${esc(subjectLabel(s))}</option>`).join('');
  const dayOpts=days.map((n,i)=>`<option value="${i}">${esc(n)}</option>`).join('');
  return `<div class="tt-staff">
    ${isAdminUser()?`<form class="card" id="ttAddForm">
      <div class="block-h"><span class="t">${esc(t('ttAdd'))}</span></div>
      <div class="row" style="gap:8px">
        <select name="day" class="inp">${dayOpts}</select>
        <select name="subjectId" class="inp grow">${subOpts}</select>
      </div>
      <div class="row" style="gap:8px;margin-top:8px">
        <input name="from" class="inp" placeholder="09:00" required/>
        <input name="to" class="inp" placeholder="09:45" required/>
      </div>
      <button class="btn" type="submit" style="margin-top:10px">${esc(t('ttAdd'))}</button>
    </form>`:''}
    <div class="tt-grid">${byDay}</div>
  </div>`;
}

function viewSubjectsAdmin(){
  ensureSchoolDb();
  const rows=(DB.subjects||[]).map(s=>`<div class="school-sub-row">
    <span class="grow ${s.active===false?'muted':''}">${esc(subjectLabel(s))}</span>
    <button type="button" class="btn ghost sm" data-sub-toggle="${s.id}">${s.active===false?esc(t('subActivate')):esc(t('subArchive'))}</button>
  </div>`).join('');
  return `<div class="card">
    <div class="block-h"><span class="t">${esc(t('schoolSubjects'))}</span></div>
    ${rows}
    <form id="subAddForm" class="row" style="gap:8px;margin-top:12px">
      <input name="de" class="inp grow" placeholder="DE" required/>
      <input name="el" class="inp grow" placeholder="EL" required/>
      <button class="btn sm" type="submit">${esc(t('subAdd'))}</button>
    </form>
  </div>`;
}

function childSubjectsReadonlyHtml(kidId){
  ensureSchoolDb();
  const wk=kidWeekKey();
  const rows=activeSubjects().map(s=>{
    const sc=subjectGradeFor(kidId,s.id,wk);
    return `<div class="school-sub-row"><span class="grow">${esc(subjectLabel(s))}</span>${starsHtml(sc)}</div>`;
  }).join('');
  return `<section class="card kid-subjects-ro"><div class="block-h"><span class="t">${esc(t('schoolSubjects'))}</span></div>${rows||`<p class="muted">${esc(t('subEmpty'))}</p>`}</section>`;
}

function wireKidsView(v){
  v.querySelectorAll('[data-kids-pane]').forEach(b=>{
    b.onclick=()=>{ state.kidsPane=b.dataset.kidsPane; state.staffKidId=null; render(); };
  });
  v.querySelectorAll('[data-open-kid]').forEach(b=>{
    b.onclick=()=>{ state.staffKidId=b.dataset.openKid; render(); };
  });
  const back=v.querySelector('#kidProfileBack');
  if(back) back.onclick=()=>{ state.staffKidId=null; render(); };
  v.querySelectorAll('[data-grade-kid]').forEach(b=>{
    b.onclick=()=>{
      if(setSubjectGrade(b.dataset.gradeKid, b.dataset.gradeSub, Number(b.dataset.gradeVal))){
        save(); toast(t('gradeSaved'),'success'); render();
      }
    };
  });
  v.querySelectorAll('[data-att-kid]').forEach(b=>{
    b.onclick=()=>{
      let st=b.dataset.attStatus;
      if(b.dataset.attCycle){
        const cur=attendanceFor(b.dataset.attKid, b.dataset.attDate)?.status;
        st = cur==='present'?'absent':cur==='absent'?'excused':'present';
      }
      setAttendance(b.dataset.attKid, b.dataset.attDate, st);
      save(); toast(t('attSaved'),'success'); render();
    };
  });
  const attDate=v.querySelector('#attDatePick');
  if(attDate) attDate.onchange=()=>{ state.date=attDate.value; render(); };
  v.querySelectorAll('[data-hw-toggle]').forEach(inp=>{
    inp.onchange=()=>{
      const h=(DB.homework||[]).find(x=>x.id===inp.dataset.hwToggle);
      if(h){ h.done=!!inp.checked; h.ts=Date.now(); save(); toast(t('hwSaved'),'success'); }
    };
  });
  const hwForm=v.querySelector('#hwAddForm');
  if(hwForm) hwForm.onsubmit=ev=>{
    ev.preventDefault();
    const fd=new FormData(hwForm);
    ensureSchoolDb();
    DB.homework.push({
      id:uid(), title:String(fd.get('title')||'').trim().slice(0,120),
      subjectId:fd.get('subjectId')||'', kidId:fd.get('kidId')||null,
      due:fd.get('due')||iso(new Date()), done:false, ts:Date.now(),
    });
    save(); toast(t('hwSaved'),'success'); render();
  };
  const ttForm=v.querySelector('#ttAddForm');
  if(ttForm) ttForm.onsubmit=ev=>{
    ev.preventDefault();
    const fd=new FormData(ttForm);
    ensureSchoolDb();
    DB.schoolTimetable.push({
      id:uid(), day:Number(fd.get('day'))||0, from:String(fd.get('from')||''),
      to:String(fd.get('to')||''), subjectId:fd.get('subjectId')||'', kidIds:[],
    });
    save(); toast(t('ttSaved'),'success'); render();
  };
  const noteSave=v.querySelector('#staffKidNoteSave');
  if(noteSave) noteSave.onclick=()=>{
    const text=(v.querySelector('#staffKidNote')?.value||'').trim();
    if(!text) return;
    ensureSchoolDb();
    DB.kidNotes.push({id:uid(), kidId:noteSave.dataset.noteKid, text:text.slice(0,2000), ts:Date.now(), by:state.user?.id});
    save(); toast(t('kidNotesSaved'),'success'); render();
  };
  v.querySelectorAll('[data-sub-toggle]').forEach(b=>{
    b.onclick=()=>{
      const s=subjectById(b.dataset.subToggle);
      if(s){ s.active=s.active===false; save(); render(); }
    };
  });
  const subAdd=v.querySelector('#subAddForm');
  if(subAdd) subAdd.onsubmit=ev=>{
    ev.preventDefault();
    const fd=new FormData(subAdd);
    ensureSchoolDb();
    DB.subjects.push({id:'sub-'+uid(), de:String(fd.get('de')||'').trim(), el:String(fd.get('el')||'').trim(), active:true});
    save(); toast(t('subSaved'),'success'); render();
  };
}

/* ── Kids: weekly self-rating ──────────────────────────────────────────
   Four areas, five stars each, one row per ISO week. Stored per kid so a
   child's own read of the week sits next to the XP the system awards them. */
const KID_RATE_AREAS = [
  {id:'school',  key:'kidRateSchool',  tint:'sea'},
  {id:'home',    key:'kidRateHome',    tint:'pine'},
  {id:'friends', key:'kidRateFriends', tint:'mark'},
  {id:'mood',    key:'kidRateMood',    tint:'sun'},
];

function kidWeekKey(d){
  const dt = d ? new Date(d) : new Date();
  const day = (dt.getDay() + 6) % 7;              // Monday = 0
  dt.setDate(dt.getDate() - day);
  return iso(dt);
}

function kidRating(kidId, area, week){
  const wk = week || kidWeekKey();
  const hit = (DB.kidRatings||[]).find(r=>r.kidId===kidId && r.area===area && r.week===wk);
  return hit ? Number(hit.value)||0 : 0;
}

function setKidRating(kidId, area, value){
  const wk = kidWeekKey();
  DB.kidRatings = DB.kidRatings || [];
  const hit = DB.kidRatings.find(r=>r.kidId===kidId && r.area===area && r.week===wk);
  if(hit) hit.value = value;
  else DB.kidRatings.push({id:uid(), kidId, area, week:wk, value, ts:Date.now()});
  save();
}

function kidWeekAverage(kidId, week){
  const vals = KID_RATE_AREAS.map(a=>kidRating(kidId, a.id, week)).filter(v=>v>0);
  if(!vals.length) return 0;
  return Math.round((vals.reduce((a,b)=>a+b,0) / vals.length) * 10) / 10;
}

function kidStarsHtml(area, value){
  let out = '';
  for(let i=1;i<=5;i++){
    out += `<button type="button" class="kid-star${i<=value?' on':''}" data-kid-rate="${esc(area)}" data-kid-rate-value="${i}" aria-label="${i}/5">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9z"/></svg>
    </button>`;
  }
  return out;
}

function childBewertungenView(kidId){
  const rows = KID_RATE_AREAS.map(a=>{
    const v = kidRating(kidId, a.id);
    return `<div class="kid-rate-row">
      <span class="kid-rate-label">${esc(t(a.key))}</span>
      <span class="kid-stars ${a.tint}">${kidStarsHtml(a.id, v)}</span>
    </div>`;
  }).join('');

  const weeks = [];
  for(let i=3;i>=0;i--){
    const d = new Date(); d.setDate(d.getDate() - i*7);
    const wk = kidWeekKey(d);
    weeks.push({wk, avg: kidWeekAverage(kidId, wk)});
  }
  const trend = weeks.map(w=>{
    const pct = Math.round((w.avg/5)*100);
    return `<div class="kid-trend-row">
      <span class="kid-trend-wk">${esc(w.wk.slice(5).replace('-','.'))}</span>
      <span class="kid-trend-track"><span class="kid-trend-fill" style="width:${pct}%"></span></span>
      <span class="kid-trend-val">${w.avg ? w.avg.toFixed(1) : '–'}</span>
    </div>`;
  }).join('');

  return `<section class="kid-card">
      <h2>${esc(t('kidRateTitle'))}</h2>
      <p class="muted">${esc(t('kidRateLead'))}</p>
      ${rows}
    </section>
    ${childSubjectsReadonlyHtml(kidId)}
    <section class="kid-card">
      <h2>${esc(t('kidRateWeeks'))}</h2>
      ${trend}
    </section>`;
}

/* ── Kids: bonus ──────────────────────────────────────────────────────
   Derived, never stored: bonus is a read of what the chore and XP data
   already say, so it cannot drift out of sync with them. */
function kidBonusState(kidId){
  const myChores = (DB.chores||[]).filter(ch=>choreForKid(ch,kidId) && ch.daily);
  const dates = kidXpDates ? kidXpDates(kidId) : [];
  let streak = 0;
  for(let i=0;i<30;i++){
    const d = new Date(); d.setDate(d.getDate()-i);
    if(dates.includes(iso(d))) streak++;
    else if(i>0) break;
  }
  const allWeek = myChores.length > 0 && streak >= 7;
  const read5 = streak >= 5;
  const helped = (DB.xpLog||[]).some(e=>e.kidId===kidId && Number(e.xp)>=10);
  const tidy7 = streak >= 7 && myChores.length >= 3;
  const earned = (allWeek?20:0) + (read5?15:0) + (helped?10:0) + (tidy7?25:0);
  return {streak, earned, items:[
    {label:t('kidBonusAllWeek'), pts:20, done:allWeek},
    {label:t('kidBonusRead'),    pts:15, done:read5},
    {label:t('kidBonusHelp'),    pts:10, done:helped},
    {label:t('kidBonusTidy'),    pts:25, done:tidy7},
  ]};
}

function childBonusView(kidId){
  const b = kidBonusState(kidId);
  const items = b.items.map(it=>`<div class="kid-bonus-row${it.done?' done':''}">
      <span class="kid-bonus-mark" aria-hidden="true">${it.done?'✓':''}</span>
      <span class="kid-bonus-label">${esc(it.label)}</span>
      <span class="kid-bonus-pts">+${it.pts}</span>
    </div>`).join('');
  return `<section class="kid-card kid-bonus-hero">
      <span class="kid-bonus-stars" aria-hidden="true">${kidStarsHtml('__none__',3).replace(/data-kid-rate="[^"]*"/g,'').replace(/data-kid-rate-value="[^"]*"/g,'')}</span>
      <div class="kid-bonus-copy">
        <b>${esc(t('kidBonusEarned')(b.earned))}</b>
        <span>${esc(t('kidBonusStreak')(b.streak))}</span>
      </div>
    </section>
    <section class="kid-card">
      <h2>${esc(t('kidBonusHow'))}</h2>
      ${items}
    </section>`;
}

/* ── Kids: private notes ──────────────────────────────────────────────
   Local to the device on purpose — these are the child's own words, and
   they are not part of the shared ops blob staff sync between phones. */
const KID_MOODS = [
  {id:'good', key:'kidMoodGood', tint:'in'},
  {id:'ok',   key:'kidMoodOk',   tint:'warn'},
  {id:'hard', key:'kidMoodHard', tint:'out'},
];

function childNotizenView(kidId){
  const mine = (DB.kidNotes||[]).filter(n=>n.kidId===kidId).sort((a,b)=>b.ts-a.ts);
  const moods = KID_MOODS.map(m=>`<button type="button" class="kid-mood ${m.tint}" data-kid-mood="${m.id}">${esc(t(m.key))}</button>`).join('');
  const list = mine.length ? mine.map(n=>{
    const m = KID_MOODS.find(x=>x.id===n.mood) || KID_MOODS[0];
    return `<article class="kid-card kid-note ${m.tint}">
        <div class="kid-note-head">
          <span class="kid-note-date">${esc(new Date(n.ts).toLocaleDateString(state.lang==='el'?'el-GR':'de-DE',{weekday:'long'}))}</span>
          <span class="kid-note-mood">${esc(t(m.key))}</span>
        </div>
        <p>${esc(n.text)}</p>
      </article>`;
  }).join('') : emptyState('', t('kidNotesEmpty'));

  return `<section class="kid-card">
      <h2>${esc(t('kidNotesAsk'))}</h2>
      <div class="kid-moods" role="group">${moods}</div>
      <textarea id="kidNoteText" class="kid-note-input" rows="3" placeholder="${esc(t('kidNotesPlaceholder'))}"></textarea>
      <button type="button" class="btn" id="kidNoteSave">${esc(t('kidNotesSave'))}</button>
    </section>
    ${list}`;
}

function bindKidExtras(root){
  root.querySelectorAll('[data-kid-rate]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const area = btn.getAttribute('data-kid-rate');
      if(area === '__none__') return;
      const val = Number(btn.getAttribute('data-kid-rate-value'))||0;
      setKidRating(state.child.id, area, val);
      toast(t('kidRateSaved'));
      render();
    });
  });
  root.querySelectorAll('[data-kid-mood]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      root.querySelectorAll('[data-kid-mood]').forEach(b=>b.classList.remove('on'));
      btn.classList.add('on');
    });
  });
  const saveBtn = root.querySelector('#kidNoteSave');
  if(saveBtn) saveBtn.addEventListener('click', ()=>{
    const box = root.querySelector('#kidNoteText');
    const text = (box && box.value || '').trim();
    if(!text) return;
    const picked = root.querySelector('[data-kid-mood].on');
    DB.kidNotes = DB.kidNotes || [];
    DB.kidNotes.push({id:uid(), kidId:state.child.id, ts:Date.now(),
                      mood:(picked && picked.getAttribute('data-kid-mood')) || 'good',
                      text:text.slice(0,600)});
    save();
    toast(t('kidNotesSaved'));
    render();
  });
}

function childAufgabenView(kidId){
  const myChores = (DB.chores||[]).filter(ch=>choreForKid(ch,kidId));
  const due = myChores.filter(ch=>!choreDoneToday(ch.id,kidId));
  const done = myChores.filter(ch=>choreDoneToday(ch.id,kidId));
  const lateDay = new Date().getHours() >= 17;
  const card = (ch) => {
    const isDone = choreDoneToday(ch.id,kidId);
    const pending = chorePendingToday(ch.id,kidId);
    const overdue = !isDone && !pending && !!ch.daily && lateDay;
    const cls = [isDone?'done':'', pending?'pending-review':'', overdue?'overdue':''].filter(Boolean).join(' ');
    const action = (!isDone && !pending) ? `data-chore-submit="${ch.id}"` : '';
    return `<button type="button" class="aufgabe-card ${cls}" ${action}>
      <span class="ac-ico" aria-hidden="true">${choreIconSvg(ch)}</span>
      <span class="ac-body">
        <span class="ac-tag">${esc(t('kidSubjectDaily'))}</span>
        <span class="ac-title">${esc(choreLabel(ch))}</span>
        <span class="ac-meta">${isDone?t('choreDone'):pending?t('chorePending'):overdue?t('kidOverdue'):t('kidDueToday')}</span>
      </span>
      <span class="ac-xp">+${ch.xp||0}</span>
    </button>`;
  };
  return `
    <header class="kid-header"><p class="eyebrow">Armonia</p><h2>${esc(t('kidAufgabenTitle'))}</h2></header>
    <div style="display:grid;gap:var(--space-2)">
      ${due.length?due.map(card).join(''):''}
      ${done.length?done.map(card).join(''):''}
      ${!due.length && !done.length ? emptyState(svgUse('i-chore-check',28), t('adminNoReviews')) : ''}
    </div>`;
}

function childLearnHubView(){
  return `
    <header class="kid-header"><p class="eyebrow">Armonia Learn</p><h2>${esc(t('kidLearnHubTitle'))}</h2>
      <p class="kid-hello">${esc(t('kidLearnHubHint'))}</p></header>
    <div class="course-grid">
      <button type="button" class="course-tile" data-game="learn"><span class="bar"></span><b>${esc(t('gameLearn'))}</b><span>${esc(t('gameLearnHint'))}</span></button>
      <button type="button" class="course-tile sea" data-game="quiz"><span class="bar"></span><b>${esc(t('gameQuiz'))}</b><span>${esc(t('gameQuizHint'))}</span></button>
      <button type="button" class="course-tile sun" data-game="math"><span class="bar"></span><b>${esc(t('gameMath'))}</b><span>${esc(t('gameMathHint'))}</span></button>
      <button type="button" class="course-tile out" data-game="eduhub"><span class="bar"></span><b>${esc(t('gameEduHub'))}</b><span>${esc(t('gameEduHubHint'))}</span></button>
    </div>`;
}

function childRewardsView(kidId){
  const c = kid(kidId);
  const xp = kidXp(kidId);
  const lv = kidLevel(xp);
  const lvName = kidLevelName(lv);
  const nextXp = XP_LEVELS[Math.min(lv+1, XP_LEVELS.length-1)];
  const curXp = XP_LEVELS[lv];
  const pct = lv >= XP_LEVELS.length-1 ? 100 : Math.round(((xp-curXp)/Math.max(1,nextXp-curXp))*100);
  const weekDelta = kidWeekXpDelta(kidId);
  const streak = kidStreakDays(kidId);
  return `
    <header class="kid-header"><p class="eyebrow">Armonia</p><h2>${esc(t('kidSterneTitle'))}</h2>
      <p class="kid-hello">${esc(c.name)} · ${esc(lvName)}</p></header>
    <section class="sterne-hero">
      <div class="sterne-top">
        ${progressRingHtml(pct, lv)}
        <div>
          <div class="level-xp">${esc(t('kidXpOf')(xp, nextXp))}</div>
          <div class="level-next">${lv>=XP_LEVELS.length-1?'MAX':esc(t('kidXpRemain')(Math.max(0,nextXp-xp)))}</div>
          ${levelMeterHtml(pct)}
        </div>
      </div>
      <div class="sterne-stats">
        <div class="sterne-stat"><b>+${weekDelta}</b><span>${esc(t('kidWeekDeltaLabel'))}</span></div>
        <div class="sterne-stat"><b>${streak}</b><span>${esc(t('kidStreak'))}</span></div>
      </div>
      ${kidStreakHtml(kidId)}
    </section>
    <div class="kid-panel-h" style="margin-top:var(--space-2)"><b>${esc(t('kidBadges'))}</b></div>
    ${kidBadgesHtml(xp)}
    <div class="kid-panel-h" style="margin-top:var(--space-3)"><b>${esc(t('leaderboard'))}</b>
      <button type="button" class="chip" data-child-view="aufgaben">${esc(t('kidCourseTasks'))}</button></div>
    ${(() => {
      const board = DB.children.map(k=>({k, xp:kidXp(k.id)})).sort((a,b)=>b.xp-a.xp).slice(0,8);
      return `<div class="reward-leaderboard">${board.map((entry,i)=>{
        const isMe = entry.k.id === kidId;
        return `<div class="lb-row${isMe?' me':''}">
          <div class="lb-rank">${i+1}</div>
          <div class="lb-avatar" style="background:${safeColor(entry.k.color)}">${esc(initials(entry.k.name))}</div>
          <div class="lb-name">${esc(entry.k.name)}</div>
          <div class="lb-xp">${entry.xp}</div>
        </div>`;
      }).join('')}</div>`;
    })()}
  `;
}

function renderChild(){
  const c = state.child;
  const today = iso(new Date());
  if(!state.date) state.date = today;
  // Map legacy views onto the student dock set
  if(state.childView==='week') state.childView='plan';
  if(state.childView==='events' || state.childView==='gallery'){ /* keep secondary */ }

  document.getElementById('title').textContent = esc(c.name);
  document.getElementById('who').textContent = t('myWeek');
  document.getElementById('btnLang').textContent = state.lang === 'de' ? 'DE' : 'ΕΛ';
  document.getElementById('btnUser').textContent = t('childBye');
  document.getElementById('btnProfiles').textContent = '↔';
  document.getElementById('btnProfiles').title = t('profilesBack');
  document.getElementById('btnProfiles').setAttribute('aria-label', t('switchProfile'));
  const tools=document.getElementById('topTools');
  if(tools){ tools.hidden=true; tools.replaceChildren(); }
  const bottom=document.getElementById('bottomPanel');
  if(bottom) bottom.style.display='none';
  document.querySelector('nav')?.classList.add('is-staff-hidden');
  const staffNav = document.querySelector('nav.dock');
  if(staffNav) staffNav.style.display='none';
  document.body.classList.add('mode-child');
  document.body.classList.remove('has-stock-dock','has-store-dock');
  document.body.classList.toggle('chat-open', !!state.chatOpen);
  const zoFab=document.getElementById('navChat');
  if(zoFab){
    zoFab.hidden=false;
    zoFab.classList.toggle('on', !!state.chatOpen);
    zoFab.setAttribute('aria-label', t('helpChat'));
    zoFab.title = t('helpChat');
  }

  const dockActive = ['today','plan','learn','rewards','games'].includes(state.childView)
    ? state.childView
    : (state.childView==='aufgaben'?'today'
      : state.childView==='games'? 'games'
      : (state.childView==='rate'||state.childView==='bonus')? 'rewards'
      : state.childView==='notes'? 'today':'today');

  let viewBody;
  if(state.childView==='today') viewBody = childStartView(c);
  else if(state.childView==='plan') viewBody = childStundenplanView(c);
  else if(state.childView==='aufgaben') viewBody = childAufgabenView(c.id);
  else if(state.childView==='rewards') viewBody = childRewardsView(c.id);
  else if(state.childView==='learn'){
    viewBody = state.gameId ? childGamesView() : childLearnHubView();
  }
  else if(state.childView==='games') viewBody = childGamesView();
  else if(state.childView==='rate') viewBody = childBewertungenView(c.id);
  else if(state.childView==='bonus') viewBody = childBonusView(c.id);
  else if(state.childView==='notes') viewBody = childNotizenView(c.id);
  else if(state.childView==='events') viewBody = childEventsView(c.id);
  else if(state.childView==='gallery') viewBody = childGalleryView();
  else viewBody = childStartView(c);

  document.getElementById('view').innerHTML = `
    <div class="kid-shell">
      ${viewBody}
      ${kidDockHtml(dockActive)}
    </div>`;

  const root = document.getElementById('view');
  root.querySelectorAll('[data-child-view]').forEach(b=>{
    b.onclick = () => {
      const next = b.dataset.childView;
      if(next !== 'games' && next !== 'learn'){ stopChildGameTimers(); state.gameId=null; state.game=null; }
      if(next==='learn'){ state.gameId=null; state.game=null; }
      state.childView = next;
      if(next==='gallery'){ refreshGallery({silent:true}).finally(()=>render()); return; }
      render();
    };
  });
  root.querySelectorAll('[data-date]').forEach(d=>{
    d.onclick = () => { state.date = d.dataset.date; render(); };
  });
  const teamBanner=root.querySelector('#teamNoticeBanner');
  if(teamBanner) teamBanner.onclick=()=>{dismissTeamNotice();render();};
  const howTo=root.querySelector('#childHowToBtn');
  if(howTo) howTo.onclick=()=>sheetChildHowTo();
  if(state.childView==='games' || state.childView==='learn') bindChildGames(root);
  if(state.childView==='rate' || state.childView==='notes') bindKidExtras(root);
  if(state.childView==='gallery') bindGallery(root);
  root.querySelectorAll('[data-chore-submit]').forEach(btn=>{
    btn.onclick = ()=>{
      const choreId = btn.dataset.choreSubmit;
      if(choreId && state.child) openChoreSubmitSheet(choreId, state.child.id);
    };
  });
  syncLayoutMode();
}

async function openChoreSubmitSheet(choreId, kidId){
  const ch = (DB.chores||[]).find(c=>c.id===choreId);
  if(!ch) return;
  const c = kid(kidId);
  let photoDataUrl = null;

  const renderSheet = (aiState='idle', aiMsg='') => {
    const aiHtml = aiState==='idle' ? '' : aiState==='checking'
      ? `<div class="ai-verdict checking"><div class="ai-verdict-icon">🤖</div><div>${t('choreAiChecking')}</div></div>`
      : aiState==='ok'
      ? `<div class="ai-verdict ok"><div class="ai-verdict-icon">${ui('u-check')}</div><div>${t('choreAiApproved')}</div></div>`
      : aiState==='fail'
      ? `<div class="ai-verdict fail"><div class="ai-verdict-icon">❌</div><div>${esc(aiMsg)||t('choreAiRejected')}</div></div>`
      : `<div class="ai-verdict checking"><div class="ai-verdict-icon">⚠️</div><div>${t('choreAiError')}</div></div>`;

    document.getElementById('sheet').innerHTML = `
      <button class="sheet-close" id="sheetClose" type="button">×</button>
      <div style="padding:14px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <div style="width:52px;height:52px;border-radius:14px;background:${safeColor(c.color)};display:grid;place-items:center;color:var(--ink)">${choreIconSvg(ch,26)}</div>
          <div><div style="font-size:16px;font-weight:700">${esc(choreLabel(ch))}</div>
            <div class="muted" style="font-size:13px">${t('choreSubmitProof')} · ⭐ ${ch.xp} XP</div></div>
        </div>
        <p style="font-size:13px;color:var(--muted);margin:0 0 10px">${t('chorePhotoHint')}</p>
        ${photoDataUrl ? `<img class="chore-photo-thumb" src="${photoDataUrl}" alt="proof">` : ''}
        <div class="chore-verify-area" id="chorePhotoArea" role="button" tabindex="0">
          <div class="cva-icon">${ui('u-camera')}</div>
          <div class="cva-label">${photoDataUrl ? t('imageReady') : t('pickScreenshot')}</div>
          <input type="file" id="choreFileInput" accept="image/*" capture="environment" style="display:none">
        </div>
        <label class="f" style="margin-top:10px">
          <span>${t('choreProofLabel')}</span>
          <textarea id="choreProofText" placeholder="${t('choreProofPh')}" rows="3" style="resize:none;font-size:15px"></textarea>
        </label>
        ${aiHtml}
        <button class="btn" id="choreSubmitBtn" type="button" style="margin-top:10px" ${aiState==='checking'?'disabled':''}>
          ${aiState==='ok' ? t('choreDone') : t('choreSubmit')}
        </button>
      </div>`;

    document.getElementById('sheetClose').onclick = ()=>closeSheet();
    const photoArea = document.getElementById('chorePhotoArea');
    const fileInput = document.getElementById('choreFileInput');
    photoArea.onclick = ()=>fileInput.click();
    fileInput.onchange = async(e)=>{
      const file = e.target.files[0]; if(!file) return;
      photoDataUrl = await new Promise(res=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.readAsDataURL(file);});
      renderSheet(aiState, aiMsg);
    };
    document.getElementById('choreSubmitBtn').onclick = async()=>{
      const proofText = (document.getElementById('choreProofText')||{}).value || '';
      if(aiState==='ok'){
        finalizeChoreApproval(choreId, kidId, ch.xp, proofText, photoDataUrl);
        return;
      }
      if(!proofText.trim() && !photoDataUrl){ toast(t('choreProofLabel')); return; }
      renderSheet('checking');
      const approved = await aiCheckChore(ch, proofText, photoDataUrl);
      if(approved===true){
        renderSheet('ok');
        // Auto-finalize once; button path is guarded by choreDoneToday
        setTimeout(()=>{ finalizeChoreApproval(choreId, kidId, ch.xp, proofText, photoDataUrl); },900);
      } else if(approved===false){
        renderSheet('fail', '');
        submitPendingReview(choreId, kidId, proofText, photoDataUrl);
      } else {
        renderSheet('error');
        submitPendingReview(choreId, kidId, proofText, photoDataUrl);
      }
    };
  };
  openSheet();
  renderSheet();
}

async function aiCheckChore(chore, proofText, photoDataUrl){
  try {
    const resp = await fetch('/api/chore-verify', {
      method:'POST', credentials:'same-origin',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        choreName: state.lang==='de' ? chore.de : chore.el,
        proofText: proofText || (photoDataUrl ? t('imageReady') : ''),
        lang: state.lang
      })
    });
    if(!resp.ok) return null;
    const data = await resp.json();
    return data.approved === true;
  } catch(e){ return null; }
}

function submitPendingReview(choreId, kidId, proofText, photoDataUrl){
  const subs = DB.choreSubmissions || (DB.choreSubmissions=[]);
  subs.push({
    id:'sub'+Date.now(), choreId, kidId,
    date: iso(new Date()), proofText,
    photoThumb: photoDataUrl ? photoDataUrl.slice(0,200)+'…' : null,
    status:'pending', ts: Date.now()
  });
  save();
}

function finalizeChoreApproval(choreId, kidId, xp, proofText, photoDataUrl){
  if(choreDoneToday(choreId, kidId)){
    closeSheet();
    render();
    return;
  }
  const subs = DB.choreSubmissions || (DB.choreSubmissions=[]);
  const subId = 'sub'+Date.now();
  subs.push({id:subId, choreId, kidId, date:iso(new Date()), proofText,
    photoThumb: photoDataUrl ? photoDataUrl.slice(0,200)+'…' : null,
    status:'approved', ts:Date.now()});
  grantXp(kidId, choreId, xp, subId);
  save();
  closeSheet();
  toast(t('choreXpEarned')(xp));
  feedback('success');
  render();
}

function viewAdminRewardCenter(){
  const pending = (DB.choreSubmissions||[]).filter(s=>s.status==='pending')
    .sort((a,b)=>b.ts-a.ts);

  const rows = pending.map(s=>{
    const ch = (DB.chores||[]).find(c=>c.id===s.choreId);
    const k = kid(s.kidId);
    if(!ch||!k) return '';
    return `<div class="admin-chore-row" data-sub="${s.id}">
      <div>
        <div style="font-size:14px;font-weight:700">${ch.emoji} ${esc(k.name)} — ${esc(choreLabel(ch))}</div>
        <div class="muted" style="font-size:12px">${s.date} · ⭐${ch.xp} XP</div>
        ${s.proofText ? `<div style="font-size:12px;color:var(--muted);margin-top:3px;font-style:italic">"${esc(s.proofText)}"</div>` : ''}
      </div>
      <div class="admin-chore-verdict">
        <button class="verdict-approve" data-verdict="approve" data-sub="${s.id}" type="button" title="${t('adminApprove')}">✓</button>
        <button class="verdict-reject" data-verdict="reject" data-sub="${s.id}" type="button" title="${t('adminReject')}">✗</button>
      </div>
    </div>`;
  }).join('');

  return `<div class="card admin-reward-card">
    <h2>⭐ ${t('adminRewards')}</h2>
    <div style="font-size:13px;color:var(--muted);margin-bottom:10px">${t('adminPendingReview')}: ${pending.length}</div>
    ${pending.length ? `<div class="admin-chore-list">${rows}</div>`
      : `<div class="reward-empty"><div class="re-icon">🎉</div>${t('adminNoReviews')}</div>`}
  </div>`;
}

function bindAdminRewardCenter(root){
  root.querySelectorAll('[data-verdict]').forEach(btn=>{
    btn.onclick = ()=>{
      const subId = btn.dataset.sub;
      const action = btn.dataset.verdict;
      const sub = (DB.choreSubmissions||[]).find(s=>s.id===subId);
      if(!sub || sub.status!=='pending') return;
      sub.status = action==='approve' ? 'approved' : 'rejected';
      if(action==='approve'){
        const ch = (DB.chores||[]).find(c=>c.id===sub.choreId);
        if(ch) grantXp(sub.kidId, sub.choreId, ch.xp, subId);
        toast(t('adminApprove')+' ✓');
      } else {
        toast(t('adminReject'));
      }
      save();
      render();
    };
  });
}

function childGamesLobby(){
  const featured=CHILD_GAMES.filter(g=>g.featured);
  const rest=CHILD_GAMES.filter(g=>!g.featured);
  const stats = state.child ? loadGameStats(state.child.id) : {streak:0};
  const gameWidget=(g,best)=>{
    if(!best) return '';
    if(g.id==='learn'){
      const lv = kidLevel(best);
      const floor = XP_LEVELS[lv]||0;
      const ceil = XP_LEVELS[Math.min(lv+1, XP_LEVELS.length-1)]||floor+100;
      const pct = ceil>floor ? Math.round(((best-floor)/(ceil-floor))*100) : 100;
      return `<div class="arcade-widget">${levelMeterHtml(pct)}</div>`;
    }
    if(g.id==='simon') return `<div class="arcade-widget">${segmentedProgressHtml(best, 10)}</div>`;
    if(g.id==='react'){
      const hist = readGameHistory('react');
      const spark = sparklineHtml(hist.length?hist:[best], 'sea');
      return spark?`<div class="arcade-widget">${spark}</div>`:'';
    }
    const soft = ({quiz:20,math:30,island:20,memory:100,tac:10,catch:40,rps:20,dice:6,colors:30,eduhub:10})[g.id]||20;
    const pct = Math.min(100, Math.round((best/Math.max(soft, best))*100));
    const label = g.id==='react' ? t('gameReactMs')(best) : String(best);
    return `<div class="arcade-widget">${ringHtml(pct, label, 'pine')}</div>`;
  };
  const card=(g, idx)=>{
    const best=readGameBest(g.id);
    const widget=gameWidget(g,best);
    const ico = g.icon
      ? `<span class="arcade-ico" aria-hidden="true">${ui(g.icon)}</span>`
      : `<span class="arcade-emoji" aria-hidden="true">${g.emoji}</span>`;
    const xpChip = g.xp
      ? `<span class="arcade-xp">${ui('u-sparkle','sm')} ${g.xp}</span>`
      : '';
    const delay = Math.min(idx, 5) * 40;
    return `<button class="arcade-tile ${g.featured?'featured':''}" type="button" data-game="${g.id}" style="--game-tint:${g.tint};--arcade-delay:${delay}ms">
      ${ico}
      <span class="arcade-copy">
        <b>${esc(t(g.titleKey))}</b>
        <span class="arcade-hint">${esc(t(g.hintKey))}${xpChip?` ${xpChip}`:''}</span>
        ${widget}
      </span>
      <span class="arcade-play">${t('gamePlay')}</span>
    </button>`;
  };
  const streakChip = stats.streak>1
    ? `<span class="arcade-streak">${ui('u-party','sm')} ${esc(t('gameStreak')(stats.streak))}</span>`
    : '';
  return `<div class="arcade-lobby">
      <div class="arcade-hero">
        <div class="arcade-hero-text">
          <div class="brand-kicker">Armonia Play</div>
          <h2>${t('gamesTitle')}</h2>
          <p>${t('gamesHint')}</p>
        </div>
        ${streakChip}
      </div>
      <div class="arcade-rail featured">${featured.map((g,i)=>card(g,i)).join('')}</div>
      <div class="arcade-grid">${rest.map((g,i)=>card(g,i+featured.length)).join('')}</div>
    </div>`;
}

function memoryStars(moves){
  if(moves<=14) return 3;
  if(moves<=22) return 2;
  return 1;
}

function childMemoryView(){
  const g=state.game; if(!g) return childGamesLobby();
  const done=g.pairs>=MEMORY_EMOJIS.length;
  const stars=done?memoryStars(g.moves):0;
  if(done && !g.finished){
    g.finished=true;
    writeGameBest('memory', Math.max(0, 100-g.moves*2+g.pairs*5));
  }
  return `<div class="game-shell memory">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats">
        <span>${t('gameMoves')}: <b id="memMoves">${g.moves}</b></span>
        <span>${t('gamePairs')}: <b id="memPairs">${g.pairs}/${MEMORY_EMOJIS.length}</b></span>
        <span>${t('gameStreak')}: <b id="memStreak">${g.streak||0}</b></span>
      </div></div>
    <p class="game-play-hint">${esc(t('gameMemoryHintPlay'))}</p>
    ${done?gameShareBar(stars, `${t('gameWin')} · ${g.moves} ${t('gameMoves')}`)+`<div class="memory-confetti" aria-hidden="true"></div>`:''}
    <div class="memory-grid ${done?'board-clear':''}" id="memoryGrid">${g.deck.map((card,i)=>`
      <button class="memory-card ${card.open||card.done?'open':''} ${card.done?'done':''} ${card.justMatched?'matched':''}" type="button" data-i="${i}" ${card.done||g.lock?'disabled':''} aria-label="${card.open||card.done?card.emoji:'card'}">
        <span class="memory-face back">🌊</span><span class="memory-face front">${card.emoji}</span>
      </button>`).join('')}</div>
  </div>`;
}

function tacWinnerLine(board){
  for(const line of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]){
    const [a,b,c]=line;
    if(board[a] && board[a]===board[b] && board[a]===board[c]) return {winner:board[a], line};
  }
  return board.every(Boolean) ? {winner:'draw', line:null} : null;
}
function tacWinner(board){
  const hit=tacWinnerLine(board);
  return hit ? hit.winner : null;
}

function tacBestMove(board, mark){
  const opp=mark==='o'?'x':'o';
  let best=-Infinity, pick=-1;
  const empties=board.map((v,i)=>v?'':i).filter(v=>v!=='');
  for(const i of empties){
    const next=board.slice(); next[i]=mark;
    const result=tacWinner(next);
    let score;
    if(result===mark) score=10;
    else if(result===opp) score=-10;
    else if(result==='draw') score=0;
    else{
      // Opponent plays optimally (one-ply look for kids' medium difficulty).
      let worst=Infinity;
      for(const j of next.map((v,idx)=>v?'':idx).filter(v=>v!=='')){
        const trial=next.slice(); trial[j]=opp;
        const r2=tacWinner(trial);
        let s2=0;
        if(r2===opp) s2=-10;
        else if(r2===mark) s2=10;
        else if(r2==='draw') s2=0;
        worst=Math.min(worst,s2);
      }
      score=worst===Infinity?0:worst;
    }
    if(score>best){ best=score; pick=i; }
  }
  return {pick: pick<0?empties[0]:pick, score:best};
}

function tacCpuMove(){
  const g=state.game; if(!g || g.status!=='play' || g.turn!=='o') return;
  const empties=g.board.map((v,i)=>v?'':i).filter(v=>v!=='');
  if(!empties.length) return;
  // Medium: usually optimal, sometimes random so kids can win
  let pick;
  if(Math.random()<0.72){
    pick=tacBestMove(g.board,'o').pick;
  }else{
    pick=empties[Math.floor(Math.random()*empties.length)];
  }
  if(pick<0) pick=empties[0];
  g.board[pick]='o';
  const hit=tacWinnerLine(g.board);
  if(hit?.winner==='o'){ g.status='win'; g.winner='o'; g.line=hit.line; writeGameBest('tac',1); }
  else if(hit?.winner==='draw'){ g.status='draw'; }
  else g.turn='x';
  render();
}

function childTacView(){
  const g=state.game; if(!g) return childGamesLobby();
  const status = g.status==='win' ? (g.winner==='x'?t('gameWin'):t('gameLose'))
    : g.status==='draw' ? t('gameDraw')
    : g.turn==='x' ? t('gameYourTurn') : t('gameCpuTurn');
  const line=new Set(g.line||[]);
  return `<div class="game-shell tac">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats"><span class="tac-chip you">${t('gameYou')} ❌</span><span class="tac-chip cpu">${t('gameCpu')} ⭕</span></div></div>
    <p class="game-play-hint">${esc(t('gameTacHintPlay'))}</p>
    <div class="game-banner ${g.status==='win'?(g.winner==='x'?'win':'lose'):g.status==='draw'?'draw':g.turn==='o'?'thinking':''} ${g.status!=='play'?'pop-in':''}">${esc(status)}
      ${g.status!=='play'?`<button class="btn" type="button" id="gameAgain">${t('gameAgain')}</button>`:''}</div>
    <div class="tac-grid">${g.board.map((cell,i)=>`
      <button class="tac-cell ${line.has(i)?'win-cell':''} ${cell?'filled':''}" type="button" data-i="${i}" ${cell||g.status!=='play'||g.turn!=='x'?'disabled':''}>
        <span class="tac-mark ${cell||''}">${cell==='x'?'❌':cell==='o'?'⭕':''}</span>
      </button>`).join('')}</div>
  </div>`;
}

function catchStars(score){
  if(score>=55) return 3;
  if(score>=30) return 2;
  return 1;
}

function spawnCatchFish(g){
  const powerRoll = Math.random();
  let kind;
  if(powerRoll>0.92){
    kind = {emoji:'⭐', pts:8, speed:1.35, size:1.05, power:'star'};
  }else if(powerRoll>0.86){
    kind = {emoji:'🫧', pts:0, speed:.9, size:1.1, power:'slow'};
  }else{
    kind = CATCH_FISH[Math.floor(Math.random()*CATCH_FISH.length)];
  }
  const fromLeft=Math.random()>0.5;
  g.fish.push({
    id:'f'+Math.random().toString(36).slice(2,8),
    ...kind,
    x: fromLeft ? -12 : 112,
    y: 12 + Math.random()*70,
    vx: (fromLeft?1:-1) * (28 + Math.random()*34) * kind.speed * (g.power==='slow'?0.55:1),
    wobble: Math.random()*Math.PI*2,
    life: 0,
    spawnFx: true,
  });
}

function childCatchView(){
  const g=state.game; if(!g) return childGamesLobby();
  const over=g.finished || g.left<=0;
  const stars=over?catchStars(g.score):0;
  const best=readGameBest('catch');
  return `<div class="game-shell catch">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats">
        <span>${t('gameScore')}: <b id="catchScore">${g.score}</b></span>
        <span>${t('gameCombo')}: <b id="catchCombo">×${Math.max(1,g.combo)}</b></span>
        <span>${t('gameTime')}: <b id="catchTime">${Math.max(0,g.left)}s</b></span>
      </div></div>
    <p class="game-play-hint">${esc(t('gameCatchHintPlay'))}${best?` · ${esc(t('gameBest'))}: ${best}`:''}</p>
    ${over?gameShareBar(stars, `${t('gameCatchOver')} · ${g.score} ${t('gameScore')}`):''}
    <div class="catch-sea" id="catchSea" aria-label="sea">
      <div class="catch-wave w1"></div><div class="catch-wave w2"></div><div class="catch-bubbles" aria-hidden="true"></div>
      <div id="catchFishLayer"></div>
      <div id="catchSplashLayer"></div>
    </div>
  </div>`;
}

function paintCatchFishLayer(){
  const g=state.game; if(!g || state.gameId!=='catch') return;
  const layer=document.getElementById('catchFishLayer');
  if(!layer) return;
  const ids=g.fish.map(f=>f.id).join(',');
  if(layer.dataset.ids!==ids){
    layer.dataset.ids=ids;
    layer.innerHTML=g.fish.map(f=>`
      <button class="catch-fish swim ${f.spawnFx?'spawn-in':''} ${f.power?'power':''}" type="button" data-fid="${f.id}" aria-label="${esc(t('gameFishCatch'))}"
        style="left:${f.x}%;top:${f.y}%;--sz:${f.size};transform:scaleX(${f.vx<0?-1:1}) scale(var(--sz))">${f.emoji}</button>`).join('');
    g.fish.forEach(f=>f.spawnFx=false);
  }else{
    g.fish.forEach(f=>{
      const el=layer.querySelector(`[data-fid="${f.id}"]`);
      if(!el) return;
      el.style.left=`${f.x}%`;
      el.style.top=`${f.y}%`;
      el.style.transform=`scaleX(${f.vx<0?-1:1}) scale(var(--sz))`;
    });
  }
  if(!layer.dataset.bound){
    layer.dataset.bound='1';
    layer.addEventListener('click', (ev)=>{
      const btn=ev.target.closest('[data-fid]');
      if(!btn || !state.game || state.gameId!=='catch') return;
      const gg=state.game;
      const fish=gg.fish.find(x=>x.id===btn.dataset.fid);
      if(!fish || gg.finished) return;
      gg.combo=Math.min(8,(gg.combo||0)+1);
      gg.bestCombo=Math.max(gg.bestCombo,gg.combo);
      if(fish.power==='slow'){ gg.power='slow'; gg._powerT=6; }
      if(fish.power==='star'){ gg.left=Math.min(75,(gg.left||0)+5); }
      const gained=Math.max(1, fish.pts*Math.max(1,gg.combo));
      gg.score+=gained;
      gg.splashes.push({id:fish.id,x:fish.x,y:fish.y,pts:fish.power==='slow'?'🐌':`+${gained}`,t:0});
      gg.fish=gg.fish.filter(x=>x.id!==fish.id);
      setGameCoach({gameId:'catch', score:gg.score, combo:gg.combo, left:gg.left});
      feedback('save');
      const scoreEl=document.getElementById('catchScore');
      const comboEl=document.getElementById('catchCombo');
      if(scoreEl) scoreEl.textContent=String(gg.score);
      if(comboEl) comboEl.textContent=`×${Math.max(1,gg.combo)}`;
      paintCatchFishLayer();
      paintCatchSplashes();
    });
  }
}

function paintCatchSplashes(){
  const g=state.game; if(!g) return;
  const layer=document.getElementById('catchSplashLayer');
  if(!layer) return;
  layer.innerHTML=g.splashes.map(s=>`
    <div class="catch-splash" style="left:${s.x}%;top:${s.y}%"><span>${esc(s.pts)}</span></div>`).join('');
}

function tickCatch(ts){
  const g=state.game;
  if(!g || state.gameId!=='catch' || g.finished){ stopChildGameTimers(); return; }
  if(!g._last) g._last=ts;
  const dt=Math.min(0.05,(ts-g._last)/1000);
  g._last=ts;
  if(g.power==='slow'){
    g._powerT=(g._powerT||0)-dt;
    if(g._powerT<=0){ g.power=null; g._powerT=0; }
  }
  g._spawn=(g._spawn||0)+dt;
  const spawnEvery = g.power==='slow' ? 0.7 : 0.48;
  if(g.fish.length<(g.power==='slow'?3:5) && g._spawn>spawnEvery){
    spawnCatchFish(g);
    g._spawn=0;
    paintCatchFishLayer();
  }
  let moved=false;
  g.fish.forEach(f=>{
    f.life+=dt;
    f.wobble+=dt*4;
    f.x += f.vx*dt;
    f.y += Math.sin(f.wobble)*18*dt;
    f.y=Math.max(8,Math.min(88,f.y));
    moved=true;
  });
  const before=g.fish.length;
  g.fish=g.fish.filter(f=>f.x>-18 && f.x<118);
  if(g.fish.length!==before){
    g.combo=0;
    const comboEl=document.getElementById('catchCombo');
    if(comboEl) comboEl.textContent='×1';
  }
  if(moved) paintCatchFishLayer();
  g.splashes=g.splashes.filter(s=>{ s.t+=dt; return s.t<0.7; });
  paintCatchSplashes();
  g._raf=requestAnimationFrame(tickCatch);
}

function makeIslandGame(){
  const deck = shuffleInPlace([...ISLAND_STEPS]).slice(0, 8);
  const g = {deck, i:0, score:0, hearts:3, finished:false, lock:false, feedback:null, choices:[], correct:0, q:null};
  buildIslandRound(g);
  setGameCoach({gameId:'island', step:0, hearts:3});
  return g;
}
function buildIslandRound(g){
  const item = g.deck[g.i];
  if(!item){ g.finished=true; return; }
  const loc = state.lang==='el' ? item.el : item.de;
  const order = [0,1,2,3];
  shuffleInPlace(order);
  g.q = loc.q;
  g.emoji = item.emoji;
  g.choices = order.map(i=>loc.choices[i]);
  g.correct = order.indexOf(loc.a);
  g.feedback = null;
  g.lock = false;
}
function answerIsland(choiceIdx){
  const g=state.game; if(!g || g.lock || g.finished || state.gameId!=='island') return;
  g.lock=true;
  const ok = choiceIdx===g.correct;
  if(ok){
    g.score += 12 + g.i;
    g.feedback = {ok:true};
    setGameCoach({gameId:'island', step:g.i+1, score:g.score, lastWrong:null});
    feedback('save');
  }else{
    g.hearts = Math.max(0, g.hearts-1);
    g.feedback = {ok:false, pick:choiceIdx};
    setGameCoach({gameId:'island', step:g.i, hearts:g.hearts, lastWrong:{q:g.q, answer:g.choices[g.correct]}});
    feedback('error');
  }
  render();
  g._cpu = setTimeout(()=>{
    if(!state.game || state.gameId!=='island') return;
    const gg=state.game;
    if(gg.hearts<=0){
      gg.finished=true; gg.lock=false;
      writeGameBest('island', gg.score);
      render(); return;
    }
    gg.i += 1;
    if(gg.i >= gg.deck.length){
      gg.finished=true; gg.lock=false;
      writeGameBest('island', gg.score);
      tryGrantGameWin('island', gg, gg.hearts>0);
      render(); return;
    }
    buildIslandRound(gg);
    render();
  }, ok?550:1000);
}

function childIslandView(){
  const g=state.game; if(!g) return childGamesLobby();
  const total=g.deck.length;
  const progress=Math.min(100, Math.round((g.i/total)*100));
  if(g.finished){
    const stars=g.score>=70?3:g.score>=35?2:1;
    return `<div class="game-shell island">
      <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button></div>
      ${gameShareBar(stars, `${t('gameIslandDone')} · ${g.score} ${t('gameScore')}`)}
    </div>`;
  }
  return `<div class="game-shell island">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats">
        <span>${t('gameIslandStep')}: <b>${Math.min(g.i+1,total)}/${total}</b></span>
        <span>${t('gameScore')}: <b>${g.score}</b></span>
        <span>${'❤️'.repeat(g.hearts)}${'🖤'.repeat(Math.max(0,3-g.hearts))}</span>
      </div></div>
    <p class="game-play-hint">${esc(t('gameIslandHintPlay'))}</p>
    <div class="island-stage" aria-hidden="true">
      <div class="island-sky"></div>
      <div class="island-scene" style="--progress:${progress}">
        <div class="island-platform"></div>
        <div class="island-path">${g.deck.map((_,i)=>`<span class="island-node ${i<g.i?'done':i===g.i?'here':''}">${i+1}</span>`).join('')}</div>
        <div class="island-avatar" style="--step:${g.i}">🧭</div>
      </div>
    </div>
    <div class="learn-prompt island-q pop-in"><span class="learn-emoji">${esc(g.emoji||'🏝️')}</span><b>${esc(g.q||'')}</b></div>
    ${g.feedback?`<div class="game-banner ${g.feedback.ok?'win':'lose'} pop-in">${g.feedback.ok?t('gameLearnCorrect'):`${t('gameLearnWrong')} ${esc(g.choices[g.correct]||'')}`}</div>`:''}
    <div class="learn-choices">${(g.choices||[]).map((c,i)=>`
      <button class="learn-choice ${g.feedback&&i===g.correct?'is-right':''} ${g.feedback&&!g.feedback.ok&&i===g.feedback.pick?'is-wrong':''}"
        type="button" data-island-choice="${i}" ${g.lock?'disabled':''}>${esc(c)}</button>`).join('')}</div>
  </div>`;
}

function childEduHubView(){
  const g=state.game; if(!g) return childGamesLobby();
  if(g.embed){
    const game = EDU_FREE_GAMES.find(x=>x.id===g.embed);
    return `<div class="game-shell eduhub">
      <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
        <button class="chip" type="button" id="eduClose">${t('eduClose')}</button></div>
      <p class="game-play-hint">${esc(t('eduSandbox'))}${game?` · ${esc(t(game.titleKey))}`:''}</p>
      <div class="edu-frame-wrap">
        <iframe class="edu-frame" title="${esc(game?t(game.titleKey):'edu')}"
          src="${esc(game?.url||'')}"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerpolicy="no-referrer"
          loading="lazy"></iframe>
      </div>
    </div>`;
  }
  return `<div class="game-shell eduhub">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button></div>
    <div class="games-hero edu-hero">
      <div class="brand-kicker">Armonia Learn</div>
      <h2>${t('gameEduHub')}</h2>
      <p>${t('gameEduHubHint')}</p>
    </div>
    <p class="muted" style="margin:0 0 10px;font-size:12.5px">${esc(t('eduSandbox'))}</p>
    <div class="games-grid">${EDU_FREE_GAMES.map(eg=>`
      <button class="game-card" type="button" data-edu="${eg.id}" style="--game-tint:#0369a1">
        <span class="game-emoji">${eg.emoji}</span>
        <span class="game-copy"><b>${esc(t(eg.titleKey))}</b><span>PhET · Colorado</span></span>
        <span class="game-go">${t('eduOpen')} →</span>
      </button>`).join('')}</div>
  </div>`;
}

function childGamesView(){
  if(state.gameId==='learn') return childLearnView();
  if(state.gameId==='quiz') return childQuizView();
  if(state.gameId==='math') return childMathView();
  if(state.gameId==='island') return childIslandView();
  if(state.gameId==='eduhub') return childEduHubView();
  if(state.gameId==='memory') return childMemoryView();
  if(state.gameId==='tac') return childTacView();
  if(state.gameId==='catch') return childCatchView();
  if(state.gameId==='react') return childReactView();
  if(state.gameId==='rps') return childRpsView();
  if(state.gameId==='dice') return childDiceView();
  if(state.gameId==='simon') return childSimonView();
  if(state.gameId==='colors') return childColorsView();
  return childGamesLobby();
}

function childLearnView(){
  const g=state.game; if(!g) return childGamesLobby();
  const total=g.deck.length||LEARN_SESSION;
  const heartsHtml = Array.from({length:3},(_,i)=>
    `<span class="learn-heart ${i<g.hearts?'':'broken'}">${i<g.hearts?'❤️':'💔'}</span>`
  ).join('');
  if(g.finished){
    const stars=g.xp>=140?3:g.xp>=70?2:1;
    return `<div class="game-shell learn topic-${esc(g.topic||'all')}">
      <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
        <div class="game-stats"><span>${t('gameLearnXp')}: <b>${g.xp}</b></span></div></div>
      ${gameShareBar(stars, `${t('gameLearnDone')} · ${g.xp} ${t('gameLearnXp')}`)}
    </div>`;
  }
  const topics = [
    {id:'all', key:'gameLearnTopicAll'},
    {id:'greetings', key:'gameLearnTopicGreet'},
    {id:'food', key:'gameLearnTopicFood'},
    {id:'beach', key:'gameLearnTopicBeach'},
    {id:'nature', key:'gameLearnTopicNature'},
    {id:'thassos', key:'gameLearnTopicThassos'},
    {id:'weak', key:'gameLearnWeak'},
  ];
  return `<div class="game-shell learn arcade-stage topic-${esc(g.topic||'all')}">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats">
        <span>${t('gameLearnRound')}: <b>${Math.min(g.i+1,total)}/${total}</b></span>
        <span>${t('gameLearnXp')}: <b>${g.xp}</b></span>
        <span class="learn-hearts" title="${esc(t('gameLearnHearts'))}">${heartsHtml}</span>
        ${g.streak>=2?`<span class="learn-flame">🔥 ${g.streak}</span>`:''}
      </div></div>
    <div class="arcade-controls">
      <label class="arcade-select"><span>${esc(t('gameLearnTopicAll'))}</span>
        <select id="learnTopicSelect">${topics.map(tp=>`<option value="${tp.id}" ${g.topic===tp.id?'selected':''}>${esc(t(tp.key))}</option>`).join('')}</select>
      </label>
      <div class="arcade-mode">
        <button class="arcade-mode-btn ${g.mode==='de2el'?'on':''}" type="button" data-learn-mode="de2el">DE→EL</button>
        <button class="arcade-mode-btn ${g.mode==='el2de'?'on':''}" type="button" data-learn-mode="el2de">EL→DE</button>
        <button class="arcade-mode-btn ai" type="button" id="learnAi" ${g.loading?'disabled':''}>${g.loading?'…':'✨'}</button>
      </div>
    </div>
    ${segmentedProgressHtml(g.i, total)}
    <div class="learn-prompt card-flip" data-flip="${g.flipKey||0}">
      <span class="learn-emoji">${esc(g.card?.emoji||'🇬🇷')}</span>
      <b>${esc(g.prompt)}</b>
      <small>${g.mode==='de2el'?'Deutsch → Ελληνικά':'Ελληνικά → Deutsch'}</small>
    </div>
    ${g.feedback?`<div class="game-banner ${g.feedback.ok?'win':'lose'} ${g.feedback.heartBreak?'heart-break':''} pop-in">
      ${esc(g.feedback.text|| (g.feedback.ok?t('gameLearnCorrect'):t('gameLearnWrong')))}
      ${g.feedback.hint?`<div class="learn-hint">${esc(g.feedback.hint)}</div>`:''}
    </div>`:''}
    <div class="learn-choices arcade-answers">${(g.choices||[]).map((c,i)=>`
      <button class="learn-choice ${g.feedback&&i===g.correct?'is-right':''} ${g.feedback&&!g.feedback.ok&&i===g.feedback.pick?'is-wrong':''}"
        type="button" data-learn-choice="${i}" ${g.lock?'disabled':''}><i>${String.fromCharCode(65+i)}</i><span>${esc(c)}</span></button>`).join('')}</div>
  </div>`;
}

function childQuizView(){
  const g=state.game; if(!g) return childGamesLobby();
  const total=g.deck.length;
  if(g.finished){
    const stars=g.score>=100?3:g.score>=50?2:1;
    return `<div class="game-shell quiz">
      <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button></div>
      ${gameShareBar(stars, `${t('gameWin')} · ${g.score} ${t('gameScore')}`)}
    </div>`;
  }
  return `<div class="game-shell quiz arcade-stage">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats">
        <span>${Math.min(g.i+1,total)}/${total}</span>
        <span>${t('gameScore')}: <b>${g.score}</b></span>
        <span>${t('gameStreak')}: <b>${g.streak}</b></span>
      </div></div>
    <div class="arcade-controls end">
      <button class="arcade-mode-btn ai" type="button" id="quizAi" ${g.loading?'disabled':''}>${g.loading?'…':`✨ ${t('gameLearnAi')}`}</button>
    </div>
    ${segmentedProgressHtml(g.i, total)}
    <div class="learn-prompt quiz-q quiz-pop"><b>${esc(g.q||'')}</b></div>
    ${g.feedback?`<div class="game-banner ${g.feedback.ok?'win':'lose'} pop-in">${g.feedback.ok?t('gameLearnCorrect'):`${t('gameLearnWrong')} ${esc(g.choices[g.correct]||'')}`}</div>`:''}
    <div class="learn-choices arcade-answers">${(g.choices||[]).map((c,i)=>`
      <button class="learn-choice ${g.feedback&&i===g.correct?'is-right':''} ${g.feedback&&!g.feedback.ok&&i===g.feedback.pick?'is-wrong':''}"
        type="button" data-quiz-choice="${i}" ${g.lock?'disabled':''}><i>${String.fromCharCode(65+i)}</i><span>${esc(c)}</span></button>`).join('')}</div>
  </div>`;
}

function childMathView(){
  const g=state.game; if(!g) return childGamesLobby();
  if(g.finished){
    const stars=g.score>=120?3:g.score>=60?2:1;
    return `<div class="game-shell math">
      <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button></div>
      ${gameShareBar(stars, `${t('gameCatchOver')} · ${g.score} ${t('gameScore')}`)}
    </div>`;
  }
  const lifeIcons='💚'.repeat(g.lives||0)+'🖤'.repeat(Math.max(0,3-(g.lives||0)));
  return `<div class="game-shell math arcade-stage level-${g.level||1}">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats">
        <span>${t('gameScore')}: <b id="mathScore">${g.score}</b></span>
        <span>${t('gameMathLevel')}: <b>${g.level||1}</b></span>
        <span>${t('gameMathLives')}: <b>${lifeIcons}</b></span>
        <span>${t('gameStreak')}: <b class="${g.comboBurst?'math-combo':''}">${g.streak}</b></span>
        <span>${t('gameTime')}: <b id="mathTime">${g.left}s</b></span>
      </div></div>
    <div class="learn-prompt math-q ${g.comboBurst?'combo-burst':''}"><b class="math-num">${esc(g.prompt)}</b><small>= ?</small></div>
    ${g.feedback?`<div class="game-banner ${g.feedback.ok?'win':'lose'} pop-in">${g.feedback.ok?t('gameLearnCorrect'):`${t('gameLearnWrong')} ${g.choices[g.correct]}`}</div>`:''}
    <div class="learn-choices math arcade-answers">${(g.choices||[]).map((c,i)=>`
      <button class="learn-choice ${g.feedback&&i===g.correct?'is-right':''} ${g.feedback&&!g.feedback.ok&&i===g.feedback.pick?'is-wrong':''}"
        type="button" data-math-choice="${i}" ${g.lock?'disabled':''}><i>${String.fromCharCode(65+i)}</i><span>${esc(String(c))}</span></button>`).join('')}</div>
  </div>`;
}

function childReactView(){
  const g=state.game; if(!g) return childGamesLobby();
  const phase=g.phase;
  const label = phase==='wait' ? t('gameReactWait')
    : phase==='go' ? t('gameReactGo')
    : phase==='early' ? t('gameReactEarly')
    : phase==='done' ? t('gameReactMs')(g.ms)
    : t('gamePlay');
  const best=g.best!=null?g.best:readGameBest('react');
  return `<div class="game-shell react">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats"><span>${t('gameBest')}: <b>${best?t('gameReactMs')(best):'—'}</b></span></div></div>
    <p class="game-play-hint">${esc(t('gameReactHintPlay'))}</p>
    <button class="react-pad ${phase}" type="button" id="reactPad">${esc(label)}</button>
    ${phase==='done'||phase==='early'?`<div class="row" style="margin-top:12px;gap:8px">
      <button class="btn" type="button" id="gameAgain">${t('gameAgain')}</button></div>`:''}
    ${phase==='idle'?`<button class="btn" type="button" id="reactStart" style="margin-top:12px">${t('gamePlay')}</button>`:''}
  </div>`;
}

function childRpsView(){
  const g=state.game; if(!g) return childGamesLobby();
  const picks=[['rock','✊',t('gameRpsRock')],['paper','✋',t('gameRpsPaper')],['scissors','✌️',t('gameRpsScissors')]];
  const resultLabel = g.result==='win'?t('gameWin'):g.result==='lose'?t('gameLose'):g.result==='draw'?t('gameDraw'):'';
  return `<div class="game-shell rps">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats"><span>🏆 ${g.wins}</span><span>🤝 ${g.draws}</span><span>💥 ${g.losses}</span></div></div>
    <p class="game-play-hint">${esc(t('gameRpsHintPlay'))}</p>
    <div class="rps-arena">
      <div class="rps-side"><div class="muted">${t('gameYou')}</div><div class="rps-emoji">${g.you?picks.find(p=>p[0]===g.you)[1]:'❔'}</div></div>
      <div class="rps-vs">VS</div>
      <div class="rps-side"><div class="muted">${t('gameCpu')}</div><div class="rps-emoji">${g.cpu?picks.find(p=>p[0]===g.cpu)[1]:'❔'}</div></div>
    </div>
    ${g.result?`<div class="game-banner ${g.result==='win'?'win':g.result==='lose'?'lose':'draw'} pop-in">${esc(resultLabel)}</div>`:''}
    <div class="rps-picks">${picks.map(([id,emoji,label])=>`
      <button class="rps-pick" type="button" data-rps="${id}"><span>${emoji}</span><b>${esc(label)}</b></button>`).join('')}</div>
  </div>`;
}

function childDiceView(){
  const g=state.game; if(!g) return childGamesLobby();
  const faces=['⚀','⚁','⚂','⚃','⚄','⚅'];
  return `<div class="game-shell dice">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats"><span>${t('gameDiceYou')}</span></div></div>
    <p class="game-play-hint">${esc(t('gameDiceHintPlay'))}</p>
    <div class="dice-face ${g.rolling?'rolling':''}" id="diceFace">${g.value?faces[g.value-1]:'🎲'}</div>
    <div class="dice-num">${g.value?`${t('gameDiceResult')}: ${g.value}`:'—'}</div>
    <button class="btn" type="button" id="diceRoll" ${g.rolling?'disabled':''}>${t('gameDiceRoll')}</button>
    ${g.history.length?`<div class="dice-hist muted">${g.history.slice(0,6).join(' · ')}</div>`:''}
  </div>`;
}

function nextColorRound(g){
  const pool=[...COLOR_OPTS];
  shuffleInPlace(pool);
  g.target=pool[0];
  g.choices=shuffleInPlace(pool.slice(0,4));
}

function childSimonView(){
  const g=state.game; if(!g) return childGamesLobby();
  const banner = g.phase==='show' ? t('gameSimonWatch')
    : g.phase==='input' ? t('gameSimonGo')
    : g.phase==='fail' ? t('gameSimonFail')
    : g.phase==='idle' ? t('gameSimonHintPlay')
    : '';
  const best=readGameBest('simon');
  return `<div class="game-shell simon">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats">
        <span>${t('gameLevel')}: <b>${g.level||0}</b></span>
        <span>${t('gameBest')}: <b>${best||0}</b></span>
      </div></div>
    <p class="game-play-hint">${esc(banner)}</p>
    <div class="simon-grid">${SIMON_PADS.map(p=>`
      <button class="simon-pad ${p.cls}${g.lit===p.id?' lit ripple':''}${g.phase==='show'?' tempo':''}" type="button" data-simon="${p.id}"
        aria-label="${esc(t(p.labelKey))}" ${g.phase!=='input'?'disabled':''}></button>`).join('')}</div>
    ${g.phase==='idle'||g.phase==='fail'?`<button class="btn" type="button" id="simonStart">${g.phase==='fail'?t('gameAgain'):t('gamePlay')}</button>`:''}
  </div>`;
}

function childColorsView(){
  const g=state.game; if(!g) return childGamesLobby();
  if(g.finished){
    return `<div class="game-shell colors">
      <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button></div>
      <div class="game-banner win pop-in">${t('gameCatchOver')} · ${t('gameScore')}: ${g.score}</div>
      <button class="btn" type="button" id="gameAgain">${t('gameAgain')}</button>
    </div>`;
  }
  const target=g.target;
  return `<div class="game-shell colors">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats">
        <span>${t('gameScore')}: <b id="colorScore">${g.score}</b></span>
        <span>${t('gameTime')}: <b id="colorTime">${g.left}s</b></span>
      </div></div>
    <p class="game-play-hint">${esc(t('gameColorsHintPlay'))}</p>
    <div class="color-prompt">${esc(t('gameColorsTap'))} ${esc(t(target.labelKey))}
      <small>${esc(t('gameBest'))}: ${readGameBest('colors')||0}</small></div>
    <div class="color-grid">${g.choices.map(c=>`
      <button class="color-btn" type="button" data-color="${c.id}" style="background:${c.hex}">${esc(t(c.labelKey))}</button>`).join('')}</div>
  </div>`;
}

function playSimonSequence(){
  const g=state.game; if(!g || state.gameId!=='simon') return;
  stopChildGameTimers();
  g.phase='show'; g.input=[]; g.lit=null;
  render();
  let i=0;
  const step=()=>{
    if(!state.game || state.gameId!=='simon') return;
    if(i>=g.seq.length){
      g.phase='input'; g.lit=null; render(); return;
    }
    g.lit=g.seq[i];
    render();
    g._cpu=setTimeout(()=>{
      if(!state.game || state.gameId!=='simon') return;
      state.game.lit=null;
      render();
      i += 1;
      g._cpu=setTimeout(step, 220);
    }, 480);
  };
  g._cpu=setTimeout(step, 350);
}

function simonAdvance(){
  const g=state.game; if(!g) return;
  const next=SIMON_PADS[Math.floor(Math.random()*SIMON_PADS.length)].id;
  g.seq=[...g.seq, next];
  g.level=g.seq.length;
  writeGameBest('simon', g.level);
  playSimonSequence();
}

function bindChildGames(root){
  root.querySelectorAll('[data-game]').forEach(btn=>{
    btn.onclick=()=>{ feedback('select'); startChildGame(btn.dataset.game); };
  });
  const back=root.querySelector('#gameBack');
  if(back) back.onclick=()=>{ feedback('select'); leaveChildGame(); };
  const again=root.querySelector('#gameAgain');
  if(again) again.onclick=()=>{ feedback('save'); startChildGame(state.gameId); };

  root.querySelector('#gameShareMoment')?.addEventListener('click', ()=>{
    feedback('select');
    sheetGameShareMoment();
  });

  if(state.gameId==='learn'){
    root.querySelectorAll('[data-learn-mode]').forEach(btn=>{
      btn.onclick=()=>{
        const g=state.game; if(!g || g.loading) return;
        const mode=btn.dataset.learnMode;
        if(mode===g.mode) return;
        feedback('select');
        stopChildGameTimers();
        state.game = makeLearnGame(mode, g.deck, g.topic);
        render();
      };
    });
    root.querySelectorAll('[data-learn-topic]').forEach(btn=>{
      btn.onclick=()=>{
        const g=state.game; if(!g || g.loading) return;
        const topic=btn.dataset.learnTopic;
        if(topic===g.topic) return;
        feedback('select');
        writeLearnTopic(topic);
        stopChildGameTimers();
        let deck;
        if(topic==='weak'){
          const weak=readLearnWeak();
          deck = weak.length>=4 ? pickLearnDeck(weak, LEARN_SESSION, 'all') : pickLearnDeck(LEARN_VOCAB, LEARN_SESSION, 'all');
        }else{
          deck = pickLearnDeck(LEARN_VOCAB, LEARN_SESSION, topic);
        }
        state.game = makeLearnGame(g.mode, deck, topic);
        render();
      };
    });
    const topicSelect=root.querySelector('#learnTopicSelect');
    if(topicSelect){
      topicSelect.onchange=()=>{
        const g=state.game; if(!g || g.loading) return;
        const topic=topicSelect.value;
        if(topic===g.topic) return;
        feedback('select');
        writeLearnTopic(topic);
        stopChildGameTimers();
        let deck;
        if(topic==='weak'){
          const weak=readLearnWeak();
          deck = weak.length>=4 ? pickLearnDeck(weak, LEARN_SESSION, 'all') : pickLearnDeck(LEARN_VOCAB, LEARN_SESSION, 'all');
        }else{
          deck = pickLearnDeck(LEARN_VOCAB, LEARN_SESSION, topic);
        }
        state.game = makeLearnGame(g.mode, deck, topic);
        render();
      };
    }
    root.querySelector('#learnAi')?.addEventListener('click',()=>{ feedback('select'); fetchLearnAiCards(); });
    root.querySelectorAll('[data-learn-choice]').forEach(btn=>{
      btn.onclick=()=> answerLearn(Number(btn.dataset.learnChoice));
    });
  }

  if(state.gameId==='quiz'){
    root.querySelector('#quizAi')?.addEventListener('click',()=>{ feedback('select'); fetchQuizAiRound(); });
    root.querySelectorAll('[data-quiz-choice]').forEach(btn=>{
      btn.onclick=()=> answerQuiz(Number(btn.dataset.quizChoice));
    });
  }

  if(state.gameId==='island'){
    root.querySelectorAll('[data-island-choice]').forEach(btn=>{
      btn.onclick=()=> answerIsland(Number(btn.dataset.islandChoice));
    });
  }

  if(state.gameId==='eduhub'){
    root.querySelectorAll('[data-edu]').forEach(btn=>{
      btn.onclick=()=>{
        if(!state.game) return;
        feedback('select');
        state.game.embed = btn.dataset.edu;
        render();
      };
    });
    root.querySelector('#eduClose')?.addEventListener('click', ()=>{
      if(!state.game) return;
      state.game.embed = null;
      feedback('select');
      render();
    });
  }

  if(state.gameId==='math'){
    const g=state.game;
    root.querySelectorAll('[data-math-choice]').forEach(btn=>{
      btn.onclick=()=> answerMath(Number(btn.dataset.mathChoice));
    });
    if(g && !g.finished && !g._timer){
      g._timer=setInterval(()=>{
        if(!state.game || state.gameId!=='math'){ stopChildGameTimers(); return; }
        state.game.left -= 1;
        const el=document.getElementById('mathTime');
        if(el) el.textContent=`${Math.max(0,state.game.left)}s`;
        if(state.game.left<=0){
          stopChildGameTimers();
          state.game.left=0;
          state.game.finished=true;
          writeGameBest('math', state.game.score);
          tryGrantGameWin('math', state.game, state.game.score>=60);
          render();
        }
      }, 1000);
    }
  }

  if(state.gameId==='memory'){
    root.querySelectorAll('.memory-card[data-i]').forEach(btn=>{
      btn.onclick=()=>{
        const g=state.game; if(!g||g.lock||g.finished) return;
        const i=Number(btn.dataset.i), card=g.deck[i];
        if(!card || card.open || card.done) return;
        card.open=true; g.open.push(i); feedback('select');
        if(g.open.length<2){ render(); return; }
        g.moves += 1; g.lock=true;
        const [a,b]=g.open, ca=g.deck[a], cb=g.deck[b];
        if(ca.pair===cb.pair){
          ca.done=cb.done=true; ca.justMatched=cb.justMatched=true;
          g.pairs += 1; g.streak=(g.streak||0)+1; g.open=[]; g.lock=false; feedback('save');
          if(g.pairs>=MEMORY_EMOJIS.length) tryGrantGameWin('memory', g, true);
          render();
          setTimeout(()=>{
            if(!state.game || state.gameId!=='memory') return;
            state.game.deck.forEach(c=>c.justMatched=false);
            render();
          }, 420);
        }else{
          g.streak=0;
          render();
          setTimeout(()=>{
            if(!state.game || state.gameId!=='memory') return;
            ca.open=cb.open=false; state.game.open=[]; state.game.lock=false; render();
          }, 700);
        }
      };
    });
  }

  if(state.gameId==='tac'){
    root.querySelectorAll('.tac-cell[data-i]').forEach(btn=>{
      btn.onclick=()=>{
        const g=state.game; if(!g||g.status!=='play'||g.turn!=='x') return;
        const i=Number(btn.dataset.i); if(g.board[i]) return;
        g.board[i]='x'; feedback('select');
        const hit=tacWinnerLine(g.board);
        if(hit?.winner==='x'){ g.status='win'; g.winner='x'; g.line=hit.line; writeGameBest('tac', readGameBest('tac')+1); tryGrantGameWin('tac', g, true); feedback('save'); render(); return; }
        if(hit?.winner==='draw'){ g.status='draw'; render(); return; }
        g.turn='o'; render();
        g._cpu=setTimeout(tacCpuMove, 380);
      };
    });
  }

  if(state.gameId==='catch'){
    const g=state.game;
    if(g && !g.finished && g.left>0){
      if(!g.fish.length){ spawnCatchFish(g); spawnCatchFish(g); }
      paintCatchFishLayer();
      if(!g._timer){
        g._timer=setInterval(()=>{
          if(!state.game || state.gameId!=='catch'){ stopChildGameTimers(); return; }
          state.game.left -= 1;
          const timeEl=document.getElementById('catchTime');
          if(timeEl) timeEl.textContent=`${Math.max(0,state.game.left)}s`;
          if(state.game.left<=0){
            stopChildGameTimers();
            state.game.left=0;
            state.game.finished=true;
            writeGameBest('catch', state.game.score);
            tryGrantGameWin('catch', state.game, state.game.score>=30);
            render();
          }
        }, 1000);
      }
      if(!g._raf){
        g._last=0;
        g._raf=requestAnimationFrame(tickCatch);
      }
    }
  }

  if(state.gameId==='react'){
    const g=state.game;
    const start=()=>{
      if(!g) return;
      stopChildGameTimers();
      g.phase='wait'; g.ms=null; g.early=false; g.startedAt=0;
      render();
      const delay=1200+Math.random()*2200;
      g._cpu=setTimeout(()=>{
        if(!state.game || state.gameId!=='react') return;
        state.game.phase='go';
        state.game.startedAt=performance.now();
        render();
      }, delay);
    };
    root.querySelector('#reactStart')?.addEventListener('click',()=>{ feedback('select'); start(); });
    root.querySelector('#reactPad')?.addEventListener('click',()=>{
      if(!g) return;
      if(g.phase==='idle'){ feedback('select'); start(); return; }
      if(g.phase==='wait'){
        stopChildGameTimers();
        g.phase='early'; g.early=true; feedback('error'); render(); return;
      }
      if(g.phase==='go'){
        const ms=Math.round(performance.now()-g.startedAt);
        g.ms=ms; g.phase='done';
        pushGameHistory('react', ms);
        const prev=readGameBest('react');
        // Lower ms is better — store inverted score helper: best = min ms
        if(!prev || ms<prev){
          try{ localStorage.setItem(gameBestKey('react'), String(ms)); }catch{}
          g.best=ms;
        }else g.best=prev;
        feedback('save'); render();
      }
    });
  }

  if(state.gameId==='rps'){
    const beats={rock:'scissors', paper:'rock', scissors:'paper'};
    root.querySelectorAll('[data-rps]').forEach(btn=>{
      btn.onclick=()=>{
        const g=state.game; if(!g) return;
        const you=btn.dataset.rps;
        const opts=['rock','paper','scissors'];
        const cpu=opts[Math.floor(Math.random()*3)];
        g.you=you; g.cpu=cpu;
        if(you===cpu){ g.result='draw'; g.draws++; }
        else if(beats[you]===cpu){ g.result='win'; g.wins++; writeGameBest('rps', g.wins); feedback('save'); }
        else { g.result='lose'; g.losses++; }
        feedback('select'); render();
      };
    });
  }

  if(state.gameId==='dice'){
    root.querySelector('#diceRoll')?.addEventListener('click',()=>{
      const g=state.game; if(!g || g.rolling) return;
      g.rolling=true; render();
      feedback('select');
      let ticks=0;
      const spin=setInterval(()=>{
        if(!state.game || state.gameId!=='dice'){ clearInterval(spin); return; }
        state.game.value=1+Math.floor(Math.random()*6);
        const face=document.getElementById('diceFace');
        if(face) face.textContent=['⚀','⚁','⚂','⚃','⚄','⚅'][state.game.value-1];
        ticks++;
        if(ticks>=10){
          clearInterval(spin);
          state.game.rolling=false;
          state.game.history=[state.game.value, ...state.game.history].slice(0,8);
          writeGameBest('dice', Math.max(readGameBest('dice'), state.game.value));
          feedback('save');
          render();
        }
      }, 70);
    });
  }

  if(state.gameId==='simon'){
    const g=state.game;
    root.querySelector('#simonStart')?.addEventListener('click',()=>{
      if(!g) return;
      feedback('select');
      g.seq=[]; g.input=[]; g.level=0; g.finished=false; g.phase='idle';
      simonAdvance();
    });
    root.querySelectorAll('[data-simon]').forEach(btn=>{
      btn.onclick=()=>{
        if(!g || g.phase!=='input') return;
        const id=btn.dataset.simon;
        g.lit=id; feedback('select'); render();
        setTimeout(()=>{
          if(!state.game || state.gameId!=='simon') return;
          state.game.lit=null; render();
        }, 160);
        g.input.push(id);
        const idx=g.input.length-1;
        if(g.input[idx]!==g.seq[idx]){
          g.phase='fail'; g.finished=true; feedback('error'); render(); return;
        }
        if(g.input.length===g.seq.length){
          feedback('save');
          tryGrantGameWin('simon', g, g.seq.length>=5);
          setTimeout(()=>{
            if(!state.game || state.gameId!=='simon') return;
            simonAdvance();
          }, 420);
        }
      };
    });
  }

  if(state.gameId==='colors'){
    const g=state.game;
    if(g && !g.finished && g.left>0 && !g._timer){
      g._timer=setInterval(()=>{
        if(!state.game || state.gameId!=='colors'){ stopChildGameTimers(); return; }
        state.game.left -= 1;
        const timeEl=document.getElementById('colorTime');
        if(timeEl) timeEl.textContent=`${Math.max(0,state.game.left)}s`;
        if(state.game.left<=0){
          stopChildGameTimers();
          state.game.left=0;
          state.game.finished=true;
          writeGameBest('colors', state.game.score);
          render();
        }
      }, 1000);
    }
    root.querySelectorAll('[data-color]').forEach(btn=>{
      btn.onclick=()=>{
        if(!g || g.finished) return;
        if(btn.dataset.color===g.target.id){
          g.score += 1; feedback('save');
          nextColorRound(g); render();
        }else{
          g.score=Math.max(0,g.score-1); feedback('error'); render();
        }
      };
    });
  }
}

function staffEventsView(){
  const events=[...DB.events].sort((a,b)=>(a.date+a.from).localeCompare(b.date+b.from));
  const published=events.filter(e=>e.status==='published').length, drafts=events.length-published;
  return `<section class="events-overview">
      <div><div class="brand-kicker">ARMONIA THASSOS</div><h2>🎉 ${t('eventsPanel')}</h2><div class="muted">${t('announceHint')}</div></div>
      <div class="events-summary">
        <div><b>${events.length}</b><span>${t('eventsSoon')}</span></div>
        <div><b>${published}</b><span>${t('published')}</span></div>
        <div><b>${drafts}</b><span>${t('eventDraft')}</span></div>
      </div>
    </section>
    <div class="events-toolbar">
      <div class="muted">${events.length ? T[state.lang].eventCollection(events.length) : t('noStaffEvents')}</div>
      <button class="btn sm" id="addEvent">＋ ${t('newEvent')}</button>
    </div>
    ${events.length ? `<div class="events-grid">${events.map(e=>{
      const d=new Date(e.date+'T12:00:00');
      return `<article class="event-staff-card" style="--event-color:${esc(e.color||'#2f5a63')}">
        <button class="mini-x event-delete" data-event-delete="${esc(e.id)}" type="button" aria-label="${esc(t('deleteEvent'))}">×</button>
        <div class="event-staff-top">
          <div class="event-date event-date-rich"><span>${DAY_NAMES[state.lang][dowIdx(d)]}</span><b>${d.getDate()}</b><span>${esc(eventDayLabel(e.date))}</span></div>
          <div class="event-card-emoji">${esc(e.emoji||'🎉')}</div>
        </div>
        <button class="event-staff-main" data-event="${esc(e.id)}" type="button">
          <h3>${esc(L(e))}</h3>
          <p>${esc(L(e.description)||t('announceHint'))}</p>
          <div class="event-details">
            <span class="event-detail">🕒 ${esc(e.from)}–${esc(e.to)}</span>
            <span class="event-detail">📍 ${esc(e.location||'—')}</span>
            <span class="event-detail">👧 ${T[state.lang].kidsCount((e.childIds||[]).length)}</span>
          </div>
          <div class="event-footer">
            <span class="event-people">👤 ${esc(employeeNames(e)||'—')}</span>
            <span class="event-status ${e.status==='published'?'published':'draft'}"><i></i>${e.status==='published'?t('published'):t('eventDraft')}</span>
          </div>
        </button>
      </article>`;}).join('')}</div>` : `<div class="empty">${t('noStaffEvents')}</div>`}`;
}

function sheetEvent(existing=null, presets={}){
  const e=existing || {
    id:null, de:presets.title||'', el:presets.title||'', description:{de:'',el:''},
    date:presets.date||state.date, from:presets.from||'16:00', to:presets.to||'18:00',
    location:presets.location||'', employeeIds:presets.employeeIds||[presets.employeeId||state.user?.id].filter(Boolean),
    employeeId:presets.employeeId||state.user?.id||'',
    childIds:[...(presets.childIds||[])], bring:{de:'',el:''}, emoji:'🎉', color:'#2f5a63',
    status:'published', featured:false, scheduleEntryId:presets.scheduleEntryId||null,
    scheduleDate:presets.scheduleDate||null,
  };
  let pickedKids=[...(e.childIds||[])];
  openSheet(`<div class="event-editor-head"><div class="event-editor-icon">${esc(e.emoji||'🎉')}</div>
      <div><h3 style="margin:0">${existing?t('editEvent'):t('newEvent')}</h3><div class="muted">${t('announceHint')}</div></div></div>
    <div class="row" style="gap:10px">
      <label class="f" style="width:74px"><span>${t('eventEmoji')}</span><input id="evEmoji" maxlength="3" value="${esc(e.emoji||'🎉')}"></label>
      <label class="f grow"><span>${t('eventTitle')}</span><input id="evTitle" value="${esc(L(e))}" required></label>
    </div>
    <label class="f"><span>${t('eventDescription')}</span><textarea id="evDesc" rows="2">${esc(L(e.description))}</textarea></label>
    <div class="row" style="gap:10px">
      <label class="f grow"><span>${t('today')}</span><input type="date" id="evDate" value="${esc(e.date)}"></label>
      <label class="f grow"><span>${t('timeFrom')}</span><input type="time" id="evFrom" value="${esc(e.from)}"></label>
      <label class="f grow"><span>${t('timeTo')}</span><input type="time" id="evTo" value="${esc(e.to)}"></label>
    </div>
    <label class="f"><span>${t('eventLocation')}</span><input id="evLocation" value="${esc(e.location||'')}"></label>
    <label class="f"><span>${t('eventBring')}</span><input id="evBring" value="${esc(L(e.bring))}"></label>
    ${entrySec('👤', t('person'), t('chooseMany'))}
    <div class="check-grid" id="evPeople">
      ${DB.employees.map(p=>personOptionHtml(p, entryEmployeeIds(e).includes(p.id))).join('')}
    </div>
    ${entrySec('👶', t('children'))}
    <div class="chips" id="evKids" style="margin:-4px 0 12px">
      ${DB.children.map(c=>kidChipHtml(c, pickedKids.includes(c.id))).join('')}
    </div>
    <label class="row card event-publish-card"><input type="checkbox" id="evPublish" style="width:auto" ${e.status==='published'?'checked':''}>
      <div><div class="strong">📣 ${t('publishEvent')}</div><div class="muted">${t('announceHint')}</div></div></label>
    <div id="evStatus"></div><button class="btn" id="evSave">💾 ${t('saveWithPin')}</button>`);
  const paintEvKids=()=>{
    const box=sheetEl.querySelector('#evKids');
    box.innerHTML=DB.children.map(c=>kidChipHtml(c, pickedKids.includes(c.id))).join('');
    box.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{
      const id=b.dataset.c; pickedKids=pickedKids.includes(id)?pickedKids.filter(x=>x!==id):[...pickedKids,id];
      feedback('select'); paintEvKids();
    });
  };
  paintEvKids();
  sheetEl.querySelectorAll('#evPeople .check-option').forEach(label=>label.addEventListener('change',()=>feedback('select')));
  sheetEl.querySelector('#evSave').onclick=()=>{
    const title=sheetEl.querySelector('#evTitle').value.trim();
    const date=sheetEl.querySelector('#evDate').value, from=sheetEl.querySelector('#evFrom').value, to=sheetEl.querySelector('#evTo').value;
    const statusEl=sheetEl.querySelector('#evStatus');
    const description=sheetEl.querySelector('#evDesc').value.trim();
    const location=sheetEl.querySelector('#evLocation').value.trim();
    const bring=sheetEl.querySelector('#evBring').value.trim();
    const emoji=sheetEl.querySelector('#evEmoji').value.trim()||'🎉';
    const publish=!!sheetEl.querySelector('#evPublish').checked;
    const employeeIds=[...sheetEl.querySelectorAll('#evPeople input:checked')].map(x=>x.value);
    if(!title || !date || !from || !to || !pickedKids.length){ feedback('error'); setStatus(statusEl,t('eventRequired'),'error'); return; }
    if(to<=from){ feedback('error'); setStatus(statusEl,t('invalidTime'),'error'); return; }
    askPin(t('saveWithPin'),who=>{
      const value={...e,id:e.id||'ev'+uid(),de:title,el:title,
        description:{de:description,el:description},
        date,from,to,location,
        employeeIds:[...employeeIds],childIds:[...pickedKids],
        bring:{de:bring,el:bring},
        emoji,status:publish?'published':'draft'};
      value.employeeId=value.employeeIds[0]||who.id;
      if(!value.employeeIds.length) value.employeeIds=[value.employeeId];
      const idx=DB.events.findIndex(x=>x.id===value.id);
      if(idx>=0) DB.events[idx]=value; else DB.events.push(value);
      logEntry('EVENT',`${value.status==='published'?t('eventPublished'):t('eventSaved')}: ${title}`);
      if(!save()) return;
      closeSheet();render();toast(value.status==='published'?t('eventPublished'):t('eventSaved'),'success');
      if(value.status==='published') sendEventWhatsapp(value);
    });
  };
}

function completionFor(dateStr,entryId,employeeId){
  return (DB.taskCompletions||[]).find(x=>x.date===dateStr && x.entryId===entryId && x.employeeId===employeeId);
}

function dashboardDates(startOffset,endOffset){
  const out=[];
  for(let offset=startOffset;offset<=endOffset;offset++){
    const d=new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate()+offset); out.push(iso(d));
  }
  return out;
}

function dashboardAssignments(dateStr,employeeId){
  return entriesFor(dateStr).filter(e=>!e.cancelled && entryEmployeeIds(e).includes(employeeId));
}

function dashboardTaskCard(e,dateStr,employeeId,{overdue=false,readonly=false}={}){
  const done=!!completionFor(dateStr,e.id,employeeId), a=act(e.activityId);
  return `<div class="task-row ${overdue?'overdue':''} ${done?'done':''}">
    ${readonly?`<span class="task-check" style="display:grid;place-items:center;color:#64748b">?</span>`:`<button class="task-check" type="button" data-task="${esc(e.id)}" data-task-date="${esc(dateStr)}"
      data-task-employee="${esc(employeeId)}" aria-label="${esc(done?t('markOpen'):t('markDone'))}" title="${esc(done?t('markOpen'):t('markDone'))}">${done?'✓':''}</button>
    `}
    <div class="grow">
      <div class="strong">${esc(a?.emoji||'📝')} ${esc(actLabel(e.activityId))}</div>
      <div class="muted">${esc(eventDayLabel(dateStr))} · ${esc(entryTime(e))}${entryHouseIds(e).length?' · 🏠 '+esc(houseNames(e)):''}</div>
      ${(e.childIds||[]).length?`<div class="muted">👥 ${esc(kidNames(e.childIds))}</div>`:''}
      ${e.note?`<div class="muted">📝 ${esc(e.note)}</div>`:''}
    </div>
  </div>`;
}

function homeEventCard(e){
  return `<button class="task-row event-card" data-event="${esc(e.id)}" style="--event-color:${esc(e.color||'#2f5a63')};width:100%;text-align:left;cursor:pointer" type="button">
    <div class="event-date"><span>${DAY_NAMES[state.lang][dowIdx(new Date(e.date+'T12:00:00'))]}</span><b>${new Date(e.date+'T12:00:00').getDate()}</b></div>
    <div class="grow"><div class="strong">${esc(e.emoji||'🎉')} ${esc(L(e))}</div>
      <div class="muted">${esc(e.from)}–${esc(e.to)} · 📍 ${esc(e.location||'—')}</div>
      <div class="muted">👤 ${esc(employeeNames(e))} · ${T[state.lang].kidsCount((e.childIds||[]).length)}</div>
      <span class="pill ${e.status==='published'?'in':'gray'}" style="margin-top:5px">${e.status==='published'?t('published'):t('eventDraft')}</span>
    </div>
  </button>`;
}

function employeeShiftSummary(employeeId,dateStr){
  const day=dowIdx(new Date(dateStr+'T12:00:00')), shifts=shiftsOf(employeeId,day);
  if(!shifts.length) return '—';
  return shifts.map(s=>s.type==='OFF'?t('off'):s.type==='H24'?`${s.from} · ${t('h24')}`:`${s.from}–${s.to}`).join(', ');
}

function adminTeamPanel(today){
  if(!isAdminUser()) return '';
  const dates=dashboardDates(0,6);
  const issues=weekDates(today).flatMap(dateStr=>validateDay(dateStr).map(issue=>({...issue,dateStr})));
  const team=DB.employees.map(person=>{
    const todayItems=dashboardAssignments(today,person.id);
    const nextItems=dates.flatMap(dateStr=>dashboardAssignments(dateStr,person.id).map(e=>({e,dateStr})));
    const done=todayItems.filter(e=>completionFor(today,e.id,person.id)).length;
    const next=nextItems[0];
    return `<button class="admin-person" data-admin-staff="${person.id}" type="button">
      <div class="admin-person-top"><div class="pa avatar" style="background:${safeColor(person.color)}">${initials(person.name)}</div>
        <div class="grow"><div class="admin-person-name">${esc(person.name)}${person.admin?'<span class="admin-badge">ADMIN</span>':''}</div>
          <div class="admin-person-role">${esc(L(person.role))} · ${esc(employeeShiftSummary(person.id,today))}</div></div></div>
      <div class="admin-person-stats"><span><b>${todayItems.length}</b>${t('adminToday')}</span><span><b>${nextItems.length}</b>${t('adminNext7')}</span></div>
      <div class="admin-person-next">${next?`${esc(eventDayLabel(next.dateStr))} · ${esc(actLabel(next.e.activityId))}`:`✓ ${t('noTasks')}`}</div>
      ${done?`<div class="muted" style="margin-top:5px">✓ ${done} ${t('adminDone')}</div>`:''}
    </button>`;
  }).join('');
  const rewardCenter = viewAdminRewardCenter();
  return `<section class="card admin-center">
    <div class="admin-center-head"><div><div class="brand-kicker">ARMONIA THASSOS</div><h2>👑 ${t('adminCenter')}</h2>
      <div class="muted">${t('adminOverview')}</div></div><div class="admin-crown">🛡️</div></div>
    <div class="admin-actions">
      <button class="btn sm" data-admin-go="week">📅 ${t('adminEditPlan')}</button>
      <button class="btn sm sec" data-admin-go="shift">🕒 ${t('adminEditShifts')}</button>
      <button class="btn sm sec" data-admin-go="events">🎉 ${t('adminManageEvents')}</button>
      <button class="btn sm sec" data-admin-go="audit">📖 ${t('adminOpenAudit')}</button>
      <button class="btn sm sec" data-admin-broadcast type="button">✉️ ${t('adminNotifyPanel')}</button>
      <button class="btn sm sec" data-admin-automations type="button">⚙️ ${t('adminAutomations')}</button>
    </div>
    <div class="admin-alert-strip ${issues.length?'':'clear'}"><span>${issues.length?'⚠️':'✅'}</span><div class="grow"><b>${issues.length?`${issues.length} · ${t('adminWarnings')}`:t('adminAllClear')}</b>
      <div style="margin-top:2px">${t('adminFullControl')}</div></div></div>
    <div class="admin-team-grid">${team}</div>
  </section>
  ${rewardCenter}`;
}

async function sheetBroadcastEmail(){
  if(!isAdminUser()){toast(t('adminRequired'),'error');return;}
  const draft=state._broadcastDraft||{};
  state._broadcastDraft=null;
  let audience=draft.audience||'all';
  if(audience==='child'||audience==='kids') audience='children';
  let mailLang=state.lang==='el'?'el':'de';
  let recipientCount=0;
  let emailConfigured=true;
  const paintPreview=()=>{
    const box=sheetEl.querySelector('#broadcastPreview');
    if(!box) return;
    const subject=String(sheetEl.querySelector('#broadcastSubject')?.value||'').trim()||'—';
    const title=String(sheetEl.querySelector('#broadcastTitle')?.value||'').trim()||subject;
    const message=String(sheetEl.querySelector('#broadcastMessage')?.value||'').trim()||'…';
    const who=state.user?.name||'Admin';
    box.innerHTML=`<div class="broadcast-preview-card">
      <div class="bp-kicker">${esc(t('adminBroadcastPreview'))} · ${mailLang.toUpperCase()}</div>
      <b>${esc(title)}</b>
      <div class="muted">${esc(who)} · ${esc(audience)}</div>
      <p>${esc(message)}</p>
      <div class="muted bp-sub">${esc(subject)}</div>
    </div>`;
  };
  const refreshCount=async()=>{
    const countEl=sheetEl.querySelector('#broadcastCount');
    if(countEl) countEl.textContent='…';
    try{
      const response=await fetch('/api/notify/broadcast-preview',{
        method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
        body:JSON.stringify({audience}),
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.error||String(response.status));
      recipientCount=Number(data.count||0);
      emailConfigured=data.emailConfigured!==false;
      if(countEl){
        countEl.textContent=recipientCount?t('adminBroadcastRecipients')(recipientCount):t('adminBroadcastNone');
        countEl.className=`status-box ${recipientCount&&emailConfigured?'success':emailConfigured?'':'error'}`;
        countEl.style.display='block';
      }
    }catch(error){
      console.error('Broadcast preview failed',error);
      if(countEl){
        countEl.textContent=t('adminBroadcastFailed');
        countEl.className='status-box error';
        countEl.style.display='block';
      }
    }
  };
  openSheet(`<div class="admin-detail-hero"><div class="pa avatar" style="background:linear-gradient(145deg,#2a6b52,#2f5a63)">✉️</div>
    <div class="grow"><div class="muted">ARMONIA THASSOS</div><h3 style="margin:1px 0">${esc(t('adminBroadcastTitle'))}</h3>
      <div class="muted">${esc(t('adminNotifyPanelHint'))}</div></div></div>
    <label class="f"><span>${t('adminBroadcastAudience')}</span>
      <select id="broadcastAudience">
        <option value="all" ${audience==='all'?'selected':''}>${esc(t('adminBroadcastAll'))}</option>
        <option value="staff" ${audience==='staff'?'selected':''}>${esc(t('adminBroadcastStaff'))}</option>
        <option value="children" ${audience==='children'?'selected':''}>${esc(t('adminBroadcastChildren'))}</option>
      </select></label>
    <label class="f"><span>${t('adminBroadcastLang')}</span>
      <select id="broadcastLang">
        <option value="de" ${mailLang==='de'?'selected':''}>Deutsch</option>
        <option value="el" ${mailLang==='el'?'selected':''}>Ελληνικά</option>
      </select></label>
    <div id="broadcastCount" class="status-box" style="display:none;margin:8px 0 12px" role="status"></div>
    <label class="f"><span>${t('adminBroadcastSubject')}</span>
      <input type="text" id="broadcastSubject" maxlength="160" value="${esc(draft.subject||'')}" placeholder="Armonia Thassos – …"></label>
    <label class="f"><span>${t('adminBroadcastHeadline')}</span>
      <input type="text" id="broadcastTitle" maxlength="120" value="${esc(draft.title||'')}" placeholder="${esc(t('adminBroadcastHeadline'))}"></label>
    <label class="f"><span>${t('adminBroadcastMessage')}</span>
      <textarea id="broadcastMessage" rows="6" maxlength="4000" placeholder="…">${esc(draft.message||'')}</textarea></label>
    <div id="broadcastPreview" class="broadcast-preview" aria-live="polite"></div>
    <label class="f" style="flex-direction:row;align-items:center;gap:10px;margin:8px 0">
      <input type="checkbox" id="broadcastAlsoBanner" checked>
      <span>${esc(t('adminBroadcastAlsoBanner'))}</span>
    </label>
    <div id="broadcastStatus" class="status-box" style="display:none;margin:10px 0" role="status"></div>
    <button class="btn" type="button" id="broadcastSend">${t('adminBroadcastSend')}</button>`);
  const audienceEl=sheetEl.querySelector('#broadcastAudience');
  const langEl=sheetEl.querySelector('#broadcastLang');
  audienceEl.onchange=()=>{audience=audienceEl.value;refreshCount();paintPreview();};
  langEl.onchange=()=>{mailLang=langEl.value;paintPreview();};
  ['broadcastSubject','broadcastTitle','broadcastMessage'].forEach(id=>{
    sheetEl.querySelector('#'+id)?.addEventListener('input', paintPreview);
  });
  refreshCount();
  paintPreview();
  sheetEl.querySelector('#broadcastSend').onclick=()=>{
    const subject=String(sheetEl.querySelector('#broadcastSubject')?.value||'').trim();
    const title=String(sheetEl.querySelector('#broadcastTitle')?.value||'').trim()||subject;
    const message=String(sheetEl.querySelector('#broadcastMessage')?.value||'').trim();
    const statusEl=sheetEl.querySelector('#broadcastStatus');
    if(!subject||!message){
      toast(t('adminBroadcastNeedFields'),'error');
      return;
    }
    if(!emailConfigured){
      toast(t('adminBroadcastOffline'),'error',5200);
      return;
    }
    if(!recipientCount){
      toast(t('adminBroadcastNone'),'error');
      return;
    }
    const payload={audience,subject,title,message,lang:mailLang};
    const expected=recipientCount;
    askPin(t('adminBroadcastConfirm')(expected), async()=>{
      try{
        const response=await fetch('/api/notify/broadcast',{
          method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
          body:JSON.stringify(payload),
        });
        const data=await response.json().catch(()=>({}));
        if(response.status===429){
          toast(t('adminBroadcastRate')(data.retryInSec||45),'error');
          return;
        }
        if(response.status===503||data.code==='email_not_configured'){
          toast(t('adminBroadcastOffline'),'error',5200);
          return;
        }
        if(!response.ok){
          throw new Error(data.error||String(response.status));
        }
        const sent=Number(data.sent||0), failed=Number(data.failed||0);
        logEntry('ADMIN',`${t('adminEmailEveryone')}: ${subject} · ${sent}/${data.total||expected}`);
        const alsoBanner=!!sheetEl.querySelector('#broadcastAlsoBanner')?.checked;
        if(alsoBanner && sent){
          publishTeamNotice({audience, subject, title, message});
        }
        toast(t('adminBroadcastSent')(sent,failed), sent?'success':'error', 5200);
        if(sent) closeSheet();
      }catch(error){
        console.error('Broadcast send failed',error);
        toast(t('adminBroadcastFailed'),'error',5200);
      }
    }, {requirePin:true});
  };
}

function sheetAdminStaff(employeeId){
  if(!isAdminUser()){toast(t('adminRequired'),'error');return;}
  const person=emp(employeeId);if(!person)return;
  const today=iso(new Date()), dates=dashboardDates(0,6);
  const assignments=dates.flatMap(dateStr=>dashboardAssignments(dateStr,employeeId).map(e=>({e,dateStr})));
  const todayItems=assignments.filter(x=>x.dateStr===today);
  const completed=todayItems.filter(x=>completionFor(today,x.e.id,employeeId)).length;
  const activity=[...DB.log].reverse().filter(x=>x.employeeId===employeeId).slice(0,8);
  const todayDow=dowIdx(new Date(today+'T12:00:00'));
  const go=(tab,view)=>{
    closeSheet();
    state.tab=tab;
    if(view) state.scheduleView=view;
    if(tab==='schedule') state.date=today;
    render();
  };
  openSheet(`<div class="admin-detail-hero"><div class="pa avatar" style="background:${safeColor(person.color)}">${initials(person.name)}</div>
      <div class="grow"><div class="muted">${t('adminDetails')}</div><h3 style="margin:1px 0">${esc(person.name)}${person.admin?'<span class="admin-badge">ADMIN</span>':''}</h3>
        <div class="muted">${esc(L(person.role))} · ${esc(employeeShiftSummary(person.id,today))}</div></div></div>
    <div class="admin-detail-stats"><div class="admin-detail-stat"><b>${todayItems.length}</b>${t('adminToday')}</div>
      <div class="admin-detail-stat"><b>${assignments.length}</b>${t('adminNext7')}</div><div class="admin-detail-stat"><b>${completed}</b>${t('adminDone')}</div></div>
    <div class="block-h"><span class="t">${t('adminActions')}</span></div>
    <div class="admin-action-grid">
      <button class="btn sm" type="button" id="adminAddAssignment">＋ ${t('newEntry')}</button>
      <button class="btn sm sec" type="button" id="adminAssignToday">📌 ${t('adminAssignToday')}</button>
      <button class="btn sm sec" type="button" id="adminShiftToday">🕒 ${t('adminShiftToday')}</button>
      <button class="btn sm sec" type="button" id="adminPersonShifts">🗓 ${t('adminEditShifts')}</button>
      <button class="btn sm sec" type="button" id="adminPersonDay">☀️ ${t('adminOpenDay')}</button>
      <button class="btn sm sec" type="button" id="adminPersonWeek">📅 ${t('adminOpenWeek')}</button>
      <button class="btn sm sec" type="button" id="adminPersonEvents">🎉 ${t('adminManageEvents')}</button>
      <button class="btn sm sec" type="button" id="adminPersonStock">🧊 ${t('adminOpenStock')}</button>
      <button class="btn sm sec" type="button" id="adminPersonShop">🛒 ${t('adminOpenShop')}</button>
      <button class="btn sm sec" type="button" id="adminPersonAudit">📖 ${t('adminOpenAudit')}</button>
      <button class="btn sm sec" type="button" id="adminPersonContact">✉️ ${t('adminContact')}</button>
      <button class="btn sm sec" type="button" id="adminPersonCalendar">📅 ${t('calTitle')}</button>
    </div>
    <div class="block-h" style="margin-top:14px"><span class="t">🕒 ${t('adminShiftsWeek')}</span></div>
    <div class="chips" id="adminShiftDays" style="margin:0 0 12px">
      ${DAY_NAMES[state.lang].map((label,day)=>`<button class="chip ${day===todayDow?'on':''}" type="button" data-admin-shift-day="${day}">${esc(label)}</button>`).join('')}
    </div>
    <div class="block-h"><span class="t">📅 ${t('adminNext7')}</span></div>
    <div class="admin-timeline">${assignments.length?assignments.map(({e,dateStr})=>{
      const done=!!completionFor(dateStr,e.id,employeeId);
      return `<div class="admin-timeline-row admin-timeline-item">
      <button class="admin-timeline-main" data-admin-entry="${esc(e.id)}" data-admin-date="${dateStr}" type="button">
        <span>${esc(act(e.activityId)?.emoji||'📝')}</span>
        <span class="grow" style="text-align:left"><b>${esc(actLabel(e.activityId))}</b>${done?' · ✓':''}<br>
          <span class="muted">${esc(eventDayLabel(dateStr))} · ${esc(entryTime(e))} · ${esc(houseNames(e)||'—')}</span></span>
      </button>
      <button class="btn sm sec admin-tl-act" type="button" data-admin-done="${esc(e.id)}" data-admin-date="${dateStr}" title="${esc(done?t('markOpen'):t('adminMarkDone'))}">${done?'↺':'✓'}</button>
      <button class="mini-x" type="button" data-admin-remove="${esc(e.id)}" data-admin-date="${dateStr}" aria-label="${esc(t('adminRemoveAssign'))}" title="${esc(t('adminRemoveAssign'))}">×</button>
    </div>`;}).join(''):`<div class="empty">${t('noTasks')}</div>`}</div>
    <div class="block-h" style="margin-top:15px"><span class="t">🕘 ${t('adminLastAction')}</span></div>
    <div class="admin-timeline">${activity.length?activity.map(x=>`<div class="admin-timeline-row"><span>${esc(typeIcon(x.type))}</span><span class="grow"><b>${esc(typeLabel(x.type))}</b><br>${esc(x.text)}<br><span class="muted">${fmtDT(x.ts)}</span></span></div>`).join(''):`<div class="empty">${t('adminNoActivity')}</div>`}</div>`);

  sheetEl.querySelectorAll('[data-admin-entry]').forEach(button=>button.onclick=()=>{
    const dateStr=button.dataset.adminDate,e=entriesFor(dateStr).find(x=>x.id===button.dataset.adminEntry);
    if(!e)return;closeSheet();setTimeout(()=>sheetEntry(e,dateStr),180);
  });
  sheetEl.querySelectorAll('[data-admin-remove]').forEach(button=>button.onclick=()=>{
    const dateStr=button.dataset.adminDate,e=entriesFor(dateStr).find(x=>x.id===button.dataset.adminRemove);
    if(!e)return;
    cancelScheduleEntry(e, dateStr, {onDone:()=>{ closeSheet(); setTimeout(()=>sheetAdminStaff(employeeId),160); }});
  });
  sheetEl.querySelectorAll('[data-admin-done]').forEach(button=>button.onclick=()=>{
    const entryId=button.dataset.adminDone, dateStr=button.dataset.adminDate;
    const idx=(DB.taskCompletions||[]).findIndex(x=>x.date===dateStr&&x.entryId===entryId&&x.employeeId===employeeId);
    const reopening=idx>=0;
    if(reopening) DB.taskCompletions.splice(idx,1);
    else DB.taskCompletions.push({id:'tc'+uid(),date:dateStr,entryId,employeeId,completedAt:Date.now(),completedBy:state.user?.id||employeeId});
    logEntry('SCHEDULE',`${reopening?t('taskReopened'):t('taskDone')}: ${person.name} · ${dateStr}`);
    if(!save()) return;
    feedback('toggle');
    toast(reopening?t('taskReopened'):t('taskDone'),'success');
    closeSheet(); setTimeout(()=>sheetAdminStaff(employeeId),160);
  });
  sheetEl.querySelectorAll('[data-admin-shift-day]').forEach(button=>button.onclick=()=>{
    closeSheet(); setTimeout(()=>sheetShiftDay(employeeId, Number(button.dataset.adminShiftDay)),180);
  });
  sheetEl.querySelector('#adminAddAssignment').onclick=()=>{closeSheet();setTimeout(()=>sheetEntry(null,today,{employeeId}),180);};
  sheetEl.querySelector('#adminAssignToday').onclick=()=>{
    closeSheet();
    setTimeout(()=>sheetEntry(null,today,{employeeId, block:'afternoon'}),180);
  };
  sheetEl.querySelector('#adminShiftToday').onclick=()=>{closeSheet();setTimeout(()=>sheetShiftDay(employeeId,todayDow),180);};
  sheetEl.querySelector('#adminPersonShifts').onclick=()=>go('schedule','shift');
  sheetEl.querySelector('#adminPersonDay').onclick=()=>go('schedule','day');
  sheetEl.querySelector('#adminPersonWeek').onclick=()=>go('schedule','week');
  sheetEl.querySelector('#adminPersonEvents').onclick=()=>go('schedule','events');
  sheetEl.querySelector('#adminPersonStock').onclick=()=>go('stock');
  sheetEl.querySelector('#adminPersonShop').onclick=()=>go('shop');
  sheetEl.querySelector('#adminPersonAudit').onclick=()=>{
    closeSheet(); state.tab='book'; state.bookPane='log'; state.bookFilter.employeeId=employeeId; render();
  };
  sheetEl.querySelector('#adminPersonContact').onclick=()=>{
    closeSheet(); setTimeout(()=>sheetSecurityAccess(),180);
  };
  sheetEl.querySelector('#adminPersonCalendar')?.addEventListener('click',()=>{
    sheetCalendar(employeeId,'staff');
  });
}

function zoAiBannerKey(){
  const id=(state.user||state.child)?.id || '_';
  return `paidia.zoai.banner:${id}`;
}
function zoAiBannerDismissed(){
  try{ return localStorage.getItem(zoAiBannerKey())==='1'; }catch{ return false; }
}
function dismissZoAiBanner(){
  try{ localStorage.setItem(zoAiBannerKey(),'1'); }catch{}
}
function zoAiBannerHtml(){
  if(zoAiBannerDismissed()) return '';
  const child=state.mode==='child';
  const title=child?t('zoAiBannerTitleChild'):t('zoAiBannerTitle');
  const hint=child?t('zoAiBannerHintChild'):t('zoAiBannerHint');
  return `<button class="notification-card zoai-banner" id="zoAiBanner" type="button">
    <span style="font-size:22px">✨</span>
    <div class="grow"><b>${esc(title)}</b>
      <div class="muted" style="font-size:12px;margin-top:2px">${esc(hint)}</div></div>
    <span class="muted">${esc(t('zoAiBannerOpen'))} →</span>
  </button>
  <div class="row" style="justify-content:flex-end;margin:-4px 0 10px">
    <button class="btn ghost sm" type="button" id="zoAiBannerDismiss">${t('zoAiBannerDismiss')}</button>
  </div>`;
}
function notifyZoAiReady(){
  toast(state.mode==='child'?t('zoAiReadyChild'):t('zoAiReady'),'info',5200);
  try{ localStorage.removeItem(zoAiBannerKey()); }catch{}
}


function staffInboxItems(){
  const items=[];
  if(state.mode!=='staff' || !state.user) return items;
  const today=iso(new Date());
  const active=typeof activeShiftPresence==='function' ? activeShiftPresence(state.user.id) : null;
  if(active && !active.checkin){
    const label=`${active.shift.from}${active.shift.to?`–${active.shift.to}`:''}`;
    items.push({
      id:'shift', tone:'amber', toneLabel:t('notifToneShift'),
      title: active.late ? T[state.lang].notifShiftLate(label) : T[state.lang].notifShiftStart(label),
      meta: active.late ? t('homeShiftStartLate') : t('homeShiftStart'),
      jump:'presence'
    });
  }
  if(typeof shiftStockCheckPending==='function' && shiftStockCheckPending()){
    items.push({
      id:'stockcheck', tone:'out', toneLabel:t('notifToneStock'),
      title:t('notifShiftCheck'), meta:t('shiftStockCheck'), jump:'stockcheck'
    });
  }
  const low=PRODUCTS().filter(p=>{
    const hid=state.house==='all'?'h1':state.house;
    return (DB.stock[stockKey(hid,p.id)]??0) <= lowThreshold(p);
  }).length;
  if(low){
    items.push({
      id:'low', tone:'out', toneLabel:t('notifToneStock'),
      title:T[state.lang].notifLowStock(low), meta:t('stockAttention'), jump:'stock'
    });
  }
  const openList=fridayEntries(shopHouse()).filter(e=>e.status==='open'||e.status==='pending').length;
  if(openList){
    items.push({
      id:'shop', tone:'sea', toneLabel:t('notifToneShop'),
      title:T[state.lang].notifFridayShop(openList), meta:t('navShop'), jump:'shop'
    });
  }
  const upcoming=(DB.events||[]).filter(e=>e.status==='published' && e.date>=today).slice(0,2);
  upcoming.forEach(e=>{
    items.push({
      id:'ev-'+e.id, tone:'sea', toneLabel:t('notifTonePlan'),
      title:e.title||t('allEvents'), meta:e.date, jump:'events'
    });
  });
  if(state.user && !(shiftNoteFor(state.user.id, today)?.text||'').trim()){
    items.push({
      id:'journal', tone:'pine', toneLabel:t('notifToneShift'),
      title:t('journalDutyHome'), meta:t('bookJournalHint'), jump:'book'
    });
  }
  return items;
}

function homeMomentsStripHtml(){
  const posts=(state.galleryPosts||[]).slice(0,4);
  if(!posts.length){
    return `<div class="home-rail-card home-moments">
      <h3>${esc(t('homeMomentsToday'))}</h3>
      <p class="muted" style="margin:0;font-size:12px">${esc(t('homeMomentsEmpty'))}</p>
    </div>`;
  }
  const thumbs=posts.map(p=>{
    const photo=(p.photos&&p.photos[0])||p.photo||null;
    const src=photo && typeof galleryPhotoSrc==='function' ? galleryPhotoSrc(photo) : '';
    return src
      ? `<a href="#gallery" data-home-jump="gallery"><img src="${esc(src)}" alt=""></a>`
      : `<span data-home-jump="gallery"></span>`;
  }).join('');
  return `<div class="home-rail-card home-moments">
    <h3>${esc(t('homeMomentsToday'))}</h3>
    <div class="home-moments-strip">${thumbs}</div>
  </div>`;
}

function homePcRailHtml({todayOpenCount=0}={}){
  const inbox=staffInboxItems().slice(0,4);
  const kids=(DB.children||[]).slice(0,6);
  const notifRows=inbox.length
    ? inbox.map(n=>`<button type="button" data-inbox-jump="${esc(n.jump)}">
        <span class="nr-title">${esc(n.title)}</span>
        <span class="nr-tone tone-${esc(n.tone)}">${esc(n.toneLabel)}</span>
      </button>`).join('')
    : `<p class="muted" style="margin:0;font-size:12px">${esc(t('notifCenterEmpty'))}</p>`;
  const kidRows=kids.map(k=>{
    const ini=(k.name||'?').trim().slice(0,1).toUpperCase();
    return `<button type="button" class="home-rail-kid" data-home-jump="kids" data-kid-open="${esc(k.id)}">
      <span class="av" style="background:${esc(k.color||'var(--brand)')}">${esc(ini)}</span>
      <span>${esc(k.name)}</span>
    </button>`;
  }).join('') || `<p class="muted" style="margin:0;font-size:12px">${esc(t('kidsEmpty'))}</p>`;
  return `
    <section class="home-rail-card">
      <h3>${esc(t('homeRailNotifs'))}</h3>
      <div class="home-rail-notif">${notifRows}</div>
    </section>
    <section class="home-rail-card">
      <h3>${esc(t('homeRailKids'))}</h3>
      <div class="home-rail-kids">${kidRows}</div>
    </section>
    <section class="home-rail-card home-rail-end">
      <h3>${esc(t('homeRailEnd'))}</h3>
      <p class="muted">${esc(t('homeRailEndHint'))}</p>
      <button class="btn" type="button" id="homeShiftEnd">${esc(t('homeShiftEndCta'))}</button>
    </section>`;
}

function sheetNotifCenter(){
  const items=staffInboxItems();
  openSheet(`<div class="help-center-hero"><div class="import-kicker">Armonia</div>
    <h2>${esc(t('notifCenterTitle'))}</h2>
    <p>${esc(items.length?t('notifHint'):t('notifCenterEmpty'))}</p></div>
    <div class="notif-center">
      ${items.length?items.map(n=>`<button type="button" class="notif-center-row" data-inbox-jump="${esc(n.jump)}">
        <b>${esc(n.title)}</b>
        <span class="nr-tone tone-${esc(n.tone)}">${esc(n.toneLabel)} · ${esc(n.meta||'')}</span>
      </button>`).join(''):`<p class="muted">${esc(t('notifCenterEmpty'))}</p>`}
    </div>
    <button class="btn sec" type="button" id="notifCenterClose" style="margin-top:10px">${esc(t('close'))}</button>`);
  sheetEl.querySelector('#notifCenterClose').onclick=()=>closeSheet();
  sheetEl.querySelectorAll('[data-inbox-jump]').forEach(btn=>{
    btn.onclick=()=>{ closeSheet(); runInboxJump(btn.dataset.inboxJump); };
  });
}

function runInboxJump(jump){
  feedback('tap');
  if(jump==='presence'){ sheetShiftPresence(); return; }
  if(jump==='stockcheck'){ sheetShiftStockCheck(); return; }
  if(jump==='stock'){ state.tab='stock'; clearSelection(); render(); return; }
  if(jump==='shop'){ state.tab='shop'; state.shopPanel='plan'; clearSelection(); render(); return; }
  if(jump==='book'){ state.tab='book'; state.bookPane='shift'; render(); return; }
  if(jump==='kids'){ state.tab='kids'; render(); return; }
  if(jump==='gallery'){ state.tab='gallery'; refreshGallery({silent:true}).finally(()=>render()); return; }
  state.tab='schedule';
  state.scheduleView=jump==='events'?'events':'day';
  render();
}

function sheetShiftEnd(){
  if(state.mode!=='staff' || !state.user){ toast(t('presenceNoShift'),'error'); return; }
  const today=iso(new Date());
  const journalDue=!(shiftNoteFor(state.user.id, today)?.text||'').trim();
  const openTasks=dashboardAssignments(today,state.user.id).filter(e=>!completionFor(today,e.id,state.user.id)).length;
  const row=(done,title,hint,actionId,cta)=>`
    <div class="shift-end-row ${done?'':'todo'}">
      <span class="num" aria-hidden="true">${done?'✓':'·'}</span>
      <div class="grow"><b>${esc(title)}</b><span>${esc(hint)}</span></div>
      ${done?'':`<button class="btn sm sec" type="button" id="${actionId}">${esc(cta)}</button>`}
    </div>`;
  openSheet(`<div class="shift-end-panel">
    <div class="presence-kicker">${esc(t('homeRailEnd'))}</div>
    <h2>${esc(t('shiftEndTitle'))}</h2>
    <p class="muted">${esc(t('shiftEndHint'))}</p>
    ${row(!journalDue, t('shiftEndBook'), t('shiftEndBookHint'), 'shiftEndBook', t('homeShiftJournalGo'))}
    ${row(!openTasks, t('shiftEndTasks'), T[state.lang].shiftEndTasksHint(openTasks), 'shiftEndTasks', t('homeOpenPlan'))}
    ${row(false, t('shiftEndHandover'), t('shiftEndHandoverHint'), 'shiftEndHandover', t('topTalk'))}
    ${row(false, t('shiftEndLogout'), t('shiftEndLogoutHint'), 'shiftEndLogout', t('signOut'))}
    <button class="btn" type="button" id="shiftEndDone">${esc(t('shiftEndConfirm'))}</button>
    <button class="btn sec" type="button" id="shiftEndClose">${esc(t('close'))}</button>
  </div>`);
  sheetEl.querySelector('#shiftEndClose').onclick=()=>closeSheet();
  sheetEl.querySelector('#shiftEndDone').onclick=()=>{
    closeSheet();
    if(journalDue){
      state.tab='book'; state.bookPane='shift'; state.bookJournalMode='ink'; render();
      queueMicrotask(()=>document.getElementById('shiftNoteText')?.focus());
      toast(t('shiftEndBook'),'info');
      return;
    }
    sheetSecurityAccess();
  };
  const book=sheetEl.querySelector('#shiftEndBook');
  if(book) book.onclick=()=>{
    closeSheet(); state.tab='book'; state.bookPane='shift'; state.bookJournalMode='ink'; render();
    queueMicrotask(()=>document.getElementById('shiftNoteText')?.focus());
  };
  const tasks=sheetEl.querySelector('#shiftEndTasks');
  if(tasks) tasks.onclick=()=>{ closeSheet(); state.tab='home'; render(); };
  const hand=sheetEl.querySelector('#shiftEndHandover');
  if(hand) hand.onclick=()=>{ closeSheet(); state.tab='talk'; render(); };
  const logout=sheetEl.querySelector('#shiftEndLogout');
  if(logout) logout.onclick=()=>{ closeSheet(); sheetSecurityAccess(); };
}

function paintNotifBadge(){
  const badge=document.getElementById('notifBadge');
  const btn=document.getElementById('btnNotifs');
  if(!badge||!btn) return;
  const n=state.mode==='staff'?staffInboxItems().length:0;
  badge.textContent=String(n);
  badge.hidden=!n;
  btn.title=t('bellLabel');
  btn.setAttribute('aria-label', t('bellLabel')+(n?` (${n})`:''));
}


function viewHome(){
  const today=iso(new Date()), user=state.user;
  const todayAssignments=user?dashboardAssignments(today,user.id):[];
  const todayOpen=todayAssignments.filter(e=>!completionFor(today,e.id,user.id));
  const overdue=[],recentlyDone=[];
  if(user) dashboardDates(-7,-1).forEach(dateStr=>dashboardAssignments(dateStr,user.id).forEach(e=>{
    (completionFor(dateStr,e.id,user.id)?recentlyDone:overdue).push({e,dateStr});
  }));
  const unassigned=[];
  dashboardDates(0,2).forEach(dateStr=>entriesFor(dateStr).filter(e=>!e.cancelled && !entryEmployeeIds(e).length)
    .forEach(e=>unassigned.push({e,dateStr})));
  const events=[...DB.events].sort((a,b)=>(a.date+a.from).localeCompare(b.date+b.from));
  const journalDue=!!(user && !(shiftNoteFor(user.id, today)?.text||'').trim());
  const shiftStartCard=homeShiftStartCardHtml();
  const showJournalDuty=journalDue && !shiftStartCard;
  const planCta=`<button class="btn sm" type="button" data-home-jump="day">${esc(t('homeOpenPlan'))}</button>`;
  const eventsCta=`<button class="btn sm sec" type="button" data-home-jump="events">${esc(t('homeOpenEvents'))}</button>`;
  const openListCount = fridayEntries(shopHouse()).filter(e=>e.status==='open'||e.status==='pending').length;
  const lowStockCount = PRODUCTS().filter(p=>{
    const hid = state.house==='all'?'h1':state.house;
    return (DB.stock[stockKey(hid,p.id)]??0) <= lowThreshold(p);
  }).length;
  const primaryLabel = shiftStartCard ? t('homePrimaryCta') : (todayOpen.length ? t('homePrimaryCta') : t('homeOpenPlan'));
  const signal=(jump,value,label,icon,tone)=>`
    <button type="button" class="home-signal ${tone||''}" data-home-jump="${jump}">
      <span class="w-stat-ico" aria-hidden="true">${ui(icon,'sm')}</span>
      <b class="w-stat-val">${esc(String(value))}</b>
      <span class="w-stat-lbl">${esc(label)}</span>
    </button>`;
  const main=`
    <section class="home-mast hero hero-texture" aria-label="Armonia">
      <p class="brand-kicker">Armonia Thassos</p>
      <h1 class="home-brand">${esc(t('homeHello'))}${user?', '+esc(user.name):''}</h1>
      <p class="home-lede">${esc(t('homeOverview'))}</p>
      <div class="home-cta-row">
        <button class="home-primary" type="button" data-home-jump="day">${esc(primaryLabel)}</button>
        ${!shiftStartCard?`<button class="home-secondary" type="button" id="homeQuickBook">${ui('u-note','sm')} ${esc(t('headerBook'))}</button>`:''}
      </div>
    </section>
    ${shiftStartCard}
    ${showJournalDuty?`<button class="journal-duty-home" type="button" id="homeWriteBook">
      <span class="journal-duty-home-mark" aria-hidden="true">${ui('u-alert','sm')}</span>
      <span class="grow"><b>${esc(t('journalDutyHome'))}</b><small>${esc(t('bookJournalHint'))}</small></span>
      <span class="journal-duty-home-cta">${esc(t('journalDutyCta'))}</span>
    </button>`:''}
    ${teamNoticeBannerHtml()}
    <div class="home-widgets">
      ${ringHtml(homeShiftCompletionPct(user), t('homeShiftRing'), todayOpen.length?'amber':'pine')}
      ${(()=>{ const sp=homeTaskDoneSpark7(user); return sp.some(n=>n>0)?`<div class="w-stat"><span class="w-stat-lbl">${esc(t('homeWeekSpark'))}</span>${sparklineHtml(sp,'pine')}</div>`:''; })()}
      <button type="button" class="btn ghost sm" data-home-jump="kids">${ui('u-person','sm')} ${esc(t('navKids'))}</button>
    </div>
    <div class="home-signals" role="group" aria-label="${esc(t('homeSignals'))}">
      ${signal('day', todayOpen.length, t('dueToday'), 'u-tasks', todayOpen.length?'tone-pine':'')}
      ${signal('day', overdue.length, t('overdue'), 'u-alert', overdue.length?'tone-out':'')}
      ${signal('shop', openListCount, t('homeSignalList'), 'u-cart', openListCount?'tone-sea':'')}
      ${signal('stock', lowStockCount, t('homeSignalStock'), 'u-leaf', lowStockCount?'tone-amber':'')}
    </div>
    ${shiftStartCard?'':`${shiftPresenceBannerHtml()}${shiftStockCheckBannerHtml()}`}
    <section class="card home-today-card">
      <div class="block-h"><span class="t">${ui('u-check','sm')} ${esc(t('myTasks'))}</span><span class="hrs">${esc(eventDayLabel(today))}</span></div>
      <div class="task-list">${todayAssignments.length?todayAssignments.map(e=>dashboardTaskCard(e,today,user.id)).join(''):emptyState(ui('u-check'), t('noTasks'), t('noTasksHint'), planCta)}</div>
    </section>
    ${homeMomentsStripHtml()}
    <details class="home-more">
      <summary>${esc(t('homeMore'))}</summary>
      <div class="dashboard-grid home-more-grid">
        ${adminTeamPanel(today)}
        <section class="card"><div class="block-h"><span class="t">${ui('u-alert','sm')} ${esc(t('overdueTasks'))}</span><span class="hrs">7</span></div>
          <div class="task-list">${overdue.length||recentlyDone.length?
            overdue.map(x=>dashboardTaskCard(x.e,x.dateStr,user.id,{overdue:true})).join('')+
            recentlyDone.map(x=>dashboardTaskCard(x.e,x.dateStr,user.id)).join(''):emptyState(ui('u-leaf'), t('noOverdue'), t('noOverdueHint'))}</div>
        </section>
        <section class="card wide"><div class="block-h"><span class="t">${ui('u-megaphone','sm')} ${esc(t('allEvents'))}</span><button class="btn sm sec" id="homeAllEvents" type="button">${esc(t('openEvents'))} →</button></div>
          <div class="task-list">${events.length?events.map(homeEventCard).join(''):emptyState(ui('u-megaphone'), t('noEvents'), t('noEventsHint'), eventsCta)}</div>
        </section>
        <section class="card wide"><div class="block-h"><span class="t">${ui('u-person','sm')} ${esc(t('unassignedTasks'))}</span><span class="hrs">${esc(t('next3Days'))}</span></div>
          <div class="task-list">${unassigned.length?unassigned.map(x=>dashboardTaskCard(x.e,x.dateStr,'',{readonly:true})).join(''):emptyState(ui('u-person'), t('noUnassigned'), t('noUnassignedHint'), planCta)}</div>
        </section>
      </div>
    </details>
    <div class="home-foot-actions">
      <button class="page-act ghost" type="button" data-page-act="tutorial">${ui('u-book','sm')} ${esc(t('topTutorial'))}</button>
      <button class="page-act ghost" type="button" id="homeCalendar">${ui('u-calendar','sm')} ${esc(t('calTitle'))}</button>
      <button class="page-act ghost" type="button" id="homeGalleryOpen">${ui('u-camera','sm')} ${esc(t('galleryTitle'))}</button>
    </div>`;
  return `<div class="home-shell home-shell-v2 home-pc">
    <div class="home-pc-main">${main}</div>
    <aside class="home-pc-rail" aria-label="${esc(t('homeRailNotifs'))}">${homePcRailHtml({todayOpenCount:todayOpen.length})}</aside>
  </div>`;
}



function sheetChildHowTo(){
  openSheet(`<div class="help-center-hero"><div class="import-kicker">Armonia</div>
    <h2>${esc(t('childHowTo'))}</h2><p>${esc(t('childHowToHint'))}</p></div>
    <ul style="list-style:none;padding:0;margin:12px 0;display:grid;gap:8px">
      <li style="padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:#fff">${esc(t('childHowToToday'))}</li>
      <li style="padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:#fff">${esc(t('childHowToEvents'))}</li>
      <li style="padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:#fff">${esc(t('childHowToWeek'))}</li>
      <li style="padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:#fff">${esc(t('childHowToGallery'))}</li>
      <li style="padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:#fff">${esc(t('childHowToGames'))}</li>
      <li style="padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:#fff">${esc(t('childHowToZoai'))}</li>
    </ul>
    <p class="muted" style="font-size:12px;line-height:1.45">${esc(t('childInstallIos'))}<br>${esc(t('childInstallAndroid'))}</p>
    <button class="btn" type="button" id="childHowToNotifs">${esc(t('notifEnableChild'))}</button>
    <button class="btn sec" type="button" id="childHowToClose" style="margin-top:8px">${esc(t('close'))}</button>`);
  sheetEl.querySelector('#childHowToClose').onclick=()=>closeSheet();
  sheetEl.querySelector('#childHowToNotifs').onclick=async()=>{
    const ok=await enableAppNotifications();
    toast(ok?t('notifEnabled'):t('notifDenied'), ok?'success':'error');
    if(ok){ closeSheet(); runNotificationSweep({force:true}); }
  };
}

function maybePromptPasskeySetup(){
  if(!passkeyCapable() || !(state.user||state.child)) return;
  const id=currentProfileId();
  if(!id) return;
  const key=`bio-hint:${id}`;
  try{ if(sessionStorage.getItem(key)==='1') return; sessionStorage.setItem(key,'1'); }catch{}
  setTimeout(()=>{
    if(sheetEl?.classList?.contains('on')) return;
    openSheet(`<div class="help-center-hero"><div class="import-kicker">${esc(biometricName())}</div>
      <h2>${esc(t('passkeySetup'))}</h2><p>${esc(t('bioSetupHint'))}</p></div>
      <button class="btn" type="button" id="bioHintNow">${esc(t('bioSetupNow'))}</button>
      <button class="btn sec" type="button" id="bioHintLater" style="margin-top:8px">${esc(t('bioSetupLater'))}</button>`);
    sheetEl.querySelector('#bioHintLater').onclick=()=>closeSheet();
    sheetEl.querySelector('#bioHintNow').onclick=()=>{ closeSheet(); sheetSecurityAccess(); };
  }, 1200);
}

function dynamicHeaderTitle(){
  if(state.tab==='home') return t('headerHome');
  if(state.tab==='schedule'){
    if(state.scheduleView==='week') return t('headerScheduleWeek');
    if(state.scheduleView==='calendar'){
      const cm = state.calendarMonth ? new Date(state.calendarMonth+'T12:00:00') : new Date();
      const monthLabel = cm.toLocaleDateString(state.lang==='el'?'el-GR':'de-DE', {month:'long', year:'numeric'});
      return `${t('headerScheduleCalendar')} · ${monthLabel}`;
    }
    if(state.scheduleView==='events') return t('headerScheduleEvents');
    if(state.scheduleView==='shift') return t('viewShift');
    return t('headerScheduleDay');
  }
  if(state.tab==='stock'){
    if(state.house==='all') return t('headerStockAll');
    const h=house(state.house);
    return `${t('headerStock')} · ${h?h.short:''}`;
  }
  if(state.tab==='shop'){
    const h=house(shopHouse?.() || state.house);
    return `${t('headerShop')}${h?` · ${h.short}`:''}`;
  }
  if(state.tab==='gallery') return t('headerGallery');
  if(state.tab==='talk') return t('headerTalk');
  if(state.tab==='kids') return t('headerKids');
  return t('headerBook');
}

function paintTopChrome(){
  const titleEl=document.getElementById('title');
  const whoEl=document.getElementById('who');
  if(titleEl) titleEl.textContent = dynamicHeaderTitle();
  if(whoEl){
    whoEl.textContent = state.user
      ? profileLabel(state.user) + ' · ' + L(state.user.role) : t('noUser');
    if(isAdminUser()) whoEl.innerHTML += ' <span class="admin-badge">ADMIN</span>';
  }
  const dockWho=document.getElementById('dockWho');
  if(dockWho){
    dockWho.textContent = state.user
      ? (state.user.name + (isAdminUser()?' · Admin':''))
      : '';
  }
  paintNotifBadge();
  const lang=document.getElementById('btnLang');
  const user=document.getElementById('btnUser');
  const profiles=document.getElementById('btnProfiles');
  if(lang) lang.textContent = state.lang === 'de' ? 'DE' : 'ΕΛ';
  if(user) user.textContent = t('logout');
  if(profiles){
    profiles.textContent = '↔';
    profiles.title = t('profilesBack');
    profiles.setAttribute('aria-label', t('switchProfile'));
  }
  // Staff actions live in each page — keep sticky header clean.
  const tools=document.getElementById('topTools');
  if(tools && state.mode!=='child'){
    tools.hidden=true;
    tools.replaceChildren();
  }
  const chatLabel=document.querySelector('[data-nav-chat]');
  if(chatLabel) chatLabel.textContent = t('navChat');
  const navChatBtn=document.getElementById('navChat');
  navChatBtn?.classList.toggle('on', !!state.chatOpen);
  navChatBtn?.setAttribute('aria-label', t('navChat'));
  document.getElementById('chatClose')?.setAttribute('aria-label', t('close'));
}

function onTopAction(id){
  feedback('tap');
  if(id==='tutorial'){ openAppTutorial(); return; }
  if(id==='addEntry'){ sheetEntry(null, state.date); return; }
  if(id==='shopScan'){ document.getElementById('btnReceipt')?.click() || sheetImportList(); return; }
  if(id==='shopHistory'){ sheetShoppingHistory(); return; }
  if(id==='shiftFocus'){
    state.bookPane='shift';
    render();
    queueMicrotask(()=>{
      document.getElementById('shiftNoteText')?.focus();
      document.getElementById('shiftNoteText')?.scrollIntoView({behavior:'smooth',block:'center'});
    });
    return;
  }
  if(id==='bookToday'){ state.bookRange='today'; state.bookPane=state.bookPane||'log'; render(); return; }
  if(id==='bookWeek'){ state.bookRange='week'; state.bookPane=state.bookPane||'log'; render(); return; }
  if(id==='bookFix'){ sheetCorrection(); return; }
}

function closeChatPanel(){
  stopTalkPanelPoll();
  state.chatOpen=false;
  document.body.classList.remove('chat-open');
  const body=document.getElementById('chatBody');
  if(body) body.replaceChildren();
  scheduleMeasureChrome();
  paintTopChrome();
}

function toggleChatPanel(){
  if(state.chatOpen) closeChatPanel();
  else openZoAi();
}

/** Team talk is its own staff nav section — never the Zo-Ai FAB. */
function openStaffTalk(){
  if(state.mode!=='staff' || !state.user){ toast(t('staffTalkNeedStaff'),'error'); return; }
  if(state.chatOpen) closeChatPanel();
  state.tab='talk';
  feedback('open');
  render();
}

/** Zo-Ai via floating panel only (kids + staff). */
function openZoAi(){
  if(state.chatOpen && state.chatMode==='ai'){
    closeChatPanel();
    return;
  }
  openChatPanel('ai');
}

let talkPanelPoll = null;
function stopTalkPanelPoll(){
  if(talkPanelPoll){ clearInterval(talkPanelPoll); talkPanelPoll=null; }
}

function openChatPanel(mode='ai'){
  // Employee team chat is a dedicated tab — never reopen it inside Zo-Ai.
  if(mode==='talk'){ openStaffTalk(); return; }
  if(mode==='help') mode='ai';
  mode='ai';

  stopTalkPanelPoll();
  state.chatMode=mode;
  state.chatOpen=true;
  document.body.classList.add('chat-open');
  const bottom=document.getElementById('bottomPanel');
  if(bottom) bottom.style.display='';

  const seg=document.getElementById('chatModeSeg');
  if(seg){ seg.hidden=true; seg.setAttribute('aria-hidden','true'); seg.replaceChildren(); }
  const title=document.getElementById('chatPanelTitle');
  if(title){
    title.hidden=false;
    title.textContent = `${ui('u-sparkle')} ${t('helpChat')}`;
  }
  const closeBtn=document.getElementById('chatClose');
  if(closeBtn) closeBtn.setAttribute('aria-label', t('close'));
  paintTopChrome();
  paintChatPanel();
  scheduleMeasureChrome();
}

function paintChatPanel(){
  const body=document.getElementById('chatBody');
  if(!body || !state.chatOpen) return;
  stopTalkPanelPoll();
  mountHelpChat(body);
}

function talkPageActive(){
  return state.tab==='talk' && state.mode==='staff' && !!state.user;
}

function mountStaffTalkChat(root){
  if(state.mode!=='staff' || !state.user){
    root.innerHTML=`<div class="empty">${esc(t('staffTalkNeedStaff'))}</div>`;
    return;
  }
  let talk={
    messages: Array.isArray(talkCache.messages) ? talkCache.messages : [],
    topics: Array.isArray(talkCache.topics) ? talkCache.topics : [],
    videoUrl: talkCache.videoUrl || '',
    updatedAt: talkCache.updatedAt || 0,
  };
  let busy=false, voice=null;
  const fmtTalkTime=ts=>{
    try{ return new Date(ts).toLocaleTimeString(state.lang==='el'?'el-GR':'de-DE',{hour:'2-digit',minute:'2-digit'}); }
    catch{ return ''; }
  };
  const remember=()=>{ talkCache={messages:talk.messages||[], topics:talk.topics||[], videoUrl:talk.videoUrl||'', updatedAt:talk.updatedAt||0}; };
  const paintTopics=()=>{
    const host=document.getElementById('talkTopicsList');
    if(!host) return;
    const today=iso(new Date());
    const rows=(talk.topics||[]).filter(tp=>!tp.date || tp.date===today || !tp.done);
    host.innerHTML = rows.length
      ? rows.map(tp=>`<label class="talk-topic-row ${tp.done?'done':''}">
          <input type="checkbox" data-topic-toggle="${esc(tp.id)}" ${tp.done?'checked':''}>
          <span>${esc(tp.text)}</span>
          <small>${esc(tp.byName||'')}</small>
        </label>`).join('')
      : `<div class="muted" style="font-size:12px">${esc(t('staffTalkEmpty'))}</div>`;
    host.querySelectorAll('[data-topic-toggle]').forEach(input=>{
      input.onchange=async()=>{
        try{
          talk=await talkApi('toggle_topic',{topicId:input.dataset.topicToggle});
          remember(); paint(); paintTopics();
        }catch(error){ toast(error.message||t('staffTalkLoadError'),'error'); paintTopics(); }
      };
    });
  };
  const paint=()=>{
    if(!talkPageActive()) return;
    const log=root.querySelector('#talkLog');
    const videoBtn=root.querySelector('#talkVideoOpen');
    if(videoBtn){ videoBtn.disabled=!talk.videoUrl; videoBtn.dataset.url=talk.videoUrl||''; }
    if(log){
      const msgs=talk.messages||[];
      log.innerHTML = msgs.length
        ? msgs.map(m=>{
            const mine=m.by===state.user.id;
            return `<div class="chat-msg ${mine?'talk-user':'assistant'}">
              <span class="talk-who">${esc(m.byName||m.by)} · ${esc(fmtTalkTime(m.at))}</span>${esc(m.text)}</div>`;
          }).join('')
        : `<div class="chat-msg talk-meta">${esc(t('staffTalkEmpty'))}</div>`;
      log.scrollTop=log.scrollHeight;
    }
    paintTopics();
  };

  root.innerHTML=`
    <div class="chat-log talk-chat-fast" id="talkLog" aria-live="polite"></div>
    <div class="chat-compose">
      <textarea id="talkInput" rows="1" placeholder="${esc(t('staffTalkPlaceholder'))}"></textarea>
      <button class="chat-mic" id="talkMic" type="button" aria-label="${esc(t('helpVoice'))}" title="${esc(t('helpVoice'))}">🎤</button>
      <button class="btn" id="talkSend" type="button">${esc(t('staffTalkSend'))}</button>
    </div>
    <div class="chat-voice-status" id="talkVoiceStatus" hidden></div>
    <div class="talk-float-tools">
      <button class="btn ghost sm" type="button" id="talkVideoOpen">📹 ${esc(t('staffTalkVideoOpen'))}</button>
      <button class="btn ghost sm" type="button" id="talkToZoAi">${ui('u-sparkle')} ${esc(t('helpChat'))}</button>
    </div>`;
  paint();
  const input=root.querySelector('#talkInput');
  const send=root.querySelector('#talkSend');
  const mic=root.querySelector('#talkMic');
  setTimeout(()=>input?.focus(), 20);

  root.querySelector('#talkVideoOpen').onclick=()=>{
    const url=root.querySelector('#talkVideoOpen').dataset.url;
    if(!url) return;
    feedback('open');
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  root.querySelector('#talkToZoAi').onclick=()=>{ feedback('select'); openZoAi(); };

  const topicInput=document.getElementById('talkTopicInput');
  document.getElementById('talkTopicAdd')?.addEventListener('click', async()=>{
    const text=(topicInput?.value||'').trim();
    if(!text){ topicInput?.focus(); return; }
    try{
      talk=await talkApi('add_topic',{text, date:iso(new Date()), source:'manual'});
      remember(); if(topicInput) topicInput.value=''; paint(); feedback('save');
    }catch(error){ toast(error.message||t('staffTalkLoadError'),'error'); }
  });
  topicInput?.addEventListener('keydown', e=>{
    if(e.key==='Enter'){ e.preventDefault(); document.getElementById('talkTopicAdd')?.click(); }
  });
  document.getElementById('talkTopicClear')?.addEventListener('click', async()=>{
    try{
      talk=await talkApi('clear_done',{date:iso(new Date())});
      remember(); paint();
    }catch(error){ toast(error.message||t('staffTalkLoadError'),'error'); }
  });
  document.getElementById('talkTopicSuggest')?.addEventListener('click', async()=>{
    const suggestions=talkSuggestTopics();
    if(!suggestions.length){ toast(t('staffTalkEmpty'),'info'); return; }
    try{
      for(const s of suggestions.slice(0,5)){
        talk=await talkApi('add_topic',{text:s.text, date:iso(new Date()), source:s.source||'suggest'});
      }
      remember(); paint(); feedback('save');
    }catch(error){ toast(error.message||t('staffTalkLoadError'),'error'); }
  });

  const submit=async()=>{
    const content=input.value.trim();
    if(!content || busy || send.disabled) return;
    voice?.stop();
    const optimistic={
      id:'local-'+Date.now(), text:content, by:state.user.id,
      byName:profileName(state.user)||state.user.name, at:Date.now(), kind:'chat',
    };
    talk.messages=[...(talk.messages||[]), optimistic];
    input.value='';
    paint();
    busy=true; send.disabled=true; if(mic) mic.disabled=true;
    try{
      talk=await talkApi('send',{text:content});
      remember(); paint(); feedback('select');
    }catch(error){
      talk.messages=(talk.messages||[]).filter(m=>m.id!==optimistic.id);
      paint();
      feedback('error'); toast(error.message||t('staffTalkLoadError'),'error');
    }finally{ busy=false; send.disabled=false; if(mic) mic.disabled=false; input.focus(); }
  };
  send.onclick=submit;
  input.onkeydown=e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); submit(); } };
  voice=bindVoiceInput({ input, mic, statusEl:root.querySelector('#talkVoiceStatus') });

  (async()=>{
    try{
      talk=await talkApi();
      remember(); paint();
      stopTalkPanelPoll();
      talkPanelPoll=setInterval(async()=>{
        if(!talkPageActive() || busy) return;
        try{
          const next=await talkApi();
          if(next.updatedAt!==talk.updatedAt){ talk=next; remember(); paint(); }
        }catch{}
      }, 2500);
    }catch(error){
      if(!(talk.messages||[]).length) toast(error.message||t('staffTalkLoadError'),'error');
    }
  })();
}

function mountHelpChat(root){
  loadHelpTranscriptForCurrentUser();
  if(!state.helpMessages.length){
    state.helpMessages.push({role:'assistant', content:helpWelcomeMessage()});
    persistHelpTranscript();
  }
  let voice=null;
  const role = helpChatRole();
  const canMutate = role==='staff' || role==='admin';
  const paint = () => {
    const log = root.querySelector('#helpLog');
    if(!log) return;
    log.innerHTML = state.helpMessages.map(m =>
      `<div class="chat-msg ${m.role==='user'?'user':'assistant'}">${esc(m.content)}</div>`).join('');
    log.scrollTop = log.scrollHeight;
    persistHelpTranscript();
  };
  const quickPrompts = role==='child'
    ? (state.lang==='el'
        ? ['Τι έχω σήμερα;','Πού είναι το επόμενο event;','Πώς παίζω Μνήμη;']
        : ['Was habe ich heute?','Wann ist mein nächstes Event?','Wie spiele ich Memory?'])
    : role==='admin'
      ? (state.lang==='el'
          ? ['πρόσθεσε 2 γάλα στο Kalyvia','πώς αλλάζω το μόνιμο πρόγραμμα;','άνοιξε το κέντρο διαχείρισης']
          : ['2 Milch nach Kalyvia','Wie ändere ich den Dauerplan?','Wo ist die Admin-Zentrale?'])
      : (state.lang==='el'
          ? ['πρόσθεσε 2 γάλα στο Kalyvia','βγάλε 1 βούτυρο Limenaria','βάλε ρύζι στη λίστα']
          : ['2 Milch nach Kalyvia','1 Butter raus Limenaria','Reis auf die Liste']);
  const quickLabel = role==='child' ? t('helpQuickChild') : role==='admin' ? t('helpQuickAdmin') : t('helpQuickFood');
  const staffTalkLink = (state.mode==='staff' && state.user)
    ? `<button class="btn ghost sm talk-open-link" type="button" id="zoAiOpenTalk">💬 ${esc(t('staffTalkTitle'))}</button>`
    : '';
  root.innerHTML=`
    <div class="status error" id="helpConfigStatus" hidden style="margin:0 0 10px"></div>
    <div class="chat-log" id="helpLog" aria-live="polite"></div>
    <div id="helpProposeBox" class="help-propose-box" hidden></div>
    <div class="chat-compose">
      <textarea id="helpInput" rows="1" placeholder="${esc(t('helpPlaceholder'))}"></textarea>
      <button class="chat-mic" id="helpMic" type="button" aria-label="${esc(t('helpVoice'))}" title="${esc(t('helpVoice'))}">🎤</button>
      <button class="btn" id="helpSend" type="button">${t('helpSend')}</button>
    </div>
    <div class="chat-voice-status" id="helpVoiceStatus" hidden></div>
    <div class="talk-float-tools">
      ${staffTalkLink}
      <details class="help-quick-details">
        <summary class="muted">${esc(quickLabel)}</summary>
        <div class="chips help-quick" id="helpQuick" style="margin-top:8px">
          ${quickPrompts.map(q=>`<button class="chip" type="button" data-q="${esc(q)}">${esc(q)}</button>`).join('')}
        </div>
      </details>
    </div>`;
  paint();
  setTimeout(()=>root.querySelector('#helpInput')?.focus(), 20);
  root.querySelector('#zoAiOpenTalk')?.addEventListener('click',()=>{ feedback('select'); openStaffTalk(); });
  fetch('/api/health',{credentials:'same-origin'}).then(r=>r.json()).then(health=>{
    const banner=root.querySelector('#helpConfigStatus');
    if(!banner || health?.aiConfigured!==false) return;
    banner.hidden=false;
    banner.textContent=t('helpConfigBanner');
  }).catch(()=>{});
  if(canMutate && state.pendingHelpActions?.length){
    sheetHelpProposals(state.pendingHelpActions,{inline:true,onDone:()=>paint()});
  }
  const input = root.querySelector('#helpInput');
  const send = root.querySelector('#helpSend');
  const submit = async () => {
    const content = input.value.trim();
    if(!content || send.disabled) return;
    voice?.stop();
    state.helpMessages.push({role:'user', content});
    state.helpMessages = state.helpMessages.slice(-12);
    persistHelpTranscript();
    input.value = ''; send.disabled = true;
    const mic=root.querySelector('#helpMic'); if(mic) mic.disabled=true;
    paint();
    const thinking = document.createElement('div');
    thinking.className = 'chat-msg assistant'; thinking.id = 'helpThinking';
    thinking.textContent = t('helpThinking');
    root.querySelector('#helpLog').appendChild(thinking);
    try{
      const response = await fetch('/api/chat', {
        method:'POST', headers:{'Content-Type':'application/json'}, credentials:'same-origin',
        body:JSON.stringify({
          messages:state.helpMessages.filter(m=>m.role==='user'||m.role==='assistant'),
          context:helpUiContext(),
        }),
      });
      const data = await response.json().catch(()=>({}));
      if(!response.ok){
        const error=new Error(data.detail || data.setup || data.error || String(response.status));
        error.status=response.status;
        error.code=data.code;
        error.detail=data.detail||data.setup||data.error;
        throw error;
      }
      state.helpMessages.push({role:'assistant', content:data.message || t('helpUnavailable')});
      state.helpMessages = state.helpMessages.slice(-12);
      persistHelpTranscript();
      paint();
      if(canMutate && Array.isArray(data.actions) && data.actions.length){
        sheetHelpProposals(data.actions,{inline:true,onDone:()=>paint()});
      }
    }catch(error){
      state.helpMessages.push({role:'assistant', content:friendlyAiError(error)});
      persistHelpTranscript();
      paint();
    }finally{
      send.disabled = false;
      if(mic) mic.disabled=false;
      input.focus();
    }
  };
  send.onclick = submit;
  root.querySelectorAll('#helpQuick [data-q]').forEach(b=>{
    b.onclick=()=>{ input.value=b.dataset.q; feedback('select'); submit(); };
  });
  input.onkeydown = e => {
    if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); submit(); }
  };
  voice=bindVoiceInput({
    input,
    mic:root.querySelector('#helpMic'),
    statusEl:root.querySelector('#helpVoiceStatus'),
  });
}

function adaptiveChrome(panelHtml, summaryMeta=''){
  const meta=summaryMeta?`<span class="adaptive-summary-meta">${esc(summaryMeta)}</span>`:'';
  return `<div class="adaptive-chrome">
    <button type="button" class="adaptive-chrome-summary" data-adaptive-toggle aria-expanded="false">
      <span class="adaptive-summary-label">${esc(t('menuFilters'))}</span>
      ${meta}
      <span class="adaptive-chevron" aria-hidden="true">▾</span>
    </button>
    <button type="button" class="adaptive-backdrop" data-adaptive-toggle aria-label="${esc(t('close'))}" tabindex="-1"></button>
    <div class="adaptive-chrome-panel">
      <div class="adaptive-chrome-panel-head">
        <b>${esc(t('menuFilters'))}</b>
        <button type="button" class="adaptive-chrome-done" data-adaptive-toggle>${esc(t('menuDone'))}</button>
      </div>
      ${panelHtml}
    </div>
  </div>`;
}

function wireAdaptiveChrome(root=document){
  root.querySelectorAll('.adaptive-chrome').forEach(box=>{
    if(box.dataset.adaptiveWired==='1') return;
    box.dataset.adaptiveWired='1';
    const summary=box.querySelector('.adaptive-chrome-summary');
    const setOpen=on=>{
      box.classList.toggle('is-open', on);
      document.body.classList.toggle('adaptive-open', on);
      if(summary) summary.setAttribute('aria-expanded', on?'true':'false');
    };
    box.querySelectorAll('[data-adaptive-toggle]').forEach(el=>{
      el.addEventListener('click', e=>{
        e.preventDefault();
        e.stopPropagation();
        setOpen(!box.classList.contains('is-open'));
      });
    });
  });
}

function syncLayoutMode(){
  const desktop=window.matchMedia('(min-width:900px)').matches;
  document.body.classList.toggle('layout-desktop', desktop);
  document.body.classList.toggle('layout-mobile', !desktop);
  if(desktop){
    document.querySelectorAll('.adaptive-chrome.is-open').forEach(box=>box.classList.remove('is-open'));
    document.body.classList.remove('adaptive-open');
  }
  const rail=document.querySelector('nav.dock')||document.querySelector('nav');
  if(desktop && rail && rail.style.display!=='none'){
    document.documentElement.style.setProperty('--rail-w', '220px');
  }else{
    document.documentElement.style.setProperty('--rail-w', '0px');
  }
  scheduleMeasureChrome();
}

function measureChrome(){
  const root=document.documentElement;
  const nav=document.querySelector('nav');
  const childMode=document.body.classList.contains('mode-child');
  const storeFs=document.body.classList.contains('store-fullscreen');
  const matrixFs=document.body.classList.contains('matrix-fullscreen');
  const desktop=document.body.classList.contains('layout-desktop');
  const navHidden=childMode || storeFs || matrixFs || !nav || nav.style.display==='none';
  let navH=0;
  if(childMode){
    const kidDock=document.querySelector('.kid-dock');
    if(kidDock){
      const style=getComputedStyle(kidDock);
      if(style.display!=='none' && style.visibility!=='hidden'){
        navH=Math.ceil(kidDock.getBoundingClientRect().height)||64;
      }
    }else{
      navH=64;
    }
    root.style.setProperty('--kid-dock-h', navH+'px');
    document.body.style.setProperty('--kid-dock-h', navH+'px');
  }else{
    root.style.setProperty('--kid-dock-h', '0px');
  }
  if(!navHidden && !childMode){
    if(desktop){
      navH=0;
      root.style.setProperty('--rail-w', '220px');
      document.body.style.setProperty('--rail-w', '220px');
    }else{
      navH=Math.ceil(nav.getBoundingClientRect().height);
      root.style.setProperty('--rail-w', '0px');
      document.body.style.setProperty('--rail-w', '0px');
    }
  }else{
    root.style.setProperty('--rail-w', '0px');
    document.body.style.setProperty('--rail-w', '0px');
  }
  const dockEl=document.querySelector('.stock-footer-actions, .store-finish.bottom-dock');
  let dockH=0;
  if(dockEl){
    const style=getComputedStyle(dockEl);
    if(style.display!=='none' && style.visibility!=='hidden'){
      dockH=Math.ceil(dockEl.getBoundingClientRect().height);
    }
  }
  const chatH=0;
  const zoFab=document.getElementById('navChat');
  const fabVisible=!!zoFab && !zoFab.hidden && getComputedStyle(zoFab).display!=='none'
    && !document.body.classList.contains('adaptive-open')
    && !storeFs && !matrixFs;
  const fabClear=fabVisible ? 72 : 0;
  [root, document.body].forEach(el=>{
    el.style.setProperty('--nav-total', `${navH}px`);
    el.style.setProperty('--dock-h', `${dockH}px`);
    el.style.setProperty('--chat-h', `${chatH}px`);
    el.style.setProperty('--fab-clear', `${fabClear}px`);
  });
}

function scheduleMeasureChrome(){
  requestAnimationFrame(()=>{
    measureChrome();
    requestAnimationFrame(measureChrome);
  });
}

function render(){
  if(state.mode === 'child' && state.child) return renderChild();
  if(!document.body.classList.contains('auth-pending') && !state._routeBoot){
    state._routeBoot = true;
    applyRouteFromHash();
  }
  if(state.tab==='talk' && state.mode!=='staff') state.tab='home';
  const restoreMatrixFs = document.body.classList.contains('matrix-fullscreen')
    ? (document.querySelector('.matrix-shell.is-fullscreen .matrix-toolbar-title')?.textContent || '')
    : '';
  document.body.classList.remove('mode-child');
  document.body.classList.remove('store-fullscreen');
  document.body.classList.remove('matrix-fullscreen');
  const bottom=document.getElementById('bottomPanel');
  if(bottom) bottom.style.display='';
  document.querySelector('nav').style.display = '';
  const zoFab=document.getElementById('navChat');
  if(zoFab){
    zoFab.hidden=false;
    zoFab.setAttribute('aria-label', t('helpChat'));
    zoFab.title = t('helpChat');
  }
  paintTopChrome();
  document.querySelectorAll('nav button[data-tab]').forEach(b=>b.classList.toggle('on', b.dataset.tab===state.tab));
  document.querySelectorAll('[data-nav]').forEach(s=>{
    s.textContent = t('nav' + s.dataset.nav[0].toUpperCase() + s.dataset.nav.slice(1));
  });
  document.querySelectorAll('nav button[data-staff-only]').forEach(b=>{
    b.hidden = state.mode!=='staff';
  });
  if(state.tab!=='talk') stopTalkPanelPoll();

  const stockDraftActive=state.tab==='stock' && state.house!=='all' && stockDraftEntries().length>0;
  const storeDock=state.tab==='shop' && fridayEntries(shopHouse()).some(e=>e.status==='pending');
  // Only shift the Zo-Ai FAB when the draft footer is actually on screen.
  document.body.classList.toggle('has-stock-dock', stockDraftActive);
  document.body.classList.toggle('has-store-dock', storeDock);
  document.body.classList.toggle('store-fullscreen', storeDock);
  document.body.classList.toggle('has-stock-draft', stockDraftActive);
  document.body.classList.toggle('has-bulk-bar', !!(state.selectMode && state.selectedIds.length));
  document.body.classList.toggle('chat-open', !!state.chatOpen);
  // Lets the stylesheet theme a single tab without touching the rest
  // of the app's ~1000 rules. Read by body[data-tab="…"] in index.html.
  document.body.dataset.tab = state.tab || '';

  document.getElementById('view').innerHTML =
      state.tab==='home'     ? viewHome()
    : state.tab==='gallery'  ? viewGallery()
    : state.tab==='schedule' ? viewSchedule()
    : state.tab==='stock'    ? viewStock()
    : state.tab==='shop'     ? viewShop()
    : state.tab==='kids'     ? viewKids()
    : state.tab==='talk'     ? viewTalk()
    : viewBook();
  wire();
  if(state.tab==='kids') wireKidsView(document.getElementById('view'));
  if(state.tab==='gallery') bindGallery(document.getElementById('view'));
  if(state.tab==='talk'){
    const mount=document.getElementById('talkPageMount');
    if(mount) mountStaffTalkChat(mount);
  }
  if(restoreMatrixFs && state.tab==='schedule'){
    const shell=[...document.querySelectorAll('.matrix-shell')].find(s=>
      (s.querySelector('.matrix-toolbar-title')?.textContent||'')===restoreMatrixFs);
    if(shell) enterMatrixFullscreen(shell);
  }
  syncLayoutMode();
  scheduleMeasureChrome();
  syncLocationHash();
  if(consumePresenceDeepLink()) queueMicrotask(()=>sheetShiftPresence());
  else maybePromptShiftPresence();
}

function wire(){
  const v = document.getElementById('view');
  wireAdaptiveChrome(v);
  v.querySelectorAll('[data-page-act]').forEach(b=>{
    b.onclick=()=>{ feedback('tap'); onTopAction(b.dataset.pageAct); };
  });

  v.querySelectorAll('[data-admin-staff]').forEach(button=>button.onclick=()=>sheetAdminStaff(button.dataset.adminStaff));
  v.querySelectorAll('[data-admin-go]').forEach(button=>button.onclick=()=>{
    const destination=button.dataset.adminGo;
    if(destination==='audit'){state.tab='book';state.bookPane='log';state.bookRange='week';}
    else{state.tab='schedule';state.scheduleView=destination;}
    render();
  });
  v.querySelectorAll('[data-admin-broadcast]').forEach(button=>button.onclick=()=>{
    feedback('open');
    sheetBroadcastEmail();
  });
  v.querySelectorAll('[data-admin-automations]').forEach(button=>button.onclick=()=>{
    feedback('open');
    sheetAdminAutomations();
  });
  bindAdminRewardCenter(v);
  const homeCalendar=v.querySelector('#homeCalendar');
  if(homeCalendar) homeCalendar.onclick=()=>{
    feedback('open');
    if(state.user) sheetCalendar(state.user.id,'staff');
  };

  const homeAllEvents=v.querySelector('#homeAllEvents');
  if(homeAllEvents) homeAllEvents.onclick=()=>{state.tab='schedule';state.scheduleView='events';render();};
  v.querySelectorAll('[data-home-jump]').forEach(btn=>{
    btn.onclick=()=>{
      feedback('tap');
      const jump=btn.dataset.homeJump;
      if(jump==='shop'){ state.tab='shop'; state.shopPanel='plan'; clearSelection(); render(); return; }
      if(jump==='stock'){ state.tab='stock'; clearSelection(); render(); return; }
      if(jump==='kids'){ state.tab='kids'; state.staffKidId=null; render(); return; }
      if(jump==='gallery'){ state.tab='gallery'; refreshGallery({silent:true}).finally(()=>render()); return; }
      state.tab='schedule';
      state.scheduleView=jump==='events'?'events':'day';
      render();
    };
  });
  const homeGalleryOpen=v.querySelector('#homeGalleryOpen');
  if(homeGalleryOpen) homeGalleryOpen.onclick=()=>{
    feedback('open');
    state.tab='gallery';
    refreshGallery({silent:true}).finally(()=>render());
  };
  const homeWriteBook=v.querySelector('#homeWriteBook');
  if(homeWriteBook) homeWriteBook.onclick=()=>{
    feedback('open');
    state.tab='book';
    state.bookPane='shift';
    state.bookJournalMode='ink';
    render();
    queueMicrotask(()=>document.getElementById('shiftNoteText')?.focus());
  };
  const homeQuickBook=v.querySelector('#homeQuickBook');
  if(homeQuickBook) homeQuickBook.onclick=()=>{
    feedback('open');
    state.tab='book';
    state.bookPane='shift';
    render();
  };
  const teamBanner=v.querySelector('#teamNoticeBanner');
  if(teamBanner) teamBanner.onclick=()=>{dismissTeamNotice();render();};
  const openHomePresence=()=>{ feedback('open'); sheetShiftPresence(); };
  v.querySelectorAll('#homeShiftPresence, #homeShiftPresenceStep').forEach(btn=>{
    btn.onclick=openHomePresence;
  });
  const homeShiftStock=v.querySelector('#homeShiftStock');
  if(homeShiftStock) homeShiftStock.onclick=()=>{ feedback('select'); sheetShiftStockCheck(); };
  const homeShiftJournal=v.querySelector('#homeShiftJournal');
  if(homeShiftJournal) homeShiftJournal.onclick=()=>{
    feedback('open');
    state.tab='book';
    state.bookPane='shift';
    state.bookJournalMode='ink';
    render();
    queueMicrotask(()=>document.getElementById('shiftNoteText')?.focus());
  };
  const homeShiftEnd=v.querySelector('#homeShiftEnd');
  if(homeShiftEnd) homeShiftEnd.onclick=()=>{ feedback('open'); sheetShiftEnd(); };
  v.querySelectorAll('[data-inbox-jump]').forEach(btn=>{
    btn.onclick=()=>runInboxJump(btn.dataset.inboxJump);
  });
  v.querySelectorAll('[data-kid-open]').forEach(btn=>{
    btn.onclick=()=>{ state.tab='kids'; state.staffKidId=btn.dataset.kidOpen; render(); };
  });

  v.querySelectorAll('#shiftStockCheckOpen, #stockShiftCheck').forEach(btn=>{
    btn.onclick=()=>{ feedback('select'); sheetShiftStockCheck(); };
  });
  v.querySelectorAll('#shiftPresenceOpen').forEach(btn=>{
    btn.onclick=()=>{ feedback('open'); sheetShiftPresence(); };
  });
  const zoAiBanner=v.querySelector('#zoAiBanner');
  if(zoAiBanner) zoAiBanner.onclick=()=>{ dismissZoAiBanner(); openZoAi(); };
  const zoAiBannerDismiss=v.querySelector('#zoAiBannerDismiss');
  if(zoAiBannerDismiss) zoAiBannerDismiss.onclick=()=>{ dismissZoAiBanner(); render(); };
  v.querySelectorAll('[data-task]').forEach(b=>b.onclick=()=>{
    const entryId=b.dataset.task,dateStr=b.dataset.taskDate,employeeId=b.dataset.taskEmployee;
    const idx=(DB.taskCompletions||[]).findIndex(x=>x.date===dateStr&&x.entryId===entryId&&x.employeeId===employeeId);
    const reopening=idx>=0;
    if(reopening) DB.taskCompletions.splice(idx,1);
    else DB.taskCompletions.push({id:'tc'+uid(),date:dateStr,entryId,employeeId,completedAt:Date.now(),completedBy:state.user?.id||employeeId});
    logEntry('SCHEDULE',`${reopening?t('taskReopened'):t('taskDone')}: ${dateStr}`);
    render(); toast(reopening?t('taskReopened'):t('taskDone'),'success');
  });

  const addEvent=v.querySelector('#addEvent');
  if(addEvent) addEvent.onclick=()=>sheetEvent();
  v.querySelectorAll('[data-event]').forEach(b=>b.onclick=()=>{
    const event=DB.events.find(e=>e.id===b.dataset.event); if(event) sheetEvent(event);
  });
  v.querySelectorAll('[data-event-delete]').forEach(b=>b.onclick=()=>{
    const event=DB.events.find(e=>e.id===b.dataset.eventDelete); if(!event) return;
    if(!confirm(`${t('deleteEvent')}: ${L(event)}?`)) return;
    DB.events=DB.events.filter(e=>e.id!==event.id);
    logEntry('EVENT',`${t('eventDeleted')}: ${L(event)}`);
    if(!save()) return;
    render();toast(t('eventDeleted'),'success');
  });

  v.querySelectorAll('#schView button').forEach(b=>{
    b.onclick = () => {
      exitMatrixFullscreen();
      state.scheduleView = b.dataset.v;
      if(state.scheduleView === 'calendar' && !state.calendarMonth){
        state.calendarMonth = iso(new Date()).slice(0, 7) + '-01';
      }
      syncLocationHash();
      render();
    };
  });
  v.querySelectorAll('[data-matrix-fs]').forEach(btn=>{
    btn.onclick=()=>{
      const shell=btn.closest('.matrix-shell');
      if(!shell) return;
      feedback('open');
      enterMatrixFullscreen(shell);
    };
  });
  v.querySelectorAll('[data-matrix-fs-close]').forEach(btn=>{
    btn.onclick=()=>{ feedback('tap'); exitMatrixFullscreen(); };
  });
  v.querySelectorAll('#hFilter button').forEach(b=>{
    b.onclick = () => { state.houseFilter = b.dataset.h; render(); };
  });
  v.querySelectorAll('#sHouse button, #shHouse button').forEach(b=>{
    b.onclick = () => {
      if(b.dataset.h!==state.house) clearStockDraft();
      state.house = b.dataset.h;
      render();
    };
  });
  v.querySelectorAll('.day').forEach(d=>{
    d.onclick = () => { state.date = d.dataset.date; render(); };
  });
  v.querySelectorAll('[data-jump-day]').forEach(b=>{
    b.onclick = () => {
      state.date = b.dataset.jumpDay;
      state.scheduleView = 'day';
      feedback('select');
      render();
    };
  });
  v.querySelectorAll('[data-shift]').forEach(b=>{
    b.onclick = () => {
      const d = new Date(state.date+'T12:00:00');
      d.setDate(d.getDate() + Number(b.dataset.shift));
      state.date = iso(d); render();
    };
  });
  v.querySelectorAll('[data-open]').forEach(el=>{
    el.onclick = () => {
      const dateStr = el.dataset.entryDate || state.date;
      const e = entriesFor(dateStr).find(x=>x.id===el.dataset.open);
      if(e){ state.date = dateStr; sheetEntry(e, dateStr); }
    };
  });
  v.querySelectorAll('[data-remove-entry]').forEach(btn=>{
    btn.onclick = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const dateStr=btn.dataset.entryDate||state.date;
      const e=entriesFor(dateStr).find(x=>x.id===btn.dataset.removeEntry);
      if(e) cancelScheduleEntry(e, dateStr, {onDone:()=>render()});
    };
  });
  v.querySelectorAll('[data-open-entry]').forEach(el=>{
    const open=()=>{
      const dateStr=el.dataset.entryDate||state.date;
      const e=entriesFor(dateStr).find(x=>x.id===el.dataset.openEntry);
      if(!e) return;
      state.date=dateStr;
      sheetEntry(e, dateStr);
    };
    el.onclick=ev=>{
      if(ev.target.closest('[data-remove-entry]')) return;
      ev.preventDefault();
      ev.stopPropagation();
      open();
    };
    el.onkeydown=ev=>{
      if(ev.key==='Enter'||ev.key===' '){
        if(ev.target.closest('[data-remove-entry]')) return;
        ev.preventDefault();
        ev.stopPropagation();
        open();
      }
    };
  });
  v.querySelectorAll('[data-add]').forEach(b=>{
    b.onclick = () => {
      const dateStr = b.dataset.addDate || state.date;
      if(b.dataset.addDate) state.date = dateStr;
      sheetEntry(null, dateStr, {
        block: b.dataset.add,
        houseId: b.dataset.house || undefined,
      });
    };
  });
  v.querySelectorAll('[data-cell]').forEach(td=>{
    const openCell = () => {
      if(td.dataset.cell.startsWith('shift:')){
        const [,employeeId,day]=td.dataset.cell.split(':');sheetShiftDay(employeeId,Number(day));return;
      }
      const [ds, block, houseId, employeeId] = td.dataset.cell.split('|');
      state.date = ds;
      sheetEntry(null, ds, {block, houseId: houseId||null, employeeId: employeeId||null});
    };
    td.onclick = openCell;
    td.onkeydown = e => { if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openCell(); } };
  });

  // Σημειώσεις εβδομάδας
  const wnSave = v.querySelector('#wnSave');
  if(wnSave) wnSave.onclick = () => {
    askPin(t('saveNotes'), who => {
      state.user = who;
      const k = weekKey(state.date);
      DB.weeks[k] = {
        ...(DB.weeks[k]||{}),
        hintAfternoon: v.querySelector('#wnAfternoon').value.trim(),
        projects:      v.querySelector('#wnProjects').value.trim(),
        materials:     v.querySelector('#wnMaterials').value.trim(),
        remarks:       v.querySelector('#wnRemarks').value.trim(),
        createdBy: who.id, createdAt: Date.now(),
      };
      logEntry('NOTES', `${t('weekNotes')} ${k}`);
      save(); render(); toast(t('notesSaved'));
    });
  };
  const wnToList = v.querySelector('#wnToList');
  if(wnToList) wnToList.onclick = () => {
    const raw = v.querySelector('#wnMaterials').value;
    const lines = raw.split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean);
    if(!lines.length){ toast(t('materials')); return; }
    askPin(t('toShoppingList'), who => {
      state.user = who;
      lines.forEach(line=>{
        const m = line.match(/^(.*?)\s+(\d+(?:[.,]\d+)?)\s*(\S+)?$/);
        const nm = (m ? m[1] : line).trim();
        const p = PRODUCTS().find(x=>x.de===nm || x.el===nm);
        DB.listEntries.push({
          id: uid(), productId: p ? p.id : null, name: nm,
          qty:  m ? parseFloat(m[2].replace(',','.')) : 1,
          unit: (m && m[3]) ? m[3] : 'Stk',
          houseId: shopHouse(), fridayDate:state.shopFriday||fridayFor(), by: who.id, status:'open',
        });
      });
      logEntry('SHOP', `${t('materials')} → ${t('shopTitle')}: ${lines.join(', ')}`, {houseId: state.house});
      save(); render(); toast(T[state.lang].materialsMoved(lines.length));
    });
  };

  v.querySelectorAll('[data-stock-product]').forEach(b=>{
    // Long-press options on fridge rows (IN / OUT / shop / board).
    // `held` skips the click that would otherwise open detail right after the menu.
    let holdTimer=null, moved=false, held=false, sx=0, sy=0;
    const clear=()=>{ if(holdTimer){ clearTimeout(holdTimer); holdTimer=null; } };
    b.onclick=ev=>{
      if(held){ held=false; ev.preventDefault(); ev.stopPropagation(); return; }
      sheetStockDetail(b.dataset.stockProduct,state.house);
    };
    b.onpointerdown=ev=>{
      if(state.house==='all') return;
      moved=false; held=false; sx=ev.clientX; sy=ev.clientY;
      clear();
      holdTimer=setTimeout(()=>{
        holdTimer=null;
        if(moved) return;
        held=true;
        ev.preventDefault?.();
        const pid=b.dataset.stockProduct; if(!pid) return;
        const p=prod(pid); if(!p) return;
        document.querySelectorAll('.stock-hold-menu').forEach(el=>el.remove());
        const menu=document.createElement('div');
        menu.className='stock-hold-menu';
        menu.innerHTML=`<div class="stock-hold-kicker">${esc(L(p))}</div>
          <button type="button" class="hold-in" data-act="in">${t('stockHoldIn')}</button>
          <button type="button" class="hold-out" data-act="out">${t('stockHoldOut')}</button>
          <button type="button" data-act="shop">${t('stockHoldShop')}</button>
          <button type="button" data-act="board">${t('stockBoard')}</button>
          <button type="button" data-act="detail">${t('stockHoldDetail')}</button>`;
        document.body.appendChild(menu);
        const place=()=>{
          const w=menu.offsetWidth, h=menu.offsetHeight;
          menu.style.left=Math.min(window.innerWidth-w-8, Math.max(8, sx-w/2))+'px';
          menu.style.top=Math.min(window.innerHeight-h-8, Math.max(8, sy-20))+'px';
        };
        place();
        feedback('select');
        menu.querySelectorAll('button').forEach(btn=>{
          btn.onclick=()=>{
            menu.remove();
            held=false;
            const act=btn.dataset.act;
            if(act==='in'){ adjustStockDraft(pid,'IN'); render(); }
            else if(act==='out'){ adjustStockDraft(pid,'OUT'); render(); }
            else if(act==='shop'){
              if(requestWantBought(pid, state.house)) render();
            }else if(act==='board') sheetStockBoard('IN', pid);
            else sheetStockDetail(pid, state.house);
          };
        });
        const dismiss=e=>{ if(menu.contains(e.target)) return; menu.remove(); held=false; document.removeEventListener('pointerdown', dismiss, true); };
        setTimeout(()=>document.addEventListener('pointerdown', dismiss, true), 0);
      }, 420);
    };
    b.onpointermove=ev=>{ if(Math.hypot(ev.clientX-sx, ev.clientY-sy)>10){ moved=true; clear(); } };
    b.onpointerup=clear; b.onpointercancel=clear;
  });
  v.querySelectorAll('[data-want-shop]').forEach(btn=>{
    btn.onclick=ev=>{
      ev.preventDefault();
      ev.stopPropagation();
      const pid=btn.dataset.wantShop;
      const houseId=btn.dataset.wantHouse||state.house;
      if(requestWantBought(pid, houseId)) render();
    };
  });
  const stockOpenBoard=v.querySelector('#stockOpenBoard');
  if(stockOpenBoard) stockOpenBoard.onclick=()=>sheetStockBoard('IN');
  const stockQuickList=v.querySelector('#stockQuickList');
  if(stockQuickList) stockQuickList.onclick=()=>{
    const n=autoFillShoppingFromStock(state.house);
    if(n){ state.tab='shop'; state.shopPanel='plan'; render(); }
  };
  const stockQuickFood=v.querySelector('#stockQuickFood');
  if(stockQuickFood) stockQuickFood.onclick=()=>{ sheetStockBoard('IN'); setTimeout(()=>sheetEl.querySelector('#sbAddFood')?.click(), 80); };
  const stockEmptyClear=v.querySelector('#stockEmptyClear');
  if(stockEmptyClear) stockEmptyClear.onclick=()=>{ state.stockQuery=''; feedback('toggle'); render(); };
  const stockEmptyAdd=v.querySelector('#stockEmptyAdd');
  if(stockEmptyAdd) stockEmptyAdd.onclick=()=>{ sheetStockBoard('IN'); setTimeout(()=>sheetEl.querySelector('#sbAddFood')?.click(), 80); };
  const stockTilesToggle=v.querySelector('#stockTilesToggle');
  if(stockTilesToggle) stockTilesToggle.onclick=()=>{
    state.stockTiles=!state.stockTiles;
    try{ localStorage.setItem('paidia.stockTiles', state.stockTiles?'1':'0'); }catch{}
    feedback('toggle');
    render();
  };
  v.querySelectorAll('[data-stock-step]').forEach(b=>b.onclick=event=>{
    event.preventDefault();
    event.stopPropagation();
    if(state.house==='all'){ toast(t('selectHouse'),'info'); return; }
    const pid=b.dataset.pid, dir=b.dataset.stockStep;
    if(!pid || !dir) return;
    adjustStockDraft(pid, dir);
  });
  v.querySelectorAll('[data-draft-reason]').forEach(b=>{
    b.onclick=()=>{ state.stockDraftReason=b.dataset.draftReason; feedback('select'); render(); };
  });
  const stockDraftClear=v.querySelector('#stockDraftClear');
  if(stockDraftClear) stockDraftClear.onclick=()=>{ clearStockDraft(); feedback('toggle'); render(); };
  const stockDraftSave=v.querySelector('#stockDraftSave');
  if(stockDraftSave) stockDraftSave.onclick=()=>commitStockDraft();
  const stockCategories=[...v.querySelectorAll('[data-stock-category]')];
  if(stockCategories.length){
    const forceOpen=!!state.stockQuery||state.stockFilter!=='all';
    if(!Array.isArray(state.stockOpenCategories)){
      state.stockOpenCategories=stockCategories
        .filter(d=>d.dataset.defaultOpen==='1')
        .map(d=>d.dataset.stockCategory);
    }
    stockCategories.forEach(d=>{
      d.open=forceOpen||state.stockOpenCategories.includes(d.dataset.stockCategory);
      d.ontoggle=()=>{
        if(forceOpen)return;
        const id=d.dataset.stockCategory,set=new Set(state.stockOpenCategories);
        if(d.open)set.add(id);else set.delete(id);state.stockOpenCategories=[...set];
      };
    });
  }
  v.querySelectorAll('[data-stock-filter]').forEach(b=>{
    b.onclick=()=>{state.stockFilter=b.dataset.stockFilter;render();};
  });
  const stockSearch=v.querySelector('#stockSearch');
  if(stockSearch) stockSearch.oninput=()=>{
    state.stockQuery=stockSearch.value;render();
    const next=document.querySelector('#stockSearch');if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length);}
  };
  const stockClear=v.querySelector('#stockClear');
  if(stockClear) stockClear.onclick=()=>{state.stockQuery='';render();};
  const stockToList=v.querySelector('#stockToList');
  if(stockToList) stockToList.onclick=()=>{state.tab='shop';render();};

  const sf = v.querySelector('#startFriday');
  if(sf) sf.onclick = startFridayBatch;
  const shopAutoFill=v.querySelector('#shopAutoFill');
  if(shopAutoFill) shopAutoFill.onclick=()=>{ autoFillShoppingFromStock(shopHouse()); render(); };
  v.querySelectorAll('[data-shop-panel]').forEach(b=>{
    b.onclick=()=>{ state.shopPanel=b.dataset.shopPanel; if(state.selectMode==='shop') clearSelection(); feedback('toggle'); render(); };
  });
  const shopSelectToggle=v.querySelector('#shopSelectToggle');
  if(shopSelectToggle) shopSelectToggle.onclick=()=>{
    if(state.selectMode==='shop') exitSelectMode();
    else enterSelectMode('shop');
    feedback('toggle'); render();
  };
  const stockSelectToggle=v.querySelector('#stockSelectToggle');
  if(stockSelectToggle) stockSelectToggle.onclick=()=>{
    if(state.house==='all'){ toast(t('selectHouse'),'info'); return; }
    if(state.selectMode==='stock') exitSelectMode();
    else enterSelectMode('stock');
    feedback('toggle'); render();
  };
  const storeSelectToggle=v.querySelector('#storeSelectToggle');
  if(storeSelectToggle) storeSelectToggle.onclick=()=>{
    if(state.selectMode==='store') exitSelectMode();
    else enterSelectMode('store');
    feedback('toggle'); render();
  };
  v.querySelectorAll('[data-bulk-toggle]').forEach(b=>{
    b.onclick=ev=>{
      ev.preventDefault(); ev.stopPropagation();
      toggleSelected(b.dataset.bulkToggle);
      feedback('select'); render();
    };
  });
  v.querySelectorAll('[data-bulk]').forEach(b=>{
    b.onclick=()=>{
      const act=b.dataset.bulk;
      const ids=[...state.selectedIds];
      if(!ids.length) return;
      if(state.selectMode==='shop'){
        if(act==='remove'){
          const reasonId=(LIST_REMOVE_REASONS()[0]||{}).id||'bulk';
          const reason=LIST_REMOVE_REASONS().find(r=>r.id===reasonId);
          const label=reason?L(reason):'bulk';
          let n=0;
          ids.forEach(id=>{
            const entry=DB.listEntries.find(e=>e.id===id);
            if(!entry || entry.status!=='open') return;
            entry.status='removed';
            entry.removeReasonId=reasonId;
            entry.removeReason=label;
            entry.removedAt=Date.now();
            entry.removedBy=state.user?.id||null;
            n++;
          });
          if(n){ save(); toast(T[state.lang].bulkRemoved(n),'success'); }
          exitSelectMode(); render(); return;
        }
        if(act==='qty-minus' || act==='qty-plus'){
          const delta=act==='qty-plus'?1:-1;
          ids.forEach(id=>{
            const entry=DB.listEntries.find(e=>e.id===id);
            if(!entry || entry.status!=='open') return;
            entry.qty=Math.max(1, roundStock((Number(entry.qty)||1)+delta));
          });
          save(); feedback('toggle'); render(); return;
        }
      }
      if(state.selectMode==='stock'){
        if(act==='to-list'){
          let n=0;
          ids.forEach(pid=>{ if(requestWantBought(pid, state.house)) n++; });
          toast(T[state.lang].bulkListed(n),'success');
          exitSelectMode(); render(); return;
        }
        if(act==='out'){
          ids.forEach(pid=>adjustStockDraft(pid,'OUT'));
          exitSelectMode(); render(); return;
        }
        if(act==='clear-empty'){
          ids.forEach(pid=>{
            const key=stockKey(state.house,pid);
            const qty=DB.stock[key]??0;
            const delta=state.stockDraft[pid]||0;
            const target=-(qty+delta);
            if(target) state.stockDraft[pid]=(state.stockDraft[pid]||0)+target;
          });
          exitSelectMode(); render(); return;
        }
      }
      if(state.selectMode==='store'){
        ids.forEach(id=>{
          const entry=DB.listEntries.find(e=>e.id===id);
          if(!entry || entry.status!=='pending') return;
          if(act==='found') entry.decision='bought';
          else if(act==='missing') entry.decision='unavailable';
          else if(act==='undo') delete entry.decision;
        });
        save();
        toast(T[state.lang].bulkDecided(ids.length),'success');
        exitSelectMode(); render();
      }
    };
  });
  v.querySelectorAll('[data-cal-shift]').forEach(b=>{
    b.onclick=()=>{
      const base = state.calendarMonth ? new Date(state.calendarMonth+'T12:00:00') : new Date();
      base.setMonth(base.getMonth()+Number(b.dataset.calShift));
      state.calendarMonth = iso(base).slice(0,7)+'-01';
      render();
    };
  });
  v.querySelectorAll('[data-cal-date]').forEach(b=>{
    b.onclick=()=>{ state.date=b.dataset.calDate; state.scheduleView='day'; render(); };
  });
  const exportIcs=v.querySelector('#exportIcs');
  if(exportIcs) exportIcs.onclick=exportScheduleCalendarIcs;
  const enableNotifs=v.querySelector('#enableNotifs');
  if(enableNotifs) enableNotifs.onclick=async()=>{
    const ok=await enableAppNotifications();
    toast(ok?t('notifEnabled'):t('notifDenied'), ok?'success':'error');
    if(ok) runNotificationSweep({force:true});
    render();
  };
  const cancelFriday=v.querySelector('#cancelFriday');
  if(cancelFriday)cancelFriday.onclick=cancelFridayBatch;
  v.querySelectorAll('[data-friday-shift]').forEach(b=>{
    b.onclick=()=>{ state.shopFriday=shiftDate(state.shopFriday||fridayFor(),Number(b.dataset.fridayShift)); render(); };
  });
  const fridayInput=v.querySelector('#shopFridayDate');
  if(fridayInput) fridayInput.onchange=()=>{ state.shopFriday=fridayFor(fridayInput.value); render(); };
  const cb = v.querySelector('#confirmBatch');
  if(cb) cb.onclick = confirmFridayBatch;
  v.querySelectorAll('[data-decision]').forEach(b=>{
    b.onclick = () => {
      const e = DB.listEntries.find(x=>x.id===b.dataset.entry);if(!e)return;
      e.decision=b.dataset.decision==='undo'?undefined:b.dataset.decision;
      feedback('select');
      save(); render();
    };
  });
  const storeSearch=v.querySelector('#storeSearch');
  if(storeSearch)storeSearch.oninput=()=>{
    state.shopQuery=storeSearch.value;render();
    const next=document.querySelector('#storeSearch');if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length);}
  };
  const storeShowDone=v.querySelector('#storeShowDone');
  if(storeShowDone) storeShowDone.onclick=()=>{ state.storeShowDone=!state.storeShowDone; render(); };
  const storeShowDoneEmpty=v.querySelector('#storeShowDoneEmpty');
  if(storeShowDoneEmpty) storeShowDoneEmpty.onclick=()=>{ state.storeShowDone=true; render(); };
  const storeClearSearch=v.querySelector('#storeClearSearch');
  if(storeClearSearch) storeClearSearch.onclick=()=>{ state.shopQuery=''; render(); };
  v.querySelectorAll('[data-carry]').forEach(b=>{
    b.onclick = () => {
      const e = DB.listEntries.find(x=>x.id===b.dataset.carry);
      e.status = 'open'; delete e.decidedAt; delete e.decidedBy; delete e.missReason;
      save(); render();
    };
  });
  v.querySelectorAll('[data-remove-list]').forEach(b=>b.onclick=()=>sheetRemoveListItem(b.dataset.removeList));
  v.querySelectorAll('[data-list-qty]').forEach(button=>button.onclick=()=>{
    const entry=DB.listEntries.find(e=>e.id===button.dataset.entry);if(!entry)return;
    const product=entry.productId?prod(entry.productId):null;
    const step=product?stepFor(product):entry.unit==='g'?100:entry.unit==='kg'?0.5:1;
    entry.qty=Math.max(step,Math.round((Number(entry.qty)+Number(button.dataset.listQty)*step)*100)/100);
    save();
    const input=v.querySelector(`[data-list-q="${entry.id}"]`);
    if(input) input.value=entry.qty;
    else render();
  });
  v.querySelectorAll('[data-list-q]').forEach(input=>{
    input.onfocus=()=>input.select();
    input.onchange=()=>{
      const entry=DB.listEntries.find(e=>e.id===input.dataset.listQ);if(!entry)return;
      const product=entry.productId?prod(entry.productId):null;
      const step=product?stepFor(product):entry.unit==='g'?100:entry.unit==='kg'?0.5:1;
      const value=Math.round(Number(input.value.replace(',','.'))*100)/100;
      if(!Number.isFinite(value)||value<=0){input.value=entry.qty;toast(t('qty'));return;}
      entry.qty=Math.max(step,value);input.value=entry.qty;save();
    };
  });
  const quickName=v.querySelector('#cartQuickName'),quickAdd=v.querySelector('#cartQuickAdd');
  const addQuick=()=>{
    const name=quickName?.value.trim();if(!name){quickName?.focus();return;}
    const product=matchProduct(name),friday=state.shopFriday||fridayFor(),hid=shopHouse();
    const existing=fridayEntries(hid,friday).find(e=>e.status==='open'&&((product&&e.productId===product.id)||norm(e.name)===norm(name)));
    if(existing)existing.qty=Math.round((Number(existing.qty)+stepFor(product||{unit:existing.unit||'Stk'}))*100)/100;
    else DB.listEntries.push({id:uid(),productId:product?.id||null,name:product?L(product):name,qty:product?stepFor(product):1,unit:product?.unit||'Stk',houseId:hid,fridayDate:friday,by:state.user?.id||null,status:'open'});
    save();render();const next=document.querySelector('#cartQuickName');if(next)next.focus();
  };
  if(quickAdd)quickAdd.onclick=addQuick;
  if(quickName)quickName.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();addQuick();}};
  const shopStartAdd=v.querySelector('#shopStartAdd');
  if(shopStartAdd) shopStartAdd.onclick=()=>{
    const input=document.querySelector('#cartQuickName');
    if(input){ input.focus(); input.scrollIntoView({behavior:'smooth',block:'center'}); }
  };
  const importListHero=v.querySelector('#importListHero');
  if(importListHero) importListHero.onclick=()=>sheetImportList();
  const br = v.querySelector('#btnReceipt');
  if(br) br.onclick = sheetReceipt;
  const il = v.querySelector('#importList');
  if(il) il.onclick = () => sheetImportList();
  // History is also available via [data-page-act=shopHistory] in page-actions.

  v.querySelectorAll('[data-book-pane]').forEach(b=>{
    b.onclick = () => { state.bookPane = b.dataset.bookPane; feedback('toggle'); render(); };
  });
  v.querySelectorAll('[data-book-range]').forEach(b=>{
    b.onclick = () => { state.bookRange = b.dataset.bookRange; feedback('toggle'); render(); };
  });
  v.querySelectorAll('[data-book-type]').forEach(b=>{
    b.onclick = () => {
      const ty = b.dataset.bookType || '';
      state.bookFilter.type = state.bookFilter.type === ty ? '' : ty;
      feedback('toggle'); render();
    };
  });
  v.querySelectorAll('[data-book-who]').forEach(b=>{
    b.onclick = () => {
      const who = b.dataset.bookWho || '';
      state.bookFilter.employeeId = state.bookFilter.employeeId === who ? '' : who;
      if(who && state.bookPane==='people') state.bookPane = 'log';
      feedback('toggle'); render();
    };
  });
  v.querySelectorAll('[data-book-view]').forEach(b=>{
    b.onclick = () => { state.bookView = b.dataset.bookView; feedback('toggle'); render(); };
  });
  v.querySelectorAll('[data-book-tech]').forEach(b=>{
    b.onclick = () => { state.bookShowTech = !state.bookShowTech; feedback('toggle'); render(); };
  });
  const bookSearch = v.querySelector('#bookSearch');
  if(bookSearch){
    bookSearch.oninput = () => {
      state.bookFilter.q = bookSearch.value;
      const caret = bookSearch.selectionStart;
      render();
      const again = document.querySelector('#bookSearch');
      if(again){ again.focus(); try{ again.setSelectionRange(caret, caret); }catch{} }
    };
  }
  const bookSearchClear = v.querySelector('#bookSearchClear');
  if(bookSearchClear) bookSearchClear.onclick = () => { state.bookFilter.q = ''; render(); };
  const bookClearBtn = v.querySelector('#bookClearFilters');
  if(bookClearBtn) bookClearBtn.onclick = () => { bookClearFilters(); feedback('toggle'); render(); };

  const bf = v.querySelector('#bFix');
  if(bf) bf.onclick = sheetCorrection;
  const shiftMode=v.querySelector('#shiftNoteMode');
  if(shiftMode) shiftMode.onclick=()=>{
    state.bookJournalMode = shiftMode.dataset.journalMode==='rewrite'?'rewrite':'ink';
    feedback('toggle'); render();
  };
  const shiftSave=v.querySelector('#shiftNoteSave');
  if(shiftSave) shiftSave.onclick=()=>{
    if(!state.user){ toast(t('noUser'),'error'); return; }
    const text=(v.querySelector('#shiftNoteText')?.value||'').trim();
    if(!text){ toast(t('shiftDiaryPh'),'error'); return; }
    const mode=state.bookJournalMode==='rewrite'?'rewrite':'ink';
    askPin(t('shiftDiary'), who=>{
      state.user=who;
      writeShiftJournalPage(who.id, text, {mode});
      if(!save()) return;
      state.bookJournalMode='ink';
      render();
      feedback('save');
      toast(t('shiftDiarySaved'),'success');
    });
  };
}

document.querySelectorAll('nav button[data-tab]').forEach(b=>{
  b.onclick = () => {
    if(b.dataset.tab!=='stock' && state.tab==='stock') clearStockDraft();
    if(b.dataset.tab!==state.tab) clearSelection();
    state.tab = b.dataset.tab;
    syncLocationHash();
    if(state.tab==='gallery'){
      state.galleryLoading = true;
      render();
      refreshGallery({silent:true}).finally(()=>render());
      return;
    }
    render();
  };
});
document.getElementById('navChat')?.addEventListener('click', ()=>{
  feedback('tap');
  toggleChatPanel();
});
document.getElementById('chatClose')?.addEventListener('click', ()=>{
  feedback('tap');
  closeChatPanel();
});
document.getElementById('btnUser').onclick = () => (state.user||state.child) ? sheetSecurityAccess() : openGate();
document.getElementById('btnLang').onclick = () => setLang(state.lang === 'de' ? 'el' : 'de');
document.getElementById('btnNotifs')?.addEventListener('click', ()=>{
  if(state.mode!=='staff'){ toast(t('notifCenterEmpty'),'info'); return; }
  sheetNotifCenter();
});
document.getElementById('dockZoAi')?.addEventListener('click', ()=>{
  feedback('open'); openZoAi();
});
document.getElementById('btnProfiles').onclick = () => {
  feedback('tap');
  if(state.user||state.child) logoutServerSession();
  else openGate();
};

/* ════════════════════════════════════════════════════════════════
   Login panel: προφίλ → γρήγορο PIN
   ════════════════════════════════════════════════════════════════ */
const gateEl = document.getElementById('gate');
const gateBody = document.getElementById('gateBody');

async function sheetSecurityAccess(){
  const who=state.user||state.child;if(!who){openGate();return;}
  openSheet(`<div class="security-hero mail-hero">
      <div class="row" style="gap:12px;align-items:center">
        <div class="security-icon mail-icon">${esc(profileEmoji(who)||'👤')}</div>
        <div class="grow">
          <div class="import-kicker">Armonia Thassos</div>
          <h2 style="margin:3px 0">${t('securityAccess')}</h2>
          <div class="muted">${esc(profileName(who))}</div>
        </div>
      </div>
    </div>
    <div id="securityStorage" class="status-box" style="margin:0 0 12px" hidden></div>
    <div class="security-passkey-card" id="securityNotifs"></div>
    <div class="security-passkey-card" id="securityCalendar"></div>
    <div class="security-passkey-card" id="securityCustomize"></div>
    <div class="security-passkey-card email-card" id="securityProfile"><div class="muted">${t('reading')}</div></div>
    <div class="security-passkey-card" id="securityPin"></div>
    <div class="security-passkey-card" id="securityPasskey"><div class="muted">${t('reading')}</div></div>
    <button class="btn sec" id="securityTutorial">📘 ${t('tutorialOpen')}</button>
    <button class="btn sec" id="securitySwitch">↔ ${t('switchProfile')}</button>
    <button class="btn sec" id="securityLogout">${t('signOut')}</button>`);
  const profileCard=sheetEl.querySelector('#securityProfile'),card=sheetEl.querySelector('#securityPasskey');
  const customizeCard=sheetEl.querySelector('#securityCustomize');
  const notifCard=sheetEl.querySelector('#securityNotifs');
  const calendarCard=sheetEl.querySelector('#securityCalendar');
  const pinCard=sheetEl.querySelector('#securityPin');
  const storageEl=sheetEl.querySelector('#securityStorage');
  const pref=profilePref(who.id);
  if(notifCard){
    const perm=typeof Notification!=='undefined'?Notification.permission:'denied';
    const on=!!notifPrefs().enabled && perm==='granted';
    const child=state.mode==='child';
    const prefs=notifPrefsResolved();
    notifCard.innerHTML=`<b>🔔 ${esc(on?t('notifEnabled'):(child?t('notifEnableChild'):t('notifEnable')))}</b>
      <p class="muted" style="font-size:12px;margin:6px 0 10px">${esc(child?t('notifHintChild'):t('notifHint'))}</p>
      ${child?`<p class="muted" style="font-size:11px;margin:0 0 10px;line-height:1.4">${esc(t('childInstallIos'))}<br>${esc(t('childInstallAndroid'))}</p>`:''}
      <button class="btn ${on?'sec':''}" type="button" id="notifToggle">${esc(on?t('notifEnabled'):(child?t('notifEnableChild'):t('notifEnable')))}</button>
      <button class="btn sec sm" type="button" id="notifTestBtn" style="margin-top:8px" ${perm==='granted'?'':'disabled'}>${esc(t('notifTest'))}</button>
      ${on&&!child?`<div class="notif-prefs" style="margin-top:10px;display:grid;gap:8px">
        <label class="f"><span>${esc(t('notifQuietStart'))}</span><input type="time" id="notifQuietStart" value="${esc(prefs.quietStart)}"></label>
        <label class="f"><span>${esc(t('notifQuietEnd'))}</span><input type="time" id="notifQuietEnd" value="${esc(prefs.quietEnd)}"></label>
        <label class="f"><span>${esc(t('notifLeadMinutes'))}</span><input type="number" id="notifLeadMin" min="0" max="240" step="5" value="${prefs.leadMinutes}"></label>
        <button class="btn sec sm" type="button" id="notifPrefsSave">${esc(t('saveContact'))}</button>
      </div>`:''}
      <div id="notifStatus" class="status-box" style="display:none;margin-top:8px" role="status"></div>`;
    notifCard.querySelector('#notifToggle').onclick=async()=>{
      const st=notifCard.querySelector('#notifStatus');
      const ok=await enableAppNotifications();
      st.style.display='block';
      setStatus(st, ok?t('notifEnabled'):(Notification.permission==='denied'?t('notifDenied'):t('notifEnable')), ok?'success':'error');
      if(ok) sheetSecurityAccess();
    };
    notifCard.querySelector('#notifTestBtn').onclick=()=>{
      showAppNotification(t('notifTest'),{tag:'paidia-test', body:'Armonia Thassos', force:true});
    };
    const savePrefsBtn=notifCard.querySelector('#notifPrefsSave');
    if(savePrefsBtn) savePrefsBtn.onclick=()=>{
      const st=notifCard.querySelector('#notifStatus');
      const lead=Number(notifCard.querySelector('#notifLeadMin')?.value);
      setNotifPrefs({
        quietStart:notifCard.querySelector('#notifQuietStart')?.value||'22:00',
        quietEnd:notifCard.querySelector('#notifQuietEnd')?.value||'07:00',
        leadMinutes:Number.isFinite(lead)&&lead>=0?lead:30,
      });
      st.style.display='block';
      setStatus(st,t('autoSaved'),'success');
    };
  }
  if(calendarCard){
    calendarCard.innerHTML=`<b>📅 ${esc(t('calTitle'))}</b>
      <p class="muted" style="font-size:12px;margin:6px 0 10px">${esc(t('calHint'))}</p>
      <button class="btn" type="button" id="openMyCalendar">${esc(t('calApple'))}</button>
      <button class="btn sec" type="button" id="openMyCalendarMore" style="margin-top:8px">${esc(t('calGoogle'))} / ${esc(t('calOutlook'))}</button>`;
    const openCal=()=>{
      const mode=state.mode==='child'?'child':'staff';
      sheetCalendar(who.id, mode);
    };
    calendarCard.querySelector('#openMyCalendar').onclick=openCal;
    calendarCard.querySelector('#openMyCalendarMore').onclick=openCal;
  }
  if(customizeCard){
    customizeCard.innerHTML=`<div class="row between" style="align-items:center;gap:10px;margin-bottom:8px">
        <div><b>${t('profileSectionLook')}</b><div class="muted" style="font-size:11px;margin-top:3px">${esc(who.name)}</div></div>
        <div class="pa avatar" style="width:44px;height:44px;border-radius:50%;background:${esc(profileColor(who))};display:grid;place-items:center;font-weight:800">${esc(profileEmoji(who)||initials(profileName(who)))}</div>
      </div>
      <label class="f"><span>${t('profileNickname')}</span><input id="profileNick" value="${esc(pref.nickname||'')}" placeholder="${esc(who.name)}" maxlength="40"></label>
      <label class="f"><span>${t('profileEmoji')}</span><input id="profileEmoji" value="${esc(pref.emoji||'')}" placeholder="🙂" maxlength="4"></label>
      <label class="f"><span>${t('profileColor')}</span><input id="profileColor" type="color" value="${esc(profileColor(who))}"></label>
      <button class="btn" id="saveProfileLook" type="button">${t('saveContact')}</button>
      <div id="profileLookStatus" class="status-box" style="display:none;margin-top:8px" role="status"></div>`;
    customizeCard.querySelector('#saveProfileLook').onclick=()=>{
      const nickname=customizeCard.querySelector('#profileNick').value.trim().slice(0,40);
      const emoji=customizeCard.querySelector('#profileEmoji').value.trim().slice(0,4);
      const color=customizeCard.querySelector('#profileColor').value || who.color;
      DB.profilePrefs = DB.profilePrefs || {};
      DB.profilePrefs[who.id] = {nickname, emoji, color, updatedAt:Date.now()};
      if(save()){
        feedback('save');
        const st=customizeCard.querySelector('#profileLookStatus');
        st.style.display='block'; setStatus(st,t('profileSaved'),'success');
        render();
      }
    };
  }
  if(pinCard){
    pinCard.innerHTML=`<b>${t('profileSectionPin')}</b>
      <div class="muted" style="font-size:11.5px;margin:4px 0 10px;line-height:1.45">${esc(t('profilePinHint'))}</div>
      <label class="f"><span>${t('profilePinCurrent')}</span><input id="pinCurrent" type="password" inputmode="numeric" autocomplete="current-password" maxlength="6"></label>
      <label class="f"><span>${t('profilePinNew')}</span><input id="pinNew" type="password" inputmode="numeric" autocomplete="new-password" maxlength="6"></label>
      <label class="f"><span>${t('profilePinConfirm')}</span><input id="pinConfirm" type="password" inputmode="numeric" autocomplete="new-password" maxlength="6"></label>
      <button class="btn" id="saveProfilePin" type="button">${t('profilePinSave')}</button>
      <div id="profilePinStatus" class="status-box" style="display:none;margin-top:8px" role="status"></div>`;
    pinCard.querySelector('#saveProfilePin').onclick=async event=>{
      const button=event.currentTarget;
      const currentPin=pinCard.querySelector('#pinCurrent').value.trim();
      const pin=pinCard.querySelector('#pinNew').value.trim();
      const confirmPin=pinCard.querySelector('#pinConfirm').value.trim();
      const status=pinCard.querySelector('#profilePinStatus');
      status.style.display='block';
      if(!/^\d{4,6}$/.test(pin) || pin!==confirmPin){
        feedback('error'); setStatus(status,t('profilePinInvalid'),'error'); return;
      }
      button.disabled=true;
      try{
        await passkeyApi('/api/auth/profile/pin',{currentPin,pin,confirmPin});
        feedback('save');
        setStatus(status,t('profilePinChanged'),'success');
        pinCard.querySelector('#pinCurrent').value='';
        pinCard.querySelector('#pinNew').value='';
        pinCard.querySelector('#pinConfirm').value='';
        toast(t('profilePinChanged'),'success');
      }catch(error){
        feedback('error');
        const msg = error.code==='wrong_pin'?t('profilePinWrong')
          : error.code==='same_pin'?t('profilePinSame')
          : error.code==='invalid_pin'?t('profilePinInvalid')
          : (error.message||t('authUnavailable'));
        setStatus(status,msg,'error');
      }finally{ button.disabled=false; }
    };
  }
  let count=0;
  try{
    const [response,profilesResponse,healthResponse]=await Promise.all([
      fetch('/api/auth/session',{credentials:'same-origin'}),
      fetch('/api/auth/profiles',{credentials:'same-origin'}),
      fetch('/api/auth/health',{credentials:'same-origin'}).catch(()=>null),
    ]);
    const data=await response.json(),profilesData=await profilesResponse.json();
    const health=healthResponse?await healthResponse.json().catch(()=>null):null;
    if(storageEl && health){
      const durable=!!health.durableStorage || health?.database?.backend==='postgres';
      storageEl.hidden=false;
      storageEl.className=`status-box ${durable?'success':'error'}`;
      storageEl.textContent = durable ? t('profileStorageOk') : t('profileStorageWarn');
    }
    paintWebauthnOriginWarn(health, storageEl?.parentElement || sheetEl);
    if(!response.ok||!data.authenticated)throw new Error(t('authUnavailable'));
    if(!profilesResponse.ok||!Array.isArray(profilesData.profiles))throw new Error(t('authUnavailable'));
    const profiles=profilesData.profiles;
    const displayName=p=>{
      const person=p.mode==='child'?kid(p.profileId):emp(p.profileId);
      return person?profileName(person):p.profileId;
    };
    const paintProfile=selectedId=>{
      const selected=profiles.find(p=>p.profileId===selectedId)||profiles[0];if(!selected)return;
      const ready=!!profilesData.emailConfigured;
      const providerLabel=profilesData.emailProvider==='smtp'?'Gmail / SMTP'
        :profilesData.emailProvider==='resend'?'Resend':t('emailNotReady');
      const previewTitle=state.lang==='el'?'Email λειτουργεί':'E-Mail funktioniert';
      profileCard.innerHTML=`<div class="email-panel">
        <div class="email-panel-top">
          <div>
            <div class="email-panel-kicker">${t('profileSectionContact')}</div>
            <h3>${t('contactCardTitle')}</h3>
            <div class="muted" style="font-size:11.5px;margin-top:4px">${profilesData.canManageAll?t('adminsManageEmails'):esc(displayName(selected))}</div>
          </div>
          <span class="status-pill ${ready?'ok':'warn'}">${ready?`✓ ${esc(providerLabel)}`:`! ${esc(providerLabel)}`}</span>
        </div>
        <div class="email-preview" aria-hidden="true">
          <div class="mark">A</div>
          <div class="eyebrow">Armonia Thassos · Mail</div>
          <b>${esc(t('emailPreviewTitle'))}</b>
          <p>${esc(t('emailPreviewBody'))}</p>
          <div class="email-preview-chip">${ready?`✓ ${esc(previewTitle)}`:`! ${esc(t('emailNotReady'))}`}</div>
        </div>
        <div class="email-hint ${ready?'ok':'warn'}">${esc(ready?t('emailReadyHint'):t('emailOfflineHint'))}</div>
        ${profiles.length>1?`<label class="f"><span>${t('profileDetails')}</span><select id="profileEmailPicker">${profiles.map(p=>`<option value="${esc(p.profileId)}" ${p.profileId===selected.profileId?'selected':''}>${esc(displayName(p))} · ${p.mode==='child'?t('entryChild'):t('entryStaff')}</option>`).join('')}</select></label>`:''}
        <label class="f"><span>✉️ ${t('recoveryEmail')}</span><input type="email" id="profileEmail" value="${esc(selected.email||'')}" autocomplete="email" placeholder="name@example.com"></label>
        <label class="f"><span>📱 ${t('phoneLabel')}</span><input type="tel" id="profilePhone" value="${esc(selected.phone||'')}" autocomplete="tel" inputmode="tel" placeholder="+30 … / +49 …"></label>
        <p class="muted" style="font-size:11.5px;line-height:1.5">${t('recoveryEmailHint')} ${t('phoneHint')}</p>
        <div id="profileEmailStatus" class="status-box" style="display:none" role="status" aria-live="polite"></div>
        <div class="email-actions">
          <button class="btn" id="saveProfileEmail" type="button">${t('saveContact')}</button>
          <button class="btn sec" id="testProfileEmail" type="button" ${!ready||!selected.email?'disabled':''}>${t('sendTestEmail')}</button>
        </div>
      </div>`;
      const picker=profileCard.querySelector('#profileEmailPicker');if(picker)picker.onchange=()=>paintProfile(picker.value);
      const input=profileCard.querySelector('#profileEmail');
      const phoneInput=profileCard.querySelector('#profilePhone');
      const status=profileCard.querySelector('#profileEmailStatus');
      profileCard.querySelector('#saveProfileEmail').onclick=async event=>{
        const email=input.value.trim(), phone=phoneInput.value.trim().replace(/[\s\-().]/g,''), button=event.currentTarget;
        if(email&&!input.validity.valid){status.style.display='block';feedback('error');setStatus(status,t('emailInvalid'),'error');return;}
        if(phone&&!validPhoneClient(phone)){status.style.display='block';feedback('error');setStatus(status,t('phoneInvalid'),'error');return;}
        button.disabled=true;status.style.display='block';
        try{
          const saved=await passkeyApi('/api/auth/profile/email',{profileId:selected.profileId,email,phone});
          selected.email=saved.email;selected.phone=saved.phone||phone;
          if(selected.profileId===currentProfileId()){
            state.profileEmail=selected.email;state.profilePhone=selected.phone;
            state.contactComplete=!!(selected.email&&selected.phone);
            if(state.contactComplete) writeContactLocal(selected.email, selected.phone);
          }
          feedback('save');setStatus(status,t('contactSaved'),'success');
          const test=profileCard.querySelector('#testProfileEmail');
          if(test) test.disabled=!saved.email||!(saved.emailConfigured??ready);
        }catch(error){feedback('error');setStatus(status,
          error.code==='invalid_email'?t('emailInvalid'):
          error.code==='invalid_phone'?t('phoneInvalid'):
          error.code==='profile_not_found'||/not found/i.test(String(error.message||''))?t('emailNotFound'):
          error.message||t('authUnavailable'),'error');}
        finally{button.disabled=false;}
      };
      profileCard.querySelector('#testProfileEmail').onclick=async event=>{
        const button=event.currentTarget;button.disabled=true;status.style.display='block';
        if(!input.value.trim()&&!selected.email){setStatus(status,t('emailSaveFirst'),'error');button.disabled=false;return;}
        try{await passkeyApi('/api/auth/profile/email/test',{profileId:selected.profileId});feedback('save');setStatus(status,t('testEmailSent'),'success');}
        catch(error){
          feedback('error');
          const map={email_not_configured:'emailNotReady',email_auth_failed:'testEmailAuthFailed',
            email_sender_unverified:'testEmailSenderFailed',email_recipient_restricted:'testEmailRecipientRestricted',
            email_rate_limited:'testEmailRateLimited',rate_limited:'testEmailRateLimited',email_network:'testEmailNetwork',
            email_missing:'emailSaveFirst'};
          setStatus(status,t(map[error.code]||'testEmailFailed'),'error');
        }
        finally{button.disabled=false;}
      };
    };
    paintProfile(data.profileId);
    count=Number(data.passkeys)||0;
    const supported=passkeyCapable()&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(()=>false);
    card.innerHTML=`<div class="row between"><div><b>${esc(t('profileSectionBio'))} · ${esc(biometricName())}</b><div class="muted" style="font-size:11px;margin-top:3px">${count?T[state.lang].passkeyCount(count):t('passkeyNone')}</div></div><span style="font-size:25px">${supported?'✓':'!'}</span></div>
      <p class="muted" style="font-size:11.5px;line-height:1.5">${t('passkeyHint')}</p>
      ${supported?`<button class="btn" id="securityAddPasskey">＋ ${t('passkeySetup')}</button>`:`<div class="status-box error">${t('passkeyUnavailable')}</div>`}
      ${count?`<button class="btn sec" id="securityRemovePasskeys">${t('removePasskeys')}</button>`:''}`;
    const add=card.querySelector('#securityAddPasskey');
    if(add)add.onclick=async()=>{
      add.disabled=true;
      try{await registerPasskey();toast(t('passkeyAdded'),'success');closeSheet();sheetSecurityAccess();}
      catch(error){toast(error.name==='NotAllowedError'?t('passkeyCancelled'):error.message||t('authUnavailable'),'error',5200);add.disabled=false;}
    };
    const remove=card.querySelector('#securityRemovePasskeys');
    if(remove){let armed=false;remove.onclick=async()=>{
      if(!armed){armed=true;remove.textContent=`${t('removePasskeys')} · ✓`;remove.classList.add('out');return;}
      remove.disabled=true;
      try{await passkeyApi('/api/auth/passkey/remove',{});toast(t('passkeyRemoved'),'success');closeSheet();sheetSecurityAccess();}
      catch(error){toast(error.message||t('authUnavailable'),'error');remove.disabled=false;}
    };}
  }catch(error){
    profileCard.innerHTML=`<div class="status-box error">${esc(error.message||t('authUnavailable'))}</div>`;
    card.innerHTML=`<div class="status-box error">${esc(error.message||t('authUnavailable'))}</div>`;
  }
  sheetEl.querySelector('#securityTutorial').onclick=openAppTutorial;
  sheetEl.querySelector('#securitySwitch').onclick=()=>{closeSheet();logoutServerSession();};
  sheetEl.querySelector('#securityLogout').onclick=()=>{closeSheet();logoutServerSession();};
}

function gateMeta(){
  const build = (typeof APP_BUILD==='object' && APP_BUILD) ? APP_BUILD : {label:'v?', changed:{de:'',el:''}};
  const note = (build.changed && (build.changed[state.lang] || build.changed.de)) || '';
  return `<div class="gate-build" id="gateMeta" role="status">
    <b>${esc(build.label || ('v'+build.version))}</b>
    <span>${esc(note)}</span>
  </div>`;
}
function paintWebauthnOriginWarn(health, host){
  if(!host || !health) return;
  const expected = String(health.passkeyOrigin || '').replace(/\/$/, '');
  const actual = String(location.origin || '').replace(/\/$/, '');
  if(!expected || !actual || expected === actual){
    host.querySelector('#webauthnOriginWarn')?.remove();
    return;
  }
  let el = host.querySelector('#webauthnOriginWarn');
  if(!el){
    el = document.createElement('div');
    el.id = 'webauthnOriginWarn';
    el.className = 'status-box error';
    el.style.margin = '8px 0';
    el.setAttribute('role', 'status');
    host.insertBefore(el, host.firstChild);
  }
  el.textContent = t('webauthnOriginWarn');
}
function refreshGateMeta(){
  const el = document.getElementById('gateMeta');
  if(el) el.outerHTML = gateMeta();
}
function langSwitch(){
  return `<div class="gate-lang">
    <button class="${state.lang==='de'?'on':''}" data-l="de">Deutsch</button>
    <button class="${state.lang==='el'?'on':''}" data-l="el">Ελληνικά</button></div>`;
}
function wireLangSwitch(){
  gateBody.querySelectorAll('.gate-lang button').forEach(b=>{
    b.onclick = () => setLang(b.dataset.l);
  });
}

let pinKeyHandler=null;
function stopPinKeyboard(){
  if(pinKeyHandler){
    window.removeEventListener('keydown', pinKeyHandler);
    pinKeyHandler=null;
  }
}

function openGate(){ closeSheet(); stopPinKeyboard(); gateEl.classList.add('on'); renderEntrance(); }
function closeGate(){ stopPinKeyboard(); gateEl.classList.remove('on'); }

/** Βήμα 1 — δύο ξεχωριστές είσοδοι: Προσωπικό / Παιδιά (§31.3). */
function renderEntrance(){
  stopPinKeyboard();
  gateBody.innerHTML = `
    ${langSwitch()}
    <div class="gate-head">
      <div class="mark" aria-hidden="true">A</div>
      <div class="brand-kicker">${t('gateBrandLine')}</div>
      <h2>${t('gateTitle')}</h2>
      <p>${t('whoAreYou')}</p>
    </div>
    <div class="profiles" style="grid-template-columns:1fr">
      <button class="profile" data-mode="staff" style="text-align:left;display:flex;gap:14px;align-items:center;padding:18px 16px">
        <div class="pa" style="background:#bfdbfe;margin:0;flex:0 0 auto">👥</div>
        <div><div class="pn" style="font-size:16px">${t('entryStaff')}</div>
          <div class="pr">${t('entryStaffSub')}</div></div>
      </button>
      <button class="profile" data-mode="child" style="text-align:left;display:flex;gap:14px;align-items:center;padding:18px 16px">
        <div class="pa" style="background:#fde68a;margin:0;flex:0 0 auto">🎈</div>
        <div><div class="pn" style="font-size:16px">${t('entryChild')}</div>
          <div class="pr">${t('entryChildSub')}</div></div>
      </button>
    </div>
    ${gateMeta()}`;
  wireLangSwitch();
  gateBody.querySelectorAll('[data-mode]').forEach(b=>{
    b.onclick = () => renderProfiles(b.dataset.mode);
  });
}

/** Βήμα 2 — grid προφίλ, προσωπικού ή παιδιών. */
function renderProfiles(mode = 'staff'){
  stopPinKeyboard();
  const people = mode === 'child'
    ? DB.children.map(c=>({id:c.id, name:c.name, color:c.color, sub: childResidence(c)||(c.temporary?'·':'')}))
    : DB.employees.map(e=>({id:e.id, name:e.name, color:e.color, sub:L(e.role)}));
  gateBody.innerHTML = `
    ${langSwitch()}
    <div class="gate-head">
      <div class="mark">${mode==='child'?'🎈':'👥'}</div>
      <div class="brand-kicker">Armonia Thassos</div>
      <h2>${mode==='child' ? t('entryChild') : t('entryStaff')}</h2>
      <p>${t('gatePick')}</p>
    </div>
    ${mode==='child'?`<div class="child-app-card" style="margin:0 0 12px">
      <p>${esc(t('childInstallHint'))}</p>
      <p>${esc(t('childInstallIos'))}</p>
      <p>${esc(t('childInstallAndroid'))}</p>
    </div>`:''}
    <div class="profiles">
      ${people.map(p=>`
        <button class="profile" data-p="${p.id}">
          <div class="pa" style="background:${/^#[0-9a-fA-F]{3,8}$/.test(String(p.color||''))?esc(p.color):'#94a3b8'}">${initials(p.name)}</div>
          <div class="pn">${esc(p.name)}</div>
          <div class="pr">${esc(p.sub)}</div>
        </button>`).join('')}
    </div>
    <button class="gate-back" id="gHome" style="display:block;margin:6px auto 0">${t('gateBack')}</button>
    ${gateMeta()}`;
  wireLangSwitch();
  gateBody.querySelector('#gHome').onclick = renderEntrance;
  gateBody.querySelectorAll('.profile').forEach(b=>{
    b.onclick = () => renderGatePin(
      mode === 'child' ? kid(b.dataset.p) : emp(b.dataset.p), mode);
  });
}

/** Βήμα 3 — PIN μόνο για το επιλεγμένο προφίλ. */
function renderGatePin(who, mode = 'staff'){
  stopPinKeyboard();
  if(!who || !who.id){
    toast(t('authUnavailable'),'error');
    renderProfiles(mode);
    return;
  }
  let buf = '';
  let busy = false;
  let succeeded = false;
  const pinColor = /^#[0-9a-fA-F]{3,8}$/.test(String(who.color||''))?who.color:'#94a3b8';
  gateBody.innerHTML = `
    <div class="gate-pin">
      <div class="pa" style="background:${esc(pinColor)}">${initials(who.name)}</div>
      <h3>${esc(who.name)}</h3>
      <div class="sub">${mode==='child' ? '' : esc(L(who.role)) + ' · '}${t('gatePin')}</div>
      <button class="passkey-btn primary-bio" id="gPasskey" type="button" hidden>🔐 <span><b>${esc(biometricName())}</b><span class="pk-sub">${esc(biometricHint())}</span></span></button>
      <div class="pin-divider" id="gPinDivider" hidden>${t('pinFallback')}</div>
      <div class="pindots" id="gpd" aria-live="polite"></div>
      <input class="pin-field" id="gPinInput" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6"
        autocomplete="one-time-code" enterkeyhint="done" aria-label="PIN" value="">
      <div id="gpErr" style="min-height:18px;color:#f87171;font-size:12.5px" role="alert"></div>
      <div class="pinpad" id="gPinpad" role="group" aria-label="PIN">
        ${[1,2,3,4,5,6,7,8,9].map(n=>`<button type="button" data-k="${n}">${n}</button>`).join('')}
        <button type="button" data-k="del" aria-label="Backspace">⌫</button><button type="button" data-k="0">0</button><button type="button" data-k="clr" aria-label="Clear">C</button>
      </div>
      <div class="gate-sticky-actions">
        <button class="btn" id="gLogin" type="button">${t('loginEntry')}</button>
      </div>
      <div class="muted" style="margin-top:10px;font-size:11.5px">${state.lang==='el'?'Πληκτρολόγησε ή πάτα τα 6 ψηφία.':'PIN tippen oder die 6 Ziffern antippen.'}</div>
      <button class="gate-back" id="gForgot" type="button" style="display:block;margin:2px auto">${t('forgotPin')}</button>
      <button class="gate-back" id="gBack" type="button">${t('gateBack')}</button>
    </div>
    ${gateMeta()}`;
  const pinInput=gateBody.querySelector('#gPinInput');
  const draw = () => {
    gateBody.querySelector('#gpd').innerHTML =
      [0,1,2,3,4,5].map(i=>`<i class="${i<buf.length?'f':''} ${busy&&i<buf.length?'busy':''}"></i>`).join('');
    if(pinInput && pinInput.value !== buf) pinInput.value = buf;
  };
  draw();
  const showPasskey=()=>{
    const button=gateBody.querySelector('#gPasskey'),divider=gateBody.querySelector('#gPinDivider');
    if(!button||!divider) return;
    button.hidden=false;button.classList.add('on');divider.hidden=false;divider.style.display='flex';
  };
  if(passkeyCapable()){
    showPasskey();
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.().then(available=>{
      if(available) showPasskey();
    }).catch(()=>{});
  }
  fetch('/api/auth/health',{credentials:'same-origin'}).then(r=>r.json()).then(health=>{
    paintWebauthnOriginWarn(health, gateBody.querySelector('#gpErr')?.parentElement || gateBody.querySelector('.gate-pin'));
  }).catch(()=>{});
  gateBody.querySelector('#gBack').onclick = () => renderProfiles(mode);
  gateBody.querySelector('#gForgot').onclick = () => renderResetRequest(who,mode);

  const finishLogin=async()=>{
    if(busy || succeeded) return;
    const errorEl=gateBody.querySelector('#gpErr'),button=gateBody.querySelector('#gLogin');
    if(buf.length<4){errorEl.textContent=t('wrongPin');return;}
    busy=true;button.classList.add('logging');button.disabled=true;if(pinInput)pinInput.disabled=true;errorEl.textContent='';draw();
    try{
      await authenticateProfile(mode,who,buf);
      succeeded=true;
      stopPinKeyboard();
      closeGate();revealApp();render();startSharedSync();await ensureOnboarding({afterLogin:true});await ensureContactDetails();toast(T[state.lang].welcome(who.name),'success');notifyZoAiReady();maybePromptPasskeySetup();
    }catch(error){
      if(error.status===429){
        const minutes=Math.max(1,Math.ceil((Number(error.retryAfter)||900)/60));
        errorEl.textContent=T[state.lang].lockedFor(minutes);
      }else if(error.status===401 && Number.isInteger(error.attemptsRemaining)){
        errorEl.textContent=T[state.lang].attemptsRemaining(error.attemptsRemaining);
      }else errorEl.textContent=error.status===401?t('wrongPin'):t('authUnavailable');
      buf='';
    }finally{
      if(!succeeded){
        busy=false;button.classList.remove('logging');button.disabled=false;
        if(pinInput){pinInput.disabled=false;pinInput.focus({preventScroll:true});}
        draw();
      }
    }
  };

  const pushKey=k=>{
    if(busy || succeeded) return;
    if(k==='del') buf = buf.slice(0,-1);
    else if(k==='clr') buf = '';
    else if(/^\d$/.test(k) && buf.length<6) buf += k;
    draw();
    if(buf.length===6) finishLogin();
  };

  // Event delegation — survives re-draws and is more reliable on touch devices.
  gateBody.querySelector('#gPinpad').addEventListener('click', event=>{
    const button=event.target.closest('button[data-k]');
    if(!button || button.disabled) return;
    event.preventDefault();
    pushKey(button.dataset.k);
  });
  gateBody.querySelector('#gLogin').onclick=finishLogin;

  pinInput.addEventListener('input', ()=>{
    if(busy || succeeded) return;
    buf = String(pinInput.value||'').replace(/\D/g,'').slice(0,6);
    draw();
    if(buf.length===6) finishLogin();
  });
  pinInput.addEventListener('keydown', event=>{
    if(event.key==='Enter' && buf.length>=4){event.preventDefault();finishLogin();}
  });

  pinKeyHandler=event=>{
    if(!gateEl.classList.contains('on')||busy) return;
    if(document.activeElement===pinInput) return; // input handler owns typing
    if(event.key>='0'&&event.key<='9'){event.preventDefault();pushKey(event.key);}
    else if(event.key==='Backspace'){event.preventDefault();pushKey('del');}
    else if(event.key==='Escape'){event.preventDefault();buf='';draw();}
    else if(event.key==='Enter'&&buf.length>=4){event.preventDefault();finishLogin();}
  };
  window.addEventListener('keydown', pinKeyHandler);

  // Open the soft keyboard immediately on phones/tablets.
  requestAnimationFrame(()=>{
    try{pinInput.focus({preventScroll:false});}catch(error){pinInput.focus();}
  });

  gateBody.querySelector('#gPasskey').onclick=async()=>{
    const errorEl=gateBody.querySelector('#gpErr'),button=gateBody.querySelector('#gPasskey');
    if(busy) return;
    busy=true;button.disabled=true;errorEl.textContent='';
    try{
      await loginWithPasskey(mode,who);
      stopPinKeyboard();
      closeGate();revealApp();render();startSharedSync();await ensureOnboarding({afterLogin:true});await ensureContactDetails();toast(T[state.lang].welcome(who.name),'success');notifyZoAiReady();maybePromptPasskeySetup();
    }catch(error){
      errorEl.textContent=error.code==='no_passkey'?t('passkeySetupNeeded'):
        error.code==='passkey_unavailable'||error.code==='configuration'?t('passkeyConfig'):
        error.code==='unsupported'?t('passkeyUnavailable'):
        error.name==='NotAllowedError'?t('passkeyCancelled'):
        /not found/i.test(String(error.message||''))?t('passkeySetupNeeded'):
        t('authUnavailable');
    }finally{busy=false;button.disabled=false;}
  };
}

function renderResetRequest(who,mode){
  stopPinKeyboard();
  const pinColor = /^#[0-9a-fA-F]{3,8}$/.test(String(who.color||''))?who.color:'#94a3b8';
  gateBody.innerHTML=`
    <div class="gate-pin gate-reset">
      <div class="gate-mail-hero" aria-hidden="true">
        <div class="gate-mail-mark">A</div>
        <div class="gate-mail-eyebrow">Armonia Thassos</div>
        <h3>${t('resetPinTitle')}</h3>
        <p>${t('resetNeedProfileEmail')}</p>
      </div>
      <div class="pa" style="background:${esc(pinColor)};margin:14px auto 0">${initials(who.name)}</div>
      <div class="sub" style="margin-top:8px">${esc(who.name)}</div>
      <label class="f" style="text-align:left;margin-top:14px"><span>${t('emailLabel')}</span>
        <input type="email" id="resetEmail" autocomplete="email" inputmode="email" placeholder="name@example.com"></label>
      <div id="resetStatus" class="status-box" style="min-height:36px;font-size:12.5px;display:none" role="status" aria-live="polite"></div>
      <button class="btn" id="resetSend">${t('sendResetLink')}</button>
      <button class="gate-back" id="resetBack" type="button">${t('resetBackPin')}</button>
    </div>`;
  const status=gateBody.querySelector('#resetStatus');
  const button=gateBody.querySelector('#resetSend');
  gateBody.querySelector('#resetBack').onclick=()=>renderGatePin(who,mode);
  fetch('/api/auth/health',{credentials:'same-origin'}).then(r=>r.json()).then(health=>{
    if(health?.pinResetReady===false || health?.emailConfigured===false){
      status.style.display='block';
      setStatus(status,t('resetUnavailable'),'error');
      button.disabled=true;
    }
  }).catch(()=>{});
  button.onclick=async()=>{
    const email=gateBody.querySelector('#resetEmail').value.trim();
    if(!email || !gateBody.querySelector('#resetEmail').validity.valid){
      status.style.display='block'; setStatus(status,t('emailLabel'),'error'); return;
    }
    button.disabled=true;
    status.style.display='block';
    setStatus(status, state.lang==='el'?'Αποστολή…':'Senden…','');
    try{
      const response=await fetch('/api/auth/request-reset',{method:'POST',headers:{'Content-Type':'application/json'},
        credentials:'same-origin', body:JSON.stringify({profileId:who.id,email})});
      if(!response.ok) throw new Error(String(response.status));
      setStatus(status,t('resetLinkSent'),'success');
    }catch(error){setStatus(status,t('authUnavailable'),'error');}
    finally{ if(!button.dataset.locked) button.disabled=false; }
  };
}

function renderResetForm(token){
  if(window.PaidiaGate?.renderResetForm){
    openGate();
    window.PaidiaGate.renderResetForm(token);
    return;
  }
  gateEl.classList.add('on');
  gateBody.innerHTML=`
    <div class="gate-pin gate-reset">
      <div class="pa" style="background:#9bc4b0">🔐</div>
      <h3>${t('resetPinTitle')}</h3>
      <label class="f" style="text-align:left;margin-top:18px"><span>${t('newPin')}</span>
        <input type="password" id="newPin" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="new-password"></label>
      <label class="f" style="text-align:left"><span>${t('confirmPin')}</span>
        <input type="password" id="confirmPin" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="new-password"></label>
      <div id="changeStatus" style="min-height:36px;font-size:12.5px"></div>
      <button class="btn" id="changePin">${t('changePin')}</button>
    </div>`;
  gateBody.querySelector('#changePin').onclick=async()=>{
    const pin=gateBody.querySelector('#newPin').value,confirmPin=gateBody.querySelector('#confirmPin').value;
    const status=gateBody.querySelector('#changeStatus'),button=gateBody.querySelector('#changePin');
    if(!/^\d{4,6}$/.test(pin)||pin!==confirmPin){setStatus(status,t('invalidReset'),'error');return;}
    button.disabled=true;
    try{
      const response=await fetch('/api/auth/reset',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({token,pin,confirmPin})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.code||String(response.status));
      history.replaceState({},'',location.pathname);
      state.user=null;state.child=null;state.mode='staff';session.sessionId=null;
      document.body.classList.add('auth-pending');
      document.getElementById('app').hidden=true;
      renderEntrance();toast(t('pinChanged'),'success',5200);
    }catch(error){setStatus(status,(error.message==='storage'||error.message==='507')?t('errStorage'):t('invalidReset'),'error');}
    finally{button.disabled=false;}
  };
}

document.documentElement.lang = state.lang;
window.addEventListener('keydown', event=>{
  if(event.key==='Escape' && document.body.classList.contains('gal-lightbox-open')){
    event.preventDefault();
    document.body.classList.remove('gal-lightbox-open');
    const box=document.getElementById('galLightbox');
    if(box){ box.hidden=true; box.classList.remove('open'); }
    const img=document.getElementById('galLightImg');
    if(img){ img.removeAttribute('src'); img.removeAttribute('crossorigin'); }
    return;
  }
  if(event.key==='Escape' && document.body.classList.contains('adaptive-open')){
    event.preventDefault();
    document.querySelectorAll('.adaptive-chrome.is-open').forEach(box=>box.classList.remove('is-open'));
    document.body.classList.remove('adaptive-open');
    return;
  }
  if(event.key==='Escape' && document.body.classList.contains('matrix-fullscreen')){
    event.preventDefault();
    exitMatrixFullscreen();
  }
  if(event.key==='Escape' && state.chatOpen){
    event.preventDefault();
    closeChatPanel();
  }
});
window.addEventListener('hashchange', ()=>{
  if(document.body.classList.contains('auth-pending')) return;
  if(applyRouteFromHash()) render();
});
window.addEventListener('resize', ()=>{ syncLayoutMode(); });
window.visualViewport?.addEventListener('resize', scheduleMeasureChrome);
window.visualViewport?.addEventListener('scroll', scheduleMeasureChrome);
window.addEventListener('unhandledrejection', event=>{
  console.error('unhandled async error',event.reason);
  toast(t('unexpectedError'),'error');
  event.preventDefault();
});
window.addEventListener('error', event=>{
  console.error('unexpected UI error',event.error||event.message);
  toast(t('unexpectedError'),'error');
});
localStorage.removeItem('paidia.authSession');
syncLayoutMode();
const resetToken=new URLSearchParams(location.search).get('reset');
if(resetToken){
  openGate();
  renderResetForm(resetToken);
}else if(window.__paidiaAuthed){
  // Instant gate.js already authenticated — hydrate the app without redrawing login.
  restoreServerSession();
}else{
  // Do not paint entrance until session restore fails — avoids login flash.
  restoreServerSession();
}
resolveIp().then(refreshGateMeta);
registerPaidiaServiceWorker();
scheduleNotificationSweep();

function publishTeamNotice({audience='all', subject='', title='', message=''}={}){
  DB.profilePrefs = DB.profilePrefs || {};
  const id = `tn-${Date.now().toString(36)}`;
  DB.profilePrefs._teamNotice = {
    id,
    audience: audience==='children'?'children':(audience==='staff'?'staff':'all'),
    subject: String(subject||'').slice(0,160),
    title: String(title||subject||'').slice(0,120),
    message: String(message||'').slice(0,400),
    at: Date.now(),
    by: state.user?.id || 'admin',
  };
  save();
  try{
    showAppNotification(DB.profilePrefs._teamNotice.title || subject, {
      tag: 'paidia-team-notice',
      body: String(message||'').slice(0,120),
      data: {url: './?tab=home'},
    });
  }catch{}
}
function activeTeamNotice(){
  if(!notifAutomations().broadcastBanner) return null;
  const n = DB.profilePrefs && DB.profilePrefs._teamNotice;
  if(!n || typeof n !== 'object' || !n.id) return null;
  if(n.at && (Date.now() - Number(n.at)) > 7*24*60*60*1000) return null;
  const audience = n.audience || 'all';
  if(state.mode==='child'){
    if(audience!=='all' && audience!=='children') return null;
  }else if(state.mode==='staff'){
    if(audience==='children') return null;
  }else return null;
  const seen = notifPrefs().seen || {};
  if(seen['banner-'+n.id]==='1') return null;
  return n;
}
function teamNoticeBannerHtml(){
  const n = activeTeamNotice();
  if(!n) return '';
  const headline = n.title || n.subject || t('adminNotifyPanel');
  const body = n.message || '';
  return `<button class="notification-card" id="teamNoticeBanner" type="button">
    <span style="font-size:24px">✉️</span>
    <span class="grow"><span class="strong">${esc(headline)}</span><br>
      <span class="muted">${esc(String(body).slice(0,140))}</span></span>
    <span class="muted" style="font-size:11px">${esc(t('adminBroadcastBannerDismiss'))}</span>
  </button>`;
}
function dismissTeamNotice(){
  const n = activeTeamNotice();
  if(!n) return;
  setNotifPrefs({seen:{...notifPrefs().seen, ['banner-'+n.id]:'1'}});
}

function notifAutomations(){
  const base={shiftStart:true,lowStock:true,presenceLate:true,broadcastBanner:true,fridayShop:true};
  try{
    const raw=JSON.parse(localStorage.getItem('paidia.notifAuto')||'{}')||{};
    return {...base,...raw};
  }catch{ return base; }
}
function setNotifAutomations(patch){
  const next={...notifAutomations(),...patch,updatedAt:Date.now()};
  try{ localStorage.setItem('paidia.notifAuto', JSON.stringify(next)); }catch{}
  return next;
}
function sheetAdminAutomations(){
  if(!isAdminUser()){toast(t('adminRequired'),'error');return;}
  const auto=notifAutomations();
  openSheet(`<div class="admin-detail-hero"><div class="pa avatar" style="background:linear-gradient(145deg,#2a6b52,#2f5a63)">⚙️</div>
    <div class="grow"><div class="muted">ARMONIA</div><h3 style="margin:1px 0">${esc(t('adminAutomations'))}</h3>
      <div class="muted">${esc(t('adminAutomationsHint'))}</div></div></div>
    <label class="f" style="flex-direction:row;align-items:center;gap:10px"><input type="checkbox" id="autoShiftStart" ${auto.shiftStart?'checked':''}><span>${esc(t('autoShiftStart'))}</span></label>
    <label class="f" style="flex-direction:row;align-items:center;gap:10px"><input type="checkbox" id="autoLowStock" ${auto.lowStock?'checked':''}><span>${esc(t('autoLowStock'))}</span></label>
    <label class="f" style="flex-direction:row;align-items:center;gap:10px"><input type="checkbox" id="autoPresenceLate" ${auto.presenceLate?'checked':''}><span>${esc(t('autoPresenceLate'))}</span></label>
    <label class="f" style="flex-direction:row;align-items:center;gap:10px"><input type="checkbox" id="autoBroadcastBanner" ${auto.broadcastBanner?'checked':''}><span>${esc(t('autoBroadcastBanner'))}</span></label>
    <label class="f" style="flex-direction:row;align-items:center;gap:10px"><input type="checkbox" id="autoFridayShop" ${auto.fridayShop?'checked':''}><span>${esc(t('autoFridayShop'))}</span></label>
    <button class="btn" type="button" id="autoSave">${esc(state.lang==='el'?'Αποθήκευση':'Speichern')}</button>
    <button class="btn sec" type="button" id="autoClose" style="margin-top:8px">${esc(t('close'))}</button>`);
  sheetEl.querySelector('#autoClose').onclick=()=>closeSheet();
  sheetEl.querySelector('#autoSave').onclick=()=>{
    setNotifAutomations({
      shiftStart:!!sheetEl.querySelector('#autoShiftStart')?.checked,
      lowStock:!!sheetEl.querySelector('#autoLowStock')?.checked,
      presenceLate:!!sheetEl.querySelector('#autoPresenceLate')?.checked,
      broadcastBanner:!!sheetEl.querySelector('#autoBroadcastBanner')?.checked,
      fridayShop:!!sheetEl.querySelector('#autoFridayShop')?.checked,
    });
    toast(t('autoSaved'),'success');
    closeSheet();
  };
}

function notifPrefs(){
  try{ return JSON.parse(localStorage.getItem('paidia.notif')||'{}')||{}; }catch{ return {}; }
}
function notifPrefsResolved(){
  const raw=notifPrefs();
  const lead=Number(raw.leadMinutes);
  return {
    ...raw,
    quietStart:raw.quietStart||'22:00',
    quietEnd:raw.quietEnd||'07:00',
    leadMinutes:Number.isFinite(lead)&&lead>=0?lead:30,
  };
}
function minsOfDay(d){ return d.getHours()*60+d.getMinutes(); }
function parseHm(hm){
  const [h,m]=String(hm||'00:00').split(':').map(Number);
  return (h||0)*60+(m||0);
}
function isQuietHours(now=new Date()){
  const {quietStart,quietEnd}=notifPrefsResolved();
  const nowM=minsOfDay(now), startM=parseHm(quietStart), endM=parseHm(quietEnd);
  if(startM===endM) return false;
  if(startM<endM) return nowM>=startM && nowM<endM;
  return nowM>=startM || nowM<endM;
}
function entryStartDate(dateStr,e){
  const b=blockDef(e?.block);
  return localDateTime(dateStr, e?.from||b?.from||'09:00');
}
function eventStartDate(ev){
  return localDateTime(ev.date, ev.from||'09:00');
}
function isWithinLeadWindow(start,leadMin,now=new Date(),graceMs=5*60*1000){
  const diff=start.getTime()-now.getTime();
  const leadMs=leadMin*60*1000;
  return diff<=leadMs && diff>=-graceMs;
}
function dueItemCount(){
  if(state.mode==='child'&&state.child){
    const today=iso(new Date());
    return childEventsFor(state.child.id).filter(e=>e.status==='published'&&e.date>=today).length;
  }
  if(state.mode!=='staff'||!state.user) return 0;
  const today=iso(new Date()), user=state.user;
  let overdue=0;
  dashboardDates(-7,-1).forEach(dateStr=>dashboardAssignments(dateStr,user.id).forEach(e=>{
    if(!completionFor(dateStr,e.id,user.id)) overdue++;
  }));
  const todayOpen=dashboardAssignments(today,user.id).filter(e=>!completionFor(today,e.id,user.id)).length;
  return todayOpen+overdue;
}
function updateAppBadge(count){
  try{
    if(!navigator.setAppBadge) return;
    const n=Math.max(0,Number(count)||0);
    if(n>0) navigator.setAppBadge(n).catch(()=>{});
    else if(navigator.clearAppBadge) navigator.clearAppBadge().catch(()=>{});
  }catch{}
}
function openFridayShopCount(){
  const friday=fridayFor();
  return (DB.houses||[]).reduce((n,h)=>n+fridayEntries(h.id,friday).filter(e=>e.status==='open').length,0);
}
function isFridayShopReminderTime(now=new Date()){
  return now.getDay()===5 && minsOfDay(now)>=9*60;
}
function setNotifPrefs(patch){
  const next={...notifPrefs(), ...patch, updatedAt:Date.now()};
  try{ localStorage.setItem('paidia.notif', JSON.stringify(next)); }catch{}
  return next;
}
async function enableAppNotifications(){
  if(!('Notification' in window)) return false;
  let perm=Notification.permission;
  if(perm!=='granted'){
    try{ perm=await Notification.requestPermission(); }catch{ return false; }
  }
  const ok=perm==='granted';
  setNotifPrefs({enabled:ok});
  if(ok){
    await registerPaidiaServiceWorker();
    showAppNotification(t('notifTest'),{tag:'paidia-welcome', body:t('notifHint'), force:true});
    runNotificationSweep({force:true});
  }
  return ok;
}
function showAppNotification(title, opts={}){
  if(!notifPrefs().enabled || typeof Notification==='undefined' || Notification.permission!=='granted') return;
  if(!opts.force && isQuietHours()) return;
  const payload={
    body:opts.body||'',
    icon:opts.icon||'icons/icon-192.png',
    badge:opts.badge||'icons/icon-192.png',
    tag:opts.tag||'paidia',
    renotify:!!opts.renotify,
    requireInteraction:!!opts.requireInteraction,
    data:opts.data||{url:'./'},
  };
  if(Array.isArray(opts.actions) && opts.actions.length){
    payload.actions = opts.actions.slice(0, 2);
  }
  try{
    if(navigator.serviceWorker?.controller){
      navigator.serviceWorker.ready.then(reg=>reg.showNotification(title, payload)).catch(()=>{
        new Notification(title, payload);
      });
    }else{
      new Notification(title, payload);
    }
  }catch{}
}
async function registerPaidiaServiceWorker(){
  if(!('serviceWorker' in navigator) || !window.isSecureContext) return null;
  try{
      // gate.js already registers the worker; a second registration raced it
      // and re-fired updatefound. Reuse whatever is registered.
      const reg=await navigator.serviceWorker.getRegistration()
        || await navigator.serviceWorker.register('./sw.js?v='+((typeof APP_BUILD==='object'&&APP_BUILD&&APP_BUILD.version)||107),{scope:'./'});
    if(reg.waiting) reg.waiting.postMessage({type:'SKIP_WAITING'});
    return reg;
  }catch(err){
    console.warn('SW register failed', err);
    return null;
  }
}
function runNotificationSweep({force=false}={}){
  updateAppBadge(dueItemCount());
  if(!notifPrefs().enabled || typeof Notification==='undefined' || Notification.permission!=='granted') return;
  const prefs=notifPrefsResolved();
  const seen=notifPrefs().seen||{};
  const now=new Date();

  // Child portal: upcoming events only (never staff ops)
  if(state.mode==='child' && state.child){
    try{
      const today=iso(now);
      childEventsFor(state.child.id).filter(e=>e.status==='published' && e.date>=today).forEach(ev=>{
        const start=eventStartDate(ev);
        if(!isWithinLeadWindow(start,prefs.leadMinutes,now)) return;
        const key=`child-event-${state.child.id}-${ev.id}-${ev.date}`;
        if(force || seen[key]!=='1'){
          showAppNotification(T[state.lang].childNotifEvent(L(ev)||ev.title||'Event'),{
            tag:'paidia-child-event-'+ev.id,
            body: `${ev.date}${ev.from?` · ${ev.from}`:''}`,
            data:{url:'./?tab=home'},
          });
          setNotifPrefs({seen:{...notifPrefs().seen, [key]:'1'}});
        }
      });
    }catch{}
    return;
  }

  if(state.mode!=='staff' || !state.user) return;
  // Upcoming events (lead window)
  try{
    const today=iso(now);
    DB.events.filter(e=>e.status==='published' && e.date>=today).forEach(ev=>{
      const start=eventStartDate(ev);
      if(!isWithinLeadWindow(start,prefs.leadMinutes,now)) return;
      const key=`event-lead-${ev.id}-${ev.date}`;
      if(force || seen[key]!=='1'){
        showAppNotification(T[state.lang].notifUpcomingEvent(L(ev)||ev.title||'Event'),{
          tag:'paidia-event-'+ev.id,
          body:`${ev.date}${ev.from?` · ${ev.from}`:''}`,
          data:{url:'./?tab=schedule&open=events'},
        });
        setNotifPrefs({seen:{...notifPrefs().seen, [key]:'1'}});
      }
    });
  }catch{}
  // Today's tasks (lead window)
  try{
    const today=iso(now);
    dashboardAssignments(today,state.user.id).forEach(e=>{
      if(completionFor(today,e.id,state.user.id)) return;
      const start=entryStartDate(today,e);
      if(!isWithinLeadWindow(start,prefs.leadMinutes,now)) return;
      const key=`task-lead-${e.id}-${today}`;
      if(force || seen[key]!=='1'){
        const actLabel=L(act(e.activityId)||{de:e.activityId||'Aufgabe',el:e.activityId||'Εργασία'});
        showAppNotification(T[state.lang].notifUpcomingTask(actLabel),{
          tag:'paidia-task-'+e.id,
          body:entryTime(e)||today,
          data:{url:'./?tab=schedule'},
        });
        setNotifPrefs({seen:{...notifPrefs().seen, [key]:'1'}});
      }
    });
  }catch{}
  // Low stock attention
  try{
    const houses=DB.houses||[];
    let attention=0;
    (typeof PRODUCTS==='function'?PRODUCTS():[]).forEach(p=>{
      const bad=houses.some(h=>{
        const q=DB.stock?.[stockKey(h.id,p.id)]??0;
        return q===0 || q<=(typeof lowThreshold==='function'?lowThreshold(p):2);
      });
      if(bad) attention++;
    });
    const key=`low-${attention}`;
    if(attention>0 && notifAutomations().lowStock && (force || seen.low!==key)){
      showAppNotification(T[state.lang].notifLowStock(attention),{tag:'paidia-low', body:t('headerStock'), data:{url:'./?tab=stock'}});
      setNotifPrefs({seen:{...seen, low:key}});
    }
  }catch{}
  // Shift stock check pending
  try{
    if(notifAutomations().shiftStart && typeof shiftStockCheckPending==='function' && shiftStockCheckPending()){
      if(force || !seen.shiftCheck){
        showAppNotification(t('notifShiftCheck'),{tag:'paidia-shift-check', body:'Kalyvia', data:{url:'./?tab=stock'}});
        setNotifPrefs({seen:{...notifPrefs().seen, shiftCheck:true}});
      }
    }
  }catch{}
  // Shift presence / late check-in
  try{
    const active=typeof activeShiftPresence==='function'?activeShiftPresence(state.user.id):null;
    const auto=notifAutomations();
    const allowPresence = active && !active.checkin && (auto.shiftStart || (active.late && auto.presenceLate));
    if(allowPresence){
      const key=`presence-${active.dateStr}-${active.shift.id}-${active.late?'late':'soon'}`;
      if(force || seen.presence!==key){
        const label=shiftLabel(active.shift);
        showAppNotification(
          active.late?T[state.lang].notifShiftLate(label):T[state.lang].notifShiftStart(label),
          {
            tag:'paidia-presence',
            renotify:!!active.late,
            requireInteraction:true,
            body:active.late?t('presenceNotifBodyLate'):t('presenceNotifBodyReady'),
            data:{url:'./?tab=home&presence=1', open:'presence'},
            actions: active.late
              ? [
                  {action:'late', title:t('presenceNotifActionLate')},
                  {action:'there', title:t('presenceNotifActionThere')},
                ]
              : [
                  {action:'there', title:t('presenceNotifActionThere')},
                ],
          }
        );
        setNotifPrefs({seen:{...notifPrefs().seen, presence:key}});
      }
    }
  }catch{}
  // Friday shopping reminder (open list items)
  try{
    const auto=notifAutomations();
    const friday=fridayFor();
    if(auto.fridayShop && isFridayShopReminderTime(now)){
      const openCount=openFridayShopCount();
      const key=`friday-shop-${friday}`;
      if(openCount>0 && (force || seen[key]!=='1')){
        showAppNotification(T[state.lang].notifFridayShop(openCount),{
          tag:'paidia-friday-shop',
          body:fridayText(friday),
          data:{url:'./?tab=shop'},
        });
        setNotifPrefs({seen:{...notifPrefs().seen, [key]:'1'}});
      }
    }
  }catch{}
}
function scheduleNotificationSweep(){
  setTimeout(()=>runNotificationSweep(), 2500);
  setInterval(()=>runNotificationSweep(), 15*60*1000);
  setInterval(()=>{
    if((state.mode==='staff' && state.user) || (state.mode==='child' && state.child)) runNotificationSweep();
  }, 60*1000);
}
if('serviceWorker' in navigator){
  navigator.serviceWorker.addEventListener('message', event=>{
    if(event.data?.type==='presence-open'){
      openPresenceFromSignal();
    }
  });
}
function shiftStockCheckPending(){
  try{
    return !stockCheckForDate(SHIFT_STOCK_HOUSE, iso(new Date()));
  }catch{
    return false;
  }
}
