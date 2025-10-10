# AI Prompt Library - Deployment Guide

Dieses Dokument beschreibt die vollständige Einrichtung und den Betrieb der AI Prompt Library auf einem Linux-Server (z.B. Raspberry Pi) mit Node.js, PM2 und Nginx als Reverse-Proxy.

## 1. Voraussetzungen

- **Linux-Server**: Ein Server mit `sudo`-Zugriff.
- **Node.js**: Eine aktuelle LTS-Version (z.B. v18+). Die Installation über `nvm` (Node Version Manager) wird empfohlen.
- **Nginx**: Ein installierter und laufender Nginx Webserver (oder andere Webserver).
- **PM2**: Ein global installierter Prozessmanager für Node.js.
  ```bash
  sudo npm install pm2 -g
  ```
- **Google Gemini API Key**: Ein gültiger API-Schlüssel aus dem Google AI Studio.

## 2. Installation

1.  **Code herunterladen/kopieren**: Platzieren Sie die Projektdateien im gewünschten Verzeichnis, z.B. `/var/www/html/aiprompt`.

2.  **Verzeichnis wechseln**:
    ```bash
    cd /var/www/html/aiprompt
    ```
    Vergessen Sie nicht die Berechtigungen anzupassen! (www-data)

3.  **Abhängigkeiten installieren**:
    ```bash
    npm install
    ```

## 3. Konfiguration

1.  **`.env`-Datei erstellen**: Erstellen Sie eine `.env`-Datei im Hauptverzeichnis des Projekts. Diese Datei enthält die geheimen Schlüssel und Konfigurationen.
    ```bash
    nano .env
    ```

2.  **Variablen eintragen**: Fügen Sie Ihren API-Schlüssel und optional einen Port hinzu. Der Standard-Port ist `3000`.
    ```ini
    # Erforderlich: Ihr API-Schlüssel für die Google Gemini API
    API_KEY=DEIN_GEMINI_API_KEY_HIER

    # Optional: Der Port, auf dem der Node.js-Server laufen soll (Standard: 3000)
    PORT=3000
    ```
    Speichern und schließen Sie die Datei (`STRG+X`, dann `J`, dann `Enter`).

## 4. Wichtige Code-Anpassung (Nur bei Neuinstallation)

Damit der Server im Produktivbetrieb die korrekten Dateien ausliefert, muss die Datei `server.mjs` angepasst werden. Der Express-Server muss die Frontend-Dateien aus dem `dist`-Verzeichnis bereitstellen, das beim Build-Prozess erstellt wird.

**Stellen Sie sicher, dass die folgenden zwei Bereiche in `server.mjs` so aussehen:**

1.  **Static File Middleware**:
    ```javascript
    // Stellt die statischen Dateien (HTML, CSS, JS) aus dem 'dist'-Verzeichnis bereit.
    app.use(express.static(path.join(__dirname, 'dist')));
    ```

2.  **Fallback-Route**:
    ```javascript
    // ... wird auf die index.html umgeleitet. Dies ist wichtig für clientseitiges Routing.
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
    ```

## 5. Deployment im Produktivbetrieb

### Teil A: Nginx als Reverse-Proxy einrichten

1.  **Seite aktivieren**: Erstellen Sie einen symbolischen Link zur Konfiguration im `sites-enabled`-Verzeichnis.
    ```bash
    sudo ln -s /etc/nginx/sites-available/aiprompt /etc/nginx/sites-enabled/
    ```

2.  **Konfiguration testen**: Überprüfen Sie die Nginx-Konfiguration auf Syntaxfehler.
    ```bash
    sudo nginx -t
    ```

3.  **Nginx neu starten**: Wenn der Test erfolgreich war, laden Sie die Konfiguration neu.
    ```bash
    sudo systemctl restart nginx
    ```

### Teil B: Anwendung mit PM2 starten

1.  **Anwendung starten**: Führen Sie den folgenden Befehl aus dem Projektverzeichnis (`/var/www/html/aiprompt`) aus.
    ```bash
    pm2 start npm --name aiprompt -- run start
    ```
    *Dieser Befehl tut zwei Dinge: Er führt `npm run build` aus, um das Frontend zu kompilieren, und startet dann den `server.mjs`.*

2.  **Autostart einrichten**: Damit die Anwendung nach einem Neustart des Servers automatisch startet, führen Sie folgende Befehle aus:
    ```bash
    pm2 startup
    ```
    *(Führen Sie den Befehl aus, den `pm2` Ihnen als Ausgabe anzeigt)*
    ```bash
    pm2 save
    ```

## 6. Nützliche PM2-Befehle

- **Status anzeigen**: `pm2 status`
- **Logs ansehen**: `pm2 logs aiprompt`
- **Anwendung neustarten**: `pm2 restart aiprompt`
- **Anwendung stoppen**: `pm2 stop aiprompt`
- **Anwendung aus PM2 entfernen**: `pm2 delete aiprompt`
