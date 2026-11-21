# MaPi – Malin Public Health

Private Lernkarten-App zur Klausurvorbereitung: Startseite, Themen-Zusammenfassungen,
Lernkarten (auch eigene) und Quiz. Eine einzige Datei (`index.html`), keine Server, keine
Abhängigkeiten.

## Passwortschutz

Die Lerninhalte liegen nur **verschlüsselt** in `index.html` (AES-256-GCM, Schlüssel per
PBKDF2-SHA256 mit 600.000 Runden aus dem Passwort). Ohne Passwort sind sie weder auf der
Seite noch im Repository lesbar. Das Passwort steht nirgends im Repository.

Lernfortschritt und eigene Karten speichert die App nur im Browser des jeweiligen Geräts.
Unter *Einstellungen* gibt es eine Sicherung zum Herunterladen und Einspielen.

## Als GitHub-Seite veröffentlichen

1. Im Repository: **Settings → Pages**
2. *Source*: **Deploy from a branch**, Branch auswählen, Ordner **/ (root)**, speichern
3. Nach etwa einer Minute ist die App unter `https://<benutzer>.github.io/<repository>/` erreichbar

Auf dem iPhone/iPad lässt sie sich in Safari über *Teilen → Zum Home-Bildschirm* wie eine App ablegen.

## Inhalte oder Passwort ändern

Benötigt wird nur Node.js (ab Version 20).

```bash
# Passwort ändern
MAPI_PASSWORD='altes Passwort' NEW_PASSWORD='neues Passwort' node tools/build.mjs rekey

# Inhalte bearbeiten: entschlüsseln, inhalt.json ändern, neu bauen
MAPI_PASSWORD='Passwort' node tools/build.mjs decrypt --out inhalt.json
MAPI_PASSWORD='Passwort' node tools/build.mjs build --content inhalt.json
```

`inhalt.json` ist in `.gitignore` eingetragen und darf nicht ins Repository. Danach die neue
`index.html` committen und pushen.

Änderungen an Aussehen und Verhalten: `src/styles.css`, `src/app.js`, `src/shell.html`,
anschließend ebenfalls `build` bzw. `rekey` ausführen.
