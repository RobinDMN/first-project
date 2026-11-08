# KI im Unternehmen – 5 YouTube Shorts (Framer Motion)

Fünf Hochformat-Shorts (1080 × 1920, 30 fps, 33–40 Sek.) mit deutscher Sprecherstimme,
Kinetic-Captions, Musikbett, Sound-Effekten und „interaktiven“ Elementen (Quiz mit Countdown,
Abstimmungen, Tap-Animationen, Kommentar-Aufrufe). Gebaut mit **React + Framer Motion**,
gerendert Frame für Frame mit Playwright und ffmpeg.

Fertige Videos: `output/v1.mp4` … `output/v5.mp4`

---

## Recherche: 10 Punkte für die Inhalte

| # | Punkt | Kernaussage | Quelle |
|---|-------|-------------|--------|
| 1 | **Verbreitung** | 57 % der Unternehmen (ab 20 MA) nutzen KI, erstmals die Mehrheit. Frühjahr 2026: 41 %, 2024: ca. 20 %. | Bitkom, Sept. 2026 |
| 2 | **Nutzungstiefe** | Nur 3 % schöpfen die Möglichkeiten nach eigener Einschätzung stark aus. | Bitkom, Sept. 2026 |
| 3 | **Einsatzbereiche** | Marketing & Vertrieb vorn (38 %), dann Verwaltung und IT (je 30 %). | Bitkom-Studie 2026 |
| 4 | **Größte Hürde** | Rechtliche Unsicherheit und EU AI Act (53 %). | Bitkom-Studie 2026 |
| 5 | **Meeting-Assistenten** | Fireflies, Otter, Fathom, Jamie (EU-Hosting, ohne Bot im Call): Transkript, Zusammenfassung, Aufgaben. | Tool-Vergleiche 2026 |
| 6 | **KI-Kundenservice** | Intercom Fin (Abrechnung pro gelöstem Fall), Zendesk AI. Agenten beantworten nicht nur, sie führen Aktionen aus. | Tool-Vergleiche 2026 |
| 7 | **Automatisierung** | Zapier, Make, n8n (selbst hostbar). Trend 2026: Agenten, die handeln, statt nur zu antworten. | Tool-Vergleiche 2026 |
| 8 | **Wissensbasis entscheidet** | KI-Agenten sind nur so gut wie aktuelle interne Infos; klare Übergabe an Menschen nötig. | Tool-Vergleiche 2026 |
| 9 | **EU AI Act, Art. 4** | Pflicht zu Maßnahmen für KI-Kompetenz (seit 02/2025; per Digital-Omnibus 2026 abgeschwächt). Kein Pflicht-Zertifikat, aber dokumentieren. | EU AI Act Service Desk, IHK, TÜV |
| 10 | **Vorgehen** | Klein starten (Pilot), schulen, Regeln (welche Daten nie in Gratis-Tools), Wirkung messen, dann ausrollen. | Synthese aus oben |

Hinweis: Viele Tool-Rankings stammen von Anbietern; die Rechtsauslegung zu Art. 4 vor Veröffentlichung
am Originaltext (EUR-Lex) prüfen. Die Videos enthalten den Hinweis „keine Rechtsberatung“.

---

## Die 5 Videos

| Folge | Titel | Hook | Interaktion |
|-------|-------|------|-------------|
| 1 | **57 % nutzen KI, aber nur 3 % richtig** | „Stopp!“ mit Screen-Shake, Gebäude-Raster leuchtet auf | Quiz A/B/C mit 3-Sek.-Countdown („Pausier das Video!“), Konfetti-Auflösung, Ja/Nein-Kommentar, Folgen-Button |
| 2 | **Nie wieder Protokoll schreiben** | Stapel aus Protokollen fällt, Uhr rast, Schnitt auf „Sekunden“ | Live-Call mit KI-Notizen, Aufgaben fliegen ins CRM, Einwilligungs-Schalter, Meeting-Auswahl per Tap |
| 3 | **Kundenservice um 3 Uhr nachts** | Sternenhimmel, 03:00, Kunde wartet 6 Stunden | Chat-Demo mit Bestellstatus-Aktion, Sprachen-Karussell, Übergabe an Mensch, Abstimmung Bot oder Mensch |
| 4 | **E-Mail rein, CRM fertig** | Strg+C / Strg+V-Zähler, „STOPP“-Stempel | Workflow-Knoten mit fließenden Datenpaketen, KI markiert Name/Firma/Anliegen, Stoppuhr, Kommentar wird getippt |
| 5 | **KI einführen in 4 Schritten** | Riesige „4“ | Fortschritts-Stepper, AI-Act-Checkliste, Erlaubt/Tabu-Spalten, Speichern-Button, Zahlen-Abstimmung |

---

## Bedienung

```bash
npm install
pip install piper-tts                 # deutsche Stimme (Piper, „Thorsten“)
# Stimmmodell nach voice/ entpacken (nicht im Repo, 60 MB):
# https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-de-thorsten-low.tar.gz
python3 scripts/tts.py                # Sprecherstimme + src/timings.json
python3 scripts/mix.py                # Musikbett + SFX + Stimme -> Tonspur
npx vite                              # Vorschau: http://127.0.0.1:5173/?v=v1 (Klick = Play)
node scripts/render.mjs v1            # -> output/v1.mp4 (v1 … v5)
```

**Texte ändern:** `scripts/script.json` (`say` = Aussprache für die Stimme, `cap` = Untertitel),
danach `tts.py`, `mix.py`, `render.mjs` erneut ausführen. Die Animationen hängen an den Wort-Zeitpunkten
und verschieben sich automatisch mit.

**Bessere Stimme:** Die Piper-Stimme läuft offline und kostenlos, klingt aber synthetisch. Für den
Upload am besten die Sätze aus `script.json` mit ElevenLabs o. Ä. einsprechen lassen, als
`public/audio/<video>_<segment>.wav` ablegen und ab `mix.py` weitermachen (in `tts.py` dann nur
noch die Timing-Berechnung laufen lassen).

### Aufbau

- `src/core.jsx`: Motion-Engine. Alles hängt an **einem** Framer-Motion-Wert `t`; daraus werden alle
  Animationen per `useTransform` abgeleitet. Dadurch ist jedes Frame exakt reproduzierbar und synchron zur Stimme.
- `src/frame.jsx`: Hintergrund, Kopfzeile, Fortschrittsbalken, Wort-für-Wort-Captions
- `src/videos/V1.jsx` … `V5.jsx`: die Szenen
- `scripts/`: TTS, Audiomix, Renderer
