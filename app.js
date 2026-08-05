
/* ════════════════════════════════════════════════════════════════
   Δίγλωσσο λεξικό — DE (όπως το χαρτί) / EL
   ════════════════════════════════════════════════════════════════ */
const T = {
  de: {
    appTitle:'Armonia Thassos', navHome:'Home', navSchedule:'Plan', navStock:'Lager', navShop:'Liste', navBook:'Protokoll',
    titleHome:'Home', titleSchedule:'Wochenplan', titleStock:'Kühlschrank / Lager', titleShop:'Listen & Einkauf', titleBook:'Protokoll',
    logout:'Profil', noUser:'Nicht angemeldet',
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
    tapProduct:'Produkt öffnen', productDetail:'Produktdetails', addToShopping:'Zur Einkaufsliste hinzufügen',
    addedToShopping:'Zur Einkaufsliste hinzugefügt', alreadyPlanned:'Bereits auf der Einkaufsliste',
    listItemRemoved:'Position aus der Liste entfernt.',
    stockSearch:'Produkt suchen…', stockAttention:'Achtung', stockAll:'Alle', stockEmpty:'Leer',
    stockHealthy:'Gut versorgt', stockLow:'Wenig', stockOutState:'Leer', productTypes:'Produkte',
    noStockResults:'Keine passenden Produkte gefunden.', openShopping:'Zur Einkaufsliste', missingFromShop:n=>`${n} Fehlmenge${n===1?'':'n'} aus dem Einkauf`,
    inTitle:'Eingang Kühlschrank', outTitle:'Ausgang Kühlschrank',
    product:'Produkt', qty:'Menge',
    photoLabel:'Foto — optional, nur Live-Aufnahme',
    takePhoto:'📷 Foto aufnehmen', photoTaken:'Foto wurde jetzt in der App aufgenommen.',
    noCam:'Kamera nicht verfügbar', needPhoto:'Foto optional — Buchung geht auch ohne',
    photoOptional:'Foto optional',
    skipPhoto:'Ohne Foto buchen',
    stockHoldHint:'Gedrückt halten für Optionen · Ziehen zu Ein/Aus unten',
    stockHoldIn:'＋ Eingang',
    stockHoldOut:'− Ausgang',
    stockHoldShop:'Zur Einkaufsliste',
    stockHoldDetail:'Details / Menge',
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
    passkeyHint:'Dein Gerät entscheidet: Face ID, Touch ID, Fingerabdruck oder Windows Hello. Biometriedaten verlassen das Gerät nie.',
    passkeyAdded:'Passkey wurde sicher hinzugefügt.', passkeyRemoved:'Passkeys wurden entfernt.', removePasskeys:'Passkeys entfernen',
    passkeyNone:'Auf diesem Profil ist noch kein Passkey eingerichtet. Melde dich mit PIN an und tippe unter Profil auf „Face ID / Touch ID einrichten“.',
    passkeySetupNeeded:'Zuerst mit PIN anmelden, dann unter Profil den Passkey einrichten.',
    passkeyConfig:'Passkey-Server ist nicht konfiguriert (Origin/RP ID). Prüfe PAIDIA_WEBAUTHN_ORIGIN auf Vercel.',
    emailNotFound:'E-Mail-Profil wurde nicht gefunden. Speichere zuerst Kontaktdaten oder prüfe, ob du angemeldet bist.',
    profileCustomize:'Profil anpassen', profileNickname:'Anzeigename', profileColor:'Farbe', profileEmoji:'Emoji',
    profileSaved:'Profil gespeichert', passkeyCount:n=>`${n} Passkey${n===1?'':'s'} eingerichtet`,
    passkeyUnavailable:'Passkeys brauchen ein unterstütztes Gerät und HTTPS.', passkeyCancelled:'Anmeldung wurde abgebrochen.',
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
    emailReadyHint:'PIN-Links, Tests und Event-Mails können zugestellt werden.',
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
    gateTrace:'Jede Buchung wird mit Name, Zeit, Gerät und IP erfasst.',
    device:'Gerät', welcome:n=>'Willkommen, '+n,
    tutorialRequired:'Login-Tutorial · erforderlich', tutorialStep:(n,total)=>`Schritt ${n} von ${total}`,
    tutorialNext:'Weiter', tutorialBack:'Zurück', tutorialFinish:'Einführung abschließen',
    tutorialSaving:'Fortschritt wird sicher gespeichert…', tutorialDone:'Einführung abgeschlossen. Willkommen!',
    tutorialSaveError:'Die Einführung konnte nicht gespeichert werden. Prüfe die Verbindung und versuche es erneut.',
    tutorialTip:'Du musst alle Schritte ansehen. Diese Einführung kann nicht übersprungen oder geschlossen werden.',
    tutorialOpen:'App-Tutorial öffnen', tutorialReplay:'Funktions-Tutorial', tutorialClose:'Tutorial beenden',
    tutorialReplayTip:'Du kannst dieses Tutorial jederzeit über Hilfe (?) oder Profil erneut öffnen.',
    helpCenter:'Hilfe & Tutorial', helpCenterHint:'Tutorial, Team-Gespräch und AI-Hilfe. Die AI kann mit Bestätigung Lager und Liste ändern.',
    startTutorial:'Geführtes App-Tutorial', startTutorialHint:'Alle Funktionen passend zu deinem Profil – jederzeit wiederholbar über ?.',
    askAiHelp:'AI-Hilfe fragen', askAiHelpHint:'Fragen stellen, per Sprache diktieren, oder Lager/Liste mit Bestätigung ändern.',
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
    stockBoard:'Kühlschrank & Lager', dropHere:'Antippen oder in ein Feld ziehen',
    itemsPicked:'ausgewählt', pickSomething:'Tippe Produkte an oder zieh sie in das Feld oben',
    bookN:n=>`${n} ${n===1?'Position':'Positionen'} buchen`,
    stockDraftSave:'Änderungen speichern',
    stockDraftClear:'Verwerfen',
    stockDraftNeedReason:'Für Ausgang einen Grund wählen.',
    stockDraftSummary:(n,ins,outs)=>`${n} · +${ins} / −${outs}`,
    stockDraftPending:'Ausstehend',
    reason:'Grund', newReason:'Neuer Grund', reasonNamePh:'z. B. Spende, Reparatur oder Teamküche',
    saveReason:'Grund hinzufügen', reasonRequired:'Schreibe zuerst einen Namen für den Grund.',
    reasonExists:'Dieser Grund existiert bereits und wurde ausgewählt.', reasonAdded:n=>`„${n}“ wurde gespeichert und ausgewählt.`, reasonRemoved:'Eigener Grund entfernt.',
    storeMode:'Im Supermarkt', other:'Sonstiges',
    storeFocus:'Einkaufsmodus', storeFocusHint:'Entscheide jede Position eindeutig. Nichts wird automatisch als fehlend markiert.',
    storeSearch:'Suchen…', storeRemaining:'Noch offen', storeComplete:'Fertig',
    markBought:'Gekauft', markMissing:'Fehlt', undoDecision:'Zurücksetzen',
    decideAll:'Entscheide zuerst alle Positionen.', shoppingProgress:'Einkaufsfortschritt',
    storeShowDone:'Erledigte zeigen', storeHideDone:'Erledigte ausblenden',
    storeLeft:n=>`${n} offen`, storeTapHint:'Tippe ✓ oder × — Liste bleibt kompakt',
    listPlanned:'Liste geplant', listShopping:'Im Einkauf', listFinished:'Abgeschlossen',
    tapToTick:'Tippen: gekauft → nicht da → offen',
    gotIt:'✓ gekauft', notThere:'✕ nicht da',
    confirmBatch:'Charge bestätigen', batchHint:'Alle Positionen werden gemeinsam gebucht.',
    carryOver:'↩︎ Zurück auf die Liste', nothingPending:'Keine offene Charge',
    whereIsWhat:'Was ist wo', inFridge:'Im Kühlschrank', lastPurchase:'Letzter Einkauf',
    bothHouses:'Alle Häuser', shortage:'Fehlmenge',
    boughtNotOnList:'gekauft, war nicht auf der Liste',
    batchBooked:n=>`${n} Positionen gebucht`, nothingToStart:'Die Liste ist leer',
    shoppingHistory:'Einkaufsverlauf', shoppingHistoryHint:'Jeder abgeschlossene Einkauf – mit gekauft und nicht gekauft.',
    noShoppingHistory:'Noch kein abgeschlossener Einkauf', noShoppingHistoryHint:'Nach der Bestätigung im Supermarkt erscheint der Einkauf automatisch hier.',
    boughtItems:'Gekauft', notBoughtItems:'Nicht gekauft', completedBy:'Abgeschlossen von', completedOn:'Abgeschlossen',
    cartQuickAdd:'Produkt schnell hinzufügen…', addToCart:'Hinzufügen', cartReady:n=>`${n} ${n===1?'Produkt':'Produkte'} – Einkauf starten`,
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
    noFridayItemsHint:'Füge Text ein oder lade einen Screenshot hoch. Du kannst später jederzeit weitere Produkte ergänzen.',
    fridayActive:'Einkauf läuft', fridayPlanned:'Geplant', fridayCompleted:'Abgeschlossen',
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
    whoDidWhat:'Wer hat was gemacht', today:'Heute', last7:'Letzte 7 Tage',
    actions:n=>n===1?'Buchung':'Buchungen', noActionsToday:'Heute noch nichts gebucht',
    visibleToAll:'Für alle sichtbar',
    close:'Schließen', childToday:'Heute', childEvents:'Events', childWeek:'Woche', childGames:'Spiele',
    gamesTitle:'Spiele', gamesHint:'Kleine Spiele für zwischendurch',
    gameMemory:'Memory', gameMemoryHint:'Finde die Paare',
    gameTac:'XO', gameTacHint:'3 in einer Reihe',
    gameCatch:'Fische fangen', gameCatchHint:'Tippe die Fische',
    gameBack:'Alle Spiele', gamePlay:'Spielen', gameAgain:'Nochmal',
    gameMoves:'Züge', gamePairs:'Paare', gameScore:'Punkte', gameTime:'Zeit',
    gameWin:'Geschafft!', gameLose:'Schade — nochmal?', gameDraw:'Unentschieden',
    gameYourTurn:'Du bist dran', gameCpuTurn:'Computer denkt…', gameYou:'Du', gameCpu:'PC',
    eventOfWeek:'Event der Woche', eventToday:'Heute', eventTomorrow:'Morgen', upcomingEvents:'Demnächst',
    bring:'Mitbringen', accompaniedBy:'Begleitung', noEvents:'Keine kommenden Events', published:'Veröffentlicht',
    helpChat:'Hilfe', helpWelcome:'Hallo! Frag mich zur App — oder sag z. B. „füge 2 Milch zu Kalyvia hinzu“. Änderungen brauchen deine Bestätigung. Du kannst auch das Mikrofon nutzen.',
    helpWelcomeChild:'Hallo! Ich helfe dir bei deinem Tag, Events und Spielen. Frag z. B. „Was habe ich heute?“ oder „Wie spiele ich Memory?“',
    helpWelcomeStaff:'Hallo! Ich helfe bei Plan, Events, Kühlschrank und Einkaufsliste. Sag z. B. „2 Milch nach Kalyvia“ — Änderungen brauchst du danach zu bestätigen.',
    helpWelcomeAdmin:'Hallo! Du hast Admin-Rechte. Ich helfe bei Betrieb, Admin-Zentrale, Dauerplan und Lager. Sag z. B. „2 Milch nach Kalyvia“ oder frag, wie du den Dauerplan änderst.',
    helpRoleChild:'Kind', helpRoleStaff:'Betreuung', helpRoleAdmin:'Admin',
    helpQuickChild:'Schnell fragen', helpQuickAdmin:'Schnell: Lager / Admin',
    helpChildHint:'Du siehst nur deine Termine und Spiele. Essensänderungen macht die Betreuung.',
    helpAdminHint:'Als Admin kannst du Dauerplan, Dienste und die Admin-Zentrale steuern. Lager-Änderungen brauchen trotzdem Bestätigung.',
    helpMutateHint:'Als angemeldetes Personal kannst du z.B. sagen: „Milch +2 Kalyvia“ oder „Reis auf die Liste“. Dann bestätigen.',
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
    helpProposeTitle:'Vorgeschlagene Änderungen', helpProposeHint:'Noch nicht gespeichert. Prüfe und bestätige.',
    helpProposeConfirm:'Änderungen speichern', helpProposeCancel:'Verwerfen',
    helpProposeDone:n=>`${n} ${n===1?'Änderung':'Änderungen'} gespeichert`,
    helpProposeDenied:'Nur angemeldete Betreuer können Lager und Liste ändern.',
    helpProposeEmpty:'Keine gültigen Änderungen erkannt.',
    helpActionStock:(dir,qty,unit,name,house)=>`${dir==='IN'?'+':'−'} ${qty} ${unit} ${name} @ ${house}`,
    helpActionShopAdd:(qty,unit,name,house)=>`🛒 + ${qty} ${unit} ${name} → Liste ${house}`,
    helpActionShopRemove:(name,house)=>`🛒 entfernen: ${name} @ ${house}`,
    helpPlaceholder:'Frage zur aktuellen Ansicht…', helpSend:'Senden',
    helpThinking:'Ich prüfe das…', helpUnavailable:'Die Hilfe ist gerade nicht erreichbar.',
    helpAuthExpired:'Sitzung abgelaufen. Bitte erneut anmelden und nochmal fragen.',
    helpConfigBanner:'Hilfe-AI ist nicht eingerichtet. In Vercel → Environment Variables GROQ_API_KEY setzen und neu deployen.',
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
    noOverdue:'Nichts vergessen – alles im grünen Bereich.', noUnassigned:'Alle Aufgaben sind zugeteilt.',
    markDone:'Als erledigt markieren', markOpen:'Wieder öffnen', taskDone:'Aufgabe erledigt', taskReopened:'Aufgabe wieder geöffnet',
    next3Days:'Nächste 3 Tage',
    eventButton:'Event', eventButtonOn:'Event wird veröffentlicht', childNotifications:'Neue Event-Mitteilungen',
    openEvents:'Events öffnen', kidsNotified:n=>`${n} Kinder erhalten die Mitteilung in der App.`,
    eventCollection:n=>`${n} ${n===1?'Event':'Events'} geplant`,
    adminCenter:'Admin-Zentrale', adminOverview:'Team, Aufgaben und Änderungen auf einen Blick',
    adminWarnings:'Nur Admins sehen betriebliche Warnungen', adminAllClear:'Keine aktuellen Planwarnungen',
    adminEditPlan:'Wochenplan bearbeiten', adminEditShifts:'Dienste bearbeiten', adminManageEvents:'Events verwalten',
    adminOpenAudit:'Protokoll öffnen', adminToday:'Heute', adminNext7:'Nächste 7 Tage', adminDone:'Erledigt',
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
    errServer:'Die AI konnte die Anfrage nicht verarbeiten. Bitte versuche es erneut.',
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
    appTitle:'Armonia Thassos', navHome:'Αρχική', navSchedule:'Πρόγραμμα', navStock:'Ψυγείο', navShop:'Λίστα', navBook:'Καταγραφές',
    titleHome:'Αρχική', titleSchedule:'Εβδομαδιαίο πρόγραμμα', titleStock:'Ψυγείο / Αποθήκη', titleShop:'Λίστες & Ψώνια', titleBook:'Καταγραφές',
    logout:'Προφίλ', noUser:'Καμία σύνδεση',
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
    adminOpenWeek:'Εβδομαδιαίο', adminOpenStock:'Ψυγείο', adminOpenShop:'Ψώνια',
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
    tapProduct:'Άνοιγμα προϊόντος', productDetail:'Στοιχεία προϊόντος', addToShopping:'Προσθήκη στη λίστα αγορών',
    addedToShopping:'Προστέθηκε στη λίστα αγορών', alreadyPlanned:'Υπάρχει ήδη στη λίστα αγορών',
    listItemRemoved:'Το είδος αφαιρέθηκε από τη λίστα.',
    stockSearch:'Αναζήτηση προϊόντος…', stockAttention:'Προσοχή', stockAll:'Όλα', stockEmpty:'Άδεια',
    stockHealthy:'Επαρκές', stockLow:'Λίγο', stockOutState:'Άδειο', productTypes:'Προϊόντα',
    noStockResults:'Δεν βρέθηκαν προϊόντα.', openShopping:'Στη λίστα αγορών', missingFromShop:n=>`${n} ${n===1?'έλλειψη':'ελλείψεις'} από τα ψώνια`,
    inTitle:'Είσοδος στο ψυγείο', outTitle:'Έξοδος από το ψυγείο',
    product:'Προϊόν', qty:'Ποσότητα',
    photoLabel:'Φωτογραφία — προαιρετική, μόνο ζωντανή λήψη',
    takePhoto:'📷 Λήψη φωτογραφίας', photoTaken:'Η φωτογραφία τραβήχτηκε τώρα, μέσα στην εφαρμογή.',
    noCam:'Η κάμερα δεν είναι διαθέσιμη', needPhoto:'Η φωτογραφία είναι προαιρετική',
    photoOptional:'Φωτογραφία προαιρετική',
    skipPhoto:'Καταγραφή χωρίς φωτογραφία',
    stockHoldHint:'Κράτα πατημένο για επιλογές · Σύρε σε Είσοδο/Έξοδο κάτω',
    stockHoldIn:'＋ Είσοδος',
    stockHoldOut:'− Έξοδος',
    stockHoldShop:'Στη λίστα αγορών',
    stockHoldDetail:'Λεπτομέρειες / ποσότητα',
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
    passkeyHint:'Η συσκευή αποφασίζει: Face ID, Touch ID, δακτυλικό αποτύπωμα ή Windows Hello. Τα βιομετρικά δεν φεύγουν ποτέ από τη συσκευή.',
    passkeyAdded:'Το passkey προστέθηκε με ασφάλεια.', passkeyRemoved:'Τα passkeys αφαιρέθηκαν.', removePasskeys:'Αφαίρεση passkeys',
    passkeyNone:'Δεν έχει ρυθμιστεί ακόμη passkey για αυτό το προφίλ. Μπες με PIN και στο Προφίλ πάτα «Ρύθμιση Face ID / Touch ID».',
    passkeySetupNeeded:'Πρώτα σύνδεση με PIN, μετά ρύθμιση passkey από το Προφίλ.',
    passkeyConfig:'Το Passkey server δεν είναι ρυθμισμένο (Origin/RP ID). Έλεγξε PAIDIA_WEBAUTHN_ORIGIN στο Vercel.',
    emailNotFound:'Το email προφίλ δεν βρέθηκε. Αποθήκευσε πρώτα στοιχεία επικοινωνίας ή έλεγξε αν είσαι συνδεδεμένος.',
    profileCustomize:'Προσαρμογή προφίλ', profileNickname:'Εμφανιζόμενο όνομα', profileColor:'Χρώμα', profileEmoji:'Emoji',
    profileSaved:'Το προφίλ αποθηκεύτηκε', passkeyCount:n=>`${n} ${n===1?'passkey':'passkeys'} ενεργά`,
    passkeyUnavailable:'Τα passkeys χρειάζονται συμβατή συσκευή και HTTPS.', passkeyCancelled:'Η σύνδεση ακυρώθηκε.',
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
    emailReadyHint:'Σύνδεσμοι PIN, δοκιμές και emails events μπορούν να σταλούν.',
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
    gateTrace:'Κάθε κίνηση καταγράφεται με όνομα, ώρα, συσκευή και IP.',
    device:'Συσκευή', welcome:n=>'Καλώς ήρθες, '+n,
    tutorialRequired:'Tutorial σύνδεσης · υποχρεωτικό', tutorialStep:(n,total)=>`Βήμα ${n} από ${total}`,
    tutorialNext:'Επόμενο', tutorialBack:'Πίσω', tutorialFinish:'Ολοκλήρωση ξενάγησης',
    tutorialSaving:'Η πρόοδος αποθηκεύεται με ασφάλεια…', tutorialDone:'Η ξενάγηση ολοκληρώθηκε. Καλώς ήρθες!',
    tutorialSaveError:'Η ξενάγηση δεν αποθηκεύτηκε. Έλεγξε τη σύνδεση και δοκίμασε ξανά.',
    tutorialTip:'Πρέπει να δεις όλα τα βήματα. Η ξενάγηση δεν παραλείπεται και δεν κλείνει.',
    tutorialOpen:'Άνοιγμα tutorial εφαρμογής', tutorialReplay:'Tutorial λειτουργιών', tutorialClose:'Τέλος tutorial',
    tutorialReplayTip:'Μπορείς να ανοίξεις ξανά αυτό το tutorial οποιαδήποτε στιγμή από το ? ή το Προφίλ.',
    helpCenter:'Βοήθεια & Tutorial', helpCenterHint:'Tutorial, συνομιλία ομάδας και βοήθεια AI. Η AI μπορεί με επιβεβαίωση να αλλάξει ψυγείο και λίστα.',
    startTutorial:'Καθοδηγούμενο tutorial εφαρμογής', startTutorialHint:'Όλες οι λειτουργίες για το προφίλ σου – επαναλαμβάνεται από το ?.',
    askAiHelp:'Ερώτηση στη βοήθεια AI', askAiHelpHint:'Κάνε ερώτηση, υπαγόρευσε με μικρόφωνο, ή άλλαξε ψυγείο/λίστα με επιβεβαίωση.',
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
    stockBoard:'Ψυγείο & αποθήκη', dropHere:'Πάτα ή σύρε σε μία ζώνη',
    itemsPicked:'επιλεγμένα', pickSomething:'Πάτα προϊόντα ή σύρ’ τα στο πλαίσιο πάνω',
    bookN:n=>`Καταχώρηση ${n} ${n===1?'είδους':'ειδών'}`,
    stockDraftSave:'Αποθήκευση αλλαγών',
    stockDraftClear:'Ακύρωση',
    stockDraftNeedReason:'Για έξοδο διάλεξε λόγο.',
    stockDraftSummary:(n,ins,outs)=>`${n} · +${ins} / −${outs}`,
    stockDraftPending:'Εκκρεμεί',
    reason:'Λόγος', newReason:'Νέος λόγος', reasonNamePh:'π.χ. δωρεά, επισκευή ή κουζίνα ομάδας',
    saveReason:'Προσθήκη λόγου', reasonRequired:'Γράψε πρώτα ένα όνομα για τον λόγο.',
    reasonExists:'Αυτός ο λόγος υπάρχει ήδη και επιλέχθηκε.', reasonAdded:n=>`Το «${n}» αποθηκεύτηκε και επιλέχθηκε.`, reasonRemoved:'Ο προσαρμοσμένος λόγος αφαιρέθηκε.',
    storeMode:'Στο σουπερμάρκετ', other:'Άλλα',
    storeFocus:'Λειτουργία αγορών', storeFocusHint:'Αποφάσισε καθαρά για κάθε είδος. Τίποτα δεν σημειώνεται αυτόματα ως έλλειψη.',
    storeSearch:'Αναζήτηση…', storeRemaining:'Ακόμα ανοιχτά', storeComplete:'Ολοκληρώθηκε',
    markBought:'Αγοράστηκε', markMissing:'Λείπει', undoDecision:'Επαναφορά',
    decideAll:'Αποφάσισε πρώτα για όλα τα είδη.', shoppingProgress:'Πρόοδος αγορών',
    storeShowDone:'Εμφάνιση ολοκληρωμένων', storeHideDone:'Απόκρυψη ολοκληρωμένων',
    storeLeft:n=>`${n} ανοιχτά`, storeTapHint:'Πάτα ✓ ή × — συμπτυγμένη λίστα',
    listPlanned:'Σχεδιασμένη λίστα', listShopping:'Στα ψώνια', listFinished:'Ολοκληρώθηκε',
    tapToTick:'Πάτα: αγοράστηκε → δεν υπήρχε → ανοιχτό',
    gotIt:'✓ αγοράστηκε', notThere:'✕ δεν υπήρχε',
    confirmBatch:'Επιβεβαίωση παρτίδας', batchHint:'Όλα τα είδη καταχωρούνται μαζί.',
    carryOver:'↩︎ Πίσω στη λίστα', nothingPending:'Καμία ανοιχτή παρτίδα',
    whereIsWhat:'Τι είναι πού', inFridge:'Στο ψυγείο', lastPurchase:'Τελευταία αγορά',
    bothHouses:'Όλα τα σπίτια', shortage:'Έλλειψη',
    boughtNotOnList:'αγοράστηκε, δεν ήταν στη λίστα',
    batchBooked:n=>`${n} είδη καταχωρήθηκαν`, nothingToStart:'Η λίστα είναι άδεια',
    shoppingHistory:'Ιστορικό αγορών', shoppingHistoryHint:'Κάθε ολοκληρωμένη αγορά – με όσα αγοράστηκαν και όσα δεν αγοράστηκαν.',
    noShoppingHistory:'Δεν υπάρχει ολοκληρωμένη αγορά ακόμη', noShoppingHistoryHint:'Μετά την επιβεβαίωση στο σουπερμάρκετ, η αγορά εμφανίζεται αυτόματα εδώ.',
    boughtItems:'Αγοράστηκαν', notBoughtItems:'Δεν αγοράστηκαν', completedBy:'Ολοκληρώθηκε από', completedOn:'Ολοκληρώθηκε',
    cartQuickAdd:'Γρήγορη προσθήκη προϊόντος…', addToCart:'Προσθήκη', cartReady:n=>`${n} ${n===1?'προϊόν':'προϊόντα'} – έναρξη αγορών`,
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
    noFridayItemsHint:'Επικόλλησε κείμενο ή ανέβασε screenshot. Μπορείς να προσθέσεις κι άλλα προϊόντα οποιαδήποτε στιγμή.',
    fridayActive:'Τα ψώνια τρέχουν', fridayPlanned:'Προγραμματισμένη', fridayCompleted:'Ολοκληρωμένη',
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
    whoDidWhat:'Ποιος έκανε τι', today:'Σήμερα', last7:'Τελευταίες 7 ημέρες',
    actions:n=>n===1?'κίνηση':'κινήσεις', noActionsToday:'Καμία κίνηση σήμερα',
    visibleToAll:'Ορατό σε όλους',
    close:'Κλείσιμο', childToday:'Σήμερα', childEvents:'Events', childWeek:'Εβδομάδα', childGames:'Παιχνίδια',
    gamesTitle:'Παιχνίδια', gamesHint:'Μικρά παιχνίδια για διάλειμμα',
    gameMemory:'Μνήμη', gameMemoryHint:'Βρες τα ζευγάρια',
    gameTac:'XO', gameTacHint:'3 στη σειρά',
    gameCatch:'Ψάρεμα', gameCatchHint:'Πάτα τα ψάρια',
    gameBack:'Όλα τα παιχνίδια', gamePlay:'Παίξε', gameAgain:'Ξανά',
    gameMoves:'Κινήσεις', gamePairs:'Ζευγάρια', gameScore:'Πόντοι', gameTime:'Χρόνος',
    gameWin:'Μπράβο!', gameLose:'Κρίμα — ξανά;', gameDraw:'Ισοπαλία',
    gameYourTurn:'Η σειρά σου', gameCpuTurn:'Σκέφτεται ο υπολογιστής…', gameYou:'Εσύ', gameCpu:'PC',
    eventOfWeek:'Event της εβδομάδας', eventToday:'Σήμερα', eventTomorrow:'Αύριο', upcomingEvents:'Επόμενα events',
    bring:'Να φέρεις', accompaniedBy:'Συνοδός', noEvents:'Δεν υπάρχουν επόμενα events', published:'Δημοσιευμένο',
    helpChat:'Βοήθεια', helpWelcome:'Γεια! Ρώτα με για την εφαρμογή — ή πες π.χ. «πρόσθεσε 2 γάλατα στο Kalyvia». Οι αλλαγές χρειάζονται επιβεβαίωση. Μπορείς και μικρόφωνο.',
    helpWelcomeChild:'Γεια! Σε βοηθάω με τη μέρα σου, τα events και τα παιχνίδια. Ρώτα π.χ. «Τι έχω σήμερα;» ή «Πώς παίζω Μνήμη;»',
    helpWelcomeStaff:'Γεια! Σε βοηθάω με πρόγραμμα, events, ψυγείο και λίστα. Πες π.χ. «2 γάλα στο Kalyvia» — οι αλλαγές χρειάζονται επιβεβαίωση.',
    helpWelcomeAdmin:'Γεια! Έχεις δικαιώματα admin. Σε βοηθάω με λειτουργία, Κέντρο διαχείρισης, μόνιμο πρόγραμμα και απόθεμα. Πες π.χ. «2 γάλα Kalyvia» ή ρώτα πώς αλλάζει το μόνιμο πρόγραμμα.',
    helpRoleChild:'Παιδί', helpRoleStaff:'Φροντιστής', helpRoleAdmin:'Admin',
    helpQuickChild:'Γρήγορες ερωτήσεις', helpQuickAdmin:'Γρήγορα: ψυγείο / admin',
    helpChildHint:'Βλέπεις μόνο τα δικά σου και τα παιχνίδια. Αλλαγές φαγητού τις κάνει ο φροντιστής.',
    helpAdminHint:'Ως admin μπορείς να αλλάξεις μόνιμο πρόγραμμα, βάρδιες και το Κέντρο διαχείρισης. Οι αλλαγές ψυγείου χρειάζονται επιβεβαίωση.',
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
    helpMutateHint:'Ως συνδεδεμένο προσωπικό μπορείς π.χ. να πεις: «γάλα +2 Kalyvia» ή «ρύζι στη λίστα». Μετά επιβεβαίωσε.',
    helpProposeTitle:'Προτεινόμενες αλλαγές', helpProposeHint:'Δεν αποθηκεύτηκαν ακόμη. Έλεγξε και επιβεβαίωσε.',
    helpProposeConfirm:'Αποθήκευση αλλαγών', helpProposeCancel:'Απόρριψη',
    helpProposeDone:n=>`${n} ${n===1?'αλλαγή':'αλλαγές'} αποθηκεύτηκαν`,
    helpProposeDenied:'Μόνο συνδεδεμένοι φροντιστές μπορούν να αλλάξουν ψυγείο και λίστα.',
    helpProposeEmpty:'Δεν αναγνωρίστηκαν έγκυρες αλλαγές.',
    helpActionStock:(dir,qty,unit,name,house)=>`${dir==='IN'?'+':'−'} ${qty} ${unit} ${name} @ ${house}`,
    helpActionShopAdd:(qty,unit,name,house)=>`🛒 + ${qty} ${unit} ${name} → λίστα ${house}`,
    helpActionShopRemove:(name,house)=>`🛒 αφαίρεση: ${name} @ ${house}`,
    helpPlaceholder:'Ρώτησε για την τρέχουσα οθόνη…', helpSend:'Αποστολή',
    helpThinking:'Το ελέγχω…', helpUnavailable:'Η βοήθεια δεν είναι διαθέσιμη αυτή τη στιγμή.',
    helpAuthExpired:'Η συνεδρία έληξε. Ξανασυνδέσου και ρώτα ξανά.',
    helpConfigBanner:'Το AI βοήθειας δεν είναι ρυθμισμένο. Στο Vercel → Environment Variables βάλε GROQ_API_KEY και κάνε νέο deploy.',
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
    noOverdue:'Δεν ξέχασες τίποτα – όλα καλά.', noUnassigned:'Όλες οι εργασίες έχουν υπεύθυνο.',
    markDone:'Σήμανση ως ολοκληρωμένο', markOpen:'Άνοιγμα ξανά', taskDone:'Η εργασία ολοκληρώθηκε', taskReopened:'Η εργασία άνοιξε ξανά',
    next3Days:'Επόμενες 3 ημέρες',
    eventButton:'Event', eventButtonOn:'Το event θα δημοσιευτεί', childNotifications:'Νέες ανακοινώσεις event',
    openEvents:'Άνοιγμα events', kidsNotified:n=>`${n} παιδιά λαμβάνουν την ανακοίνωση στην εφαρμογή.`,
    eventCollection:n=>`${n} ${n===1?'event':'events'} προγραμματισμένα`,
    adminCenter:'Κέντρο διαχείρισης', adminOverview:'Ομάδα, εργασίες και αλλαγές με μία ματιά',
    adminWarnings:'Μόνο οι admins βλέπουν λειτουργικές προειδοποιήσεις', adminAllClear:'Δεν υπάρχουν προειδοποιήσεις προγράμματος',
    adminEditPlan:'Επεξεργασία εβδομάδας', adminEditShifts:'Επεξεργασία βαρδιών', adminManageEvents:'Διαχείριση events',
    adminOpenAudit:'Άνοιγμα καταγραφών', adminToday:'Σήμερα', adminNext7:'Επόμενες 7 ημέρες', adminDone:'Ολοκληρωμένα',
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
    errServer:'Το AI δεν μπόρεσε να επεξεργαστεί το αίτημα. Δοκίμασε ξανά.',
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
};

/* v5: καθαρή λειτουργική κατάσταση· παλιά v3/v4 demo data μένουν ως backup στο browser. */
const KEY = 'paidia.v5';
/** Αποθηκεύονται μόνο όσα αλλάζουν εν χρήσει· τα δεδομένα αναφοράς έρχονται από το SEED. */
const MUTABLE = ['template', 'overrides', 'weeks', 'events', 'taskCompletions', 'aiImports', 'listEntries', 'shoppingTrips', 'stock', 'log',
                 'customProducts', 'customCategories',
                 'customActivities', 'customReasons', 'profilePrefs'];

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
  ['overrides','events','taskCompletions','aiImports','listEntries','shoppingTrips','customProducts','customCategories','customActivities','customReasons','log']
    .forEach(k => { if(!Array.isArray(db[k])) db[k] = []; });
  if(!db.stock || typeof db.stock !== 'object') db.stock = {};
  if(!db.profilePrefs || typeof db.profilePrefs !== 'object') db.profilePrefs = {};
  if(!db.weeks || typeof db.weeks !== 'object') db.weeks = {};
  // Σπίτια χωρίς planning flag από παλιότερα saves δεν μπαίνουν στο πρόγραμμα.
  db.houses = SEED.houses.map(h => ({...h}));
  return db;
}

/** Shared across all staff devices — lists, stock, custom catalogue. */
const SHARED_KEYS = ['listEntries','shoppingTrips','stock','customProducts','customCategories','customReasons','profilePrefs'];
const SHARED_DICT_KEYS = new Set(['stock','profilePrefs']);
let sharedRevision = Number(localStorage.getItem('paidia.sharedRev') || 0) || 0;
let sharedPushTimer = null;
let sharedPollTimer = null;
let sharedBusy = false;

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
  if(state.mode !== 'staff' || !(state.user||state.child)) return false;
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
    const serverEmpty = serverRev === 0
      && !(data.listEntries||[]).length
      && !(data.shoppingTrips||[]).length
      && !Object.keys(data.stock||{}).length;
    const localHas = (DB.listEntries||[]).length
      || (DB.shoppingTrips||[]).length
      || Object.keys(DB.stock||{}).length
      || (DB.customProducts||[]).length;
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
      const intended = {};
      SHARED_KEYS.forEach(k => { intended[k] = payload[k]; });
      applySharedPayload(data);
      SHARED_KEYS.forEach(k => { DB[k] = intended[k]; });
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

function save(){
  const ok = saveLocal();
  if(ok) schedulePushShared();
  return ok;
}

function startSharedSync(){
  stopSharedSync();
  if(state.mode !== 'staff') return;
  pullShared({force:true}).then(changed=>{
    if(changed && !document.body.classList.contains('auth-pending')) render();
    // Seed empty server from this device's local list/stock once.
    if(sharedRevision === 0) pushShared();
  });
  sharedPollTimer = setInterval(async()=>{
    if(document.body.classList.contains('auth-pending')) return;
    if(document.hidden) return;
    // Keep lists/fridge live while staff use the app.
    if(!['shop','stock','home','book'].includes(state.tab)) return;
    const changed = await pullShared();
    if(changed && !sheetEl.classList.contains('on')) render();
  }, 1500);
}

function stopSharedSync(){
  clearInterval(sharedPollTimer);
  sharedPollTimer = null;
  clearTimeout(sharedPushTimer);
  sharedPushTimer = null;
}

window.addEventListener('visibilitychange', ()=>{
  if(!document.hidden && state.mode==='staff' && (state.user||state.child)){
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
const profileColor = person => profilePref(person?.id).color || person?.color || '#94a3b8';
const profileEmoji = person => profilePref(person?.id).emoji || '';
const profileLabel = person => {
  const emoji = profileEmoji(person);
  const name = profileName(person);
  return emoji ? `${emoji} ${name}` : name;
};
/** Προκαθορισμένες + όσες πρόσθεσε το προσωπικό μέσα από την εφαρμογή. */
const ACTS = () => [...DB.activities, ...DB.customActivities];
const act = id => ACTS().find(a=>a.id===id);
const PRODUCTS = () => [...DB.products, ...(DB.customProducts||[])];
const CATS = () => [...DB.categories, ...(DB.customCategories||[])];
const prod = id => PRODUCTS().find(p=>p.id===id);
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

/* ── Subtle UI clicks (filtered noise ticks — not musical beeps) ── */
let _audioCtx = null;
let _lastSfxAt = 0;
const SFX_MASTER = 0.22; // keep everything quiet
/** Interaction sounds are soft ticks; save/error get a tiny tonal cue. */
const SFX_KIND = {
  tap:     { mode:'tick', freq:2100, dur:0.018, gain:0.045 },
  select:  { mode:'tick', freq:2400, dur:0.02,  gain:0.05 },
  open:    { mode:'tick', freq:1600, dur:0.024, gain:0.055 },
  toggle:  { mode:'tick', freq:1900, dur:0.02,  gain:0.045 },
  success: { mode:'chime', freqs:[660, 880], dur:0.07, gap:0.04, gain:0.04 },
  save:    { mode:'chime', freqs:[620, 820], dur:0.08, gap:0.045, gain:0.045 },
  warn:    { mode:'tick', freq:900,  dur:0.04,  gain:0.06 },
  error:   { mode:'thud', freq:140,  dur:0.09,  gain:0.07 },
};
function unlockAudio(){
  try{
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    if(!_audioCtx) _audioCtx = new AC();
    if(_audioCtx.state === 'suspended') _audioCtx.resume();
  }catch{}
}
['pointerdown','keydown','touchstart'].forEach(ev=>
  window.addEventListener(ev, unlockAudio, {once:true, capture:true}));

function playNoiseTick(ctx, {freq=2000, dur=0.02, gain=0.05, t0}){
  const n = Math.max(32, Math.floor(ctx.sampleRate * dur));
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for(let i=0;i<n;i++){
    const env = Math.exp(-i / (n * 0.18));
    data[i] = (Math.random() * 2 - 1) * env;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = freq;
  bp.Q.value = 0.9;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 3200;
  const g = ctx.createGain();
  const peak = Math.max(0.004, gain * SFX_MASTER);
  g.gain.setValueAtTime(peak, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(bp); bp.connect(lp); lp.connect(g); g.connect(ctx.destination);
  src.start(t0); src.stop(t0 + dur + 0.01);
}

function playSoftTone(ctx, {freq, dur, gain, type='sine', t0}){
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1800;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  const peak = Math.max(0.004, gain * SFX_MASTER);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(lp); lp.connect(g); g.connect(ctx.destination);
  osc.start(t0); osc.stop(t0 + dur + 0.02);
}

function playSfx(name){
  const spec = SFX_KIND[name] || SFX_KIND.tap;
  const nowMs = performance.now();
  if(nowMs - _lastSfxAt < 40) return;
  _lastSfxAt = nowMs;
  try{
    unlockAudio();
    const ctx = _audioCtx;
    if(!ctx) return;
    const t0 = ctx.currentTime + 0.001;
    if(spec.mode === 'tick'){
      playNoiseTick(ctx, {freq:spec.freq, dur:spec.dur, gain:spec.gain, t0});
      return;
    }
    if(spec.mode === 'thud'){
      playSoftTone(ctx, {freq:spec.freq, dur:spec.dur, gain:spec.gain, type:'sine', t0});
      return;
    }
    (spec.freqs||[]).forEach((freq, i)=>{
      playSoftTone(ctx, {
        freq, dur:spec.dur, gain:spec.gain * (1 - i * 0.15), type:'sine',
        t0: t0 + i * (spec.gap || 0.04),
      });
    });
  }catch{}
}
function haptic(kind='light'){
  if(typeof navigator==='undefined' || !navigator.vibrate) return;
  const pattern = ({
    light:8, medium:16, heavy:28, select:10,
    success:[8,36,12], error:[28,40,28], toggle:12,
  })[kind] ?? 8;
  try{ navigator.vibrate(pattern); }catch{}
}
function feedback(kind='select'){
  const map = {
    select:['select','select'], tap:['tap','light'], open:['open','medium'],
    success:['success','success'], save:['save','success'],
    toggle:['toggle','toggle'], error:['error','error'], warn:['warn','medium'],
  };
  const [sfx, hap] = map[kind] || map.select;
  haptic(hap); playSfx(sfx);
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
  save();
}

/* ════════════════════════════════════════════════════════════════
   Κατάσταση UI
   ════════════════════════════════════════════════════════════════ */
const state = {
  lang: localStorage.getItem('paidia.lang') || 'de',
  tab: 'home',
  scheduleView: 'day',
  childView: 'today',
  gameId: null,
  game: null,
  mode: 'staff',
  user: null,
  child: null,
  house: 'h1',
  shopFriday: fridayFor(),
  stockFilter: 'attention',
  stockQuery: '',
  stockOpenCategories: null,
  stockDraft: {},
  stockDraftReason: null,
  shopQuery: '',
  storeShowDone: false,
  houseFilter: '',
  date: iso(new Date()),
  bookRange: 'today',
  bookFilter: {employeeId:'', type:''},
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
  const response=await fetch('/api/auth/login',{
    method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
    body:JSON.stringify({mode,profileId:who.id,pin}),
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
  if(/iPhone|iPad|iPod/i.test(ua)) return 'Face ID / Touch ID';
  if(/Macintosh|Mac OS/i.test(ua)) return 'Touch ID / Passkey';
  if(/Android/i.test(ua)) return state.lang==='el'?'Δακτυλικό αποτύπωμα / κλείδωμα':'Fingerabdruck / Gerätesperre';
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
  const options=await passkeyApi('/api/auth/passkey/login/options',{mode,profileId:who.id});
  const publicKey=decodePublicKeyOptions(options.publicKey);
  const credential=await navigator.credentials.get({publicKey});
  const data=await passkeyApi('/api/auth/passkey/login/verify',{ceremonyId:options.ceremonyId,credential:publicKeyCredentialJSON(credential)});
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
    const response=await fetch('/api/auth/session',{credentials:'same-origin'});
    const data=await response.json();
    if(response.ok && data.authenticated && applyAuthenticatedProfile(data)){
      closeGate();revealApp();render();
      startSharedSync();
      await ensureOnboarding();await ensureContactDetails();return true;
    }
  }catch(error){ console.error('session restore failed',error); }
  openGate();
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
  sheetLocked = !dismissable;
  document.getElementById('app').inert = sheetLocked;
  document.getElementById('helpFab').inert = true;
  document.getElementById('helpFab').hidden = true;
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
  document.getElementById('helpFab').inert = false;
  document.getElementById('helpFab').hidden = false;
  sheetEl.removeAttribute('role');sheetEl.removeAttribute('aria-modal');
  sheetEl.classList.remove('on'); sheetBg.classList.remove('on');
  sheetEl.onpaste=null; sheetEl.ondragover=null; sheetEl.ondrop=null;
  stopCamera();
  document.querySelectorAll('.stock-hold-menu,.ghost').forEach(el=>el.remove());
  sheetEl.replaceChildren();
  scheduleMeasureChrome();
}

function onboardingSteps(){
  const de=state.lang==='de';
  const step=(icon,deTitle,elTitle,dePath,elPath,deActions,elActions,deResult,elResult)=>({
    icon,title:de?deTitle:elTitle,path:de?dePath:elPath,
    body:de?'Führe diese Schritte aus:':'Ακολούθησε αυτά τα βήματα:',
    features:de?deActions:elActions,result:de?deResult:elResult,
  });
  if(state.mode==='child') return [
    step('🏠','Heute öffnen','Άνοιγμα σημερινής ημέρας','Oben → ☀️ Heute','Επάνω → ☀️ Σήμερα',['Tippe auf „Heute“.','Tippe oben auf den gewünschten Wochentag.','Lies bei jeder Karte Aktivität, Uhrzeit, Haus, Betreuer und die anderen Kinder.'],['Πάτησε «Σήμερα».','Πάτησε επάνω την ημέρα της εβδομάδας που θέλεις.','Διάβασε σε κάθε κάρτα δραστηριότητα, ώρα, σπίτι, φροντιστή και τα άλλα παιδιά.'],'Du siehst nur Termine, denen dein eigenes Profil zugeteilt ist.','Βλέπεις μόνο όσα έχουν ανατεθεί στο δικό σου προφίλ.'),
    step('📅','Die ganze Woche ansehen','Προβολή όλης της εβδομάδας','Oben → 📅 Woche','Επάνω → 📅 Εβδομάδα',['Tippe auf „Woche“.','Scrolle nach unten durch Montag bis Sonntag.','Tippe danach wieder auf „Heute“, um zur Tagesansicht zurückzugehen.'],['Πάτησε «Εβδομάδα».','Κάνε κύλιση από Δευτέρα έως Κυριακή.','Πάτησε ξανά «Σήμερα» για επιστροφή στην ημερήσια προβολή.'],'Tage ohne Eintrag bleiben leer; es werden keine Daten anderer Kinder gezeigt.','Οι ημέρες χωρίς εγγραφή μένουν κενές και δεν εμφανίζονται στοιχεία άλλων παιδιών.'),
    step('🎉','Ein Event vollständig lesen','Πλήρης ανάγνωση event','Oben → 🎉 Events','Επάνω → 🎉 Events',['Tippe auf „Events“; die Zahl am Tab zeigt neue/kommende Events.','Öffne die große Event-Karte.','Prüfe Datum, Uhrzeit, Ort, Begleitung und „Mitbringen“.'],['Πάτησε «Events»· ο αριθμός δείχνει νέα/επόμενα events.','Άνοιξε τη μεγάλη κάρτα του event.','Έλεγξε ημερομηνία, ώρα, μέρος, συνοδό και «Τι να φέρεις».'],'Wenn etwas unklar ist, frage einen Betreuer; ändere keine Angaben selbst.','Αν κάτι δεν είναι σαφές, ρώτησε έναν φροντιστή· μην αλλάξεις στοιχεία.'),
    step('🎮','Ein Spiel starten','Έναρξη παιχνιδιού','Oben → 🎮 Spiele','Επάνω → 🎮 Παιχνίδια',['Tippe auf „Spiele“.','Wähle Memory, XO oder Fische fangen.','Spiele eine Runde und tippe „Nochmal“, wenn du magst.'],['Πάτησε «Παιχνίδια».','Διάλεξε Μνήμη, XO ή Ψάρεμα.','Παίξε μια γύρα και πάτησε «Ξανά» αν θες.'],'Die Spiele bleiben auf dem Gerät und speichern keine Daten auf dem Server.','Τα παιχνίδια μένουν στη συσκευή και δεν αποθηκεύουν δεδομένα στον server.'),
    step('❓','Tutorial oder AI-Hilfe öffnen','Άνοιγμα tutorial ή βοήθειας AI','Blaues ? unten rechts','Μπλε ? κάτω δεξιά',['Tippe auf das blaue „?“.','Wähle „Geführtes App-Tutorial“, um diese Schritte neu zu starten.','Wähle „AI-Hilfe fragen“, tippe eine konkrete Frage und drücke „Senden“.'],['Πάτησε το μπλε «?».','Διάλεξε «Καθοδηγούμενο tutorial εφαρμογής» για επανεκκίνηση.','Διάλεξε «Ερώτηση στη βοήθεια AI», γράψε συγκεκριμένη ερώτηση και πάτησε «Αποστολή».'],'Die Hilfe kennt die aktuelle Ansicht, führt aber keine Buchung für dich aus.','Η βοήθεια γνωρίζει την τρέχουσα οθόνη αλλά δεν κάνει καταχωρήσεις για εσένα.'),
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
        <section class="tutorial-card"><div class="tutorial-icon">${step.icon}</div><div class="tutorial-kicker">Armonia Thassos</div>
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
    base.availableGames = CHILD_GAMES.map(g=>t(g.titleKey));
  }
  if(role==='staff' || role==='admin'){
    base.inventory = helpInventoryContext();
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
    unlockAudio();
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

function describeHelpAction(action){
  const query=action.productQuery||action.name||'';
  const product=matchProduct(query);
  const name=product?L(product):(action.name||query||'?');
  const unit=action.unit||product?.unit||'Stk';
  const hid=action.houseId||shopHouse();
  const houseName=house(hid)?.short||hid;
  if(action.type==='stock_adjust') return T[state.lang].helpActionStock(action.dir||'IN', action.qty||1, unit, name, houseName);
  if(action.type==='shop_add') return T[state.lang].helpActionShopAdd(action.qty||1, unit, name, houseName);
  if(action.type==='shop_remove') return T[state.lang].helpActionShopRemove(name, houseName);
  return name;
}

function applyHelpActions(actions){
  if(state.mode!=='staff' || !state.user){ toast(t('helpProposeDenied'),'error'); return 0; }
  let applied=0;
  actions.forEach(action=>{
    const query=action.productQuery||action.name||'';
    const product=matchProduct(query);
    const hid=action.houseId && house(action.houseId) ? action.houseId : shopHouse();
    if(action.type==='stock_adjust'){
      const qty=Number(action.qty)||0; if(qty<=0) return;
      const p=product||{id:null,unit:action.unit||'Stk',de:query,el:query};
      if(!product){
        DB.customProducts ||= [];
        const created={id:'cp-'+uid(),cat:'custom',de:query,el:query,unit:action.unit||'Stk',alias:[]};
        DB.customProducts.push(created);
        Object.assign(p, created);
      }
      const key=stockKey(hid,p.id);
      const delta=action.dir==='OUT'?-qty:qty;
      DB.stock[key]=Math.max(0, Math.round(((DB.stock[key]??0)+delta)*100)/100);
      logEntry(action.dir==='OUT'?'OUT':'IN',
        `AI · ${describeHelpAction(action)}`,
        {houseId:hid, reason:action.reason||'AI help', items:[{pid:p.id, qty}]});
      applied++;
      return;
    }
    if(action.type==='shop_add'){
      const qty=Number(action.qty)||1;
      const name=product?L(product):(action.name||query);
      const unit=action.unit||product?.unit||'Stk';
      const friday=state.shopFriday||fridayFor();
      const existing=fridayEntries(hid,friday).find(e=>e.status==='open'&&((product&&e.productId===product.id)||norm(e.name)===norm(name)));
      if(existing) existing.qty=Math.round((Number(existing.qty)+qty)*100)/100;
      else DB.listEntries.push({id:uid(),productId:product?.id||null,name,qty,unit,houseId:hid,fridayDate:friday,by:state.user.id,status:'open'});
      logEntry('SHOP',`AI · ${describeHelpAction(action)}`,{houseId:hid});
      applied++;
      return;
    }
    if(action.type==='shop_remove'){
      const before=DB.listEntries.length;
      DB.listEntries=DB.listEntries.filter(e=>{
        if(e.houseId!==hid || !['open','pending'].includes(e.status)) return true;
        if(product && e.productId===product.id) return false;
        return norm(e.name)!==norm(query);
      });
      if(DB.listEntries.length!==before){
        logEntry('SHOP',`AI · ${describeHelpAction(action)}`,{houseId:hid});
        applied++;
      }
    }
  });
  if(applied) save();
  return applied;
}

function sheetHelpProposals(actions, {inline=false, onDone=null}={}){
  if(!actions?.length){ toast(t('helpProposeEmpty')); return; }
  if(state.mode!=='staff' || !state.user){ toast(t('helpProposeDenied'),'error'); return; }
  state.pendingHelpActions=[...actions];
  const confirm=()=>{
    askPin(t('helpProposeConfirm'), who=>{
      state.user=who;
      const n=applyHelpActions(state.pendingHelpActions);
      state.pendingHelpActions=[];
      if(n){
        feedback('save');
        state.helpMessages.push({role:'assistant', content:T[state.lang].helpProposeDone(n)});
        state.helpMessages=state.helpMessages.slice(-12);
        render();
        toast(T[state.lang].helpProposeDone(n),'success');
      }else toast(t('helpProposeEmpty'));
      onDone?.(n);
    });
  };
  const discard=()=>{
    state.pendingHelpActions=[];
    feedback('toggle');
    onDone?.(0);
  };
  if(inline){
    const box=sheetEl.querySelector('#helpProposeBox');
    if(!box){ confirm(); return; }
    box.hidden=false;
    box.innerHTML=`<div class="help-propose-inline"><div class="strong">${esc(t('helpProposeTitle'))}</div>
      <div class="muted" style="font-size:11.5px;margin:4px 0 8px">${esc(t('helpProposeHint'))}</div>
      <div class="help-propose-list">${actions.map((action,i)=>`<div class="help-propose-row"><b>${i+1}.</b><span>${esc(describeHelpAction(action))}</span></div>`).join('')}</div>
      <div class="row" style="gap:8px;margin-top:10px">
        <button class="btn sec" id="helpProposeCancel" type="button">${t('helpDiscardInline')}</button>
        <button class="btn" id="helpProposeConfirm" type="button">✓ ${t('helpConfirmInline')}</button>
      </div></div>`;
    box.querySelector('#helpProposeCancel').onclick=()=>{ box.hidden=true; discard(); };
    box.querySelector('#helpProposeConfirm').onclick=()=>{ box.hidden=true; confirm(); };
    return;
  }
  openSheet(`<div class="help-center-hero"><div class="import-kicker">AI</div><h2>${t('helpProposeTitle')}</h2><p>${t('helpProposeHint')}</p></div>
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
      <h3 style="margin:0">✨ ${t('helpChat')}</h3>
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
  sheetEl.querySelectorAll('#helpQuick [data-q]').forEach(b=>{
    b.onclick=()=>{ input.value=b.dataset.q; feedback('select'); input.focus(); };
  });
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
  const staff = state.mode==='staff' && !!state.user;
  openSheet(`<div class="help-center-hero"><div class="import-kicker">Armonia Thassos</div><h2>${t('helpCenter')}</h2><p>${t('helpCenterHint')}</p></div>
    <div class="help-center-grid ${staff?'three':''}">
      <button class="help-center-card" id="helpTutorial" type="button"><span class="icon">📘</span><b>${t('startTutorial')}</b><span>${t('startTutorialHint')}</span></button>
      ${staff?`<button class="help-center-card talk" id="helpTalk" type="button"><span class="icon">💬</span><b>${t('staffTalk')}</b><span>${t('staffTalkHint')}</span></button>`:''}
      <button class="help-center-card" id="helpAi" type="button"><span class="icon">✨</span><b>${t('askAiHelp')}</b><span>${t('askAiHelpHint')}</span></button>
    </div>`);
  sheetEl.querySelector('#helpTutorial').onclick=openAppTutorial;
  sheetEl.querySelector('#helpAi').onclick=sheetHelp;
  const talkBtn=sheetEl.querySelector('#helpTalk');
  if(talkBtn) talkBtn.onclick=()=>{ feedback('open'); sheetStaffTalk(); };
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

function sheetStaffTalk(){
  if(state.mode!=='staff' || !state.user){ toast(t('staffTalkNeedStaff'),'error'); return; }
  let talk={messages:[], topics:[], videoUrl:'', updatedAt:0};
  let pollTimer=null, busy=false, voice=null;

  const stopPoll=()=>{ if(pollTimer){ clearInterval(pollTimer); pollTimer=null; } };
  const fmtTalkTime=ts=>{
    try{ return new Date(ts).toLocaleTimeString(state.lang==='el'?'el-GR':'de-DE',{hour:'2-digit',minute:'2-digit'}); }
    catch{ return ''; }
  };
  const openTopics=()=>(talk.topics||[]).filter(x=>!x.done && (!x.date || x.date===iso(new Date())));
  const paint=()=>{
    if(!sheetEl.classList.contains('on') || !sheetEl.querySelector('#talkRoot')){ stopPoll(); return; }
    const log=sheetEl.querySelector('#talkLog');
    const topicsEl=sheetEl.querySelector('#talkTopics');
    const videoUrl=talk.videoUrl||'';
    const videoBtn=sheetEl.querySelector('#talkVideoOpen');
    if(videoBtn){ videoBtn.disabled=!videoUrl; videoBtn.dataset.url=videoUrl; }
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
    if(topicsEl){
      const today=iso(new Date());
      const list=[...(talk.topics||[])]
        .filter(x=>!x.date || x.date===today || !x.done)
        .sort((a,b)=>(Number(a.done)-Number(b.done)) || (b.createdAt||0)-(a.createdAt||0))
        .slice(0,40);
      topicsEl.innerHTML = list.length
        ? list.map(topic=>`<button class="talk-topic ${topic.done?'on':''}" type="button" data-topic="${esc(topic.id)}">
            <span class="mark" aria-hidden="true">✓</span>
            <span class="body"><b>${esc(topic.text)}</b>
              <small>${esc(topic.byName||'')} · ${topic.done?(state.lang==='el'?'συζητήθηκε':'besprochen'):(topic.source||'manual')}</small>
            </span></button>`).join('')
        : `<div class="muted" style="font-size:12px">${esc(t('staffTalkTopicsHint'))}</div>`;
      topicsEl.querySelectorAll('[data-topic]').forEach(btn=>{
        btn.onclick=async()=>{
          if(busy) return;
          busy=true; feedback('select');
          try{ talk=await talkApi('toggle_topic',{topicId:btn.dataset.topic}); paint(); }
          catch(error){ feedback('error'); toast(error.message||t('staffTalkLoadError'),'error'); }
          finally{ busy=false; }
        };
      });
    }
  };

  openSheet(`<div id="talkRoot">
      <div class="security-hero" style="margin-bottom:12px"><div class="row" style="gap:12px">
        <div class="security-icon">💬</div>
        <div><div class="import-kicker">Armonia Thassos</div>
          <h2 style="margin:3px 0">${esc(t('staffTalkTitle'))}</h2>
          <div class="muted" style="font-size:12.5px;line-height:1.45">${esc(t('staffTalkIntro'))}</div>
        </div></div></div>
      <div class="talk-video-card">
        <div><b>📹 ${esc(t('staffTalkVideo'))}</b><div class="muted">${esc(t('staffTalkVideoHint'))}</div></div>
        <button class="btn" id="talkVideoOpen" type="button">${esc(t('staffTalkVideoOpen'))}</button>
      </div>
      <div class="talk-topics">
        <div class="talk-topics-head">
          <div><h4>📌 ${esc(t('staffTalkTopics'))}</h4>
            <div class="muted" style="font-size:11.5px;margin-top:2px">${esc(t('staffTalkTopicsHint'))}</div></div>
        </div>
        <div class="talk-topic-list" id="talkTopics"></div>
        <div class="talk-compose-row">
          <input id="talkTopicInput" maxlength="400" placeholder="${esc(t('staffTalkTopicPh'))}">
          <button class="btn sm" id="talkTopicAdd" type="button">＋</button>
        </div>
        <div class="talk-actions">
          <button class="btn sm sec" id="talkSuggest" type="button">💡 ${esc(t('staffTalkSuggest'))}</button>
          <button class="btn sm sec" id="talkClearDone" type="button">${esc(t('staffTalkClearDone'))}</button>
        </div>
      </div>
      <div class="chat-log" id="talkLog" aria-live="polite"></div>
      <div class="chat-compose">
        <textarea id="talkInput" rows="1" placeholder="${esc(t('staffTalkPlaceholder'))}"></textarea>
        <button class="chat-mic" id="talkMic" type="button" aria-label="${esc(t('helpVoice'))}" title="${esc(t('helpVoice'))}">🎤</button>
        <button class="btn" id="talkSend" type="button">${esc(t('staffTalkSend'))}</button>
      </div>
      <div class="chat-voice-status" id="talkVoiceStatus" hidden></div>
    </div>`);

  const input=sheetEl.querySelector('#talkInput');
  const send=sheetEl.querySelector('#talkSend');
  const mic=sheetEl.querySelector('#talkMic');

  sheetEl.querySelector('#talkVideoOpen').onclick=()=>{
    const url=sheetEl.querySelector('#talkVideoOpen').dataset.url;
    if(!url) return;
    feedback('open');
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  sheetEl.querySelector('#talkTopicAdd').onclick=async()=>{
    const text=sheetEl.querySelector('#talkTopicInput').value.trim();
    if(!text || busy) return;
    busy=true;
    try{
      talk=await talkApi('add_topic',{text, date:iso(new Date()), source:'manual'});
      sheetEl.querySelector('#talkTopicInput').value='';
      feedback('success'); paint();
    }catch(error){ feedback('error'); toast(error.message||t('staffTalkLoadError'),'error'); }
    finally{ busy=false; }
  };
  sheetEl.querySelector('#talkClearDone').onclick=async()=>{
    if(busy) return; busy=true;
    try{ talk=await talkApi('clear_done',{date:iso(new Date())}); feedback('toggle'); paint(); }
    catch(error){ feedback('error'); toast(error.message||t('staffTalkLoadError'),'error'); }
    finally{ busy=false; }
  };
  sheetEl.querySelector('#talkSuggest').onclick=async()=>{
    if(busy) return; busy=true;
    const ideas=talkSuggestTopics();
    try{
      for(const idea of ideas){
        talk=await talkApi('add_topic',{text:idea.text, date:iso(new Date()), source:idea.source});
      }
      feedback('success'); paint();
      toast(T[state.lang].staffTalkOpenTopics(openTopics().length),'success');
    }catch(error){ feedback('error'); toast(error.message||t('staffTalkLoadError'),'error'); }
    finally{ busy=false; }
  };

  const submit=async()=>{
    const content=input.value.trim();
    if(!content || busy || send.disabled) return;
    voice?.stop();
    busy=true; send.disabled=true; if(mic) mic.disabled=true;
    try{
      talk=await talkApi('send',{text:content});
      input.value='';
      feedback('select'); paint();
    }catch(error){ feedback('error'); toast(error.message||t('staffTalkLoadError'),'error'); }
    finally{ busy=false; send.disabled=false; if(mic) mic.disabled=false; input.focus(); }
  };
  send.onclick=submit;
  input.onkeydown=e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); submit(); } };
  voice=bindVoiceInput({
    input,
    mic,
    statusEl:sheetEl.querySelector('#talkVoiceStatus'),
  });

  // Keep polling while this sheet is open.
  (async()=>{
    try{
      talk=await talkApi();
      paint();
      pollTimer=setInterval(async()=>{
        if(!sheetEl.classList.contains('on') || !sheetEl.querySelector('#talkRoot') || busy) return;
        try{
          const next=await talkApi();
          if(next.updatedAt!==talk.updatedAt){ talk=next; paint(); }
        }catch{}
      }, 4000);
    }catch(error){
      toast(error.message||t('staffTalkLoadError'),'error');
      closeSheet();
    }
  })();

  // Stop poll when sheet closes.
  const observer=new MutationObserver(()=>{
    if(!sheetEl.classList.contains('on') || !sheetEl.querySelector('#talkRoot')){
      stopPoll(); observer.disconnect();
    }
  });
  observer.observe(sheetEl,{attributes:true, childList:true, attributeFilter:['class']});
}

sheetBg.onclick = () => { if(!sheetLocked) closeSheet(); };
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && sheetEl.classList.contains('on') && !sheetLocked) closeSheet();
});

/** Επαναχρησιμοποιεί το authenticated staff session. PIN ζητείται μόνο χωρίς ενεργή σύνδεση.
 *  Δεν κλείνει το sheet πριν το onOk — οι φόρμες πρέπει να μπορούν να διαβάσουν τα πεδία τους. */
function askPin(title, onOk){
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
  const b = blockDef(e.block);
  if(e.from && e.to) return `${e.from}–${e.to}`;
  if(e.time) return e.time;              // παλιές εγγραφές με ελεύθερο κείμενο
  return `${b.from}–${b.to}`;
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
    <span style="font-size:17px">✅</span><div class="muted">${t('vNone')}</div></div></div>`;
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
  return `<div class="entry-wrap">
    <button class="entry ${e.cancelled?'cancelled':''}" data-open="${e.id}" data-src="${e.source}" type="button">
      <div class="top">
        ${who ? `<div class="avatar" style="background:${who.color}">${initials(who.name)}</div>`
              : `<span class="emoji">${a?a.emoji:'📝'}</span>`}
        <div class="grow">
          <div class="act">${who ? esc(a?a.emoji+' ':'') : ''}${esc(actLabel(e.activityId))}
            ${announced ? `<span class="event-flag">📣 ${t('published')}</span>` : ''}</div>
          <div class="meta">${who ? esc(employeeNames(e)) : person} · ${esc(entryTime(e))}${
            entryHouseIds(e).length ? ' · 🏠 ' + esc(houseNames(e)) : ''}</div>
          ${e.note ? `<div class="meta">${esc(e.note)}</div>` : ''}
        </div>
        <div style="flex:0 0 auto">
          ${e.cancelled ? `<span class="pill gray">${t('cancelled')}</span>`
            : e.overridden ? `<span class="pill ovr">${t('override')}</span>` : ''}
        </div>
      </div>
      ${kids ? `<div class="kids">${kids}</div>` : ''}
    </button>
    ${!e.cancelled?`<button type="button" class="mini-x entry-x" data-remove-entry="${esc(e.id)}" data-entry-date="${esc(dateStr)}" aria-label="${esc(t('removeFromTable'))}" title="${esc(t('removeFromTable'))}">×</button>`:''}
  </div>`;
}

function viewScheduleDay(){
  const today = iso(new Date());
  const week = weekDates(state.date);
  const all = entriesFor(state.date)
    .filter(e => !state.houseFilter || !entryHouseIds(e).length || entryHouseIds(e).includes(state.houseFilter));

  const days = week.map(ds=>{
    const d = new Date(ds+'T12:00:00');
    return `<div class="day ${ds===state.date?'on':''} ${ds===today?'today':''}" data-date="${ds}">
      <div class="d">${DAY_NAMES[state.lang][dowIdx(d)]}</div><div class="n">${d.getDate()}</div></div>`;
  }).join('');

  const blocks = BLOCKS.map(b=>{
    const list = all.filter(e => e.block === b.id);
    let body;
    if(b.by === 'house'){
      body = planningHouses()
        .filter(h => !state.houseFilter || h.id === state.houseFilter)
        .map(h=>{
          const rows = list.filter(e => entryHouseIds(e).includes(h.id));
          return `<div class="house-h">${esc(h.name)}</div>` +
            (rows.length ? rows.map(e=>entryLine(e,state.date)).join('')
              : `<button class="empty" style="width:100%;cursor:pointer;background:none"
                   data-add="${b.id}" data-house="${h.id}">${t('noEntries')} · ${t('add')}</button>`);
        }).join('');
    }else{
      body = list.length
        ? DB.employees.map(p=>{
            const rows = list.filter(e => entryEmployeeIds(e).includes(p.id));
            return rows.length ? rows.map(e=>entryLine(e,state.date)).join('') : '';
          }).join('') + list.filter(e=>!entryEmployeeIds(e).length).map(e=>entryLine(e,state.date)).join('')
        : `<button class="empty" style="width:100%;cursor:pointer;background:none"
             data-add="${b.id}">${t('noEntries')} · ${t('add')}</button>`;
    }
    return `<div class="block">
      <div class="block-h">
        <span class="t">${t(b.id)}</span>
        <span class="hrs">${b.from}–${b.to}</span>
      </div>
      ${body}
      <div style="text-align:right"><button class="btn ghost" data-add="${b.id}">${t('add')}</button></div>
    </div>`;
  }).join('');

  const d = new Date(state.date+'T12:00:00');
  return `
    <div class="days">${days}</div>
    <div class="row between" style="margin:2px 0 12px">
      <div class="muted">${DAY_LONG[state.lang][dowIdx(d)]} ${d.getDate()}.${d.getMonth()+1}.</div>
      <div class="muted">${t('besprechung')}</div>
    </div>
    ${blocks}
    ${validationCard(state.date)}
    ${weekNotesCard()}`;
}

/** Κοινό responsive table system για πρόγραμμα, βάρδιες και μελλοντικά datasets. */
function matrixView(headers, rows, {label = '', interactive = false, title = ''} = {}){
  const desktopMin=140 + headers.length*150;
  const mobileMin=108 + headers.length*144;
  const head = `<div class="matrix-row" role="row">
    <div class="matrix-cell matrix-head matrix-label" role="columnheader">${esc(label)}</div>
    ${headers.map(h=>`<div class="matrix-cell matrix-head" role="columnheader">${esc(h)}</div>`).join('')}
  </div>`;
  const table = `<div class="matrix" role="table" style="--cols:${headers.length};--matrix-min:${desktopMin}px;--matrix-min-mobile:${mobileMin}px" tabindex="0">
    ${head}${rows.map(r=>`<div class="matrix-row" role="row">
      <div class="matrix-cell matrix-label" role="rowheader">${r.label}</div>
      ${r.cells.map(c=>`<div class="matrix-cell ${c.action?'matrix-action':''}" role="cell"
        ${c.action ? `tabindex="0" data-cell="${esc(c.action)}" aria-label="${esc(c.aria||t('add'))}"` : ''}>
        ${c.html || '<span class="matrix-empty">—</span>'}${c.action ? '<span class="matrix-add" aria-hidden="true">＋</span>' : ''}
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
  const dn = DAY_NAMES[state.lang];
  const cell = (empId, day) => {
    const list = shiftsOf(empId, day);
    if(!list.length) return '<span class="muted">—</span>';
    return list.map(s=>{
      if(s.type==='OFF') return `<div class="cellitem"><span class="pill gray">${t('off')}</span></div>`;
      if(s.type==='H24') return `<div class="cellitem"><b>${s.from} → ${dn[(day+1)%7]} ${s.to}</b>
        <br><span class="pill ovr">${t('h24')}</span></div>`;
      if(s.type==='HANDOVER') return `<div class="cellitem"><b>${s.from}–${s.to}</b>
        <br><span class="pill gray">${t('handover')}</span></div>`;
      return `<div class="cellitem"><b>${s.from}–${s.to}</b></div>`;
    }).join('');
  };
  const rows = DB.employees.map(p=>({
    label:esc(p.name),
    cells:dn.map((_,d)=>({
      html:cell(p.id,d),
      action:isAdminUser()?`shift:${p.id}:${d}`:'',
      aria:`${p.name} · ${DAY_LONG[state.lang][d]} · ${t('editShiftDay')}`,
    })),
  }));
  return `
    ${matrixView(dn, rows, {label:state.lang==='de'?'Person':'Άτομο', title:t('viewShift')})}
    <div class="muted" style="margin-bottom:12px">${t('tenMinRule')}</div>
    ${validationCard(state.date)}`;
}

function sheetShiftDay(employeeId, day){
  if(!isAdminUser()){toast(t('adminRequired'),'error');return;}
  const person=emp(employeeId); if(!person) return;
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
      <div class="pa avatar" style="background:${person.color}">${initials(person.name)}</div>
      <div><div class="muted">${t('editShiftDay')}</div><h3 style="margin:1px 0">${esc(person.name)}</h3>
        <div class="muted">${DAY_LONG[state.lang][day]}</div></div>
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
      logEntry('SCHEDULE',`${t('editShiftDay')}: ${person.name} · ${DAY_LONG[state.lang][day]}`);
      if(!save()) return;closeSheet();render();toast(t('shiftSaved'),'success');
    });
  };
}

/** showWho=false στο πλέγμα ανά άτομο — το όνομα είναι ήδη η γραμμή. */
function cellItems(list, showWho = true, dateStr=state.date){
  return list.map(e=>{
    const who = entryEmployeeIds(e).length ? esc(employeeNames(e)) : t('unassigned');
    const kids = kidNames(e.childIds);
    const sub = [showWho ? who : '', e.note].filter(Boolean).join(' · ');
    return `<div class="cellitem" data-open-entry="${esc(e.id)}" data-entry-date="${esc(dateStr)}" role="button" tabindex="0">
      <button type="button" class="cellitem-x" data-remove-entry="${esc(e.id)}" data-entry-date="${esc(dateStr)}" aria-label="${esc(t('removeFromTable'))}" title="${esc(t('removeFromTable'))}">×</button>
      <div class="cellitem-body"><b>${esc(actLabel(e.activityId))}</b>${eventForEntry(e,dateStr)?' <span class="event-flag">📣</span>':''}${
      kids ? ` <span class="c">${esc(kids)}</span>` : ''}${
      (e.from || e.time) ? ` <span class="c">${esc(entryTime(e))}</span>` : ''}${
      sub ? `<br><span style="color:#64748b">${esc(sub)}</span>` : ''}</div></div>`;
  }).join('');
}

function viewScheduleWeek(){
  const week = weekDates(state.date);
  const byDate = {};
  week.forEach(ds => { byDate[ds] = entriesFor(ds).filter(e=>!e.cancelled &&
    (!state.houseFilter || !entryHouseIds(e).length || entryHouseIds(e).includes(state.houseFilter))); });
  const dn = DAY_NAMES[state.lang];
  const visibleHouses=planningHouses().filter(h=>!state.houseFilter || h.id===state.houseFilter);

  const houseTable = (blockId) => matrixView(visibleHouses.map(h=>h.name), week.map((ds,i)=>({
    label:dn[i],
    cells:visibleHouses.map(h=>{
      const list = byDate[ds].filter(e=>e.block===blockId && entryHouseIds(e).includes(h.id));
      return {html:cellItems(list,true,ds), action:`${ds}|${blockId}|${h.id}|`,
        aria:`${DAY_LONG[state.lang][i]} · ${h.name} · ${t(blockId)}`};
    }),
  })), {label:state.lang==='de'?'Tag':'Ημέρα', interactive:true, title:t(blockId)});

  const personTable = matrixView(dn, DB.employees.map(p=>({
    label:esc(p.name),
    cells:week.map((ds,i)=>{
      const list = byDate[ds].filter(e=>e.block==='afternoon' && entryEmployeeIds(e).includes(p.id));
      return {html:cellItems(list,false,ds), action:`${ds}|afternoon||${p.id}`,
        aria:`${p.name} · ${DAY_LONG[state.lang][i]} · ${t('afternoon')}`};
    }),
  })), {label:state.lang==='de'?'Person':'Άτομο', interactive:true, title:t('afternoon')});

  const first = new Date(week[0]+'T12:00:00'), last = new Date(week[6]+'T12:00:00');
  return `
    <div class="row between" style="margin-bottom:10px">
      <div class="muted">${t('weekOf')}: ${first.getDate()}.${first.getMonth()+1}. – ${last.getDate()}.${last.getMonth()+1}.${last.getFullYear()}</div>
      <div class="row" style="gap:4px">
        <button class="btn sm sec" data-shift="-7">‹</button>
        <button class="btn sm sec" data-shift="7">›</button>
      </div>
    </div>
    <div class="block-h"><span class="t">${t('morning')}</span><span class="hrs">10:00–14:00</span></div>
    ${houseTable('morning')}
    <div class="block-h"><span class="t">${t('afternoon')}</span><span class="hrs">15:00–19:00</span></div>
    ${personTable}
    <div class="block-h"><span class="t">${t('evening')}</span><span class="hrs">19:00–22:00</span></div>
    ${houseTable('evening')}
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

function viewSchedule(){
  return `
    <div class="planner-filters">
      <span class="filter-label">${t('filterView')}</span>
      <div class="seg" id="schView">
        <button class="${state.scheduleView==='day'?'on':''}" data-v="day">${t('viewDay')}</button>
        <button class="${state.scheduleView==='week'?'on':''}" data-v="week">${t('viewWeek')}</button>
        <button class="${state.scheduleView==='shift'?'on':''}" data-v="shift">${t('viewShift')}</button>
        <button class="${state.scheduleView==='events'?'on':''}" data-v="events">${t('viewEvents')}</button>
      </div>
      ${['shift','events'].includes(state.scheduleView) ? '' : `<span class="filter-label">${t('filterHouse')}</span>
      <div class="seg house-selector" id="hFilter">
        <button class="${state.houseFilter===''?'on':''}" data-h="">${t('allHouses')}</button>
        ${planningHouses().map(h=>`<button class="${state.houseFilter===h.id?'on':''}" data-h="${h.id}">${esc(h.short)}</button>`).join('')}
      </div>`}
    </div>
    ${state.scheduleView==='day' ? viewScheduleDay()
      : state.scheduleView==='week' ? viewScheduleWeek()
      : state.scheduleView==='shift' ? viewShifts() : staffEventsView()}`;
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
        <span><span class="ev-ico" aria-hidden="true">📣</span>
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
      ${ACTS().map(a=>`<button class="chip ${a.id===pickedAct?'on':''}" data-a="${a.id}" type="button">${a.emoji} ${esc(L(a))}</button>`).join('')}
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
      <div class="card" style="border-color:#c4b5fd;background:#faf5ff;margin-bottom:10px">
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
      ACTS().map(a=>`<button class="chip ${a.id===pickedAct?'on':''}" data-a="${a.id}" type="button">${a.emoji} ${esc(L(a))}</button>`).join('') +
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
      emoji:act(f.activityId)?.emoji||'🎉',color:prior.color||'#7c3aed',status:'published',
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

function viewStock(){
  const hid = state.house;
  const seg = `<div class="seg inventory-scope house-selector" id="sHouse" aria-label="${t('filterHouse')}">
      ${DB.houses.map(h=>`<button class="${hid===h.id?'on':''}" data-h="${h.id}">🏠 ${esc(h.short)}</button>`).join('')}
      <button class="${hid==='all'?'on':''}" data-h="all">${t('bothHouses')}</button>
    </div>`;
  const houses=hid==='all'?DB.houses:[house(hid)];
  const productState=p=>{
    const values=houses.map(h=>DB.stock[stockKey(h.id,p.id)]??0);
    return values.some(q=>q===0)?'empty':values.some(q=>q<=lowThreshold(p))?'low':'ok';
  };
  const allProducts=PRODUCTS();
  const counts={empty:0,low:0,ok:0};allProducts.forEach(p=>counts[productState(p)]++);
  const healthyPct=Math.round(counts.ok/Math.max(1,allProducts.length)*100);
  const query=norm(state.stockQuery||'');
  const visible=allProducts.filter(p=>{
    const st=productState(p), matches=!query||norm(`${p.de} ${p.el}`).includes(query);
    return matches&&(!!query||state.stockFilter==='all'||state.stockFilter===st||state.stockFilter==='attention'&&st!=='ok');
  });
  const catIcon={fridge:'🧀',produce:'🥬',dry:'🥫',drinks:'🥤',household:'🧻',custom:'📦'};
  const productCard=p=>{
    const st=productState(p);
    if(hid==='all'){
      const quantities=houses.map(h=>`<div class="stock-qty"><span class="stock-state">${esc(h.short)}</span>${DB.stock[stockKey(h.id,p.id)]??0}<small>${esc(p.unit)}</small></div>`).join('');
      return `<button class="stock-product ${st} multi-house" data-stock-product="${p.id}" type="button" aria-label="${t('tapProduct')}: ${esc(L(p))}"><div class="stock-product-main"><div class="stock-product-name">${esc(L(p))}</div>
        <div class="stock-product-meta">${t(st==='empty'?'stockOutState':st==='low'?'stockLow':'stockHealthy')}</div></div>
        <div class="stock-product-side"><div class="stock-house-quantities">${quantities}</div></div></button>`;
    }
    const qty=DB.stock[stockKey(hid,p.id)]??0;
    const step=stepFor(p);
    const delta=state.stockDraft[p.id]||0;
    const preview=roundStock(qty+delta);
    const pending=delta?`<span class="stock-pending ${delta>0?'in':'out'}">${delta>0?'+':''}${delta}</span>`:'';
    return `<div class="stock-product ${st} has-stepper ${delta?'drafting':''}">
      <button class="stock-product-main" data-stock-product="${p.id}" type="button" aria-label="${t('tapProduct')}: ${esc(L(p))}">
        <div class="stock-product-name">${esc(L(p))}${pending}</div>
        <div class="stock-product-meta">${t(st==='empty'?'stockOutState':st==='low'?'stockLow':'stockHealthy')}</div>
      </button>
      <div class="stock-stepper" role="group" aria-label="${esc(L(p))}">
        <button class="stock-step out" type="button" data-stock-step="OUT" data-pid="${p.id}" aria-label="${t('stockOut')} −${step} ${esc(p.unit)}" ${preview<=0&&delta<=0?'disabled':''}>−</button>
        <div class="stock-qty ${delta>0?'draft-in':delta<0?'draft-out':''}">${preview}<small>${esc(p.unit)}</small></div>
        <button class="stock-step in" type="button" data-stock-step="IN" data-pid="${p.id}" aria-label="${t('stockIn')} +${step} ${esc(p.unit)}">＋</button>
      </div>
    </div>`;
  };
  const categoryHtml=CATS().map(c=>{
    const products=visible.filter(p=>p.cat===c.id);if(!products.length)return '';
    const shouldOpen=!!query||state.stockFilter==='empty'||products.some(p=>productState(p)==='empty');
    return `<details class="stock-category" data-stock-category="${c.id}" data-default-open="${shouldOpen?'1':'0'}"><summary><span>${catIcon[c.id]||'📦'}</span><span>${esc(L(c))}</span>
      <span class="stock-cat-count">${products.length}</span></summary><div class="stock-product-grid">${products.map(productCard).join('')}</div></details>`;
  }).join('');
  const missing=DB.listEntries.filter(e=>e.status==='missing'&&(hid==='all'||e.houseId===hid));
  const moves=hid==='all'?[]:DB.log.filter(l=>(l.type==='IN'||l.type==='OUT'||l.type==='SHOP')&&l.houseId===hid).slice(-5).reverse();
  const location=hid==='all'?t('bothHouses'):house(hid).short;
  const attention=counts.empty+counts.low;

  return seg+`<section class="stock-strip" aria-label="${t('inventoryDashboard')}">
      <div class="stock-strip-main"><b>${esc(location)}</b><span>${attention?T[state.lang].inventoryHealthyPct(healthyPct):t('stockHealthy')}</span></div>
      <div class="stock-strip-stats">
        <button type="button" class="stock-chip empty ${state.stockFilter==='empty'?'on':''}" data-stock-filter="empty"><b>${counts.empty}</b>${t('stockEmpty')}</button>
        <button type="button" class="stock-chip low ${state.stockFilter==='attention'?'on':''}" data-stock-filter="attention"><b>${attention}</b>${t('stockAttention')}</button>
        <button type="button" class="stock-chip ok ${state.stockFilter==='all'?'on':''}" data-stock-filter="all"><b>${allProducts.length}</b>${t('stockAll')}</button>
      </div></section>
    ${missing.length?`<div class="stock-notice"><span>⚠️</span><b>${T[state.lang].missingFromShop(missing.length)}</b><button class="btn sec sm" id="stockToList">${t('openShopping')}</button></div>`:''}
    <div class="stock-toolbar">
      <label class="stock-search"><span>⌕</span><input id="stockSearch" value="${esc(state.stockQuery)}" placeholder="${t('stockSearch')}" aria-label="${t('stockSearch')}">${state.stockQuery?'<button type="button" id="stockClear" aria-label="'+t('close')+'">×</button>':''}</label>
      ${hid!=='all'?`<div class="stock-toolbar-actions">
        <button class="btn sec sm" type="button" id="stockQuickFood">${t('stockAddFood')}</button>
        <button class="btn sec sm" type="button" id="stockQuickCat">${t('stockAddCat')}</button>
        <button class="btn sec sm" type="button" id="stockOpenBoard">${t('stockBoard')}</button>
      </div>`:''}
    </div>
    <div class="stock-categories">${categoryHtml||`<div class="card empty">${t('noStockResults')}</div>`}</div>
    ${moves.length?`<details class="card stock-moves"><summary>${t('lastMoves')} · ${moves.length}</summary><div style="margin-top:9px">${moves.map(l=>`<div class="kv"><div class="grow truncate">${esc(l.text)}</div><div class="muted" style="flex:0 0 auto;margin-left:8px">${fmtDT(l.ts)}</div></div>`).join('')}</div></details>`:''}
    ${hid!=='all'?(()=>{
      const draft=stockDraftEntries();
      if(!draft.length){
        return `<div class="stock-footer-actions" aria-label="${t('stockBoard')}"><button class="btn in" data-stock-action="IN">${t('stockIn')}</button><button class="btn out" data-stock-action="OUT">${t('stockOut')}</button></div>`;
      }
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
          <button class="btn" type="button" id="stockDraftSave">💾 ${t('stockDraftSave')}</button>
        </div>
      </div>`;
    })():''}`;
}

function sheetStockDetail(pid,hid=state.house){
  const p=prod(pid);if(!p)return;
  const houses=hid==='all'?DB.houses:[house(hid)];
  const cat=CATS().find(c=>c.id===p.cat),icon={fridge:'🧀',produce:'🥬',dry:'🥫',drinks:'🥤',household:'🧻'}[p.cat]||'📦';
  const isPlanned=houseId=>fridayEntries(houseId).some(e=>['open','pending'].includes(e.status)&&e.productId===pid);
  openSheet(`<div class="stock-detail-head"><div class="stock-detail-icon">${icon}</div><div><div class="import-kicker">${t('productDetail')}</div>
      <h2 style="margin:3px 0">${esc(L(p))}</h2><div class="muted">${esc(cat?L(cat):'')}</div></div></div>
    <div class="stock-detail-houses">${houses.map(h=>{const qty=DB.stock[stockKey(h.id,pid)]??0,lp=lastPurchaseOf(h.id,pid);return `<div class="stock-detail-house"><span class="muted">🏠 ${esc(h.short)}</span><b>${qty} ${esc(p.unit)}</b><small class="muted">${lp?`${t('lastPurchase')}: ${fmtDT(lp.decidedAt)}`:t(qty===0?'stockOutState':qty<=lowThreshold(p)?'stockLow':'stockHealthy')}</small></div>`;}).join('')}</div>
    ${hid!=='all'?`<div class="stock-actions"><button class="btn in" id="detailIn">${t('stockIn')}</button><button class="btn out" id="detailOut">${t('stockOut')}</button></div>`:''}
    <div class="${hid==='all'?'stock-actions':''}">${houses.map(h=>`<button class="btn sec" data-detail-shop="${h.id}" ${isPlanned(h.id)?'disabled':''}>${isPlanned(h.id)?'✓ '+t('alreadyPlanned'):`🛒 ${t('addToShopping')}${hid==='all'?' · '+esc(h.short):''}`}</button>`).join('')}</div>`);
  const add=sheetEl.querySelector('#detailIn'),remove=sheetEl.querySelector('#detailOut');
  if(add)add.onclick=()=>{closeSheet();sheetStockBoard('IN',pid);};
  if(remove)remove.onclick=()=>{closeSheet();sheetStockBoard('OUT',pid);};
  sheetEl.querySelectorAll('[data-detail-shop]').forEach(shop=>shop.onclick=()=>{
    const targetHouse=shop.dataset.detailShop;if(isPlanned(targetHouse))return;
    DB.listEntries.push({id:uid(),productId:pid,name:L(p),qty:Math.max(1,lowThreshold(p)),unit:p.unit,
      houseId:targetHouse,fridayDate:state.shopFriday||fridayFor(),by:state.user?.id||null,status:'open'});
    save();closeSheet();render();toast(t('addedToShopping'),'success');
  });
}

/** Ό,τι ζητήθηκε αλλά δεν υπήρχε στο σουπερμάρκετ — ορατό και από το ψυγείο. */
function shortagesCard(hid){
  const miss = DB.listEntries.filter(e => e.status==='missing' && (!hid || e.houseId===hid));
  if(!miss.length) return '';
  return `<div class="card"><h2>${t('secMissing')}</h2>
    ${miss.map(e=>`<div class="kv"><div class="grow">${esc(e.name)}
      <div class="muted" style="font-size:11.5px">🏠 ${esc(house(e.houseId).short)}${
        e.decidedAt?' · '+fmtDT(e.decidedAt):''}</div></div>
      <div class="muted">${e.qty} ${esc(e.unit)}</div></div>`).join('')}
  </div>`;
}

const REASONS = () => [...DB.reasons, ...(Array.isArray(DB.customReasons)?DB.customReasons:[])];

/**
 * Πίνακας ψυγείου: πλακίδια προϊόντων που τα πατάς ή τα σέρνεις στη ζώνη.
 * Μαζεύεις όσα θέλεις και τα καταχωρείς όλα μαζί με μία φωτογραφία και ένα PIN.
 */
/* Δίχτυ ασφαλείας: ό,τι κι αν πάει στραβά στο σύρσιμο, κανένα «φάντασμα»
   δεν μένει κολλημένο στην οθόνη. Δηλώνεται μία φορά, όχι ανά πλακίδιο. */
const clearGhosts = () => document.querySelectorAll('.ghost').forEach(el => el.remove());
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
          <button class="btn sec" id="sbSnap">${t('takePhoto')}</button>
          <img class="thumb" id="sbThumb" style="display:none">
          <button class="btn" id="sbSave" style="margin-top:12px"></button>
        </div>
      </div>
      <div class="stock-drops-dock" aria-label="${esc(t('stockDragDock'))}">
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
    const p=prod(pid); if(!p) return;
    const friday=state.shopFriday||fridayFor();
    const existing=fridayEntries(hid,friday).find(e=>e.status==='open'&&e.productId===pid);
    if(existing){ toast(t('alreadyPlanned')); return; }
    DB.listEntries.push({id:uid(),productId:pid,name:L(p),qty:stepFor(p),unit:p.unit,houseId:hid,fridayDate:friday,by:state.user?.id||null,status:'open'});
    if(save()) toast(t('addedToShopping'),'success');
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
    saveBtn.className = 'btn' + (nOut && !nIn ? ' out' : nIn && !nOut ? ' in' : '');
    saveBtn.textContent = photo
      ? T[state.lang].bookN(picked.length)
      : `${T[state.lang].bookN(picked.length)} · ${t('skipPhoto')}`;
    saveBtn.disabled = !picked.length;
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

  /** Σύρσιμο + παρατεταμένο πάτημα — ζώνες στο κάτω dock + πλευρικές ράγες στην οθόνη. */
  function attachDrag(tile){
    let ghost = null, dragging = false, held = false, active = false;
    let startX = 0, startY = 0, holdTimer = null;
    const HOLD_MS = 380, MOVE_PX = 8;
    let sideRails = null;

    const zones = () => [...sheetEl.querySelectorAll('[data-dz]'), ...(sideRails?sideRails.querySelectorAll('[data-dz]'):[])];
    const ensureRails = () => {
      if(sideRails) return;
      sideRails = document.createElement('div');
      sideRails.className = 'stock-side-rails';
      sideRails.innerHTML = `<div class="stock-side-rail zin" data-dz="IN">${t('stockIn')}</div>
        <div class="stock-side-rail zout" data-dz="OUT">${t('stockOut')}</div>`;
      document.body.appendChild(sideRails);
    };
    const clearRails = () => {
      if(sideRails){ sideRails.remove(); sideRails=null; }
    };
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
      // Edge of screen = IN (left) / OUT (right) while dragging.
      if(ev.clientX < 56) return 'IN';
      if(ev.clientX > window.innerWidth - 56) return 'OUT';
      return null;
    };
    const clearHold = () => { if(holdTimer){ clearTimeout(holdTimer); holdTimer = null; } };
    const cleanup = () => {
      clearHold();
      if(ghost){ ghost.remove(); ghost = null; }
      dragging = false; held = false; active = false;
      zones().forEach(z => z.classList.remove('over'));
      clearRails();
      document.querySelectorAll('.ghost').forEach(el => el.remove());
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
        ensureRails();
        ghost = document.createElement('div');
        ghost.className = 'ghost';
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
    if(!picked.length){ toast(t('pickSomething')); return; }
    const reason = reasonId ? L(REASONS().find(r=>r.id===reasonId)) : '';
    if(outs().length && !reason){ toast(t('reason')); return; }

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

function entryRow(e, extra = ''){
  const by = e.by ? emp(e.by) : null;
  return `<div class="kv"><div class="grow">${esc(e.name)}
      ${e.note?`<div class="muted" style="font-size:11.5px">${esc(e.note)}</div>`:''}
      ${by?`<div class="muted" style="font-size:11.5px">${t('byWhom')} ${esc(by.name)}</div>`:''}</div>
    <div class="row" style="flex:0 0 auto;gap:8px">
      <span class="muted">${e.qty} ${esc(e.unit)}</span>${extra}</div></div>`;
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
  return DB.listEntries.filter(e=>e.houseId===hid && listEntryFriday(e)===friday);
}

function shoppingHistory(hid){
  const saved=(DB.shoppingTrips||[]).filter(trip=>trip.houseId===hid);
  const capturedIds=new Set(saved.flatMap(trip=>(trip.items||[]).map(item=>item.entryId).filter(Boolean)));
  const legacy=new Map();
  DB.listEntries.filter(e=>e.houseId===hid&&['bought','missing'].includes(e.status)&&!capturedIds.has(e.id)).forEach(e=>{
    const friday=listEntryFriday(e),key=`${hid}:${friday}`,trip=legacy.get(key)||{id:`legacy-${key}`,houseId:hid,fridayDate:friday,completedAt:0,completedBy:null,items:[],legacy:true};
    trip.completedAt=Math.max(trip.completedAt,Number(e.decidedAt)||0);trip.completedBy=e.decidedBy||trip.completedBy;
    trip.items.push({entryId:e.id,productId:e.productId||null,name:e.name,qty:e.qty,unit:e.unit,note:e.note||'',result:e.status});legacy.set(key,trip);
  });
  return [...saved,...legacy.values()].sort((a,b)=>(b.completedAt||new Date(b.fridayDate+'T12:00:00'))-(a.completedAt||new Date(a.fridayDate+'T12:00:00')));
}

function sheetShoppingHistory(){
  const hid=shopHouse(),trips=shoppingHistory(hid);
  const itemList=(items,kind)=>{
    const rows=items.filter(item=>item.result===kind);
    return rows.length?`<ul>${rows.map(item=>`<li><span>${esc(item.name)}</span><span>${item.qty} ${esc(item.unit)}</span></li>`).join('')}</ul>`:`<div class="muted" style="font-size:11px">—</div>`;
  };
  openSheet(`<div class="help-center-hero"><div class="import-kicker">${esc(house(hid).short)}</div><h2>🛒 ${t('shoppingHistory')}</h2><p>${t('shoppingHistoryHint')}</p></div>
    <div class="seg house-selector" id="historyHouse" style="margin-top:12px">${DB.houses.map(h=>`<button class="${hid===h.id?'on':''}" data-history-house="${h.id}">🏠 ${esc(h.short)}</button>`).join('')}</div>
    <div class="trip-history-list">${trips.length?trips.map((trip,index)=>{
      const bought=trip.items.filter(item=>item.result==='bought'),missing=trip.items.filter(item=>item.result==='missing'),who=emp(trip.completedBy);
      const dateDay=new Date(trip.fridayDate+'T12:00:00').getDate();
      return `<details class="trip-card" ${index===0?'open':''}><summary><div class="trip-date">${dateDay}</div><div><h3>${esc(fridayText(trip.fridayDate))}</h3><div class="trip-meta">${t('completedBy')} ${esc(who?.name||'—')}${trip.completedAt?' · '+t('completedOn')+' '+esc(fmtDT(trip.completedAt)):''}</div></div><div class="trip-counts"><span class="pill in">✓ ${bought.length}</span><span class="pill out">× ${missing.length}</span></div></summary>
        <div class="trip-results"><section class="trip-result bought"><h4>✓ ${t('boughtItems')}</h4>${itemList(trip.items,'bought')}</section><section class="trip-result missing"><h4>× ${t('notBoughtItems')}</h4>${itemList(trip.items,'missing')}</section></div></details>`;
    }).join(''):`<div class="trip-empty"><div class="big">🧾</div><b>${t('noShoppingHistory')}</b><div style="margin-top:5px;font-size:11.5px">${t('noShoppingHistoryHint')}</div></div>`}</div>`);
  sheetEl.querySelectorAll('[data-history-house]').forEach(button=>button.onclick=()=>{state.house=button.dataset.historyHouse;closeSheet();sheetShoppingHistory();});
}

function viewShop(){
  const hid = shopHouse();
  const friday=state.shopFriday||fridayFor();
  const fridayList=fridayEntries(hid,friday);
  const of = st => fridayList.filter(e=>e.status===st);
  const open = of('open'), pending = of('pending'), bought = of('bought'), missing = of('missing');
  const inStore = pending.length > 0;

  const seg = inStore ? '' : `<div class="seg inventory-scope house-selector shop-scope" id="shHouse" aria-label="${t('chooseShoppingHouse')}">
        ${shoppingHouses().map(h=>`<button class="${hid===h.id?'on':''}" data-h="${h.id}">🏠 ${esc(h.short)}</button>`).join('')}
      </div>`;

  const fridayState=pending.length?t('fridayActive'):(open.length?t('fridayPlanned'):(bought.length||missing.length?t('fridayCompleted'):t('fridayPlanned')));
  const hero=inStore?'':`<section class="shop-bar">
    <div class="shop-bar-top">
      <div><b>${esc(fridayText(friday))}</b><span>${fridayState} · ${open.length} ${t('openItems')}</span></div>
      <button class="btn ghost sm" id="shoppingHistory" type="button">🧾 ${t('shoppingHistory')}</button>
    </div>
    <div class="friday-picker compact">
      <button data-friday-shift="-7" aria-label="${t('previousFriday')}">‹</button>
      <label class="friday-date" title="${t('chooseFriday')}"><input type="date" id="shopFridayDate" value="${friday}"><span>${t('chooseFriday')}</span></label>
      <button data-friday-shift="7" aria-label="${t('nextFriday')}">›</button>
    </div></section>`;

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
  const catOrder = [...CATS().map(c=>c.id), 'other'];

  const storeRow = e => {
    const st = e.decision;
    return `<div class="store-choice ${st||''}" data-entry-row="${e.id}">
      <div class="store-choice-main">
        <div class="store-choice-name">${esc(e.name)}</div>
        <div class="store-choice-qty"><b>${e.qty} ${esc(e.unit)}</b>${e.note?' · '+esc(e.note):''}</div>
      </div>
      <div class="store-choice-actions">
        <button class="store-decision yes ${st==='bought'?'on':''}" data-decision="bought" data-entry="${e.id}" type="button" aria-label="${t('markBought')}">✓</button>
        <button class="store-decision no ${st==='missing'?'on':''}" data-decision="missing" data-entry="${e.id}" type="button" aria-label="${t('markMissing')}">×</button>
        ${st?`<button class="store-decision undo" data-decision="undo" data-entry="${e.id}" type="button" aria-label="${t('undoDecision')}">↶</button>`:''}
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
          <button class="store-done-toggle ${showDone?'on':''}" id="storeShowDone" type="button">${showDone?t('storeHideDone'):t('storeShowDone')}</button>
        </div>
        <div class="store-progress"><i style="width:${progress}%"></i></div>
        <div class="store-search"><input id="storeSearch" value="${esc(state.shopQuery)}" placeholder="${t('storeSearch')}" aria-label="${t('storeSearch')}" autocomplete="off" enterkeyhint="search"></div>
        <div class="store-hint">${esc(t('storeTapHint'))}</div>
      </div>
      <div class="store-scroll">
        ${catOrder.filter(c=>byCat[c]).map(c=>{
          const cat = CATS().find(x=>x.id===c);
          const rows=byCat[c];
          return `<div class="store-category"><div class="store-cat-h">${cat?esc(L(cat)):t('other')}<span>${rows.length}</span></div>${rows.map(storeRow).join('')}</div>`;
        }).join('')}
        ${!pendingVisible.length?`<div class="shop-empty compact"><div class="big">⌕</div><h3>${t('noStockResults')}</h3></div>`:''}
      </div>
      <div class="store-finish bottom-dock">
        <div class="row">
          <button class="btn sec sm" id="btnReceipt" type="button">${t('scanReceipt')}</button>
          <button class="btn" id="confirmBatch" type="button" ${remaining?'disabled':''}>${remaining?`${remaining} · ${t('storeRemaining')}`:t('confirmBatch')}</button>
        </div>
        ${remaining?`<div class="muted" style="margin-top:6px;text-align:center;font-size:10.5px">${t('decideAll')}</div>`:''}
      </div>
    </section>` : '';

  const openCard = pending.length?'':`<div class="card shop-list-card">
    <div class="shop-list-head"><div><h2>${t('secOpen')}</h2><div class="muted" style="font-size:11px">${open.length} · ${esc(house(hid).short)}</div></div>
      <button class="btn ghost sm" id="importList" type="button">${t('importList')}</button></div>
    <div class="cart-quick"><input id="cartQuickName" placeholder="${t('cartQuickAdd')}" aria-label="${t('cartQuickAdd')}"><button class="btn sm" id="cartQuickAdd">＋ ${t('addToCart')}</button></div>
    <div class="shop-shot-row">
      <button class="btn sec" id="pickListShot" type="button">🖼️ ${t('pickScreenshot')}</button>
      <button class="btn sec" id="pasteListShot" type="button">📋 ${t('pasteScreenshot')}</button>
      <input class="file-input-hidden" id="shopShotFile" type="file" accept="image/*,.heic,.heif,image/heic,image/heif">
    </div>
    ${open.length?`<div class="shop-items">${open.map(e=>`<div class="shop-item"><div><div class="shop-item-name">${esc(e.name)}</div>
      <div class="shop-item-sub">${e.note?esc(e.note)+' · ':''}${esc(e.unit)}</div></div><div class="cart-controls"><button class="cart-step" data-list-qty="-1" data-entry="${e.id}" aria-label="−">−</button><input class="cart-qty-input" data-list-q="${e.id}" value="${e.qty}" inputmode="decimal" aria-label="${esc(e.name)}"><button class="cart-step" data-list-qty="1" data-entry="${e.id}" aria-label="＋">＋</button><button class="mini-x" data-remove-list="${e.id}" aria-label="${t('close')}">×</button></div></div>`).join('')}</div>`:
      `<div class="shop-empty compact"><div class="big">🧺</div><h3>${t('noFridayItems')}</h3><p>${t('noFridayItemsHint')}</p></div>`}
    ${open.length&&!pending.length?`<div class="cart-start"><button class="btn" id="startFriday">${T[state.lang].cartReady(open.length)}</button></div>`:''}
    </div>`;

  const missingCard = missing.length ? `<details class="card shop-history" open><summary>⚠️ ${t('secMissing')}<span class="pill out">${missing.length}</span></summary><div class="shop-history-body">
      ${missing.map(e=>entryRow(e,`<button class="btn sm sec" data-carry="${e.id}">${t('carryOver')}</button>`)).join('')}</div></details>` : '';

  const boughtCard = bought.length ? `<details class="card shop-history"><summary>✓ ${t('secBought')}<span class="pill in">${bought.length}</span></summary><div class="shop-history-body">
      ${bought.slice(-8).reverse().map(e=>entryRow(e,`<span class="pill in">${t('stBought')}</span>`)).join('')}</div></details>` : '';

  return seg + hero + pendingCard + openCard + missingCard + boughtCard;
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
 * απόθεμα του σπιτιού· μόνο ό,τι δηλώθηκε ρητά μη διαθέσιμο γίνεται έλλειψη.
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
        const inventoryProduct=inventoryProductForEntry(e),k=stockKey(hid,inventoryProduct.id);
        DB.stock[k] = (DB.stock[k] ?? 0) + e.qty;
        got.push(`${e.name} ${e.qty}${e.unit}`);
      }else if(e.decision === 'missing'){
        e.status = 'missing';           // ό,τι δεν πατήθηκε = δεν υπήρχε
        miss.push(`${e.name} ${e.qty}${e.unit}`);
      }
      delete e.decision;
    });
    DB.shoppingTrips ||= [];
    const tripId='trip-'+uid();
    DB.shoppingTrips.push({id:tripId,houseId:hid,fridayDate:friday,completedAt,completedBy:who.id,
      items:pending.map(e=>({entryId:e.id,productId:e.productId||null,name:e.name,qty:e.qty,unit:e.unit,note:e.note||'',result:e.status}))});
    logEntry('SHOP',
      `${t('typeSHOP')} @ ${house(hid).short} — ${t('stBought')}: ${got.join(', ') || '—'}` +
      ` | ${t('shortage')}: ${miss.join(', ') || '—'}`,
      {houseId:hid,tripId,items:pending.map(e=>({productId:e.productId,name:e.name,qty:e.qty,unit:e.unit,result:e.status}))});
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
   Το Βιβλίο
   ════════════════════════════════════════════════════════════════ */
const LOG_TYPES = ['IN','OUT','SHOP','SCHEDULE','EVENT','NOTES','CORRECTION','LOGIN'];
const typeLabel = ty => t('type'+ty);
const typeIcon = ty => ({IN:'➕',OUT:'➖',SHOP:'🛒',SCHEDULE:'📅',EVENT:'🎉',NOTES:'📝',CORRECTION:'✍️',LOGIN:'🔐'}[ty]||'•');

/**
 * «Ποιος έκανε τι» — σύνοψη ανά άτομο, ορατή σε όλους.
 * Κάθε γραμμή δείχνει πόσες κινήσεις, τι είδους και πότε ήταν η τελευταία.
 */
function whoDidWhatCard(){
  const now = new Date();
  const from = state.bookRange === 'today'
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    : now.getTime() - 7*24*3600*1000;
  const rows = DB.log.filter(l => l.ts >= from && l.employeeId);

  const per = DB.employees.map(e=>{
    const mine = rows.filter(l => l.employeeId === e.id);
    if(!mine.length) return null;
    const counts = {};
    mine.forEach(l => { counts[l.type] = (counts[l.type]||0) + 1; });
    return {e, n: mine.length, counts, last: Math.max(...mine.map(l=>l.ts))};
  }).filter(Boolean).sort((a,b)=> b.n - a.n);

  return `<div class="card">
    <div class="row between" style="margin-bottom:9px">
      <h2 style="margin:0">${t('whoDidWhat')}</h2>
      <span class="pill gray">${t('visibleToAll')}</span>
    </div>
    <div class="seg" id="bRange">
      <button class="${state.bookRange==='today'?'on':''}" data-r="today">${t('today')}</button>
      <button class="${state.bookRange==='week'?'on':''}" data-r="week">${t('last7')}</button>
    </div>
    ${per.length ? per.map(p=>`
      <button class="entry" data-who="${p.e.id}">
        <div class="top">
          <div class="avatar" style="background:${p.e.color}">${initials(p.e.name)}</div>
          <div class="grow">
            <div class="act">${esc(p.e.name)} <span class="muted">· ${p.n} ${T[state.lang].actions(p.n)}</span></div>
            <div class="meta">${Object.entries(p.counts)
              .map(([ty,n])=>`${typeLabel(ty)} ${n}`).join(' · ')}</div>
          </div>
          <div class="muted" style="flex:0 0 auto">${fmtDT(p.last)}</div>
        </div>
      </button>`).join('')
      : `<div class="empty">${t('noActionsToday')}</div>`}
  </div>`;
}

function viewBook(){
  const f = state.bookFilter;
  const rows = DB.log
    .filter(l => (!f.employeeId || l.employeeId===f.employeeId) && (!f.type || l.type===f.type))
    .slice().reverse();
  return `
    ${whoDidWhatCard()}
    <div class="card">
      <div class="row" style="gap:9px">
        <select id="bEmp"><option value="">${t('allStaff')}</option>
          ${DB.employees.map(e=>`<option value="${e.id}" ${f.employeeId===e.id?'selected':''}>${esc(e.name)}</option>`).join('')}</select>
        <select id="bType"><option value="">${t('all')}</option>
          ${LOG_TYPES.map(k=>`<option value="${k}" ${f.type===k?'selected':''}>${typeLabel(k)}</option>`).join('')}</select>
      </div>
    </div>
    <div class="card">
      <div class="row between" style="margin-bottom:10px">
        <h2 style="margin:0">${t('history')} · ${rows.length}</h2>
        <span class="pill gray">${t('appendOnly')}</span>
      </div>
      ${rows.length ? `<div class="log">${rows.map(l=>{
        const e = l.employeeId ? emp(l.employeeId) : null;
        return `<div class="log-item">
          <div class="row between"><span class="pill ${l.type==='IN'?'in':l.type==='OUT'?'out':'gray'}">${typeLabel(l.type)}</span>
            <span class="muted">${fmtDT(l.ts)}</span></div>
          <div style="margin-top:5px">${esc(l.text)}</div>
          <div class="muted">${t('stamp')}: ${esc(e?e.name:'—')}</div>
          <div class="muted" style="font-size:11px">IP ${esc(l.ip||'—')} · ${t('device')} ${esc(l.deviceId||'—')}</div>
          ${l.photo?`<img class="thumb" src="${l.photo}">`:''}
        </div>`;
      }).join('')}</div>` : `<div class="empty">${t('noLog')}</div>`}
    </div>
    <button class="btn sec" id="bFix">${t('correction')}</button>
    <div class="muted" style="margin-top:8px;text-align:center">${t('logNoDelete')}</div>`;
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
    <div class="event-cover" style="background:linear-gradient(135deg,${esc(e.color||'#2563eb')},#0f172a)">
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
  return `<div class="card event-card" style="--event-color:${esc(e.color||'#2563eb')}">
    <div class="event-date"><span>${DAY_NAMES[state.lang][dowIdx(d)]}</span><b>${d.getDate()}</b><span>${d.getMonth()+1}</span></div>
    <div class="grow"><div class="strong">${esc(e.emoji||'🎉')} ${esc(L(e))}</div>
      <div class="muted">${esc(e.from)}–${esc(e.to)} · 📍 ${esc(e.location)}</div>
      <div class="muted">👤 ${esc(caregivers.map(x=>x.name).join(', ')||'—')} · 🎒 ${esc(L(e.bring))}</div></div>
  </div>`;
}

function childEventsView(cid){
  const events = childEventsFor(cid);
  if(!events.length) return `<div class="empty">${t('noEvents')}</div>`;
  const today = iso(new Date()), tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate()+1);
  const tomorrow = iso(tomorrowDate);
  const featured = events.find(e=>e.featured && e.date>=today) || events.find(e=>e.date>=today) || events[0];
  const sections = [
    [t('eventToday'), events.filter(e=>e.date===today && e.id!==featured.id)],
    [t('eventTomorrow'), events.filter(e=>e.date===tomorrow && e.id!==featured.id)],
    [t('upcomingEvents'), events.filter(e=>e.date>tomorrow && e.id!==featured.id)],
  ].filter(([,list])=>list.length);
  return `${childEventHero(featured)}${sections.map(([title,list])=>`
    <div class="block-h"><span class="t">${title}</span></div>${list.map(childEventCard).join('')}`).join('')}`;
}

const CHILD_GAMES = [
  {id:'memory', emoji:'🃏', titleKey:'gameMemory', hintKey:'gameMemoryHint', tint:'#0f766e'},
  {id:'tac', emoji:'⭕', titleKey:'gameTac', hintKey:'gameTacHint', tint:'#b45309'},
  {id:'catch', emoji:'🐟', titleKey:'gameCatch', hintKey:'gameCatchHint', tint:'#0369a1'},
];
const MEMORY_EMOJIS = ['🌊','☀️','🐚','🐙','🐟','⭐','🍋','⛵'];

function stopChildGameTimers(){
  if(state.game?._timer){ clearInterval(state.game._timer); state.game._timer=null; }
  if(state.game?._cpu){ clearTimeout(state.game._cpu); state.game._cpu=null; }
}

function startChildGame(id){
  stopChildGameTimers();
  state.gameId = id;
  if(id==='memory'){
    const deck = MEMORY_EMOJIS.flatMap((emoji,i)=>[{id:`a${i}`,emoji,pair:i},{id:`b${i}`,emoji,pair:i}])
      .sort(()=>Math.random()-0.5)
      .map((card,i)=>({...card, key:i, open:false, done:false}));
    state.game = {moves:0, pairs:0, open:[], lock:false, deck};
  }else if(id==='tac'){
    state.game = {board:Array(9).fill(''), turn:'x', status:'play', winner:null};
  }else if(id==='catch'){
    state.game = {score:0, left:30, hit:false, x:50, y:50, _timer:null};
  }else state.game = null;
  render();
}

function leaveChildGame(){
  stopChildGameTimers();
  state.gameId = null;
  state.game = null;
  render();
}

function childGamesLobby(){
  return `<div class="games-hero">
      <div class="brand-kicker">Armonia</div>
      <h2>${t('gamesTitle')}</h2>
      <p>${t('gamesHint')}</p>
    </div>
    <div class="games-grid">${CHILD_GAMES.map(g=>`
      <button class="game-card" type="button" data-game="${g.id}" style="--game-tint:${g.tint}">
        <span class="game-emoji">${g.emoji}</span>
        <span class="game-copy"><b>${esc(t(g.titleKey))}</b><span>${esc(t(g.hintKey))}</span></span>
        <span class="game-go">${t('gamePlay')}</span>
      </button>`).join('')}</div>`;
}

function childMemoryView(){
  const g=state.game; if(!g) return childGamesLobby();
  const done=g.pairs>=MEMORY_EMOJIS.length;
  return `<div class="game-shell memory">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats"><span>${t('gameMoves')}: <b>${g.moves}</b></span><span>${t('gamePairs')}: <b>${g.pairs}/${MEMORY_EMOJIS.length}</b></span></div></div>
    ${done?`<div class="game-banner win">${t('gameWin')} <button class="btn" type="button" id="gameAgain">${t('gameAgain')}</button></div>`:''}
    <div class="memory-grid">${g.deck.map((card,i)=>`
      <button class="memory-card ${card.open||card.done?'open':''} ${card.done?'done':''}" type="button" data-i="${i}" ${card.done||g.lock?'disabled':''}>
        <span class="memory-face back">🌊</span><span class="memory-face front">${card.emoji}</span>
      </button>`).join('')}</div>
  </div>`;
}

function childTacView(){
  const g=state.game; if(!g) return childGamesLobby();
  const status = g.status==='win' ? (g.winner==='x'?t('gameWin'):t('gameLose'))
    : g.status==='draw' ? t('gameDraw')
    : g.turn==='x' ? t('gameYourTurn') : t('gameCpuTurn');
  return `<div class="game-shell tac">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats"><span>${t('gameYou')}: ❌</span><span>${t('gameCpu')}: ⭕</span></div></div>
    <div class="game-banner ${g.status==='win'?(g.winner==='x'?'win':'lose'):g.status==='draw'?'draw':''}">${esc(status)}
      ${g.status!=='play'?`<button class="btn" type="button" id="gameAgain">${t('gameAgain')}</button>`:''}</div>
    <div class="tac-grid">${g.board.map((cell,i)=>`
      <button class="tac-cell" type="button" data-i="${i}" ${cell||g.status!=='play'||g.turn!=='x'?'disabled':''}>${cell==='x'?'❌':cell==='o'?'⭕':''}</button>`).join('')}</div>
  </div>`;
}

function tacWinner(board){
  for(const [a,b,c] of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]){
    if(board[a] && board[a]===board[b] && board[a]===board[c]) return board[a];
  }
  return board.every(Boolean) ? 'draw' : null;
}

function tacCpuMove(){
  const g=state.game; if(!g || g.status!=='play' || g.turn!=='o') return;
  const empties=g.board.map((v,i)=>v?'':i).filter(v=>v!=='');
  if(!empties.length) return;
  let pick=null;
  for(const i of empties){
    const trial=g.board.slice(); trial[i]='o';
    if(tacWinner(trial)==='o'){ pick=i; break; }
  }
  if(pick==null){
    for(const i of empties){
      const trial=g.board.slice(); trial[i]='x';
      if(tacWinner(trial)==='x'){ pick=i; break; }
    }
  }
  if(pick==null) pick = empties.includes(4) ? 4 : empties[Math.floor(Math.random()*empties.length)];
  g.board[pick]='o';
  const result=tacWinner(g.board);
  if(result==='o'){ g.status='win'; g.winner='o'; }
  else if(result==='draw'){ g.status='draw'; }
  else g.turn='x';
  render();
}

function childCatchView(){
  const g=state.game; if(!g) return childGamesLobby();
  const over=g.left<=0;
  return `<div class="game-shell catch">
    <div class="game-top"><button class="chip" type="button" id="gameBack">${t('gameBack')}</button>
      <div class="game-stats"><span>${t('gameScore')}: <b>${g.score}</b></span><span>${t('gameTime')}: <b>${g.left}s</b></span></div></div>
    ${over?`<div class="game-banner win">${t('gameWin')} · ${g.score} <button class="btn" type="button" id="gameAgain">${t('gameAgain')}</button></div>`:''}
    <div class="catch-sea" id="catchSea">
      ${over?'':`<button class="catch-fish ${g.hit?'hit':''}" type="button" id="catchFish" style="left:${g.x}%;top:${g.y}%">🐟</button>`}
    </div>
  </div>`;
}

function childGamesView(){
  if(state.gameId==='memory') return childMemoryView();
  if(state.gameId==='tac') return childTacView();
  if(state.gameId==='catch') return childCatchView();
  return childGamesLobby();
}

function bindChildGames(root){
  root.querySelectorAll('[data-game]').forEach(btn=>{
    btn.onclick=()=>{ feedback('select'); startChildGame(btn.dataset.game); };
  });
  const back=root.querySelector('#gameBack');
  if(back) back.onclick=()=>{ feedback('select'); leaveChildGame(); };
  const again=root.querySelector('#gameAgain');
  if(again) again.onclick=()=>{ feedback('save'); startChildGame(state.gameId); };

  if(state.gameId==='memory'){
    root.querySelectorAll('.memory-card[data-i]').forEach(btn=>{
      btn.onclick=()=>{
        const g=state.game; if(!g||g.lock) return;
        const i=Number(btn.dataset.i), card=g.deck[i];
        if(!card || card.open || card.done) return;
        card.open=true; g.open.push(i); feedback('select');
        if(g.open.length<2){ render(); return; }
        g.moves += 1; g.lock=true;
        const [a,b]=g.open, ca=g.deck[a], cb=g.deck[b];
        if(ca.pair===cb.pair){
          ca.done=cb.done=true; g.pairs += 1; g.open=[]; g.lock=false; feedback('save');
          render();
        }else{
          render();
          setTimeout(()=>{
            if(!state.game || state.gameId!=='memory') return;
            ca.open=cb.open=false; state.game.open=[]; state.game.lock=false; render();
          }, 650);
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
        const result=tacWinner(g.board);
        if(result==='x'){ g.status='win'; g.winner='x'; feedback('save'); render(); return; }
        if(result==='draw'){ g.status='draw'; render(); return; }
        g.turn='o'; render();
        g._cpu=setTimeout(tacCpuMove, 420);
      };
    });
  }

  if(state.gameId==='catch'){
    const g=state.game;
    const fish=root.querySelector('#catchFish');
    if(fish && g && g.left>0){
      fish.onclick=()=>{
        g.score += 1; g.hit=true; feedback('save');
        g.x = 12 + Math.random()*76; g.y = 12 + Math.random()*70;
        render();
        setTimeout(()=>{ if(state.game) state.game.hit=false; }, 120);
      };
      if(!g._timer){
        g._timer=setInterval(()=>{
          if(!state.game || state.gameId!=='catch'){ stopChildGameTimers(); return; }
          state.game.left -= 1;
          if(state.game.left<=0){ stopChildGameTimers(); state.game.left=0; }
          else {
            state.game.x = 12 + Math.random()*76;
            state.game.y = 12 + Math.random()*70;
          }
          render();
        }, 1000);
      }
    }
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
      return `<article class="event-staff-card" style="--event-color:${esc(e.color||'#2563eb')}">
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
    childIds:[...(presets.childIds||[])], bring:{de:'',el:''}, emoji:'🎉', color:'#7c3aed',
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
  return `<button class="task-row event-card" data-event="${esc(e.id)}" style="--event-color:${esc(e.color||'#2563eb')};width:100%;text-align:left;cursor:pointer" type="button">
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
      <div class="admin-person-top"><div class="pa avatar" style="background:${person.color}">${initials(person.name)}</div>
        <div class="grow"><div class="admin-person-name">${esc(person.name)}${person.admin?'<span class="admin-badge">ADMIN</span>':''}</div>
          <div class="admin-person-role">${esc(L(person.role))} · ${esc(employeeShiftSummary(person.id,today))}</div></div></div>
      <div class="admin-person-stats"><span><b>${todayItems.length}</b>${t('adminToday')}</span><span><b>${nextItems.length}</b>${t('adminNext7')}</span></div>
      <div class="admin-person-next">${next?`${esc(eventDayLabel(next.dateStr))} · ${esc(actLabel(next.e.activityId))}`:`✓ ${t('noTasks')}`}</div>
      ${done?`<div class="muted" style="margin-top:5px">✓ ${done} ${t('adminDone')}</div>`:''}
    </button>`;
  }).join('');
  return `<section class="card admin-center">
    <div class="admin-center-head"><div><div class="brand-kicker">ARMONIA THASSOS</div><h2>👑 ${t('adminCenter')}</h2>
      <div class="muted">${t('adminOverview')}</div></div><div class="admin-crown">🛡️</div></div>
    <div class="admin-actions">
      <button class="btn sm" data-admin-go="week">📅 ${t('adminEditPlan')}</button>
      <button class="btn sm sec" data-admin-go="shift">🕒 ${t('adminEditShifts')}</button>
      <button class="btn sm sec" data-admin-go="events">🎉 ${t('adminManageEvents')}</button>
      <button class="btn sm sec" data-admin-go="audit">📖 ${t('adminOpenAudit')}</button>
    </div>
    <div class="admin-alert-strip ${issues.length?'':'clear'}"><span>${issues.length?'⚠️':'✅'}</span><div class="grow"><b>${issues.length?`${issues.length} · ${t('adminWarnings')}`:t('adminAllClear')}</b>
      <div style="margin-top:2px">${t('adminFullControl')}</div></div></div>
    <div class="admin-team-grid">${team}</div>
  </section>`;
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
  openSheet(`<div class="admin-detail-hero"><div class="pa avatar" style="background:${person.color}">${initials(person.name)}</div>
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
    closeSheet(); state.tab='book'; state.bookFilter.employeeId=employeeId; render();
  };
  sheetEl.querySelector('#adminPersonContact').onclick=()=>{
    closeSheet(); setTimeout(()=>sheetSecurityAccess(),180);
  };
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
  const upcoming=events.filter(e=>e.status==='published' && e.date>=today);
  return `<div class="card home-hero">
      <div class="muted">${t('homeHello')}${user?', '+esc(user.name):''}</div>
      <h2>${t('homeOverview')}</h2>
      <div class="home-stats">
        <div class="home-stat"><b>${todayOpen.length}</b><span>${t('dueToday')}</span></div>
        <div class="home-stat"><b>${overdue.length}</b><span>${t('overdue')}</span></div>
        <div class="home-stat"><b>${upcoming.length}</b><span>${t('eventsSoon')}</span></div>
      </div>
    </div>
    ${user?`<button class="notification-card" id="homeTalkOpen" type="button">
      <span style="font-size:22px">💬</span>
      <div class="grow"><b>${esc(t('staffTalkOpen'))}</b>
        <div class="muted" style="font-size:12px;margin-top:2px">${esc(t('staffTalkHint'))}</div></div>
      <span class="muted">→</span>
    </button>`:''}
    <div class="dashboard-grid">
      ${adminTeamPanel(today)}
      <section class="card"><div class="block-h"><span class="t">✅ ${t('myTasks')}</span><span class="hrs">${esc(eventDayLabel(today))}</span></div>
        <div class="task-list">${todayAssignments.length?todayAssignments.map(e=>dashboardTaskCard(e,today,user.id)).join(''):`<div class="empty">${t('noTasks')}</div>`}</div>
      </section>
      <section class="card"><div class="block-h"><span class="t">⚠️ ${t('overdueTasks')}</span><span class="hrs">7</span></div>
        <div class="task-list">${overdue.length||recentlyDone.length?
          overdue.map(x=>dashboardTaskCard(x.e,x.dateStr,user.id,{overdue:true})).join('')+
          recentlyDone.map(x=>dashboardTaskCard(x.e,x.dateStr,user.id)).join(''):`<div class="empty">${t('noOverdue')}</div>`}</div>
      </section>
      <section class="card wide"><div class="block-h"><span class="t">📣 ${t('allEvents')}</span><button class="btn sm sec" id="homeAllEvents" type="button">${t('openEvents')} →</button></div>
        <div class="task-list">${events.length?events.map(homeEventCard).join(''):`<div class="empty">${t('noEvents')}</div>`}</div>
      </section>
      <section class="card wide"><div class="block-h"><span class="t">👤 ${t('unassignedTasks')}</span><span class="hrs">${t('next3Days')}</span></div>
        <div class="task-list">${unassigned.length?unassigned.map(x=>dashboardTaskCard(x.e,x.dateStr,'',{readonly:true})).join(''):`<div class="empty">${t('noUnassigned')}</div>`}</div>
      </section>
    </div>`;
}

function renderChild(){
  const c = state.child;
  const today = iso(new Date());
  const week = weekDates(state.date);
  const wk = DB.weeks[weekKey(state.date)] || {};
  const todays = childEntriesFor(state.date, c.id);
  const childUpcomingEvents = childEventsFor(c.id).filter(e=>e.date>=today);

  document.getElementById('title').textContent = esc(c.name);
  document.getElementById('who').textContent = t('myWeek');
  document.getElementById('btnLang').textContent = state.lang === 'de' ? 'DE' : 'ΕΛ';
  document.getElementById('btnUser').textContent = t('childBye');
  document.getElementById('btnProfiles').textContent = '↔';
  document.getElementById('btnProfiles').title = t('profilesBack');
  document.getElementById('btnProfiles').setAttribute('aria-label', t('switchProfile'));
  document.querySelector('nav').style.display = 'none';
  document.body.classList.add('mode-child');
  document.body.classList.remove('has-stock-dock','has-store-dock');
  document.getElementById('helpFab').setAttribute('aria-label', t('helpCenter'));
  document.getElementById('helpFab').title = t('helpCenter');

  const days = week.map(ds=>{
    const d = new Date(ds+'T12:00:00');
    return `<div class="day ${ds===state.date?'on':''} ${ds===today?'today':''}" data-date="${ds}">
      <div class="d">${DAY_NAMES[state.lang][dowIdx(d)]}</div><div class="n">${d.getDate()}</div></div>`;
  }).join('');

  const weekList = week.map(ds=>{
    const list = childEntriesFor(ds, c.id);
    if(!list.length) return '';
    const d = new Date(ds+'T12:00:00');
    return `<div class="house-h">${DAY_LONG[state.lang][dowIdx(d)]} ${d.getDate()}.${d.getMonth()+1}.</div>
      ${list.map(e=>{
        const a = act(e.activityId);
        return `<div class="kv"><div class="grow">${a?a.emoji:'📝'} ${esc(actLabel(e.activityId))}</div>
          <div class="muted">${esc(entryTime(e))}</div></div>`;
      }).join('')}`;
  }).join('') || `<div class="empty">${t('nothingToday')}</div>`;

  const profile = `<div class="card" style="text-align:center;border:0;background:none;padding:4px 0 10px">
      <div class="pa avatar" style="width:64px;height:64px;border-radius:50%;margin:0 auto 8px;
        background:${profileColor(c)};font-size:20px">${esc(profileEmoji(c)||initials(profileName(c)))}</div>
      <div class="strong" style="font-size:18px">${esc(profileLabel(c))}</div>
    </div>`;
  const tabs = `<div class="seg child-tabs" id="childTabs">
    <button class="${state.childView==='today'?'on':''}" data-child-view="today">☀️ ${t('childToday')}</button>
    <button class="${state.childView==='events'?'on':''}" data-child-view="events">🎉 ${t('childEvents')}${childUpcomingEvents.length?` <span class="nav-badge">${childUpcomingEvents.length}</span>`:''}</button>
    <button class="${state.childView==='week'?'on':''}" data-child-view="week">📅 ${t('childWeek')}</button>
    <button class="${state.childView==='games'?'on':''}" data-child-view="games">🎮 ${t('childGames')}</button>
  </div>`;
  const todayView = `
    ${childUpcomingEvents.length?`<button class="notification-card" id="childEventNotice" type="button">
      <span style="font-size:24px">📣</span><span class="grow"><span class="strong">${t('childNotifications')}</span><br><span class="muted">${t('openEvents')}</span></span>
      <span class="notification-count">${childUpcomingEvents.length}</span></button>`:''}
    <div class="days">${days}</div>
    <div class="block-h" style="margin-top:6px"><span class="t">${t('myToday')}</span></div>
    ${todays.length ? todays.map(e=>childEntryCard(e, c.id)).join('')
      : `<div class="empty">${t('nothingToday')}</div>`}
    ${childEventsFor(c.id).filter(e=>e.date===state.date).map(childEventCard).join('')}`;
  const weekView = `<div class="card"><h2>${t('myWeek')}</h2>${weekList}</div>`;
  const viewBody = state.childView==='today' ? todayView
    : state.childView==='events' ? childEventsView(c.id)
    : state.childView==='games' ? childGamesView()
    : weekView;

  document.getElementById('view').innerHTML = `
    ${profile}${tabs}
    ${viewBody}`;

  document.getElementById('view').querySelectorAll('.day').forEach(d=>{
    d.onclick = () => { state.date = d.dataset.date; render(); };
  });
  document.getElementById('view').querySelectorAll('[data-child-view]').forEach(b=>{
    b.onclick = () => {
      const next = b.dataset.childView;
      if(next !== 'games'){ stopChildGameTimers(); state.gameId=null; state.game=null; }
      state.childView = next;
      render();
    };
  });
  const eventNotice=document.getElementById('view').querySelector('#childEventNotice');
  if(eventNotice) eventNotice.onclick=()=>{state.childView='events';render();};
  if(state.childView==='games') bindChildGames(document.getElementById('view'));
  scheduleMeasureChrome();
}

function measureChrome(){
  const root=document.documentElement;
  const nav=document.querySelector('nav');
  const childMode=document.body.classList.contains('mode-child');
  const storeFs=document.body.classList.contains('store-fullscreen');
  const matrixFs=document.body.classList.contains('matrix-fullscreen');
  const navHidden=childMode || storeFs || matrixFs || !nav || nav.style.display==='none';
  const navH=navHidden?0:Math.ceil(nav.getBoundingClientRect().height);
  const dockEl=document.querySelector('.stock-footer-actions, .store-finish.bottom-dock');
  let dockH=0;
  if(dockEl){
    const style=getComputedStyle(dockEl);
    if(style.display!=='none' && style.visibility!=='hidden'){
      dockH=Math.ceil(dockEl.getBoundingClientRect().height);
    }
  }
  // Set on both html and body so class-based body vars cannot override measured values.
  [root, document.body].forEach(el=>{
    el.style.setProperty('--nav-total', `${navH}px`);
    el.style.setProperty('--dock-h', `${dockH}px`);
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
  const restoreMatrixFs = document.body.classList.contains('matrix-fullscreen')
    ? (document.querySelector('.matrix-shell.is-fullscreen .matrix-toolbar-title')?.textContent || '')
    : '';
  document.body.classList.remove('mode-child');
  document.body.classList.remove('store-fullscreen');
  document.body.classList.remove('matrix-fullscreen');
  document.querySelector('nav').style.display = '';
  document.getElementById('helpFab').setAttribute('aria-label', t('helpCenter'));
  document.getElementById('helpFab').title = t('helpCenter');
  document.getElementById('title').textContent =
    t(state.tab==='home'?'titleHome':state.tab==='schedule'?'titleSchedule':state.tab==='stock'?'titleStock':state.tab==='shop'?'titleShop':'titleBook');
  document.getElementById('who').textContent = state.user
    ? profileLabel(state.user) + ' · ' + L(state.user.role) : t('noUser');
  if(isAdminUser()) document.getElementById('who').innerHTML += ' <span class="admin-badge">ADMIN</span>';
  document.getElementById('btnLang').textContent = state.lang === 'de' ? 'DE' : 'ΕΛ';
  document.getElementById('btnUser').textContent = t('logout');
  document.getElementById('btnProfiles').textContent = '↔';
  document.getElementById('btnProfiles').title = t('profilesBack');
  document.getElementById('btnProfiles').setAttribute('aria-label', t('switchProfile'));
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on', b.dataset.tab===state.tab));
  document.querySelectorAll('[data-nav]').forEach(s=>{
    s.textContent = t('nav' + s.dataset.nav[0].toUpperCase() + s.dataset.nav.slice(1));
  });

  const stockDock=state.tab==='stock' && state.house!=='all';
  const storeDock=state.tab==='shop' && fridayEntries(shopHouse()).some(e=>e.status==='pending');
  document.body.classList.toggle('has-stock-dock', stockDock);
  document.body.classList.toggle('has-store-dock', storeDock);
  document.body.classList.toggle('store-fullscreen', storeDock);
  document.body.classList.toggle('has-stock-draft', stockDock && stockDraftEntries().length>0);

  document.getElementById('view').innerHTML =
      state.tab==='home'     ? viewHome()
    : state.tab==='schedule' ? viewSchedule()
    : state.tab==='stock'    ? viewStock()
    : state.tab==='shop'     ? viewShop()
    : viewBook();
  wire();
  if(restoreMatrixFs && state.tab==='schedule'){
    const shell=[...document.querySelectorAll('.matrix-shell')].find(s=>
      (s.querySelector('.matrix-toolbar-title')?.textContent||'')===restoreMatrixFs);
    if(shell) enterMatrixFullscreen(shell);
  }
  scheduleMeasureChrome();
}

function wire(){
  const v = document.getElementById('view');

  v.querySelectorAll('[data-admin-staff]').forEach(button=>button.onclick=()=>sheetAdminStaff(button.dataset.adminStaff));
  v.querySelectorAll('[data-admin-go]').forEach(button=>button.onclick=()=>{
    const destination=button.dataset.adminGo;
    if(destination==='audit'){state.tab='book';state.bookRange='week';}
    else{state.tab='schedule';state.scheduleView=destination;}
    render();
  });

  const homeAllEvents=v.querySelector('#homeAllEvents');
  if(homeAllEvents) homeAllEvents.onclick=()=>{state.tab='schedule';state.scheduleView='events';render();};
  const homeTalkOpen=v.querySelector('#homeTalkOpen');
  if(homeTalkOpen) homeTalkOpen.onclick=()=>{ feedback('open'); sheetStaffTalk(); };
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
    b.onclick = () => { exitMatrixFullscreen(); state.scheduleView = b.dataset.v; render(); };
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
  v.querySelectorAll('[data-shift]').forEach(b=>{
    b.onclick = () => {
      const d = new Date(state.date+'T12:00:00');
      d.setDate(d.getDate() + Number(b.dataset.shift));
      state.date = iso(d); render();
    };
  });
  v.querySelectorAll('[data-open]').forEach(el=>{
    el.onclick = () => {
      const e = entriesFor(state.date).find(x=>x.id===el.dataset.open);
      if(e) sheetEntry(e, state.date);
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
    b.onclick = () => sheetEntry(null, state.date, {
      block: b.dataset.add,
      houseId: b.dataset.house || undefined,
    });
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

  v.querySelectorAll('[data-stock-action]').forEach(b=>b.onclick=()=>sheetStockBoard(b.dataset.stockAction));
  v.querySelectorAll('[data-stock-product]').forEach(b=>{
    b.onclick=()=>sheetStockDetail(b.dataset.stockProduct,state.house);
    // Long-press options on fridge rows (IN / OUT / shop / board).
    let holdTimer=null, moved=false, sx=0, sy=0;
    const clear=()=>{ if(holdTimer){ clearTimeout(holdTimer); holdTimer=null; } };
    b.onpointerdown=ev=>{
      if(state.house==='all') return;
      moved=false; sx=ev.clientX; sy=ev.clientY;
      clear();
      holdTimer=setTimeout(()=>{
        holdTimer=null;
        if(moved) return;
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
            const act=btn.dataset.act;
            if(act==='in'){ adjustStockDraft(pid,'IN'); render(); }
            else if(act==='out'){ adjustStockDraft(pid,'OUT'); render(); }
            else if(act==='shop'){
              const friday=state.shopFriday||fridayFor();
              if(fridayEntries(state.house,friday).some(e=>e.status==='open'&&e.productId===pid)){ toast(t('alreadyPlanned')); return; }
              DB.listEntries.push({id:uid(),productId:pid,name:L(p),qty:stepFor(p),unit:p.unit,houseId:state.house,fridayDate:friday,by:state.user?.id||null,status:'open'});
              if(save()) toast(t('addedToShopping'),'success');
            }else if(act==='board') sheetStockBoard('IN', pid);
            else sheetStockDetail(pid, state.house);
          };
        });
        const dismiss=e=>{ if(menu.contains(e.target)) return; menu.remove(); document.removeEventListener('pointerdown', dismiss, true); };
        setTimeout(()=>document.addEventListener('pointerdown', dismiss, true), 0);
      }, 420);
    };
    b.onpointermove=ev=>{ if(Math.hypot(ev.clientX-sx, ev.clientY-sy)>10){ moved=true; clear(); } };
    b.onpointerup=clear; b.onpointercancel=clear;
  });
  const stockOpenBoard=v.querySelector('#stockOpenBoard');
  if(stockOpenBoard) stockOpenBoard.onclick=()=>sheetStockBoard('IN');
  const stockQuickFood=v.querySelector('#stockQuickFood');
  if(stockQuickFood) stockQuickFood.onclick=()=>{ sheetStockBoard('IN'); setTimeout(()=>sheetEl.querySelector('#sbAddFood')?.click(), 80); };
  const stockQuickCat=v.querySelector('#stockQuickCat');
  if(stockQuickCat) stockQuickCat.onclick=()=>{ sheetStockBoard('IN'); setTimeout(()=>sheetEl.querySelector('#sbAddCat')?.click(), 80); };
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
    if(!Array.isArray(state.stockOpenCategories))state.stockOpenCategories=stockCategories.filter(d=>d.dataset.defaultOpen==='1').map(d=>d.dataset.stockCategory);
    stockCategories.forEach(d=>{
      d.open=!!state.stockQuery||state.stockOpenCategories.includes(d.dataset.stockCategory);
      d.ontoggle=()=>{
        if(state.stockQuery)return;
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
  v.querySelectorAll('[data-carry]').forEach(b=>{
    b.onclick = () => {
      const e = DB.listEntries.find(x=>x.id===b.dataset.carry);
      e.status = 'open'; delete e.decidedAt; delete e.decidedBy;
      save(); render();
    };
  });
  v.querySelectorAll('[data-remove-list]').forEach(b=>b.onclick=()=>{
    DB.listEntries=DB.listEntries.filter(e=>e.id!==b.dataset.removeList);
    save();render();toast(t('listItemRemoved'),'success');
  });
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
  const br = v.querySelector('#btnReceipt');
  if(br) br.onclick = sheetReceipt;
  const il = v.querySelector('#importList');
  if(il) il.onclick = () => sheetImportList();
  const pickShot=v.querySelector('#pickListShot');
  const shopShotFile=v.querySelector('#shopShotFile');
  if(pickShot && shopShotFile){
    pickShot.onclick=()=>{ shopShotFile.value=''; shopShotFile.click(); };
    shopShotFile.onchange=()=>{
      const file=shopShotFile.files?.[0];
      if(file) sheetImportList({initialFile:file});
      shopShotFile.value='';
    };
  }
  const pasteShot=v.querySelector('#pasteListShot');
  if(pasteShot) pasteShot.onclick=async ()=>{
    try{
      if(navigator.clipboard?.read){
        const items=await navigator.clipboard.read();
        for(const item of items){
          const mime=item.types.find(x=>x.startsWith('image/'));
          if(!mime) continue;
          const blob=await item.getType(mime);
          sheetImportList({initialFile:new File([blob],'clipboard.png',{type:blob.type||mime})});
          return;
        }
      }
    }catch(error){ /* fall through */ }
    sheetImportList();
    toast(t('screenshotMissing'),'info');
  };
  const historyButton=v.querySelector('#shoppingHistory');
  if(historyButton)historyButton.onclick=sheetShoppingHistory;

  v.querySelectorAll('#bRange button').forEach(b=>{
    b.onclick = () => { state.bookRange = b.dataset.r; render(); };
  });
  v.querySelectorAll('[data-who]').forEach(b=>{
    b.onclick = () => {
      state.bookFilter.employeeId = state.bookFilter.employeeId === b.dataset.who ? '' : b.dataset.who;
      render();
    };
  });

  const be = v.querySelector('#bEmp'), bt = v.querySelector('#bType'), bf = v.querySelector('#bFix');
  if(be) be.onchange = () => { state.bookFilter.employeeId = be.value; render(); };
  if(bt) bt.onchange = () => { state.bookFilter.type = bt.value; render(); };
  if(bf) bf.onclick = sheetCorrection;
}

document.querySelectorAll('nav button').forEach(b=>{
  b.onclick = () => {
    if(b.dataset.tab!=='stock' && state.tab==='stock') clearStockDraft();
    state.tab = b.dataset.tab;
    render();
  };
});
document.getElementById('btnUser').onclick = () => (state.user||state.child) ? sheetSecurityAccess() : openGate();
document.getElementById('btnLang').onclick = () => setLang(state.lang === 'de' ? 'el' : 'de');
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
        <div class="security-icon mail-icon">✉️</div>
        <div class="grow">
          <div class="import-kicker">Armonia Thassos</div>
          <h2 style="margin:3px 0">${t('securityAccess')}</h2>
          <div class="muted">${esc(who.name)}</div>
        </div>
      </div>
    </div>
    <div class="security-passkey-card email-card" id="securityProfile"><div class="muted">${t('reading')}</div></div>
    <div class="security-passkey-card" id="securityCustomize"></div>
    <div class="security-passkey-card" id="securityPasskey"><div class="muted">${t('reading')}</div></div>
    <button class="btn sec" id="securityTutorial">📘 ${t('tutorialOpen')}</button>
    <button class="btn sec" id="securitySwitch">↔ ${t('switchProfile')}</button>
    <button class="btn sec" id="securityLogout">${t('signOut')}</button>`);
  const profileCard=sheetEl.querySelector('#securityProfile'),card=sheetEl.querySelector('#securityPasskey');
  const customizeCard=sheetEl.querySelector('#securityCustomize');
  const pref=profilePref(who.id);
  if(customizeCard){
    customizeCard.innerHTML=`<div class="row between" style="align-items:center;gap:10px;margin-bottom:8px">
        <div><b>${t('profileCustomize')}</b><div class="muted" style="font-size:11px;margin-top:3px">${esc(who.name)}</div></div>
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
  let count=0;
  try{
    const [response,profilesResponse]=await Promise.all([
      fetch('/api/auth/session',{credentials:'same-origin'}),fetch('/api/auth/profiles',{credentials:'same-origin'})
    ]),data=await response.json(),profilesData=await profilesResponse.json();
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
            <div class="email-panel-kicker">${t('emailProvider')}</div>
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
    card.innerHTML=`<div class="row between"><div><b>${esc(biometricName())}</b><div class="muted" style="font-size:11px;margin-top:3px">${count?T[state.lang].passkeyCount(count):t('passkeyNone')}</div></div><span style="font-size:25px">${supported?'✓':'!'}</span></div>
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
  return `<div class="gate-meta" id="gateMeta">
    ${t('device')} <b>${esc(session.deviceId)}</b> · IP <b>${esc(session.ip || '…')}</b><br>
    ${t('gateTrace')}</div>`;
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
    <div class="profiles">
      ${people.map(p=>`
        <button class="profile" data-p="${p.id}">
          <div class="pa" style="background:${p.color}">${initials(p.name)}</div>
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
  gateBody.innerHTML = `
    <div class="gate-pin">
      <div class="pa" style="background:${who.color}">${initials(who.name)}</div>
      <h3>${esc(who.name)}</h3>
      <div class="sub">${mode==='child' ? '' : esc(L(who.role)) + ' · '}${t('gatePin')}</div>
      <button class="passkey-btn" id="gPasskey" type="button" hidden>🔐 <span><b>${esc(biometricName())}</b><span class="pk-sub">${esc(biometricHint())}</span></span></button>
      <div class="pin-divider" id="gPinDivider" hidden>${t('pinFallback')}</div>
      <div class="pindots" id="gpd" aria-live="polite"></div>
      <input class="pin-field" id="gPinInput" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="6"
        autocomplete="one-time-code" enterkeyhint="done" aria-label="PIN" value="">
      <div id="gpErr" style="min-height:18px;color:#f87171;font-size:12.5px" role="alert"></div>
      <div class="pinpad" id="gPinpad" role="group" aria-label="PIN">
        ${[1,2,3,4,5,6,7,8,9].map(n=>`<button type="button" data-k="${n}">${n}</button>`).join('')}
        <button type="button" data-k="del" aria-label="Backspace">⌫</button><button type="button" data-k="0">0</button><button type="button" data-k="clr" aria-label="Clear">C</button>
      </div>
      <button class="btn" id="gLogin" type="button" style="margin-top:12px">${t('loginEntry')}</button>
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
  gateBody.querySelector('#gBack').onclick = () => renderProfiles(mode);
  gateBody.querySelector('#gForgot').onclick = () => renderResetRequest(who,mode);

  const finishLogin=async()=>{
    if(busy) return;
    const errorEl=gateBody.querySelector('#gpErr'),button=gateBody.querySelector('#gLogin');
    if(buf.length<4){errorEl.textContent=t('wrongPin');return;}
    busy=true;button.classList.add('logging');button.disabled=true;if(pinInput)pinInput.disabled=true;errorEl.textContent='';draw();
    try{
      await authenticateProfile(mode,who,buf);
      stopPinKeyboard();
      closeGate();revealApp();render();startSharedSync();await ensureOnboarding({afterLogin:true});await ensureContactDetails();toast(T[state.lang].welcome(who.name),'success');
    }catch(error){
      if(error.status===429){
        const minutes=Math.max(1,Math.ceil((Number(error.retryAfter)||900)/60));
        errorEl.textContent=T[state.lang].lockedFor(minutes);
      }else if(error.status===401 && Number.isInteger(error.attemptsRemaining)){
        errorEl.textContent=T[state.lang].attemptsRemaining(error.attemptsRemaining);
      }else errorEl.textContent=error.status===401?t('wrongPin'):t('authUnavailable');
      buf='';
    }finally{
      busy=false;button.classList.remove('logging');button.disabled=false;
      if(pinInput){pinInput.disabled=false;pinInput.focus({preventScroll:true});}
      draw();
    }
  };

  const pushKey=k=>{
    if(busy) return;
    if(k==='del') buf = buf.slice(0,-1);
    else if(k==='clr') buf = '';
    else if(/^\d$/.test(k) && buf.length<6) buf += k;
    draw();
    if(buf.length===6) finishLogin();
  };

  // Event delegation — survives re-draws and is more reliable on touch devices.
  gateBody.querySelector('#gPinpad').addEventListener('click', event=>{
    const button=event.target.closest('button[data-k]');
    if(!button) return;
    event.preventDefault();
    pushKey(button.dataset.k);
  });
  gateBody.querySelector('#gLogin').onclick=finishLogin;

  pinInput.addEventListener('input', ()=>{
    if(busy) return;
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
      closeGate();revealApp();render();startSharedSync();await ensureOnboarding({afterLogin:true});await ensureContactDetails();toast(T[state.lang].welcome(who.name),'success');
    }catch(error){
      errorEl.textContent=error.code==='no_passkey'?t('passkeySetupNeeded'):
        error.code==='passkey_unavailable'||error.code==='configuration'?t('passkeyConfig'):
        error.code==='unsupported'?t('passkeyUnavailable'):
        error.name==='NotAllowedError'?t('passkeyCancelled'):
        /not found/i.test(String(error.message||''))?t('passkeySetupNeeded'):
        error.message||t('authUnavailable');
    }finally{busy=false;button.disabled=false;}
  };
}

function renderResetRequest(who,mode){
  stopPinKeyboard();
  gateBody.innerHTML=`
    <div class="gate-pin">
      <div class="pa" style="background:${who.color}">${initials(who.name)}</div>
      <h3>${t('resetPinTitle')}</h3>
      <div class="sub">${esc(who.name)}</div>
      <label class="f" style="text-align:left;margin-top:18px"><span>${t('emailLabel')}</span>
        <input type="email" id="resetEmail" autocomplete="email" inputmode="email"></label>
      <div id="resetStatus" style="min-height:36px;font-size:12.5px"></div>
      <button class="btn" id="resetSend">${t('sendResetLink')}</button>
      <button class="gate-back" id="resetBack">${t('gateBack')}</button>
    </div>${gateMeta()}`;
  gateBody.querySelector('#resetBack').onclick=()=>renderGatePin(who,mode);
  gateBody.querySelector('#resetSend').onclick=async()=>{
    const email=gateBody.querySelector('#resetEmail').value.trim();
    const status=gateBody.querySelector('#resetStatus'),button=gateBody.querySelector('#resetSend');
    if(!email){setStatus(status,t('emailLabel'),'error');return;}
    button.disabled=true;
    try{
      const response=await fetch('/api/auth/request-reset',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({profileId:who.id,email})});
      if(!response.ok) throw new Error(String(response.status));
      setStatus(status,t('resetLinkSent'),'success');
    }catch(error){setStatus(status,t('authUnavailable'),'error');}
    finally{button.disabled=false;}
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
      <div class="pa" style="background:#c4b5fd">🔐</div>
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
    }catch(error){setStatus(status,error.message==='storage'?t('errStorage'):t('invalidReset'),'error');}
    finally{button.disabled=false;}
  };
}

document.documentElement.lang = state.lang;
document.getElementById('helpFab').onclick = sheetHelpCenter;
window.addEventListener('keydown', event=>{
  if(event.key==='Escape' && document.body.classList.contains('matrix-fullscreen')){
    event.preventDefault();
    exitMatrixFullscreen();
  }
});
window.addEventListener('resize', scheduleMeasureChrome);
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
const resetToken=new URLSearchParams(location.search).get('reset');
if(resetToken){
  openGate();
  renderResetForm(resetToken);
}else if(window.__paidiaAuthed){
  // Instant gate.js already authenticated — hydrate the app without redrawing login.
  restoreServerSession();
}else{
  openGate();
  restoreServerSession();
}
resolveIp().then(refreshGateMeta);
// Do not register a service worker — stale PWA caches were breaking login.
if('serviceWorker' in navigator){
  navigator.serviceWorker.getRegistrations().then(regs=>{
    regs.forEach(reg=>reg.unregister());
  }).catch(()=>{});
}
if(window.caches&&caches.keys){
  caches.keys().then(keys=>keys.forEach(k=>caches.delete(k))).catch(()=>{});
}
