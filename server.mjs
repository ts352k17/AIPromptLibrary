import 'dotenv/config';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Konfiguration ---
// Liest den API-Schlüssel aus den Umgebungsvariablen.
// Stellen Sie sicher, dass die Variable API_KEY gesetzt ist, bevor Sie den Server starten.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("FEHLER: Die Umgebungsvariable API_KEY wurde nicht gesetzt. Der Server kann nicht starten.");
  process.exit(1); // Beendet den Prozess, wenn der Schlüssel fehlt.
}

// Verwendet den PORT aus den Umgebungsvariablen oder standardmäßig 3000.
const PORT = process.env.PORT || 3000;

// --- Initialisierung ---
const app = express();
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Ermittelt den Pfad zum aktuellen Verzeichnis (wichtig für ES-Module).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
// Aktiviert das Parsen von JSON-Daten im Body von Anfragen (z.B. für POST).
app.use(express.json());
// Stellt die statischen Dateien (HTML, CSS, JS) aus dem 'dist'-Verzeichnis bereit.
app.use(express.static(path.join(__dirname, 'dist')));


// --- API-Route zur Bildgenerierung ---
app.post('/api/generate', async (req, res) => {
  // Extrahiert den 'prompt' aus dem Anfrage-Body.
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Ein "prompt" ist im Request-Body erforderlich.' });
  }

  try {
    console.log(`Generiere Bild für Prompt: "${prompt}"`);
    
    // Ruft die Gemini-API auf, um ein Bild zu generieren.
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        // Der Prompt wird optimiert, um bessere Miniaturbilder zu erhalten.
        prompt: `Erstelle ein visuell ansprechendes, abstraktes und stilisiertes Miniaturbild, das das folgende Konzept repräsentiert: "${prompt}"`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    // Prüft, ob die API erfolgreich Bilder zurückgegeben hat.
    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      // Erstellt eine Data-URL aus den Base64-kodierten Bilddaten.
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      
      console.log("Bild erfolgreich generiert.");
      // Sendet die Bild-URL als JSON-Antwort zurück.
      res.json({ imageUrl });
    } else {
      throw new Error("Die API hat keine Bilder zurückgegeben.");
    }
  } catch (error) {
    console.error("Fehler bei der Kommunikation mit der Gemini-API:", error);
    res.status(500).json({ error: 'Das Bild konnte nicht generiert werden.' });
  }
});

// --- Fallback-Route für die Single-Page-Application ---
// Jede GET-Anfrage, die nicht zu einer statischen Datei oder API-Route passt,
// wird auf die index.html umgeleitet. Dies ist wichtig für clientseitiges Routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// --- Server starten ---
app.listen(PORT, () => {
  console.log(`Server läuft und ist erreichbar unter http://localhost:${PORT}`);
});
