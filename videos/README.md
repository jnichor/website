# Video Marketing — Causal AI Digital

Pipeline para generar el video de marketing de 30 segundos.

## Estructura

```
videos/
├── video-marketing-services.html       ← El slideshow self-playing (lo que se graba)
├── record_video.py                     ← Orquestador: Playwright + FFmpeg
├── causal-ai-digital-logo.png          ← Logo (ya copiado)
├── voiceover.mp3                       ← TÚ generas esto en ElevenLabs (paso 2)
├── music.mp3                           ← TÚ descargas esto de YouTube Audio Library (paso 3)
├── marketing-raw.webm                  ← Output intermedio silencioso (auto-generado)
└── causal-ai-digital-marketing.mp4     ← VIDEO FINAL (auto-generado)
```

## Setup (una sola vez)

```bash
pip install playwright
python -m playwright install chromium
```

FFmpeg debe estar instalado:
- Windows: descarga de https://www.gyan.dev/ffmpeg/builds/ y añade al PATH
- Mac: `brew install ffmpeg`
- Linux: `apt install ffmpeg`

## Workflow completo (4 pasos)

### Paso 1: Genera la voz off en ElevenLabs

1. Ve a https://elevenlabs.io → registrate (free, sin tarjeta)
2. Voice Library → busca y selecciona **"Mateo"** (LATAM masculino conversacional)
3. Text to Speech → pega este script:

```
Hay webs que se ven.

Hay webs que se sienten.

Y hay webs que venden por ti.

Aprenden de cada visita.
De cada clic.

Cada web que diseñamos viene con un chatbot
que conoce todos tus productos
y atiende a tu cliente
siempre.

Diseño que enamora.
Inteligencia que vende.

Causal AI Digital.
```

4. Settings recomendados:
   - Stability: **70%**
   - Clarity + Similarity: **75%**
   - Style Exaggeration: **15%**
   - Speaker Boost: **ON**

5. Click Generate, escucha. Si te gusta, Download como MP3.
6. Guarda el archivo como **`voiceover.mp3`** en esta carpeta `videos/`.

### Paso 2: Descarga música de fondo

1. Ve a YouTube Studio → Audio Library (https://studio.youtube.com/channel/UC.../music)
2. Filtra por: **Genre → Ambient o Cinematic** + **Mood → Inspirational** + **Duration → 30 sec - 1 min**
3. Tracks recomendados para tono cinematográfico Apple keynote:
   - "Inspiring Cinematic Ambient" (cualquier track ambient lento)
   - Busca por keywords: "ambient", "minimal", "cinematic", "tech"
4. Descarga el MP3
5. Guarda como **`music.mp3`** en esta carpeta `videos/`.

> **Tip**: si la música tiene un beat fuerte, va a competir con la voz. Para este tono cinematográfico necesitas algo PADS o ambient sin percusión marcada.

### Paso 3: Verifica que tu sitio esté online

El HTML hace un `<iframe>` a `https://website-pi-seven-28.vercel.app/`. Si ese deploy está caído o cambió de URL:
- Edita `video-marketing-services.html` línea ~210
- Cambia el `src` del iframe por tu URL actual

### Paso 4: Graba el video

```bash
cd c:/Users/Jesus/OneDrive/Desktop/website
python videos/record_video.py
```

Verás:
```
Recording video for 32 seconds...
Raw video: ...marketing-raw.webm
Muxing audio (voice 100% + music 18%)...
[OK] Final video: ...causal-ai-digital-marketing.mp4
```

Tarda **~35-40 segundos** total (32s de grabación + ~5s de FFmpeg encoding).

## Output

El archivo final `causal-ai-digital-marketing.mp4`:

| Property | Value |
|---|---|
| Resolución | 1080×1080 (cuadrado) |
| Frame rate | 25 fps |
| Codec video | H.264 |
| Codec audio | AAC 192kbps |
| Pixel format | yuv420p (compatible con todas las plataformas) |
| Duración | ~30 segundos |
| Tamaño | ~3-5 MB |

Listo para subir a:
- LinkedIn (mejor formato cuadrado)
- Instagram feed (1:1 nativo)
- Twitter/X (autoplay)
- Facebook
- WhatsApp Status

Para Reels/TikTok/Shorts (9:16), corre el video por CapCut con auto-reframe.

## Iteración rápida

Si quieres cambiar algo del video:

| Cambio | Editar |
|---|---|
| Texto de las slides | `video-marketing-services.html` (busca los `<h1>`) |
| Duración de cada slide | `video-marketing-services.html` (busca `data-duration="..."`) |
| Voz off | Re-generar en ElevenLabs y reemplazar `voiceover.mp3` |
| Música | Reemplazar `music.mp3` |
| URL del demo | Línea ~210 del HTML, atributo `src` del iframe |
| Volumen música | `record_video.py` línea con `volume=0.18` (sube/baja según sea necesario) |

Después de cualquier cambio, vuelve a correr `python videos/record_video.py` y MP4 actualizado.

## Troubleshooting

**El iframe del demo sale en blanco**:
- Tu sitio puede tener `X-Frame-Options: DENY` o `Content-Security-Policy` que bloquea iframes
- Solución: en tu `next.config.ts`, asegurarte de NO tener `X-Frame-Options: 'DENY'`. Por defecto Vercel permite iframes propios.
- Alternativa: hacer screen-recording manual del sitio y embeber como `<video>` en lugar de iframe

**ElevenLabs pronuncia "Causal AI Digital" raro**:
- Cambia el script a: `Causal A.I. Digital.` (con puntos, fuerza deletreo)
- O escribe fonético: `Causal Ei Ai Digital.`

**FFmpeg no encuentra ffmpeg**:
- Edita `record_video.py` línea con `FFMPEG_PATH` y pon ruta absoluta
- Ejemplo Windows: `FFMPEG_PATH = r"C:\ffmpeg\bin\ffmpeg.exe"`

**El video sale negro**:
- Probablemente el iframe del demo tardó más en cargar de lo esperado
- Aumenta el `time.sleep(2.0)` en `record_video.py` a `4.0` (espera más antes de empezar a contar)
